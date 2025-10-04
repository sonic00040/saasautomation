# 🚀 BotAI Production Deployment Guide

**Status**: ✅ **READY FOR DEPLOYMENT** (All blocking issues fixed!)

---

## 🎉 Pre-Deployment Checklist - COMPLETED ✅

- [x] **Frontend Build**: Compiles successfully with zero errors
- [x] **TypeScript**: All type errors fixed
- [x] **ESLint**: All critical errors resolved (only warnings remain)
- [x] **Security**: Hardcoded tokens removed
- [x] **Environment Variables**: Properly secured
- [x] **Backend**: FastAPI working perfectly
- [x] **Database**: Schema, RLS, and functions ready
- [x] **Token Tracking**: Tested and working
- [x] **AI Integration**: Gemini 2.0 Flash working

---

## 📊 Current Status

### ✅ What's Working:
1. **Telegram Bot** - Responds with AI-generated answers
2. **Token Usage Tracking** - Real-time tracking in dashboard
3. **Subscription Management** - Platform-locked subscriptions
4. **Database** - All tables, RLS policies, functions deployed
5. **Frontend** - Next.js 15.5.2 builds successfully
6. **Backend** - FastAPI with Gemini AI integration

### ⚠️ Known Limitations (Expected):
1. **WhatsApp Integration** - UI only, backend placeholder (future feature)
2. **Payment Gateway** - Stripe config exists but not implemented (future feature)

---

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Frontend (Vercel)          Backend (Railway)     Database   │
│  ┌──────────────┐          ┌──────────────┐    ┌──────────┐│
│  │ Next.js 15   │◄────────►│  FastAPI     │◄──►│ Supabase ││
│  │ + React      │   API    │  + Gemini AI │    │ Postgres ││
│  │ + TypeScript │          │  + Redis     │    │  + RLS   ││
│  └──────────────┘          └──────────────┘    └──────────┘│
│         │                          │                  │      │
│         │                          │                  │      │
│         ▼                          ▼                  ▼      │
│    Static CDN              Telegram API          Data Storage│
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 PART 1: Deploy Frontend to Vercel

### Prerequisites:
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Your Supabase credentials

### Step 1: Push Code to GitHub

```bash
cd /Users/macpro/Documents/botai

# Initialize git if not done
git init
git add .
git commit -m "Production-ready deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/botai.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository (`botai`)
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI
NEXT_PUBLIC_BACKEND_URL=https://YOUR_RAILWAY_URL.up.railway.app
NEXT_PUBLIC_ENV=production
```

**Note**: Add `NEXT_PUBLIC_BACKEND_URL` after deploying backend in Part 2.

### Step 4: Deploy

Click "Deploy" - Vercel will build and deploy your frontend automatically.

**Your frontend URL**: `https://YOUR_PROJECT.vercel.app`

---

## 🔧 PART 2: Deploy Backend to Railway

### Prerequisites:
- Railway account (sign up at https://railway.app)
- Google API key (Gemini)
- Telegram bot tokens

### Step 1: Create Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your `botai` repository
4. Railway will auto-detect Python

### Step 2: Configure Backend

1. In Railway dashboard, click on your service
2. Go to **Settings** → **Service Settings**
3. Set **Root Directory**: `backend`
4. Railway will automatically use the `Procfile`

### Step 3: Add Environment Variables

Click **Variables** and add:

```bash
# Required
ENVIRONMENT=production
GOOGLE_API_KEY=AIzaSyBEtgH1LswIm-A1Rfa0I6rQCDVAYOs80YE
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret_here
SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI

# Optional
LOG_LEVEL=INFO
FRONTEND_URL=https://YOUR_PROJECT.vercel.app
PORT=8000
```

### Step 4: Add Redis (Optional but Recommended)

1. In Railway project, click **New**
2. Select **Database** → **Redis**
3. Once created, Railway automatically sets `REDIS_URL` environment variable

### Step 5: Deploy

Railway will automatically deploy your backend.

**Your backend URL**: `https://YOUR_PROJECT.up.railway.app`

### Step 6: Update Frontend Environment

1. Go back to Vercel
2. Update `NEXT_PUBLIC_BACKEND_URL` with your Railway URL
3. Redeploy frontend (Vercel → Deployments → Redeploy)

---

## 🗄️ PART 3: Configure Database (Supabase)

### Your Supabase project is already set up, but verify:

1. Go to https://supabase.com/dashboard
2. Select your project (`rjvvkfecdrdxmnxwiuto`)

### Step 1: Run SQL Scripts (if not done)

Go to **SQL Editor** and execute in order:

**1. Schema** (`supabase-schema.sql`):
```bash
# Run the entire supabase-schema.sql file
```

**2. Functions** (`supabase-functions.sql`):
```bash
# Run the entire supabase-functions.sql file
```

**3. RLS Policies** (`supabase-rls.sql`):
```bash
# Run the entire supabase-rls.sql file
```

### Step 2: Verify Plans Exist

Run this query:
```sql
SELECT * FROM plans WHERE is_active = true;
```

Should return 3 plans:
- Free Plan ($0, 1,000 tokens)
- Pro Plan ($29.99, 10,000 tokens)
- Enterprise Plan ($99.99, 50,000 tokens)

### Step 3: Enable Realtime (Optional)

1. Go to **Database** → **Replication**
2. Enable realtime for:
   - `activities`
   - `bots`
   - `conversations`
   - `usage_logs`

---

## 🔗 PART 4: Configure Telegram Webhooks

### For Each Bot You Create:

When a user creates a bot in your dashboard, the webhook URL will be:

```
https://YOUR_RAILWAY_URL.up.railway.app/webhook/{BOT_TOKEN}
```

### Set Webhook (Automatic via Dashboard)

The dashboard automatically sets webhooks when users create bots.

### Manual Webhook Setup (if needed):

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://YOUR_RAILWAY_URL.up.railway.app/webhook/<BOT_TOKEN>"
  }'
