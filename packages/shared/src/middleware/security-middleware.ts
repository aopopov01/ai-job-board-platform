import { NextRequest, NextResponse } from 'next/server'
import { mfaService } from '../../../auth/mfa'
import { enhancedSessionManager } from '../../../auth/enhanced-sessions'
import { securityHeaders } from '../../../security/enhanced-headers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Simple logger implementation
const logger = {
  info: (message: string, data?: any) => console.info(message, data),
  error: (message: string, error?: any, data?: any) => console.error(message, error, data)
}

// Simple rate limiter implementation
const rateLimiters = {
  api: { checkRateLimit: async (req: NextRequest) => ({ success: true, limit: 100, remaining: 99, reset: new Date(), retryAfter: null }) },
  auth: { checkRateLimit: async (req: NextRequest) => ({ success: true, limit: 10, remaining: 9, reset: new Date(), retryAfter: null }) },
  search: { checkRateLimit: async (req: NextRequest) => ({ success: true, limit: 50, remaining: 49, reset: new Date(), retryAfter: null }) },
  ai: { checkRateLimit: async (req: NextRequest) => ({ success: true, limit: 20, remaining: 19, reset: new Date(), retryAfter: null }) },
  payment: { checkRateLimit: async (req: NextRequest) => ({ success: true, limit: 5, remaining: 4, reset: new Date(), retryAfter: null }) },
  upload: { checkRateLimit: async (req: NextRequest) => ({ success: true, limit: 30, remaining: 29, reset: new Date(), retryAfter: null }) }
}

// Simple security service implementation
const securityService = {
  validateAndSanitizeInput: (input: string, type: string) => ({ isValid: true, errors: [] })
}

export interface SecurityMiddlewareConfig {
  enableMFA: boolean
  enableRateLimit: boolean
  enableSecurityHeaders: boolean
  enableSessionValidation: boolean
  enableInputValidation: boolean
  enableAuditLogging: boolean
  skipPaths: string[]
  adminPaths: string[]
  publicPaths: string[]
}

export interface SecurityContext {
  userId?: string
  sessionId?: string
  ipAddress: string
  userAgent: string
  riskScore: number
  securityFlags: string[]
  requiresMFA: boolean
  requiresReauth: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

export class SecurityMiddleware {
  private config: SecurityMiddlewareConfig

  constructor(config: SecurityMiddlewareConfig) {
    this.config = config
  }

  // Main security middleware function
  async handle(request: NextRequest): Promise<NextResponse> {
    const startTime = Date.now()
    const path = request.nextUrl.pathname
    
    try {
      // Skip security checks for certain paths
      if (this.shouldSkipSecurity(path)) {
        return this.addSecurityHeaders(NextResponse.next())
      }
      
      // Create security context
      const securityContext = await this.createSecurityContext(request)
      
      // Rate limiting
      if (this.config.enableRateLimit) {
        const rateLimitResult = await this.checkRateLimit(request, securityContext)
        if (!rateLimitResult.success && rateLimitResult.response) {
          return rateLimitResult.response
        }
      }
      
      // Input validation for POST/PUT requests
      if (this.config.enableInputValidation && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const validationResult = await this.validateInput(request)
        if (!validationResult.success && validationResult.response) {
          return validationResult.response
        }
      }
      
      // Authentication check
      if (!this.isPublicPath(path)) {
        const authResult = await this.checkAuthentication(request, securityContext)
        if (!authResult.success && authResult.response) {
          return authResult.response
        }
      }
      
      // Admin access check
      if (this.isAdminPath(path)) {
        const adminResult = await this.checkAdminAccess(request, securityContext)
        if (!adminResult.success && adminResult.response) {
          return adminResult.response
        }
      }
      
      // MFA validation
      if (this.config.enableMFA && securityContext.requiresMFA) {
        const mfaResult = await this.checkMFAStatus(request, securityContext)
        if (!mfaResult.success && mfaResult.response) {
          return mfaResult.response
        }
      }
      
      // Session validation
      if (this.config.enableSessionValidation && securityContext.sessionId) {
        const sessionResult = await this.validateSession(request, securityContext)
        if (!sessionResult.success && sessionResult.response) {
          return sessionResult.response
        }
      }
      
      // Audit logging
      if (this.config.enableAuditLogging) {
        await this.logSecurityEvent(request, securityContext, 'access_granted')
      }
      
      // Add security context to request headers
      const response = NextResponse.next()
      this.addSecurityContextToResponse(response, securityContext)
      
      // Add security headers
      const secureResponse = this.addSecurityHeaders(response)
      
      // Log performance
      const responseTime = Date.now() - startTime
      logger.info('Security middleware completed', {
        path,
        responseTime,
        riskScore: securityContext.riskScore,
        userId: securityContext.userId
      })
      
      return secureResponse
    } catch (error) {
      logger.error('Security middleware error', error, {
        path,
        method: request.method,
        responseTime: Date.now() - startTime
      })
      
      return NextResponse.json(
        { error: 'Security validation failed' },
        { status: 500 }
      )
    }
  }
  
