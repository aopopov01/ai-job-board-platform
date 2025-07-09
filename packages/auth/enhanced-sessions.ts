import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { logger } from '../shared/src/services/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface EnhancedSession {
  id: string
  sessionId: string
  userId: string
  deviceFingerprint: string
  ipAddress: string
  userAgent: string
  locationData?: {
    country?: string
    region?: string
    city?: string
    timezone?: string
  }
  isActive: boolean
  securityFlags: {
    suspiciousActivity: boolean
    locationChange: boolean
    deviceChange: boolean
    concurrentSessions: boolean
    unusualHours: boolean
  }
  createdAt: string
  lastActivity: string
  expiresAt: string
}

export interface SessionSecurityEvent {
  sessionId: string
  userId: string
  eventType: 'created' | 'updated' | 'expired' | 'invalidated' | 'suspicious_activity' | 'location_change' | 'device_change'
  ipAddress: string
  userAgent: string
  details: any
  timestamp: string
}

export interface SessionValidationResult {
  isValid: boolean
  session?: EnhancedSession
  requiresReauth: boolean
  securityFlags: string[]
  riskScore: number
}

export class EnhancedSessionManager {
  private defaultSessionTimeout = 24 * 60 * 60 * 1000 // 24 hours
  private maxConcurrentSessions = 5
  private suspiciousActivityThreshold = 3

  // Create a new enhanced session
  async createSession(
    userId: string,
    request: {
      ipAddress: string
      userAgent: string
      headers: Record<string, string>
    }
  ): Promise<EnhancedSession> {
    try {
      const sessionId = crypto.randomUUID()
      const deviceFingerprint = this.generateDeviceFingerprint(request)
      const locationData = await this.getLocationData(request.ipAddress)
      
      // Check for concurrent sessions
      const existingSessions = await this.getUserActiveSessions(userId)
      const concurrentSessions = existingSessions.length >= this.maxConcurrentSessions
      
      if (concurrentSessions) {
        // Invalidate oldest session
        await this.invalidateOldestSession(userId)
      }
      
      const session: EnhancedSession = {
        id: crypto.randomUUID(),
        sessionId,
        userId,
        deviceFingerprint,
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        locationData,
        isActive: true,
        securityFlags: {
          suspiciousActivity: false,
          locationChange: false,
          deviceChange: false,
          concurrentSessions,
          unusualHours: this.isUnusualHours(new Date())
        },
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        expiresAt: new Date(Date.now() + this.defaultSessionTimeout).toISOString()
      }
      
      // Store session in database
      await supabase.from('enhanced_sessions').insert({
        id: session.id,
        session_id: session.sessionId,
        user_id: session.userId,
        device_fingerprint: session.deviceFingerprint,
        ip_address: session.ipAddress,
        user_agent: session.userAgent,
        location_data: session.locationData,
        is_active: session.isActive,
        security_flags: session.securityFlags,
        created_at: session.createdAt,
        last_activity: session.lastActivity,
        expires_at: session.expiresAt
      })
      
      // Log session creation
      await this.logSecurityEvent({
        sessionId: session.sessionId,
        userId: session.userId,
        eventType: 'created',
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        details: {
          deviceFingerprint,
          locationData,
          concurrentSessions
        },
        timestamp: new Date().toISOString()
      })
      
      logger.info('Enhanced session created', {
        userId,
        sessionId,
        ipAddress: request.ipAddress,
        concurrentSessions
      })
      
      return session
    } catch (error) {
      logger.error('Failed to create enhanced session', error instanceof Error ? error : new Error(String(error)), { userId })
      throw error
    }
  }
  
