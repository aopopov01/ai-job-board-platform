-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    plan_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
    stripe_subscription_id VARCHAR(100) UNIQUE,
    stripe_customer_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for subscriptions
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);

-- Create candidate_searches table for tracking usage
CREATE TABLE IF NOT EXISTS candidate_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    search_query TEXT,
    filters JSONB,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for candidate_searches
CREATE INDEX IF NOT EXISTS candidate_searches_company_id_idx ON candidate_searches(company_id);
CREATE INDEX IF NOT EXISTS candidate_searches_created_at_idx ON candidate_searches(created_at);

-- Enable RLS on new tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_searches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for candidate_searches
CREATE POLICY "Companies can view their own searches" ON candidate_searches
    FOR SELECT USING (auth.uid() = company_id);

CREATE POLICY "Companies can insert their own searches" ON candidate_searches
    FOR INSERT WITH CHECK (auth.uid() = company_id);

-- Add subscription_plan column to user_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'subscription_plan') THEN
        ALTER TABLE user_profiles ADD COLUMN subscription_plan VARCHAR(100) DEFAULT 'free';
    END IF;
END $$;

-- Add subscription_plan column to individual_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'individual_profiles' AND column_name = 'subscription_plan') THEN
        ALTER TABLE individual_profiles ADD COLUMN subscription_plan VARCHAR(100) DEFAULT 'individual_free';
    END IF;
END $$;

-- Add subscription_plan column to company_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'company_profiles' AND column_name = 'subscription_plan') THEN
        ALTER TABLE company_profiles ADD COLUMN subscription_plan VARCHAR(100) DEFAULT 'company_free';
    END IF;
END $$;

-- Add fraud detection columns to applications if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'fraud_score') THEN
        ALTER TABLE applications ADD COLUMN fraud_score DECIMAL(3,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'fraud_flags') THEN
        ALTER TABLE applications ADD COLUMN fraud_flags TEXT[];
    END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for subscriptions updated_at
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();