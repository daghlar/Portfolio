export class SecurityEnhancements {
  private static readonly MAX_LOGIN_ATTEMPTS = 5
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000
  private static readonly PASSWORD_MIN_LENGTH = 8
  private static readonly PASSWORD_REQUIREMENTS = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < this.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${this.PASSWORD_MIN_LENGTH} characters long`)
    }

    if (this.PASSWORD_REQUIREMENTS.uppercase && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }

    if (this.PASSWORD_REQUIREMENTS.lowercase && !/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }

    if (this.PASSWORD_REQUIREMENTS.numbers && !/\d/.test(password)) {
      errors.push("Password must contain at least one number")
    }

    if (this.PASSWORD_REQUIREMENTS.symbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static checkLoginAttempts(ipAddress: string): { canLogin: boolean; remainingTime?: number } {
    const attemptsKey = `login_attempts_${ipAddress}`
    const lockoutKey = `lockout_${ipAddress}`
    
    const lockoutTime = localStorage.getItem(lockoutKey)
    if (lockoutTime) {
      const remainingTime = parseInt(lockoutTime) - Date.now()
      if (remainingTime > 0) {
        return { canLogin: false, remainingTime }
      } else {
        localStorage.removeItem(lockoutKey)
        localStorage.removeItem(attemptsKey)
      }
    }

    const attempts = parseInt(localStorage.getItem(attemptsKey) || "0")
    if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
      const lockoutEnd = Date.now() + this.LOCKOUT_DURATION
      localStorage.setItem(lockoutKey, lockoutEnd.toString())
      return { canLogin: false, remainingTime: this.LOCKOUT_DURATION }
    }

    return { canLogin: true }
  }

  static recordLoginAttempt(ipAddress: string, success: boolean): void {
    const attemptsKey = `login_attempts_${ipAddress}`
    
    if (success) {
      localStorage.removeItem(attemptsKey)
      localStorage.removeItem(`lockout_${ipAddress}`)
    } else {
      const currentAttempts = parseInt(localStorage.getItem(attemptsKey) || "0")
      localStorage.setItem(attemptsKey, (currentAttempts + 1).toString())
    }
  }

  static generateSecureToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  static hashPassword(password: string): string {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString(16)
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim()
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static checkSessionTimeout(): boolean {
    const lastActivity = localStorage.getItem('last_activity')
    if (!lastActivity) return true

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
    return timeSinceLastActivity > this.SESSION_TIMEOUT
  }

  static updateLastActivity(): void {
    localStorage.setItem('last_activity', Date.now().toString())
  }

  static clearSession(): void {
    localStorage.removeItem('last_activity')
    localStorage.removeItem('admin_logged_in')
  }

  static validateFileUpload(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 5MB' }
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only image files are allowed' }
    }

    return { isValid: true }
  }

  static detectXSS(content: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    ]

    return xssPatterns.some(pattern => pattern.test(content))
  }

  static rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]')
    
    const validRequests = requests.filter((timestamp: number) => now - timestamp < windowMs)
    
    if (validRequests.length >= maxRequests) {
      return false
    }
    
    validRequests.push(now)
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validRequests))
    
    return true
  }

  static logSecurityEvent(event: string, details?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]')
    logs.push(logEntry)
    
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100)
    }
    
    localStorage.setItem('security_logs', JSON.stringify(logs))
  }

  static getSecurityLogs(): any[] {
    return JSON.parse(localStorage.getItem('security_logs') || '[]')
  }

  static clearSecurityLogs(): void {
    localStorage.removeItem('security_logs')
  }
} 