import { NextRequest, NextResponse } from 'next/server'
import { fraudDetection } from './fraud-detection'

export interface SecurityContext {
  ipAddress: string
  userAgent: string
  country?: string
  vpnDetected?: boolean
  proxyDetected?: boolean
  deviceFingerprint?: any
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Security middleware
export function securityMiddleware(config?: {
  enableFraudDetection?: boolean
  enableRateLimit?: boolean
  rateLimitConfig?: RateLimitConfig
  enableDeviceFingerprinting?: boolean
}) {
  return async (req: NextRequest, res: NextResponse, next: Function) => {
    try {
      const securityContext = await buildSecurityContext(req)
      
      // Rate limiting
      if (config?.enableRateLimit) {
        const rateLimitResult = await checkRateLimit(req, config.rateLimitConfig)
        if (!rateLimitResult.allowed) {
          return NextResponse.json(
            { error: rateLimitResult.message || 'Rate limit exceeded' },
            { 
              status: 429,
              headers: {
                'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
                'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '100',
                'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
                'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '0'
              }
            }
          )
        }
      }

      // Device fingerprinting and bot detection
      if (config?.enableDeviceFingerprinting) {
        const botDetection = await detectBot(req, securityContext)
        if (botDetection.isBot && botDetection.confidence > 0.8) {
          await logSecurityEvent(req, 'bot_detected', {
            confidence: botDetection.confidence,
            indicators: botDetection.indicators,
            securityContext
          })
          
          return NextResponse.json(
            { error: 'Automated requests are not allowed' },
            { status: 403 }
          )
        }
      }

      // Fraud detection for authenticated users
      if (config?.enableFraudDetection) {
        const userId = await getUserIdFromRequest(req)
        if (userId) {
          const sessionValid = await fraudDetection.monitorUserSession(userId, {
            ...securityContext,
            timestamp: Date.now(),
            endpoint: req.nextUrl.pathname,
            method: req.method
          })

          if (!sessionValid) {
            await logSecurityEvent(req, 'suspicious_session', {
              userId,
              securityContext,
              endpoint: req.nextUrl.pathname
            })
            
            return NextResponse.json(
              { error: 'Session flagged for suspicious activity' },
              { status: 403 }
            )
          }
        }
      }

      // Add security context to request
      ;(req as any).securityContext = securityContext

      return next()

    } catch (error) {
      console.error('Security middleware error:', error)
      await logSecurityEvent(req, 'middleware_error', { error: error.message })
      return next() // Continue despite security check failure
    }
  }
}

// Build security context from request
async function buildSecurityContext(req: NextRequest): Promise<SecurityContext> {
  const ipAddress = getClientIP(req)
  const userAgent = req.headers.get('user-agent') || 'Unknown'
  
  // Get geographic and VPN information
  const geoData = await getGeoData(ipAddress)
  
  // Extract device fingerprint from headers
  const deviceFingerprint = {
    userAgent,
    acceptLanguage: req.headers.get('accept-language'),
    acceptEncoding: req.headers.get('accept-encoding'),
    dnt: req.headers.get('dnt'),
    connection: req.headers.get('connection'),
    cacheControl: req.headers.get('cache-control'),
    secFetchDest: req.headers.get('sec-fetch-dest'),
    secFetchMode: req.headers.get('sec-fetch-mode'),
    secFetchSite: req.headers.get('sec-fetch-site'),
    secFetchUser: req.headers.get('sec-fetch-user')
  }

  return {
    ipAddress,
    userAgent,
    country: geoData.country,
    vpnDetected: geoData.vpnDetected,
    proxyDetected: geoData.proxyDetected,
    deviceFingerprint
  }
}

// Get client IP address
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  const clientIP = req.headers.get('x-client-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (clientIP) {
    return clientIP
  }
  
  return req.ip || 'unknown'
}

// Get geographic data and VPN detection
async function getGeoData(ipAddress: string) {
  try {
    // In production, use a service like MaxMind, IPinfo, or similar
    // For demo, return mock data
    if (ipAddress === 'unknown' || ipAddress.startsWith('127.') || ipAddress.startsWith('192.168.')) {
      return {
        country: 'Unknown',
        vpnDetected: false,
        proxyDetected: false
      }
    }

    // Mock implementation - replace with actual service
    return {
      country: 'US', // Would be determined by IP geolocation
      vpnDetected: false, // Would be determined by VPN detection service
      proxyDetected: false // Would be determined by proxy detection service
    }
  } catch (error) {
    console.error('Geo data lookup failed:', error)
    return {
      country: 'Unknown',
      vpnDetected: false,
      proxyDetected: false
    }
  }
}

// Rate limiting check
async function checkRateLimit(req: NextRequest, config?: RateLimitConfig) {
  const defaultConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests, please try again later'
  }

  const rateLimitConfig = { ...defaultConfig, ...config }
  const key = `${getClientIP(req)}:${req.nextUrl.pathname}`
  const now = Date.now()
  const windowStart = now - rateLimitConfig.windowMs

  // Clean up old entries
  for (const [storeKey, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(storeKey)
    }
  }

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + rateLimitConfig.windowMs
    }
    rateLimitStore.set(key, entry)
  }

  // Increment counter
  entry.count++

  const allowed = entry.count <= rateLimitConfig.maxRequests
  const remaining = Math.max(0, rateLimitConfig.maxRequests - entry.count)
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000)

  return {
    allowed,
    limit: rateLimitConfig.maxRequests,
    remaining,
    resetTime: entry.resetTime,
    retryAfter: allowed ? undefined : retryAfter,
    message: allowed ? undefined : rateLimitConfig.message
  }
}

