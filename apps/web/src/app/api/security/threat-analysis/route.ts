import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key-for-testing'
)

export async function GET(request: NextRequest) {
  try {
    
    // Calculate risk score based on recent activity
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const [securityEvents, failedLogins, blockedIPs] = await Promise.all([
      supabase
        .from('security_events')
        .select('event_type')
        .gte('created_at', last24Hours.toISOString()),
      
      supabase
        .from('failed_login_attempts')
        .select('count')
        .gte('created_at', last24Hours.toISOString()),
      
      supabase
        .from('ip_access_control')
        .select('count')
        .eq('access_type', 'blacklist')
        .eq('is_active', true)
    ])

    const eventCounts = securityEvents.data?.reduce((acc: any, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    }, {}) || {}

    // Calculate risk score (0-100)
    let riskScore = 0
    const activeThreats: string[] = []
    const recommendations: string[] = []

    // Factor in failed logins
    const failedLoginCount = failedLogins.data?.length || 0
    if (failedLoginCount > 50) {
      riskScore += 30
      activeThreats.push(`High failed login attempts: ${failedLoginCount}`)
      recommendations.push('Review and strengthen password policies')
    } else if (failedLoginCount > 20) {
      riskScore += 15
      activeThreats.push(`Moderate failed login attempts: ${failedLoginCount}`)
    }

    // Factor in rate limiting
    const rateLimitHits = eventCounts.rate_limit_hit || 0
    if (rateLimitHits > 100) {
      riskScore += 25
      activeThreats.push(`Excessive rate limiting: ${rateLimitHits} hits`)
      recommendations.push('Consider implementing CAPTCHA for high-traffic endpoints')
    }

    // Factor in blocked IPs
    const blockedIPCount = blockedIPs.data?.length || 0
    if (blockedIPCount > 10) {
      riskScore += 20
      activeThreats.push(`Multiple blocked IPs: ${blockedIPCount}`)
      recommendations.push('Review IP blocking patterns for potential attacks')
    }

    // Factor in suspicious activity
    const suspiciousEvents = eventCounts.suspicious_activity || 0
    if (suspiciousEvents > 10) {
      riskScore += 25
      activeThreats.push(`Suspicious activity detected: ${suspiciousEvents} events`)
      recommendations.push('Investigate suspicious activity patterns')
    }

    // Determine threat level
    let threatLevel: 'low' | 'medium' | 'high' | 'critical'
    if (riskScore >= 80) threatLevel = 'critical'
    else if (riskScore >= 60) threatLevel = 'high'
    else if (riskScore >= 30) threatLevel = 'medium'
    else threatLevel = 'low'

    // Calculate trending (mock calculation for now)
    const trendingDirection = riskScore > 50 ? 'up' : riskScore < 20 ? 'down' : 'stable'
    const trendingPercentage = Math.floor(Math.random() * 20) + 5

    // Add general recommendations based on threat level
    if (threatLevel === 'low' && recommendations.length === 0) {
      recommendations.push('Security posture is good. Continue monitoring.')
    }
    
    if (riskScore > 30) {
      recommendations.push('Enable MFA for all administrative accounts')
      recommendations.push('Review recent security events for patterns')
    }

    const analysis = {
      riskScore,
      threatLevel,
      activeThreats,
      recommendations,
      trending: {
        direction: trendingDirection,
        percentage: trendingPercentage
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Threat analysis API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze threats' },
      { status: 500 }
    )
  }
}