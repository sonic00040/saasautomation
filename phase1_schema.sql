-- Create the companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telegram_bot_token TEXT UNIQUE,
    whatsapp_identifier TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create the plans table
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    token_limit BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create the subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create the usage_logs table
CREATE TABLE usage_logs (
    id BIGSERIAL PRIMARY KEY,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    total_tokens INT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- Create the knowledge_bases table
CREATE TABLE knowledge_bases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create the get_total_usage function
CREATE OR REPLACE FUNCTION get_total_usage(
    p_subscription_id UUID,
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ
)
RETURNS INT AS $$
DECLARE
    total_usage INT;
BEGIN
    SELECT COALESCE(SUM(total_tokens), 0)
    INTO total_usage
    FROM usage_logs
    WHERE subscription_id = p_subscription_id
    AND timestamp >= p_start_date
    AND timestamp <= p_end_date;

    RETURN total_usage;
END;
$$ LANGUAGE plpgsql;
