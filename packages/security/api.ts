import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fraudDetection, FraudAnalysisResult } from './fraud-detection'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SecurityAnalysisRequest {
  userId: string
  context?: {
    ipAddress?: string
    userAgent?: string
    deviceFingerprint?: any
    sessionData?: any
  }
}

export interface SecurityFlagRequest {
  userId: string
  flagType: 'suspicious_activity' | 'fraud_detected' | 'bot_behavior' | 'policy_violation'
  reason: string
  evidence: any
  severity: 'low' | 'medium' | 'high' | 'critical'
}

// Analyze user for fraud risk
export async function analyzeUserSecurity(req: NextRequest) {
  try {
    const { userId, context }: SecurityAnalysisRequest = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check authentication and authorization
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user has admin privileges
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'recruiter') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Perform fraud analysis
    const analysis = await fraudDetection.analyzeUser(userId, context)

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error('Security analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get security flags for a user
export async function getUserSecurityFlags(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get security flags
    const { data: flags, error } = await supabase
      .from('security_flags')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching security flags:', error)
      return NextResponse.json({ error: 'Failed to fetch security flags' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      flags: flags || []
    })

  } catch (error) {
    console.error('Get security flags error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a security flag
export async function createSecurityFlag(req: NextRequest) {
  try {
    const { userId, flagType, reason, evidence, severity }: SecurityFlagRequest = await req.json()

    if (!userId || !flagType || !reason) {
      return NextResponse.json({ 
        error: 'User ID, flag type, and reason are required' 
      }, { status: 400 })
    }

    // Check authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check permissions
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'recruiter') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Create security flag
    const { data: flag, error } = await supabase
      .from('security_flags')
      .insert({
        user_id: userId,
        flag_type: flagType,
        reason,
        evidence,
        severity: severity || 'medium',
        status: 'active',
        created_by: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating security flag:', error)
      return NextResponse.json({ error: 'Failed to create security flag' }, { status: 500 })
    }

    // Send notification to security team
    await sendSecurityNotification(flag, userId, user.id)

    return NextResponse.json({
      success: true,
      flag
    })

  } catch (error) {
    console.error('Create security flag error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update security flag status
export async function updateSecurityFlag(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const flagId = url.searchParams.get('flagId')
    const { status, resolution, notes } = await req.json()

    if (!flagId || !status) {
      return NextResponse.json({ 
        error: 'Flag ID and status are required' 
      }, { status: 400 })
    }

    // Check authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Update security flag
    const { data: flag, error } = await supabase
      .from('security_flags')
      .update({
        status,
        resolution,
        notes,
        resolved_by: user.id,
        resolved_at: status === 'resolved' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', flagId)
      .select()
      .single()

    if (error) {
      console.error('Error updating security flag:', error)
      return NextResponse.json({ error: 'Failed to update security flag' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      flag
    })

  } catch (error) {
    console.error('Update security flag error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get security dashboard data
export async function getSecurityDashboard(req: NextRequest) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check permissions
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get dashboard metrics
    const [
      activeFlags,
      recentAnalyses,
      riskMetrics,
      topThreats
    ] = await Promise.all([
      getActiveSecurityFlags(),
      getRecentFraudAnalyses(),
      getRiskMetrics(),
      getTopThreats()
    ])

    return NextResponse.json({
      success: true,
      dashboard: {
        activeFlags,
        recentAnalyses,
        riskMetrics,
        topThreats,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Get security dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Real-time session monitoring
export async function monitorUserSession(req: NextRequest) {
  try {
    const { userId, sessionData } = await req.json()

    if (!userId || !sessionData) {
      return NextResponse.json({ 
        error: 'User ID and session data are required' 
      }, { status: 400 })
    }

    // Monitor session for suspicious activity
    const isSessionValid = await fraudDetection.monitorUserSession(userId, sessionData)

    return NextResponse.json({
      success: true,
      sessionValid: isSessionValid,
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Session monitoring error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
async function getActiveSecurityFlags() {
  const { data: flags } = await supabase
    .from('security_flags')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(100)

  return {
    total: flags?.length || 0,
    critical: flags?.filter(f => f.severity === 'critical').length || 0,
    high: flags?.filter(f => f.severity === 'high').length || 0,
    medium: flags?.filter(f => f.severity === 'medium').length || 0,
    low: flags?.filter(f => f.severity === 'low').length || 0,
    recent: flags?.slice(0, 10) || []
  }
}

async function getRecentFraudAnalyses() {
  const { data: analyses } = await supabase
    .from('fraud_analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return {
    total: analyses?.length || 0,
    blocked: analyses?.filter(a => a.recommendation === 'block').length || 0,
    rejected: analyses?.filter(a => a.recommendation === 'reject').length || 0,
    underReview: analyses?.filter(a => a.recommendation === 'review').length || 0,
    approved: analyses?.filter(a => a.recommendation === 'approve').length || 0,
    averageRiskScore: analyses?.length ? 
      analyses.reduce((sum, a) => sum + a.risk_score, 0) / analyses.length : 0,
    recent: analyses?.slice(0, 10) || []
  }
}

async function getRiskMetrics() {
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [todayData, yesterdayData, weekData] = await Promise.all([
    supabase
      .from('fraud_analyses')
      .select('risk_score, recommendation')
      .gte('created_at', now.toDateString()),
    supabase
      .from('fraud_analyses')
      .select('risk_score, recommendation')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', now.toISOString()),
    supabase
      .from('fraud_analyses')
      .select('risk_score, recommendation')
      .gte('created_at', lastWeek.toISOString())
  ])

  return {
    today: calculateRiskMetrics(todayData.data || []),
    yesterday: calculateRiskMetrics(yesterdayData.data || []),
    week: calculateRiskMetrics(weekData.data || [])
  }
}

async function getTopThreats() {
  const { data: flags } = await supabase
    .from('security_flags')
    .select('flag_type, severity, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const threatCounts = new Map()
  flags?.forEach(flag => {
    const key = `${flag.flag_type}-${flag.severity}`
    threatCounts.set(key, (threatCounts.get(key) || 0) + 1)
  })

  return Array.from(threatCounts.entries())
    .map(([key, count]) => {
      const [type, severity] = key.split('-')
      return { type, severity, count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

function calculateRiskMetrics(data: any[]) {
  if (data.length === 0) {
    return {
      total: 0,
      averageRisk: 0,
      highRisk: 0,
      blocked: 0,
      flagged: 0
    }
  }

  const total = data.length
  const averageRisk = data.reduce((sum, item) => sum + item.risk_score, 0) / total
  const highRisk = data.filter(item => item.risk_score >= 70).length
  const blocked = data.filter(item => item.recommendation === 'block').length
  const flagged = data.filter(item => 
    item.recommendation === 'review' || item.recommendation === 'reject'
  ).length

  return {
    total,
    averageRisk: Math.round(averageRisk),
    highRisk,
    blocked,
    flagged
  }
}

async function sendSecurityNotification(flag: any, targetUserId: string, reporterId: string) {
  try {
    // Send email notification to security team
    await supabase
      .from('notifications')
      .insert({
        type: 'security_alert',
        title: `Security Flag: ${flag.flag_type}`,
        message: `User ${targetUserId} has been flagged for ${flag.flag_type}. Severity: ${flag.severity}`,
        data: {
          flagId: flag.id,
          targetUserId,
          reporterId,
          flagType: flag.flag_type,
          severity: flag.severity
        },
        recipient_role: 'admin',
        created_at: new Date().toISOString()
      })

    // Log security event
    await supabase
      .from('security_events')
      .insert({
        event_type: 'flag_created',
        user_id: targetUserId,
        metadata: {
          flagId: flag.id,
          flagType: flag.flag_type,
          severity: flag.severity,
          reporterId
        },
        created_at: new Date().toISOString()
      })

  } catch (error) {
    console.error('Failed to send security notification:', error)
  }
}