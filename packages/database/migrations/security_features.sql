-- Security Features Database Migration
-- This migration adds all necessary tables and indexes for balanced security implementation

-- =======================
-- MFA Tables
-- =======================

-- User MFA settings table
CREATE TABLE IF NOT EXISTS public.user_mfa_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    secret text NOT NULL, -- Encrypted TOTP secret
    backup_codes text[] DEFAULT '{}', -- Hashed backup codes
    enabled boolean DEFAULT false,
    failed_attempts integer DEFAULT 0,
    last_used timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- MFA recovery codes table (separate for better security)
CREATE TABLE IF NOT EXISTS public.mfa_recovery_codes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    code_hash text NOT NULL,
    used boolean DEFAULT false,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- =======================
-- Security Monitoring Tables
-- =======================

-- Security events table (enhanced)
CREATE TABLE IF NOT EXISTS public.security_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type text NOT NULL,
    ip_address inet,
    user_agent text,
    endpoint text,
    method text,
    status_code integer,
    response_time integer,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Security alerts table
CREATE TABLE IF NOT EXISTS public.security_alerts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    alert_type text NOT NULL,
    message text NOT NULL,
    affected_user uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address inet,
    action_required boolean DEFAULT false,
    auto_resolved boolean DEFAULT false,
    resolved boolean DEFAULT false,
    resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    resolved_at timestamptz,
    resolution_notes text,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Enhanced session tracking
CREATE TABLE IF NOT EXISTS public.enhanced_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id uuid NOT NULL UNIQUE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    device_fingerprint text NOT NULL,
    ip_address inet NOT NULL,
    user_agent text,
    location_data jsonb,
    is_active boolean DEFAULT true,
    security_flags jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    last_activity timestamptz DEFAULT now(),
    expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

-- Failed login attempts tracking
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text,
    ip_address inet NOT NULL,
    user_agent text,
    attempt_type text DEFAULT 'password',
    failure_reason text,
    blocked_until timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Rate limiting logs (enhanced)
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address inet NOT NULL,
    endpoint text NOT NULL,
    method text,
    limit_type text DEFAULT 'endpoint',
    requests_count integer DEFAULT 1,
    window_start timestamptz DEFAULT now(),
    timestamp timestamptz DEFAULT now()
);

-- =======================
-- Security Configuration Tables
-- =======================

-- Security settings per user
CREATE TABLE IF NOT EXISTS public.user_security_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    login_notifications boolean DEFAULT true,
    security_alerts boolean DEFAULT true,
    session_timeout integer DEFAULT 86400, -- 24 hours in seconds
    require_mfa boolean DEFAULT false,
    trusted_devices text[] DEFAULT '{}',
    security_questions jsonb DEFAULT '{}',
    privacy_settings jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- IP whitelist/blacklist
