-- Additional RLS Policy Optimizations
-- This migration further optimizes RLS policies to reduce function calls

-- =======================
-- Create function to get current user ID once
-- =======================

CREATE OR REPLACE FUNCTION auth.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

-- =======================
-- Create function to check if user is admin
-- =======================

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- =======================
-- Create function to check company membership
-- =======================

CREATE OR REPLACE FUNCTION auth.is_company_member(company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.company_profiles 
    WHERE id = company_id AND user_id = auth.uid()
  );
$$;

-- =======================
-- Advanced RLS Policy Optimizations
-- =======================

-- Drop and recreate jobs policies with better performance
DROP POLICY IF EXISTS "Jobs access policy" ON public.jobs;
DROP POLICY IF EXISTS "Company members can manage their jobs" ON public.jobs;

-- Single optimized policy for jobs
CREATE POLICY "Jobs comprehensive policy" ON public.jobs
    FOR SELECT USING (
        status = 'active' OR 
        company_id IN (
            SELECT id FROM public.company_profiles 
            WHERE user_id = auth.current_user_id()
        )
    );

-- Management policy for jobs
CREATE POLICY "Jobs management policy" ON public.jobs
    FOR ALL USING (
        company_id IN (
            SELECT id FROM public.company_profiles 
            WHERE user_id = auth.current_user_id()
        )
    );

-- Optimized applications policy
DROP POLICY IF EXISTS "Applications view policy" ON public.applications;

CREATE POLICY "Applications optimized view policy" ON public.applications
    FOR SELECT USING (
        candidate_id = auth.current_user_id() OR
        job_id IN (
            SELECT j.id FROM public.jobs j
            JOIN public.company_profiles cp ON j.company_id = cp.id
            WHERE cp.user_id = auth.current_user_id()
        )
    );

-- =======================
-- Additional Performance Tables for New Features
-- =======================

-- Executive profiles table
CREATE TABLE IF NOT EXISTS public.executive_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    executive_level text NOT NULL,
    industry_expertise text[],
    functional_expertise text[],
    career_stage text,
    compensation_range jsonb,
    geographic_preferences jsonb,
    board_readiness jsonb,
    executive_presence jsonb,
    leadership_style jsonb,
    network_value jsonb,
    public_profile jsonb,
    confidentiality_level text DEFAULT 'standard',
    search_status text DEFAULT 'not_looking',
    exclusive_services jsonb,
    dedicated_consultant jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- VIP opportunities table
CREATE TABLE IF NOT EXISTS public.vip_opportunities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_type text NOT NULL,
    confidentiality_level text NOT NULL,
    organization jsonb,
    organization_type text,
    position jsonb,
    reporting_structure jsonb,
    compensation_package jsonb,
    search_firm jsonb,
    timeline_expectation jsonb,
    candidate_requirements jsonb,
    cultural_fit jsonb,
    risk_factors text[],
    opportunity_metrics jsonb,
    exclusivity jsonb,
    referral_source jsonb,
    priority_level text DEFAULT 'standard',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Concierge services table
CREATE TABLE IF NOT EXISTS public.concierge_services (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id uuid REFERENCES auth.users(id) NOT NULL,
    service_type text NOT NULL,
    service_level text DEFAULT 'standard',
    priority text DEFAULT 'standard',
    description text,
    requirements jsonb,
    expected_completion_date timestamptz,
    assigned_consultant jsonb,
    status text DEFAULT 'requested',
    request_date timestamptz DEFAULT now(),
    communications jsonb[],
    actual_completion_date timestamptz,
    client_satisfaction jsonb
);

-- Executive coaching programs table
CREATE TABLE IF NOT EXISTS public.executive_coaching_programs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    executive_id uuid REFERENCES auth.users(id) NOT NULL,
    coach_assignment text,
    objectives text[],
    duration text,
    intensity text,
    curriculum jsonb,
    timeline jsonb,
    success_metrics jsonb,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Board placement processes table
CREATE TABLE IF NOT EXISTS public.board_placement_processes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    executive_id uuid REFERENCES auth.users(id) NOT NULL,
    preferences jsonb,
    readiness_assessment jsonb,
    search_strategy jsonb,
    governance_preparation jsonb,
    opportunities jsonb[],
    timeline jsonb,
    status text DEFAULT 'assessment',
    metrics jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Research projects table
CREATE TABLE IF NOT EXISTS public.research_projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    project_type text NOT NULL,
    scope jsonb,
    methodology jsonb,
    timeline jsonb,
    team jsonb,
    budget jsonb,
    deliverables jsonb[],
    data_requirements jsonb[],
    stakeholders jsonb[],
    status text DEFAULT 'planning',
    progress jsonb,
    findings jsonb[],
    recommendations jsonb[],
    client_id uuid REFERENCES auth.users(id),
    confidentiality_level text DEFAULT 'internal',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Market intelligence reports table
