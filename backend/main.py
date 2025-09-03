from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from . import services
from datetime import datetime

app = FastAPI()

# Pydantic models for Telegram's incoming message structure
class Chat(BaseModel):
    id: int

class Message(BaseModel):
    chat: Chat
    text: str

class TelegramWebhookPayload(BaseModel):
    message: Message

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/webhook/{telegram_bot_token}")
async def handle_webhook(telegram_bot_token: str, payload: TelegramWebhookPayload):
    # 1. Extract chat_id and user message from the payload
    chat_id = payload.message.chat.id
    user_message = payload.message.text

    # 2. Identify the tenant
    company = services.get_company_by_token(telegram_bot_token)
    if not company:
        # If company not found, we can't send a message back because we don't have a chat_id
        # In a real app, you might want to log this for debugging
        raise HTTPException(status_code=404, detail="Company not found")

    # 3. Get active subscription and plan details
    subscription = services.get_active_subscription(company['id'])
    if not subscription:
        services.send_telegram_message(telegram_bot_token, chat_id, "Error: No active subscription found.")
        return {"status": "error", "detail": "No active subscription"}

    # 4. Get knowledge base
    knowledge_base = services.get_knowledge_base_content(company['id'])
    if not knowledge_base:
        services.send_telegram_message(telegram_bot_token, chat_id, "Error: Knowledge base not found.")
        return {"status": "error", "detail": "Knowledge base not found"}

    # 5. Generate AI response and count tokens
    ai_response, tokens_used = services.get_ai_response_and_count_tokens(user_message, knowledge_base)

    # 6. Check usage against the plan's limit
    plan = subscription['plans']
    start_date = subscription['start_date']
    end_date = subscription['end_date']
    
    current_usage = services.get_total_usage(subscription['id'], start_date, end_date)

    if current_usage + tokens_used > plan['token_limit']:
        limit_exceeded_message = "Sorry, I can't answer right now. The token limit for this billing period has been exceeded."
        services.send_telegram_message(telegram_bot_token, chat_id, limit_exceeded_message)
        return {"status": "error", "detail": "Token limit exceeded"}

    # 7. Record usage and send response
    services.record_usage(subscription['id'], tokens_used)
    services.send_telegram_message(telegram_bot_token, chat_id, ai_response)

    return {"status": "success"}
