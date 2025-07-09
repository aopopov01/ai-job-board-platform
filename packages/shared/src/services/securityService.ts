import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SecurityConfig {
  rateLimiting: {
    enabled: boolean
    maxRequests: number
    windowMs: number
  }
  inputValidation: {
    enabled: boolean
    maxLength: number
    allowedCharacters: RegExp
  }
  authentication: {
    requireMFA: boolean
    sessionTimeout: number
    maxLoginAttempts: number
  }
}

export interface RateLimitResult {
  allowed: boolean
  remainingRequests: number
  resetTime: Date
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedInput: string
}

export class SecurityService {
  private config: SecurityConfig

  constructor(config: SecurityConfig) {
    this.config = config
  }

  // Input validation and sanitization
  validateAndSanitizeInput(input: string, type: 'text' | 'email' | 'search' | 'sql'): ValidationResult {
    const errors: string[] = []
    let sanitizedInput = input

    try {
      // Length validation
      if (input.length > this.config.inputValidation.maxLength) {
        errors.push(`Input exceeds maximum length of ${this.config.inputValidation.maxLength}`)
      }

      // Character validation
      if (!this.config.inputValidation.allowedCharacters.test(input)) {
        errors.push('Input contains invalid characters')
      }

      // Type-specific validation
      switch (type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(input)) {
            errors.push('Invalid email format')
          }
          break
        
        case 'search':
          // Remove SQL injection patterns
          sanitizedInput = input.replace(/['";\\]/g, '')
          break
        
        case 'sql':
          // Strict SQL injection prevention
          const sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
            /('|(\\)|(;)|(\/\*)|(\\*\/)|(\\x)|(\\0)|(\\n)|(\\r))/i
          ]
          
          for (const pattern of sqlPatterns) {
            if (pattern.test(input)) {
              errors.push('Input contains potentially dangerous SQL patterns')
              break
            }
          }
          break
        
        case 'text':
          // Basic XSS prevention
          sanitizedInput = input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
          break
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitizedInput
      }
    } catch (error) {
      return {
        isValid: false,
        errors: ['Validation error occurred'],
        sanitizedInput: ''
      }
    }
  }

  // Rate limiting
  async checkRateLimit(userId: string, endpoint: string): Promise<RateLimitResult> {
    try {
      const key = `rate_limit:${userId}:${endpoint}`
      const now = Date.now()
      const windowStart = now - this.config.rateLimiting.windowMs

      // Get recent requests
      const { data: requests, error } = await supabase
        .from('rate_limit_logs')
        .select('timestamp')
        .eq('user_id', userId)
        .eq('endpoint', endpoint)
        .gte('timestamp', new Date(windowStart).toISOString())
        .order('timestamp', { ascending: false })

      if (error) throw error

      const requestCount = requests?.length || 0
      const allowed = requestCount < this.config.rateLimiting.maxRequests

      if (allowed) {
        // Log this request
        await supabase
          .from('rate_limit_logs')
          .insert({
            user_id: userId,
            endpoint,
            timestamp: new Date().toISOString()
          })
      }

      return {
        allowed,
        remainingRequests: Math.max(0, this.config.rateLimiting.maxRequests - requestCount - 1),
        resetTime: new Date(now + this.config.rateLimiting.windowMs)
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      return {
        allowed: false,
        remainingRequests: 0,
        resetTime: new Date()
      }
    }
  }

  // Authentication security
  async validateAuthToken(token: string): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      return !error && !!user
    } catch (error) {
      console.error('Token validation failed:', error)
      return false
    }
  }

  // Password strength validation
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Generate secure token
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  // Hash sensitive data
  hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const hmac = crypto.createHmac('sha256', secret)
      hmac.update(payload)
      const expectedSignature = hmac.digest('hex')
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return false
    }
  }

  // CORS validation
  validateCorsOrigin(origin: string, allowedOrigins: string[]): boolean {
    if (!origin) return false
    return allowedOrigins.includes(origin) || allowedOrigins.includes('*')
  }

  // IP validation for webhooks
  validateIPAddress(ip: string, allowedIPs: string[]): boolean {
    return allowedIPs.includes(ip)
  }

  // Clean up old rate limit logs
  async cleanupRateLimitLogs(): Promise<void> {
    try {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
      
      await supabase
        .from('rate_limit_logs')
        .delete()
        .lt('timestamp', cutoffTime.toISOString())
    } catch (error) {
      console.error('Failed to cleanup rate limit logs:', error)
    }
  }
}

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  rateLimiting: {
    enabled: true,
    maxRequests: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  inputValidation: {
    enabled: true,
    maxLength: 1000,
    allowedCharacters: /^[a-zA-Z0-9\s\-_@.!?,:;()[\]{}'"]+$/
  },
  authentication: {
    requireMFA: false,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5
  }
}

export const securityService = new SecurityService(defaultSecurityConfig)