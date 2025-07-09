import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface GDPRConsent {
  id: string
  userId: string
  consentType: 'essential' | 'functional' | 'analytics' | 'marketing' | 'third_party'
  granted: boolean
  timestamp: string
  ipAddress: string
  userAgent: string
  version: string
  source: 'cookie_banner' | 'settings_page' | 'registration' | 'api'
  expiresAt?: string
}

export interface DataProcessingActivity {
  id: string
  name: string
  description: string
  purpose: string
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests'
  dataCategories: string[]
  recipients: string[]
  retentionPeriod: string
  crossBorderTransfer: boolean
  safeguards?: string
  isActive: boolean
}

export interface DataSubjectRequest {
  id: string
  userId: string
  requestType: 'access' | 'rectification' | 'erasure' | 'restriction' | 'portability' | 'objection'
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  description?: string
  requestedData?: string[]
  response?: string
  attachments?: string[]
  submittedAt: string
  processedAt?: string
  processedBy?: string
  dueDate: string
  notes?: string
}

export interface PrivacySettings {
  userId: string
  dataMinimization: boolean
  marketingOptOut: boolean
  profileVisibility: 'public' | 'private' | 'limited'
  searchIndexing: boolean
  dataSharing: boolean
  analyticsOptOut: boolean
  communicationPreferences: {
    email: boolean
    sms: boolean
    push: boolean
    inApp: boolean
  }
  dataRetention: {
    applications: number // days
    messages: number // days
    analytics: number // days
  }
  lastUpdated: string
}

export interface DataRetentionPolicy {
  dataType: string
  category: string
  retentionPeriod: number // days
  description: string
  legalBasis: string
  isActive: boolean
  autoDelete: boolean
  exceptions?: string[]
}

export class GDPRComplianceManager {
  private consentVersions: Map<string, string> = new Map()
  private dataProcessingActivities: Map<string, DataProcessingActivity> = new Map()
  private retentionPolicies: Map<string, DataRetentionPolicy> = new Map()

  constructor() {
    this.initializeConsentVersions()
    this.initializeDataProcessingActivities()
    this.initializeRetentionPolicies()
  }

  private initializeConsentVersions() {
    this.consentVersions.set('essential', '1.0')
    this.consentVersions.set('functional', '1.0')
    this.consentVersions.set('analytics', '1.0')
    this.consentVersions.set('marketing', '1.0')
    this.consentVersions.set('third_party', '1.0')
  }

  private async initializeDataProcessingActivities() {
    const activities: Omit<DataProcessingActivity, 'id'>[] = [
      {
        name: 'User Authentication',
        description: 'Processing user credentials and session management',
        purpose: 'Provide secure access to the platform',
        legalBasis: 'contract',
        dataCategories: ['identity_data', 'contact_data', 'technical_data'],
        recipients: ['internal_systems', 'supabase'],
        retentionPeriod: '2 years after account closure',
        crossBorderTransfer: true,
        safeguards: 'Standard Contractual Clauses with Supabase',
        isActive: true
      },
      {
        name: 'Job Matching and Recommendations',
        description: 'AI-powered job matching and candidate recommendations',
        purpose: 'Improve job discovery and matching accuracy',
        legalBasis: 'legitimate_interests',
        dataCategories: ['profile_data', 'behavioral_data', 'preference_data'],
        recipients: ['internal_systems', 'openai'],
        retentionPeriod: '1 year or until consent withdrawal',
        crossBorderTransfer: true,
        safeguards: 'Data Processing Agreement with OpenAI',
        isActive: true
      },
      {
        name: 'Communication and Messaging',
        description: 'Facilitating communication between users',
        purpose: 'Enable job-related communications',
        legalBasis: 'contract',
        dataCategories: ['message_content', 'contact_data', 'communication_metadata'],
        recipients: ['internal_systems', 'supabase'],
        retentionPeriod: '3 years after last message',
        crossBorderTransfer: true,
        safeguards: 'Standard Contractual Clauses',
        isActive: true
      },
      {
        name: 'Analytics and Performance Monitoring',
        description: 'Platform usage analytics and performance monitoring',
        purpose: 'Improve platform performance and user experience',
        legalBasis: 'legitimate_interests',
        dataCategories: ['usage_data', 'technical_data', 'behavioral_data'],
        recipients: ['internal_systems', 'analytics_providers'],
        retentionPeriod: '2 years',
        crossBorderTransfer: true,
        safeguards: 'Privacy-compliant analytics configuration',
        isActive: true
      },
      {
        name: 'Marketing and Communications',
        description: 'Promotional communications and marketing campaigns',
        purpose: 'Inform users about relevant opportunities and updates',
        legalBasis: 'consent',
        dataCategories: ['contact_data', 'preference_data', 'behavioral_data'],
        recipients: ['internal_systems', 'email_service_providers'],
        retentionPeriod: 'Until consent withdrawal or 3 years of inactivity',
        crossBorderTransfer: true,
        safeguards: 'GDPR-compliant email service providers',
        isActive: true
      },
      {
        name: 'Payment Processing',
        description: 'Processing subscription payments and billing',
        purpose: 'Handle subscription payments and financial transactions',
        legalBasis: 'contract',
        dataCategories: ['financial_data', 'identity_data', 'contact_data'],
        recipients: ['stripe', 'internal_systems'],
        retentionPeriod: '7 years (legal requirement)',
        crossBorderTransfer: true,
        safeguards: 'PCI DSS compliance and Data Processing Agreement with Stripe',
        isActive: true
      }
    ]

    for (const activity of activities) {
      const id = this.generateId()
      this.dataProcessingActivities.set(id, { ...activity, id })
    }
  }