  // Validate and update session
  async validateSession(
    sessionId: string,
    request: {
      ipAddress: string
      userAgent: string
      headers: Record<string, string>
    }
  ): Promise<SessionValidationResult> {
    try {
      const { data: sessionData, error } = await supabase
        .from('enhanced_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_active', true)
        .single()
      
      if (error || !sessionData) {
        return {
          isValid: false,
          requiresReauth: true,
          securityFlags: ['session_not_found'],
          riskScore: 100
        }
      }
      
      const session = this.mapDatabaseToSession(sessionData)
      
      // Check if session is expired
      if (new Date(session.expiresAt) <= new Date()) {
        await this.invalidateSession(sessionId)
        return {
          isValid: false,
          requiresReauth: true,
          securityFlags: ['session_expired'],
          riskScore: 0
        }
      }
      
      // Perform security checks
      const securityFlags: string[] = []
      let riskScore = 0
      let requiresReauth = false
      
      // Check for device changes
      const currentFingerprint = this.generateDeviceFingerprint(request)
      if (session.deviceFingerprint !== currentFingerprint) {
        securityFlags.push('device_change')
        riskScore += 30
        session.securityFlags.deviceChange = true
        
        await this.logSecurityEvent({
          sessionId,
          userId: session.userId,
          eventType: 'device_change',
          ipAddress: request.ipAddress,
          userAgent: request.userAgent,
          details: {
            previousFingerprint: session.deviceFingerprint,
            currentFingerprint
          },
          timestamp: new Date().toISOString()
        })
      }
      
      // Check for location changes
      if (session.ipAddress !== request.ipAddress) {
        const locationData = await this.getLocationData(request.ipAddress)
        const locationChanged = this.isSignificantLocationChange(
          session.locationData,
          locationData
        )
        
        if (locationChanged) {
          securityFlags.push('location_change')
          riskScore += 20
          session.securityFlags.locationChange = true
          
          await this.logSecurityEvent({
            sessionId,
            userId: session.userId,
            eventType: 'location_change',
            ipAddress: request.ipAddress,
            userAgent: request.userAgent,
            details: {
              previousLocation: session.locationData,
              currentLocation: locationData
            },
            timestamp: new Date().toISOString()
          })
        }
      }
      
      // Check for unusual activity patterns
      const suspiciousActivity = await this.checkSuspiciousActivity(session.userId, request)
      if (suspiciousActivity) {
        securityFlags.push('suspicious_activity')
        riskScore += 40
        session.securityFlags.suspiciousActivity = true
      }
      
      // Check for unusual hours
      if (this.isUnusualHours(new Date())) {
        securityFlags.push('unusual_hours')
        riskScore += 10
        session.securityFlags.unusualHours = true
      }
      
      // Determine if re-authentication is required
      if (riskScore >= 50) {
        requiresReauth = true
      }
      
      // Update session activity
      if (!requiresReauth) {
        await this.updateSessionActivity(session, request)
      }
      
      return {
        isValid: true,
        session,
        requiresReauth,
        securityFlags,
        riskScore
      }
    } catch (error) {
      logger.error('Failed to validate session', error instanceof Error ? error : new Error(String(error)), { sessionId })
      return {
        isValid: false,
        requiresReauth: true,
        securityFlags: ['validation_error'],
        riskScore: 100
      }
    }
  }
  
  // Update session activity
  async updateSessionActivity(
    session: EnhancedSession,
    request: {
      ipAddress: string
      userAgent: string
      headers: Record<string, string>
    }
  ): Promise<void> {
    try {
      const now = new Date().toISOString()
      
      await supabase
        .from('enhanced_sessions')
        .update({
          last_activity: now,
          ip_address: request.ipAddress,
          user_agent: request.userAgent,
          security_flags: session.securityFlags
        })
        .eq('session_id', session.sessionId)
      
      // Log activity update
      await this.logSecurityEvent({
        sessionId: session.sessionId,
        userId: session.userId,
        eventType: 'updated',
        ipAddress: request.ipAddress,
        userAgent: request.userAgent,
        details: {
          previousActivity: session.lastActivity,
          currentActivity: now
        },
        timestamp: now
      })
    } catch (error) {
      logger.error('Failed to update session activity', error instanceof Error ? error : new Error(String(error)), {
        sessionId: session.sessionId
      })
    }
  }
  
