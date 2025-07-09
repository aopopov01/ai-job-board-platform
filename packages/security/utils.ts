import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Input validation utilities
export function validateInput(input: string, type: 'email' | 'password' | 'name' | 'url' | 'text'): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!input || typeof input !== 'string') {
    errors.push('Input is required and must be a string')
    return { isValid: false, errors }
  }

  switch (type) {
    case 'email':
      return validateEmail(input)
    case 'password':
      return validatePassword(input)
    case 'name':
      return validateName(input)
    case 'url':
      return validateUrl(input)
    case 'text':
      return validateText(input)
    default:
      errors.push('Invalid validation type')
      return { isValid: false, errors }
  }
}

function validateEmail(email: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format')
  }
  
  if (email.length > 254) {
    errors.push('Email is too long')
  }
  
  // Check for disposable email providers
  const disposableProviders = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
    'mailinator.com', 'throwaway.email', 'temp-mail.org'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (domain && disposableProviders.includes(domain)) {
    errors.push('Disposable email addresses are not allowed')
  }
  
  return { isValid: errors.length === 0, errors }
}

function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (password.length > 128) {
    errors.push('Password is too long')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  // Check for common passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common')
  }
  
  return { isValid: errors.length === 0, errors }
}

function validateName(name: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (name.length < 1) {
    errors.push('Name is required')
  }
  
  if (name.length > 100) {
    errors.push('Name is too long')
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    errors.push('Name contains invalid characters')
  }
  
  return { isValid: errors.length === 0, errors }
}

function validateUrl(url: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  try {
    const urlObj = new URL(url)
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push('URL must use HTTP or HTTPS protocol')
    }
    
    if (url.length > 2048) {
      errors.push('URL is too long')
    }
    
  } catch {
    errors.push('Invalid URL format')
  }
  
  return { isValid: errors.length === 0, errors }
}

function validateText(text: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (text.length > 10000) {
    errors.push('Text is too long')
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:\s*text\/html/i
  ]
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      errors.push('Text contains potentially malicious content')
      break
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Generate secure random strings
export function generateSecureRandom(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

// Generate cryptographically secure UUIDs
export function generateSecureUUID(): string {
  return crypto.randomUUID()
}

// Password strength calculation
export function calculatePasswordStrength(password: string): {
  score: number // 0-100
  level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
  feedback: string[]
} {
  let score = 0
  const feedback: string[] = []
  
  // Length score
  if (password.length >= 8) score += 25
  else feedback.push('Use at least 8 characters')
  
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10
  
  // Character variety
  if (/[a-z]/.test(password)) score += 10
  else feedback.push('Add lowercase letters')
  
  if (/[A-Z]/.test(password)) score += 10
  else feedback.push('Add uppercase letters')
  
  if (/\d/.test(password)) score += 10
  else feedback.push('Add numbers')
  
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15
  else feedback.push('Add special characters')
  
  // Pattern checks
  if (!/(.)\1{2,}/.test(password)) score += 10
  else feedback.push('Avoid repeating characters')
  
  if (!/123|abc|qwe/i.test(password)) score += 10
  else feedback.push('Avoid common sequences')
  
  let level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
  
  if (score < 30) level = 'very-weak'
  else if (score < 50) level = 'weak'
  else if (score < 70) level = 'fair'
  else if (score < 90) level = 'good'
  else level = 'strong'
  
  return { score, level, feedback }
}

// Rate limiting utilities
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowStart = now - windowMs
  
  // Clean up old entries
  for (const [storeKey, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(storeKey)
    }
  }
  
  let entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs
    }
    rateLimitStore.set(key, entry)
  }
  
  entry.count++
  
  const allowed = entry.count <= maxRequests
  const remaining = Math.max(0, maxRequests - entry.count)
  
  return {
    allowed,
    remaining,
    resetTime: entry.resetTime
  }
}

// SQL injection detection
export function detectSQLInjection(input: string): {
  isSuspicious: boolean
  patterns: string[]
} {
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    /(--|\|\/\*|\*\/)/,
    /(\band\b|\bor\b).*(=|<|>|\blike\b)/i,
    /(';|;--|\|\|)/,
    /(\bhex\b|\bchar\b|\bcast\b)/i
  ]
  
  const matchedPatterns: string[] = []
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      matchedPatterns.push(pattern.source)
    }
  }
  
  return {
    isSuspicious: matchedPatterns.length > 0,
    patterns: matchedPatterns
  }
}

// XSS detection
export function detectXSS(input: string): {
  isSuspicious: boolean
  patterns: string[]
} {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe\b[^>]*>/i,
    /<object\b[^>]*>/i,
    /<embed\b[^>]*>/i,
    /eval\s*\(/i,
    /expression\s*\(/i
  ]
  
  const matchedPatterns: string[] = []
  
  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      matchedPatterns.push(pattern.source)
    }
  }
  
  return {
    isSuspicious: matchedPatterns.length > 0,
    patterns: matchedPatterns
  }
}

// Sanitize user input
export function sanitizeInput(input: string, options?: {
  allowHTML?: boolean
  maxLength?: number
}): string {
  if (typeof input !== 'string') return ''
  
  let sanitized = input.trim()
  
  if (options?.maxLength) {
    sanitized = sanitized.slice(0, options.maxLength)
  }
  
  if (!options?.allowHTML) {
    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '')
  }
  
  // Encode dangerous characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
  
  return sanitized
}

// Generate CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('base64')
}

// Validate CSRF token
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, 'base64'),
      Buffer.from(sessionToken, 'base64')
    )
  } catch {
    return false
  }
}

// Secure session ID generation
export function generateSessionId(): string {
  return crypto.randomBytes(64).toString('base64url')
}

// Time-based OTP utilities
export function generateTOTP(secret: string, window: number = 30): string {
  const time = Math.floor(Date.now() / 1000 / window)
  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base32'))
  hmac.update(Buffer.alloc(8))
  hmac.update(Buffer.from(time.toString(16).padStart(16, '0'), 'hex'))
  
  const hash = hmac.digest()
  const offset = hash[hash.length - 1] & 0xf
  const code = (hash.readUInt32BE(offset) & 0x7fffffff) % 1000000
  
  return code.toString().padStart(6, '0')
}

export function verifyTOTP(token: string, secret: string, window: number = 30, tolerance: number = 1): boolean {
  const time = Math.floor(Date.now() / 1000 / window)
  
  for (let i = -tolerance; i <= tolerance; i++) {
    const expectedToken = generateTOTP(secret, window)
    if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken))) {
      return true
    }
  }
  
  return false
}