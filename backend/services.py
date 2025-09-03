import google.generativeai as genai
import requests
from .database import supabase
from . import config
from datetime import datetime

genai.configure(api_key=config.GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def send_telegram_message(token: str, chat_id: int, text: str):
    """Sends a message to a Telegram user."""
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text
    }
    requests.post(url, json=payload)

def get_company_by_token(token: str):
    """Fetches a company from the database based on the Telegram token."""
    response = supabase.table('companies').select('*').eq('telegram_bot_token', token).single().execute()
    return response.data

def get_active_subscription(company_id: str):
    """Fetches the active subscription for a given company."""
    response = supabase.table('subscriptions').select('*, plans(*)').eq('company_id', company_id).eq('is_active', True).single().execute()
    return response.data

def get_knowledge_base_content(company_id: str) -> str:
    """Fetches and concatenates the knowledge base content for a given company."""
    response = supabase.table('knowledge_bases').select('content').eq('company_id', company_id).execute()
    if not response.data:
        return ""
    return " ".join([item['content'] for item in response.data])

def get_total_usage(subscription_id: str, start_date: str, end_date: str) -> int:
    """Calls the get_total_usage database function."""
    response = supabase.rpc('get_total_usage', {
        'p_subscription_id': subscription_id,
        'p_start_date': start_date,
        'p_end_date': end_date
    }).execute()
    return response.data if response.data else 0

def record_usage(subscription_id: str, tokens_used: int):
    """Records token usage in the usage_logs table."""
    supabase.table('usage_logs').insert({
        'subscription_id': subscription_id,
        'total_tokens': tokens_used
    }).execute()

def generate_ai_response(user_message: str, knowledge_base: str) -> str:
    """Generates a response using the AI model and knowledge base."""
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
    response = model.generate_content(prompt)
    return response.text

def get_ai_response_and_count_tokens(user_message: str, knowledge_base: str) -> (str, int):
    """Gets the AI response and counts the total tokens used."""
    response_text = generate_ai_response(user_message, knowledge_base)
    
    # Count tokens for both prompt and response
    prompt_tokens = model.count_tokens(user_message + knowledge_base).total_tokens
    response_tokens = model.count_tokens(response_text).total_tokens
    total_tokens = prompt_tokens + response_tokens
    
    return response_text, total_tokens
