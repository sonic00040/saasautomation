-- BotAI Supabase Database Schema
-- Run this script in your Supabase Dashboard > SQL Editor
-- This creates all the required tables for your BotAI application

-- Enable UUID extension for auto-generating IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES TABLE
-- Stores user companies/organizations
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL, -- Business email (can differ from login email)
    platform TEXT NOT NULL CHECK (platform IN ('telegram', 'whatsapp')),
    telegram_bot_token TEXT, -- For backend compatibility (deprecated - use bots table)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id) -- One company per user
);

-- 2. PLANS TABLE
-- Stores subscription plans
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    token_limit INTEGER NOT NULL DEFAULT 1000,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SUBSCRIPTIONS TABLE
-- Stores user subscriptions to plans
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BOTS TABLE
-- Stores bot configurations
CREATE TABLE IF NOT EXISTS bots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References auth.users
    name TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('telegram', 'whatsapp', 'discord')),
    token TEXT, -- Bot token from platform
    is_active BOOLEAN DEFAULT false,
    last_activity TIMESTAMP WITH TIME ZONE,
    webhook_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CONVERSATIONS TABLE
-- Stores conversation metadata for message counting
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Platform-specific user ID
    message_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bot_id, user_id)
);

-- 6. ACTIVITIES TABLE
-- Stores activity logs for dashboard
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('message', 'bot_response', 'user_join', 'user_leave', 'bot_created', 'knowledge_updated')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. KNOWLEDGE_BASES TABLE
-- Stores knowledge base content
CREATE TABLE IF NOT EXISTS knowledge_bases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    title TEXT,
    file_name TEXT,
    file_size INTEGER,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. USAGE_LOGS TABLE
-- Stores token usage for billing
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    operation_type TEXT, -- 'chat', 'knowledge_query', etc.
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREATE INDEXES for better performance
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_platform ON companies(platform);
CREATE INDEX IF NOT EXISTS idx_bots_company_id ON bots(company_id);
CREATE INDEX IF NOT EXISTS idx_bots_user_id ON bots(user_id);
CREATE INDEX IF NOT EXISTS idx_bots_platform ON bots(platform);
CREATE INDEX IF NOT EXISTS idx_activities_company_id ON activities(company_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_company_id ON knowledge_bases(company_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_company_id ON subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_subscription_id ON usage_logs(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_bot_id ON conversations(bot_id);

-- INSERT DEFAULT PLANS
INSERT INTO plans (name, price, token_limit, features) VALUES
('Free Plan', 0, 1000, '{"bots": 1, "knowledge_items": 10}'),
('Pro Plan', 29.99, 10000, '{"bots": 5, "knowledge_items": 100}'),
('Enterprise Plan', 99.99, 50000, '{"bots": 20, "knowledge_items": 500}')
ON CONFLICT DO NOTHING;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Platform enforcement trigger function
-- Ensures all bots created for a company match the company's platform
CREATE OR REPLACE FUNCTION check_bot_platform_matches_company()
RETURNS TRIGGER AS $$
DECLARE
    company_platform TEXT;
BEGIN
    -- Get the company's platform
    SELECT platform INTO company_platform
    FROM companies
    WHERE id = NEW.company_id;

    -- Check if bot platform matches company platform
    IF NEW.platform != company_platform THEN
        RAISE EXCEPTION 'Bot platform (%) does not match company platform (%). Cannot create % bot for % company.',
            NEW.platform, company_platform, NEW.platform, company_platform;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bots_updated_at BEFORE UPDATE ON bots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_bases_updated_at BEFORE UPDATE ON knowledge_bases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to enforce platform matching
CREATE TRIGGER enforce_bot_platform_matches_company
    BEFORE INSERT OR UPDATE ON bots
    FOR EACH ROW
    EXECUTE FUNCTION check_bot_platform_matches_company();

COMMENT ON TABLE companies IS 'Stores user companies/organizations';
COMMENT ON TABLE plans IS 'Available subscription plans';
COMMENT ON TABLE subscriptions IS 'User subscriptions to plans';
COMMENT ON TABLE bots IS 'Bot configurations for different platforms';
COMMENT ON TABLE conversations IS 'Conversation metadata for message counting';
COMMENT ON TABLE activities IS 'Activity logs for dashboard display';
COMMENT ON TABLE knowledge_bases IS 'Knowledge base content for bots';
COMMENT ON TABLE usage_logs IS 'Token usage tracking for billing';