CREATE TABLE IF NOT EXISTS public.ip_access_control (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address inet NOT NULL,
    ip_range cidr,
    access_type text NOT NULL CHECK (access_type IN ('whitelist', 'blacklist')),
    reason text,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    expires_at timestamptz,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =======================
-- Audit Trail Tables
-- =======================

-- Data access audit log
CREATE TABLE IF NOT EXISTS public.data_access_audit (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    table_name text NOT NULL,
    record_id uuid,
    action text NOT NULL CHECK (action IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')),
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Administrative actions log
CREATE TABLE IF NOT EXISTS public.admin_actions_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    action_type text NOT NULL,
    target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    target_resource text,
    action_details jsonb DEFAULT '{}',
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- =======================
-- CSP Violation Reports
-- =======================

-- Content Security Policy violations
CREATE TABLE IF NOT EXISTS public.csp_violations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    document_uri text NOT NULL,
    blocked_uri text NOT NULL,
    violated_directive text NOT NULL,
    original_policy text,
    source_file text,
    line_number integer,
    column_number integer,
    status_code integer,
    referrer text,
    user_agent text,
    ip_address inet,
    created_at timestamptz DEFAULT now()
);

-- =======================
-- Indexes for Performance
-- =======================

-- MFA indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_mfa_settings_user_id ON public.user_mfa_settings(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mfa_recovery_codes_user_id ON public.mfa_recovery_codes(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mfa_recovery_codes_used ON public.mfa_recovery_codes(used) WHERE used = false;

-- Security events indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_type ON public.security_events(event_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_events_ip_address ON public.security_events(ip_address);

-- Security alerts indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_alerts_severity ON public.security_alerts(severity);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_alerts_resolved ON public.security_alerts(resolved);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_alerts_created_at ON public.security_alerts(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_alerts_affected_user ON public.security_alerts(affected_user);

-- Enhanced sessions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enhanced_sessions_user_id ON public.enhanced_sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enhanced_sessions_session_id ON public.enhanced_sessions(session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enhanced_sessions_active ON public.enhanced_sessions(is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_enhanced_sessions_last_activity ON public.enhanced_sessions(last_activity);

-- Failed login attempts indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_failed_login_attempts_ip ON public.failed_login_attempts(ip_address);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_failed_login_attempts_email ON public.failed_login_attempts(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_failed_login_attempts_created_at ON public.failed_login_attempts(created_at);

-- Rate limiting indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limit_logs_ip_endpoint ON public.rate_limit_logs(ip_address, endpoint);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limit_logs_user_id ON public.rate_limit_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limit_logs_timestamp ON public.rate_limit_logs(timestamp);

-- Security settings indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_security_settings_user_id ON public.user_security_settings(user_id);

-- IP access control indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ip_access_control_ip_address ON public.ip_access_control(ip_address);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ip_access_control_active ON public.ip_access_control(is_active) WHERE is_active = true;

-- Audit trail indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_access_audit_user_id ON public.data_access_audit(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_access_audit_table_name ON public.data_access_audit(table_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_data_access_audit_created_at ON public.data_access_audit(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_actions_log_admin_user_id ON public.admin_actions_log(admin_user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_actions_log_created_at ON public.admin_actions_log(created_at);

-- CSP violations indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_csp_violations_document_uri ON public.csp_violations(document_uri);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_csp_violations_created_at ON public.csp_violations(created_at);

-- =======================
-- Row Level Security Policies
-- =======================

-- Enable RLS on all security tables
ALTER TABLE public.user_mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mfa_recovery_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_access_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.csp_violations ENABLE ROW LEVEL SECURITY;

-- MFA settings policies
CREATE POLICY "Users can manage their own MFA settings" ON public.user_mfa_settings
    FOR ALL USING (user_id = (select auth.uid()));

CREATE POLICY "Users can manage their own recovery codes" ON public.mfa_recovery_codes
    FOR ALL USING (user_id = (select auth.uid()));

-- Security events policies
CREATE POLICY "Users can view their own security events" ON public.security_events
    FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "System can insert security events" ON public.security_events
    FOR INSERT WITH CHECK (true);

-- Admin can view all security events
CREATE POLICY "Admin can view all security events" ON public.security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = (select auth.uid()) AND up.role = 'admin'
        )
    );

-- Security alerts policies
CREATE POLICY "Admin can manage security alerts" ON public.security_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = (select auth.uid()) AND up.role = 'admin'
        )
    );

-- Users can view alerts that affect them
CREATE POLICY "Users can view their own security alerts" ON public.security_alerts
    FOR SELECT USING (affected_user = (select auth.uid()));

-- Enhanced sessions policies
CREATE POLICY "Users can manage their own sessions" ON public.enhanced_sessions
    FOR ALL USING (user_id = (select auth.uid()));

-- System can insert failed login attempts
CREATE POLICY "System can log failed login attempts" ON public.failed_login_attempts
    FOR INSERT WITH CHECK (true);

-- Admin can view failed login attempts
CREATE POLICY "Admin can view failed login attempts" ON public.failed_login_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = (select auth.uid()) AND up.role = 'admin'
        )
    );

-- Rate limit logs policies
CREATE POLICY "Users can view their own rate limit logs" ON public.rate_limit_logs
    FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "System can insert rate limit logs" ON public.rate_limit_logs
    FOR INSERT WITH CHECK (true);

-- User security settings policies
CREATE POLICY "Users can manage their own security settings" ON public.user_security_settings
    FOR ALL USING (user_id = (select auth.uid()));

-- IP access control policies
CREATE POLICY "Admin can manage IP access control" ON public.ip_access_control
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = (select auth.uid()) AND up.role = 'admin'
        )
    );

-- Audit trail policies
CREATE POLICY "Admin can view data access audit" ON public.data_access_audit
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = (select auth.uid()) AND up.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own data access" ON public.data_access_audit
    FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "System can insert audit records" ON public.data_access_audit
    FOR INSERT WITH CHECK (true);

-- Admin actions log policies
CREATE POLICY "Admin can view admin actions log" ON public.admin_actions_log
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = (select auth.uid()) AND up.role = 'admin'
        )
    );

-- CSP violations policies
CREATE POLICY "System can insert CSP violations" ON public.csp_violations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view CSP violations" ON public.csp_violations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up 
            WHERE up.id = (select auth.uid()) AND up.role = 'admin'
        )
    );

-- =======================
-- Functions for Security
-- =======================

-- Function to clean up old security logs
CREATE OR REPLACE FUNCTION cleanup_security_logs(retention_days integer DEFAULT 90)
RETURNS void AS $$
BEGIN
    DELETE FROM public.security_events 
    WHERE created_at < now() - interval '1 day' * retention_days;
    
    DELETE FROM public.failed_login_attempts 
    WHERE created_at < now() - interval '1 day' * retention_days;
    
    DELETE FROM public.rate_limit_logs 
    WHERE timestamp < now() - interval '1 day' * retention_days;
    
    DELETE FROM public.csp_violations 
    WHERE created_at < now() - interval '1 day' * retention_days;
END;
$$ LANGUAGE plpgsql;

-- Function to get security metrics
CREATE OR REPLACE FUNCTION get_security_metrics(time_window interval DEFAULT '1 hour')
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'failed_logins', (
            SELECT count(*) FROM public.security_events 
            WHERE event_type = 'failed_login' 
            AND created_at >= now() - time_window
        ),
        'rate_limit_hits', (
            SELECT count(*) FROM public.security_events 
            WHERE event_type = 'rate_limit_hit' 
            AND created_at >= now() - time_window
        ),
        'security_alerts', (
            SELECT count(*) FROM public.security_alerts 
            WHERE created_at >= now() - time_window
        ),
        'active_sessions', (
            SELECT count(*) FROM public.enhanced_sessions 
            WHERE is_active = true 
            AND last_activity >= now() - time_window
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to block IP address
CREATE OR REPLACE FUNCTION block_ip_address(ip_addr inet, reason_text text DEFAULT 'Suspicious activity')
RETURNS void AS $$
BEGIN
    INSERT INTO public.ip_access_control (ip_address, access_type, reason, created_by)
    VALUES (ip_addr, 'blacklist', reason_text, auth.uid())
    ON CONFLICT (ip_address) DO UPDATE SET
        access_type = 'blacklist',
        reason = reason_text,
        updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- =======================
-- Triggers for Audit Trail
-- =======================

-- Create audit trigger function
CREATE OR REPLACE FUNCTION create_audit_record()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.data_access_audit (
            user_id, table_name, record_id, action, new_values, ip_address
        ) VALUES (
            auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), inet_client_addr()
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.data_access_audit (
            user_id, table_name, record_id, action, old_values, new_values, ip_address
        ) VALUES (
            auth.uid(), TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), inet_client_addr()
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.data_access_audit (
            user_id, table_name, record_id, action, old_values, ip_address
        ) VALUES (
            auth.uid(), TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), inet_client_addr()
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_user_profiles
    AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION create_audit_record();

CREATE TRIGGER audit_executive_profiles
    AFTER INSERT OR UPDATE OR DELETE ON public.executive_profiles
    FOR EACH ROW EXECUTE FUNCTION create_audit_record();

-- =======================
-- Comments for Documentation
-- =======================

COMMENT ON TABLE public.user_mfa_settings IS 'Multi-factor authentication settings for users';
COMMENT ON TABLE public.security_events IS 'Security events and incidents log';
COMMENT ON TABLE public.security_alerts IS 'Security alerts requiring attention';
COMMENT ON TABLE public.enhanced_sessions IS 'Enhanced session tracking with security features';
COMMENT ON TABLE public.failed_login_attempts IS 'Failed login attempts for security monitoring';
COMMENT ON TABLE public.user_security_settings IS 'User-specific security configuration';
COMMENT ON TABLE public.ip_access_control IS 'IP address whitelist and blacklist management';
COMMENT ON TABLE public.data_access_audit IS 'Audit trail for data access and modifications';
COMMENT ON TABLE public.admin_actions_log IS 'Administrative actions audit log';
COMMENT ON TABLE public.csp_violations IS 'Content Security Policy violation reports';

-- =======================
-- Update Statistics
-- =======================

ANALYZE public.user_mfa_settings;
ANALYZE public.security_events;
ANALYZE public.security_alerts;
ANALYZE public.enhanced_sessions;
ANALYZE public.failed_login_attempts;
ANALYZE public.rate_limit_logs;
ANALYZE public.user_security_settings;
ANALYZE public.ip_access_control;
ANALYZE public.data_access_audit;
ANALYZE public.admin_actions_log;
ANALYZE public.csp_violations;