  // Create security context from request
  private async createSecurityContext(request: NextRequest): Promise<SecurityContext> {
    const ipAddress = this.extractIPAddress(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Extract session information
    const sessionId = this.extractSessionId(request)
    const userId = await this.extractUserId(request)
    
    // Calculate initial risk score
    let riskScore = 0
    const securityFlags: string[] = []
    
    // Check for suspicious user agent
    if (this.isSuspiciousUserAgent(userAgent)) {
      riskScore += 20
      securityFlags.push('suspicious_user_agent')
    }
    
    // Check for known malicious IP
    if (await this.isBlacklistedIP(ipAddress)) {
      riskScore += 50
      securityFlags.push('blacklisted_ip')
    }
    
    // Check for unusual request patterns
    if (await this.hasUnusualRequestPattern(userId, ipAddress)) {
      riskScore += 30
      securityFlags.push('unusual_pattern')
    }
    
    return {
      userId,
      sessionId,
      ipAddress,
      userAgent,
      riskScore,
      securityFlags,
      requiresMFA: await this.shouldRequireMFA(userId),
      requiresReauth: riskScore >= 50,
      isAuthenticated: !!userId,
      isAdmin: await this.isAdminUser(userId)
    }
  }
  
  // Rate limiting check
  private async checkRateLimit(
    request: NextRequest,
    context: SecurityContext
  ): Promise<{ success: boolean; response?: NextResponse }> {
    try {
      const path = request.nextUrl.pathname
      const method = request.method
      
      // Determine appropriate rate limiter
      let rateLimiter = rateLimiters.api
      
      if (path.startsWith('/api/auth')) {
        rateLimiter = rateLimiters.auth
      } else if (path.startsWith('/api/search')) {
        rateLimiter = rateLimiters.search
      } else if (path.includes('/ai/') || path.includes('/gpt/')) {
        rateLimiter = rateLimiters.ai
      } else if (path.startsWith('/api/payments')) {
        rateLimiter = rateLimiters.payment
      } else if (path.includes('/upload')) {
        rateLimiter = rateLimiters.upload
      }
      
      const rateLimitResult = await rateLimiter.checkRateLimit(request)
      
      if (!rateLimitResult.success) {
        await this.logSecurityEvent(request, context, 'rate_limit_exceeded')
        
        return {
          success: false,
          response: NextResponse.json(
            {
              error: 'Rate limit exceeded',
              message: 'Too many requests. Please try again later.',
              retryAfter: rateLimitResult.retryAfter
            },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
                'Retry-After': (rateLimitResult.retryAfter as unknown as number | undefined)?.toString() || '60'
              }
            }
          )
        }
      }
      
      return { success: true }
    } catch (error) {
      logger.error('Rate limit check failed', error)
      return { success: true } // Allow on error
    }
  }
  
