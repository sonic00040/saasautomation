# 🆓 BotAI - 100% FREE Tier Deployment Guide

**Cost: $0/month** 🎉

This guide shows you how to deploy BotAI using **completely free** services:
- **Frontend**: Vercel (Free Hobby Plan)
- **Backend**: Render (Free Tier)
- **Database**: Supabase (Free Tier)

---

## ⚠️ Important Limitations of Free Tier

### Render Free Tier (Backend)
- **Spins down after 15 minutes of inactivity**
- **Cold start time: 50-60 seconds** for the first request after spin-down
- 750 free instance hours per month (31 days × 24 hours = 744 hours, so enough for always-on if you want)
- 0.5 GB RAM, shared CPU

**What this means**: If no one messages your bot for 15 minutes, the backend sleeps. The next message will wake it up (takes ~1 minute), then subsequent messages are fast.

### Vercel Free Tier (Frontend)
- ✅ 100GB bandwidth/month (more than enough)
- ✅ Unlimited deployments
- ✅ No cold starts for static/SSR pages
- ⚠️ Hobby plan is for **non-commercial use only**

### Supabase Free Tier (Database)
- ✅ 500MB database storage
- ✅ 2GB bandwidth/month
- ✅ Unlimited API requests
- ⚠️ Database pauses after 7 days of inactivity (auto-resumes on request)

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

```bash
cd /Users/macpro/Documents/botai

# Initialize git (if not done)
git init
git add .
git commit -m "Production-ready deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/botai.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account

1. Go to https://render.com/
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended - enables auto-deploy)

### Step 3: Deploy Backend as Blueprint

1. In Render Dashboard, click **"New"** → **"Blueprint"**
2. Connect your GitHub repository (`botai`)
3. Render will detect `render.yaml` in the `backend/` folder
4. Click **"Apply"**

### Step 4: Add Environment Variables

Render will create the service but you need to add secrets:

1. Go to your service in Render Dashboard
2. Click **"Environment"** in the left sidebar
3. Add these variables:

```bash
GOOGLE_API_KEY=AIzaSyBEtgH1LswIm-A1Rfa0I6rQCDVAYOs80YE
SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI
TELEGRAM_WEBHOOK_SECRET=your_secure_random_string_here
FRONTEND_URL=https://YOUR_PROJECT.vercel.app
BACKEND_URL=https://YOUR_PROJECT.onrender.com
```

**Note**: You'll update `FRONTEND_URL` after deploying frontend in Part 2.

4. Click **"Save Changes"**
5. Render will automatically redeploy with new environment variables

### Step 5: Get Your Backend URL

After deployment completes (2-3 minutes):
- Your backend will be live at: `https://YOUR_PROJECT.onrender.com`
- Copy this URL - you'll need it for frontend setup

### Step 6: Test Backend

```bash
# Test health endpoint
curl https://YOUR_PROJECT.onrender.com/health

# Should return:
# {"status":"healthy","environment":"production","timestamp":"2025-..."}
```

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended)

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository (`botai`)
3. Vercel will auto-detect Next.js

### Step 3: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `frontend`
**Build Command**: `npm run build` (default)
**Output Directory**: `.next` (default)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI
NEXT_PUBLIC_BACKEND_URL=https://YOUR_PROJECT.onrender.com
NEXT_PUBLIC_ENV=production
```

**Important**: Replace `YOUR_PROJECT.onrender.com` with your actual Render backend URL from Part 1.

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend (2-3 minutes)
3. You'll get a URL like: `https://YOUR_PROJECT.vercel.app`

### Step 6: Update Backend with Frontend URL

1. Go back to Render Dashboard
2. Navigate to your backend service → **Environment**
3. Update `FRONTEND_URL` to your Vercel URL
4. Save (Render will auto-redeploy)

---

## 🗄️ Part 3: Verify Supabase Database

Your Supabase database is already configured! Just verify:

### Step 1: Check Tables Exist

1. Go to https://supabase.com/dashboard
2. Select your project (`rjvvkfecdrdxmnxwiuto`)
3. Go to **Table Editor**
4. Verify these tables exist:
   - `companies`
   - `bots`
   - `plans`
   - `subscriptions`
   - `usage_logs`
   - `knowledge_base`

### Step 2: Verify Plans

Go to **SQL Editor** and run:

```sql
SELECT * FROM plans WHERE is_active = true;
```

Should return 3 plans:
- Free Plan ($0, 1,000 tokens)
- Pro Plan ($29.99, 10,000 tokens)
- Enterprise Plan ($99.99, 50,000 tokens)

