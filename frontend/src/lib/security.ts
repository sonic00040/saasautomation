import { NextRequest } from 'next/server'

// Security configuration constants
export const SECURITY_CONFIG = {
  // Session configuration
  SESSION: {
    TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh if expires within 5 minutes
  },
  
  // Rate limiting configuration
  RATE_LIMITS: {
    API_REQUESTS_PER_MINUTE: 60,
    LOGIN_ATTEMPTS_PER_HOUR: 5,
    PASSWORD_RESET_PER_HOUR: 3,
    FILE_UPLOADS_PER_HOUR: 20,
  },
  
  // File upload security
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    SCAN_FOR_MALWARE: true,
  },
  
  // Data encryption
  ENCRYPTION: {
    ALGORITHM: 'aes-256-gcm',
    KEY_LENGTH: 32,
    IV_LENGTH: 16,
  },
  
  // Password policy
  PASSWORD_POLICY: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    MAX_ATTEMPTS: 5,
  }
}

// Input validation and sanitization
export class InputValidator {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  // Password validation
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < SECURITY_CONFIG.PASSWORD_POLICY.MIN_LENGTH) {
      errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_POLICY.MIN_LENGTH} characters long`)
    }
    
    if (SECURITY_CONFIG.PASSWORD_POLICY.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (SECURITY_CONFIG.PASSWORD_POLICY.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (SECURITY_CONFIG.PASSWORD_POLICY.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (SECURITY_CONFIG.PASSWORD_POLICY.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes to prevent injection
      .substring(0, 1000) // Limit length
  }

  // Validate file upload
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > SECURITY_CONFIG.FILE_UPLOAD.MAX_SIZE) {
      return {
        isValid: false,
        error: `File size must be less than ${SECURITY_CONFIG.FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`
      }
    }

    // Check file type
    if (!SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not allowed. Please upload PDF, TXT, DOC, or DOCX files.'
      }
    }

    // Check file name
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      return {
        isValid: false,
        error: 'File name contains invalid characters'
      }
    }

    return { isValid: true }
  }

  // Validate URL/webhook
  static isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return ['http:', 'https:'].includes(urlObj.protocol)
    } catch {
      return false
    }
  }

  // Validate API token format
  static isValidApiToken(token: string): boolean {
    // Basic token format validation
    return /^[a-zA-Z0-9_-]{20,100}$/.test(token)
  }
}

// CSRF Protection
export class CSRFProtection {
  static generateToken(): string {
    return crypto.getRandomValues(new Uint32Array(4)).join('')
  }

  static validateToken(token: string, sessionToken: string): boolean {
    return token === sessionToken
  }
}

// Rate limiting (in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export class RateLimiter {
  static check(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up old entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k)
      }
    }

    const entry = rateLimitStore.get(key)
    const resetTime = now + windowMs

    if (!entry || entry.resetTime < now) {
      // First request or window expired
      rateLimitStore.set(key, { count: 1, resetTime })
      return { allowed: true, remaining: limit - 1, resetTime }
    }

    if (entry.count >= limit) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: entry.resetTime }
    }

    // Increment count
    entry.count++
    return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime }
  }

  static getKey(req: NextRequest, type: string): string {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    return `${type}:${ip}`
  }
}

// Data encryption utilities
export class DataEncryption {
  private static getKey(): string {
    const key = process.env.ENCRYPTION_KEY
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is required')
    }
    return key
  }

  static async encrypt(data: string): Promise<string> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API not available')
    }

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.getKey().slice(0, 32)),
      'AES-GCM',
      false,
      ['encrypt']
    )

    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(data)
    )

    const result = new Uint8Array(iv.length + encrypted.byteLength)
    result.set(iv)
    result.set(new Uint8Array(encrypted), iv.length)

    return btoa(String.fromCharCode(...result))
  }

  static async decrypt(encryptedData: string): Promise<string> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API not available')
    }

    const data = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    )

    const iv = data.slice(0, 12)
    const encrypted = data.slice(12)

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.getKey().slice(0, 32)),
      'AES-GCM',
      false,
      ['decrypt']
    )

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )

    return decoder.decode(decrypted)
  }
}

// Security headers
export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

// Content Security Policy
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-eval'",
    "'unsafe-inline'",
    'https://js.stripe.com',
    'https://checkout.stripe.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com'
  ],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'https://api.stripe.com',
    'https://checkout.stripe.com',
    'wss://*.supabase.co'
  ],
  'frame-src': [
    'https://js.stripe.com',
    'https://hooks.stripe.com',
    'https://checkout.stripe.com'
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'", 'https://checkout.stripe.com'],
  'upgrade-insecure-requests': []
}

// Audit logging
export class SecurityAudit {
  static log(event: string, details: any, userId?: string) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      event,
      details,
      userId,
      severity: this.getSeverity(event)
    }

    // In production, send to logging service
    console.log('Security Event:', logEntry)
  }

  private static getSeverity(event: string): 'low' | 'medium' | 'high' | 'critical' {
    const highSeverityEvents = ['failed_login', 'rate_limit_exceeded', 'csrf_detected']
    const criticalEvents = ['data_breach', 'unauthorized_access', 'malware_detected']

    if (criticalEvents.includes(event)) return 'critical'
    if (highSeverityEvents.includes(event)) return 'high'
    return 'low'
  }
}

// Environment validation
export function validateEnvironment() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY'
  ]

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  // Validate Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl && !supabaseUrl.includes('.supabase.co')) {
    console.warn('Supabase URL format may be incorrect')
  }
}

// Initialize security on app start
export function initializeSecurity() {
  try {
    validateEnvironment()
    console.log('Security configuration initialized')
  } catch (error) {
    console.error('Security initialization failed:', error)
    throw error
  }
}