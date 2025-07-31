// Advanced Security Manager with encryption and protection
export class AdvancedSecurity {
  private static readonly ENCRYPTION_KEY = "DaghlarSecureAdvanced2024!@#$%^&*()"
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
  private static readonly MAX_LOGIN_ATTEMPTS = 3
  private static readonly RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
  private static readonly MAX_REQUESTS_PER_WINDOW = 100

  // AES-256 simulation (client-side encryption)
  static encryptData(data: string): string {
    try {
      // Simple encryption simulation - in real app would use crypto-js
      const encoded = btoa(encodeURIComponent(data))
      const timestamp = Date.now().toString()
      return btoa(`${encoded}:${timestamp}:${this.ENCRYPTION_KEY.slice(0, 8)}`)
    } catch (error) {
      console.error("Encryption failed:", error)
      return data
    }
  }

  static decryptData(encryptedData: string): string {
    try {
      const decoded = atob(encryptedData)
      const [data] = decoded.split(":")
      return decodeURIComponent(atob(data))
    } catch (error) {
      console.error("Decryption failed:", error)
      return encryptedData
    }
  }

  // XSS Protection
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .replace(/data:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/expression\(/gi, "")
      .trim()
  }

  // CSRF Token Generation
  static generateCSRFToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  // Rate Limiting
  static checkRateLimit(identifier: string): boolean {
    const key = `rate_limit_${identifier}`
    const now = Date.now()
    const requests = JSON.parse(localStorage.getItem(key) || "[]")

    // Remove old requests outside the window
    const validRequests = requests.filter((timestamp: number) => now - timestamp < this.RATE_LIMIT_WINDOW)

    if (validRequests.length >= this.MAX_REQUESTS_PER_WINDOW) {
      return false // Rate limited
    }

    validRequests.push(now)
    localStorage.setItem(key, JSON.stringify(validRequests))
    return true
  }

  // Device Fingerprinting
  static generateDeviceFingerprint(): string {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    ctx!.textBaseline = "top"
    ctx!.font = "14px Arial"
    ctx!.fillText("Device fingerprint", 2, 2)

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      webgl: this.getWebGLFingerprint(),
      fonts: this.getAvailableFonts(),
    }

    return btoa(JSON.stringify(fingerprint)).slice(0, 32)
  }

  private static getWebGLFingerprint(): string {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) return "no-webgl"

    const renderer = gl.getParameter(gl.RENDERER)
    const vendor = gl.getParameter(gl.VENDOR)
    return `${vendor}-${renderer}`.slice(0, 50)
  }

  private static getAvailableFonts(): string[] {
    const testFonts = ["Arial", "Times", "Courier", "Helvetica", "Georgia", "Verdana"]
    const available: string[] = []

    testFonts.forEach((font) => {
      const span = document.createElement("span")
      span.style.fontFamily = font
      span.style.fontSize = "12px"
      span.textContent = "test"
      document.body.appendChild(span)

      if (span.offsetWidth > 0) {
        available.push(font)
      }

      document.body.removeChild(span)
    })

    return available
  }

  // SQL Injection Protection (for form inputs)
  static validateSQLInput(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(SCRIPT|IFRAME|OBJECT|EMBED|FORM)\b)/i,
    ]

    return !sqlPatterns.some((pattern) => pattern.test(input))
  }

  // File Upload Validation
  static validateFileUpload(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "Invalid file type. Only JPG, PNG, WebP, SVG allowed." }
    }

    if (file.size > maxSize) {
      return { valid: false, error: "File too large. Maximum size is 5MB." }
    }

    return { valid: true }
  }

  // Real-time Threat Detection
  static detectSuspiciousActivity(activity: any): boolean {
    const suspiciousPatterns = [
      // Multiple rapid requests
      activity.requestCount > 50,
      // Unusual user agent
      /bot|crawler|spider|scraper/i.test(activity.userAgent),
      // Suspicious geolocation changes
      activity.locationChanges > 3,
      // Failed login attempts
      activity.failedLogins > 5,
    ]

    return suspiciousPatterns.some((pattern) => pattern)
  }

  // Session Management
  static createSecureSession(userId: string): string {
    const sessionData = {
      userId,
      created: Date.now(),
      expires: Date.now() + this.SESSION_TIMEOUT,
      csrfToken: this.generateCSRFToken(),
      deviceFingerprint: this.generateDeviceFingerprint(),
    }

    const sessionToken = this.encryptData(JSON.stringify(sessionData))
    localStorage.setItem("secure_admin_session", sessionToken)
    return sessionToken
  }

  static validateSession(): boolean {
    try {
      const sessionToken = localStorage.getItem("secure_admin_session")
      if (!sessionToken) return false

      const sessionData = JSON.parse(this.decryptData(sessionToken))
      const now = Date.now()

      if (now > sessionData.expires) {
        this.destroySession()
        return false
      }

      // Validate device fingerprint
      const currentFingerprint = this.generateDeviceFingerprint()
      if (currentFingerprint !== sessionData.deviceFingerprint) {
        this.destroySession()
        return false
      }

      return true
    } catch (error) {
      this.destroySession()
      return false
    }
  }

  static destroySession(): void {
    localStorage.removeItem("secure_admin_session")
    localStorage.removeItem("admin_csrf_token")
  }

  // Real-time Monitoring
  static logSecurityEvent(event: string, details: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details: this.sanitizeInput(JSON.stringify(details)),
      userAgent: navigator.userAgent,
      ip: "client-side", // Would be server IP in real implementation
      sessionId: this.getCurrentSessionId(),
    }

    const logs = JSON.parse(localStorage.getItem("security_logs") || "[]")
    logs.unshift(logEntry)

    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(1000)
    }

    localStorage.setItem("security_logs", JSON.stringify(logs))
  }

  private static getCurrentSessionId(): string {
    try {
      const sessionToken = localStorage.getItem("secure_admin_session")
      if (!sessionToken) return "anonymous"

      const sessionData = JSON.parse(this.decryptData(sessionToken))
      return sessionData.userId || "unknown"
    } catch {
      return "invalid"
    }
  }
}
