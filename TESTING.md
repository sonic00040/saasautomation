# BotAI Telegram Bot - Testing Guide

Complete guide for testing your TechNova Electronics Telegram bot.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Database Setup](#database-setup)
4. [Automated Testing](#automated-testing)
5. [Manual Testing](#manual-testing)
6. [Sample Test Queries](#sample-test-queries)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### ✅ Required Setup

Before testing, ensure you have:

- [x] **Supabase Database Active**
  - Project unpaused at: https://supabase.com/dashboard/project/rjvvkfecdrdxmnxwiuto
  - Database responding to API calls

- [x] **Database Schema Created**
  - Run `supabase-schema.sql` in Supabase SQL Editor
  - Run `supabase-functions.sql` in Supabase SQL Editor
  - Run `supabase-rls.sql` in Supabase SQL Editor

- [x] **Environment Variables Configured**
  - `.env` file exists with:
    - `SUPABASE_URL`
    - `SUPABASE_KEY`
    - `GOOGLE_API_KEY`
    - `TELEGRAM_WEBHOOK_SECRET`

- [x] **Python Dependencies Installed**
  ```bash
  pip3 install -r backend/requirements.txt
  ```

- [x] **Telegram Bot Token**
  - Create a bot via [@BotFather](https://t.me/botfather) on Telegram
  - Save the bot token for testing

---

## Quick Start

### 3 Simple Commands to Test Everything

```bash
# 1. Setup test data (run once)
python3 backend/setup_test_data.py

# 2. Run automated tests
python3 backend/test_bot.py

# 3. (Optional) Manual testing - see Manual Testing section
```

---

## Database Setup

### Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `rjvvkfecdrdxmnxwiuto`
3. Click **SQL Editor** in the left sidebar

### Step 2: Run Schema Scripts

Execute these SQL files in order:

#### 2.1. Create Tables
```sql
-- Copy contents of supabase-schema.sql and run
```
Creates tables:
- ✅ `companies` - Company/tenant information
- ✅ `plans` - Subscription plans
- ✅ `subscriptions` - Active subscriptions
- ✅ `bots` - Bot configurations
- ✅ `conversations` - Conversation tracking
- ✅ `activities` - Activity logs
- ✅ `knowledge_bases` - Knowledge content
- ✅ `usage_logs` - Token usage tracking

#### 2.2. Create Functions
```sql
-- Copy contents of supabase-functions.sql and run
```
Creates functions:
- ✅ `get_total_usage()` - Calculate token usage
- ✅ `get_user_metrics()` - Dashboard metrics
- ✅ `ensure_user_company()` - Auto-create companies
- ✅ Other helper functions

#### 2.3. Enable Row Level Security
```sql
-- Copy contents of supabase-rls.sql and run
```
Enables:
- 🔒 User data isolation
- 🔒 Company-based access control
- 🔒 Authenticated-only access

### Step 3: Verify Schema

Check that tables exist:

```bash
curl -s -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  "https://rjvvkfecdrdxmnxwiuto.supabase.co/rest/v1/companies?limit=1"
```

Expected: Valid JSON response (empty array `[]` is OK)
Error: `{"code":"PGRST205"...}` means tables don't exist

---

## Automated Testing

### Setup Test Data

This script creates TechNova Electronics test company with knowledge base:

```bash
python3 backend/setup_test_data.py
```

**What it does:**
1. ✅ Checks database connection
2. ✅ Creates "Pro Plan" subscription plan (50,000 tokens/month)
3. ✅ Creates TechNova Electronics company
4. ✅ Creates 30-day active subscription
5. ✅ Adds complete TechNova knowledge base content

**You will be prompted for:**
- Your Telegram Bot Token (from @BotFather)

**Output:**
```
🎉 Setup Complete!

📋 Test Configuration Summary:
  Company ID:        abc123...
  Plan ID:           def456...
  Subscription ID:   ghi789...
  Knowledge Base ID: jkl012...
  Telegram Token:    1234567890:ABC...
```

**Save this information for testing!**

### Run Automated Tests

Comprehensive test suite that validates the entire bot flow:

```bash
python3 backend/test_bot.py
```

**Tests performed:**

| # | Test | What it checks |
|---|------|----------------|
| 1 | Database Connection | Supabase is accessible |
| 2 | Company Data | TechNova company exists with token |
| 3 | Subscription | Active subscription with token limit |
| 4 | Knowledge Base | TechNova content is loaded |
| 5-9 | Webhook Simulation | Bot responds to customer queries |
| 10 | Token Usage | Usage is tracked in database |

**Sample Output:**

```
✅ PASS: Database Connection
✅ PASS: Company Exists
✅ PASS: Active Subscription
✅ PASS: Knowledge Base Exists
⚠️  Tests 5-9 require backend server running

Test Summary
Total Tests:  10
Passed:       10
Failed:       0

Success Rate: 100.0%
```

**Test Results File:**
- Results saved to `test_results.json`
- Contains detailed pass/fail info for each test
- Includes timestamps and error messages

---

## Manual Testing

Test with a real Telegram bot and live messages.

### Prerequisites
- ✅ Test data created (`setup_test_data.py` completed)
- ✅ ngrok installed (`brew install ngrok` or download from ngrok.com)

### Step 1: Start Backend Server

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

Keep this terminal open!

### Step 2: Expose Server with ngrok

Open a new terminal:

```bash
ngrok http 8000
```

**Expected output:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:8000
```

**Copy the `https://` URL** - you'll need it for the webhook.

### Step 3: Set Telegram Webhook

```bash
python3 backend/set_telegram_webhook.py <YOUR_BOT_TOKEN> <NGROK_URL>
```

**Example:**
```bash
python3 backend/set_telegram_webhook.py 1234567890:ABC-DEF... https://abc123.ngrok.io
```

**Expected output:**
```
Setting webhook to: https://abc123.ngrok.io/webhook/1234567890:ABC-DEF...

Telegram API Response:
{'ok': True, 'result': True, 'description': 'Webhook was set'}

✅ Webhook set successfully!
Your bot is now live and will send messages to your backend.
```

### Step 4: Test with Real Messages

1. **Open Telegram** and search for your bot (the username you set with @BotFather)
2. **Start a conversation** by clicking "Start" or sending `/start`
3. **Send test questions** (see [Sample Test Queries](#sample-test-queries))
4. **Watch the backend logs** in your terminal for processing details

**What to check:**
- ✅ Bot responds within a few seconds
- ✅ Responses contain TechNova-specific information
- ✅ No error messages in backend logs
- ✅ Token usage is logged in database

### Step 5: Verify Token Usage

Check that usage is being tracked:

```bash
# Use Supabase SQL Editor or this curl command
curl -H "apikey: YOUR_SUPABASE_KEY" \
  "https://rjvvkfecdrdxmnxwiuto.supabase.co/rest/v1/usage_logs?select=*"
```

You should see entries with `total_tokens` values.

---

## Sample Test Queries

Send these questions to your Telegram bot to test different aspects of the knowledge base:

### 1. Shipping & Delivery
```
What are your shipping times to Dubai?
```
**Expected response includes:**
- "5-10 working days" for international shipping
- Mentions DHL, FedEx, or UPS tracking
- Shipping timelines for different regions

### 2. Payment Methods
```
Do you accept cryptocurrency payments?
```
**Expected response includes:**
- "Bitcoin" and "Ethereum"
- Other payment methods (Visa, PayPal, M-Pesa)
- Information about corporate billing options

### 3. Warranty Policy
```
What is your warranty policy on laptops?
```
**Expected response includes:**
- "12-month warranty" for TechNova-branded products
- Manufacturer's warranty for third-party brands
- Extended protection plan options
- Coverage for accidental damage

### 4. Customer Support
```
How can I contact customer support?
```
**Expected response includes:**
- "24/7" support availability
- Contact channels: WhatsApp, Telegram, email, hotline
- Languages supported: English, French, Arabic, Swahili
- Corporate account manager info

### 5. Returns & Exchanges
```
Can I return a product if I change my mind?
```
**Expected response includes:**
- "14-day return policy"
- Requirements: unused, original packaging
- Exchange options
- Size exchange information

### 6. Product Categories
```
What products do you sell?
```
**Expected response includes:**
- Smartphones, laptops, smartwatches
- Gaming consoles, audio equipment
- TechNova™ branded devices
- Home appliances and accessories

### 7. Company Information
```
Where is TechNova located?
```
**Expected response includes:**
- Headquarters: Nairobi, Kenya
- Regional offices: Dubai, Berlin, Johannesburg
- Logistics hubs: Mombasa, Cape Town, London
- Since 2012 (13+ years operating)

### 8. E-commerce Platform
```
Can I order online?
```
**Expected response includes:**
- Website: www.technova.com
- Mobile app: TechNova Store (iOS/Android)
- Features: browse, track, invoices, loyalty programs

---

## Troubleshooting

### ❌ Database Connection Failed

**Error:** `Database connection failed: ...`

**Solutions:**
1. Check Supabase project is unpaused
2. Verify `.env` has correct `SUPABASE_URL` and `SUPABASE_KEY`
3. Run database schema scripts if tables don't exist
4. Test connection manually:
   ```bash
   curl -H "apikey: YOUR_KEY" "YOUR_SUPABASE_URL/rest/v1/"
   ```

### ❌ Company Not Found

**Error:** `TechNova company not found in database`

**Solutions:**
1. Run `python3 backend/setup_test_data.py`
2. Check if you deleted test data by mistake
3. Verify `companies` table exists in Supabase

### ❌ No Active Subscription

**Error:** `No active subscription found`

**Solutions:**
1. Run `python3 backend/setup_test_data.py` again
2. Check subscription `end_date` hasn't expired
3. Verify `is_active` is `true` in database

### ❌ Knowledge Base Not Found

**Error:** `No knowledge base found`

**Solutions:**
1. Run `python3 backend/setup_test_data.py`
2. Check `knowledge_bases` table in Supabase
3. Verify `company_id` matches your test company

### ❌ Webhook Connection Error

**Error:** `Cannot connect to backend server`

**Solutions:**
1. Make sure backend is running: `uvicorn main:app --reload --port 8000`
2. Check server logs for errors
3. Verify port 8000 is not blocked by firewall
4. Try accessing http://localhost:8000 in browser

### ❌ Bot Not Responding

**Symptoms:** Send message to Telegram bot, no response

**Solutions:**
1. Check backend server logs for errors
2. Verify webhook is set correctly:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
   ```
3. Make sure ngrok URL hasn't changed (it changes every restart)
4. Check `ENVIRONMENT=development` in `.env` to skip webhook secret validation
5. Verify bot token is correct in database

### ❌ Token Limit Exceeded

**Error:** `Token limit for this billing period has been exceeded`

**Solutions:**
1. Check current usage in `usage_logs` table
2. Increase plan token limit in database:
   ```sql
   UPDATE plans SET token_limit = 100000 WHERE name = 'Pro Plan - Test';
   ```
3. Create new subscription with higher limit
4. Reset usage logs (for testing only):
   ```sql
   DELETE FROM usage_logs WHERE subscription_id = 'YOUR_SUB_ID';
   ```

### ❌ AI Response Empty or Generic

**Symptoms:** Bot responds but doesn't use TechNova knowledge

**Solutions:**
1. Verify knowledge base content in database
2. Check that knowledge base `company_id` matches bot's company
3. Review Google Gemini API key is valid
4. Check backend logs for AI generation errors

### ❌ Import Errors

**Error:** `ModuleNotFoundError: No module named 'supabase'`

**Solutions:**
```bash
pip3 install -r backend/requirements.txt
```

Verify installation:
```bash
pip3 list | grep -E "(supabase|fastapi|google)"
```

---

## Advanced Testing

### Test Token Usage Limits

1. **Lower the token limit** in database:
   ```sql
   UPDATE plans SET token_limit = 100 WHERE name = 'Pro Plan - Test';
   ```

2. **Send multiple messages** to bot until limit is reached

3. **Verify limit enforcement:** Bot should respond with:
   > "Sorry, I can't answer right now. The token limit for this billing period has been exceeded."

4. **Check usage logs:**
   ```sql
   SELECT SUM(total_tokens) as total_used FROM usage_logs WHERE subscription_id = 'YOUR_SUB_ID';
   ```

### Test Rate Limiting

The backend has rate limiting (60 requests/minute per IP):

1. Send 60+ rapid requests to `/webhook/{token}`
2. Should receive HTTP 429 error after limit
3. Check backend logs for rate limit messages

### Monitor Real-time Activity

Watch backend logs in real-time:

```bash
cd backend
uvicorn main:app --reload --log-level debug
```

Send messages and watch processing:
- ✅ Incoming webhook requests
- ✅ Company identification
- ✅ Subscription validation
- ✅ Knowledge base retrieval
- ✅ AI response generation
- ✅ Token counting
- ✅ Usage recording

---

## Testing Checklist

Use this checklist to ensure complete testing:

### Setup Phase
- [ ] Supabase database unpaused and active
- [ ] Database schema created (3 SQL scripts run)
- [ ] Python dependencies installed
- [ ] `.env` file configured with valid credentials
- [ ] Telegram bot created via @BotFather

### Automated Testing
- [ ] `setup_test_data.py` completed successfully
- [ ] Test company created with Telegram token
- [ ] Active subscription created
- [ ] TechNova knowledge base loaded
- [ ] `test_bot.py` runs without errors
- [ ] All automated tests pass (10/10)

### Manual Testing
- [ ] Backend server starts without errors
- [ ] ngrok tunnel established
- [ ] Webhook set successfully
- [ ] Bot responds to `/start` command
- [ ] Bot answers shipping questions correctly
- [ ] Bot answers payment questions correctly
- [ ] Bot answers warranty questions correctly
- [ ] Bot answers support contact questions correctly
- [ ] Bot answers return policy questions correctly
- [ ] Token usage tracked in database
- [ ] No errors in backend logs

### Edge Cases
- [ ] Bot handles very long messages (truncation)
- [ ] Bot handles rapid messages (rate limiting)
- [ ] Bot handles unknown questions gracefully
- [ ] Bot enforces token limits correctly
- [ ] Bot works with expired subscription (error message)

---

## Support & Next Steps

### ✅ Everything Works!

**Congratulations!** Your bot is ready for production. Next steps:

1. **Deploy backend to production** (AWS, Heroku, DigitalOcean, etc.)
2. **Set permanent webhook** (no more ngrok restarts)
3. **Configure production environment variables**
4. **Monitor usage and performance**
5. **Add more knowledge base content**
6. **Create additional bots for different platforms**

### ❌ Still Having Issues?

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review backend logs for detailed error messages
3. Verify all prerequisites are met
4. Run `test_bot.py` to identify specific failures
5. Check `test_results.json` for detailed test output

### 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google Gemini API](https://ai.google.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

**Happy Testing! 🚀**
