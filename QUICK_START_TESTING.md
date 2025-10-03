# 🚀 Quick Start - Test Both Bots Now!

Test **UrbanStep Footwear** and **TechNova Electronics** bots simultaneously.

---

## ✅ Pre-Flight Check

Your system is ready:
- ✅ **2 Companies** configured in database
- ✅ **UrbanStep Footwear** - Shoes/footwear bot (`7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY`)
- ✅ **TechNova Electronics** - Electronics bot (`8096188813:AAFIxWRL1oQwSAtG3wVF1Fcl5BT297CwCGo`)
- ✅ **Active subscriptions** for both companies
- ✅ **Knowledge bases** loaded (UrbanStep 1.5KB, TechNova 3.3KB)
- ✅ **Backend dependencies** installed
- ✅ **Database** active and responding

---

## 🎯 3 Steps to Test

### **Terminal 1: Start Backend Server**

```bash
cd /Users/macpro/Documents/botai/backend
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ **Keep this terminal open!** This handles BOTH bots.

---

### **Terminal 2: Start ngrok**

Open a **NEW terminal** and run:

```bash
ngrok http 8000
```

**Expected output:**
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:8000
```

**📋 COPY the https:// URL** - you'll need it in the next step!

✅ **Keep this terminal open!**

---

### **Terminal 3: Set Webhooks (Automated)**

Open a **NEW terminal** and run:

```bash
cd /Users/macpro/Documents/botai
./backend/start_testing.sh
```

This script will:
1. ✅ Verify backend is running
2. ✅ Detect ngrok URL automatically
3. ✅ Set webhooks for BOTH bots
4. ✅ Show you test questions for each bot

**OR set webhooks manually:**

```bash
# Replace <NGROK_URL> with your URL from Terminal 2

# UrbanStep Footwear Bot
python3 backend/set_telegram_webhook.py 7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY <NGROK_URL>

# TechNova Electronics Bot
python3 backend/set_telegram_webhook.py 8096188813:AAFIxWRL1oQwSAtG3wVF1Fcl5BT297CwCGo <NGROK_URL>
```

---

## 💬 Now Test in Telegram!

### 🥾 **UrbanStep Footwear Bot**

Find your bot in Telegram and ask:

```
What products do you sell?
```
**Expected:** Should mention shoes, sneakers, sandals, footwear

```
What are your shipping times?
```
**Expected:** Should mention 1-3 days Ghana/Nigeria, 5-8 days international

```
What payment methods do you accept?
```
**Expected:** Should mention Visa, PayPal, Mobile Money, etc.

```
Where is your company located?
```
**Expected:** Should mention Accra (Ghana), Lagos (Nigeria), London (UK)

---

### 📱 **TechNova Electronics Bot**

Find your bot in Telegram and ask:

```
What products do you sell?
```
**Expected:** Should mention smartphones, laptops, smartwatches, gaming consoles

```
What are your shipping times to Dubai?
```
**Expected:** Should mention 5-10 days international, DHL/FedEx tracking

```
Do you accept cryptocurrency?
```
**Expected:** Should mention Bitcoin and Ethereum

```
What's your warranty policy?
```
**Expected:** Should mention 12-month warranty on TechNova products

```
Where is TechNova located?
```
**Expected:** Should mention Nairobi (Kenya), Dubai, Berlin, Johannesburg

---

## 🔍 What to Watch For

### ✅ Success Indicators

In **Terminal 1** (backend logs), you should see:

```
INFO: Received webhook for token: 7953941413...  # UrbanStep
INFO: Company found: UrbanStep Footwear Ltd
INFO: Generated response using 250 tokens
```

```
INFO: Received webhook for token: 8096188813...  # TechNova
INFO: Company found: TechNova Electronics Ltd
INFO: Generated response using 300 tokens
```

### ✅ Multi-Tenancy Working

- UrbanStep bot talks about **shoes and footwear**
- TechNova bot talks about **electronics and gadgets**
- No mixing of information between bots
- Each bot loads its own knowledge base
- Token usage tracked separately

### ❌ If Bot Doesn't Respond

1. **Check backend terminal** for errors
2. **Check ngrok terminal** - URL might have changed (restart if needed)
3. **Verify webhooks set**:
   ```bash
   curl "https://api.telegram.org/bot7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY/getWebhookInfo"
   curl "https://api.telegram.org/bot8096188813:AAFIxWRL1oQwSAtG3wVF1Fcl5BT297CwCGo/getWebhookInfo"
   ```
4. **Check `.env` file** has `ENVIRONMENT=development` (skips webhook secret validation)

---

## 📊 Verify Token Usage

After sending messages, check usage in database:

```bash
curl -s -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI" \
  "https://rjvvkfecdrdxmnxwiuto.supabase.co/rest/v1/usage_logs?select=subscription_id,total_tokens,created_at&order=created_at.desc&limit=10"
```

Should show token usage entries for both companies.

---

## 🎉 You're Testing Multi-Tenant AI Bots!

Both bots are running on the **same backend server**, but each:
- Uses its own knowledge base
- Tracks its own token usage
- Enforces its own subscription limits
- Maintains complete data isolation

This is the power of **multi-tenant SaaS architecture**! 🚀

---

## 🛑 When Done Testing

Stop the services:

1. **Terminal 1** (backend): Press `Ctrl+C`
2. **Terminal 2** (ngrok): Press `Ctrl+C`
3. **Terminal 3**: Close

---

## 📚 Need More Help?

- **Full Testing Guide**: [TESTING.md](TESTING.md)
- **Setup Test Data**: `python3 backend/setup_test_data.py`
- **Run Automated Tests**: `python3 backend/test_bot.py`
- **Troubleshooting**: See [TESTING.md](TESTING.md#troubleshooting)

---

**Happy Testing!** 🎊
