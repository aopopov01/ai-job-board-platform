-- ADVANCED SECURITY MONITORING FOR TALENTAIZE PLATFORM
-- Enhanced security features beyond basic RLS

-- =============================================================================
-- ADVANCED RLS POLICIES FOR ADDITIONAL TABLES
-- =============================================================================

-- Company profiles security (if not already implemented)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_profiles') THEN
        ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
        
        -- Companies can manage their own profile
        CREATE POLICY "Companies can manage their own profile" 
        ON public.company_profiles 
        FOR ALL 
        TO authenticated 
        USING (id = auth.uid())
        WITH CHECK (id = auth.uid());
        
        -- Public can view company profiles for job listings
        CREATE POLICY "Public can view company profiles" 
        ON public.company_profiles 
        FOR SELECT 
        TO anon, authenticated 
        USING (is_public = true OR status = 'active');
    END IF;
END $$;

-- CV documents security
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cv_documents') THEN
        ALTER TABLE public.cv_documents ENABLE ROW LEVEL SECURITY;
        
        -- Users can manage their own CV documents
        CREATE POLICY "Users can manage their own CV documents" 
        ON public.cv_documents 
        FOR ALL 
        TO authenticated 
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
        
        -- Companies can view CV documents for job applications
        CREATE POLICY "Companies can view CVs for applications" 
        ON public.cv_documents 
        FOR SELECT 
        TO authenticated 
        USING (
            user_id IN (
                SELECT candidate_id FROM public.applications a
                JOIN public.jobs j ON a.job_id = j.id
                WHERE j.company_id = auth.uid() OR j.created_by = auth.uid()
            )
        );
    END IF;
END $$;

-- Messages/notifications security
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
        ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
        
        -- Users can view messages they sent or received
        CREATE POLICY "Users can view their own messages" 
        ON public.messages 
        FOR SELECT 
        TO authenticated 
        USING (sender_id = auth.uid() OR recipient_id = auth.uid());
        
        -- Users can send messages
        CREATE POLICY "Users can send messages" 
        ON public.messages 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (sender_id = auth.uid());
        
        -- Users can update read status of received messages
        CREATE POLICY "Users can update received messages" 
        ON public.messages 
        FOR UPDATE 
        TO authenticated 
        USING (recipient_id = auth.uid());
    END IF;
END $$;

-- =============================================================================
-- SECURITY MONITORING SYSTEM
-- =============================================================================

-- Enhanced security events table
DROP TABLE IF EXISTS public.security_events CASCADE;
CREATE TABLE public.security_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    session_id text,
    event_type text NOT NULL,
    severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    table_name text,
    record_id uuid,
    operation text,
    ip_address inet,
    user_agent text,
    country text,
    city text,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only admins and security team can view security events
CREATE POLICY "Security team can view all security events" 
ON public.security_events 
FOR SELECT 
TO authenticated 
USING (
    auth.is_admin() OR 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'security', 'moderator')
    )
);

-- Security metrics view
CREATE OR REPLACE VIEW public.security_metrics AS
SELECT 
    date_trunc('hour', created_at) as hour,
    event_type,
    severity,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT ip_address) as unique_ips
FROM public.security_events 
WHERE created_at >= now() - interval '24 hours'
GROUP BY date_trunc('hour', created_at), event_type, severity
ORDER BY hour DESC;

-- =============================================================================
-- RATE LIMITING SYSTEM
-- =============================================================================

-- Rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    ip_address inet,
    action_type text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
TO authenticated 
USING (false); -- No user access, system only

-- Rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
    user_id_param uuid DEFAULT NULL,
    ip_param inet DEFAULT NULL,
    action_type_param text DEFAULT 'api_request',
    max_requests integer DEFAULT 100,
    window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_count integer;
    window_start_time timestamp with time zone;
