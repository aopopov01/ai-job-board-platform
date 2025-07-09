-- Create user_integrations table
CREATE TABLE IF NOT EXISTS user_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL CHECK (integration_type IN ('linkedin', 'github', 'ats')),
    integration_data JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, integration_type)
);

-- Create ATS integrations table
CREATE TABLE IF NOT EXISTS ats_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    ats_type VARCHAR(50) NOT NULL CHECK (ats_type IN ('greenhouse', 'workday', 'lever', 'bamboohr', 'smartrecruiters', 'jobvite', 'custom')),
    api_endpoint VARCHAR(500) NOT NULL,
    encrypted_credentials TEXT NOT NULL,
    additional_config JSONB DEFAULT '{}',
    sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'completed', 'failed')),
    last_sync TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, ats_type)
);

-- Create indexes for user_integrations
CREATE INDEX IF NOT EXISTS user_integrations_user_id_idx ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS user_integrations_type_idx ON user_integrations(integration_type);
CREATE INDEX IF NOT EXISTS user_integrations_active_idx ON user_integrations(is_active);

-- Create indexes for ats_integrations
CREATE INDEX IF NOT EXISTS ats_integrations_company_id_idx ON ats_integrations(company_id);
CREATE INDEX IF NOT EXISTS ats_integrations_type_idx ON ats_integrations(ats_type);
CREATE INDEX IF NOT EXISTS ats_integrations_active_idx ON ats_integrations(is_active);
CREATE INDEX IF NOT EXISTS ats_integrations_sync_status_idx ON ats_integrations(sync_status);

-- Enable RLS on integration tables
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_integrations
CREATE POLICY "Users can view their own integrations" ON user_integrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integrations" ON user_integrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" ON user_integrations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" ON user_integrations
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for ats_integrations
CREATE POLICY "Companies can view their own ATS integrations" ON ats_integrations
    FOR SELECT USING (auth.uid() = company_id);

CREATE POLICY "Companies can insert their own ATS integrations" ON ats_integrations
    FOR INSERT WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Companies can update their own ATS integrations" ON ats_integrations
    FOR UPDATE USING (auth.uid() = company_id);

CREATE POLICY "Companies can delete their own ATS integrations" ON ats_integrations
    FOR DELETE USING (auth.uid() = company_id);

-- Add ATS-related columns to jobs table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'jobs' AND column_name = 'ats_job_id') THEN
        ALTER TABLE jobs ADD COLUMN ats_job_id VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'jobs' AND column_name = 'ats_source') THEN
        ALTER TABLE jobs ADD COLUMN ats_source VARCHAR(50);
    END IF;
END $$;

-- Add ATS-related columns to applications table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'ats_candidate_id') THEN
        ALTER TABLE applications ADD COLUMN ats_candidate_id VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'ats_source') THEN
        ALTER TABLE applications ADD COLUMN ats_source VARCHAR(50);
    END IF;
END $$;

-- Add GitHub-related columns to individual_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'individual_profiles' AND column_name = 'github_username') THEN
        ALTER TABLE individual_profiles ADD COLUMN github_username VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'individual_profiles' AND column_name = 'github_stats') THEN
        ALTER TABLE individual_profiles ADD COLUMN github_stats JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'individual_profiles' AND column_name = 'portfolio_url') THEN
        ALTER TABLE individual_profiles ADD COLUMN portfolio_url VARCHAR(500);
    END IF;
END $$;

-- Add GitHub and LinkedIn URLs to user_profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'github_url') THEN
        ALTER TABLE user_profiles ADD COLUMN github_url VARCHAR(500);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'linkedin_url') THEN
        ALTER TABLE user_profiles ADD COLUMN linkedin_url VARCHAR(500);
    END IF;
END $$;

-- Create integration sync jobs table for background processing
CREATE TABLE IF NOT EXISTS integration_sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL,
    job_type VARCHAR(50) NOT NULL CHECK (job_type IN ('profile_sync', 'data_import', 'webhook_process')),
    job_data JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for integration_sync_jobs
CREATE INDEX IF NOT EXISTS integration_sync_jobs_user_id_idx ON integration_sync_jobs(user_id);
CREATE INDEX IF NOT EXISTS integration_sync_jobs_type_idx ON integration_sync_jobs(integration_type);
CREATE INDEX IF NOT EXISTS integration_sync_jobs_status_idx ON integration_sync_jobs(status);
CREATE INDEX IF NOT EXISTS integration_sync_jobs_scheduled_idx ON integration_sync_jobs(scheduled_at);

-- Enable RLS on integration_sync_jobs
ALTER TABLE integration_sync_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for integration_sync_jobs
CREATE POLICY "Users can view their own sync jobs" ON integration_sync_jobs
    FOR SELECT USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_integrations_updated_at 
    BEFORE UPDATE ON user_integrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ats_integrations_updated_at 
    BEFORE UPDATE ON ats_integrations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle integration cleanup
CREATE OR REPLACE FUNCTION cleanup_integration_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Clean up related sync jobs when integration is deactivated
    IF OLD.is_active = true AND NEW.is_active = false THEN
        UPDATE integration_sync_jobs 
        SET status = 'cancelled' 
        WHERE user_id = NEW.user_id 
        AND integration_type = NEW.integration_type 
        AND status IN ('pending', 'processing');
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for integration cleanup
CREATE TRIGGER cleanup_integration_data_trigger
    AFTER UPDATE ON user_integrations
    FOR EACH ROW EXECUTE FUNCTION cleanup_integration_data();

-- Create function to schedule regular integration syncs
CREATE OR REPLACE FUNCTION schedule_integration_sync()
RETURNS void AS $$
BEGIN
    -- Schedule daily sync for active integrations
    INSERT INTO integration_sync_jobs (user_id, integration_type, job_type, scheduled_at)
    SELECT 
        user_id, 
        integration_type, 
        'profile_sync',
        NOW() + INTERVAL '1 day'
    FROM user_integrations 
    WHERE is_active = true
    AND integration_type IN ('linkedin', 'github')
    AND NOT EXISTS (
        SELECT 1 FROM integration_sync_jobs 
        WHERE user_integrations.user_id = integration_sync_jobs.user_id 
        AND user_integrations.integration_type = integration_sync_jobs.integration_type
        AND status = 'pending'
        AND scheduled_at > NOW()
    );
END;
$$ language 'plpgsql';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS jobs_ats_job_id_idx ON jobs(ats_job_id) WHERE ats_job_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS jobs_ats_source_idx ON jobs(ats_source) WHERE ats_source IS NOT NULL;
CREATE INDEX IF NOT EXISTS applications_ats_candidate_id_idx ON applications(ats_candidate_id) WHERE ats_candidate_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS individual_profiles_github_username_idx ON individual_profiles(github_username) WHERE github_username IS NOT NULL;