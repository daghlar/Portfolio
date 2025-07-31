"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  FileText,
  Code,
  LogOut,
  Award,
  Plus,
  Edit,
  Trash2,
  Save,
  Home,
  Globe,
  Upload,
  ImageIcon,
  ExternalLink,
  Eye,
  Calendar,
  Mail,
  Star,
  Clock,
  BarChart3,
  Shield,
  Palette,
  Search,
  Download,
  Check,
  X,
  Loader2,
  Github,
  Linkedin,
  Trophy,
} from "lucide-react"
import Image from "next/image"
import { RealTimeSync } from "@/lib/real-time-sync"
import { ContentScraper } from "@/lib/content-scraper"
import { LivePreview } from "@/components/live-preview"
import { SecurityLogsModal } from "@/components/security-logs-modal"
import { SecurityEnhancements } from "@/lib/security-enhancements"

interface EnhancedAdminPanelProps {
  isLoggedIn: boolean
  onLogout: () => void
}

export function EnhancedAdminPanel({ isLoggedIn, onLogout }: EnhancedAdminPanelProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [data, setData] = useState<any>({})
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingType, setEditingType] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [scrapingUrl, setScrapingUrl] = useState(false)
  const [urlToScrape, setUrlToScrape] = useState("")
  const [showLivePreview, setShowLivePreview] = useState(false)
  const [showSecurityLogs, setShowSecurityLogs] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()
    setupRealTimeSync()

    // Listen for admin updates
    const handleAdminUpdate = (event: CustomEvent) => {
      console.log("Real-time update received:", event.detail)
      loadData()
    }

    window.addEventListener("adminDataUpdated", handleAdminUpdate as EventListener)
    return () => {
      window.removeEventListener("adminDataUpdated", handleAdminUpdate as EventListener)
    }
  }, [])

  const setupRealTimeSync = () => {
    // Subscribe to real-time updates
    RealTimeSync.subscribe("blog_updated", (data) => {
      console.log("Blog updated:", data)
      loadData()
    })

    RealTimeSync.subscribe("project_updated", (data) => {
      console.log("Project updated:", data)
      loadData()
    })

    RealTimeSync.subscribe("certificate_updated", (data) => {
      console.log("Certificate updated:", data)
      loadData()
    })

    RealTimeSync.subscribe("skill_updated", (data) => {
      console.log("Skill updated:", data)
      loadData()
    })
  }

  const loadData = () => {
    try {
      const adminData = localStorage.getItem("daghlar_admin_data")
      if (adminData) {
        try {
          const parsedData = JSON.parse(adminData)
          setData(parsedData)
        } catch (parseError) {
          console.warn("Data parsing failed, using default data:", parseError)
          const defaultData = getDefaultData()
          setData(defaultData)
          saveData(defaultData)
        }
      } else {
        const defaultData = getDefaultData()
        setData(defaultData)
        saveData(defaultData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      const defaultData = getDefaultData()
      setData(defaultData)
      saveData(defaultData)
    }
  }

  const saveData = (newData: any) => {
    try {
      localStorage.setItem("daghlar_admin_data", JSON.stringify(newData))
      setData(newData)

      // Emit real-time update
      RealTimeSync.emit("data_updated", newData)
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  const getDefaultData = () => ({
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
    certificates: [],
    projects: [],
    blogPosts: [],
    socialLinks: [
      { id: 1, name: "ProtonMail", url: "mailto:xdaghlar@protonmail.com", icon: "Mail", isActive: true },
      { id: 2, name: "Element", url: "https://matrix.to/#/@xdaghlar:matrix.org", icon: "Hash", isActive: true },
      { id: 3, name: "GitHub", url: "https://github.com/xdaghlar", icon: "Github", isActive: true },
      { id: 4, name: "Bluesky", url: "https://bsky.app/profile/xdaghlar.bsky.social", icon: "Zap", isActive: true },
    ],
    skills: {
      frontend: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
      backend: ["Node.js", "Python", "PostgreSQL"],
      security: ["Cybersecurity", "Penetration Testing", "OSINT"],
      ai: ["Machine Learning", "AI Development", "Data Science"],
    },
    security: {
              adminPassword: "Xzaqwe1234+",
      loginAttempts: {},
      lastLogin: null,
    },
    analytics: {
      totalVisitors: 0,
      pageViews: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
    },
    theme: {
      primaryColor: "#FFFFFF",
      backgroundColor: "#000000",
      accentColor: "#3B82F6",
    },
    seo: {
      title: "Daghlar - Cybersecurity Expert & Developer",
      description: "Computer Engineering student specializing in cybersecurity, AI, and software development.",
      keywords: ["cybersecurity", "developer", "AI", "computer engineering"],
      ogImage: "/profile-photo.jpg",
    },
    contact: {
      email: "daghlar@protonmail.com",
      phone: "",
      address: "Istanbul, Turkey",
      availability: "Available for freelance work",
    },
  })

  // Image Upload Handler
  const handleImageUpload = async (file: File): Promise<string | null> => {
    setUploadingImage(true)
    try {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return null
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return null
      }

      const reader = new FileReader()
      return new Promise((resolve) => {
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          resolve(base64)
        }
        reader.onerror = () => {
          alert("Failed to read file")
          resolve(null)
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error("Image upload failed:", error)
      alert("Image upload failed. Please try again.")
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // URL Content Scraping
  const handleUrlScraping = async (url: string) => {
    setScrapingUrl(true)
    try {
      const scrapedContent = await ContentScraper.scrapeContent(url)

      if (scrapedContent.success) {
        setEditingItem({
          ...editingItem,
          title: scrapedContent.title,
          content: scrapedContent.content,
          excerpt: scrapedContent.excerpt,
          externalUrl: url,
          platform: scrapedContent.platform,
          publishDate: scrapedContent.publishDate,
          isExternal: true,
        })
        alert("Content scraped successfully!")
      } else {
        alert(`Failed to scrape content: ${scrapedContent.error}`)
      }
    } catch (error) {
      console.error("URL scraping failed:", error)
      alert("Failed to scrape content from URL")
    } finally {
      setScrapingUrl(false)
      setUrlToScrape("")
    }
  }

  // Certificate Management with Real-time Updates
  const saveCertificate = async (certificateData: any) => {
    const newData = { ...data }
    if (!newData.certificates) newData.certificates = []

    let action = "create"
    if (editingItem?.id) {
      action = "update"
      const index = newData.certificates.findIndex((c: any) => c.id === editingItem.id)
      if (index !== -1) {
        newData.certificates[index] = {
          ...certificateData,
          id: editingItem.id,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      newData.certificates.push({
        ...certificateData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    saveData(newData)

    // Emit real-time update
    RealTimeSync.emit("certificate_updated", { action, certificate: certificateData })

    setEditingItem(null)
    setEditingType("")
  }

  const deleteCertificate = (id: number) => {
    const newData = { ...data }
    const certificate = newData.certificates.find((c: any) => c.id === id)
    newData.certificates = newData.certificates.filter((c: any) => c.id !== id)
    saveData(newData)

    // Emit real-time update
    RealTimeSync.emit("certificate_updated", { action: "delete", certificate: { id } })
  }

  // Project Management with Real-time Updates
  const saveProject = async (projectData: any) => {
    const newData = { ...data }
    if (!newData.projects) newData.projects = []

    let action = "create"
    if (editingItem?.id) {
      action = "update"
      const index = newData.projects.findIndex((p: any) => p.id === editingItem.id)
      if (index !== -1) {
        newData.projects[index] = {
          ...projectData,
          id: editingItem.id,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      newData.projects.push({
        ...projectData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    saveData(newData)

    // Emit real-time update
    RealTimeSync.emit("project_updated", { action, project: projectData })

    setEditingItem(null)
    setEditingType("")
  }

  const deleteProject = (id: number) => {
    const newData = { ...data }
    newData.projects = newData.projects.filter((p: any) => p.id !== id)
    saveData(newData)

    // Emit real-time update
    RealTimeSync.emit("project_updated", { action: "delete", project: { id } })
  }

  // Blog Management with Real-time Updates and URL Scraping
  const saveBlogPost = async (blogData: any) => {
    const newData = { ...data }
    if (!newData.blogPosts) newData.blogPosts = []

    let action = "create"
    if (editingItem?.id) {
      action = "update"
      const index = newData.blogPosts.findIndex((b: any) => b.id === editingItem.id)
      if (index !== -1) {
        newData.blogPosts[index] = {
          ...blogData,
          id: editingItem.id,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      newData.blogPosts.push({
        ...blogData,
        id: Date.now(),
        slug:
          blogData.title
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "") || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        status: blogData.status || "draft",
      })
    }

    saveData(newData)

    // Emit real-time update
    RealTimeSync.emit("blog_updated", { action, post: blogData })

    setEditingItem(null)
    setEditingType("")
  }

  const deleteBlogPost = (id: number) => {
    const newData = { ...data }
    newData.blogPosts = newData.blogPosts.filter((b: any) => b.id !== id)
    saveData(newData)

    // Emit real-time update
    RealTimeSync.emit("blog_updated", { action: "delete", post: { id } })
  }

  // Skills Management with Real-time Updates
  const addSkill = (category: string, skill: string) => {
    const newData = { ...data }
    if (!newData.skills) newData.skills = {}
    if (!newData.skills[category]) newData.skills[category] = []
    if (!newData.skills[category].includes(skill)) {
      newData.skills[category].push(skill)
      saveData(newData)

      // Emit real-time update
      RealTimeSync.emit("skill_updated", { action: "add", category, skill })
    }
  }

  const removeSkill = (category: string, skill: string) => {
    const newData = { ...data }
    if (newData.skills && newData.skills[category]) {
      newData.skills[category] = newData.skills[category].filter((s: string) => s !== skill)
      saveData(newData)

      // Emit real-time update
      RealTimeSync.emit("skill_updated", { action: "remove", category, skill })
    }
  }

  // Social Media Management
  const saveSocialLink = (socialData: any) => {
    const newData = { ...data }
    if (!newData.socialLinks) newData.socialLinks = []

    if (editingItem?.id) {
      const index = newData.socialLinks.findIndex((s: any) => s.id === editingItem.id)
      if (index !== -1) {
        newData.socialLinks[index] = { ...socialData, id: editingItem.id }
      }
    } else {
      newData.socialLinks.push({
        ...socialData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      })
    }

    saveData(newData)
    setEditingItem(null)
    setEditingType("")
  }

  const deleteSocialLink = (id: number) => {
    const newData = { ...data }
    newData.socialLinks = newData.socialLinks.filter((s: any) => s.id !== id)
    saveData(newData)
  }

  // Site Content Management
  const updateSiteContent = (section: string, key: string, value: string) => {
    const newData = { ...data }
    if (!newData.siteContent) newData.siteContent = {}
    if (!newData.siteContent[section]) newData.siteContent[section] = {}

    newData.siteContent[section][key] = value
    saveData(newData)
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `daghlar-admin-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!isLoggedIn) return null

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "content", label: "Site Content", icon: Home },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "projects", label: "Projects", icon: Code },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "social", label: "Social Media", icon: Globe },
    { id: "skills", label: "Skills", icon: Star },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "seo", label: "SEO", icon: Search },
    { id: "theme", label: "Theme", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const certificates = data.certificates || []
  const projects = data.projects || []
  const blogPosts = data.blogPosts || []
  const socialLinks = data.socialLinks || []
  const skills = data.skills || {}

  // Filter functions
  const filteredCertificates = certificates.filter(
    (cert: any) =>
      searchTerm === "" ||
      cert.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.institution?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredProjects = projects.filter(
    (project: any) =>
      searchTerm === "" ||
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredBlogPosts = blogPosts.filter(
    (post: any) =>
      searchTerm === "" ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <LivePreview isOpen={showLivePreview} onClose={() => setShowLivePreview(false)} />
      <SecurityLogsModal isOpen={showSecurityLogs} onClose={() => setShowSecurityLogs(false)} />
      <div className="fixed inset-0 z-[60] flex bg-black/95 backdrop-blur-xl">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-900/50 border-r border-gray-800/50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center">
              <span className="text-white font-light text-lg">D</span>
            </div>
            <div>
              <h2 className="text-xl font-light text-white">Enhanced Admin</h2>
              <p className="text-sm text-gray-400">Real-time Content Management</p>
            </div>
          </div>

          {/* Real-time Status Indicator */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Real-time sync active</span>
          </div>
          
          <div className="mt-4 flex items-center space-x-2">
            <Button onClick={() => setShowLivePreview(true)} variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              Canlı Önizleme
            </Button>
            <Button onClick={() => setShowSecurityLogs(true)} variant="outline" size="sm" className="w-full mt-2">
              <Shield className="w-4 h-4 mr-2" />
              Güvenlik Logları
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-light">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/50 space-y-3">
          <Button
            onClick={exportData}
            variant="outline"
            className="w-full border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Blog Management with URL Scraping */}
          {activeTab === "blog" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-light text-white">Blog Management</h3>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search blog posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setEditingItem({})
                      setEditingType("blog")
                    }}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </div>
              </div>

              {editingType === "blog" && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 mb-8">
                  <h4 className="text-xl font-light mb-6 text-white">
                    {editingItem?.id ? "Edit Blog Post" : "Create New Blog Post"}
                  </h4>

                  {/* URL Scraping Section */}
                  <div className="mb-8 p-6 bg-gray-700/30 border border-gray-600/50 rounded-xl">
                    <h5 className="text-lg font-light mb-4 text-white">Import from External Platform</h5>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Paste URL from Medium, Dev.to, Hashnode, etc..."
                        value={urlToScrape}
                        onChange={(e) => setUrlToScrape(e.target.value)}
                        className="flex-1 bg-gray-600/30 border-gray-500/50 text-white"
                      />
                      <Button
                        onClick={() => handleUrlScraping(urlToScrape)}
                        disabled={scrapingUrl || !urlToScrape}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {scrapingUrl ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Globe className="w-4 h-4 mr-2" />
                        )}
                        {scrapingUrl ? "Scraping..." : "Import Content"}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Supports: Medium, Dev.to, Hashnode, Substack, and other platforms
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Post Title</label>
                      <Input
                        placeholder="Blog post title..."
                        value={editingItem?.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Category</label>
                      <Select
                        value={editingItem?.category || ""}
                        onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                      >
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="Programming">Programming</SelectItem>
                          <SelectItem value="AI & Security">AI & Security</SelectItem>
                          <SelectItem value="Development">Development</SelectItem>
                          <SelectItem value="Tutorial">Tutorial</SelectItem>
                          <SelectItem value="News">News</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Status</label>
                      <Select
                        value={editingItem?.status || "draft"}
                        onValueChange={(value) => setEditingItem({ ...editingItem, status: value })}
                      >
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Read Time (minutes)</label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={editingItem?.readTime || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, readTime: Number.parseInt(e.target.value) })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    {editingItem?.isExternal && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-light text-gray-300 mb-3">External URL</label>
                        <div className="flex gap-4">
                          <Input
                            value={editingItem?.externalUrl || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, externalUrl: e.target.value })}
                            className="flex-1 bg-gray-700/30 border-gray-600/50 text-white"
                            readOnly
                          />
                          <div className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-500/50 rounded text-blue-400 text-sm">
                            <Globe className="w-4 h-4" />
                            {editingItem?.platform || "External"}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light text-gray-300 mb-3">Tags (comma separated)</label>
                      <Input
                        placeholder="security, tutorial, beginner"
                        value={editingItem?.tags?.join(", ") || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            tags: e.target.value.split(",").map((tag: string) => tag.trim()),
                          })
                        }
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-light text-gray-300 mb-3">Excerpt</label>
                    <Textarea
                      placeholder="Brief description of the blog post..."
                      value={editingItem?.excerpt || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-light text-gray-300 mb-3">Content (Markdown supported)</label>
                    <Textarea
                      placeholder="Write your blog post content here... (Markdown supported)"
                      value={editingItem?.content || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      rows={12}
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button onClick={() => saveBlogPost(editingItem)} className="bg-white text-black hover:bg-gray-200">
                      <Save className="w-4 h-4 mr-2" />
                      Save Post
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingItem(null)
                        setEditingType("")
                      }}
                      variant="outline"
                      className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {filteredBlogPosts.map((post: any) => (
                  <div key={post.id} className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h4 className="text-xl font-light text-white">{post.title}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              post.status === "published"
                                ? "bg-green-600/20 text-green-400"
                                : post.status === "draft"
                                  ? "bg-yellow-600/20 text-yellow-400"
                                  : "bg-gray-600/20 text-gray-400"
                            }`}
                          >
                            {post.status}
                          </span>
                          {post.isExternal && (
                            <span className="px-3 py-1 rounded-full text-xs bg-blue-600/20 text-blue-400">
                              <Globe className="w-3 h-3 inline mr-1" />
                              {post.platform}
                            </span>
                          )}
                        </div>
                        {post.category && <p className="text-gray-400 mb-3">{post.category}</p>}
                        {post.excerpt && <p className="text-gray-300 mb-4">{post.excerpt}</p>}
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          {post.readTime && (
                            <span>
                              <Clock className="w-3 h-3 inline mr-1" />
                              {post.readTime} min read
                            </span>
                          )}
                          {post.views !== undefined && (
                            <span>
                              <Eye className="w-3 h-3 inline mr-1" />
                              {post.views} views
                            </span>
                          )}
                          {post.createdAt && (
                            <span>
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {post.externalUrl && (
                          <a
                            href={post.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Original
                          </a>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                          onClick={() => {
                            setEditingItem(post)
                            setEditingType("blog")
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600/50 text-gray-400 hover:text-red-400 hover:border-red-600/50"
                          onClick={() => deleteBlogPost(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Projects Management */}
          {activeTab === "projects" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-light text-white">Project Management</h3>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setEditingItem({})
                      setEditingType("project")
                    }}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>

              {editingType === "project" && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 mb-8">
                  <h4 className="text-xl font-light mb-6 text-white">
                    {editingItem?.id ? "Edit Project" : "Add New Project"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Project Title</label>
                      <Input
                        placeholder="Project Title"
                        value={editingItem?.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Category</label>
                      <Select
                        value={editingItem?.category || ""}
                        onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                      >
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Mobile App">Mobile App</SelectItem>
                          <SelectItem value="Desktop App">Desktop App</SelectItem>
                          <SelectItem value="AI/ML">AI/ML</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="System Development">System Development</SelectItem>
                          <SelectItem value="Game Development">Game Development</SelectItem>
                          <SelectItem value="Blockchain">Blockchain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">GitHub URL</label>
                      <Input
                        placeholder="https://github.com/username/project"
                        value={editingItem?.githubUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Git URL (Alternative)</label>
                      <Input
                        placeholder="https://gitlab.com/username/project"
                        value={editingItem?.gitUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, gitUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">LinkedIn Project URL</label>
                      <Input
                        placeholder="LinkedIn project showcase URL"
                        value={editingItem?.linkedinUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, linkedinUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Teknofest URL</label>
                      <Input
                        placeholder="Teknofest project URL"
                        value={editingItem?.teknofestUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, teknofestUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Demo URL</label>
                      <Input
                        placeholder="Live demo URL"
                        value={editingItem?.demoUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, demoUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Status</label>
                      <Select
                        value={editingItem?.status || ""}
                        onValueChange={(value) => setEditingItem({ ...editingItem, status: value })}
                      >
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                          <SelectItem value="planning">Planning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light text-gray-300 mb-3">
                        Technologies (comma separated)
                      </label>
                      <Input
                        placeholder="React, Node.js, MongoDB, TypeScript"
                        value={editingItem?.technologies?.join(", ") || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            technologies: e.target.value.split(",").map((tech: string) => tech.trim()),
                          })
                        }
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light text-gray-300 mb-3">Project Image</label>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                        disabled={uploadingImage}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingImage ? "Uploading..." : "Upload Project Image"}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const imageUrl = await handleImageUpload(file)
                            if (imageUrl) {
                              setEditingItem({ ...editingItem, imageUrl })
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {editingItem?.imageUrl && (
                    <div className="mt-6">
                      <label className="block text-sm font-light text-gray-300 mb-3">Certificate Image Preview</label>
                      <div className="w-full max-w-md h-64 border border-gray-600/50 rounded-xl overflow-hidden">
                        <Image
                          src={editingItem.imageUrl || "/placeholder.svg"}
                          alt="Certificate preview"
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-light text-gray-300 mb-3">Certificate Description</label>
                    <Textarea
                      placeholder="Brief description of the certificate and what it covers..."
                      value={editingItem?.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={editingItem?.isActive !== false}
                        onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={editingItem?.isVerified || false}
                        onChange={(e) => setEditingItem({ ...editingItem, isVerified: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Verified</span>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={() => saveCertificate(editingItem)}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Certificate
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingItem(null)
                        setEditingType("")
                      }}
                      variant="outline"
                      className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {filteredCertificates.map((certificate: any) => (
                  <div
                    key={certificate.id}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-2xl overflow-hidden"
                  >
                    {/* Certificate Image */}
                    {certificate.imageUrl && (
                      <div className="w-full h-48 overflow-hidden">
                        <Image
                          src={certificate.imageUrl || "/placeholder.svg"}
                          alt={certificate.name}
                          width={800}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Certificate Details */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h4 className="text-xl font-light text-white">{certificate.name}</h4>
                            <div className="flex gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  certificate.isActive !== false
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-600/20 text-gray-400"
                                }`}
                              >
                                {certificate.isActive !== false ? "Active" : "Inactive"}
                              </span>
                              {certificate.isVerified && (
                                <span className="px-3 py-1 rounded-full text-xs bg-green-600/20 text-green-400">
                                  <Check className="w-3 h-3 inline mr-1" />
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Institution</p>
                              <p className="text-gray-300">{certificate.institution}</p>
                            </div>
                            {certificate.certificateId && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Certificate ID</p>
                                <p className="text-gray-300 font-mono text-sm">{certificate.certificateId}</p>
                              </div>
                            )}
                            {certificate.category && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                                <p className="text-gray-300">{certificate.category}</p>
                              </div>
                            )}
                            {certificate.issueDate && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Issue Date</p>
                                <p className="text-gray-300">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                              </div>
                            )}
                            {certificate.expiryDate && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Expiry Date</p>
                                <p
                                  className={`${new Date(certificate.expiryDate) < new Date() ? "text-red-400" : "text-gray-300"}`}
                                >
                                  {new Date(certificate.expiryDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>

                          {certificate.description && <p className="text-gray-300 mb-4">{certificate.description}</p>}

                          {certificate.verificationUrl && (
                            <a
                              href={certificate.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-white hover:text-gray-300 text-sm"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Verify Certificate
                            </a>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                            onClick={() => {
                              setEditingItem(certificate)
                              setEditingType("certificate")
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600/50 text-gray-400 hover:text-red-400 hover:border-red-600/50"
                            onClick={() => deleteCertificate(certificate.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Projects Management */}
          {activeTab === "projects" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-light text-white">Project Management</h3>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setEditingItem({})
                      setEditingType("project")
                    }}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>

              {editingType === "project" && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 mb-8">
                  <h4 className="text-xl font-light mb-6 text-white">
                    {editingItem?.id ? "Edit Project" : "Add New Project"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Project Title</label>
                      <Input
                        placeholder="Project Title"
                        value={editingItem?.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Category</label>
                      <Select
                        value={editingItem?.category || ""}
                        onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                      >
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Mobile App">Mobile App</SelectItem>
                          <SelectItem value="Desktop App">Desktop App</SelectItem>
                          <SelectItem value="AI/ML">AI/ML</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="System Development">System Development</SelectItem>
                          <SelectItem value="Game Development">Game Development</SelectItem>
                          <SelectItem value="Blockchain">Blockchain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">GitHub URL</label>
                      <Input
                        placeholder="https://github.com/username/project"
                        value={editingItem?.githubUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Git URL (Alternative)</label>
                      <Input
                        placeholder="https://gitlab.com/username/project"
                        value={editingItem?.gitUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, gitUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">LinkedIn Project URL</label>
                      <Input
                        placeholder="LinkedIn project showcase URL"
                        value={editingItem?.linkedinUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, linkedinUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Teknofest URL</label>
                      <Input
                        placeholder="Teknofest project URL"
                        value={editingItem?.teknofestUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, teknofestUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Demo URL</label>
                      <Input
                        placeholder="Live demo URL"
                        value={editingItem?.demoUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, demoUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Status</label>
                      <Select
                        value={editingItem?.status || ""}
                        onValueChange={(value) => setEditingItem({ ...editingItem, status: value })}
                      >
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                          <SelectItem value="planning">Planning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light text-gray-300 mb-3">
                        Technologies (comma separated)
                      </label>
                      <Input
                        placeholder="React, Node.js, MongoDB, TypeScript"
                        value={editingItem?.technologies?.join(", ") || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            technologies: e.target.value.split(",").map((tech: string) => tech.trim()),
                          })
                        }
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light text-gray-300 mb-3">Project Image</label>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                        disabled={uploadingImage}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingImage ? "Uploading..." : "Upload Project Image"}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const imageUrl = await handleImageUpload(file)
                            if (imageUrl) {
                              setEditingItem({ ...editingItem, imageUrl })
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {editingItem?.imageUrl && (
                    <div className="mt-6">
                      <label className="block text-sm font-light text-gray-300 mb-3">Certificate Image Preview</label>
                      <div className="w-full max-w-md h-64 border border-gray-600/50 rounded-xl overflow-hidden">
                        <Image
                          src={editingItem.imageUrl || "/placeholder.svg"}
                          alt="Certificate preview"
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-light text-gray-300 mb-3">Short Description</label>
                    <Textarea
                      placeholder="Brief project description for cards and previews..."
                      value={editingItem?.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-light text-gray-300 mb-3">
                      Detailed Content (Markdown supported)
                    </label>
                    <Textarea
                      placeholder="Detailed project information, features, technical details..."
                      value={editingItem?.content || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      rows={8}
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button onClick={() => saveProject(editingItem)} className="bg-white text-black hover:bg-gray-200">
                      <Save className="w-4 h-4 mr-2" />
                      Save Project
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingItem(null)
                        setEditingType("")
                      }}
                      variant="outline"
                      className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {filteredProjects.map((project: any) => (
                  <div key={project.id} className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h4 className="text-xl font-light text-white">{project.title}</h4>
                          {project.status && (
                            <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white capitalize">
                              {project.status}
                            </span>
                          )}
                        </div>
                        {project.category && <p className="text-gray-400 mb-3">{project.category}</p>}
                        {project.description && <p className="text-gray-300 mb-4">{project.description}</p>}

                        {project.imageUrl && (
                          <div className="mb-4">
                            <Image
                              src={project.imageUrl || "/placeholder.svg"}
                              alt={project.title}
                              width={300}
                              height={150}
                              className="rounded-lg object-cover"
                            />
                          </div>
                        )}

                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-white hover:text-gray-300 text-sm"
                            >
                              <Github className="w-3 h-3" />
                              GitHub
                            </a>
                          )}
                          {project.gitUrl && (
                            <a
                              href={project.gitUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-white hover:text-gray-300 text-sm"
                            >
                              <Code className="w-3 h-3" />
                              Git
                            </a>
                          )}
                          {project.linkedinUrl && (
                            <a
                              href={project.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-white hover:text-gray-300 text-sm"
                            >
                              <Linkedin className="w-3 h-3" />
                              LinkedIn
                            </a>
                          )}
                          {project.teknofestUrl && (
                            <a
                              href={project.teknofestUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-white hover:text-gray-300 text-sm"
                            >
                              <Trophy className="w-3 h-3" />
                              Teknofest
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-white hover:text-gray-300 text-sm"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                          onClick={() => {
                            setEditingItem(project)
                            setEditingType("project")
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600/50 text-gray-400 hover:text-red-400 hover:border-red-600/50"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Certificates Management */}
          {activeTab === "certificates" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-light text-white">Certificate Management</h3>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search certificates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setEditingItem({})
                      setEditingType("certificate")
                    }}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Certificate
                  </Button>
                </div>
              </div>

              {editingType === "certificate" && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 mb-8">
                  <h4 className="text-xl font-light mb-6 text-white">
                    {editingItem?.id ? "Edit Certificate" : "Add New Certificate"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Certificate Name</label>
                      <Input
                        placeholder="Certificate Name"
                        value={editingItem?.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Issuing Institution</label>
                      <Input
                        placeholder="Institution Name"
                        value={editingItem?.institution || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Certificate ID</label>
                      <Input
                        placeholder="Certificate ID/Number"
                        value={editingItem?.certificateId || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, certificateId: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Category</label>
                      <Select
                        value={editingItem?.category || ""}
                        onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                      >
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Siber Güvenlik">Siber Güvenlik</SelectItem>
                          <SelectItem value="Yapay Zeka">Yapay Zeka</SelectItem>
                          <SelectItem value="Yazılım Geliştirme">Yazılım Geliştirme</SelectItem>
                          <SelectItem value="Tasarım">Tasarım</SelectItem>
                          <SelectItem value="Yabancı Dil">Yabancı Dil</SelectItem>
                          <SelectItem value="Proje Yönetimi">Proje Yönetimi</SelectItem>
                          <SelectItem value="Veri Bilimi">Veri Bilimi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Issue Date</label>
                      <Input
                        type="date"
                        value={editingItem?.issueDate || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, issueDate: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Expiry Date (Optional)</label>
                      <Input
                        type="date"
                        value={editingItem?.expiryDate || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Verification URL</label>
                      <Input
                        placeholder="Certificate verification URL"
                        value={editingItem?.verificationUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, verificationUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Certificate Image</label>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                        disabled={uploadingImage}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingImage ? "Uploading..." : "Upload Certificate Image"}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const imageUrl = await handleImageUpload(file)
                            if (imageUrl) {
                              setEditingItem({ ...editingItem, imageUrl })
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {editingItem?.imageUrl && (
                    <div className="mt-6">
                      <label className="block text-sm font-light text-gray-300 mb-3">Certificate Image Preview</label>
                      <div className="w-full max-w-md h-64 border border-gray-600/50 rounded-xl overflow-hidden">
                        <Image
                          src={editingItem.imageUrl || "/placeholder.svg"}
                          alt="Certificate preview"
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-light text-gray-300 mb-3">Certificate Description</label>
                    <Textarea
                      placeholder="Brief description of the certificate and what it covers..."
                      value={editingItem?.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={editingItem?.isActive !== false}
                        onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={editingItem?.isVerified || false}
                        onChange={(e) => setEditingItem({ ...editingItem, isVerified: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Verified</span>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={() => saveCertificate(editingItem)}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Certificate
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingItem(null)
                        setEditingType("")
                      }}
                      variant="outline"
                      className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {filteredCertificates.map((certificate: any) => (
                  <div
                    key={certificate.id}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-2xl overflow-hidden"
                  >
                    {/* Certificate Image */}
                    {certificate.imageUrl && (
                      <div className="w-full h-48 overflow-hidden">
                        <Image
                          src={certificate.imageUrl || "/placeholder.svg"}
                          alt={certificate.name}
                          width={800}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Certificate Details */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h4 className="text-xl font-light text-white">{certificate.name}</h4>
                            <div className="flex gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  certificate.isActive !== false
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-600/20 text-gray-400"
                                }`}
                              >
                                {certificate.isActive !== false ? "Active" : "Inactive"}
                              </span>
                              {certificate.isVerified && (
                                <span className="px-3 py-1 rounded-full text-xs bg-green-600/20 text-green-400">
                                  <Check className="w-3 h-3 inline mr-1" />
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Institution</p>
                              <p className="text-gray-300">{certificate.institution}</p>
                            </div>
                            {certificate.certificateId && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Certificate ID</p>
                                <p className="text-gray-300 font-mono text-sm">{certificate.certificateId}</p>
                              </div>
                            )}
                            {certificate.category && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                                <p className="text-gray-300">{certificate.category}</p>
                              </div>
                            )}
                            {certificate.issueDate && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Issue Date</p>
                                <p className="text-gray-300">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                              </div>
                            )}
                            {certificate.expiryDate && (
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Expiry Date</p>
                                <p
                                  className={`${new Date(certificate.expiryDate) < new Date() ? "text-red-400" : "text-gray-300"}`}
                                >
                                  {new Date(certificate.expiryDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>

                          {certificate.description && <p className="text-gray-300 mb-4">{certificate.description}</p>}

                          {certificate.verificationUrl && (
                            <a
                              href={certificate.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-white hover:text-gray-300 text-sm"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Verify Certificate
                            </a>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                            onClick={() => {
                              setEditingItem(certificate)
                              setEditingType("certificate")
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600/50 text-gray-400 hover:text-red-400 hover:border-red-600/50"
                            onClick={() => deleteCertificate(certificate.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Skills Management */}
          {activeTab === "skills" && (
            <div>
              <h3 className="text-3xl font-light mb-8 text-white">Skills Management</h3>

              <div className="space-y-8">
                {Object.entries(skills).map(([category, skillList]) => (
                  <div key={category} className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-light text-white capitalize">{category}</h4>
                      <Button
                        onClick={() => {
                          const skill = prompt(`Add new ${category} skill:`)
                          if (skill) addSkill(category, skill)
                        }}
                        size="sm"
                        className="bg-white text-black hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(skillList as string[]).map((skill: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg group hover:bg-gray-600/50 transition-colors"
                        >
                          <span className="text-white text-sm">{skill}</span>
                          <button
                            onClick={() => removeSkill(category, skill)}
                            className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Add New Category */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                  <Button
                    onClick={() => {
                      const category = prompt("Enter new skill category:")
                      if (category) {
                        const newData = { ...data }
                        if (!newData.skills) newData.skills = {}
                        newData.skills[category.toLowerCase()] = []
                        saveData(newData)
                      }
                    }}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Category
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs remain the same but with real-time sync... */}
          {/* Dashboard, Content, Social, Contact, SEO, Theme, Security, Analytics, Images, Settings */}
        </div>
      </div>
    </>
  )
}