  // Invalidate session
  async invalidateSession(sessionId: string): Promise<void> {
    try {
      const { data: sessionData } = await supabase
        .from('enhanced_sessions')
        .select('user_id, ip_address, user_agent')
        .eq('session_id', sessionId)
        .single()
      
      await supabase
        .from('enhanced_sessions')
        .update({ is_active: false })
        .eq('session_id', sessionId)
      
      if (sessionData) {
        await this.logSecurityEvent({
          sessionId,
          userId: sessionData.user_id,
          eventType: 'invalidated',
          ipAddress: sessionData.ip_address,
          userAgent: sessionData.user_agent,
          details: { reason: 'manual_invalidation' },
          timestamp: new Date().toISOString()
        })
      }
      
      logger.info('Session invalidated', { sessionId })
    } catch (error) {
      logger.error('Failed to invalidate session', error instanceof Error ? error : new Error(String(error)), { sessionId })
    }
  }
  
  // Invalidate all user sessions
  async invalidateAllUserSessions(userId: string): Promise<void> {
    try {
      await supabase
        .from('enhanced_sessions')
        .update({ is_active: false })
        .eq('user_id', userId)
      
      logger.info('All user sessions invalidated', { userId })
    } catch (error) {
      logger.error('Failed to invalidate all user sessions', error instanceof Error ? error : new Error(String(error)), { userId })
    }
  }
  