CREATE TABLE IF NOT EXISTS public.market_intelligence_reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    report_type text NOT NULL,
    title text NOT NULL,
    summary text,
    scope jsonb,
    methodology jsonb,
    key_findings jsonb[],
    market_trends jsonb[],
    competitive_landscape jsonb,
    recommendations jsonb[],
    data_sources jsonb[],
    confidence_level text DEFAULT 'medium',
    generated_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    client_id uuid REFERENCES auth.users(id),
    access_level text DEFAULT 'client'
);

-- Global talent profiles table
CREATE TABLE IF NOT EXISTS public.global_talent_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    preferred_countries text[],
    visa_status jsonb,
    language_skills jsonb[],
    cultural_adaptability jsonb,
    mobility_preferences jsonb,
    relocation_type text,
    time_zone_preferences jsonb[],
    salary_expectations jsonb[],
    benefits jsonb,
    family_considerations jsonb,
    current_location jsonb,
    willing_to_relocate boolean DEFAULT false,
    relocate_within_days integer,
    legal_compliance jsonb,
    tax_optimization jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Visa applications table
CREATE TABLE IF NOT EXISTS public.visa_applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    applicant_id uuid REFERENCES auth.users(id) NOT NULL,
    destination_country text NOT NULL,
    visa_type text NOT NULL,
    sponsor_company uuid,
    application_status text DEFAULT 'preparation',
    required_documents jsonb[],
    document_checklist jsonb,
    timeline jsonb,
    costs jsonb,
    legal_requirements jsonb,
    success_probability integer,
    application_date timestamptz,
    decision_date timestamptz,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =======================
-- RLS Policies for New Tables
-- =======================

-- Executive profiles
ALTER TABLE public.executive_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Executive profiles policy" ON public.executive_profiles
    FOR ALL USING (user_id = auth.current_user_id());

-- VIP opportunities  
ALTER TABLE public.vip_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "VIP opportunities policy" ON public.vip_opportunities
    FOR SELECT USING (confidentiality_level = 'public' OR auth.is_admin());

-- Concierge services
ALTER TABLE public.concierge_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Concierge services policy" ON public.concierge_services
    FOR ALL USING (client_id = auth.current_user_id());

-- Executive coaching programs
ALTER TABLE public.executive_coaching_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Executive coaching policy" ON public.executive_coaching_programs
    FOR ALL USING (executive_id = auth.current_user_id());

-- Board placement processes
ALTER TABLE public.board_placement_processes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board placement policy" ON public.board_placement_processes
    FOR ALL USING (executive_id = auth.current_user_id());

-- Research projects
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Research projects policy" ON public.research_projects
    FOR SELECT USING (
        confidentiality_level = 'public' OR
        client_id = auth.current_user_id() OR
        auth.is_admin()
    );

-- Market intelligence reports
ALTER TABLE public.market_intelligence_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Market intelligence policy" ON public.market_intelligence_reports
    FOR SELECT USING (
        access_level = 'public' OR
        client_id = auth.current_user_id() OR
        auth.is_admin()
    );

-- Global talent profiles
ALTER TABLE public.global_talent_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Global talent profiles policy" ON public.global_talent_profiles
    FOR ALL USING (user_id = auth.current_user_id());

-- Visa applications
ALTER TABLE public.visa_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visa applications policy" ON public.visa_applications
    FOR ALL USING (applicant_id = auth.current_user_id());

-- =======================
-- Performance Indexes for New Tables
-- =======================

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_executive_profiles_user_id ON public.executive_profiles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vip_opportunities_confidentiality ON public.vip_opportunities(confidentiality_level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_concierge_services_client_id ON public.concierge_services(client_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_executive_coaching_executive_id ON public.executive_coaching_programs(executive_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_board_placement_executive_id ON public.board_placement_processes(executive_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_research_projects_client_id ON public.research_projects(client_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_market_intelligence_client_id ON public.market_intelligence_reports(client_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_global_talent_user_id ON public.global_talent_profiles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_visa_applications_applicant_id ON public.visa_applications(applicant_id);

-- Status indexes for filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_concierge_services_status ON public.concierge_services(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_executive_coaching_status ON public.executive_coaching_programs(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_board_placement_status ON public.board_placement_processes(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_research_projects_status ON public.research_projects(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_visa_applications_status ON public.visa_applications(application_status);

-- =======================
-- Update Statistics
-- =======================

ANALYZE public.executive_profiles;
ANALYZE public.vip_opportunities;
ANALYZE public.concierge_services;
ANALYZE public.executive_coaching_programs;
ANALYZE public.board_placement_processes;
ANALYZE public.research_projects;
ANALYZE public.market_intelligence_reports;
ANALYZE public.global_talent_profiles;
ANALYZE public.visa_applications;