-- BotAI Supabase Row Level Security (RLS) Policies
-- Run this script in your Supabase Dashboard > SQL Editor after running the schema and functions
-- This sets up proper security so users can only access their own data

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- ===== COMPANIES TABLE POLICIES =====

-- Users can read their own company (by user_id)
CREATE POLICY "Users can read own company" ON companies
FOR SELECT USING (
    user_id = auth.uid()
);

-- Users can create companies (for initial signup/onboarding)
CREATE POLICY "Users can create companies" ON companies
FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

-- Users can update their own company
CREATE POLICY "Users can update own company" ON companies
FOR UPDATE USING (
    user_id = auth.uid()
) WITH CHECK (
    user_id = auth.uid()
);

-- ===== PLANS TABLE POLICIES =====

-- Everyone can read plans (they're public)
CREATE POLICY "Plans are publicly readable" ON plans
FOR SELECT USING (true);

-- ===== SUBSCRIPTIONS TABLE POLICIES =====

-- Users can read subscriptions for their company
CREATE POLICY "Users can read own subscriptions" ON subscriptions
FOR SELECT USING (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
);

-- Users can create subscriptions for their company
CREATE POLICY "Users can create subscriptions" ON subscriptions
FOR INSERT WITH CHECK (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions" ON subscriptions
FOR UPDATE USING (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
) WITH CHECK (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
);

-- ===== BOTS TABLE POLICIES =====

-- Users can read bots for their company
CREATE POLICY "Users can read own bots" ON bots
FOR SELECT USING (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
    OR user_id = auth.uid()::text
);

-- Users can create bots for their company
CREATE POLICY "Users can create bots" ON bots
FOR INSERT WITH CHECK (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
    AND user_id = auth.uid()::text
);

-- Users can update their own bots
CREATE POLICY "Users can update own bots" ON bots
FOR UPDATE USING (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
    AND user_id = auth.uid()::text
) WITH CHECK (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
    AND user_id = auth.uid()::text
);

-- Users can delete their own bots
CREATE POLICY "Users can delete own bots" ON bots
FOR DELETE USING (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
    AND user_id = auth.uid()::text
);

-- ===== CONVERSATIONS TABLE POLICIES =====

-- Users can read conversations for their bots
CREATE POLICY "Users can read own conversations" ON conversations
FOR SELECT USING (
    bot_id IN (
        SELECT id FROM bots
        WHERE company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    )
);

-- Users can create/update conversations for their bots
CREATE POLICY "Users can manage own conversations" ON conversations
FOR ALL USING (
    bot_id IN (
        SELECT id FROM bots
        WHERE company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    )
) WITH CHECK (
    bot_id IN (
        SELECT id FROM bots
        WHERE company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    )
);

-- ===== ACTIVITIES TABLE POLICIES =====

-- Users can read activities for their company
CREATE POLICY "Users can read own activities" ON activities
FOR SELECT USING (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
    OR user_id = auth.uid()
);

-- Users can create activities for their company
CREATE POLICY "Users can create activities" ON activities
FOR INSERT WITH CHECK (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
    AND user_id = auth.uid()
);

-- ===== KNOWLEDGE_BASES TABLE POLICIES =====

-- Users can read knowledge base for their company
CREATE POLICY "Users can read own knowledge" ON knowledge_bases
FOR SELECT USING (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
);

-- Users can create knowledge base entries for their company
CREATE POLICY "Users can create knowledge" ON knowledge_bases
FOR INSERT WITH CHECK (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
);

-- Users can update their knowledge base
CREATE POLICY "Users can update own knowledge" ON knowledge_bases
FOR UPDATE USING (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
) WITH CHECK (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
);

-- Users can delete their knowledge base entries
CREATE POLICY "Users can delete own knowledge" ON knowledge_bases
FOR DELETE USING (
    company_id IN (
        SELECT id FROM companies WHERE user_id = auth.uid()
    )
);

-- ===== USAGE_LOGS TABLE POLICIES =====

-- Users can read usage logs for their subscriptions
CREATE POLICY "Users can read own usage" ON usage_logs
FOR SELECT USING (
    subscription_id IN (
        SELECT s.id FROM subscriptions s
        JOIN companies c ON s.company_id = c.id
        WHERE c.user_id = auth.uid()
    )
);

-- Users can create usage logs for their subscriptions
CREATE POLICY "Users can create usage logs" ON usage_logs
FOR INSERT WITH CHECK (
    subscription_id IN (
        SELECT s.id FROM subscriptions s
        JOIN companies c ON s.company_id = c.id
        WHERE c.user_id = auth.uid()
    )
);

-- ===== HELPER FUNCTION FOR RLS =====

-- Function to get user's company ID (useful for other policies)
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT id FROM companies WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Grant access to the helper function
GRANT EXECUTE ON FUNCTION get_user_company_id TO authenticated;

-- ===== ADDITIONAL SECURITY =====

-- Ensure only authenticated users can access data
-- (This is automatically enforced by RLS, but good to be explicit)

-- Allow service role to bypass RLS for admin operations
-- (Supabase service role has bypassrls permission by default)

COMMENT ON POLICY "Users can read own company" ON companies IS 'Users can only read their own company data';
COMMENT ON POLICY "Users can read own bots" ON bots IS 'Users can only read bots from their company';
COMMENT ON POLICY "Users can read own activities" ON activities IS 'Users can only read activities from their company';
COMMENT ON POLICY "Users can read own knowledge" ON knowledge_bases IS 'Users can only read knowledge from their company';