  private initializeRetentionPolicies() {
    const policies: Omit<DataRetentionPolicy, 'id'>[] = [
      {
        dataType: 'user_profiles',
        category: 'Identity Data',
        retentionPeriod: 730, // 2 years
        description: 'User profile information including name, email, and basic details',
        legalBasis: 'Contract performance and legitimate interests',
        isActive: true,
        autoDelete: true,
        exceptions: ['legal_holds', 'ongoing_disputes']
      },
      {
        dataType: 'job_applications',
        category: 'Application Data',
        retentionPeriod: 1095, // 3 years
        description: 'Job application records and candidate submissions',
        legalBasis: 'Contract performance and legitimate interests',
        isActive: true,
        autoDelete: true,
        exceptions: ['successful_hires', 'legal_requirements']
      },
      {
        dataType: 'messages',
        category: 'Communication Data',
        retentionPeriod: 1095, // 3 years
        description: 'Messages between candidates and recruiters',
        legalBasis: 'Contract performance',
        isActive: true,
        autoDelete: true
      },
      {
        dataType: 'analytics_data',
        category: 'Behavioral Data',
        retentionPeriod: 730, // 2 years
        description: 'User behavior and platform usage analytics',
        legalBasis: 'Legitimate interests',
        isActive: true,
        autoDelete: true
      },
      {
        dataType: 'payment_data',
        category: 'Financial Data',
        retentionPeriod: 2555, // 7 years
        description: 'Payment and billing information',
        legalBasis: 'Legal obligation',
        isActive: true,
        autoDelete: false,
        exceptions: ['never_delete_payment_records']
      },
      {
        dataType: 'consent_records',
        category: 'Consent Data',
        retentionPeriod: 1825, // 5 years
        description: 'Records of user consent and preferences',
        legalBasis: 'Legal obligation',
        isActive: true,
        autoDelete: false
      },
      {
        dataType: 'security_logs',
        category: 'Security Data',
        retentionPeriod: 365, // 1 year
        description: 'Security logs and audit trails',
        legalBasis: 'Legitimate interests and legal obligation',
        isActive: true,
        autoDelete: true
      }
    ]

    for (const policy of policies) {
      this.retentionPolicies.set(policy.dataType, policy)
    }
  }