If missing, run the SQL scripts in this order:
1. `supabase-schema.sql`
2. `supabase-functions.sql`
3. `supabase-rls.sql`

---

## ✅ Part 4: Test the Complete System

### 1. Test Frontend

Visit `https://YOUR_PROJECT.vercel.app`

- ✅ Should load homepage
- ✅ Navigate to `/auth/signup`
- ✅ Create test account
- ✅ Complete onboarding

### 2. Test Bot Creation

In dashboard:
1. Select platform: **Telegram**
2. Enter company name
3. Enter Telegram bot token
4. Add knowledge base content
5. Click "Create Bot"

### 3. Test Telegram Bot

1. Open Telegram
2. Message your bot: "Hello"
3. **First message after 15 min inactivity**: Takes ~60 seconds (cold start)
4. **Subsequent messages**: Fast response (~2-3 seconds)

### 4. Test Token Tracking

1. Send a few messages to bot
2. Refresh dashboard
3. ✅ Usage counter should increase
4. ✅ Should see token usage updating

---

## 🐛 Troubleshooting

### Backend is sleeping / slow first response

**This is expected behavior on free tier.**

**Solution 1**: Wait ~60 seconds for cold start, then bot is fast
**Solution 2**: Use a free ping service to keep it awake

**Ping Services (Free)**:
- UptimeRobot (https://uptimerobot.com/) - Free for up to 50 monitors
- Cron-job.org (https://cron-job.org/) - Free unlimited
- Freshping (https://www.freshworks.com/website-monitoring/) - Free for 50 checks

**Setup**:
1. Create account on any ping service
2. Add monitor for: `https://YOUR_PROJECT.onrender.com/health`
3. Set interval: **Every 14 minutes**
4. This keeps backend awake 24/7

**Trade-off**: Uses ~1,700 hours/month (exceeds 750 free hours), but Render doesn't charge overage - your service just pauses when you hit the limit.

### Frontend build fails

```bash
cd frontend
npm run build
```

Check for errors. Current build is working ✅ (fixed all 37 ESLint errors in previous session)

### Bot not responding

1. **Check backend logs** in Render Dashboard → Logs
2. **Verify webhook** is set:
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
   ```
   Should show your Render URL
3. **Check environment variables** in Render Dashboard

### Database connection errors

1. Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
2. Check Supabase project is not paused
3. Go to Supabase Dashboard → Database → Connection pooling (should be enabled)

---

## 📊 Monitoring Your Free Tier Usage

### Render

- Dashboard → Your Service → **Metrics**
- Shows instance hours used this month
- 750 hours = ~31 days (if always-on with ping service)

### Vercel

- Dashboard → Your Project → **Usage**
- Shows bandwidth used
- 100GB/month is plenty for MVP

### Supabase

- Dashboard → **Settings** → **Usage**
- Shows database size, bandwidth
- 500MB storage, 2GB bandwidth/month

---

## 💰 Cost Comparison

### Current Setup (100% Free)
- **Vercel**: $0
- **Render**: $0
- **Supabase**: $0
- **Total**: **$0/month** 🎉

**Trade-offs**:
- ⚠️ Backend cold starts (15 min inactivity)
- ⚠️ Vercel is for non-commercial use only
- ⚠️ Limited resources (RAM, CPU, storage)

### When to Upgrade

**Upgrade to Paid Plans When**:
1. You get real users (commercial use)
2. Cold starts frustrate users
3. You exceed free tier limits
4. You need better performance/support

**Recommended Upgrade Path** (~$40/month):
- **Vercel Pro**: $20/month (commercial use, unlimited bandwidth)
- **Render Starter**: $7/month (always-on, 512 MB RAM)
- **Supabase Pro**: $25/month (8GB database, 50GB bandwidth)

Or keep free tiers for testing and use paid only when you launch! 🚀

---

## 🎉 You're Live on Free Tier!

**Frontend**: `https://YOUR_PROJECT.vercel.app`
**Backend**: `https://YOUR_PROJECT.onrender.com`
**Database**: `https://rjvvkfecdrdxmnxwiuto.supabase.co`

**Next Steps**:
1. Test thoroughly with your Telegram bots
2. Monitor usage in all dashboards
3. Consider setting up ping service to reduce cold starts
4. Share with friends for testing (free tier is perfect for MVP!)
5. Upgrade when you're ready to launch commercially

---

## 🔗 Useful Links

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Render Free Tier Details**: https://render.com/docs/free
- **Vercel Hobby Plan**: https://vercel.com/docs/plans/hobby

---

**Last Updated**: 2025-10-04
**Status**: ✅ Production Ready (Free Tier)
