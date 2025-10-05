-- Database Fix Script
-- Run this in Supabase SQL Editor after setting webhooks
-- Replace YOUR-RENDER-URL with your actual Render backend URL

-- Update all bots to active status with correct webhook URLs
UPDATE bots
SET
  is_active = true,
  webhook_url = 'https://YOUR-RENDER-URL.onrender.com/webhook/' || token,
  updated_at = NOW()
WHERE token IN (
  '7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY',
  '7532191997:AAHoAwwdmBxP55K7SU66SPNTGtcpl1jqJ0c',
  '8274270708:AAGbrSg8FzN3JZ3WOpFMutIRA6PjhKcTb7Q'
);

-- Verify the update
SELECT
  name,
  platform,
  is_active,
  webhook_url,
  created_at
FROM bots
ORDER BY created_at ASC;

-- Check if bots have active subscriptions
SELECT
  b.name as bot_name,
  c.name as company_name,
  s.is_active as subscription_active,
  p.name as plan_name,
  p.token_limit,
  s.start_date,
  s.end_date
FROM bots b
JOIN companies c ON b.company_id = c.id
LEFT JOIN subscriptions s ON c.id = s.company_id
LEFT JOIN plans p ON s.plan_id = p.id
WHERE b.token IN (
  '7953941413:AAFvR6X24fLYBZ2CtjiPOj7R9CCOV0qx5LY',
  '7532191997:AAHoAwwdmBxP55K7SU66SPNTGtcpl1jqJ0c',
  '8274270708:AAGbrSg8FzN3JZ3WOpFMutIRA6PjhKcTb7Q'
)
ORDER BY b.created_at;

-- If any company is missing a subscription, create one:
-- First, get the Free Plan ID
-- SELECT id FROM plans WHERE name = 'Free Plan';

-- Then insert subscription (replace COMPANY_ID and PLAN_ID with actual values)
-- INSERT INTO subscriptions (company_id, plan_id, start_date, end_date, is_active)
-- VALUES (
--   'COMPANY_ID',
--   'PLAN_ID',
--   NOW(),
--   NOW() + INTERVAL '30 days',
--   true
-- );
