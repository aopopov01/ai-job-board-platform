import { createClient } from '@supabase/supabase-js'
import { logger } from '../shared/src/services/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SecurityMetrics {
  currentThreats: {
    failedLogins: number
    rateLimitHits: number
    suspiciousActivity: number
    blockedIPs: string[]
    mfaFailures: number
  }
  dailyStats: {
    totalLogins: number
    successfulLogins: number
    failedLoginRate: number
    newUserRegistrations: number
    securityEvents: number
    mfaAdoptionRate: number
  }
  alerts: SecurityAlert[]
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical'
    responseTime: number
    errorRate: number
    activeUsers: number
  }
}

export interface SecurityAlert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'failed_login_spike' | 'rate_limit_exceeded' | 'suspicious_pattern' | 'new_admin_login' | 'mfa_bypass_attempt' | 'account_lockout'
  message: string
  timestamp: string
  affectedUser?: string
  ipAddress?: string
  actionRequired: boolean
  autoResolved: boolean
  metadata?: any
}

export interface ThreatAnalysis {
  riskScore: number // 0-100
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  activeThreats: string[]
  recommendations: string[]
  trending: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
}

export class SecurityMonitoringService {
  private alertThresholds = {
    failedLoginsPerMinute: 10,
    rateLimitHitsPerMinute: 20,
    suspiciousActivityPerHour: 5,
    mfaFailuresPerHour: 15,
    errorRatePercentage: 5
  }

  // Get comprehensive security dashboard data
  async getSecurityDashboard(): Promise<SecurityMetrics> {
    try {
      const [
        currentThreats,
        dailyStats,
        alerts,
        systemHealth
      ] = await Promise.all([
        this.getCurrentThreats(),
        this.getDailyStats(),
        this.getActiveAlerts(),
        this.getSystemHealth()
      ])
      
      return {
        currentThreats,
        dailyStats,
        alerts,
        systemHealth
      }
    } catch (error) {
      logger.error('Failed to get security dashboard', error)
      throw error
    }
  }
  
  // Analyze current security threats
  async getThreatAnalysis(): Promise<ThreatAnalysis> {
    try {
      const metrics = await this.getSecurityDashboard()
      const riskScore = this.calculateRiskScore(metrics)
      const threatLevel = this.determineThreatLevel(riskScore)
      const activeThreats = this.identifyActiveThreats(metrics)
      const recommendations = this.generateRecommendations(metrics)
      const trending = await this.getThreatTrending()
      
      return {
        riskScore,
        threatLevel,
        activeThreats,
        recommendations,
        trending
      }
    } catch (error) {
      logger.error('Failed to get threat analysis', error)
      throw error
    }
  }
  
