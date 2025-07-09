import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface FraudAnalysisResult {
  riskScore: number // 0-100, higher = more risk
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  fraudIndicators: FraudIndicator[]
  recommendation: 'approve' | 'review' | 'reject' | 'block'
  confidence: number // 0-1
  analysis: {
    profileAnalysis: ProfileRiskAnalysis
    applicationAnalysis: ApplicationRiskAnalysis
    behaviorAnalysis: BehaviorRiskAnalysis
    networkAnalysis: NetworkRiskAnalysis
  }
}

export interface FraudIndicator {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  evidence: any
  weight: number
}

export interface ProfileRiskAnalysis {
  profileCompleteness: number
  inconsistencies: string[]
  suspiciousPatterns: string[]
  verificationStatus: {
    email: boolean
    phone: boolean
    linkedin: boolean
    github: boolean
  }
}

export interface ApplicationRiskAnalysis {
  applicationVolume: number
  applicationPattern: string
  responseQuality: number
  timePatterns: string[]
}

export interface BehaviorRiskAnalysis {
  sessionData: {
    duration: number
    pageViews: number
    clickPatterns: string[]
  }
  deviceFingerprint: {
    browserInfo: string
    screenResolution: string
    timezone: string
    language: string
  }
  locationAnalysis: {
    ipAddress: string
    country: string
    vpnDetected: boolean
    proxyDetected: boolean
  }
}

export interface NetworkRiskAnalysis {
  duplicateProfiles: number
  sharedDevices: number
  suspiciousConnections: number
  botDetection: {
    probability: number
    indicators: string[]
  }
}

export class FraudDetectionEngine {
  private riskRules: Map<string, (data: any) => number> = new Map()
  private blacklistedEmails: Set<string> = new Set()
  private blacklistedIPs: Set<string> = new Set()
  private suspiciousPatterns: RegExp[] = []

  constructor() {
    this.initializeRiskRules()
    this.loadBlacklists()
  }

  private initializeRiskRules() {
    // Email-based risk rules
    this.riskRules.set('disposable_email', (email: string) => {
      const disposableProviders = [
        '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
        'mailinator.com', 'throwaway.email', 'temp-mail.org'
      ]
      return disposableProviders.some(provider => email.includes(provider)) ? 40 : 0
    })

    // Profile completeness risk
    this.riskRules.set('incomplete_profile', (profile: any) => {
      const requiredFields = ['first_name', 'last_name', 'email', 'bio']
      const missingFields = requiredFields.filter(field => !profile[field])
      return missingFields.length * 10
    })

    // Application volume risk
    this.riskRules.set('high_application_volume', (applicationCount: number) => {
      if (applicationCount > 50) return 60
      if (applicationCount > 20) return 30
      if (applicationCount > 10) return 15
      return 0
    })

    // Time-based patterns
    this.riskRules.set('suspicious_timing', (timestamps: number[]) => {
      if (timestamps.length < 2) return 0
      
      const intervals = []
      for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1])
      }
      
      // Check for bot-like regular intervals
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length
      
