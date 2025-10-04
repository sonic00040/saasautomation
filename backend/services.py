import google.generativeai as genai
import requests
from backend.database import supabase
from backend import config
from datetime import datetime
import logging
import time
from typing import Optional, Dict, Any
from supabase import PostgrestAPIError

logger = logging.getLogger(__name__)

genai.configure(api_key=config.GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')  # Fixed: Updated to working Gemini model

def send_telegram_message(token: str, chat_id: int, text: str, retries: int = 3) -> bool:
    """Sends a message to a Telegram user with retry logic."""
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text[:4096]  # Telegram message limit
    }
    
    for attempt in range(retries):
        try:
            response = requests.post(url, json=payload, timeout=30)
            if response.status_code == 200:
                logger.info(f"Successfully sent message to chat_id {chat_id}")
                return True
            elif response.status_code == 429:  # Rate limit
                retry_after = int(response.headers.get('Retry-After', 1))
                logger.warning(f"Rate limited, waiting {retry_after} seconds")
                time.sleep(retry_after)
                continue
            else:
                logger.error(f"Telegram API error: {response.status_code} - {response.text}")
                if attempt < retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
        except requests.RequestException as e:
            logger.error(f"Request error sending message (attempt {attempt + 1}): {e}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
    
    logger.error(f"Failed to send message after {retries} attempts")
    return False

def get_company_by_token(token: str) -> Optional[Dict[Any, Any]]:
    """Fetches a company from the database based on the Telegram token."""
    try:
        response = supabase.table('companies').select('*').eq('telegram_bot_token', token).maybe_single().execute()
        return response.data
    except PostgrestAPIError as e:
        logger.error(f"Database error fetching company: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching company: {e}")
        return None

def get_active_subscription(company_id: str) -> Optional[Dict[Any, Any]]:
    """Fetches the active subscription for a given company."""
    try:
        response = supabase.table('subscriptions').select('*, plans(*)').eq('company_id', company_id).eq('is_active', True).maybe_single().execute()
        return response.data
    except PostgrestAPIError as e:
        logger.error(f"Database error fetching subscription for company {company_id}: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error fetching subscription: {e}")
        return None

def get_knowledge_base_content(company_id: str) -> str:
    """Fetches and concatenates the knowledge base content for a given company."""
    try:
        response = supabase.table('knowledge_bases').select('content').eq('company_id', company_id).execute()
        if not response.data:
            logger.warning(f"No knowledge base content found for company: {company_id}")
            return ""
        return " ".join([item['content'] for item in response.data if item.get('content')])
    except PostgrestAPIError as e:
        logger.error(f"Database error fetching knowledge base for company {company_id}: {e}")
        return ""
    except Exception as e:
        logger.error(f"Unexpected error fetching knowledge base: {e}")
        return ""

def get_total_usage(subscription_id: str, start_date: str, end_date: str) -> int:
    """Calls the get_total_usage database function."""
    try:
        response = supabase.rpc('get_total_usage', {
            'p_subscription_id': subscription_id,
            'p_start_date': start_date,
            'p_end_date': end_date
        }).execute()
        return response.data if response.data is not None else 0
    except PostgrestAPIError as e:
        logger.error(f"Database error getting usage for subscription {subscription_id}: {e}")
        return 0
    except Exception as e:
        logger.error(f"Unexpected error getting usage: {e}")
        return 0

def record_usage(subscription_id: str, tokens_used: int) -> bool:
    """Records token usage in the usage_logs table."""
    try:
        supabase.table('usage_logs').insert({
            'subscription_id': subscription_id,
            'total_tokens': tokens_used  # Fixed: Use 'total_tokens' column name from database
        }).execute()
        logger.info(f"Recorded {tokens_used} tokens for subscription {subscription_id}")
        return True
    except PostgrestAPIError as e:
        logger.error(f"Database error recording usage: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error recording usage: {e}")
        return False

def generate_ai_response(user_message: str, knowledge_base: str, retries: int = 3) -> str:
    """Generates a response using the AI model and knowledge base with retry logic."""
    prompt = f"""
    You are a customer support agent. Your responses must be helpful, friendly, and professional.
    Use the following knowledge base to answer the user's question.
    If the answer is not in the knowledge base, state that you don't have that information and provide the company's support contact details from the knowledge base.

    Knowledge Base:
    ---
    {knowledge_base}
    ---

    User's Question:
    ---
    {user_message}
    ---

    Answer:
    """
    
    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)
            if response.text:
                return response.text
            else:
                logger.warning(f"Empty response from AI model (attempt {attempt + 1})")
        except Exception as e:
            logger.error(f"AI generation error (attempt {attempt + 1}): {e}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
    
    # Fallback response
    return "I'm sorry, I'm experiencing technical difficulties right now. Please try again later or contact support."

def get_ai_response_and_count_tokens(user_message: str, knowledge_base: str) -> (str, int):
    """Gets the AI response and counts the total tokens used."""
    response_text = generate_ai_response(user_message, knowledge_base)
    
    # Count tokens for both prompt and response
    try:
        prompt_tokens = model.count_tokens(user_message + knowledge_base).total_tokens
        response_tokens = model.count_tokens(response_text).total_tokens
        total_tokens = prompt_tokens + response_tokens
    except Exception as e:
        logger.error(f"Error counting tokens: {e}")
        # Fallback estimation: ~4 characters per token
        total_tokens = (len(user_message) + len(knowledge_base) + len(response_text)) // 4
    
    return response_text, total_tokens