-- Fix RLS Performance Issues - Optimize auth function calls
-- This migration addresses Supabase warnings about auth function re-evaluation

-- =======================
-- 1. USER_PROFILES TABLE
-- =======================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Create optimized policies using (select auth.function())
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (id = (select auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (id = (select auth.uid()));

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (id = (select auth.uid()));

-- =======================
-- 2. INDIVIDUAL_PROFILES TABLE
-- =======================

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage their own individual profile" ON public.individual_profiles;

-- Create optimized policy
CREATE POLICY "Users can manage their own individual profile" ON public.individual_profiles
    FOR ALL USING (user_id = (select auth.uid()));

-- =======================
-- 3. COMPANY_PROFILES TABLE
-- =======================

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage their own company profile" ON public.company_profiles;

-- Create optimized policy
CREATE POLICY "Users can manage their own company profile" ON public.company_profiles
    FOR ALL USING (user_id = (select auth.uid()));

-- =======================
-- 4. JOBS TABLE
-- =======================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
DROP POLICY IF EXISTS "Company members can manage their jobs" ON public.jobs;

-- Create consolidated optimized policy
CREATE POLICY "Jobs access policy" ON public.jobs
    FOR SELECT USING (
        status = 'active' OR 
        EXISTS (
            SELECT 1 FROM public.company_profiles cp 
            WHERE cp.id = jobs.company_id 
            AND cp.user_id = (select auth.uid())
        )
    );

-- Separate policy for company management
CREATE POLICY "Company members can manage their jobs" ON public.jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.company_profiles cp 
            WHERE cp.id = jobs.company_id 
            AND cp.user_id = (select auth.uid())
        )
    );

-- =======================
-- 5. APPLICATIONS TABLE
-- =======================

-- Drop existing policies
DROP POLICY IF EXISTS "Candidates can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Candidates can create applications" ON public.applications;
DROP POLICY IF EXISTS "Candidates can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Companies can view applications to their jobs" ON public.applications;

-- Create consolidated optimized policy for SELECT
CREATE POLICY "Applications view policy" ON public.applications
    FOR SELECT USING (
        candidate_id = (select auth.uid()) OR
        EXISTS (
            SELECT 1 FROM public.jobs j 
            JOIN public.company_profiles cp ON j.company_id = cp.id
            WHERE j.id = applications.job_id 
            AND cp.user_id = (select auth.uid())
        )
    );

-- Separate policies for other operations
CREATE POLICY "Candidates can create applications" ON public.applications
    FOR INSERT WITH CHECK (candidate_id = (select auth.uid()));

CREATE POLICY "Candidates can update their own applications" ON public.applications
    FOR UPDATE USING (candidate_id = (select auth.uid()));

-- =======================
-- 6. USER_SKILLS TABLE
-- =======================

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage their own skills" ON public.user_skills;

-- Create optimized policy
CREATE POLICY "Users can manage their own skills" ON public.user_skills
    FOR ALL USING (user_id = (select auth.uid()));

-- =======================
-- 7. MESSAGES TABLE
-- =======================

-- Drop existing policy
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;

-- Create optimized policy
CREATE POLICY "Users can view their messages" ON public.messages
    FOR SELECT USING (
        sender_id = (select auth.uid()) OR 
        recipient_id = (select auth.uid())
    );

-- =======================
-- 8. REFERRAL_PROGRAMS TABLE
-- =======================

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage their own referrals" ON public.referral_programs;

-- Create optimized policy
CREATE POLICY "Users can manage their own referrals" ON public.referral_programs
    FOR ALL USING (user_id = (select auth.uid()));

-- =======================
-- 9. CV_DOCUMENTS TABLE
-- =======================

-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage their own CVs" ON public.cv_documents;

-- Create optimized policy
CREATE POLICY "Users can manage their own CVs" ON public.cv_documents
    FOR ALL USING (user_id = (select auth.uid()));

-- =======================
-- Performance Indexes
-- =======================

-- Add indexes to support the RLS policies efficiently
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_id ON public.user_profiles(id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_individual_profiles_user_id ON public.individual_profiles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_company_profiles_user_id ON public.company_profiles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_candidate_id ON public.applications(candidate_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_referral_programs_user_id ON public.referral_programs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cv_documents_user_id ON public.cv_documents(user_id);

-- =======================
-- Additional Performance Tables
-- =======================

-- Create tables for new features if they don't exist
CREATE TABLE IF NOT EXISTS public.system_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    level text NOT NULL,
    message text NOT NULL,
    timestamp timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id),
    endpoint text,
    method text,
    status_code integer,
    response_time integer,
    ip_address text,
    user_agent text,
    metadata jsonb,
    stack_trace text,
    request_id text
);

CREATE TABLE IF NOT EXISTS public.error_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    error_type text NOT NULL,
    error_message text NOT NULL,
    error_stack text,
    user_id uuid REFERENCES auth.users(id),
    endpoint text,
    timestamp timestamptz DEFAULT now(),
    metadata jsonb
);

CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    endpoint text NOT NULL,
    timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_rate_limits (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    endpoint text NOT NULL,
    timestamp timestamptz DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admin can view system logs" ON public.system_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = (select auth.uid()) 
            AND up.role = 'admin'
        )
    );

CREATE POLICY "Admin can view error logs" ON public.error_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = (select auth.uid()) 
            AND up.role = 'admin'
        )
    );

-- System can insert logs
CREATE POLICY "System can insert logs" ON public.system_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert error logs" ON public.error_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert rate limit logs" ON public.rate_limit_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert user rate limits" ON public.user_rate_limits
    FOR INSERT WITH CHECK (true);

-- Add indexes for log tables
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_logs_timestamp ON public.system_logs(timestamp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_logs_user_id ON public.system_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_timestamp ON public.error_logs(timestamp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limit_logs_timestamp ON public.rate_limit_logs(timestamp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limit_logs_user_id ON public.rate_limit_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_rate_limits_timestamp ON public.user_rate_limits(timestamp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_rate_limits_user_id ON public.user_rate_limits(user_id);

-- =======================
-- Comments for Documentation
-- =======================

COMMENT ON TABLE public.system_logs IS 'System-wide logging for monitoring and debugging';
COMMENT ON TABLE public.error_logs IS 'Error tracking and debugging information';
COMMENT ON TABLE public.rate_limit_logs IS 'Rate limiting tracking for abuse prevention';
COMMENT ON TABLE public.user_rate_limits IS 'User-specific rate limiting tracking';

-- =======================
-- Performance Statistics
-- =======================

-- Analyze tables for better query planning
ANALYZE public.user_profiles;
ANALYZE public.individual_profiles;
ANALYZE public.company_profiles;
ANALYZE public.jobs;
ANALYZE public.applications;
ANALYZE public.user_skills;
ANALYZE public.messages;
ANALYZE public.referral_programs;
ANALYZE public.cv_documents;