  // Monitor and create alerts automatically
  async checkAndCreateAlerts(): Promise<SecurityAlert[]> {
    try {
      const newAlerts: SecurityAlert[] = []
      
      // Check for failed login spikes
      const recentFailedLogins = await this.getRecentFailedLogins(5) // Last 5 minutes
      if (recentFailedLogins > this.alertThresholds.failedLoginsPerMinute * 5) {
        const alert = await this.createAlert({
          severity: 'high',
          type: 'failed_login_spike',
          message: `${recentFailedLogins} failed login attempts in last 5 minutes`,
          actionRequired: true,
          metadata: { count: recentFailedLogins, timeWindow: '5 minutes' }
        })
        newAlerts.push(alert)
      }
      
      // Check for rate limit exceeded events
      const rateLimitHits = await this.getRecentRateLimitHits(5)
      if (rateLimitHits > this.alertThresholds.rateLimitHitsPerMinute * 5) {
        const alert = await this.createAlert({
          severity: 'medium',
          type: 'rate_limit_exceeded',
          message: `${rateLimitHits} rate limit violations in last 5 minutes`,
          actionRequired: false,
          metadata: { count: rateLimitHits, timeWindow: '5 minutes' }
        })
        newAlerts.push(alert)
      }
      
      // Check for new admin logins
      const recentAdminLogins = await this.getRecentAdminLogins(60) // Last hour
      for (const login of recentAdminLogins) {
        const alert = await this.createAlert({
          severity: 'medium',
          type: 'new_admin_login',
          message: `Admin login detected: ${login.email} from ${login.ip}`,
          affectedUser: login.userId,
          ipAddress: login.ip,
          actionRequired: false,
          metadata: { loginTime: login.timestamp, userAgent: login.userAgent }
        })
        newAlerts.push(alert)
      }
      
      // Check for MFA bypass attempts
      const mfaBypassAttempts = await this.getMFABypassAttempts(60)
      if (mfaBypassAttempts.length > 0) {
        for (const attempt of mfaBypassAttempts) {
          const alert = await this.createAlert({
            severity: 'critical',
            type: 'mfa_bypass_attempt',
            message: `Potential MFA bypass attempt for user ${attempt.email}`,
            affectedUser: attempt.userId,
            ipAddress: attempt.ip,
            actionRequired: true,
            metadata: attempt
          })
          newAlerts.push(alert)
        }
      }
      
      // Check for account lockouts
      const accountLockouts = await this.getRecentAccountLockouts(30)
      for (const lockout of accountLockouts) {
        const alert = await this.createAlert({
          severity: 'medium',
          type: 'account_lockout',
          message: `Account locked due to multiple failed attempts: ${lockout.email}`,
          affectedUser: lockout.userId,
          actionRequired: false,
          metadata: lockout
        })
        newAlerts.push(alert)
      }
      
      return newAlerts
    } catch (error) {
      logger.error('Failed to check and create alerts', error)
      return []
    }
  }
  