// Bot detection
async function detectBot(req: NextRequest, context: SecurityContext) {
  const indicators: string[] = []
  let score = 0

  // Check user agent
  const userAgent = context.userAgent.toLowerCase()
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'headless', 'phantom',
    'selenium', 'webdriver', 'puppeteer', 'playwright'
  ]
  
  for (const pattern of botPatterns) {
    if (userAgent.includes(pattern)) {
      indicators.push(`Bot pattern in user agent: ${pattern}`)
      score += 0.3
    }
  }

  // Check for missing common headers
  const commonHeaders = ['accept', 'accept-language', 'accept-encoding']
  const missingHeaders = commonHeaders.filter(header => !req.headers.get(header))
  
  if (missingHeaders.length > 0) {
    indicators.push(`Missing common headers: ${missingHeaders.join(', ')}`)
    score += missingHeaders.length * 0.2
  }

  // Check for suspicious header values
  const acceptLanguage = req.headers.get('accept-language')
  if (!acceptLanguage || acceptLanguage === '*') {
    indicators.push('Suspicious or missing Accept-Language header')
    score += 0.2
  }

  // Check for automated request patterns
  const secFetchSite = req.headers.get('sec-fetch-site')
  const secFetchMode = req.headers.get('sec-fetch-mode')
  
  if (!secFetchSite && !secFetchMode) {
    indicators.push('Missing Sec-Fetch headers (possible automation)')
    score += 0.2
  }

  // Check for VPN/Proxy usage (higher bot probability)
  if (context.vpnDetected || context.proxyDetected) {
    indicators.push('VPN or proxy detected')
    score += 0.3
  }

  const confidence = Math.min(score, 1)
  const isBot = confidence > 0.6

  return {
    isBot,
    confidence,
    indicators,
    score
  }
}

// Get user ID from request
async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split(' ')[1]
    // This would need to be implemented based on your auth system
    // For now, return null since we don't have the auth verification logic here
    return null
    
  } catch (error) {
    return null
  }
}

// Log security events
async function logSecurityEvent(req: NextRequest, eventType: string, metadata: any) {
  try {
    const event = {
      event_type: eventType,
      ip_address: getClientIP(req),
      user_agent: req.headers.get('user-agent'),
      endpoint: req.nextUrl.pathname,
      method: req.method,
      metadata,
      timestamp: new Date().toISOString()
    }

    // In production, this would write to your security events table
    console.log('Security Event:', event)
    
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

// Content Security Policy middleware
export function cspMiddleware() {
  return (req: NextRequest, res: NextResponse, next: Function) => {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel.app https://*.supabase.co",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://*.vercel.app wss://*.supabase.co",
      "frame-src 'self' https://*.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')

    res.headers.set('Content-Security-Policy', cspDirectives)
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('X-Frame-Options', 'DENY')
    res.headers.set('X-XSS-Protection', '1; mode=block')
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

    return next()
  }
}

// CORS middleware with security considerations
export function corsMiddleware(options?: {
  allowedOrigins?: string[]
  allowedMethods?: string[]
  allowedHeaders?: string[]
  credentials?: boolean
}) {
  const defaultOptions = {
    allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  }

  const config = { ...defaultOptions, ...options }

  return (req: NextRequest, res: NextResponse, next: Function) => {
    const origin = req.headers.get('origin')
    
    if (origin && config.allowedOrigins.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    res.headers.set('Access-Control-Allow-Methods', config.allowedMethods.join(', '))
    res.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '))
    
    if (config.credentials) {
      res.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200 })
    }

    return next()
  }
}

// Request sanitization middleware
export function sanitizationMiddleware() {
  return async (req: NextRequest, res: NextResponse, next: Function) => {
    try {
      // Sanitize URL parameters
      const url = new URL(req.url)
      for (const [key, value] of url.searchParams.entries()) {
        const sanitizedValue = sanitizeInput(value)
        if (sanitizedValue !== value) {
          url.searchParams.set(key, sanitizedValue)
        }
      }

      // Sanitize JSON body for POST/PUT requests
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
          const body = await req.clone().json()
          const sanitizedBody = sanitizeObject(body)
          // Note: In actual implementation, you'd need to reconstruct the request
          // with the sanitized body. This is a simplified example.
        } catch (error) {
          // Not JSON body, skip sanitization
        }
      }

      return next()

    } catch (error) {
      console.error('Sanitization middleware error:', error)
      return next()
    }
  }
}

// Input sanitization
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return input

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
}

// Object sanitization
function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeInput(obj) : obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }

  const sanitized: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeInput(key)
    sanitized[sanitizedKey] = sanitizeObject(value)
  }

  return sanitized
}