  // Consent Management
  async recordConsent(
    userId: string,
    consentType: GDPRConsent['consentType'],
    granted: boolean,
    source: GDPRConsent['source'],
    ipAddress: string,
    userAgent: string
  ): Promise<string> {
    const consent: Omit<GDPRConsent, 'id'> = {
      userId,
      consentType,
      granted,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent,
      version: this.consentVersions.get(consentType) || '1.0',
      source,
      expiresAt: consentType === 'marketing' ? 
        new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString() : // 2 years for marketing
        undefined
    }

    try {
      const { data, error } = await supabase
        .from('gdpr_consents')
        .insert({
          user_id: consent.userId,
          consent_type: consent.consentType,
          granted: consent.granted,
          timestamp: consent.timestamp,
          ip_address: consent.ipAddress,
          user_agent: consent.userAgent,
          version: consent.version,
          source: consent.source,
          expires_at: consent.expiresAt
        })
        .select()
        .single()

      if (error) throw error

      // Update user's privacy settings based on consent
      await this.updatePrivacySettingsFromConsent(userId, consentType, granted)

      return data.id
    } catch (error) {
      console.error('Failed to record consent:', error)
      throw error
    }
  }

  async getUserConsents(userId: string): Promise<GDPRConsent[]> {
    try {
      const { data, error } = await supabase
        .from('gdpr_consents')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })

      if (error) throw error

