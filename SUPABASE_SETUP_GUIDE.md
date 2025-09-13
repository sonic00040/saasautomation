# BotAI Supabase Database Setup Guide

This guide will help you set up your Supabase database to fix the empty error objects and get your BotAI application working properly.

## 🔍 The Problem

Your frontend is showing empty error objects (`{}`) because the required database tables don't exist in your Supabase project. When Supabase tries to query non-existent tables, it returns empty error objects instead of descriptive messages.

## ✅ The Solution

Follow these steps to create the complete database schema:

### Step 1: Access Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `rjvvkfecdrdxmnxwiuto`
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Schema Script

1. Copy the contents of `supabase-schema.sql`
2. Paste it into a new SQL query in your Supabase dashboard
3. Click **Run** to create all tables

This creates:
- ✅ `companies` - User organizations
- ✅ `plans` - Subscription plans
- ✅ `subscriptions` - User subscriptions
- ✅ `bots` - Bot configurations
- ✅ `conversations` - Message tracking
- ✅ `activities` - Activity logs
- ✅ `knowledge_bases` - Knowledge content
- ✅ `usage_logs` - Usage tracking

### Step 3: Run the Functions Script

1. Copy the contents of `supabase-functions.sql`
2. Paste it into a new SQL query
3. Click **Run** to create all functions

This creates:
- ✅ `get_total_usage()` - Calculate token usage
- ✅ `log_usage()` - Log usage events
- ✅ `get_user_metrics()` - Dashboard metrics
- ✅ `ensure_user_company()` - Auto-create companies
- ✅ Other helper functions

### Step 4: Run the RLS Policies Script

1. Copy the contents of `supabase-rls.sql`
2. Paste it into a new SQL query
3. Click **Run** to enable security policies

This ensures:
- 🔒 Users can only see their own data
- 🔒 Proper authentication is enforced
- 🔒 Data isolation between companies

### Step 5: Enable Authentication (if not already enabled)

1. Go to **Authentication** in your Supabase dashboard
2. Make sure **Email & Password** is enabled under Providers
3. Configure any email templates if needed

### Step 6: Test the Setup

1. Visit your application at `http://localhost:3002/debug`
2. This page will test all database connections
3. All tests should show `success: true` or `exists: true`

## 🎯 Expected Results

After running these scripts:

### ✅ What Should Work:
- Dashboard loads without errors
- Bot configuration page shows data
- Activities are tracked and displayed
- Knowledge base functions properly
- No more empty `{}` error objects

### 🔍 Debug Information:
- Visit `/debug` to see detailed connection status
- Console logs will show helpful debugging information
- Errors will have proper messages instead of empty objects

## 📋 Tables Overview

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `companies` | User organizations | `id`, `name`, `email` |
| `bots` | Bot configurations | `id`, `company_id`, `name`, `platform`, `token` |
| `activities` | Activity tracking | `id`, `company_id`, `type`, `description` |
| `knowledge_bases` | Knowledge content | `id`, `company_id`, `content`, `title` |
| `subscriptions` | User plans | `id`, `company_id`, `plan_id` |
| `usage_logs` | Token tracking | `id`, `subscription_id`, `tokens_used` |

## 🔒 Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Email-based company isolation** - Companies are tied to user email addresses
- **Authenticated access only** - All data requires authentication
- **Function-level security** - Database functions have proper permissions

## 🚀 Next Steps

After setup:

1. **Create your first bot** via the dashboard
2. **Add knowledge base content** to train your bot
3. **Test the connection** using the bot configuration page
4. **Monitor usage** through the dashboard metrics

## 🔧 Troubleshooting

If you still see errors:

1. Check the `/debug` page for specific issues
2. Verify all three SQL scripts ran successfully
3. Ensure your `.env.local` has the correct credentials
4. Check the browser console for detailed error messages

## 📞 Support

If you need help:
- Check the detailed logs in your browser console
- Visit the `/debug` page for diagnostic information
- All error messages should now be descriptive instead of empty objects

---

**🎉 Once you complete these steps, your BotAI application will have a fully functional database and no more empty error objects!**