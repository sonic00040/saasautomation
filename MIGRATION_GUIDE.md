# BotAI Platform-Locked Implementation - Migration Guide

## Overview

This guide will help you migrate your BotAI application from the old multi-page dashboard to the new simplified platform-locked subscription model.

## What Changed

### Business Model
- **Old**: Users could create both Telegram and WhatsApp bots simultaneously
- **New**: Users choose ONE platform (Telegram OR WhatsApp) during onboarding, locked for the billing cycle

### Database Schema
- Added `platform` column to `companies` table (telegram/whatsapp)
- Added `user_id` column to `companies` table (references auth.users)
- Created trigger to enforce platform consistency across bots
- Updated all RLS policies to use `user_id` instead of email

### Frontend Architecture
- **Old**: 8+ separate dashboard pages (analytics, billing, team, settings, conversations, bots, knowledge)
- **New**: Single-page dashboard with left navigation (3 views only: My Bots, Usage & Plan, Account Settings)
- **Reduced**: From ~2,700 lines to ~1,600 lines (40% reduction)

### New Features
- Platform-locked onboarding flow
- WhatsApp UI support (backend placeholder ready)
- Environment-aware webhook setup (auto in production, manual in development)
- Simplified knowledge base (text-only, no file uploads)

---

## Migration Steps

### Step 1: Database Migration

Run these SQL scripts in your Supabase Dashboard > SQL Editor:

#### 1.1 Update Schema

```bash
# In Supabase Dashboard > SQL Editor
# Copy and paste the contents of: supabase-schema.sql
```

**Key changes:**
- Companies table now has `platform` and `user_id` columns
- Unique constraint on `user_id` (one company per user)
- Platform enforcement trigger on bots table

#### 1.2 Update RLS Policies

```bash
# In Supabase Dashboard > SQL Editor
# Copy and paste the contents of: supabase-rls.sql
```

**Key changes:**
- All policies now use `user_id = auth.uid()` instead of email matching
- Helper function updated to use `user_id`

#### 1.3 Migrate Existing Data

If you have existing companies/users, run this migration:

```sql
-- Update existing companies to set user_id and platform
-- WARNING: This assumes you have auth.users records matching company emails

UPDATE companies c
SET
  user_id = (SELECT id FROM auth.users WHERE email = c.email),
  platform = 'telegram'  -- or 'whatsapp' based on your data
WHERE user_id IS NULL;

-- Verify migration
SELECT
  c.id,
  c.name,
  c.email,
  c.platform,
  c.user_id,
  u.email as user_email
FROM companies c
LEFT JOIN auth.users u ON c.user_id = u.id;
```

### Step 2: Frontend Migration

#### 2.1 Install Dependencies

No new dependencies required. All components use existing libraries.

#### 2.2 Environment Variables

Update `frontend/.env.local`:

```bash
# Add these new variables
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

For production, create `frontend/.env.production`:

```bash
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
```

#### 2.3 File Changes

**New files created:**
- `/frontend/src/app/onboarding/page.tsx` - Platform selection onboarding
- `/frontend/src/components/dashboard/left-nav.tsx` - Navigation
- `/frontend/src/components/dashboard/my-bots-view.tsx` - Bot management
- `/frontend/src/components/dashboard/bot-card.tsx` - Individual bot display
- `/frontend/src/components/dashboard/bot-setup-modal.tsx` - Bot creation/edit
- `/frontend/src/components/dashboard/knowledge-base-editor.tsx` - Knowledge editing
- `/frontend/src/components/dashboard/usage-plan-view.tsx` - Usage display
- `/frontend/src/components/dashboard/account-settings-view.tsx` - Settings
- `/frontend/src/components/dashboard/webhook-display.tsx` - Webhook setup
- `/frontend/src/hooks/use-company.ts` - Company data fetching
- `/frontend/src/hooks/use-bots.ts` - Bot data management
- `/frontend/src/hooks/use-subscription.ts` - Subscription data

**Modified files:**
- `/frontend/src/app/dashboard/page.tsx` - Completely rewritten (472 → 243 lines)
- `/frontend/src/app/dashboard/layout.tsx` - Simplified (223 → 57 lines)

**Deleted directories:**
- `/frontend/src/app/dashboard/analytics/`
- `/frontend/src/app/dashboard/billing/`
- `/frontend/src/app/dashboard/bots/`
- `/frontend/src/app/dashboard/knowledge/`
- `/frontend/src/app/dashboard/settings/`
- `/frontend/src/app/dashboard/team/`

### Step 3: Backend Migration

#### 3.1 Environment Variables

Create `backend/.env` based on `.env.example`:

```bash
cp backend/.env.example backend/.env
```

Update the values:

```bash
ENVIRONMENT=development
BACKEND_URL=http://localhost:8000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_API_KEY=your_google_api_key
```

For production, set these environment variables in your deployment platform (Railway/Render):

```bash
ENVIRONMENT=production
BACKEND_URL=https://your-backend.railway.app
```

#### 3.2 New Endpoints

The backend now has two new endpoints:

**WhatsApp Webhook (Placeholder):**
```
POST /webhook/whatsapp/{business_phone}
```

**Webhook Setup:**
```
POST /api/webhooks/setup
Body: { "platform": "telegram", "bot_token": "..." }
```

---

## Testing the Migration

### Test 1: Database Platform Enforcement

```sql
-- Create a test company with Telegram platform
INSERT INTO companies (user_id, name, email, platform)
VALUES ('existing-user-id', 'Test Company', 'test@example.com', 'telegram');

