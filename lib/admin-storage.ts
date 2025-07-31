// Enhanced Admin Storage System with Real-time Updates
export class AdminStorage {
  private static readonly STORAGE_KEY = "daghlar_admin_data"
  private static listeners: Set<() => void> = new Set()

  // Add listener for real-time updates
  static addListener(callback: () => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify all listeners
  private static notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback()
      } catch (error) {
        console.error("Error in storage listener:", error)
      }
    })
  }

  // Get all admin data
  static getData(): any {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        const defaultData = this.getDefaultData()
        this.saveData(defaultData)
        return defaultData
      }

      const parsed = JSON.parse(stored)
      return this.mergeWithDefaults(parsed)
    } catch (error) {
      console.error("Error loading admin data:", error)
      const defaultData = this.getDefaultData()
      this.saveData(defaultData)
      return defaultData
    }
  }

  // Save admin data with real-time updates
  static saveData(data: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))

      // Notify listeners immediately
      this.notifyListeners()

      // Dispatch events for cross-component updates
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("adminDataUpdated", { detail: data }))
        window.dispatchEvent(new CustomEvent("certificatesUpdated", { detail: data.certificates }))
        window.dispatchEvent(new CustomEvent("projectsUpdated", { detail: data.projects }))
        window.dispatchEvent(new CustomEvent("blogUpdated", { detail: data.blogPosts }))
      }
    } catch (error) {
      console.error("Error saving admin data:", error)
    }
  }

  // Get default data structure
  private static getDefaultData() {
    return {
      // Site Content
      siteContent: {
        home: {
          title: "Daghlar.",
          subtitle: "Computer Engineering Student",
          descriptions: ["Cybersecurity Expert", "Software Developer", "AI Enthusiast"],
          footer: "Nişantaşı University - Computer Engineering",
          cards: [
            {
              id: 1,
              title: "Software Development & AI",
              description: "I develop software, AI models, and work on cybersecurity",
              icon: "Sparkles",
              link: "/projects",
              isVisible: true,
            },
            {
              id: 2,
              title: "Open Source & Innovation",
              description: "I'm passionate about open-source projects and system development",
              icon: "Code",
              link: "/about",
              isVisible: true,
            },
            {
              id: 3,
              title: "Research & Writing",
              description: "Want to know more about my projects and research?",
              icon: "FileText",
              link: "/blog",
              isVisible: true,
            },
          ],
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

      // Security Settings
      security: {
        adminPassword: "#JysmN!iFC!*P^k9%W!*",
        maxLoginAttempts: 3,
        sessionTimeout: 3600000, // 1 hour
        enableLogging: true,
        enableBruteForceProtection: true,
        loginAttempts: {},
        lastLogin: null,
      },

      // Certificates with English categories
      certificates: [
        {
          id: 1,
          name: "Certified Ethical Hacker (CEH)",
          institution: "EC-Council",
          certificateId: "CEH-2024-001",
          issueDate: "2024-01-15",
          expiryDate: "2027-01-15",
          category: "CYBERSECURITY",
          subcategory: "Ethical Hacking & Pentest",
          verificationUrl: "https://cert.eccouncil.org/verify",
          certificateImageUrl: "/placeholder.svg?height=300&width=400&text=CEH+Certificate",
          description:
            "Advanced ethical hacking and penetration testing certification covering network security, web application security, and system hacking techniques.",
          skills: ["Penetration Testing", "Network Security", "Web Application Security", "System Hacking"],
          tags: ["exam_passed", "recognized", "hands-on"],
          isValid: true,
          isVisible: true,
          priority: 1,
        },
        {
          id: 2,
          name: "AWS Certified Security - Specialty",
          institution: "Amazon Web Services",
          certificateId: "AWS-SEC-2024-002",
          issueDate: "2024-02-20",
          expiryDate: "2027-02-20",
          category: "CLOUD COMPUTING & DEVOPS",
          subcategory: "AWS Certifications",
          verificationUrl: "https://aws.amazon.com/verification",
          certificateImageUrl: "/placeholder.svg?height=300&width=400&text=AWS+Security+Specialty",
          description:
            "Cloud security specialization for AWS infrastructure, covering identity and access management, data protection, and incident response.",
          skills: ["AWS Security", "Cloud Security", "IAM", "Data Protection"],
          tags: ["exam_passed", "recognized", "online"],
          isValid: true,
          isVisible: true,
          priority: 2,
        },
      ],

      // Projects
      projects: [
        {
          id: 1,
          title: "Custom Operating System",
          description:
            "Developed a lightweight, secure operating system with custom kernel optimizations and enhanced security features.",
          content: "Detailed project content here...",
          tags: ["System Development", "Rust", "C++"],
          githubUrl: "",
          demoUrl: "",
          status: "active",
          category: "System Development",
          isVisible: true,
          sortOrder: 1,
          createdAt: "2024-01-01",
        },
        {
          id: 2,
          title: "Custom Web Browser",
          description: "Built a privacy-focused web browser with enhanced security features and optimized performance.",
          content: "Detailed project content here...",
          tags: ["C++", "JavaScript", "Security"],
          githubUrl: "",
          demoUrl: "",
          status: "active",
          category: "Security",
          isVisible: true,
          sortOrder: 2,
          createdAt: "2024-01-02",
        },
      ],

      // Blog Posts
      blogPosts: [
        {
          id: 1,
          title: "Advanced Cybersecurity Techniques for Modern Applications",
          slug: "advanced-cybersecurity-techniques",
          excerpt:
            "Exploring cutting-edge security practices to protect applications from emerging threats and vulnerabilities.",
          content: "# Advanced Cybersecurity Techniques\n\nContent here...",
          category: "Cybersecurity",
          tags: ["Security", "Best Practices"],
          status: "published",
          readTime: 8,
          views: 0,
          isVisible: true,
          createdAt: "2024-07-15",
          updatedAt: "2024-07-15",
        },
      ],

      // Skills
      skills: {
        frontend: ["HTML", "CSS", "Tailwind CSS", "JavaScript", "TypeScript", "React", "Next.js"],
        backend: ["Node.js", "PostgreSQL", "MySQL", "MongoDB"],
        ai: ["Python", "AI/Machine Learning", "Rust", "Go", "C++"],
        security: [
          "Cyber Security",
          "AppSec",
          "Network Security",
          "OSINT",
          "Linux/Unix",
          "System Admin",
          "UX/UI Design",
        ],
      },

      // Social Links
      socialLinks: [
        { id: 1, name: "ProtonMail", url: "mailto:daghlar@protonmail.com", icon: "Mail", isActive: true },
        { id: 2, name: "Element", url: "https://matrix.to/#/@daghlar:matrix.org", icon: "Hash", isActive: true },
        { id: 3, name: "GitHub", url: "https://github.com/daghlar", icon: "Github", isActive: true },
        { id: 4, name: "Bluesky", url: "https://bsky.app/profile/daghlar.bsky.social", icon: "Zap", isActive: true },
      ],

      // Theme Settings
      theme: {
        primaryColor: "#FFFFFF",
        backgroundColor: "#000000",
        accentColor: "#3B82F6",
        borderColor: "rgba(255, 255, 255, 0.08)",
      },

      // Visitor Logs
      visitorLogs: [],

      // Images
      images: {},
    }
  }

  // Merge stored data with defaults
  private static mergeWithDefaults(storedData: any): any {
    const defaults = this.getDefaultData()
    return {
      ...defaults,
      ...storedData,
      siteContent: {
        ...defaults.siteContent,
        ...storedData.siteContent,
        home: {
          ...defaults.siteContent.home,
          ...storedData.siteContent?.home,
        },
        about: {
          ...defaults.siteContent.about,
          ...storedData.siteContent?.about,
        },
      },
      security: {
        ...defaults.security,
        ...storedData.security,
      },
      certificates: storedData.certificates || defaults.certificates,
      projects: storedData.projects || defaults.projects,
      blogPosts: storedData.blogPosts || defaults.blogPosts,
      skills: storedData.skills || defaults.skills,
      socialLinks: storedData.socialLinks || defaults.socialLinks,
    }
  }

  // Specific data getters/setters
  static getCertificates() {
    return this.getData().certificates || []
  }

  static saveCertificates(certificates: any[]) {
    const data = this.getData()
    data.certificates = certificates
    this.saveData(data)
  }

  static getProjects() {
    return this.getData().projects || []
  }

  static saveProjects(projects: any[]) {
    const data = this.getData()
    data.projects = projects
    this.saveData(data)
  }

  static getBlogPosts() {
    return this.getData().blogPosts || []
  }

  static saveBlogPosts(posts: any[]) {
    const data = this.getData()
    data.blogPosts = posts
    this.saveData(data)
  }

  static getSiteContent() {
    return this.getData().siteContent || {}
  }

  static saveSiteContent(content: any) {
    const data = this.getData()
    data.siteContent = content
    this.saveData(data)
  }

  static getHomeContent() {
    return this.getData().siteContent?.home || {}
  }

  static saveHomeContent(homeContent: any) {
    const data = this.getData()
    if (!data.siteContent) data.siteContent = {}
    data.siteContent.home = homeContent
    this.saveData(data)
  }

  static getVisitorLogs() {
    return this.getData().visitorLogs || []
  }

  static addVisitorLog(log: any) {
    const data = this.getData()
    if (!data.visitorLogs) data.visitorLogs = []
    data.visitorLogs.unshift({
      ...log,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    })
    if (data.visitorLogs.length > 1000) {
      data.visitorLogs = data.visitorLogs.slice(0, 1000)
    }
    this.saveData(data)
  }

  static generateId(): number {
    return Date.now() + Math.random()
  }
}
