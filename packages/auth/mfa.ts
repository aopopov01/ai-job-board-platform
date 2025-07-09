import { createClient } from '@supabase/supabase-js'
import { authenticator } from 'otplib'
import qrcode from 'qrcode'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface MFASetup {
  userId: string
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
  isEnabled: boolean
}

export interface MFAVerificationResult {
  isValid: boolean
  backupCodeUsed?: boolean
  attemptsRemaining?: number
}

export interface MFASettings {
  id: string
  userId: string
  secret: string
  backupCodes: string[]
  enabled: boolean
  createdAt: string
  lastUsed?: string
  failedAttempts: number
}

export class PracticalMFAService {
  private encryptionKey: string

  constructor() {
    this.encryptionKey = process.env.MFA_ENCRYPTION_KEY || 'default-key-change-in-production'
  }

  // Enable MFA for a user (generates QR code and backup codes)
  async enableMFA(userId: string): Promise<MFASetup> {
    try {
      // Check if MFA is already set up
      const existingMFA = await this.getMFASettings(userId)
      if (existingMFA?.enabled) {
        throw new Error('MFA is already enabled for this user')
      }

      const secret = authenticator.generateSecret()
      const userEmail = await this.getUserEmail(userId)
      const appName = 'JobBoard Pro'
      
      const otpauth = authenticator.keyuri(userEmail, appName, secret)
      const qrCodeUrl = await qrcode.toDataURL(otpauth)
      
      // Generate 8 backup codes (reasonable number)
      const backupCodes = this.generateBackupCodes(8)
      
      // Store MFA settings (disabled until verified)
      await supabase.from('user_mfa_settings').upsert({
        user_id: userId,
        secret: this.encrypt(secret),
        backup_codes: backupCodes.map(code => this.hashBackupCode(code)),
        enabled: false,
        failed_attempts: 0,
        created_at: new Date().toISOString()
      })
      
      return {
        userId,
        secret, // Don't return this in production - only for QR code generation
        qrCodeUrl,
        backupCodes,
        isEnabled: false
      }
    } catch (error) {
      console.error('Failed to enable MFA:', error)
      throw error
    }
  }
  
  // Verify setup token and enable MFA
  async verifyAndEnableMFA(userId: string, token: string): Promise<boolean> {
    try {
      const mfaSettings = await this.getMFASettings(userId)
      if (!mfaSettings) {
        throw new Error('MFA not set up for this user')
      }

      if (mfaSettings.enabled) {
        throw new Error('MFA is already enabled')
      }
      
      const secret = this.decrypt(mfaSettings.secret)
      const isValid = authenticator.verify({ 
        token, 
        secret
      })
      
      if (isValid) {
        await supabase
          .from('user_mfa_settings')
          .update({ 
            enabled: true,
            failed_attempts: 0,
            last_used: new Date().toISOString()
          })
          .eq('user_id', userId)
        
        // Log MFA enablement
        await this.logMFAEvent(userId, 'mfa_enabled')
        
        return true
      }
      
      // Track failed verification attempts
      await supabase
        .from('user_mfa_settings')
        .update({ 
          failed_attempts: (mfaSettings.failedAttempts || 0) + 1 
        })
        .eq('user_id', userId)
      
      return false
    } catch (error) {
      console.error('Failed to verify and enable MFA:', error)
      throw error
    }
  }
  
  // Verify MFA token during login
  async verifyMFAToken(userId: string, token: string): Promise<MFAVerificationResult> {
    try {
      const mfaSettings = await this.getMFASettings(userId)
      if (!mfaSettings || !mfaSettings.enabled) {
        return { isValid: false, attemptsRemaining: 0 }
      }

      // Check if account is locked due to too many failed attempts
      if (mfaSettings.failedAttempts >= 5) {
        await this.logMFAEvent(userId, 'mfa_locked')
        return { isValid: false, attemptsRemaining: 0 }
      }
      
      const secret = this.decrypt(mfaSettings.secret)
      
      // Try TOTP verification first
      const isValidTOTP = authenticator.verify({ 
        token, 
        secret
      })
      
      if (isValidTOTP) {
        await this.resetFailedAttempts(userId)
        await this.logMFAEvent(userId, 'mfa_verified')
        return { isValid: true }
      }
      
      // Try backup code verification
      const backupCodeResult = await this.verifyBackupCode(userId, token)
      if (backupCodeResult.isValid) {
        await this.resetFailedAttempts(userId)
        await this.logMFAEvent(userId, 'backup_code_used')
        return { isValid: true, backupCodeUsed: true }
      }
      
      // Track failed attempt
      const newFailedAttempts = (mfaSettings.failedAttempts || 0) + 1
      await supabase
        .from('user_mfa_settings')
        .update({ failed_attempts: newFailedAttempts })
        .eq('user_id', userId)
      
      await this.logMFAEvent(userId, 'mfa_failed')
      
      return { 
        isValid: false, 
        attemptsRemaining: Math.max(0, 5 - newFailedAttempts)
      }
    } catch (error) {
      console.error('Failed to verify MFA token:', error)
      throw error
    }
  }
  
