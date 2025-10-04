# 🚀 GitHub-Based Automated Deployment Guide

**Complete guide for deploying BotAI using GitHub integration**

Repository: `https://github.com/sonic00040/saasautomation`

---

## 📊 Deployment Overview

```
GitHub Repository (main branch)
        │
        │ git push
        ├─────────────────────────────────┐
        │                                 │
        ▼                                 ▼
   Vercel (Frontend)              Render (Backend)
   Auto-detects push              Auto-detects push
   Builds Next.js app             Builds FastAPI app
   Deploys to CDN                 Deploys to server
        │                                 │
        └─────────────────────────────────┘
                        │
                        ▼
              Supabase (Database)
           Already configured ✅
```

---

## 🎯 Quick Start (5 Steps)

### Step 1: Deploy Frontend to Vercel
📖 **[Follow VERCEL_SETUP.md](.github/VERCEL_SETUP.md)**

- Connect GitHub repo
- Set root directory: `frontend`
- Add environment variables
- Deploy! (~5 minutes)

**Result**: `https://saasautomation-xyz.vercel.app`

---

### Step 2: Deploy Backend to Render
📖 **[Follow RENDER_SETUP.md](.github/RENDER_SETUP.md)**

- Deploy as Blueprint
- Render auto-detects `backend/render.yaml`
- Add environment variables
- Deploy! (~5 minutes)

**Result**: `https://botai-backend.onrender.com`

---

### Step 3: Connect Frontend & Backend

1. Copy your Render backend URL
2. Go to Vercel → Settings → Environment Variables
3. Update `NEXT_PUBLIC_BACKEND_URL` to your Render URL
4. Redeploy frontend

**Result**: Frontend ↔️ Backend connected! ✅

---

### Step 4: Test End-to-End

1. Visit your Vercel URL
2. Sign up / Login
3. Create a Telegram bot in dashboard
4. Send message to bot
5. Verify response & token tracking

**Result**: Fully working chatbot platform! 🎉

---

### Step 5: Push to Deploy

From now on:
```bash
git add .
git commit -m "Your changes"
git push origin main

# ✨ Auto-deploys:
# → Vercel rebuilds frontend (~2 min)
# → Render rebuilds backend (~3 min)
# → Both notify you via email
```

---

## 🔐 Environment Variables Reference

### Frontend (Vercel)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI

# Backend API
NEXT_PUBLIC_BACKEND_URL=https://botai-backend.onrender.com

# Environment
NEXT_PUBLIC_ENV=production
```

### Backend (Render)

```bash
# Google AI
GOOGLE_API_KEY=AIzaSyBEtgH1LswIm-A1Rfa0I6rQCDVAYOs80YE

# Supabase
SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI

# Telegram
TELEGRAM_WEBHOOK_SECRET=<generate-secure-random-string>

# URLs
BACKEND_URL=https://botai-backend.onrender.com
FRONTEND_URL=https://saasautomation-xyz.vercel.app

# Application
ENVIRONMENT=production
LOG_LEVEL=INFO
PORT=8000
```

**See [`.env.example`](.env.example) for complete template**

---

## 💰 Cost Breakdown

### Current Setup: **$0/month** 🎉

| Service | Tier | Cost | Limitations |
|---------|------|------|-------------|
| **Vercel** | Hobby (Free) | $0 | 100GB bandwidth, non-commercial use |
| **Render** | Free | $0 | Cold starts after 15 min, 750 hrs/month |
| **Supabase** | Free | $0 | 500MB database, 2GB bandwidth |
| **Total** | | **$0** | Perfect for MVP/testing! |

### Production Upgrade: **~$40/month**

| Service | Tier | Cost | Benefits |
|---------|------|------|----------|
| **Vercel** | Pro | $20 | Unlimited bandwidth, commercial use |
| **Render** | Starter | $7 | No cold starts, always-on, 512MB RAM |
| **Supabase** | Pro | $25 | 8GB database, 50GB bandwidth |
| **Total** | | **$52** | Production-ready! |

---

## 🔄 Auto-Deployment Workflow

### How It Works:

1. **You make changes locally**
   ```bash
   # Edit code
   git add .
   git commit -m "Added new feature"
   git push origin main
   ```

2. **GitHub triggers webhooks**
   - Notifies Vercel: "New commit in `main` branch"
   - Notifies Render: "New commit in `main` branch"

3. **Platforms auto-deploy**

   **Vercel**:
   ```
   → Pulls latest code
   → Detects changes in frontend/
   → Runs: npm install
   → Runs: npm run build
   → Deploys to CDN
   → Takes ~2 minutes
   ```

   **Render**:
   ```
   → Pulls latest code
   → Detects changes in backend/
   → Runs: pip install -r requirements.txt
   → Runs: uvicorn main:app
   → Starts service
   → Takes ~3 minutes
   ```

4. **You get notifications**
   - Email from Vercel: "Deployment successful"
   - Email from Render: "Deployment successful"
   - Visit your live URLs to see changes!

### Preview Deployments (Bonus!)

When you create a Pull Request:

**Vercel**:
- Creates preview deployment
- URL: `https://saasautomation-git-feature-xyz.vercel.app`
- Test changes before merging!

