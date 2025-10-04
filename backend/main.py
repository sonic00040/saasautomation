import sys
import os
# Add current directory to Python path for module imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException, Request, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import backend.services as services
import backend.config as config
from datetime import datetime
import hmac
import hashlib
import logging
from typing import Optional
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import redis

# Configure logging
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize rate limiter
try:
    redis_client = redis.from_url(config.REDIS_URL)
    limiter = Limiter(key_func=get_remote_address, storage_uri=config.REDIS_URL)
except Exception as e:
    logger.warning(f"Redis not available, using in-memory rate limiting: {e}")
    limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="BotAI Backend API",
    description="Backend API for BotAI chatbot platform",
    version="1.0.0"
)

# CORS configuration
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# In production, add your frontend domain
if config.ENVIRONMENT == "production":
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url:
        allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if config.ENVIRONMENT == "development" else allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Pydantic models for Telegram's incoming message structure
class Chat(BaseModel):
    id: int

class Message(BaseModel):
    chat: Chat
    text: str

class TelegramWebhookPayload(BaseModel):
    message: Message
    
    class Config:
        # Allow extra fields in case Telegram adds new ones
        extra = "allow"

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring and preventing cold starts"""
    return {
        "status": "healthy",
        "environment": config.ENVIRONMENT,
        "timestamp": datetime.utcnow().isoformat()
    }

def verify_telegram_webhook(request: Request, x_telegram_bot_api_secret_token: Optional[str] = Header(None)):
    """Verify that the request comes from Telegram using secret token validation"""
    if config.ENVIRONMENT == "development":
        # Skip validation in development mode
        return True
    
    if not x_telegram_bot_api_secret_token:
        logger.warning("Missing Telegram secret token header")
        raise HTTPException(status_code=401, detail="Missing authentication header")
    
    if x_telegram_bot_api_secret_token != config.TELEGRAM_WEBHOOK_SECRET:
        logger.warning("Invalid Telegram secret token")
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    
    return True

@app.post("/webhook/{telegram_bot_token}")
# @limiter.limit("60/minute")  # 60 requests per minute per IP - DISABLED for testing (Redis not running)
async def handle_webhook(
    telegram_bot_token: str,
    payload: TelegramWebhookPayload,
    request: Request,
    authenticated: bool = Depends(verify_telegram_webhook)
):
    try:
        logger.info(f"Received webhook for token: {telegram_bot_token[:10]}...")
        
        # 1. Extract chat_id and user message from the payload
        chat_id = payload.message.chat.id
        user_message = payload.message.text
        
        # Validate message content
        if not user_message or len(user_message.strip()) == 0:
            logger.warning(f"Empty message received from chat_id: {chat_id}")
            return {"status": "ignored", "detail": "Empty message"}
        
        # Sanitize and validate message length
        user_message = user_message.strip()
        if len(user_message) > 4000:  # Reasonable limit
            user_message = user_message[:4000]
            logger.warning(f"Message truncated for chat_id: {chat_id}")

        # 2. Identify the tenant
        company = services.get_company_by_token(telegram_bot_token)
        if not company:
            logger.error(f"Company not found for token: {telegram_bot_token[:10]}...")
            raise HTTPException(status_code=404, detail="Company not found")

        # 3. Get active subscription and plan details
        subscription = services.get_active_subscription(company['id'])
        if not subscription:
            error_msg = "Error: No active subscription found."
            services.send_telegram_message(telegram_bot_token, chat_id, error_msg)
            logger.error(f"No active subscription for company: {company['id']}")
            return {"status": "error", "detail": "No active subscription"}

        # 4. Get knowledge base
        knowledge_base = services.get_knowledge_base_content(company['id'])
        if not knowledge_base:
            error_msg = "Error: Knowledge base not found."
            services.send_telegram_message(telegram_bot_token, chat_id, error_msg)
            logger.error(f"No knowledge base for company: {company['id']}")
            return {"status": "error", "detail": "Knowledge base not found"}

        # 5. Generate AI response and count tokens
        ai_response, tokens_used = services.get_ai_response_and_count_tokens(user_message, knowledge_base)
        logger.info(f"Generated response using {tokens_used} tokens for company: {company['id']}")

        # 6. Check usage against the plan's limit
        plan = subscription['plans']
        start_date = subscription['start_date']
        end_date = subscription['end_date']
        
        current_usage = services.get_total_usage(subscription['id'], start_date, end_date)
        logger.info(f"Current usage: {current_usage}, Plan limit: {plan['token_limit']}")

        if current_usage + tokens_used > plan['token_limit']:
            limit_exceeded_message = "Sorry, I can't answer right now. The token limit for this billing period has been exceeded."
            services.send_telegram_message(telegram_bot_token, chat_id, limit_exceeded_message)
            logger.warning(f"Token limit exceeded for company: {company['id']}")
            return {"status": "error", "detail": "Token limit exceeded"}

        # 7. Record usage and send response
        services.record_usage(subscription['id'], tokens_used)
        services.send_telegram_message(telegram_bot_token, chat_id, ai_response)
        logger.info(f"Successfully processed message for company: {company['id']}")

        return {"status": "success"}
    
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}", exc_info=True)
        try:
            services.send_telegram_message(
                telegram_bot_token, 
                chat_id, 
                "Sorry, I'm experiencing technical difficulties. Please try again later."
            )
        except:
            pass  # Don't let telegram errors crash the whole handler
        
        raise HTTPException(status_code=500, detail="Internal server error")

# WhatsApp Webhook Placeholder
@app.post("/webhook/whatsapp/{business_phone}")
async def handle_whatsapp_webhook(
    business_phone: str,
    payload: dict,
    request: Request
):
    """
    WhatsApp webhook handler (placeholder for future implementation)

    Expected payload structure from WhatsApp Business API:
    - messages[0].from: sender phone
    - messages[0].text.body: message content
    - etc.
    """
    logger.info(f"WhatsApp webhook received for {business_phone}")

    # TODO: Implement WhatsApp message handling
    # Similar flow to Telegram but with WhatsApp-specific logic
    # 1. Extract sender phone and message from payload
    # 2. Identify company by business_phone
    # 3. Get subscription and knowledge base
    # 4. Generate AI response
    # 5. Send response via WhatsApp Business API

    return {
        "status": "whatsapp_ready",
        "message": "WhatsApp integration coming soon",
        "business_phone": business_phone
    }

# Webhook Setup Endpoint
@app.post("/api/webhooks/setup")
async def setup_webhook(
    platform: str,
    bot_token: Optional[str] = None,
    business_phone: Optional[str] = None
):
    """
    Automatically sets webhook for production environment
    Development: Returns webhook URL for manual setup
    """
    import os
    import requests

    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    environment = os.getenv("ENVIRONMENT", "development")

    if platform == "telegram":
        if not bot_token:
            raise HTTPException(status_code=400, detail="bot_token is required for Telegram")

        webhook_url = f"{backend_url}/webhook/{bot_token}"

        if environment == "production":
            # Auto-set Telegram webhook
            try:
                telegram_api = f"https://api.telegram.org/bot{bot_token}/setWebhook"
                response = requests.post(telegram_api, json={
                    "url": webhook_url,
                    "secret_token": config.TELEGRAM_WEBHOOK_SECRET if hasattr(config, 'TELEGRAM_WEBHOOK_SECRET') else None
                })

                if response.status_code == 200:
                    logger.info(f"Webhook set successfully for Telegram bot: {bot_token[:10]}...")
                    return {
                        "status": "success",
                        "webhook_url": webhook_url,
                        "environment": environment
                    }
                else:
                    raise HTTPException(status_code=500, detail=f"Failed to set webhook: {response.text}")

            except Exception as e:
                logger.error(f"Error setting Telegram webhook: {str(e)}")
                raise HTTPException(status_code=500, detail=str(e))
        else:
            # Development: Return URL for manual setup
            return {
                "status": "manual",
                "webhook_url": webhook_url,
                "environment": environment,
                "instructions": "Set this webhook manually using @BotFather or Telegram API"
            }

    elif platform == "whatsapp":
        if not business_phone:
            raise HTTPException(status_code=400, detail="business_phone is required for WhatsApp")

        webhook_url = f"{backend_url}/webhook/whatsapp/{business_phone}"

        # WhatsApp webhooks must be configured in Meta Business Suite
        return {
            "status": "manual",
            "webhook_url": webhook_url,
            "environment": environment,
            "note": "Configure this webhook in Meta Business Suite > WhatsApp > Configuration > Webhooks"
        }

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)