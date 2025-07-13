-- SUPABASE SECURITY FIXES FOR TALENTAIZE PLATFORM
-- Run this script in your Supabase SQL Editor to fix RLS security issues

-- =============================================================================
-- IMMEDIATE FIX: Enable RLS on job_categories table
-- =============================================================================

-- Enable RLS on job_categories table (fixes the immediate security alert)
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to job categories (they're typically public data)
CREATE POLICY "Public can view job categories" 
ON public.job_categories 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Only authenticated admins can manage job categories
CREATE POLICY "Admin can manage job categories" 
ON public.job_categories 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- =============================================================================
-- CORE TABLES SECURITY: User Profiles
-- =============================================================================

-- Enable RLS on user profile tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and edit their own profile
CREATE POLICY "Users can manage their own profile" 
ON public.user_profiles 
FOR ALL 
TO authenticated 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Public can view basic profile info for job applications
CREATE POLICY "Public can view basic profile info" 
ON public.user_profiles 
FOR SELECT 
TO anon, authenticated 
USING (is_public_profile = true);

-- =============================================================================
-- JOBS SECURITY
-- =============================================================================

-- Enable RLS on jobs table
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Public can view active jobs
CREATE POLICY "Public can view active jobs" 
ON public.jobs 
FOR SELECT 
TO anon, authenticated 
USING (status = 'active' OR status = 'published');

-- Companies can manage their own jobs
CREATE POLICY "Companies can manage their own jobs" 
ON public.jobs 
FOR ALL 
TO authenticated 
USING (
    company_id = auth.uid() OR 
    created_by = auth.uid()
);

-- =============================================================================
-- APPLICATIONS SECURITY
-- =============================================================================

-- Enable RLS on applications table
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Candidates can view their own applications
CREATE POLICY "Candidates can view their own applications" 
ON public.applications 
FOR SELECT 
TO authenticated 
USING (candidate_id = auth.uid());

-- Candidates can create applications
CREATE POLICY "Candidates can apply for jobs" 
ON public.applications 
FOR INSERT 
TO authenticated 
WITH CHECK (candidate_id = auth.uid());

-- Companies can view applications for their jobs
CREATE POLICY "Companies can view applications for their jobs" 
ON public.applications 
FOR SELECT 
TO authenticated 
USING (
    job_id IN (
        SELECT id FROM public.jobs 
        WHERE company_id = auth.uid() OR created_by = auth.uid()
    )
);

-- Companies can update application status
CREATE POLICY "Companies can update application status" 
ON public.applications 
FOR UPDATE 
TO authenticated 
USING (
    job_id IN (
        SELECT id FROM public.jobs 
        WHERE company_id = auth.uid() OR created_by = auth.uid()
    )
);

-- =============================================================================
-- SKILLS SECURITY
-- =============================================================================

-- Enable RLS on skills table
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Skills are publicly viewable (for job requirements and user skills)
CREATE POLICY "Skills are publicly viewable" 
ON public.skills 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Only admins can manage skills
CREATE POLICY "Admins can manage skills" 
ON public.skills 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- =============================================================================
-- PERFORMANCE INDEXES FOR RLS POLICIES
-- =============================================================================

-- Add indexes to support RLS policy performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_job_categories_created_at 
ON public.job_categories(created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_company_id 
ON public.jobs(company_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_status 
ON public.jobs(status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_created_by 
ON public.jobs(created_by);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_candidate_id 
ON public.applications(candidate_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_applications_job_id 
ON public.applications(job_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_is_public 
ON public.user_profiles(is_public_profile);

-- =============================================================================
-- SECURITY HELPER FUNCTIONS
-- =============================================================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  );
$$;

-- Helper function to check if user owns a company
CREATE OR REPLACE FUNCTION auth.is_company_owner(company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE (company_id = $1 OR created_by = auth.uid())
    AND (company_id = auth.uid() OR created_by = auth.uid())
  );
$$;

-- =============================================================================
-- AUDIT AND MONITORING
-- =============================================================================

-- Create security events table if not exists
CREATE TABLE IF NOT EXISTS public.security_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    event_type text NOT NULL,
    table_name text,
    operation text,
    ip_address inet,
    user_agent text,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only admins can view security events
CREATE POLICY "Admins can view security events" 
ON public.security_events 
FOR SELECT 
TO authenticated 
USING (auth.is_admin());

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    event_type text,
    table_name text DEFAULT NULL,
    operation text DEFAULT NULL,
    metadata jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.security_events (
        user_id, event_type, table_name, operation, metadata
    ) VALUES (
        auth.uid(), event_type, table_name, operation, metadata
    );
END;
$$;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Test RLS is working properly
-- Run these to verify your security is working:

-- 1. Test job_categories can be read publicly
-- SELECT * FROM public.job_categories LIMIT 5;

-- 2. Test user can only see their own profile
-- SELECT * FROM public.user_profiles WHERE id = auth.uid();

-- 3. Test public can view active jobs
-- SELECT * FROM public.jobs WHERE status = 'active' LIMIT 5;

-- 4. Test applications are properly restricted
-- SELECT * FROM public.applications WHERE candidate_id = auth.uid();

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

SELECT 'TalentAIze RLS Security Fix Applied Successfully! ⚡' AS status,
       'Your job_categories table and other core tables now have proper Row Level Security enabled.' AS message,
       'Run verification queries to test the security implementation.' AS next_step;