**Render**:
- Can be configured for preview deployments
- (Not enabled by default on free tier)

---

## ✅ Complete Verification Checklist

### After Deployment:

#### Frontend (Vercel)
- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] Signup page works: `/auth/signup`
- [ ] Login page works: `/auth/login`
- [ ] Dashboard redirects when not authenticated
- [ ] No console errors in browser
- [ ] Supabase auth works (try signing up)

#### Backend (Render)
- [ ] Health check works: `https://your-backend.onrender.com/health`
- [ ] Returns: `{"status":"healthy",...}`
- [ ] Logs show "Uvicorn running"
- [ ] No errors in Render logs

#### End-to-End
- [ ] Sign up with email/password
- [ ] Complete onboarding flow
- [ ] Create Telegram bot in dashboard
- [ ] Set Telegram bot webhook (automatic via dashboard)
- [ ] Send message to Telegram bot
- [ ] Bot responds (may take 60s on first request - cold start)
- [ ] Dashboard shows token usage increasing
- [ ] Can see conversation history

#### Database (Supabase)
- [ ] Tables exist: `companies`, `bots`, `subscriptions`, `usage_logs`
- [ ] Row Level Security (RLS) enabled
- [ ] Data appears in Supabase dashboard
- [ ] Plans exist: Free, Pro, Enterprise

---

## 🐛 Common Issues & Solutions

### Issue: "Build failed - Root directory not found"
**Platform**: Vercel
**Solution**: Set root directory to `frontend` in Vercel project settings

---

### Issue: "Module not found" during build
**Platform**: Render
**Solution**:
```bash
cd backend
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
git push
```

---

### Issue: Telegram bot not responding
**Possible Causes**:
1. **Cold start (Free tier)**: Wait 60 seconds, then try again
2. **Wrong webhook URL**: Check in Telegram bot settings
3. **Missing env vars**: Verify all variables in Render dashboard

**Debug**:
```bash
# Check webhook
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# Should show your Render URL
```

---

### Issue: Frontend can't connect to backend
**Solution**:
1. Check `NEXT_PUBLIC_BACKEND_URL` in Vercel env vars
2. Must be exact Render URL (no trailing slash)
3. Redeploy frontend after updating
4. Check CORS settings in backend (already configured)

---

### Issue: Token usage not tracking
**Solution**:
1. Check Supabase connection in Render logs
2. Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
3. Check `usage_logs` table exists in Supabase
4. Verify RLS policies allow inserts

---

## 🔧 Advanced Configuration

### Custom Domains

**Vercel**:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `chatbot.yourdomain.com`)
3. Update DNS records as instructed
4. SSL certificate auto-configured

**Render**:
1. Upgrade to Starter plan ($7/mo) - required for custom domains
2. Go to Service Settings → Custom Domain
3. Add domain and configure DNS

---

### Branch Deployments

**Enable preview deployments for feature branches**:

**Vercel** (Already enabled):
- Every PR gets preview deployment
- URL: `https://app-git-branch-name.vercel.app`

**Render**:
- Requires paid plan for branch deploys
- Free tier only deploys `main` branch

---

### Monitoring & Alerts

**Vercel**:
- Dashboard → Analytics (Pro plan)
- Real-time visitor data
- Performance metrics

**Render**:
- Dashboard → Metrics
- CPU, Memory, Response times
- Can set up alerts (paid plans)

**Supabase**:
- Dashboard → Logs
- API requests, errors
- Database performance

---

## 📚 Additional Resources

### Documentation
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com

### Your Dashboards
- **Vercel**: https://vercel.com/sonic00040/saasautomation
- **Render**: https://dashboard.render.com
- **Supabase**: https://supabase.com/dashboard
- **GitHub**: https://github.com/sonic00040/saasautomation

### Deployment Guides
- **Vercel Setup**: [.github/VERCEL_SETUP.md](.github/VERCEL_SETUP.md)
- **Render Setup**: [.github/RENDER_SETUP.md](.github/RENDER_SETUP.md)
- **Free Tier Deployment**: [FREE_TIER_DEPLOYMENT.md](FREE_TIER_DEPLOYMENT.md)
- **Production Deployment**: [PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md)

---

## 🎉 Success!

You now have a **fully automated deployment pipeline**!

### Your Workflow:
```bash
# 1. Make changes
vim frontend/src/app/page.tsx

# 2. Commit
git add .
git commit -m "Updated homepage"

# 3. Push
git push origin main

# 4. Wait ~3 minutes
# ✅ Vercel deploys frontend
# ✅ Render deploys backend
# ✅ You get email notifications

# 5. Visit your URLs
# https://your-app.vercel.app
# https://your-backend.onrender.com

# 🎉 Changes are live!
```

---

**Questions?** Open an issue on GitHub or check platform documentation.

**Last Updated**: 2025-10-04
**Status**: ✅ Production Ready
**Cost**: $0/month (Free tier)