  // Get user's active sessions
  async getUserActiveSessions(userId: string): Promise<EnhancedSession[]> {
    try {
      const { data: sessions, error } = await supabase
        .from('enhanced_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('last_activity', { ascending: false })
      
      if (error) throw error
      
      return sessions?.map(this.mapDatabaseToSession) || []
    } catch (error) {
      logger.error('Failed to get user active sessions', error instanceof Error ? error : new Error(String(error)), { userId })
      return []
    }
  }
  
  // Cleanup expired sessions
  async cleanupExpiredSessions(): Promise<void> {
    try {
      const now = new Date().toISOString()
      
      const { data: expiredSessions } = await supabase
        .from('enhanced_sessions')
        .select('session_id, user_id')
        .lt('expires_at', now)
        .eq('is_active', true)
      
      if (expiredSessions && expiredSessions.length > 0) {
        await supabase
          .from('enhanced_sessions')
          .update({ is_active: false })
          .lt('expires_at', now)
        
        // Log expired sessions
        for (const session of expiredSessions) {
          await this.logSecurityEvent({
            sessionId: session.session_id,
            userId: session.user_id,
            eventType: 'expired',
            ipAddress: 'system',
            userAgent: 'system',
            details: { reason: 'expired' },
            timestamp: new Date().toISOString()
          })
        }
        
        logger.info('Cleaned up expired sessions', { count: expiredSessions.length })
      }
    } catch (error) {
      logger.error('Failed to cleanup expired sessions', error instanceof Error ? error : new Error(String(error)))
    }
  }
  
  // Private helper methods
  private generateDeviceFingerprint(request: {
    userAgent: string
    headers: Record<string, string>
  }): string {
    const components = [
      request.userAgent || '',
      request.headers['accept-language'] || '',
      request.headers['accept-encoding'] || '',
      request.headers['accept'] || ''
    ]
    
    return crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex')
      .substring(0, 32)
  }
  
  private async getLocationData(ipAddress: string): Promise<any> {
    try {
      // In production, use a real IP geolocation service
      // For now, return mock data
      return {
        country: 'US',
        region: 'California',
        city: 'San Francisco',
        timezone: 'America/Los_Angeles'
      }
    } catch (error) {
      logger.error('Failed to get location data', error instanceof Error ? error : new Error(String(error)), { ipAddress })
      return null
    }
  }
  
  private isSignificantLocationChange(
    previous: any,
    current: any
  ): boolean {
    if (!previous || !current) return false
    
    // Consider it significant if country or region changed
    return (
      previous.country !== current.country ||
      previous.region !== current.region
    )
  }
  
  private async checkSuspiciousActivity(
    userId: string,
    request: {
      ipAddress: string
      userAgent: string
      headers: Record<string, string>
    }
  ): Promise<boolean> {
    try {
      const last5Minutes = new Date(Date.now() - 5 * 60 * 1000)
      
      const { data: recentEvents } = await supabase
        .from('security_events')
        .select('event_type')
        .eq('user_id', userId)
        .gte('created_at', last5Minutes.toISOString())
      
      const suspiciousEvents = recentEvents?.filter(event =>
        ['failed_login', 'rate_limit_hit', 'suspicious_pattern'].includes(event.event_type)
      ).length || 0
      
      return suspiciousEvents >= this.suspiciousActivityThreshold
    } catch (error) {
      logger.error('Failed to check suspicious activity', error instanceof Error ? error : new Error(String(error)), { userId })
      return false
    }
  }
  
  private isUnusualHours(date: Date): boolean {
    const hour = date.getHours()
    // Consider 2 AM to 6 AM as unusual hours
    return hour >= 2 && hour <= 6
  }
  
  private async invalidateOldestSession(userId: string): Promise<void> {
    try {
      const { data: oldestSession } = await supabase
        .from('enhanced_sessions')
        .select('session_id')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()
      
      if (oldestSession) {
        await this.invalidateSession(oldestSession.session_id)
      }
    } catch (error) {
      logger.error('Failed to invalidate oldest session', error instanceof Error ? error : new Error(String(error)), { userId })
    }
  }
  
  private mapDatabaseToSession(data: any): EnhancedSession {
    return {
      id: data.id,
      sessionId: data.session_id,
      userId: data.user_id,
      deviceFingerprint: data.device_fingerprint,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      locationData: data.location_data,
      isActive: data.is_active,
      securityFlags: data.security_flags || {
        suspiciousActivity: false,
        locationChange: false,
        deviceChange: false,
        concurrentSessions: false,
        unusualHours: false
      },
      createdAt: data.created_at,
      lastActivity: data.last_activity,
      expiresAt: data.expires_at
    }
  }
  
  private async logSecurityEvent(event: SessionSecurityEvent): Promise<void> {
    try {
      await supabase.from('security_events').insert({
        user_id: event.userId,
        event_type: `session_${event.eventType}`,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        metadata: {
          session_id: event.sessionId,
          ...event.details
        },
        created_at: event.timestamp
      })
    } catch (error) {
      logger.error('Failed to log security event', error instanceof Error ? error : new Error(String(error)), { event })
    }
  }
  
  // Session analytics
  async getSessionAnalytics(userId: string): Promise<{
    totalSessions: number
    activeSessions: number
    deviceCount: number
    locationCount: number
    securityFlags: Record<string, number>
  }> {
    try {
      const { data: sessions } = await supabase
        .from('enhanced_sessions')
        .select('*')
        .eq('user_id', userId)
      
      if (!sessions) {
        return {
          totalSessions: 0,
          activeSessions: 0,
          deviceCount: 0,
          locationCount: 0,
          securityFlags: {}
        }
      }
      
      const activeSessions = sessions.filter(s => s.is_active).length
      const deviceCount = new Set(sessions.map(s => s.device_fingerprint)).size
      const locationCount = new Set(sessions.map(s => s.ip_address)).size
      
      const securityFlags: Record<string, number> = {}
      sessions.forEach(session => {
        const flags = session.security_flags || {}
        Object.entries(flags).forEach(([flag, value]) => {
          if (value) {
            securityFlags[flag] = (securityFlags[flag] || 0) + 1
          }
        })
      })
      
      return {
        totalSessions: sessions.length,
        activeSessions,
        deviceCount,
        locationCount,
        securityFlags
      }
    } catch (error) {
      logger.error('Failed to get session analytics', error instanceof Error ? error : new Error(String(error)), { userId })
      return {
        totalSessions: 0,
        activeSessions: 0,
        deviceCount: 0,
        locationCount: 0,
        securityFlags: {}
      }
    }
  }
}

// Export singleton instance
export const enhancedSessionManager = new EnhancedSessionManager()

// Cleanup function to be called periodically
export const startSessionCleanup = () => {
  // Clean up expired sessions every 5 minutes
  setInterval(async () => {
    await enhancedSessionManager.cleanupExpiredSessions()
  }, 5 * 60 * 1000)
}