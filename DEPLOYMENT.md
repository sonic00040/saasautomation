# BotAI Deployment Guide

## ✅ Pre-Deployment Checklist

All critical issues have been fixed:
- ✅ Frontend build errors resolved
- ✅ Environment variables secured
- ✅ Deployment configurations created
- ✅ Production build tested successfully
- ✅ CORS configured for production
- ✅ Backend deployment files ready

## 🚀 Deployment Options

### ⭐ Option 1: 100% FREE TIER - Vercel + Render (Recommended for MVP/Testing)

**Perfect for**: Testing, MVP, personal projects, learning

- **Frontend**: Vercel (Free Hobby Plan)
- **Backend**: Render (Free Tier)
- **Database**: Supabase (Free Tier)
- **Cost**: **$0/month** 🎉

**Trade-offs**:
- Backend spins down after 15 min inactivity (cold start ~60 seconds)
- Vercel free tier is for non-commercial use only
- Limited resources (0.5GB RAM for backend)

**👉 See [FREE_TIER_DEPLOYMENT.md](FREE_TIER_DEPLOYMENT.md) for detailed step-by-step guide**

---

### Option 2: Vercel (Frontend) + Railway (Backend) - Best for Production

**Perfect for**: Production apps with real users

- **Frontend**: Vercel (Free or Pro $20/mo)
- **Backend**: Railway ($5/mo starter, includes Redis)
- **Database**: Supabase (Free tier)
- **Cost**: ~$5-25/month

**Advantages**:
- Railway usage-based pricing ($5 free credits/month, then pay-as-you-go)
- Better performance than Render free tier
- Redis included for rate limiting

**See [PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md) for Railway instructions**

---

### Option 3: Vercel (Frontend) + Render Starter (Backend)

**Perfect for**: Production without cold starts

- **Frontend**: Vercel (Free or Pro $20/mo)
- **Backend**: Render Starter ($7/mo - always-on)
- **Database**: Supabase (Free tier)
- **Cost**: ~$7-27/month

**Advantages**:
- No cold starts (always-on)
- Predictable flat pricing
- Good for moderate traffic

---

## 📦 Part 1: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

The frontend is already configured with `vercel.json`. No additional setup needed.

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard** (easier):
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
     NEXT_PUBLIC_BACKEND_URL=<your-backend-url> (add after backend deployment)
     NEXT_PUBLIC_ENV=production
     ```
   - Click "Deploy"

3. **Or Deploy via CLI**:
   ```bash
   cd frontend
   vercel --prod
   ```

### Step 3: Get Your Frontend URL

After deployment, you'll get a URL like: `https://your-app.vercel.app`

---

## 🔧 Part 2: Deploy Backend to Railway

### Step 1: Prepare Backend

All backend deployment files are ready:
- ✅ `Procfile` - Railway/Heroku deployment
- ✅ `runtime.txt` - Python version
- ✅ `railway.json` - Railway config
- ✅ `requirements.txt` - Dependencies

### Step 2: Deploy to Railway

1. **Sign up at Railway**:
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Python

3. **Configure Settings**:
   - Set root directory: `backend`
   - Railway will automatically use `Procfile`

4. **Add Environment Variables**:
   ```
   ENVIRONMENT=production
   BACKEND_URL=<your-railway-url> (will be provided)
   FRONTEND_URL=<your-vercel-url>
   SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
   SUPABASE_KEY=<your-supabase-anon-key>
   GOOGLE_API_KEY=<your-google-api-key>
   TELEGRAM_WEBHOOK_SECRET=<your-webhook-secret>
   LOG_LEVEL=INFO
   PORT=8000
   ```

5. **Optional: Add Redis** (for rate limiting):
   - In Railway project, click "New"
   - Select "Database" → "Redis"
   - Copy the Redis URL
   - Add to environment variables:
     ```
     REDIS_URL=<redis-url-from-railway>
     ```

6. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

### Step 3: Update Frontend Environment

Go back to Vercel and update:
```
NEXT_PUBLIC_BACKEND_URL=<your-railway-backend-url>
```

Redeploy frontend for changes to take effect.

---

## 🗄️ Part 3: Verify Supabase Setup

### Step 1: Ensure All SQL Scripts Are Run

In Supabase Dashboard > SQL Editor, verify these have been executed:

