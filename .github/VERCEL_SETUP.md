# 🚀 Vercel Deployment Setup (Frontend)

This guide shows you how to deploy your **Next.js frontend** to Vercel using GitHub integration.

**Time**: ~5 minutes
**Cost**: $0 (Free Hobby tier)

---

## 📋 Prerequisites

- ✅ GitHub repository: `https://github.com/sonic00040/saasautomation`
- ✅ Vercel account (sign up at https://vercel.com if you don't have one)
- ✅ Your Supabase credentials (you already have these)

---

## 🎯 Step 1: Import Project to Vercel

### 1.1 Go to Vercel Dashboard
- Visit https://vercel.com/new
- Click **"Add New..."** → **"Project"**

### 1.2 Import GitHub Repository
- Click **"Import Git Repository"**
- If not connected, click **"Connect GitHub Account"**
- Search for: `saasautomation`
- Click **"Import"** next to `sonic00040/saasautomation`

### 1.3 Configure Project Settings

**Important Settings**:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (auto-detected ✅) |
| **Root Directory** | `frontend` ⚠️ **IMPORTANT!** |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (default) |
| **Install Command** | `npm install` (default) |

**Note**: Make sure to set **Root Directory** to `frontend` since your Next.js app is in a subfolder!

---

## 🔐 Step 2: Add Environment Variables

Click **"Environment Variables"** section and add these:

### Required Variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rjvvkfecdrdxmnxwiuto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI

# Backend API URL (will update after backend deployment)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com

# Environment
NEXT_PUBLIC_ENV=production
```

### How to Add:

For each variable:
1. Enter **Key** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
2. Enter **Value** (e.g., `https://rjvvkfecdrdxmnxwiuto.supabase.co`)
3. Select **All Environments** (Production, Preview, Development)
4. Click **"Add"**

**Note**: You'll update `NEXT_PUBLIC_BACKEND_URL` after deploying the backend in the next step.

---

## 🚀 Step 3: Deploy!

1. Click **"Deploy"** button
2. Vercel will:
   - Install dependencies
   - Build your Next.js app
   - Deploy to global CDN
3. Wait ~2-3 minutes ⏱️

### Success!

You'll see:
- ✅ **Deployment Status**: Ready
- 🌐 **Your URL**: `https://saasautomation-xyz.vercel.app`
- 🎉 **Visit your live frontend!**

---

## 🔄 Step 4: Enable Auto-Deployments

**Good news**: Auto-deployments are already enabled! 🎉

From now on:
```bash
git push origin main
# → Vercel automatically detects push
# → Builds and deploys new version
# → Takes ~2 minutes
# → You get email notification when done
```

### What Gets Auto-Deployed:

- ✅ **Production**: Pushes to `main` branch → `https://saasautomation.vercel.app`
- ✅ **Preview**: Pull requests → Unique preview URL (e.g., `https://saasautomation-git-feature-xyz.vercel.app`)
- ✅ **Branch Deploys**: Any branch → Preview deployment

---

## 🔧 Step 5: Update Backend URL (After Backend Deployment)

After you deploy your backend to Render:

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Find `NEXT_PUBLIC_BACKEND_URL`
4. Click **"Edit"**
5. Update value to: `https://your-actual-backend.onrender.com`
6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click **"Redeploy"** on latest deployment

Your frontend will now connect to the backend! 🎉

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Visit your Vercel URL
- [ ] Homepage loads without errors
- [ ] Navigate to `/auth/signup` - signup page works
- [ ] Navigate to `/dashboard` - redirects to login (expected)
- [ ] Check browser console - no errors
- [ ] Verify Supabase connection (try signing up)

---

## 🐛 Troubleshooting

### Build Fails with "Root Directory" Error
**Solution**: Make sure Root Directory is set to `frontend` in Project Settings

### Environment Variables Not Working
**Solution**:
1. Verify all variables are added in Vercel Dashboard
2. Make sure they're enabled for "Production" environment
3. Redeploy after adding new variables

### 404 on Routes
**Solution**: This is normal for Next.js - routes work after build. If still 404, check:
- Next.js routing is configured correctly
- `next.config.js` doesn't have conflicting settings

### Supabase Connection Fails
**Solution**:
1. Check `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct (no extra spaces)
3. Verify Supabase project is active

---

## 📊 Vercel Free Tier Limits

Your free tier includes:

- ✅ **Bandwidth**: 100 GB/month
- ✅ **Build Minutes**: 100 hours/month
- ✅ **Deployments**: Unlimited
- ✅ **Team Members**: Unlimited
- ✅ **Preview Deployments**: Unlimited
- ⚠️ **Commercial Use**: Not allowed (Hobby plan is personal use only)

**When to Upgrade**:
- When you get real users (commercial use)
- When you exceed 100 GB bandwidth
- When you need advanced analytics

---

## 🎉 Next Steps

1. ✅ **Frontend Deployed** → You're here!
2. ⏭️ **Deploy Backend** → See [RENDER_SETUP.md](RENDER_SETUP.md)
3. 🔗 **Connect Frontend to Backend** → Update `NEXT_PUBLIC_BACKEND_URL`
4. 🧪 **Test End-to-End** → Create bot, send message, verify dashboard

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Your Deployments**: https://vercel.com/sonic00040/saasautomation
- **Environment Variables**: https://vercel.com/sonic00040/saasautomation/settings/environment-variables

---

**Questions?** Check the [Master Deployment Guide](../GITHUB_DEPLOYMENT.md) or Vercel documentation.

**Last Updated**: 2025-10-04
**Status**: ✅ Ready to Use
