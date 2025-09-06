# Setup Instructions

## Prerequisites
- Python 3.8+
- PostgreSQL (via Supabase)
- Redis (optional, for production rate limiting)

## Installation Steps

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Setup:**
   - Copy `.env.template` to `.env`
   - Fill in your actual API keys and configuration values
   - Set `TELEGRAM_WEBHOOK_SECRET` to a secure random string

3. **Database Setup:**
   ```bash
   # Run the main schema
   psql -h your-supabase-host -U postgres -d postgres -f phase1_schema.sql
   
   # Add performance indexes
   psql -h your-supabase-host -U postgres -d postgres -f performance_indexes.sql
   ```

4. **Redis Setup (Production):**
   ```bash
   # Install Redis
   brew install redis  # macOS
   # or
   sudo apt install redis-server  # Ubuntu
   
   # Start Redis
   redis-server
   ```

5. **Run the Application:**
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Security Improvements Applied

✅ **Environment Variables**: All secrets moved to `.env` file
✅ **Webhook Authentication**: Telegram secret token validation
✅ **Input Validation**: Message length limits and sanitization
✅ **Error Handling**: Comprehensive try-catch blocks with logging
✅ **Rate Limiting**: 60 requests/minute per IP address
✅ **API Retry Logic**: Exponential backoff for external APIs
✅ **Database Indexes**: Performance optimizations for frequent queries
✅ **Logging**: Structured logging with correlation tracking

## Configuration Options

### Environment Variables
- `ENVIRONMENT`: Set to `production` to enable strict webhook validation
- `LOG_LEVEL`: DEBUG, INFO, WARNING, ERROR
- `REDIS_URL`: Redis connection string (defaults to localhost)

### Rate Limiting
- Default: 60 requests per minute per IP
- Can be adjusted in `main.py` limiter decorator
- Automatic fallback to in-memory limiting if Redis unavailable

### Database Performance
- Indexes automatically created for:
  - Company token lookups
  - Active subscription queries
  - Usage log aggregations
  - Knowledge base searches

## Testing
1. Set `ENVIRONMENT=development` in `.env` to skip webhook validation
2. Use ngrok or similar for local webhook testing
3. Monitor logs for debugging information