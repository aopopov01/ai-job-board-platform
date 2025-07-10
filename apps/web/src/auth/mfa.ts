import { createClient } from '@supabase/supabase-js'
import { authenticator } from 'otplib'
import { randomBytes } from 'crypto'
import { logger, toError } from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key-for-testing'
)

export class MFAService {
  async isMFAEnabled(userId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_mfa_settings')
        .select('enabled')
        .eq('user_id', userId)
        .single()
      
      return data?.enabled || false
    } catch (error) {
      logger.error('Error checking MFA status', {}, toError(error))
      return false
    }
  }

  async setupMFA(userId: string, token: string): Promise<{ secret: string; qrCode: string; backupCodes: string[] }> {
    try {
      // Generate secret
      const secret = authenticator.generateSecret()
      
      // Generate QR code URL
      const qrCode = authenticator.keyuri(userId, 'Job Board Platform', secret)
      
      // Generate backup codes
      const backupCodes = this.generateBackupCodes()
      
      // Verify the token before saving
      const isValid = authenticator.check(token, secret)
      if (!isValid) {
        throw new Error('Invalid token')
      }
      
      // Save MFA settings
      await supabase
        .from('user_mfa_settings')
        .upsert({
          user_id: userId,
          secret,
          enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      // Save backup codes
      await supabase
        .from('mfa_recovery_codes')
        .insert(
          backupCodes.map(code => ({
            user_id: userId,
            code,
            used: false,
            created_at: new Date().toISOString()
          }))
        )
      
      return { secret, qrCode, backupCodes }
    } catch (error) {
      logger.error('Error setting up MFA', {}, toError(error))
      throw error
    }
  }

  async verifyMFAToken(userId: string, token: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_mfa_settings')
        .select('secret, enabled')
        .eq('user_id', userId)
        .single()
      
      if (!data?.enabled || !data.secret) {
        return false
      }
      
      // Check if it's a backup code
      const isBackupCode = await this.verifyBackupCode(userId, token)
      if (isBackupCode) {
        return true
      }
      
      // Check TOTP token
      const isValid = authenticator.check(token, data.secret)
      
      if (isValid) {
        // Update last used timestamp
        await supabase
          .from('user_mfa_settings')
          .update({ last_used: new Date().toISOString() })
          .eq('user_id', userId)
      }
      
      return isValid
    } catch (error) {
      logger.error('Error verifying MFA token', {}, toError(error))
      return false
    }
  }

  async disableMFA(userId: string, token: string): Promise<boolean> {
    try {
      // Verify token first
      const isValid = await this.verifyMFAToken(userId, token)
      if (!isValid) {
        return false
      }
      
      // Disable MFA
      await supabase
        .from('user_mfa_settings')
        .update({ enabled: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
      
      // Remove backup codes
      await supabase
        .from('mfa_recovery_codes')
        .delete()
        .eq('user_id', userId)
      
      return true
    } catch (error) {
      logger.error('Error disabling MFA', {}, toError(error))
      return false
    }
  }

  async regenerateBackupCodes(userId: string, token: string): Promise<string[]> {
    try {
      // Verify token first
      const isValid = await this.verifyMFAToken(userId, token)
      if (!isValid) {
        throw new Error('Invalid token')
      }
      
      // Remove old backup codes
      await supabase
        .from('mfa_recovery_codes')
        .delete()
        .eq('user_id', userId)
      
      // Generate new backup codes
      const backupCodes = this.generateBackupCodes()
      
      // Save new backup codes
      await supabase
        .from('mfa_recovery_codes')
        .insert(
          backupCodes.map(code => ({
            user_id: userId,
            code,
            used: false,
            created_at: new Date().toISOString()
          }))
        )
      
      return backupCodes
    } catch (error) {
      logger.error('Error regenerating backup codes', {}, toError(error))
      throw error
    }
  }

  private async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('mfa_recovery_codes')
        .select('id')
        .eq('user_id', userId)
        .eq('code', code)
        .eq('used', false)
        .single()
      
      if (data) {
        // Mark backup code as used
        await supabase
          .from('mfa_recovery_codes')
          .update({ used: true, used_at: new Date().toISOString() })
          .eq('id', data.id)
        
        return true
      }
      
      return false
    } catch (error) {
      return false
    }
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 8; i++) {
      const code = randomBytes(4).toString('hex').toUpperCase()
      codes.push(code)
    }
    return codes
  }
}

// Export a singleton instance
export const mfaService = new MFAService()