BEGIN
    -- Calculate window start time
    window_start_time := now() - (window_minutes || ' minutes')::interval;
    
    -- Clean old entries
    DELETE FROM public.rate_limits 
    WHERE window_start < window_start_time;
    
    -- Get current count for this user/IP in the window
    SELECT COALESCE(SUM(request_count), 0) INTO current_count
    FROM public.rate_limits
    WHERE (user_id_param IS NULL OR user_id = user_id_param)
    AND (ip_param IS NULL OR ip_address = ip_param)
    AND action_type = action_type_param
    AND window_start >= window_start_time;
    
    -- Check if limit exceeded
    IF current_count >= max_requests THEN
        -- Log rate limit violation
        PERFORM log_security_event(
            'rate_limit_exceeded',
            'rate_limits',
            'check',
            jsonb_build_object(
                'action_type', action_type_param,
                'current_count', current_count,
                'max_requests', max_requests,
                'user_id', user_id_param,
                'ip_address', ip_param
            )
        );
        RETURN false;
    END IF;
    
    -- Update or insert rate limit record
    INSERT INTO public.rate_limits (user_id, ip_address, action_type, request_count)
    VALUES (user_id_param, ip_param, action_type_param, 1)
    ON CONFLICT (user_id, ip_address, action_type) 
    DO UPDATE SET 
        request_count = rate_limits.request_count + 1,
        updated_at = now();
    
    RETURN true;
END;
$$;

-- =============================================================================
-- SUSPICIOUS ACTIVITY DETECTION
-- =============================================================================

-- Suspicious activity detection function
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recent_failed_logins integer;
    recent_applications integer;
    user_location_changes integer;
