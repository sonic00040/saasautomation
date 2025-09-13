-- BotAI Supabase Database Functions
-- Run this script in your Supabase Dashboard > SQL Editor after running supabase-schema.sql
-- This creates all required functions and RPC procedures

-- 1. GET_TOTAL_USAGE Function
-- Used by getUserUsage() in api.ts to calculate token usage
CREATE OR REPLACE FUNCTION get_total_usage(
    p_subscription_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE,
    p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_usage INTEGER := 0;
BEGIN
    -- Calculate total token usage for the subscription within the date range
    SELECT COALESCE(SUM(tokens_used), 0)
    INTO total_usage
    FROM usage_logs
    WHERE subscription_id = p_subscription_id
    AND created_at BETWEEN p_start_date AND COALESCE(p_end_date, NOW());

    RETURN total_usage;
END;
$$;

-- 2. LOG_USAGE Function
-- Helper function to log token usage
CREATE OR REPLACE FUNCTION log_usage(
    p_subscription_id UUID,
    p_tokens_used INTEGER,
    p_operation_type TEXT DEFAULT 'chat',
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    usage_id UUID;
BEGIN
    INSERT INTO usage_logs (subscription_id, tokens_used, operation_type, metadata)
    VALUES (p_subscription_id, p_tokens_used, p_operation_type, p_metadata)
    RETURNING id INTO usage_id;

    RETURN usage_id;
END;
$$;

-- 3. GET_USER_METRICS Function
-- Helper function to get dashboard metrics for a company
CREATE OR REPLACE FUNCTION get_user_metrics(p_company_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    total_bots INTEGER := 0;
    active_bots INTEGER := 0;
    total_messages INTEGER := 0;
    current_usage INTEGER := 0;
    monthly_limit INTEGER := 1000;
    plan_name TEXT := 'Free Plan';
BEGIN
    -- Count bots
    SELECT COUNT(*), COUNT(*) FILTER (WHERE is_active = true)
    INTO total_bots, active_bots
    FROM bots
    WHERE company_id = p_company_id;

    -- Count total messages across all conversations for this company's bots
    SELECT COALESCE(SUM(c.message_count), 0)
    INTO total_messages
    FROM conversations c
    JOIN bots b ON c.bot_id = b.id
    WHERE b.company_id = p_company_id;

    -- Get current subscription info
    SELECT
        COALESCE(p.token_limit, 1000),
        COALESCE(p.name, 'Free Plan')
    INTO monthly_limit, plan_name
    FROM subscriptions s
    JOIN plans p ON s.plan_id = p.id
    WHERE s.company_id = p_company_id
    AND s.is_active = true
    LIMIT 1;

    -- Get current usage
    SELECT COALESCE(SUM(ul.tokens_used), 0)
    INTO current_usage
    FROM usage_logs ul
    JOIN subscriptions s ON ul.subscription_id = s.id
    WHERE s.company_id = p_company_id
    AND s.is_active = true
    AND ul.created_at >= DATE_TRUNC('month', NOW());

    -- Build result JSON
    SELECT json_build_object(
        'totalBots', total_bots,
        'activeBots', active_bots,
        'totalMessages', total_messages,
        'currentUsage', current_usage,
        'monthlyLimit', monthly_limit,
        'planName', plan_name
    ) INTO result;

    RETURN result;
END;
$$;

-- 4. INCREMENT_MESSAGE_COUNT Function
-- Helper to increment message count for conversations
CREATE OR REPLACE FUNCTION increment_message_count(
    p_bot_id UUID,
    p_user_id TEXT,
    p_increment INTEGER DEFAULT 1
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    conversation_id UUID;
BEGIN
    INSERT INTO conversations (bot_id, user_id, message_count, last_message_at)
    VALUES (p_bot_id, p_user_id, p_increment, NOW())
    ON CONFLICT (bot_id, user_id)
    DO UPDATE SET
        message_count = conversations.message_count + p_increment,
        last_message_at = NOW(),
        updated_at = NOW()
    RETURNING id INTO conversation_id;

    RETURN conversation_id;
END;
$$;

-- 5. GET_RECENT_ACTIVITIES Function
-- Get recent activities for a company (used by dashboard)
CREATE OR REPLACE FUNCTION get_recent_activities(
    p_company_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    type TEXT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    bot_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.type,
        a.description,
        a.metadata,
        a.created_at,
        COALESCE(a.metadata->>'botName', 'AI Bot') as bot_name
    FROM activities a
    WHERE a.company_id = p_company_id
    ORDER BY a.created_at DESC
    LIMIT p_limit;
END;
$$;

-- 6. ENSURE_USER_COMPANY Function
-- Automatically creates a company for a user if it doesn't exist
CREATE OR REPLACE FUNCTION ensure_user_company(p_user_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    company_id UUID;
    company_name TEXT;
BEGIN
    -- Try to find existing company
    SELECT id INTO company_id
    FROM companies
    WHERE email = p_user_email;

    -- If not found, create one
    IF company_id IS NULL THEN
        -- Generate company name from email
        company_name := INITCAP(SPLIT_PART(p_user_email, '@', 1)) || '''s Company';

        INSERT INTO companies (name, email)
        VALUES (company_name, p_user_email)
        RETURNING id INTO company_id;

        -- Create default free subscription
        INSERT INTO subscriptions (company_id, plan_id, is_active)
        SELECT company_id, p.id, true
        FROM plans p
        WHERE p.name = 'Free Plan'
        LIMIT 1;
    END IF;

    RETURN company_id;
END;
$$;

-- 7. NOW Function (for basic connection testing)
CREATE OR REPLACE FUNCTION now()
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT NOW();
$$;

-- Grant necessary permissions
-- These functions can be called by authenticated users
GRANT EXECUTE ON FUNCTION get_total_usage TO authenticated;
GRANT EXECUTE ON FUNCTION log_usage TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION increment_message_count TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_activities TO authenticated;
GRANT EXECUTE ON FUNCTION ensure_user_company TO authenticated;
GRANT EXECUTE ON FUNCTION now TO anon, authenticated;

COMMENT ON FUNCTION get_total_usage IS 'Calculate total token usage for a subscription within date range';
COMMENT ON FUNCTION log_usage IS 'Log token usage for billing tracking';
COMMENT ON FUNCTION get_user_metrics IS 'Get dashboard metrics for a company';
COMMENT ON FUNCTION increment_message_count IS 'Increment message count for bot conversations';
COMMENT ON FUNCTION get_recent_activities IS 'Get recent activities for dashboard display';
COMMENT ON FUNCTION ensure_user_company IS 'Ensure user has a company, create if needed';
COMMENT ON FUNCTION now IS 'Get current timestamp (for connection testing)';