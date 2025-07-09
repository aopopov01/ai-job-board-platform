import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { securityService } from '../services/securityService'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (req: NextRequest) => string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: Date
  retryAfter?: number
}

export class RateLimiter {
  private config: RateLimitConfig
  private stores: Map<string, { count: number; resetTime: number }> = new Map()

  constructor(config: RateLimitConfig) {
    this.config = config
    this.cleanupExpiredEntries()
  }

  async checkRateLimit(req: NextRequest): Promise<RateLimitResult> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getDefaultKey(req)
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    
    try {
      // Get current count from store
      let store = this.stores.get(key)
      
      if (!store || store.resetTime <= now) {
        // Reset or create new store
        store = {
          count: 0,
          resetTime: now + this.config.windowMs
        }
        this.stores.set(key, store)
      }

      // Check if limit exceeded
      if (store.count >= this.config.maxRequests) {
        return {
          success: false,
          limit: this.config.maxRequests,
          remaining: 0,
          reset: new Date(store.resetTime),
          retryAfter: Math.ceil((store.resetTime - now) / 1000)
        }
      }

      // Increment count
      store.count++
      this.stores.set(key, store)

      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - store.count,
        reset: new Date(store.resetTime)
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      // On error, allow request but log it
      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        reset: new Date(now + this.config.windowMs)
      }
    }
  }

  private getDefaultKey(req: NextRequest): string {
    // Use IP address as default key
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
    return `rate_limit:${ip}`
  }

  private cleanupExpiredEntries(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, store] of this.stores.entries()) {
        if (store.resetTime <= now) {
          this.stores.delete(key)
        }
      }
    }, this.config.windowMs)
  }
}

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes  
    maxRequests: 5
  },
  
  // Search endpoints
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20
  },
  
  // AI-powered endpoints
  ai: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10
  },
  
  // Payment endpoints
  payment: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3
  },
  
  // File upload endpoints
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5
  }
}

// Create rate limiter instances
export const rateLimiters = {
  api: new RateLimiter(rateLimitConfigs.api),
  auth: new RateLimiter(rateLimitConfigs.auth),
  search: new RateLimiter(rateLimitConfigs.search),
  ai: new RateLimiter(rateLimitConfigs.ai),
  payment: new RateLimiter(rateLimitConfigs.payment),
  upload: new RateLimiter(rateLimitConfigs.upload)
}

// Middleware function for Next.js API routes
export function withRateLimit(rateLimiter: RateLimiter) {
  return async (req: NextRequest, handler: (req: NextRequest) => Promise<NextResponse>) => {
    const result = await rateLimiter.checkRateLimit(req)
    
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${result.retryAfter} seconds.`,
          retryAfter: result.retryAfter
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toISOString(),
            'Retry-After': result.retryAfter?.toString() || '60'
          }
        }
      )
    }
    
    const response = await handler(req)
    
    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.reset.toISOString())
    
    return response
  }
}

// User-based rate limiting (requires authentication)
export class UserRateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async checkUserRateLimit(userId: string, endpoint: string): Promise<RateLimitResult> {
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    
    try {
      // Get user's recent requests from database
      const { data: requests, error } = await supabase
        .from('user_rate_limits')
        .select('timestamp')
        .eq('user_id', userId)
        .eq('endpoint', endpoint)
        .gte('timestamp', new Date(windowStart).toISOString())
        .order('timestamp', { ascending: false })

      if (error) throw error

      const requestCount = requests?.length || 0
      
      if (requestCount >= this.config.maxRequests) {
        return {
          success: false,
          limit: this.config.maxRequests,
          remaining: 0,
          reset: new Date(now + this.config.windowMs),
          retryAfter: Math.ceil(this.config.windowMs / 1000)
        }
      }

      // Log this request
      await supabase
        .from('user_rate_limits')
        .insert({
          user_id: userId,
          endpoint,
          timestamp: new Date().toISOString()
        })

      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - requestCount - 1,
        reset: new Date(now + this.config.windowMs)
      }
    } catch (error) {
      console.error('User rate limit check failed:', error)
      return {
        success: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        reset: new Date(now + this.config.windowMs)
      }
    }
  }
}

// Cleanup old rate limit records
export async function cleanupRateLimitRecords(): Promise<void> {
  try {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
    
    await supabase
      .from('user_rate_limits')
      .delete()
      .lt('timestamp', cutoffTime.toISOString())
  } catch (error) {
    console.error('Failed to cleanup rate limit records:', error)
  }
}

// Export user rate limiter instance
export const userRateLimiter = new UserRateLimiter(rateLimitConfigs.api)