1. ✅ `supabase-schema.sql` - Database tables
2. ✅ `supabase-functions.sql` - Database functions
3. ✅ `supabase-rls.sql` - Row Level Security policies

### Step 2: Verify Plans Exist

Run this query in SQL Editor:
```sql
SELECT * FROM plans WHERE is_active = true;
```

You should see:
- Free Plan ($0, 1,000 tokens)
- Pro Plan ($29.99, 10,000 tokens)
- Enterprise Plan ($99.99, 50,000 tokens)

If missing, the schema insert should have created them.

### Step 3: Enable Realtime (Optional)

In Supabase Dashboard:
- Go to Database > Replication
- Enable realtime for tables: `activities`, `bots`, `conversations`

---

## 🔗 Part 4: Configure Webhooks

### For Telegram Bots

After backend deployment, users need to set webhooks for their bots:

1. When a user creates a bot in your app, the webhook URL will be:
   ```
   https://your-backend.railway.app/webhook/{bot_token}
   ```

2. The webhook is automatically set up via your `/api/webhooks/setup` endpoint

3. Manual setup (if needed):
   ```bash
   curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-backend.railway.app/webhook/<BOT_TOKEN>"}'
   ```

---

## ✅ Part 5: Post-Deployment Verification

### Test the Complete Flow:

1. **Sign Up**:
   - Go to `https://your-app.vercel.app/signup`
   - Create account
   - Should redirect to onboarding

2. **Onboarding**:
   - Select platform (Telegram)
   - Enter company details
   - Enter bot token
   - Add knowledge base
   - Should redirect to dashboard

3. **Dashboard**:
   - Verify bot shows up
   - Check subscription shows "Free Plan"
   - Verify usage shows 0/1000 tokens

4. **Test Bot**:
   - Message your Telegram bot
   - Should receive AI-powered response
   - Check dashboard - usage should increment

5. **Test Upgrade**:
   - Click "Upgrade Plan"
   - Select a plan
   - Should update subscription
   - Should show new token limit

---

## 📊 Monitoring & Logs

### View Frontend Logs:
- Vercel Dashboard → Your Project → Logs

### View Backend Logs:
- Railway Dashboard → Your Service → Logs

### View Database Logs:
- Supabase Dashboard → Logs

---

## 🔒 Security Checklist

- ✅ Environment variables not committed to git
- ✅ RLS policies enabled on all tables
- ✅ CORS configured for production
- ✅ Webhook secret validation enabled
- ✅ Rate limiting configured (if Redis enabled)
- ✅ HTTPS enforced (automatic on Vercel/Railway)

---

## 🐛 Troubleshooting

### Frontend won't build:
```bash
cd frontend
npm run build
```
Check for errors. Current build is working ✅

### Backend won't start:
- Check Railway logs
- Verify all environment variables are set
- Ensure `PORT` is set to `8000` or `$PORT`

### Bot not responding:
- Check backend logs for errors
- Verify webhook is set correctly:
  ```bash
  curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
  ```
- Check Telegram webhook secret matches backend config

### Database errors:
- Verify all SQL scripts ran successfully
- Check RLS policies are enabled
- Ensure user has proper permissions

---

## 📈 Scaling Considerations

### When to Upgrade:

**Railway Free Tier Limits**:
- 500 hours/month execution time
- $5 free credits/month

**Vercel Free Tier Limits**:
- 100GB bandwidth/month
- Unlimited deployments

**Supabase Free Tier Limits**:
- 500MB database
- 2GB bandwidth/month

### Upgrade Path:

1. **Railway Pro** ($20/mo):
   - Unlimited execution hours
   - Priority support

2. **Vercel Pro** ($20/mo):
   - Unlimited bandwidth
   - Advanced analytics

3. **Supabase Pro** ($25/mo):
   - 8GB database
   - 50GB bandwidth

---

## 🎉 You're Ready to Deploy!

Your application is now production-ready. Follow the steps above to deploy to Vercel and Railway.

### Quick Deploy Commands:

```bash
# Deploy Frontend
cd frontend
vercel --prod

# Deploy Backend (via Railway Dashboard - easier)
# Or use Railway CLI:
railway login
railway init
railway up
```

Good luck with your deployment! 🚀