      return data.map(row => ({
        id: row.id,
        userId: row.user_id,
        consentType: row.consent_type,
        granted: row.granted,
        timestamp: row.timestamp,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        version: row.version,
        source: row.source,
        expiresAt: row.expires_at
      }))
    } catch (error) {
      console.error('Failed to get user consents:', error)
      throw error
    }
  }

  async getLatestConsents(userId: string): Promise<Map<string, boolean>> {
    const consents = await this.getUserConsents(userId)
    const latest = new Map<string, boolean>()

    // Get the latest consent for each type
    for (const consent of consents) {
      if (!latest.has(consent.consentType)) {
        // Check if consent is still valid (not expired)
        const isValid = !consent.expiresAt || new Date(consent.expiresAt) > new Date()
        latest.set(consent.consentType, consent.granted && isValid)
      }
    }

    return latest
  }

  // Data Subject Requests
  async submitDataSubjectRequest(
    userId: string,
    requestType: DataSubjectRequest['requestType'],
    description?: string,
    requestedData?: string[]
  ): Promise<string> {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30) // 30 days to respond

    const request: Omit<DataSubjectRequest, 'id'> = {
      userId,
      requestType,
      status: 'pending',
      description,
      requestedData,
      submittedAt: new Date().toISOString(),
      dueDate: dueDate.toISOString()
    }

    try {
      const { data, error } = await supabase
        .from('data_subject_requests')
        .insert({
          user_id: request.userId,
          request_type: request.requestType,
          status: request.status,
          description: request.description,
          requested_data: request.requestedData,
          submitted_at: request.submittedAt,
          due_date: request.dueDate
        })
        .select()
        .single()

      if (error) throw error

      // Send notification to privacy team
      await this.notifyPrivacyTeam(data.id, request)

      return data.id
    } catch (error) {
      console.error('Failed to submit data subject request:', error)
      throw error
    }
  }

  async processDataSubjectRequest(
    requestId: string,
    processedBy: string,
    response?: string,
    attachments?: string[]
  ): Promise<void> {
    try {
      await supabase
        .from('data_subject_requests')
        .update({
          status: 'completed',
          response,
          attachments,
          processed_at: new Date().toISOString(),
          processed_by: processedBy
        })
        .eq('id', requestId)

      // Notify user that their request has been processed
      const { data: request } = await supabase
        .from('data_subject_requests')
        .select('user_id, request_type')
        .eq('id', requestId)
        .single()

      if (request) {
        await this.notifyUserRequestProcessed(request.user_id, request.request_type)
      }
    } catch (error) {
      console.error('Failed to process data subject request:', error)
      throw error
    }
  }

  async exportUserData(userId: string): Promise<any> {
    try {
      // Gather all user data from various tables
      const [
        profile,
        applications,
        messages,
        consents,
        privacy_settings,
        payment_data
      ] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', userId),
        supabase.from('applications').select('*').eq('candidate_id', userId),
        supabase.from('messages').select('*').or(`sender_id.eq.${userId},recipient_id.eq.${userId}`),
        supabase.from('gdpr_consents').select('*').eq('user_id', userId),
        supabase.from('privacy_settings').select('*').eq('user_id', userId),
        supabase.from('subscriptions').select('*').eq('user_id', userId)
      ])

      const exportData = {
        profile: profile.data,
        applications: applications.data,
        messages: messages.data?.map(msg => ({
          ...msg,
          // Redact content if user is not the sender
          content: msg.sender_id === userId ? msg.content : '[REDACTED]'
        })),
        consents: consents.data,
        privacy_settings: privacy_settings.data,
        payment_data: payment_data.data,
        export_date: new Date().toISOString(),
        format_version: '1.0'
      }

      return exportData
    } catch (error) {
      console.error('Failed to export user data:', error)
      throw error
    }
  }

  async deleteUserData(userId: string, retainLegallyRequired: boolean = true): Promise<void> {
    try {
      // Start transaction-like deletions
      const deletions = []

      if (!retainLegallyRequired) {
        // Delete everything
        deletions.push(
          supabase.from('user_profiles').delete().eq('id', userId),
          supabase.from('applications').delete().eq('candidate_id', userId),
          supabase.from('messages').delete().or(`sender_id.eq.${userId},recipient_id.eq.${userId}`),
          supabase.from('privacy_settings').delete().eq('user_id', userId)
        )
      } else {
        // Anonymize rather than delete legally required data
        const anonymizedData = {
          first_name: '[DELETED]',
          last_name: '[DELETED]',
          email: `deleted_${userId}@anonymized.local`,
          bio: null,
          avatar_url: null,
          deleted_at: new Date().toISOString()
        }

        deletions.push(
          supabase.from('user_profiles').update(anonymizedData).eq('id', userId),
          supabase.from('applications').update({ 
            cover_letter: '[DELETED]',
            deleted_at: new Date().toISOString()
          }).eq('candidate_id', userId),
          supabase.from('messages').update({ 
            content: '[DELETED]',
            deleted_at: new Date().toISOString()
          }).or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        )
      }

      await Promise.all(deletions)

      // Record the deletion
      await supabase
        .from('data_deletions')
        .insert({
          user_id: userId,
          deletion_type: retainLegallyRequired ? 'anonymization' : 'complete',
          deleted_at: new Date().toISOString(),
          reason: 'data_subject_request'
        })

    } catch (error) {
      console.error('Failed to delete user data:', error)
      throw error
    }
  }

  // Privacy Settings Management
  async updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<void> {
    try {
      const { error } = await supabase
        .from('privacy_settings')
        .upsert({
          user_id: userId,
          ...settings,
          last_updated: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Failed to update privacy settings:', error)
      throw error
    }
  }

  async getPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned

      return data ? {
        userId: data.user_id,
        dataMinimization: data.data_minimization,
        marketingOptOut: data.marketing_opt_out,
        profileVisibility: data.profile_visibility,
        searchIndexing: data.search_indexing,
        dataSharing: data.data_sharing,
        analyticsOptOut: data.analytics_opt_out,
        communicationPreferences: data.communication_preferences,
        dataRetention: data.data_retention,
        lastUpdated: data.last_updated
      } : null
    } catch (error) {
      console.error('Failed to get privacy settings:', error)
      throw error
    }
  }

  // Data Retention and Cleanup
  async runDataRetentionCleanup(): Promise<void> {
    try {
      for (const [dataType, policy] of this.retentionPolicies) {
        if (!policy.isActive || !policy.autoDelete) continue

        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - policy.retentionPeriod)

        switch (dataType) {
          case 'analytics_data':
            await supabase
              .from('user_activities')
              .delete()
              .lt('created_at', cutoffDate.toISOString())
            break

          case 'security_logs':
            await supabase
              .from('security_events')
              .delete()
              .lt('created_at', cutoffDate.toISOString())
            break

          case 'messages':
            // Only delete messages for inactive users
            await supabase
              .from('messages')
              .delete()
              .lt('created_at', cutoffDate.toISOString())
              .in('sender_id', 
                supabase
                  .from('user_profiles')
                  .select('id')
                  .lt('last_active', cutoffDate.toISOString())
              )
            break
        }
      }

      // Log cleanup activity
      await supabase
        .from('data_retention_logs')
        .insert({
          cleanup_date: new Date().toISOString(),
          policies_applied: Array.from(this.retentionPolicies.keys()).filter(
            key => this.retentionPolicies.get(key)?.autoDelete
          )
        })

    } catch (error) {
      console.error('Failed to run data retention cleanup:', error)
      throw error
    }
  }

  // Cookie and Tracking Management
  async getCookieConsent(userId: string): Promise<Map<string, boolean>> {
    const consents = await this.getLatestConsents(userId)
    
    return new Map([
      ['essential', true], // Always true
      ['functional', consents.get('functional') || false],
      ['analytics', consents.get('analytics') || false],
      ['marketing', consents.get('marketing') || false],
      ['third_party', consents.get('third_party') || false]
    ])
  }

  async updateCookieConsent(
    userId: string,
    consentMap: Map<string, boolean>,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    for (const [consentType, granted] of consentMap) {
      if (consentType !== 'essential') { // Skip essential as it's always granted
        await this.recordConsent(
          userId,
          consentType as GDPRConsent['consentType'],
          granted,
          'cookie_banner',
          ipAddress,
          userAgent
        )
      }
    }
  }

  // Compliance Reporting
  async generateComplianceReport(): Promise<any> {
    try {
      const [
        totalUsers,
        activeConsents,
        pendingRequests,
        dataRetentionStats,
        recentDeletions
      ] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact' }),
        supabase.from('gdpr_consents').select('consent_type, granted', { count: 'exact' }),
        supabase.from('data_subject_requests').select('request_type', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('data_retention_logs').select('*').order('cleanup_date', { ascending: false }).limit(10),
        supabase.from('data_deletions').select('*').gte('deleted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ])

      return {
        summary: {
          total_users: totalUsers.count,
          active_consents: activeConsents.count,
          pending_requests: pendingRequests.count,
          recent_deletions: recentDeletions.data?.length || 0
        },
        consent_breakdown: this.analyzeConsentData(activeConsents.data || []),
        data_processing_activities: Array.from(this.dataProcessingActivities.values()),
        retention_policies: Array.from(this.retentionPolicies.values()),
        recent_cleanup_activities: dataRetentionStats.data,
        recent_deletions: recentDeletions.data,
        report_generated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to generate compliance report:', error)
      throw error
    }
  }

  // Helper methods
  private async updatePrivacySettingsFromConsent(
    userId: string,
    consentType: GDPRConsent['consentType'],
    granted: boolean
  ): Promise<void> {
    const updates: Partial<PrivacySettings> = {}

    switch (consentType) {
      case 'marketing':
        updates.marketingOptOut = !granted
        break
      case 'analytics':
        updates.analyticsOptOut = !granted
        break
      case 'third_party':
        updates.dataSharing = granted
        break
    }

    if (Object.keys(updates).length > 0) {
      await this.updatePrivacySettings(userId, updates)
    }
  }

  private async notifyPrivacyTeam(requestId: string, request: Omit<DataSubjectRequest, 'id'>): Promise<void> {
    await supabase
      .from('notifications')
      .insert({
        type: 'privacy_request',
        title: `New ${request.requestType} request`,
        message: `User has submitted a ${request.requestType} request. Due date: ${request.dueDate}`,
        data: { requestId, requestType: request.requestType },
        recipient_role: 'admin',
        created_at: new Date().toISOString()
      })
  }

  private async notifyUserRequestProcessed(userId: string, requestType: string): Promise<void> {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'privacy_request_processed',
        title: 'Privacy request processed',
        message: `Your ${requestType} request has been processed.`,
        created_at: new Date().toISOString()
      })
  }

  private analyzeConsentData(consents: any[]): any {
    const breakdown = {
      essential: { granted: 0, denied: 0 },
      functional: { granted: 0, denied: 0 },
      analytics: { granted: 0, denied: 0 },
      marketing: { granted: 0, denied: 0 },
      third_party: { granted: 0, denied: 0 }
    }

    consents.forEach(consent => {
      const type = consent.consent_type
      if (breakdown[type]) {
        if (consent.granted) {
          breakdown[type].granted++
        } else {
          breakdown[type].denied++
        }
      }
    })

    return breakdown
  }

  private generateId(): string {
    return 'gdpr_' + Math.random().toString(36).substring(2, 15)
  }
}

export const gdprManager = new GDPRComplianceManager()