-- Try to create a WhatsApp bot (should FAIL with trigger error)
INSERT INTO bots (company_id, user_id, name, platform, token)
VALUES ('test-company-id', 'existing-user-id', 'Test Bot', 'whatsapp', 'test-token');

-- Error: Bot platform (whatsapp) does not match company platform (telegram)
```

### Test 2: New User Onboarding

1. Sign up with a new email at `/auth/signup`
2. Should redirect to `/onboarding`
3. Choose platform (Telegram or WhatsApp)
4. Enter company info
5. Enter bot credentials
6. Add knowledge base
7. Should redirect to `/dashboard` with My Bots view

### Test 3: Platform Lock

1. Login to dashboard
2. Go to "Usage & Plan" view
3. Verify platform lock message displays with billing date
4. Go to "Account Settings"
5. Verify platform shows as locked with icon

### Test 4: Bot CRUD Operations

1. Click "Add New Bot"
2. Create a bot (should use company's platform automatically)
3. Edit bot credentials
4. Update knowledge base
5. Delete bot
6. Verify all operations work correctly

### Test 5: Webhook Setup

**Development Mode:**
1. Create a new bot
2. Modal should show "Manual Setup Required"
3. Copy webhook URL
4. Verify format matches platform

**Production Mode:**
1. Set `NEXT_PUBLIC_ENV=production`
2. Create a Telegram bot
3. Webhook should auto-configure
4. Check backend logs for success message

---

## Rollback Plan

If you need to rollback:

### Database Rollback

```sql
-- Remove new columns (this will delete platform data!)
ALTER TABLE companies DROP COLUMN platform;
ALTER TABLE companies DROP COLUMN user_id;

-- Drop trigger
DROP TRIGGER IF EXISTS enforce_bot_platform_matches_company ON bots;
DROP FUNCTION IF EXISTS check_bot_platform_matches_company();
```

### Code Rollback

```bash
# Restore old dashboard pages from git
git checkout HEAD~1 -- frontend/src/app/dashboard/

# Remove new components
rm -rf frontend/src/components/dashboard/
rm -rf frontend/src/app/onboarding/

# Remove new hooks
rm frontend/src/hooks/use-company.ts
rm frontend/src/hooks/use-bots.ts
rm frontend/src/hooks/use-subscription.ts
```

---

## Production Deployment Checklist

### Frontend (Vercel/Netlify)

- [ ] Set environment variables:
  - `NEXT_PUBLIC_ENV=production`
  - `NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app`
  - `NEXT_PUBLIC_SUPABASE_URL=...`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

- [ ] Deploy frontend
- [ ] Test onboarding flow
- [ ] Test dashboard views
- [ ] Test bot creation

### Backend (Railway/Render)

- [ ] Set environment variables:
  - `ENVIRONMENT=production`
  - `BACKEND_URL=https://your-backend.railway.app`
  - `SUPABASE_URL=...`
  - `SUPABASE_SERVICE_ROLE_KEY=...`
  - `GOOGLE_API_KEY=...`
  - `TELEGRAM_WEBHOOK_SECRET=...`

- [ ] Deploy backend
- [ ] Test webhook endpoints
- [ ] Test WhatsApp placeholder
- [ ] Monitor logs

### Database

- [ ] Run schema migration in production Supabase
- [ ] Run RLS policy updates
- [ ] Verify trigger is active
- [ ] Migrate existing user data (if any)

---

## Breaking Changes

⚠️ **Important**: These are breaking changes that require user action:

1. **Existing Users**: Must choose a platform during first login after migration
2. **Multi-Platform Bots**: Users with both Telegram and WhatsApp bots will need to choose one
3. **Email-based Auth**: Login email is now separate from business email
4. **Dashboard Navigation**: All old bookmarks to `/dashboard/analytics`, etc. will 404

---

## Support

If you encounter issues during migration:

1. Check Supabase logs for RLS/trigger errors
2. Check browser console for frontend errors
3. Check backend logs for API errors
4. Verify environment variables are set correctly
5. Test with a fresh user signup to isolate data migration issues

---

## Future Enhancements

This migration prepares for:

- Full WhatsApp Business API integration
- Platform switching at billing cycle end
- Multi-bot support per platform
- Advanced analytics per platform
- Platform-specific features (inline keyboards for Telegram, rich media for WhatsApp)

---

## File Structure After Migration

```
botai/
├── backend/
│   ├── main.py (updated with WhatsApp & setup endpoints)
│   ├── .env.example (new)
│   └── ... (other files unchanged)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx (rewritten)
│   │   │   │   └── layout.tsx (simplified)
│   │   │   └── onboarding/
│   │   │       └── page.tsx (new)
│   │   ├── components/
│   │   │   └── dashboard/ (new directory)
│   │   │       ├── left-nav.tsx
│   │   │       ├── my-bots-view.tsx
│   │   │       ├── bot-card.tsx
│   │   │       ├── bot-setup-modal.tsx
│   │   │       ├── knowledge-base-editor.tsx
│   │   │       ├── usage-plan-view.tsx
│   │   │       ├── account-settings-view.tsx
│   │   │       └── webhook-display.tsx
│   │   └── hooks/
│   │       ├── use-company.ts (new)
│   │       ├── use-bots.ts (new)
│   │       └── use-subscription.ts (new)
│   ├── .env.local (updated)
│   └── .env.production (new)
│
├── supabase-schema.sql (updated)
├── supabase-rls.sql (updated)
└── MIGRATION_GUIDE.md (this file)
```

---

**Migration completed successfully! Your BotAI application now supports platform-locked subscriptions with a simplified single-page dashboard.**
