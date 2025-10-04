import os
from dotenv import load_dotenv

# Load environment variables from .env file (only in development)
if os.getenv("ENVIRONMENT", "development") == "development":
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# API Keys from environment variables
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
TELEGRAM_WEBHOOK_SECRET = os.getenv("TELEGRAM_WEBHOOK_SECRET")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

# Validate required environment variables
import sys
if not GOOGLE_API_KEY:
    print("ERROR: GOOGLE_API_KEY environment variable is required", file=sys.stderr)
    raise ValueError("GOOGLE_API_KEY environment variable is required")
if not TELEGRAM_WEBHOOK_SECRET:
    print("ERROR: TELEGRAM_WEBHOOK_SECRET environment variable is required", file=sys.stderr)
    raise ValueError("TELEGRAM_WEBHOOK_SECRET environment variable is required")