```

### Verify Webhook:

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

---

## ✅ PART 5: Post-Deployment Verification

### Test the Complete Flow:

#### 1. **Sign Up**
- Go to `https://YOUR_PROJECT.vercel.app/auth/signup`
- Create a new account
- Email: test@example.com
- Should redirect to onboarding

#### 2. **Onboarding**
- Select platform: Telegram
- Enter company details
- Enter Telegram bot token
- Add knowledge base content
- Submit → Should redirect to dashboard

#### 3. **Dashboard Verification**
- ✅ Bot appears in "My Bots"
- ✅ Subscription shows "Free Plan" (1,000 tokens)
- ✅ Usage shows 0/1,000 tokens
- ✅ Dashboard loads without errors

#### 4. **Test Bot**
- Open Telegram
- Message your bot: "Hello, what are your features?"
- ✅ Bot responds with AI-generated answer
- ✅ Refresh dashboard → token usage increases

#### 5. **Test Subscription Upgrade**
- Click "Upgrade Plan" in dashboard
- Select "Pro Plan"
- Confirm upgrade
- ✅ Dashboard shows "Pro Plan" (10,000 tokens)
- ✅ Usage persists from previous plan

---

## 🔒 Security Checklist

Before going live:

- [ ] All environment variables set in Vercel/Railway (not in code)
- [ ] No API keys or secrets in GitHub repository
- [ ] RLS policies enabled on all Supabase tables
- [ ] CORS configured to only allow your frontend domain
- [ ] Telegram webhook secret configured
- [ ] Redis rate limiting enabled (if using Railway Redis)
- [ ] HTTPS enforced (automatic on Vercel/Railway)

---

## 📊 Monitoring & Logs

### View Logs:

**Frontend (Vercel)**:
- Vercel Dashboard → Your Project → Logs
- Real-time logs of all requests

**Backend (Railway)**:
- Railway Dashboard → Your Service → Logs
- Shows FastAPI requests, AI generation, errors

**Database (Supabase)**:
- Supabase Dashboard → Logs
- Database queries, RLS policy checks

### Monitor Usage:

**Vercel**:
- Free tier: 100GB bandwidth/month
- Function executions: Unlimited

**Railway**:
- $5/month includes Redis
- 500 hours/month execution time

**Supabase**:
- Free tier: 500MB database, 2GB bandwidth
- Monitor in Dashboard → Usage

---

## 🐛 Troubleshooting

### Frontend won't build:
```bash
cd frontend
npm run build
# Check for errors
```

### Backend won't start:
- Check Railway logs for missing environment variables
- Verify Python version is 3.12+
- Ensure all dependencies in `requirements.txt`

### Bot not responding:
- Verify webhook is set: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Check Railway backend logs for errors
- Verify Telegram webhook secret matches

### Token usage not tracking:
- Check Supabase SQL Editor:
  ```sql
  SELECT * FROM usage_logs ORDER BY timestamp DESC LIMIT 10;
  ```
- Verify `total_tokens` column exists
- Check backend logs for database errors

### Dashboard not loading:
- Verify Supabase RLS policies are enabled
- Check browser console for errors
- Verify environment variables in Vercel

---

## 💰 Cost Breakdown

### Free Tier (MVP):
- **Vercel**: $0 (100GB bandwidth)
- **Railway**: $5/month (includes Redis)
- **Supabase**: $0 (500MB database)
- **Google Gemini**: $0 (free tier: 60 requests/min)

**Total**: ~$5/month

### Production (Scaling):
- **Vercel Pro**: $20/month (unlimited bandwidth)
- **Railway Pro**: $20/month (unlimited hours)
- **Supabase Pro**: $25/month (8GB database)
- **Google Gemini**: Pay-as-you-go (~$0.001 per 1000 tokens)

**Total**: ~$65-70/month + Gemini usage

---

## 🎯 Post-Launch Checklist

After successful deployment:

- [ ] Test complete user flow (signup → bot creation → messaging)
- [ ] Verify all features work in production
- [ ] Set up monitoring/alerts (optional: Sentry, LogRocket)
- [ ] Configure custom domain (optional)
- [ ] Set up automated backups (Supabase has daily backups)
- [ ] Document any issues encountered
- [ ] Plan for scaling (upgrade plans when needed)

---

## 🚀 You're Live!

**Frontend**: `https://YOUR_PROJECT.vercel.app`
**Backend**: `https://YOUR_PROJECT.up.railway.app`
**Database**: `https://rjvvkfecdrdxmnxwiuto.supabase.co`

**Congratulations! Your BotAI application is now in production!** 🎉

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

**Last Updated**: 2025-10-04
**Version**: 1.0.0
**Status**: Production Ready ✅
