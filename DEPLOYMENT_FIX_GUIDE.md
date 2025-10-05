# 🚨 DEPLOYMENT FIX GUIDE - Bot Not Working Issue

## Problem Summary

Your production deployment is missing the actual backend deployment. The frontend is trying to connect to a placeholder URL `https://your-backend.railway.app` which doesn't exist.

**Current Status:**
- ✅ Frontend deployed on Vercel: `https://bot-ai-psi.vercel.app`
- ❌ Backend NOT deployed (returns 404)
- ❌ All 4 bots have `is_active: false` in database
- ❌ Only Bot 1 has webhook (to local ngrok), others have no webhook

---

## 🔧 SOLUTION: Deploy Backend & Fix Configuration

### STEP 1: Deploy Backend to Render

**1.1 Go to Render Dashboard**
```
https://dashboard.render.com
```

**1.2 Create New Web Service**
- Click "New +" → "Web Service"
- Connect GitHub repository: `https://github.com/sonic00040/saasautomation`
- Select branch: `main` or `dev`

**1.3 Configure Service**
```
Name: botai-backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**1.4 Set Root Directory**
```
Root Directory: backend
```

**1.5 Add Environment Variables**

Click "Advanced" → "Add Environment Variable" and add these:

```bash
ENVIRONMENT=production
PYTHON_VERSION=3.12.8
LOG_LEVEL=INFO

# Required API Keys
GOOGLE_API_KEY=AIzaSyBEtgH1LswIm-A1Rfa0I6rQCDVAYOs80YE
SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI

# Security
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret_123

# URLs (will update BACKEND_URL after deployment)
BACKEND_URL=https://botai-backend-XXXX.onrender.com
FRONTEND_URL=https://bot-ai-psi.vercel.app
```

**1.6 Deploy**
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- **COPY YOUR BACKEND URL** (e.g., `https://botai-backend-xyz.onrender.com`)

**1.7 Update BACKEND_URL Environment Variable**
- After deployment, go back to Environment Variables
- Update `BACKEND_URL` with your actual Render URL
- Click "Save Changes" (will trigger redeploy)

**1.8 Verify Backend is Running**
```bash
curl https://YOUR-RENDER-URL.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "environment": "production",
  "timestamp": "2025-10-05T..."
}
```

---

### STEP 2: Update Frontend Environment Variables

**2.1 Go to Vercel Dashboard**
```
https://vercel.com/dashboard
```

**2.2 Select Your Project**
- Click on `bot-ai-psi` project
- Go to "Settings" → "Environment Variables"

**2.3 Update NEXT_PUBLIC_BACKEND_URL**
- Find `NEXT_PUBLIC_BACKEND_URL`
- Click "Edit"
- Change from: `https://your-backend.railway.app`
- Change to: `https://YOUR-ACTUAL-RENDER-URL.onrender.com`
- Save

**2.4 Redeploy Frontend**
- Go to "Deployments" tab
- Click "..." on latest deployment
- Click "Redeploy"
- Wait for deployment to complete

---

### STEP 3: Fix Existing Bots (Set Webhooks)

Now that backend is deployed, fix the existing 4 bots:

**3.1 Run Webhook Fix Script**

I've created a script for you. Run this:

```bash
cd /Users/macpro/Documents/botai
python3 fix_webhooks.py
```

**OR manually set webhooks:**

```bash
RENDER_URL="https://YOUR-RENDER-URL.onrender.com"

# Bot 1
curl -X POST "https://api.telegram.org/bot7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$RENDER_URL/webhook/7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY\"}"

# Bot 2 & 3 (same token)
curl -X POST "https://api.telegram.org/bot7532191997:AAHoAwwdmBxP55K7SU66SPNTGtcpl1jqJ0c/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$RENDER_URL/webhook/7532191997:AAHoAwwdmBxP55K7SU66SPNTGtcpl1jqJ0c\"}"

# Bot 4
curl -X POST "https://api.telegram.org/bot8274270708:AAGbrSg8FzN3JZ3WOpFMutIRA6PjhKcTb7Q/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$RENDER_URL/webhook/8274270708:AAGbrSg8FzN3JZ3WOpFMutIRA6PjhKcTb7Q\"}"
```

**3.2 Verify Webhooks Are Set**

```bash
curl "https://api.telegram.org/bot7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY/getWebhookInfo"
```

Should show your Render URL, not ngrok.

---

### STEP 4: Update Database (Mark Bots Active)

Run this in Supabase SQL Editor:

```sql
-- Update bots to active status with correct webhook URLs
UPDATE bots
SET
  is_active = true,
  webhook_url = 'https://YOUR-RENDER-URL.onrender.com/webhook/' || token
WHERE token IN (
  '7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY',
  '7532191997:AAHoAwwdmBxP55K7SU66SPNTGtcpl1jqJ0c',
  '8274270708:AAGbrSg8FzN3JZ3WOpFMutIRA6PjhKcTb7Q'
);

-- Verify
SELECT name, is_active, webhook_url FROM bots;
```

---

### STEP 5: Test Everything

**5.1 Test Existing Bots**
- Open Telegram
- Message each bot
- Verify they respond with AI-generated answers

**5.2 Test New Account Creation**
- Go to `https://bot-ai-psi.vercel.app/auth/signup`
- Create new test account
- Complete onboarding with new bot token
- Verify:
  - Bot is created
  - Webhook is auto-set to Render URL
  - Bot is marked `is_active: true`
  - Bot responds to messages

**5.3 Verify Token Usage Tracking**
- Send messages to bot
- Refresh dashboard
- Check that token usage increases

---

## 📋 Quick Checklist

- [ ] Backend deployed to Render
- [ ] `/health` endpoint returns 200
- [ ] Vercel env var `NEXT_PUBLIC_BACKEND_URL` updated
- [ ] Frontend redeployed on Vercel
- [ ] All 4 existing bots have webhooks set to Render URL
- [ ] Database updated: bots marked `is_active: true`
- [ ] Test: existing bots respond to messages
- [ ] Test: new account creation auto-sets webhook
- [ ] Test: token usage tracking works

---

## 🐛 Troubleshooting

### Backend returns 500 error
- Check Render logs for missing environment variables
- Verify `GOOGLE_API_KEY` is set correctly
- Verify `TELEGRAM_WEBHOOK_SECRET` is set

### Webhook setup fails
- Verify `NEXT_PUBLIC_BACKEND_URL` in Vercel matches your Render URL
- Check browser console for errors
- Verify Render backend is accessible (not cold-started)

### Bot doesn't respond
- Check webhook is set: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Check Render logs for incoming requests
- Verify bot token is correct in database

### "No active subscription" error
- Run in Supabase SQL Editor:
```sql
SELECT * FROM subscriptions WHERE is_active = true;
```
- If empty, you need to create subscriptions for existing companies

---

## 🎯 After Fix

Once complete, your architecture will be:

```
Frontend (Vercel)
    ↓
    ↓ NEXT_PUBLIC_BACKEND_URL
    ↓
Backend (Render) ← Telegram API sends webhook here
    ↓
    ↓ SUPABASE_URL
    ↓
Database (Supabase)
```

All new accounts created will automatically:
1. Create bot in database
2. Call Render backend to set webhook
3. Activate bot
4. Start responding to messages

---

**Questions?** Check Render logs and Vercel deployment logs for detailed error messages.
