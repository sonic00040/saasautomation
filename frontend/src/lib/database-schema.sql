-- Knowledge Base Files Table
CREATE TABLE IF NOT EXISTS knowledge_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  size BIGINT NOT NULL,
  type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  chunks INTEGER DEFAULT 0,
  category TEXT,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_knowledge_files_user_id ON knowledge_files(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_files_processed ON knowledge_files(processed);
CREATE INDEX IF NOT EXISTS idx_knowledge_files_category ON knowledge_files(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_files_uploaded_at ON knowledge_files(uploaded_at);

-- Enable Row Level Security
ALTER TABLE knowledge_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own knowledge files" ON knowledge_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own knowledge files" ON knowledge_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge files" ON knowledge_files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge files" ON knowledge_files
  FOR DELETE USING (auth.uid() = user_id);

-- Bot Configurations Table
CREATE TABLE IF NOT EXISTS bot_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  last_activity TIMESTAMP WITH TIME ZONE,
  messages_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for bot configurations
CREATE INDEX IF NOT EXISTS idx_bot_configurations_user_id ON bot_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_configurations_status ON bot_configurations(status);

-- Enable Row Level Security for bot configurations
ALTER TABLE bot_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bot configurations
CREATE POLICY "Users can view their own bot configurations" ON bot_configurations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bot configurations" ON bot_configurations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bot configurations" ON bot_configurations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bot configurations" ON bot_configurations
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics Data Table
CREATE TABLE IF NOT EXISTS analytics_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_id UUID REFERENCES bot_configurations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_data_user_id ON analytics_data(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_bot_id ON analytics_data(bot_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_event_type ON analytics_data(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_data_timestamp ON analytics_data(timestamp);

-- Enable Row Level Security for analytics
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics
CREATE POLICY "Users can view their own analytics data" ON analytics_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics data" ON analytics_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_name TEXT NOT NULL,
  plan_price INTEGER NOT NULL, -- in cents
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- Enable Row Level Security for subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Usage Tracking Table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'messages', 'storage', 'api_calls'
  value INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for usage tracking
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_metric_type ON usage_tracking(metric_type);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(period_start, period_end);

-- Enable Row Level Security for usage tracking
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for usage tracking
CREATE POLICY "Users can view their own usage data" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

-- Create Storage Bucket (this should be run in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('knowledge-base', 'knowledge-base', false);

-- Storage Policies (this should be run in Supabase dashboard)
-- CREATE POLICY "Users can upload their own files" ON storage.objects
--   FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view their own files" ON storage.objects
--   FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own files" ON storage.objects
--   FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_knowledge_files_updated_at BEFORE UPDATE ON knowledge_files 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_configurations_updated_at BEFORE UPDATE ON bot_configurations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();