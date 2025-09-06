-- Performance indexes migration
-- Run this after the main schema to improve query performance

-- Index for companies lookup by telegram_bot_token (most frequent query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_telegram_bot_token 
ON companies(telegram_bot_token) 
WHERE telegram_bot_token IS NOT NULL;

-- Index for active subscriptions lookup by company_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_company_active 
ON subscriptions(company_id, is_active) 
WHERE is_active = true;

-- Composite index for usage_logs queries (subscription_id + timestamp range)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_usage_logs_subscription_timestamp 
ON usage_logs(subscription_id, timestamp DESC);

-- Index for knowledge_bases lookup by company_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_knowledge_bases_company_id 
ON knowledge_bases(company_id);

-- Index for faster joins between subscriptions and plans
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_plan_id 
ON subscriptions(plan_id);

-- Partial index for companies with whatsapp (for future WhatsApp integration)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_whatsapp_identifier 
ON companies(whatsapp_identifier) 
WHERE whatsapp_identifier IS NOT NULL;