  // Get current threats in real-time
  private async getCurrentThreats() {
    const last15Minutes = new Date(Date.now() - 15 * 60 * 1000)
    
    const { data: recentEvents } = await supabase
      .from('security_events')
      .select('event_type, ip_address, user_id, created_at, metadata')
      .gte('created_at', last15Minutes.toISOString())
    
    if (!recentEvents) {
      return {
        failedLogins: 0,
        rateLimitHits: 0,
        suspiciousActivity: 0,
        blockedIPs: [],
        mfaFailures: 0
      }
    }
    
    // Count different types of security events
    const failedLogins = recentEvents.filter(e => e.event_type === 'failed_login').length
    const rateLimitHits = recentEvents.filter(e => e.event_type === 'rate_limit_hit').length
    const suspiciousActivity = recentEvents.filter(e => e.event_type === 'suspicious_activity').length
    const mfaFailures = recentEvents.filter(e => e.event_type === 'mfa_failed').length
    
    // Identify problematic IPs (more than 10 events)
    const ipCounts = recentEvents.reduce((acc, event) => {
      if (event.ip_address) {
        acc[event.ip_address] = (acc[event.ip_address] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    const blockedIPs = Object.entries(ipCounts)
      .filter(([ip, count]) => count > 10)
      .map(([ip]) => ip)
    
    return {
      failedLogins,
      rateLimitHits,
      suspiciousActivity,
      blockedIPs,
      mfaFailures
    }
  }
  
  // Get daily statistics
  private async getDailyStats() {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    
    const [loginStats, userStats, securityEventStats, mfaStats] = await Promise.all([
      this.getLoginStats(startOfDay),
      this.getUserRegistrationStats(startOfDay),
      this.getSecurityEventStats(startOfDay),
      this.getMFAStats()
    ])
    
    const failedLoginRate = loginStats.total > 0 
      ? ((loginStats.total - loginStats.successful) / loginStats.total) * 100 
      : 0
    
    return {
      totalLogins: loginStats.total,
      successfulLogins: loginStats.successful,
      failedLoginRate: Math.round(failedLoginRate * 100) / 100,
      newUserRegistrations: userStats.newUsers,
      securityEvents: securityEventStats.total,
      mfaAdoptionRate: mfaStats.adoptionRate
    }
  }
  
  // Get active security alerts
  private async getActiveAlerts(): Promise<SecurityAlert[]> {
    const { data: alerts } = await supabase
      .from('security_alerts')
      .select('*')
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(50)
    
    return alerts?.map(alert => ({
      id: alert.id,
      severity: alert.severity,
      type: alert.alert_type,
      message: alert.message,
      timestamp: alert.created_at,
      affectedUser: alert.affected_user,
      ipAddress: alert.ip_address,
      actionRequired: alert.action_required,
      autoResolved: alert.auto_resolved,
      metadata: alert.metadata
    })) || []
  }
  
  // Get system health metrics
  private async getSystemHealth() {
    const last5Minutes = new Date(Date.now() - 5 * 60 * 1000)
    
    const [errorRate, responseTime, activeUsers] = await Promise.all([
      this.getErrorRate(last5Minutes),
      this.getAverageResponseTime(last5Minutes),
      this.getActiveUserCount(last5Minutes)
    ])
    
    let status: 'healthy' | 'warning' | 'critical' = 'healthy'
    if (errorRate > 5 || responseTime > 2000) {
      status = 'warning'
    }
    if (errorRate > 10 || responseTime > 5000) {
      status = 'critical'
    }
    
    return {
      status,
      responseTime,
      errorRate,
      activeUsers
    }
  }
  
  // Helper methods for metrics collection
  private async getLoginStats(since: Date) {
    const { data: events } = await supabase
      .from('security_events')
      .select('event_type')
      .gte('created_at', since.toISOString())
      .in('event_type', ['login_success', 'login_failed'])
    
    const total = events?.length || 0
    const successful = events?.filter(e => e.event_type === 'login_success').length || 0
    
    return { total, successful }
  }
  
  private async getUserRegistrationStats(since: Date) {
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id')
      .gte('created_at', since.toISOString())
    
    return { newUsers: users?.length || 0 }
  }
  
  private async getSecurityEventStats(since: Date) {
    const { data: events } = await supabase
      .from('security_events')
      .select('id')
      .gte('created_at', since.toISOString())
    
    return { total: events?.length || 0 }
  }
  
  private async getMFAStats() {
    const [totalUsers, mfaEnabledUsers] = await Promise.all([
      supabase.from('user_profiles').select('id', { count: 'exact' }),
      supabase.from('user_mfa_settings').select('id', { count: 'exact' }).eq('enabled', true)
    ])
    
    const total = totalUsers.count || 0
    const enabled = mfaEnabledUsers.count || 0
    const adoptionRate = total > 0 ? (enabled / total) * 100 : 0
    
    return { adoptionRate: Math.round(adoptionRate * 100) / 100 }
  }
  
  private async getRecentFailedLogins(minutes: number): Promise<number> {
    const since = new Date(Date.now() - minutes * 60 * 1000)
    
    const { data: events } = await supabase
      .from('security_events')
      .select('id')
      .eq('event_type', 'failed_login')
      .gte('created_at', since.toISOString())
    
    return events?.length || 0
  }
  
  private async getRecentRateLimitHits(minutes: number): Promise<number> {
    const since = new Date(Date.now() - minutes * 60 * 1000)
    
    const { data: events } = await supabase
      .from('security_events')
      .select('id')
      .eq('event_type', 'rate_limit_hit')
      .gte('created_at', since.toISOString())
    
    return events?.length || 0
  }
  
  private async getRecentAdminLogins(minutes: number) {
    const since = new Date(Date.now() - minutes * 60 * 1000)
    
    const { data: events } = await supabase
      .from('security_events')
      .select('user_id, ip_address, metadata, created_at')
      .eq('event_type', 'admin_login')
      .gte('created_at', since.toISOString())
    
    return events?.map(event => ({
      userId: event.user_id,
      ip: event.ip_address,
      timestamp: event.created_at,
      email: event.metadata?.email || 'unknown',
      userAgent: event.metadata?.userAgent || 'unknown'
    })) || []
  }
  
  private async getMFABypassAttempts(minutes: number) {
    const since = new Date(Date.now() - minutes * 60 * 1000)
    
    const { data: events } = await supabase
      .from('security_events')
      .select('user_id, ip_address, metadata, created_at')
      .eq('event_type', 'mfa_bypass_attempt')
      .gte('created_at', since.toISOString())
    
    return events?.map(event => ({
      userId: event.user_id,
      ip: event.ip_address,
      timestamp: event.created_at,
      email: event.metadata?.email || 'unknown',
      ...event.metadata
    })) || []
  }
  
  private async getRecentAccountLockouts(minutes: number) {
    const since = new Date(Date.now() - minutes * 60 * 1000)
    
    const { data: events } = await supabase
      .from('security_events')
      .select('user_id, metadata, created_at')
      .eq('event_type', 'account_locked')
      .gte('created_at', since.toISOString())
    
    return events?.map(event => ({
      userId: event.user_id,
      timestamp: event.created_at,
      email: event.metadata?.email || 'unknown',
      reason: event.metadata?.reason || 'multiple_failed_attempts'
    })) || []
  }
  
  private async getErrorRate(since: Date): Promise<number> {
    const { data: logs } = await supabase
      .from('system_logs')
      .select('level')
      .gte('timestamp', since.toISOString())
    
    if (!logs || logs.length === 0) return 0
    
    const errorCount = logs.filter(log => log.level === 'error').length
    return (errorCount / logs.length) * 100
  }
  
  private async getAverageResponseTime(since: Date): Promise<number> {
    const { data: logs } = await supabase
      .from('system_logs')
      .select('response_time')
      .gte('timestamp', since.toISOString())
      .not('response_time', 'is', null)
    
    if (!logs || logs.length === 0) return 0
    
    const totalResponseTime = logs.reduce((sum, log) => sum + (log.response_time || 0), 0)
    return Math.round(totalResponseTime / logs.length)
  }
  
  private async getActiveUserCount(since: Date): Promise<number> {
    const { data: sessions } = await supabase
      .from('enhanced_sessions')
      .select('user_id')
      .eq('is_active', true)
      .gte('last_activity', since.toISOString())
    
    return sessions?.length || 0
  }
  
  // Risk calculation and threat analysis
  private calculateRiskScore(metrics: SecurityMetrics): number {
    let score = 0
    
    // Failed logins contribute to risk
    score += Math.min(metrics.currentThreats.failedLogins * 2, 20)
    
    // Rate limit hits
    score += Math.min(metrics.currentThreats.rateLimitHits, 15)
    
    // Suspicious activity
    score += metrics.currentThreats.suspiciousActivity * 5
    
    // Blocked IPs
    score += metrics.currentThreats.blockedIPs.length * 3
    
    // MFA failures
    score += Math.min(metrics.currentThreats.mfaFailures * 2, 10)
    
    // System health impact
    if (metrics.systemHealth.status === 'warning') score += 10
    if (metrics.systemHealth.status === 'critical') score += 25
    
    // Error rate impact
    score += Math.min(metrics.systemHealth.errorRate * 2, 20)
    
    return Math.min(score, 100)
  }
  
  private determineThreatLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore < 25) return 'low'
    if (riskScore < 50) return 'medium'
    if (riskScore < 75) return 'high'
    return 'critical'
  }
  
  private identifyActiveThreats(metrics: SecurityMetrics): string[] {
    const threats: string[] = []
    
    if (metrics.currentThreats.failedLogins > 20) {
      threats.push('High volume of failed login attempts')
    }
    
    if (metrics.currentThreats.blockedIPs.length > 0) {
      threats.push(`${metrics.currentThreats.blockedIPs.length} IP addresses showing suspicious activity`)
    }
    
    if (metrics.currentThreats.mfaFailures > 10) {
      threats.push('Multiple MFA verification failures')
    }
    
    if (metrics.systemHealth.errorRate > 5) {
      threats.push('Elevated system error rate')
    }
    
    return threats
  }
  
  private generateRecommendations(metrics: SecurityMetrics): string[] {
    const recommendations: string[] = []
    
    if (metrics.currentThreats.failedLogins > 20) {
      recommendations.push('Consider implementing additional rate limiting for login attempts')
    }
    
    if (metrics.dailyStats.mfaAdoptionRate < 70) {
      recommendations.push('Encourage more users to enable MFA for better account security')
    }
    
    if (metrics.currentThreats.blockedIPs.length > 5) {
      recommendations.push('Review and potentially block suspicious IP addresses')
    }
    
    if (metrics.systemHealth.responseTime > 2000) {
      recommendations.push('Investigate system performance issues affecting response times')
    }
    
    return recommendations
  }
  
  private async getThreatTrending() {
    // Compare current hour with previous hour
    const currentHour = new Date()
    currentHour.setMinutes(0, 0, 0)
    
    const previousHour = new Date(currentHour.getTime() - 60 * 60 * 1000)
    
    const [currentEvents, previousEvents] = await Promise.all([
      this.getSecurityEventCount(currentHour),
      this.getSecurityEventCount(previousHour)
    ])
    
    if (previousEvents === 0) {
      return { direction: 'stable' as const, percentage: 0 }
    }
    
    const change = ((currentEvents - previousEvents) / previousEvents) * 100
    
    if (change > 10) return { direction: 'up' as const, percentage: Math.round(change) }
    if (change < -10) return { direction: 'down' as const, percentage: Math.round(Math.abs(change)) }
    return { direction: 'stable' as const, percentage: Math.round(Math.abs(change)) }
  }
  
  private async getSecurityEventCount(since: Date): Promise<number> {
    const until = new Date(since.getTime() + 60 * 60 * 1000) // One hour later
    
    const { data: events } = await supabase
      .from('security_events')
      .select('id')
      .gte('created_at', since.toISOString())
      .lt('created_at', until.toISOString())
    
    return events?.length || 0
  }
  
  // Alert creation and management
  private async createAlert(alertData: Omit<SecurityAlert, 'id' | 'timestamp' | 'autoResolved'>): Promise<SecurityAlert> {
    const alert: SecurityAlert = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      autoResolved: false,
      ...alertData
    }
    
    // Store alert in database
    await supabase.from('security_alerts').insert({
      id: alert.id,
      severity: alert.severity,
      alert_type: alert.type,
      message: alert.message,
      affected_user: alert.affectedUser,
      ip_address: alert.ipAddress,
      action_required: alert.actionRequired,
      auto_resolved: alert.autoResolved,
      metadata: alert.metadata,
      resolved: false,
      created_at: alert.timestamp
    })
    
    // Log the security event
    logger.warn(`Security alert created: ${alert.type}`, {
      alertId: alert.id,
      severity: alert.severity,
      message: alert.message
    })
    
    return alert
  }
  
  // Resolve an alert
  async resolveAlert(alertId: string, resolvedBy: string, notes?: string): Promise<boolean> {
    try {
      await supabase
        .from('security_alerts')
        .update({
          resolved: true,
          resolved_by: resolvedBy,
          resolved_at: new Date().toISOString(),
          resolution_notes: notes
        })
        .eq('id', alertId)
      
      logger.info(`Security alert resolved: ${alertId}`, {
        resolvedBy,
        notes
      })
      
      return true
    } catch (error) {
      logger.error('Failed to resolve security alert', error, { alertId })
      return false
    }
  }
}

// Export singleton instance
export const securityMonitoring = new SecurityMonitoringService()