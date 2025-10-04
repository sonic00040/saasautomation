# 🔧 Render Deployment Setup (Backend)

This guide shows you how to deploy your **FastAPI backend** to Render using GitHub integration.

**Time**: ~5 minutes
**Cost**: $0 (Free tier with cold starts)

---

## 📋 Prerequisites

- ✅ GitHub repository: `https://github.com/sonic00040/saasautomation`
- ✅ Render account (sign up at https://render.com if you don't have one)
- ✅ Your API keys (Google AI, Supabase, Telegram)

---

## 🎯 Step 1: Deploy Backend as Blueprint

### 1.1 Go to Render Dashboard
- Visit https://render.com/dashboard
- Click **"New"** → **"Blueprint"**

### 1.2 Connect GitHub Repository
- If not connected, click **"Connect GitHub Account"**
- Grant Render access to your repositories
- Select repository: `sonic00040/saasautomation`
- Click **"Connect"**

### 1.3 Render Detects Configuration

Render will automatically detect `backend/render.yaml` and show:

```yaml
✅ Service: botai-backend
✅ Type: Web Service
✅ Runtime: Python
✅ Plan: Free
✅ Build Command: pip install -r requirements.txt
✅ Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 1.4 Apply Blueprint
- Review the detected configuration
- Click **"Apply"**
- Render creates the service (but doesn't deploy yet - needs env vars)

---

## 🔐 Step 2: Add Environment Variables

### 2.1 Navigate to Environment Settings
1. In Render Dashboard, click on **"botai-backend"** service
2. Go to **"Environment"** tab in left sidebar
3. Click **"Add Environment Variable"**

### 2.2 Add Required Variables

Add these environment variables one by one:

```bash
# ========== REQUIRED ==========

# Google AI Configuration
GOOGLE_API_KEY=AIzaSyBEtgH1LswIm-A1Rfa0I6rQCDVAYOs80YE

# Supabase Configuration
SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI

# Telegram Webhook Security
TELEGRAM_WEBHOOK_SECRET=your_secure_random_string_here_12345

# URLs (update FRONTEND_URL after Vercel deployment)
BACKEND_URL=https://botai-backend.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app

# ========== OPTIONAL ==========

# Application Settings
ENVIRONMENT=production
LOG_LEVEL=INFO
PORT=8000

# Redis (if you add Redis service later)
# REDIS_URL=redis://...
```

### 2.3 Generate Telegram Webhook Secret

If you don't have a webhook secret yet:

```bash
# Run this in your terminal to generate a secure random string
openssl rand -hex 32
# Copy the output and use it as TELEGRAM_WEBHOOK_SECRET
```

Or use any secure random string (at least 32 characters).

### 2.4 Save Variables
- Click **"Save Changes"** after adding all variables
- Render will automatically trigger a deployment

---

## 🚀 Step 3: First Deployment

### 3.1 Monitor Deployment
1. Go to **"Logs"** tab in Render Dashboard
2. Watch the deployment process:
   ```
   ==> Installing dependencies...
   ==> Building...
   ==> Starting service...
   ```

3. Wait ~3-5 minutes for first deployment ⏱️

### 3.2 Success Indicators

You'll see in logs:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
✅ Service is live!
```

### 3.3 Get Your Backend URL

After successful deployment:
- Your URL: `https://botai-backend.onrender.com`
- Copy this URL - you'll need it for frontend!

---

## 🔄 Step 4: Enable Auto-Deployments

**Good news**: Auto-deployments are already enabled via `render.yaml`! 🎉

```yaml
autoDeploy: true  # ← Already set in render.yaml
```

From now on:
```bash
git push origin main
# → Render detects changes in backend/ folder
# → Automatically rebuilds and redeploys
# → Takes ~3-5 minutes
# → You get email notification when done
```

---

## 🔧 Step 5: Update Frontend with Backend URL

Now that backend is deployed, update your frontend:

1. Go to **Vercel Dashboard** → Your Project
2. Navigate to **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_BACKEND_URL`
4. Update to: `https://botai-backend.onrender.com`
5. Save and **Redeploy** frontend

Your frontend can now communicate with backend! 🎉

---

## ✅ Step 6: Test Backend

### 6.1 Health Check
```bash
curl https://botai-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "environment": "production",
  "timestamp": "2025-10-04T..."
}
```

### 6.2 Root Endpoint
```bash
curl https://botai-backend.onrender.com/
```

Expected response:
```json
{
  "Hello": "World"
}
```

### 6.3 Test Telegram Webhook (with your bot)

1. Create a bot in your dashboard
2. Send a message to your Telegram bot
3. **First message after 15 min**: Takes ~60 seconds (cold start - normal on free tier)
4. **Subsequent messages**: Fast response (~2-3 seconds)
5. Check dashboard - token usage should increase ✅

---

## ⚠️ Important: Free Tier Cold Starts

### How It Works:
- ✅ Backend runs normally when active
- ⚠️ **Spins down after 15 minutes of inactivity**
- ⏱️ **Cold start takes 50-60 seconds** on next request
- ✅ Then runs fast again until next idle period

### What This Means for Your Telegram Bot:
```
User sends message after idle →
  Backend wakes up (60 seconds) →
  Bot responds →
  Subsequent messages are fast
```

### Optional: Prevent Cold Starts

Use a free ping service to keep backend awake:

**Free Ping Services**:
- **UptimeRobot**: https://uptimerobot.com (50 monitors free)
- **Cron-job.org**: https://cron-job.org (unlimited free)
- **Freshping**: https://www.freshworks.com/website-monitoring/

**Setup**:
1. Create account
2. Add HTTP monitor: `https://botai-backend.onrender.com/health`
3. Set interval: **Every 14 minutes**
4. This keeps backend awake 24/7

**Trade-off**: Uses ~1,700 hours/month (exceeds 750 free hours), but Render doesn't charge - service just pauses when limit reached.

---

## ✅ Verification Checklist

After deployment:

- [ ] Backend URL is live: `https://botai-backend.onrender.com`
- [ ] `/health` endpoint returns "healthy"
- [ ] Logs show "Uvicorn running" with no errors
- [ ] Frontend updated with backend URL
- [ ] Telegram bot responds to messages
- [ ] Dashboard shows token usage increasing

---

## 🐛 Troubleshooting

### Build Fails - Dependencies Error
**Check**: `backend/requirements.txt` exists and contains all packages

**Solution**:
```bash
cd backend
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements.txt"
git push
```

### Service Won't Start - Port Error
**Check**: Start command uses `$PORT` environment variable

**Solution**: Already configured in `render.yaml`:
```yaml
startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Telegram Bot Not Responding
**Possible causes**:
1. **Cold start**: Wait 60 seconds on first request after idle
2. **Webhook not set**: Check Telegram bot webhook
3. **Wrong environment variables**: Verify all keys are correct

**Debug**:
```bash
# Check webhook info
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

Should show: `"url": "https://botai-backend.onrender.com/webhook/..."`

### Database Connection Fails
**Check**:
1. `SUPABASE_URL` is correct
2. `SUPABASE_KEY` is correct (no extra spaces/newlines)
3. Supabase project is active (not paused)

**View Logs**:
Go to Render Dashboard → botai-backend → Logs to see detailed errors

---

## 📊 Render Free Tier Limits

Your free tier includes:

- ✅ **Instance Hours**: 750 hours/month (~31 days if always-on)
- ✅ **RAM**: 0.5 GB
- ✅ **CPU**: Shared
- ✅ **Bandwidth**: Unlimited (within fair use)
- ✅ **Build Minutes**: Unlimited
- ⚠️ **Cold Starts**: After 15 min inactivity
- ⚠️ **No Custom Domain**: (Upgrade for custom domain)

**When to Upgrade to Starter ($7/mo)**:
- Eliminate cold starts (always-on)
- Get 512 MB RAM (2x more)
- Better performance under load
- Priority support

---

## 🎉 Next Steps

1. ✅ **Backend Deployed** → You're here!
2. ⏮️ **Update Frontend** → Add backend URL to Vercel env vars
3. 🧪 **Test End-to-End** → Create bot, send message, check dashboard
4. 🔔 **Optional**: Set up ping service to prevent cold starts
5. 📊 **Monitor**: Check Render logs and Supabase usage

---

## 🔗 Useful Links

- **Render Dashboard**: https://render.com/dashboard
- **Your Service**: https://dashboard.render.com/web/botai-backend
- **Render Docs**: https://render.com/docs
- **Logs**: https://dashboard.render.com/web/botai-backend/logs
- **Environment Vars**: https://dashboard.render.com/web/botai-backend/env

---

**Questions?** Check the [Master Deployment Guide](../GITHUB_DEPLOYMENT.md) or Render documentation.

**Last Updated**: 2025-10-04
**Status**: ✅ Ready to Use
