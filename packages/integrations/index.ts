export * from './linkedin'
export * from './github'
export * from './ats'

// Integration types
export type IntegrationType = 'linkedin' | 'github' | 'ats'

export interface IntegrationStatus {
  type: IntegrationType
  connected: boolean
  last_sync?: string
  sync_status?: 'pending' | 'syncing' | 'completed' | 'failed'
  error_message?: string
}

export interface UserIntegration {
  id: string
  user_id: string
  integration_type: IntegrationType
  integration_data: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

// Integration utilities
export class IntegrationUtils {
  // Get all integrations for a user
  static async getUserIntegrations(userId: string): Promise<UserIntegration[]> {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) {
      console.error('Failed to fetch user integrations:', error)
      return []
    }

    return data || []
  }

  // Get integration status for a user
  static async getIntegrationStatus(userId: string): Promise<IntegrationStatus[]> {
    const integrations = await this.getUserIntegrations(userId)
    
    const statusMap: Record<IntegrationType, IntegrationStatus> = {
      linkedin: { type: 'linkedin', connected: false },
      github: { type: 'github', connected: false },
      ats: { type: 'ats', connected: false }
    }

    for (const integration of integrations) {
      const type = integration.integration_type
      statusMap[type] = {
        type,
        connected: true,
        last_sync: integration.integration_data.last_sync,
        sync_status: integration.integration_data.sync_status || 'completed'
      }
    }

    return Object.values(statusMap)
  }

  // Disconnect integration
  static async disconnectIntegration(userId: string, integrationType: IntegrationType): Promise<void> {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('user_integrations')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('integration_type', integrationType)

    if (error) {
      console.error('Failed to disconnect integration:', error)
      throw error
    }
  }

  // Sync integration data
  static async syncIntegration(userId: string, integrationType: IntegrationType): Promise<void> {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Update sync status to syncing
    await supabase
      .from('user_integrations')
      .update({
        integration_data: {
          sync_status: 'syncing',
          last_sync_attempt: new Date().toISOString()
        }
      })
      .eq('user_id', userId)
      .eq('integration_type', integrationType)

    try {
      // Get integration data
      const { data: integration } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('integration_type', integrationType)
        .single()

      if (!integration) {
        throw new Error('Integration not found')
      }

      // Sync based on type
      switch (integrationType) {
        case 'linkedin':
          const { linkedInIntegration } = await import('./linkedin')
          await linkedInIntegration.syncProfile(userId, integration.integration_data.access_token)
          break
        case 'github':
          const { gitHubIntegration } = await import('./github')
          await gitHubIntegration.syncProfile(userId, integration.integration_data.access_token)
          break
        case 'ats':
          // ATS sync would be handled differently as it's company-based
          break
      }

      // Update sync status to completed
      await supabase
        .from('user_integrations')
        .update({
          integration_data: {
            ...integration.integration_data,
            sync_status: 'completed',
            last_sync: new Date().toISOString()
          }
        })
        .eq('user_id', userId)
        .eq('integration_type', integrationType)

    } catch (error) {
      // Update sync status to failed
      await supabase
        .from('user_integrations')
        .update({
          integration_data: {
            sync_status: 'failed',
            last_sync_attempt: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : 'Unknown error'
          }
        })
        .eq('user_id', userId)
        .eq('integration_type', integrationType)

      throw error
    }
  }

  // Get OAuth URL for integration
  static async getOAuthUrl(integrationType: IntegrationType, userId: string): Promise<string> {
    const state = Buffer.from(JSON.stringify({ userId, integrationType })).toString('base64')

    switch (integrationType) {
      case 'linkedin':
        const { linkedInIntegration } = await import('./linkedin')
        return linkedInIntegration.generateAuthUrl(state)
      case 'github':
        const { gitHubIntegration } = await import('./github')
        return gitHubIntegration.generateAuthUrl(state)
      default:
        throw new Error(`OAuth not supported for ${integrationType}`)
    }
  }

  // Handle OAuth callback
  static async handleOAuthCallback(
    integrationType: IntegrationType,
    code: string,
    state: string
  ): Promise<void> {
    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString())

    try {
      switch (integrationType) {
        case 'linkedin':
          const { linkedInIntegration } = await import('./linkedin')
          const linkedInToken = await linkedInIntegration.exchangeCodeForToken(code)
          await linkedInIntegration.importProfile(userId, linkedInToken)
          break
        case 'github':
          const { gitHubIntegration } = await import('./github')
          const gitHubToken = await gitHubIntegration.exchangeCodeForToken(code)
          await gitHubIntegration.importProfile(userId, gitHubToken)
          break
        default:
          throw new Error(`OAuth callback not supported for ${integrationType}`)
      }
    } catch (error) {
      console.error(`OAuth callback failed for ${integrationType}:`, error)
      throw error
    }
  }

  // Validate integration permissions
  static async validateIntegrationPermissions(
    userId: string,
    integrationType: IntegrationType
  ): Promise<boolean> {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { data: integration } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('integration_type', integrationType)
        .eq('is_active', true)
        .single()

      if (!integration) return false

      // Test API access
      switch (integrationType) {
        case 'linkedin':
          const { linkedInIntegration } = await import('./linkedin')
          await linkedInIntegration.getProfile(integration.integration_data.access_token)
          return true
        case 'github':
          const { gitHubIntegration } = await import('./github')
          await gitHubIntegration.getProfile(integration.integration_data.access_token)
          return true
        default:
          return true
      }
    } catch (error) {
      console.error(`Integration validation failed for ${integrationType}:`, error)
      return false
    }
  }
}

// Integration manager class
export class IntegrationManager {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // Get all integrations
  async getIntegrations(): Promise<UserIntegration[]> {
    return IntegrationUtils.getUserIntegrations(this.userId)
  }

  // Get integration status
  async getStatus(): Promise<IntegrationStatus[]> {
    return IntegrationUtils.getIntegrationStatus(this.userId)
  }

  // Connect integration
  async connect(integrationType: IntegrationType): Promise<string> {
    return IntegrationUtils.getOAuthUrl(integrationType, this.userId)
  }

  // Disconnect integration
  async disconnect(integrationType: IntegrationType): Promise<void> {
    return IntegrationUtils.disconnectIntegration(this.userId, integrationType)
  }

  // Sync integration
  async sync(integrationType: IntegrationType): Promise<void> {
    return IntegrationUtils.syncIntegration(this.userId, integrationType)
  }

  // Sync all integrations
  async syncAll(): Promise<void> {
    const integrations = await this.getIntegrations()
    
    for (const integration of integrations) {
      try {
        await this.sync(integration.integration_type)
      } catch (error) {
        console.error(`Failed to sync ${integration.integration_type}:`, error)
      }
    }
  }

  // Validate permissions
  async validatePermissions(integrationType: IntegrationType): Promise<boolean> {
    return IntegrationUtils.validateIntegrationPermissions(this.userId, integrationType)
  }
}

// React hooks for integration management
export const useIntegrations = (userId: string) => {
  const manager = new IntegrationManager(userId)
  
  return {
    manager,
    getIntegrations: () => manager.getIntegrations(),
    getStatus: () => manager.getStatus(),
    connect: (type: IntegrationType) => manager.connect(type),
    disconnect: (type: IntegrationType) => manager.disconnect(type),
    sync: (type: IntegrationType) => manager.sync(type),
    syncAll: () => manager.syncAll(),
    validatePermissions: (type: IntegrationType) => manager.validatePermissions(type)
  }
}