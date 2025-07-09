// Security package exports
export * from './fraud-detection'
export * from './api'
export * from './middleware'

// Security utilities
export { validateInput, hashPassword, verifyPassword } from './utils'
export { encryptData, decryptData } from './encryption'
export { generateSecureToken, validateToken } from './tokens'

// Security hooks for React components
export { useSecurityContext, useSecurityFlags } from './hooks'

// Security constants
export const SECURITY_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  RATE_LIMITS: {
    API_DEFAULT: 100, // requests per 15 minutes
    AUTH_ENDPOINTS: 10, // requests per 15 minutes
    SEARCH_ENDPOINTS: 200, // requests per 15 minutes
    UPLOAD_ENDPOINTS: 20 // requests per hour
  }
} as const