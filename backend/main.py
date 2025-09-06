from fastapi import FastAPI, HTTPException, Request, Header, Depends
from pydantic import BaseModel
import services
import config
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

app = FastAPI()
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
@limiter.limit("60/minute")  # 60 requests per minute per IP
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)