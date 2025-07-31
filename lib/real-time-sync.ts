// Real-time synchronization system
export class RealTimeSync {
  private static listeners: Map<string, Function[]> = new Map()
  private static updateQueue: any[] = []
  private static isProcessing = false

  // Subscribe to real-time updates
  static subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }

    this.listeners.get(event)!.push(callback)

    // Return unsubscribe function
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
  static emit(event: string, data: any): void {
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

    // Queue update for processing
    this.queueUpdate(event, data)
  }

  // Queue updates for batch processing
  private static queueUpdate(event: string, data: any): void {
    this.updateQueue.push({
      id: Date.now() + Math.random(),
      event,
      data,
      timestamp: new Date().toISOString(),
    })

    this.processQueue()
  }

  // Process update queue
  private static async processQueue(): Promise<void> {
    if (this.isProcessing || this.updateQueue.length === 0) return

    this.isProcessing = true

    try {
      while (this.updateQueue.length > 0) {
        const update = this.updateQueue.shift()
        await this.processUpdate(update)
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    } finally {
      this.isProcessing = false
    }
  }

  // Process individual update
  private static async processUpdate(update: any): Promise<void> {
    try {
      // Broadcast to all tabs/windows
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("adminDataUpdated", {
            detail: { event: update.event, data: update.data },
          }),
        )
      }

      // Update localStorage
      const currentData = JSON.parse(localStorage.getItem("daghlar_admin_data") || "{}")

      switch (update.event) {
        case "blog_updated":
          this.updateBlogData(currentData, update.data)
          break
        case "project_updated":
          this.updateProjectData(currentData, update.data)
          break
        case "certificate_updated":
          this.updateCertificateData(currentData, update.data)
          break
        case "skill_updated":
          this.updateSkillData(currentData, update.data)
          break
        default:
          console.log("Unknown update event:", update.event)
      }

      localStorage.setItem("daghlar_admin_data", JSON.stringify(currentData))
    } catch (error) {
      console.error("Failed to process update:", error)
    }
  }

  private static updateBlogData(data: any, updateData: any): void {
    if (!data.blogPosts) data.blogPosts = []

    const { action, post } = updateData

    switch (action) {
      case "create":
        data.blogPosts.push({
          ...post,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        break
      case "update":
        const updateIndex = data.blogPosts.findIndex((p: any) => p.id === post.id)
        if (updateIndex !== -1) {
          data.blogPosts[updateIndex] = {
            ...data.blogPosts[updateIndex],
            ...post,
            updatedAt: new Date().toISOString(),
          }
        }
        break
      case "delete":
        data.blogPosts = data.blogPosts.filter((p: any) => p.id !== post.id)
        break
    }
  }

  private static updateProjectData(data: any, updateData: any): void {
    if (!data.projects) data.projects = []

    const { action, project } = updateData

    switch (action) {
      case "create":
        data.projects.push({
          ...project,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        break
      case "update":
        const updateIndex = data.projects.findIndex((p: any) => p.id === project.id)
        if (updateIndex !== -1) {
          data.projects[updateIndex] = {
            ...data.projects[updateIndex],
            ...project,
            updatedAt: new Date().toISOString(),
          }
        }
        break
      case "delete":
        data.projects = data.projects.filter((p: any) => p.id !== project.id)
        break
    }
  }

  private static updateCertificateData(data: any, updateData: any): void {
    if (!data.certificates) data.certificates = []

    const { action, certificate } = updateData

    switch (action) {
      case "create":
        data.certificates.push({
          ...certificate,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        break
      case "update":
        const updateIndex = data.certificates.findIndex((c: any) => c.id === certificate.id)
        if (updateIndex !== -1) {
          data.certificates[updateIndex] = {
            ...data.certificates[updateIndex],
            ...certificate,
            updatedAt: new Date().toISOString(),
          }
        }
        break
      case "delete":
        data.certificates = data.certificates.filter((c: any) => c.id !== certificate.id)
        break
    }
  }

  private static updateSkillData(data: any, updateData: any): void {
    if (!data.skills) data.skills = {}

    const { action, category, skill } = updateData

    switch (action) {
      case "add":
        if (!data.skills[category]) data.skills[category] = []
        if (!data.skills[category].includes(skill)) {
          data.skills[category].push(skill)
        }
        break
      case "remove":
        if (data.skills[category]) {
          data.skills[category] = data.skills[category].filter((s: string) => s !== skill)
        }
        break
      case "update_category":
        data.skills[category] = updateData.skills
        break
    }
  }
}
