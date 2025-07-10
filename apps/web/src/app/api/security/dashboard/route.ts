import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key-for-testing'
)

export async function GET(request: NextRequest) {
  try {
    // Get recent security events for metrics calculation
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const [securityEventsResult, failedLoginsResult] = await Promise.all([
      supabase
        .from('security_events')
        .select('event_type')
        .gte('created_at', last24Hours.toISOString()),
      
      supabase
        .from('failed_login_attempts')
        .select('id')
        .gte('created_at', last24Hours.toISOString())
    ])

    // Calculate metrics from database data
    const securityEvents = securityEventsResult.data || []
    const eventCounts = securityEvents.reduce((acc: any, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    }, {})

    const metrics = {
      failedLogins: eventCounts.failed_login || 0,
      rateLimitHits: eventCounts.rate_limit_hit || 0,
      suspiciousActivity: eventCounts.suspicious_activity || 0,
      blockedIPs: [],
      mfaFailures: eventCounts.mfa_failure || 0,
      totalLogins: eventCounts.login_success + eventCounts.failed_login || 0,
      successfulLogins: eventCounts.login_success || 0,
      failedLoginRate: eventCounts.failed_login > 0 ? 
        (eventCounts.failed_login / (eventCounts.login_success + eventCounts.failed_login)) * 100 : 0,
      newUserRegistrations: eventCounts.user_registration || 0,
      securityEvents: securityEvents.length,
      mfaAdoptionRate: 25.5, // Mock data for now
      systemStatus: 'healthy',
      responseTime: 150,
      errorRate: 0.1
    }
    
    // Get additional data from database
    const [alertsResult, sessionStats] = await Promise.all([
      supabase
        .from('security_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(10),
      
      supabase
        .from('enhanced_sessions')
        .select('count')
        .eq('is_active', true)
        .single()
    ])

    // Get current threats
    const currentThreats = {
      failedLogins: metrics.failedLogins || 0,
      rateLimitHits: metrics.rateLimitHits || 0,
      suspiciousActivity: metrics.suspiciousActivity || 0,
      blockedIPs: metrics.blockedIPs || [],
      mfaFailures: metrics.mfaFailures || 0
    }

    // Get daily stats
    const dailyStats = {
      totalLogins: metrics.totalLogins || 0,
      successfulLogins: metrics.successfulLogins || 0,
      failedLoginRate: metrics.failedLoginRate || 0,
      newUserRegistrations: metrics.newUserRegistrations || 0,
      securityEvents: metrics.securityEvents || 0,
      mfaAdoptionRate: metrics.mfaAdoptionRate || 0
    }

    // Get system health
    const systemHealth = {
      status: metrics.systemStatus || 'healthy',
      responseTime: metrics.responseTime || 150,
      errorRate: metrics.errorRate || 0.1,
      activeUsers: sessionStats.data?.count || 0
    }

    // Transform alerts
    const alerts = alertsResult.data?.map(alert => ({
      id: alert.id,
      severity: alert.severity,
      type: alert.alert_type,
      message: alert.message,
      timestamp: alert.created_at,
      affectedUser: alert.affected_user,
      ipAddress: alert.ip_address,
      actionRequired: alert.action_required,
      autoResolved: alert.auto_resolved
    })) || []

    const dashboardData = {
      currentThreats,
      dailyStats,
      alerts,
      systemHealth
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Security dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch security dashboard data' },
      { status: 500 }
    )
  }
}