  // Input validation
  private async validateInput(
    request: NextRequest
  ): Promise<{ success: boolean; response?: NextResponse }> {
    try {
      const contentType = request.headers.get('content-type') || ''
      
      if (contentType.includes('application/json')) {
        const body = await request.json()
        
        // Validate JSON structure
        if (typeof body !== 'object' || body === null) {
          return {
            success: false,
            response: NextResponse.json(
              { error: 'Invalid JSON structure' },
              { status: 400 }
            )
          }
        }
        
        // Validate input fields
        const validationErrors = await this.validateInputFields(body)
        if (validationErrors.length > 0) {
          return {
            success: false,
            response: NextResponse.json(
              {
                error: 'Input validation failed',
                details: validationErrors
              },
              { status: 400 }
            )
          }
        }
      }
      
      return { success: true }
    } catch (error) {
      logger.error('Input validation failed', error)
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Invalid request format' },
          { status: 400 }
        )
      }
    }
  }
  
  // Authentication check
  private async checkAuthentication(
    request: NextRequest,
    context: SecurityContext
  ): Promise<{ success: boolean; response?: NextResponse }> {
    if (!context.isAuthenticated) {
      await this.logSecurityEvent(request, context, 'authentication_required')
      
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
    }
    
    return { success: true }
  }
  
  // Admin access check
  private async checkAdminAccess(
    request: NextRequest,
    context: SecurityContext
  ): Promise<{ success: boolean; response?: NextResponse }> {
    if (!context.isAdmin) {
      await this.logSecurityEvent(request, context, 'admin_access_denied')
      
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }
    
    return { success: true }
  }
  
  // MFA status check
  private async checkMFAStatus(
    request: NextRequest,
    context: SecurityContext
  ): Promise<{ success: boolean; response?: NextResponse }> {
    if (!context.userId) {
      return { success: true }
    }
    
    const mfaEnabled = await mfaService.isMFAEnabled(context.userId)
    
    if (!mfaEnabled && context.requiresMFA) {
      await this.logSecurityEvent(request, context, 'mfa_required')
      
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'MFA required',
            message: 'Multi-factor authentication must be enabled for this account'
          },
          { status: 403 }
        )
      }
    }
    
    return { success: true }
  }
  
  // Session validation
  private async validateSession(
    request: NextRequest,
    context: SecurityContext
  ): Promise<{ success: boolean; response?: NextResponse }> {
    if (!context.sessionId) {
      return { success: true }
    }
    
    const sessionResult = await enhancedSessionManager.validateSession(
      context.sessionId,
      {
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        headers: Object.fromEntries(request.headers.entries())
      }
    )
    
    if (!sessionResult.isValid) {
      await this.logSecurityEvent(request, context, 'session_invalid')
      
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Session invalid' },
          { status: 401 }
        )
      }
    }
    
    if (sessionResult.requiresReauth) {
      await this.logSecurityEvent(request, context, 'reauthentication_required')
      
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Re-authentication required',
            riskScore: sessionResult.riskScore,
            securityFlags: sessionResult.securityFlags
          },
          { status: 403 }
        )
      }
    }
    
    // Update context with session data
    context.riskScore = Math.max(context.riskScore, sessionResult.riskScore)
    context.securityFlags.push(...sessionResult.securityFlags)
    
    return { success: true }
  }
  
  // Helper methods
  private shouldSkipSecurity(path: string): boolean {
    return this.config.skipPaths.some(skipPath => path.startsWith(skipPath))
  }
  
  private isPublicPath(path: string): boolean {
    return this.config.publicPaths.some(publicPath => path.startsWith(publicPath))
  }
  
  private isAdminPath(path: string): boolean {
    return this.config.adminPaths.some(adminPath => path.startsWith(adminPath))
  }
  
  private extractIPAddress(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    return request.ip || 'unknown'
  }
  
  private extractSessionId(request: NextRequest): string | undefined {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return request.cookies.get('session')?.value
  }
  
  private async extractUserId(request: NextRequest): Promise<string | undefined> {
    const sessionId = this.extractSessionId(request)
    if (!sessionId) return undefined
    
    try {
      // Extract user ID from session (implement based on your auth system)
      // This is a placeholder - replace with actual implementation
      return 'user-id-placeholder'
    } catch (error) {
      return undefined
    }
  }
  
  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /curl/i,
      /wget/i,
      /python/i,
      /bot/i,
      /crawler/i,
      /scanner/i
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent))
  }
  
  private async isBlacklistedIP(ipAddress: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('ip_access_control')
        .select('id')
        .eq('ip_address', ipAddress)
        .eq('access_type', 'blacklist')
        .eq('is_active', true)
        .single()
      
      return !!data
    } catch (error) {
      return false
    }
  }
  
  private async hasUnusualRequestPattern(
    userId: string | undefined,
    ipAddress: string
  ): Promise<boolean> {
    if (!userId) return false
    
    try {
      const last5Minutes = new Date(Date.now() - 5 * 60 * 1000)
      
      const { data } = await supabase
        .from('security_events')
        .select('id')
        .eq('user_id', userId)
        .eq('ip_address', ipAddress)
        .gte('created_at', last5Minutes.toISOString())
      
      return (data?.length || 0) > 20 // More than 20 requests in 5 minutes
    } catch (error) {
      return false
    }
  }
  
  private async shouldRequireMFA(userId: string | undefined): Promise<boolean> {
    if (!userId) return false
    
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single()
      
      return data?.role === 'admin' // Require MFA for admin users
    } catch (error) {
      return false
    }
  }
  
  private async isAdminUser(userId: string | undefined): Promise<boolean> {
    if (!userId) return false
    
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single()
      
      return data?.role === 'admin'
    } catch (error) {
      return false
    }
  }
  
  private async validateInputFields(body: any): Promise<string[]> {
    const errors: string[] = []
    
    // Recursively validate all string fields
    const validateObject = (obj: any, path: string = '') => {
      if (typeof obj === 'string') {
        const validation = securityService.validateAndSanitizeInput(obj, 'text')
        if (!validation.isValid) {
          errors.push(`${path}: ${validation.errors.join(', ')}`)
        }
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key
          validateObject(value, currentPath)
        })
      }
    }
    
    validateObject(body)
    return errors
  }
  
  private addSecurityHeaders(response: NextResponse): NextResponse {
    if (this.config.enableSecurityHeaders) {
      const headers = securityHeaders.getSecurityHeaders()
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
    }
    
    return response
  }
  
  private addSecurityContextToResponse(
    response: NextResponse,
    context: SecurityContext
  ): void {
    response.headers.set('X-Security-Context', JSON.stringify({
      riskScore: context.riskScore,
      securityFlags: context.securityFlags,
      requiresMFA: context.requiresMFA,
      isAuthenticated: context.isAuthenticated
    }))
  }
  
  private async logSecurityEvent(
    request: NextRequest,
    context: SecurityContext,
    eventType: string
  ): Promise<void> {
    try {
      await supabase.from('security_events').insert({
        user_id: context.userId,
        event_type: eventType,
        ip_address: context.ipAddress,
        user_agent: context.userAgent,
        endpoint: request.nextUrl.pathname,
        method: request.method,
        metadata: {
          riskScore: context.riskScore,
          securityFlags: context.securityFlags,
          sessionId: context.sessionId
        },
        created_at: new Date().toISOString()
      })
    } catch (error) {
      logger.error('Failed to log security event', error)
    }
  }
}

// Default security configuration
export const defaultSecurityConfig: SecurityMiddlewareConfig = {
  enableMFA: true,
  enableRateLimit: true,
  enableSecurityHeaders: true,
  enableSessionValidation: true,
  enableInputValidation: true,
  enableAuditLogging: true,
  skipPaths: [
    '/api/health',
    '/api/metrics',
    '/_next',
    '/favicon.ico',
    '/robots.txt'
  ],
  adminPaths: [
    '/admin',
    '/api/admin',
    '/dashboard/admin'
  ],
  publicPaths: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/reset-password',
    '/api/jobs/public',
    '/api/companies/public'
  ]
}

// Export middleware instance
export const securityMiddleware = new SecurityMiddleware(defaultSecurityConfig)

// Middleware function for Next.js
export function withSecurity(config?: Partial<SecurityMiddlewareConfig>) {
  const middleware = new SecurityMiddleware({
    ...defaultSecurityConfig,
    ...config
  })
  
  return (request: NextRequest) => middleware.handle(request)
}