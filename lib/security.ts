// Security utilities for admin panel
export class SecurityManager {
  private static readonly MAX_LOGIN_ATTEMPTS = 3
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .trim()
  }

  // Validate and sanitize form data
  static validateFormData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        sanitized[key] = this.sanitizeInput(value)
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  // Check for brute force attempts
  static checkBruteForce(ip: string): boolean {
    const attempts = localStorage.getItem(`login_attempts_${ip}`)
    if (!attempts) return false

    const data = JSON.parse(attempts)
    const now = Date.now()

    // Remove old attempts
    data.attempts = data.attempts.filter((attempt: number) => now - attempt < this.LOCKOUT_DURATION)

    if (data.attempts.length >= this.MAX_LOGIN_ATTEMPTS) {
      return true // Locked out
    }

    return false
  }

  // Record login attempt
  static recordLoginAttempt(ip: string, success: boolean) {
    const key = `login_attempts_${ip}`
    const existing = localStorage.getItem(key)
    const data = existing ? JSON.parse(existing) : { attempts: [] }

    if (!success) {
      data.attempts.push(Date.now())
    } else {
      // Clear attempts on successful login
      data.attempts = []
    }

    localStorage.setItem(key, JSON.stringify(data))
  }

  // Get visitor info
  static getVisitorInfo() {
    const userAgent = navigator.userAgent
    return {
      ip: this.getClientIP(),
      userAgent,
      browser: this.getBrowserInfo(userAgent),
      os: this.getOSInfo(userAgent),
      device: this.getDeviceInfo(userAgent),
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      referrer: document.referrer || "Direct",
    }
  }

  private static getClientIP(): string {
    // In a real scenario, this would come from server
    return "127.0.0.1"
  }

  private static getBrowserInfo(userAgent: string): string {
    if (userAgent.includes("Chrome")) return "Chrome"
    if (userAgent.includes("Firefox")) return "Firefox"
    if (userAgent.includes("Safari")) return "Safari"
    if (userAgent.includes("Edge")) return "Edge"
    return "Unknown"
  }

  private static getOSInfo(userAgent: string): string {
    if (userAgent.includes("Windows")) return "Windows"
    if (userAgent.includes("Mac")) return "macOS"
    if (userAgent.includes("Linux")) return "Linux"
    if (userAgent.includes("Android")) return "Android"
    if (userAgent.includes("iOS")) return "iOS"
    return "Unknown"
  }

  private static getDeviceInfo(userAgent: string): string {
    if (/Mobile|Android|iPhone/.test(userAgent)) return "Mobile"
    if (/Tablet|iPad/.test(userAgent)) return "Tablet"
    return "Desktop"
  }

  // Generate session token
  static generateSessionToken(): string {
    return btoa(Date.now() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, "")
  }

  // Validate session
  static validateSession(): boolean {
    const session = localStorage.getItem("admin_session")
    if (!session) return false

    try {
      const data = JSON.parse(session)
      const now = Date.now()

      if (now > data.expires) {
        localStorage.removeItem("admin_session")
        return false
      }

      return true
    } catch {
      return false
    }
  }

  // Create session
  static createSession() {
    const session = {
      token: this.generateSessionToken(),
      created: Date.now(),
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    }
    localStorage.setItem("admin_session", JSON.stringify(session))
  }

  // Destroy session
  static destroySession() {
    localStorage.removeItem("admin_session")
  }
}
