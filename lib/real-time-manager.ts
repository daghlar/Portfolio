// Comprehensive Real-time Management System
export class RealTimeManager {
  private static instance: RealTimeManager
  private listeners: Map<string, Function[]> = new Map()
  private updateQueue: any[] = []
  private isProcessing = false
  private syncInterval: NodeJS.Timeout | null = null

  static getInstance(): RealTimeManager {
    if (!RealTimeManager.instance) {
      RealTimeManager.instance = new RealTimeManager()
    }
    return RealTimeManager.instance
  }

  // Initialize real-time system
  initialize() {
    this.startSyncInterval()
    this.setupStorageListener()
    this.setupVisibilityListener()
  }

  // Subscribe to real-time updates
  subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }

    this.listeners.get(event)!.push(callback)

    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  // Emit real-time updates
  emit(event: string, data: any): void {
    // Add timestamp and unique ID
    const updateData = {
      ...data,
      timestamp: Date.now(),
      id: this.generateId(),
      event,
    }

    // Notify all listeners immediately
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error)
        }
      })
    }

    // Queue for persistence
    this.queueUpdate(updateData)

    // Broadcast to other tabs/windows
    this.broadcastUpdate(updateData)

    // Trigger immediate DOM update
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("forceUpdate", { detail: data }))
    }
  }

  // Queue updates for batch processing
  private queueUpdate(update: any): void {
    this.updateQueue.push(update)
    this.processQueue()
  }

  // Process update queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.updateQueue.length === 0) return

    this.isProcessing = true

    try {
      while (this.updateQueue.length > 0) {
        const update = this.updateQueue.shift()
        await this.persistUpdate(update)
        await new Promise((resolve) => setTimeout(resolve, 5))
      }
    } finally {
      this.isProcessing = false
    }
  }

  // Persist update to storage
  private async persistUpdate(update: any): Promise<void> {
    try {
      const currentData = this.getCurrentData()
      const updatedData = this.applyUpdate(currentData, update)

      localStorage.setItem("daghlar_admin_data", JSON.stringify(updatedData))

      // Log the update
      this.logUpdate(update)
    } catch (error) {
      console.error("Failed to persist update:", error)
    }
  }

  // Apply update to data structure
  private applyUpdate(data: any, update: any): any {
    const { event, action, payload } = update

    switch (event) {
      case "site_content_updated":
        return this.updateSiteContent(data, payload)
      case "blog_updated":
        return this.updateBlogData(data, action, payload)
      case "project_updated":
        return this.updateProjectData(data, action, payload)
      case "certificate_updated":
        return this.updateCertificateData(data, action, payload)
      case "skill_updated":
        return this.updateSkillData(data, action, payload)
      case "social_updated":
        return this.updateSocialData(data, action, payload)
      default:
        return data
    }
  }

  // Update site content
  private updateSiteContent(data: any, payload: any): any {
    return {
      ...data,
      siteContent: {
        ...data.siteContent,
        ...payload,
      },
    }
  }

  // Update blog data
  private updateBlogData(data: any, action: string, payload: any): any {
    if (!data.blogPosts) data.blogPosts = []

    switch (action) {
      case "create":
        data.blogPosts.push({
          ...payload,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        break
      case "update":
        const updateIndex = data.blogPosts.findIndex((p: any) => p.id === payload.id)
        if (updateIndex !== -1) {
          data.blogPosts[updateIndex] = {
            ...data.blogPosts[updateIndex],
            ...payload,
            updatedAt: new Date().toISOString(),
          }
        }
        break
      case "delete":
        data.blogPosts = data.blogPosts.filter((p: any) => p.id !== payload.id)
        break
      case "toggle_status":
        const toggleIndex = data.blogPosts.findIndex((p: any) => p.id === payload.id)
        if (toggleIndex !== -1) {
          data.blogPosts[toggleIndex].status = payload.status
          data.blogPosts[toggleIndex].updatedAt = new Date().toISOString()
        }
        break
    }

    return data
  }

  // Update project data
  private updateProjectData(data: any, action: string, payload: any): any {
    if (!data.projects) data.projects = []

    switch (action) {
      case "create":
        data.projects.push({
          ...payload,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        break
      case "update":
        const updateIndex = data.projects.findIndex((p: any) => p.id === payload.id)
        if (updateIndex !== -1) {
          data.projects[updateIndex] = {
            ...data.projects[updateIndex],
            ...payload,
            updatedAt: new Date().toISOString(),
          }
        }
        break
      case "delete":
        data.projects = data.projects.filter((p: any) => p.id !== payload.id)
        break
      case "toggle_status":
        const toggleIndex = data.projects.findIndex((p: any) => p.id === payload.id)
        if (toggleIndex !== -1) {
          data.projects[toggleIndex].status = payload.status
          data.projects[toggleIndex].updatedAt = new Date().toISOString()
        }
        break
    }

    return data
  }

  // Update certificate data
  private updateCertificateData(data: any, action: string, payload: any): any {
    if (!data.certificates) data.certificates = []

    switch (action) {
      case "create":
        data.certificates.push({
          ...payload,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        break
      case "update":
        const updateIndex = data.certificates.findIndex((c: any) => c.id === payload.id)
        if (updateIndex !== -1) {
          data.certificates[updateIndex] = {
            ...data.certificates[updateIndex],
            ...payload,
            updatedAt: new Date().toISOString(),
          }
        }
        break
      case "delete":
        data.certificates = data.certificates.filter((c: any) => c.id !== payload.id)
        break
      case "toggle_status":
        const toggleIndex = data.certificates.findIndex((c: any) => c.id === payload.id)
        if (toggleIndex !== -1) {
          data.certificates[toggleIndex].isActive = payload.isActive
          data.certificates[toggleIndex].updatedAt = new Date().toISOString()
        }
        break
    }

    return data
  }

  // Update skill data
  private updateSkillData(data: any, action: string, payload: any): any {
    if (!data.skills) data.skills = {}

    switch (action) {
      case "add_skill":
        if (!data.skills[payload.category]) data.skills[payload.category] = []
        if (!data.skills[payload.category].find((s: any) => s.name === payload.skill.name)) {
          data.skills[payload.category].push(payload.skill)
        }
        break
      case "remove_skill":
        if (data.skills[payload.category]) {
          data.skills[payload.category] = data.skills[payload.category].filter((s: any) => s.name !== payload.skillName)
        }
        break
      case "update_skill":
        if (data.skills[payload.category]) {
          const skillIndex = data.skills[payload.category].findIndex((s: any) => s.name === payload.oldName)
          if (skillIndex !== -1) {
            data.skills[payload.category][skillIndex] = payload.skill
          }
        }
        break
      case "add_category":
        data.skills[payload.category] = []
        break
      case "remove_category":
        delete data.skills[payload.category]
        break
    }

    return data
  }

  // Update social data
  private updateSocialData(data: any, action: string, payload: any): any {
    if (!data.socialLinks) data.socialLinks = []

    switch (action) {
      case "create":
        data.socialLinks.push({
          ...payload,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        })
        break
      case "update":
        const updateIndex = data.socialLinks.findIndex((s: any) => s.id === payload.id)
        if (updateIndex !== -1) {
          data.socialLinks[updateIndex] = {
            ...data.socialLinks[updateIndex],
            ...payload,
            updatedAt: new Date().toISOString(),
          }
        }
        break
      case "delete":
        data.socialLinks = data.socialLinks.filter((s: any) => s.id !== payload.id)
        break
      case "toggle_status":
        const toggleIndex = data.socialLinks.findIndex((s: any) => s.id === payload.id)
        if (toggleIndex !== -1) {
          data.socialLinks[toggleIndex].isActive = payload.isActive
          data.socialLinks[toggleIndex].updatedAt = new Date().toISOString()
        }
        break
    }

    return data
  }

  // Broadcast update to other tabs/windows
  private broadcastUpdate(update: any): void {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("adminDataUpdated", {
          detail: update,
        }),
      )

      // Also use BroadcastChannel for better cross-tab communication
      try {
        const channel = new BroadcastChannel("daghlar_admin_updates")
        channel.postMessage(update)
      } catch (error) {
        // BroadcastChannel not supported, fallback to localStorage
        const key = `admin_update_${Date.now()}`
        localStorage.setItem(key, JSON.stringify(update))
        setTimeout(() => localStorage.removeItem(key), 1000)
      }
    }
  }

  // Setup storage listener for cross-tab sync
  private setupStorageListener(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key?.startsWith("admin_update_")) {
          try {
            const update = JSON.parse(e.newValue || "{}")
            this.notifyListeners(update.event, update)
          } catch (error) {
            console.error("Failed to parse storage update:", error)
          }
        }
      })

      // BroadcastChannel listener
      try {
        const channel = new BroadcastChannel("daghlar_admin_updates")
        channel.onmessage = (event) => {
          this.notifyListeners(event.data.event, event.data)
        }
      } catch (error) {
        // BroadcastChannel not supported
      }
    }
  }

  // Setup visibility change listener
  private setupVisibilityListener(): void {
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          // Page became visible, sync data
          this.syncData()
        }
      })
    }
  }

  // Start sync interval
  private startSyncInterval(): void {
    this.syncInterval = setInterval(() => {
      this.syncData()
    }, 30000) // Sync every 30 seconds
  }

  // Sync data
  private syncData(): void {
    this.emit("data_sync_requested", { timestamp: Date.now() })
  }

  // Notify listeners
  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error)
        }
      })
    }
  }

  // Get current data
  private getCurrentData(): any {
    try {
      const stored = localStorage.getItem("daghlar_admin_data")
      return stored ? JSON.parse(stored) : this.getDefaultData()
    } catch (error) {
      return this.getDefaultData()
    }
  }

  // Log update
  private logUpdate(update: any): void {
    try {
      const logs = JSON.parse(localStorage.getItem("admin_update_logs") || "[]")
      logs.unshift({
        ...update,
        timestamp: new Date().toISOString(),
      })

      // Keep only last 1000 logs
      if (logs.length > 1000) {
        logs.splice(1000)
      }

      localStorage.setItem("admin_update_logs", JSON.stringify(logs))
    } catch (error) {
      console.error("Failed to log update:", error)
    }
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get default data structure
  private getDefaultData(): any {
    return {
      siteContent: {
        home: {
          title: "Hey, I'm Daghlar.",
          subtitle: "Computer Engineering Student",
          descriptions: ["Cybersecurity Expert", "Software Developer", "AI Enthusiast"],
          footer: "Nişantaşı University - Computer Engineering",
        },
        about: {
          name: "Daghlar Mammadov",
          age: "23",
          location: "Istanbul, Turkey",
          experience: "13 years experience",
          bio: [
            "I'm a Computer Engineering student at Nişantaşı University and an Azerbaijani citizen. I've been actively working in software development, artificial intelligence, and cybersecurity for 13 years.",
            "I've developed numerous open-source projects, operating systems, browsers, and AI models. I'm constantly improving my language skills across multiple languages and cultures.",
          ],
        },
      },
      blogPosts: [],
      projects: [],
      certificates: [],
      skills: {
        programming: [],
        cybersecurity: [],
        ai: [],
        design: [],
        languages: [],
      },
      socialLinks: [],
      security: {
        adminPassword: "#JysmN!iFC!*P^k9%W!*",
        loginAttempts: {},
        lastLogin: null,
      },
    }
  }

  // Cleanup
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
    this.listeners.clear()
    this.updateQueue = []
  }

  // Event System for Real-time Updates
  // Queue-based Update System
  // Real-time Analytics
  private static calculateThreatLevel(securityLogs: any[]): string {
    const recentLogs = securityLogs.filter(
      (log) => Date.now() - new Date(log.timestamp).getTime() < 60 * 60 * 1000, // Last hour
    )

    const threatCount = recentLogs.filter(
      (log) =>
        log.event.includes("failed_login") ||
        log.event.includes("suspicious_activity") ||
        log.event.includes("rate_limit_exceeded"),
    ).length

    if (threatCount > 10) return "HIGH"
    if (threatCount > 5) return "MEDIUM"
    if (threatCount > 0) return "LOW"
    return "NONE"
  }

  private static logDataChange(event: string, data: any): void {
    const changeLog = {
      event,
      data: JSON.stringify(data).slice(0, 500), // Limit log size
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }

    const logs = JSON.parse(localStorage.getItem("data_change_logs") || "[]")
    logs.unshift(changeLog)

    // Keep only last 500 change logs
    if (logs.length > 500) {
      logs.splice(500)
    }

    localStorage.setItem("data_change_logs", JSON.stringify(logs))
  }
}

// Initialize singleton
export const realTimeManager = RealTimeManager.getInstance()