  // Disable MFA (requires current MFA verification)
  async disableMFA(userId: string, currentToken: string): Promise<boolean> {
    try {
      // Verify current MFA token first
      const verificationResult = await this.verifyMFAToken(userId, currentToken)
      if (!verificationResult.isValid) {
        return false
      }
      
      await supabase
        .from('user_mfa_settings')
        .update({ 
          enabled: false,
          failed_attempts: 0
        })
        .eq('user_id', userId)
      
      await this.logMFAEvent(userId, 'mfa_disabled')
      
      return true
    } catch (error) {
      console.error('Failed to disable MFA:', error)
      throw error
    }
  }
  
  // Generate new backup codes (requires MFA verification)
  async regenerateBackupCodes(userId: string, currentToken: string): Promise<string[]> {
    try {
      // Verify current MFA token first
      const verificationResult = await this.verifyMFAToken(userId, currentToken)
      if (!verificationResult.isValid) {
        throw new Error('Invalid MFA token')
      }
      
      const newBackupCodes = this.generateBackupCodes(8)
      
      await supabase
        .from('user_mfa_settings')
        .update({ 
          backup_codes: newBackupCodes.map(code => this.hashBackupCode(code))
        })
        .eq('user_id', userId)
      
      await this.logMFAEvent(userId, 'backup_codes_regenerated')
      
      return newBackupCodes
    } catch (error) {
      console.error('Failed to regenerate backup codes:', error)
      throw error
    }
  }
  
  // Check if user has MFA enabled
  async isMFAEnabled(userId: string): Promise<boolean> {
    try {
      const mfaSettings = await this.getMFASettings(userId)
      return mfaSettings?.enabled || false
    } catch (error) {
      console.error('Failed to check MFA status:', error)
      return false
    }
  }
  
  // Get MFA status and settings (without sensitive data)
  async getMFAStatus(userId: string): Promise<{
    enabled: boolean
    backupCodesRemaining: number
    lastUsed?: string
    canSetup: boolean
  }> {
    try {
      const mfaSettings = await this.getMFASettings(userId)
      
      if (!mfaSettings) {
        return {
          enabled: false,
          backupCodesRemaining: 0,
          canSetup: true
        }
      }
      
      const backupCodesRemaining = mfaSettings.backupCodes?.length || 0
      
      return {
        enabled: mfaSettings.enabled,
        backupCodesRemaining,
        lastUsed: mfaSettings.lastUsed,
        canSetup: !mfaSettings.enabled
      }
    } catch (error) {
      console.error('Failed to get MFA status:', error)
      return {
        enabled: false,
        backupCodesRemaining: 0,
        canSetup: true
      }
    }
  }
  
  // Private helper methods
  private async getMFASettings(userId: string): Promise<MFASettings | null> {
    const { data, error } = await supabase
      .from('user_mfa_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error || !data) return null
    
    return {
      id: data.id,
      userId: data.user_id,
      secret: data.secret,
      backupCodes: data.backup_codes || [],
      enabled: data.enabled,
      createdAt: data.created_at,
      lastUsed: data.last_used,
      failedAttempts: data.failed_attempts || 0
    }
  }
  
  private async getUserEmail(userId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.admin.getUserById(userId)
    return user?.email || 'user@example.com'
  }
  
  private generateBackupCodes(count: number): string[] {
    return Array.from({ length: count }, () => 
      Math.random().toString(36).substr(2, 8).toUpperCase()
    )
  }
  
  private async verifyBackupCode(userId: string, code: string): Promise<{ isValid: boolean }> {
    const mfaSettings = await this.getMFASettings(userId)
    if (!mfaSettings) return { isValid: false }
    
    const hashedCode = this.hashBackupCode(code)
    const codeIndex = mfaSettings.backupCodes.indexOf(hashedCode)
    
    if (codeIndex !== -1) {
      // Remove used backup code
      const updatedCodes = mfaSettings.backupCodes.filter((_, index) => index !== codeIndex)
      
      await supabase
        .from('user_mfa_settings')
        .update({ backup_codes: updatedCodes })
        .eq('user_id', userId)
      
      return { isValid: true }
    }
    
    return { isValid: false }
  }
  
  private async resetFailedAttempts(userId: string): Promise<void> {
    await supabase
      .from('user_mfa_settings')
      .update({ 
        failed_attempts: 0,
        last_used: new Date().toISOString()
      })
      .eq('user_id', userId)
  }
  
  private async logMFAEvent(userId: string, eventType: string): Promise<void> {
    await supabase.from('security_events').insert({
      user_id: userId,
      event_type: eventType,
      created_at: new Date().toISOString(),
      metadata: { source: 'mfa_service' }
    })
  }
  
  // Encryption helpers
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    return `${iv.toString('hex')}:${encrypted}`
  }
  
  private decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]
    
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }
  
  private hashBackupCode(code: string): string {
    return crypto.createHash('sha256').update(code + this.encryptionKey).digest('hex')
  }
}

// Export singleton instance
export const mfaService = new PracticalMFAService()