      // Low variance indicates bot-like behavior
      return variance < 1000 ? 30 : 0
    })

    // Device fingerprinting
    this.riskRules.set('device_fingerprint', (fingerprint: any) => {
      let risk = 0
      
      // Check for headless browsers
      if (fingerprint.userAgent?.includes('HeadlessChrome')) risk += 50
      if (fingerprint.webdriver) risk += 40
      
      // Check for suspicious screen resolutions
      const commonResolutions = ['1920x1080', '1366x768', '1440x900', '1536x864']
      if (!commonResolutions.includes(fingerprint.screenResolution)) risk += 10
      
      return Math.min(risk, 60)
    })

    // Geographic risk
    this.riskRules.set('geographic_risk', (locationData: any) => {
      let risk = 0
      
      if (locationData.vpnDetected) risk += 25
      if (locationData.proxyDetected) risk += 35
      if (locationData.tor) risk += 50
      
      // High-risk countries (based on fraud statistics)
      const highRiskCountries = ['XX', 'YY'] // Placeholder for actual risk countries
      if (highRiskCountries.includes(locationData.country)) risk += 20
      
      return Math.min(risk, 70)
    })
  }

  private async loadBlacklists() {
    try {
      // Load from database or external service
      const { data: blacklists } = await supabase
        .from('security_blacklists')
        .select('*')
        .eq('is_active', true)

      blacklists?.forEach(item => {
        if (item.type === 'email') {
          this.blacklistedEmails.add(item.value)
        } else if (item.type === 'ip') {
          this.blacklistedIPs.add(item.value)
        }
      })
    } catch (error) {
      console.error('Failed to load blacklists:', error)
    }
  }

  async analyzeUser(userId: string, context?: any): Promise<FraudAnalysisResult> {
    try {
      // Gather user data
      const userData = await this.gatherUserData(userId)
      const behaviorData = await this.analyzeBehavior(userId, context)
      const networkData = await this.analyzeNetwork(userId)

      // Analyze profile
      const profileAnalysis = this.analyzeProfile(userData.profile)
      
      // Analyze applications
      const applicationAnalysis = this.analyzeApplications(userData.applications)
      
      // Analyze behavior
      const behaviorAnalysis = this.analyzeBehaviorPatterns(behaviorData)
      
      // Analyze network
      const networkAnalysis = this.analyzeNetworkPatterns(networkData)

      // Calculate overall risk score
      const riskScore = this.calculateRiskScore({
        profileAnalysis,
        applicationAnalysis,
        behaviorAnalysis,
        networkAnalysis
      })

      // Generate fraud indicators
      const fraudIndicators = this.generateFraudIndicators({
        profileAnalysis,
        applicationAnalysis,
        behaviorAnalysis,
        networkAnalysis
      })

      // Determine risk level and recommendation
      const riskLevel = this.determineRiskLevel(riskScore)
      const recommendation = this.generateRecommendation(riskScore, fraudIndicators)

      const result: FraudAnalysisResult = {
        riskScore,
        riskLevel,
        fraudIndicators,
        recommendation,
        confidence: this.calculateConfidence(fraudIndicators),
        analysis: {
          profileAnalysis,
          applicationAnalysis,
          behaviorAnalysis,
          networkAnalysis
        }
      }

      // Store analysis result
      await this.storeFraudAnalysis(userId, result)

      return result

    } catch (error) {
      console.error('Fraud analysis failed:', error)
      throw error
    }
  }

  private async gatherUserData(userId: string) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    const { data: applications } = await supabase
      .from('applications')
      .select('*')
      .eq('candidate_id', userId)

    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)

    return { profile, applications, sessions }
  }

  private async analyzeBehavior(userId: string, context: any) {
    // Analyze user behavior patterns
    const { data: activities } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1000)

    return {
      activities: activities || [],
      context: context || {},
      deviceFingerprint: context?.deviceFingerprint || {}
    }
  }

  private async analyzeNetwork(userId: string) {
    // Check for duplicate profiles, shared devices, etc.
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email, created_at')
      .eq('id', userId)
      .single()

    if (!profile) return { duplicateProfiles: 0, sharedDevices: 0, suspiciousConnections: 0 }

    // Check for similar emails
    const emailDomain = profile.email.split('@')[1]
    const { data: similarEmails } = await supabase
      .from('user_profiles')
      .select('id')
      .like('email', `%@${emailDomain}`)
      .neq('id', userId)

    // Check for accounts created around the same time
    const timeWindow = 24 * 60 * 60 * 1000 // 24 hours
    const createdAt = new Date(profile.created_at).getTime()
    const { data: recentAccounts } = await supabase
      .from('user_profiles')
      .select('id')
      .gte('created_at', new Date(createdAt - timeWindow).toISOString())
      .lte('created_at', new Date(createdAt + timeWindow).toISOString())
      .neq('id', userId)

    return {
      duplicateProfiles: similarEmails?.length || 0,
      sharedDevices: 0, // Would require device fingerprinting
      suspiciousConnections: recentAccounts?.length || 0
    }
  }

  private analyzeProfile(profile: any): ProfileRiskAnalysis {
    if (!profile) {
      return {
        profileCompleteness: 0,
        inconsistencies: ['Profile not found'],
        suspiciousPatterns: [],
        verificationStatus: {
          email: false,
          phone: false,
          linkedin: false,
          github: false
        }
      }
    }

    const requiredFields = ['first_name', 'last_name', 'email', 'bio']
    const filledFields = requiredFields.filter(field => profile[field])
    const completeness = (filledFields.length / requiredFields.length) * 100

    const inconsistencies = []
    const suspiciousPatterns = []

    // Check for inconsistencies
    if (profile.first_name === profile.last_name) {
      inconsistencies.push('First and last name are identical')
    }

    // Check for suspicious patterns
    if (profile.bio && profile.bio.length < 10) {
      suspiciousPatterns.push('Very short bio')
    }

    if (this.blacklistedEmails.has(profile.email)) {
      suspiciousPatterns.push('Email on blacklist')
    }

    // Check email for disposable providers
    const disposableRisk = this.riskRules.get('disposable_email')?.(profile.email) || 0
    if (disposableRisk > 0) {
      suspiciousPatterns.push('Disposable email provider')
    }

    return {
      profileCompleteness: completeness,
      inconsistencies,
      suspiciousPatterns,
      verificationStatus: {
        email: profile.email_verified || false,
        phone: profile.phone_verified || false,
        linkedin: profile.linkedin_url ? true : false,
        github: profile.github_url ? true : false
      }
    }
  }

  private analyzeApplications(applications: any[]): ApplicationRiskAnalysis {
    if (!applications || applications.length === 0) {
      return {
        applicationVolume: 0,
        applicationPattern: 'none',
        responseQuality: 0,
        timePatterns: []
      }
    }

    const timestamps = applications.map(app => new Date(app.applied_at).getTime())
    const timePatterns = []

    // Check for rapid-fire applications
    let rapidApplications = 0
    for (let i = 1; i < timestamps.length; i++) {
      const timeDiff = timestamps[i] - timestamps[i - 1]
      if (timeDiff < 60000) { // Less than 1 minute
        rapidApplications++
      }
    }

    if (rapidApplications > 5) {
      timePatterns.push('Rapid-fire applications detected')
    }

    // Analyze application quality
    const coverLetters = applications.filter(app => app.cover_letter && app.cover_letter.length > 50)
    const responseQuality = coverLetters.length / applications.length * 100

    return {
      applicationVolume: applications.length,
      applicationPattern: this.determineApplicationPattern(applications),
      responseQuality,
      timePatterns
    }
  }

  private analyzeBehaviorPatterns(behaviorData: any): BehaviorRiskAnalysis {
    const activities = behaviorData.activities || []
    const context = behaviorData.context || {}
    const fingerprint = behaviorData.deviceFingerprint || {}

    // Analyze session data
    const sessionDuration = activities.length > 0 ? 
      (new Date(activities[0].created_at).getTime() - new Date(activities[activities.length - 1].created_at).getTime()) / 1000 : 0

    const pageViews = activities.filter(activity => activity.action === 'page_view').length
    
    const clickPatterns = []
    const clicks = activities.filter(activity => activity.action === 'click')
    if (clicks.length > 100) {
      clickPatterns.push('High click volume')
    }

    // Analyze device fingerprint
    const deviceRisk = this.riskRules.get('device_fingerprint')?.(fingerprint) || 0
    if (deviceRisk > 30) {
      clickPatterns.push('Suspicious device fingerprint')
    }

    return {
      sessionData: {
        duration: sessionDuration,
        pageViews,
        clickPatterns
      },
      deviceFingerprint: {
        browserInfo: fingerprint.userAgent || 'Unknown',
        screenResolution: fingerprint.screenResolution || 'Unknown',
        timezone: fingerprint.timezone || 'Unknown',
        language: fingerprint.language || 'Unknown'
      },
      locationAnalysis: {
        ipAddress: context.ipAddress || 'Unknown',
        country: context.country || 'Unknown',
        vpnDetected: context.vpnDetected || false,
        proxyDetected: context.proxyDetected || false
      }
    }
  }

  private analyzeNetworkPatterns(networkData: any): NetworkRiskAnalysis {
    const botProbability = this.calculateBotProbability(networkData)
    const botIndicators = []

    if (networkData.duplicateProfiles > 5) {
      botIndicators.push('Multiple similar profiles detected')
    }

    if (networkData.suspiciousConnections > 10) {
      botIndicators.push('High number of accounts created in short timeframe')
    }

    return {
      duplicateProfiles: networkData.duplicateProfiles,
      sharedDevices: networkData.sharedDevices,
      suspiciousConnections: networkData.suspiciousConnections,
      botDetection: {
        probability: botProbability,
        indicators: botIndicators
      }
    }
  }

  private calculateRiskScore(analysis: any): number {
    let riskScore = 0

    // Profile risk (30% weight)
    const profileRisk = (100 - analysis.profileAnalysis.profileCompleteness) * 0.3
    riskScore += profileRisk

    // Application risk (25% weight)
    const applicationRisk = Math.min(analysis.applicationAnalysis.applicationVolume * 2, 100) * 0.25
    riskScore += applicationRisk

    // Behavior risk (25% weight)
    const behaviorRisk = analysis.behaviorAnalysis.locationAnalysis.vpnDetected ? 50 : 0
    riskScore += behaviorRisk * 0.25

    // Network risk (20% weight)
    const networkRisk = Math.min(analysis.networkAnalysis.duplicateProfiles * 10, 100) * 0.2
    riskScore += networkRisk

    return Math.min(Math.round(riskScore), 100)
  }

  private generateFraudIndicators(analysis: any): FraudIndicator[] {
    const indicators: FraudIndicator[] = []

    // Profile indicators
    if (analysis.profileAnalysis.profileCompleteness < 50) {
      indicators.push({
        type: 'incomplete_profile',
        severity: 'medium',
        description: 'Profile is less than 50% complete',
        evidence: { completeness: analysis.profileAnalysis.profileCompleteness },
        weight: 0.3
      })
    }

    // Application indicators
    if (analysis.applicationAnalysis.applicationVolume > 20) {
      indicators.push({
        type: 'high_application_volume',
        severity: 'high',
        description: 'Unusually high number of job applications',
        evidence: { count: analysis.applicationAnalysis.applicationVolume },
        weight: 0.4
      })
    }

    // Behavior indicators
    if (analysis.behaviorAnalysis.locationAnalysis.vpnDetected) {
      indicators.push({
        type: 'vpn_usage',
        severity: 'medium',
        description: 'VPN or proxy usage detected',
        evidence: analysis.behaviorAnalysis.locationAnalysis,
        weight: 0.3
      })
    }

    // Network indicators
    if (analysis.networkAnalysis.botDetection.probability > 0.7) {
      indicators.push({
        type: 'bot_behavior',
        severity: 'critical',
        description: 'Automated behavior patterns detected',
        evidence: analysis.networkAnalysis.botDetection,
        weight: 0.6
      })
    }

    return indicators
  }

  private determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 80) return 'critical'
    if (riskScore >= 60) return 'high'
    if (riskScore >= 30) return 'medium'
    return 'low'
  }

  private generateRecommendation(riskScore: number, indicators: FraudIndicator[]): 'approve' | 'review' | 'reject' | 'block' {
    const criticalIndicators = indicators.filter(i => i.severity === 'critical')
    
    if (criticalIndicators.length > 0 || riskScore >= 90) return 'block'
    if (riskScore >= 70) return 'reject'
    if (riskScore >= 40) return 'review'
    return 'approve'
  }

  private calculateConfidence(indicators: FraudIndicator[]): number {
    if (indicators.length === 0) return 0.5
    
    const totalWeight = indicators.reduce((sum, indicator) => sum + indicator.weight, 0)
    const weightedConfidence = totalWeight / indicators.length
    
    return Math.min(weightedConfidence, 1)
  }

  private determineApplicationPattern(applications: any[]): string {
    if (applications.length === 0) return 'none'
    if (applications.length > 50) return 'mass_application'
    if (applications.length > 20) return 'high_volume'
    if (applications.length > 10) return 'active'
    return 'normal'
  }

  private calculateBotProbability(networkData: any): number {
    let probability = 0
    
    if (networkData.duplicateProfiles > 10) probability += 0.4
    if (networkData.suspiciousConnections > 20) probability += 0.3
    if (networkData.sharedDevices > 5) probability += 0.3
    
    return Math.min(probability, 1)
  }

  private async storeFraudAnalysis(userId: string, result: FraudAnalysisResult) {
    try {
      await supabase
        .from('fraud_analyses')
        .insert({
          user_id: userId,
          risk_score: result.riskScore,
          risk_level: result.riskLevel,
          recommendation: result.recommendation,
          confidence: result.confidence,
          fraud_indicators: result.fraudIndicators,
          analysis_data: result.analysis,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Failed to store fraud analysis:', error)
    }
  }

  // Real-time monitoring
  async monitorUserSession(userId: string, sessionData: any): Promise<boolean> {
    const indicators = []
    
    // Check for suspicious rapid actions
    if (sessionData.actionsPerMinute > 100) {
      indicators.push('Rapid action rate')
    }
    
    // Check for bot-like patterns
    if (sessionData.mouseMovements && sessionData.mouseMovements.length === 0) {
      indicators.push('No mouse movements detected')
    }
    
    // If suspicious activity detected, flag for review
    if (indicators.length > 2) {
      await this.flagUser(userId, 'suspicious_session', indicators)
      return false
    }
    
    return true
  }

  private async flagUser(userId: string, reason: string, evidence: any[]) {
    await supabase
      .from('security_flags')
      .insert({
        user_id: userId,
        flag_type: reason,
        evidence,
        status: 'active',
        created_at: new Date().toISOString()
      })
  }
}

export const fraudDetection = new FraudDetectionEngine()