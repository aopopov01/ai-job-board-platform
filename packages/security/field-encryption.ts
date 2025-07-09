import crypto from 'crypto'

export interface EncryptionConfig {
  algorithm: string
  keyLength: number
  ivLength: number
  tagLength: number
  saltLength: number
}

export interface EncryptedField {
  value: string
  encrypted: boolean
  algorithm: string
  timestamp: string
}

export class FieldEncryption {
  private encryptionKey: Buffer
  private config: EncryptionConfig

  constructor(encryptionKey?: string) {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
      tagLength: 16,
      saltLength: 32
    }

    if (encryptionKey) {
      this.encryptionKey = this.deriveKey(encryptionKey)
    } else {
      const envKey = process.env.FIELD_ENCRYPTION_KEY
      if (!envKey) {
        throw new Error('FIELD_ENCRYPTION_KEY environment variable required')
      }
      this.encryptionKey = this.deriveKey(envKey)
    }
  }

  // Encrypt sensitive data fields
  encryptSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    const sensitiveFields = [
      'ssn',
      'social_security_number',
      'tax_id',
      'bank_account',
      'routing_number',
      'passport_number',
      'driver_license',
      'credit_card',
      'salary',
      'compensation',
      'phone_number',
      'date_of_birth',
      'address',
      'emergency_contact'
    ]

    const encrypted = { ...data }

    sensitiveFields.forEach(field => {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encryptField(encrypted[field])
      }
    })

    return encrypted
  }

  // Decrypt sensitive data fields
  decryptSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    const decrypted = { ...data }

    Object.keys(decrypted).forEach(field => {
      if (decrypted[field] && this.isEncryptedField(decrypted[field])) {
        try {
          decrypted[field] = this.decryptField(decrypted[field])
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error)
          // Keep encrypted value if decryption fails
        }
      }
    })

    return decrypted
  }

  // Encrypt a single field
  encryptField(plaintext: string): string {
    try {
      if (this.isEncryptedField(plaintext)) {
        return plaintext // Already encrypted
      }

      const iv = crypto.randomBytes(this.config.ivLength)
      const cipher = crypto.createCipher(this.config.algorithm, this.encryptionKey)
      
      let encrypted = cipher.update(plaintext, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const authTag = cipher.getAuthTag()
      
      // Format: enc_v1_[iv]_[authTag]_[encrypted]
      return `enc_v1_${iv.toString('hex')}_${authTag.toString('hex')}_${encrypted}`
    } catch (error) {
      console.error('Failed to encrypt field:', error)
      throw new Error('Encryption failed')
    }
  }

  // Decrypt a single field
  decryptField(encryptedText: string): string {
    try {
      if (!this.isEncryptedField(encryptedText)) {
        return encryptedText // Not encrypted
      }

      const parts = encryptedText.split('_')
      if (parts.length !== 5 || parts[0] !== 'enc' || parts[1] !== 'v1') {
        throw new Error('Invalid encrypted field format')
      }

      const iv = Buffer.from(parts[2], 'hex')
      const authTag = Buffer.from(parts[3], 'hex')
      const encrypted = parts[4]

      const decipher = crypto.createDecipher(this.config.algorithm, this.encryptionKey)
      decipher.setAuthTag(authTag)
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      console.error('Failed to decrypt field:', error)
      throw new Error('Decryption failed')
    }
  }

  // Check if a field is encrypted
  isEncryptedField(value: any): boolean {
    return typeof value === 'string' && value.startsWith('enc_v1_')
  }

  // Encrypt structured data (like addresses, contact info)
  encryptStructuredData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    if (Array.isArray(data)) {
      return data.map(item => this.encryptStructuredData(item))
    }

    const encrypted = { ...data }

    // Recursively encrypt nested objects
    Object.keys(encrypted).forEach(key => {
      if (typeof encrypted[key] === 'object' && encrypted[key] !== null) {
        encrypted[key] = this.encryptStructuredData(encrypted[key])
      } else if (typeof encrypted[key] === 'string' && this.shouldEncryptField(key)) {
        encrypted[key] = this.encryptField(encrypted[key])
      }
    })

    return encrypted
  }

  // Decrypt structured data
  decryptStructuredData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data
    }

    if (Array.isArray(data)) {
      return data.map(item => this.decryptStructuredData(item))
    }

    const decrypted = { ...data }

    Object.keys(decrypted).forEach(key => {
      if (typeof decrypted[key] === 'object' && decrypted[key] !== null) {
        decrypted[key] = this.decryptStructuredData(decrypted[key])
      } else if (this.isEncryptedField(decrypted[key])) {
        try {
          decrypted[key] = this.decryptField(decrypted[key])
        } catch (error) {
          console.error(`Failed to decrypt structured field ${key}:`, error)
        }
      }
    })

    return decrypted
  }

  // Generate secure hash for indexing encrypted fields
  generateSearchableHash(plaintext: string): string {
    const salt = crypto.randomBytes(this.config.saltLength)
    const hash = crypto.pbkdf2Sync(plaintext.toLowerCase(), salt, 10000, 32, 'sha256')
    return `hash_${salt.toString('hex')}_${hash.toString('hex')}`
  }

  // Verify searchable hash
  verifySearchableHash(plaintext: string, hash: string): boolean {
    try {
      if (!hash.startsWith('hash_')) {
        return false
      }

      const parts = hash.split('_')
      if (parts.length !== 3) {
        return false
      }

      const salt = Buffer.from(parts[1], 'hex')
      const expectedHash = Buffer.from(parts[2], 'hex')
      
      const actualHash = crypto.pbkdf2Sync(plaintext.toLowerCase(), salt, 10000, 32, 'sha256')
      
      return crypto.timingSafeEqual(expectedHash, actualHash)
    } catch (error) {
      console.error('Failed to verify searchable hash:', error)
      return false
    }
  }

  // Rotate encryption key (for key rotation)
  rotateKey(newKey: string): FieldEncryption {
    return new FieldEncryption(newKey)
  }

  // Batch encrypt multiple records
  batchEncrypt(records: any[]): any[] {
    return records.map(record => this.encryptSensitiveData(record))
  }

  // Batch decrypt multiple records
  batchDecrypt(records: any[]): any[] {
    return records.map(record => this.decryptSensitiveData(record))
  }

  // Private helper methods
  private deriveKey(password: string): Buffer {
    const salt = crypto.createHash('sha256').update('jobboard-encryption-salt').digest()
    return crypto.pbkdf2Sync(password, salt, 100000, this.config.keyLength, 'sha256')
  }

  private shouldEncryptField(fieldName: string): boolean {
    const encryptionPatterns = [
      /ssn/i,
      /social/i,
      /tax/i,
      /bank/i,
      /passport/i,
      /license/i,
      /credit/i,
      /salary/i,
      /compensation/i,
      /phone/i,
      /address/i,
      /birth/i,
      /emergency/i
    ]

    return encryptionPatterns.some(pattern => pattern.test(fieldName))
  }

  // Utility methods for specific data types
  encryptPersonalInfo(personalInfo: {
    ssn?: string
    taxId?: string
    bankAccount?: string
    routingNumber?: string
    passportNumber?: string
    driverLicense?: string
    dateOfBirth?: string
    phoneNumber?: string
    address?: any
  }): any {
    const encrypted = { ...personalInfo }

    if (encrypted.ssn) encrypted.ssn = this.encryptField(encrypted.ssn)
    if (encrypted.taxId) encrypted.taxId = this.encryptField(encrypted.taxId)
    if (encrypted.bankAccount) encrypted.bankAccount = this.encryptField(encrypted.bankAccount)
    if (encrypted.routingNumber) encrypted.routingNumber = this.encryptField(encrypted.routingNumber)
    if (encrypted.passportNumber) encrypted.passportNumber = this.encryptField(encrypted.passportNumber)
    if (encrypted.driverLicense) encrypted.driverLicense = this.encryptField(encrypted.driverLicense)
    if (encrypted.dateOfBirth) encrypted.dateOfBirth = this.encryptField(encrypted.dateOfBirth)
    if (encrypted.phoneNumber) encrypted.phoneNumber = this.encryptField(encrypted.phoneNumber)
    if (encrypted.address) encrypted.address = this.encryptStructuredData(encrypted.address)

    return encrypted
  }

  decryptPersonalInfo(encryptedInfo: any): any {
    return this.decryptSensitiveData(encryptedInfo)
  }

  // Encrypt compensation data
  encryptCompensationData(compensation: {
    salary?: number
    bonus?: number
    equity?: number
    benefits?: any
    totalCompensation?: number
  }): any {
    const encrypted = { ...compensation }

    if (encrypted.salary) encrypted.salary = this.encryptField(encrypted.salary.toString())
    if (encrypted.bonus) encrypted.bonus = this.encryptField(encrypted.bonus.toString())
    if (encrypted.equity) encrypted.equity = this.encryptField(encrypted.equity.toString())
    if (encrypted.totalCompensation) encrypted.totalCompensation = this.encryptField(encrypted.totalCompensation.toString())
    if (encrypted.benefits) encrypted.benefits = this.encryptStructuredData(encrypted.benefits)

    return encrypted
  }

  decryptCompensationData(encryptedCompensation: any): any {
    const decrypted = this.decryptSensitiveData(encryptedCompensation)

    // Convert numeric fields back to numbers
    if (decrypted.salary && !this.isEncryptedField(decrypted.salary)) {
      decrypted.salary = parseFloat(decrypted.salary)
    }
    if (decrypted.bonus && !this.isEncryptedField(decrypted.bonus)) {
      decrypted.bonus = parseFloat(decrypted.bonus)
    }
    if (decrypted.equity && !this.isEncryptedField(decrypted.equity)) {
      decrypted.equity = parseFloat(decrypted.equity)
    }
    if (decrypted.totalCompensation && !this.isEncryptedField(decrypted.totalCompensation)) {
      decrypted.totalCompensation = parseFloat(decrypted.totalCompensation)
    }

    return decrypted
  }

  // Health check for encryption service
  healthCheck(): { 
    status: 'healthy' | 'error'
    canEncrypt: boolean
    canDecrypt: boolean
    keyStatus: 'valid' | 'invalid'
    error?: string
  } {
    try {
      const testData = 'test-encryption-data'
      const encrypted = this.encryptField(testData)
      const decrypted = this.decryptField(encrypted)
      
      return {
        status: 'healthy',
        canEncrypt: true,
        canDecrypt: decrypted === testData,
        keyStatus: 'valid'
      }
    } catch (error) {
      return {
        status: 'error',
        canEncrypt: false,
        canDecrypt: false,
        keyStatus: 'invalid',
        error: error.message
      }
    }
  }
}

// Export singleton instance
export const fieldEncryption = new FieldEncryption()

// Export helper functions
export const encryptSensitiveData = (data: any) => fieldEncryption.encryptSensitiveData(data)
export const decryptSensitiveData = (data: any) => fieldEncryption.decryptSensitiveData(data)
export const encryptField = (plaintext: string) => fieldEncryption.encryptField(plaintext)
export const decryptField = (encryptedText: string) => fieldEncryption.decryptField(encryptedText)
export const isEncryptedField = (value: any) => fieldEncryption.isEncryptedField(value)
export const generateSearchableHash = (plaintext: string) => fieldEncryption.generateSearchableHash(plaintext)
export const verifySearchableHash = (plaintext: string, hash: string) => fieldEncryption.verifySearchableHash(plaintext, hash)