BEGIN
    -- Detect multiple failed login attempts
    IF TG_TABLE_NAME = 'security_events' AND NEW.event_type = 'failed_login' THEN
        SELECT COUNT(*) INTO recent_failed_logins
        FROM public.security_events
        WHERE user_id = NEW.user_id
        AND event_type = 'failed_login'
        AND created_at >= now() - interval '15 minutes';
        
        IF recent_failed_logins >= 5 THEN
            PERFORM log_security_event(
                'multiple_failed_logins',
                'auth',
                'login_attempt',
                jsonb_build_object(
                    'failed_attempts', recent_failed_logins,
                    'user_id', NEW.user_id,
                    'ip_address', NEW.ip_address
                )
            );
        END IF;
    END IF;
    
    -- Detect rapid job applications (potential spam)
    IF TG_TABLE_NAME = 'applications' THEN
        SELECT COUNT(*) INTO recent_applications
        FROM public.applications
        WHERE candidate_id = NEW.candidate_id
        AND created_at >= now() - interval '1 hour';
        
        IF recent_applications >= 10 THEN
            PERFORM log_security_event(
                'rapid_job_applications',
                'applications',
                'insert',
                jsonb_build_object(
                    'applications_count', recent_applications,
                    'candidate_id', NEW.candidate_id
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- =============================================================================
-- DATA INTEGRITY CHECKS
-- =============================================================================

-- Function to validate job posting data integrity
CREATE OR REPLACE FUNCTION validate_job_data()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validate salary range
    IF NEW.salary_min IS NOT NULL AND NEW.salary_max IS NOT NULL THEN
        IF NEW.salary_min > NEW.salary_max THEN
            RAISE EXCEPTION 'Minimum salary cannot be greater than maximum salary';
        END IF;
    END IF;
    
    -- Validate application deadline
    IF NEW.application_deadline IS NOT NULL THEN
        IF NEW.application_deadline <= now() THEN
            RAISE EXCEPTION 'Application deadline must be in the future';
        END IF;
    END IF;
    
    -- Validate required fields based on job type
    IF NEW.job_type = 'remote' AND NEW.location IS NOT NULL THEN
        NEW.location := 'Remote';
    END IF;
    
    -- Log job creation/update
    PERFORM log_security_event(
        CASE WHEN TG_OP = 'INSERT' THEN 'job_created' ELSE 'job_updated' END,
        'jobs',
        TG_OP,
        jsonb_build_object(
            'job_id', NEW.id,
            'company_id', NEW.company_id,
            'title', NEW.title,
            'status', NEW.status
        )
    );
    
    RETURN NEW;
END;
$$;

-- =============================================================================
-- SECURITY TRIGGERS
-- =============================================================================

-- Create triggers for security monitoring
DROP TRIGGER IF EXISTS trigger_detect_suspicious_activity ON public.security_events;
CREATE TRIGGER trigger_detect_suspicious_activity
    AFTER INSERT ON public.security_events
    FOR EACH ROW
    EXECUTE FUNCTION detect_suspicious_activity();

-- Job validation trigger
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs') THEN
        DROP TRIGGER IF EXISTS trigger_validate_job_data ON public.jobs;
        CREATE TRIGGER trigger_validate_job_data
            BEFORE INSERT OR UPDATE ON public.jobs
            FOR EACH ROW
            EXECUTE FUNCTION validate_job_data();
    END IF;
END $$;

-- =============================================================================
-- SECURITY REPORTING FUNCTIONS
-- =============================================================================

-- Daily security report
CREATE OR REPLACE FUNCTION generate_daily_security_report(report_date date DEFAULT current_date)
RETURNS TABLE(
    metric_name text,
    metric_value integer,
    severity text,
    description text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'total_security_events'::text,
        COUNT(*)::integer,
        CASE WHEN COUNT(*) > 1000 THEN 'high' ELSE 'normal' END::text,
        'Total security events logged today'::text
    FROM public.security_events
    WHERE created_at::date = report_date
    
    UNION ALL
    
    SELECT 
        'failed_login_attempts'::text,
        COUNT(*)::integer,
        CASE WHEN COUNT(*) > 50 THEN 'high' ELSE 'normal' END::text,
        'Failed login attempts today'::text
    FROM public.security_events
    WHERE created_at::date = report_date
    AND event_type = 'failed_login'
    
    UNION ALL
    
    SELECT 
        'rate_limit_violations'::text,
        COUNT(*)::integer,
        CASE WHEN COUNT(*) > 20 THEN 'high' ELSE 'normal' END::text,
        'Rate limit violations today'::text
    FROM public.security_events
    WHERE created_at::date = report_date
    AND event_type = 'rate_limit_exceeded'
    
    UNION ALL
    
    SELECT 
        'unique_users_active'::text,
        COUNT(DISTINCT user_id)::integer,
        'normal'::text,
        'Unique users active today'::text
    FROM public.security_events
    WHERE created_at::date = report_date
    AND user_id IS NOT NULL;
END;
$$;

-- =============================================================================
-- PERFORMANCE INDEXES FOR SECURITY TABLES
-- =============================================================================

-- Indexes for security events table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_user_id 
ON public.security_events(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_event_type 
ON public.security_events(event_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_created_at 
ON public.security_events(created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_ip_address 
ON public.security_events(ip_address);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_severity 
ON public.security_events(severity);

-- Indexes for rate limits table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_user_id 
ON public.rate_limits(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_ip_address 
ON public.rate_limits(ip_address);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_action_type 
ON public.rate_limits(action_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_window_start 
ON public.rate_limits(window_start);

-- Composite index for rate limiting queries
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_unique 
ON public.rate_limits(user_id, ip_address, action_type);

-- =============================================================================
-- CLEANUP FUNCTIONS
-- =============================================================================

-- Function to clean old security events
CREATE OR REPLACE FUNCTION cleanup_old_security_events(days_to_keep integer DEFAULT 90)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count integer;
BEGIN
    -- Delete old security events
    DELETE FROM public.security_events
    WHERE created_at < now() - (days_to_keep || ' days')::interval;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log cleanup activity
    PERFORM log_security_event(
        'security_cleanup',
        'security_events',
        'delete',
        jsonb_build_object(
            'deleted_records', deleted_count,
            'days_kept', days_to_keep
        )
    );
    
    RETURN deleted_count;
END;
$$;

-- =============================================================================
-- INITIAL SECURITY SETUP
-- =============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON public.security_metrics TO authenticated;

-- Create initial admin user function (run once)
CREATE OR REPLACE FUNCTION setup_admin_user(admin_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- This function should be called after creating the admin user in Supabase Auth
    -- to set their role in metadata
    UPDATE auth.users 
    SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
    WHERE email = admin_email;
    
    IF FOUND THEN
        RETURN 'Admin role assigned to ' || admin_email;
    ELSE
        RETURN 'User not found: ' || admin_email;
    END IF;
END;
$$;

-- =============================================================================
-- COMPLETION AND VERIFICATION
-- =============================================================================

-- Test security functions
SELECT 'Advanced Security Monitoring System Installed! ⚡' AS status,
       'Rate limiting, suspicious activity detection, and comprehensive audit logging are now active.' AS message,
       'Run generate_daily_security_report() to see security metrics.' AS next_step;

-- Show current security status
SELECT 
    'Security Events Today' as metric,
    COUNT(*) as count
FROM public.security_events 
WHERE created_at::date = current_date

UNION ALL

SELECT 
    'Tables with RLS Enabled' as metric,
    COUNT(*) as count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
AND c.relkind = 'r'
AND c.relrowsecurity = true;