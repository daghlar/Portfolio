"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Settings,
  FileText,
  Code,
  LogOut,
  Award,
  Plus,
  BarChart3,
  Wifi,
  Download,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  X,
  Search,
  Home,
  AlertTriangle,
} from "lucide-react"
import { AdminStorage } from "@/lib/admin-storage"

interface ComprehensiveAdminPanelProps {
  isLoggedIn: boolean
  onLogout: () => void
}

export function ComprehensiveAdminPanel({ isLoggedIn, onLogout }: ComprehensiveAdminPanelProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [data, setData] = useState<any>({})
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingType, setEditingType] = useState<string>("")
  const [showModal, setShowModal] = useState(false)
  const [realTimeStatus, setRealTimeStatus] = useState("connected")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Certificate categories
  const certificateCategories = [
    "CYBERSECURITY",
    "SOFTWARE DEVELOPMENT",
    "WEB TECHNOLOGIES",
    "ARTIFICIAL INTELLIGENCE & DATA SCIENCE",
    "CLOUD COMPUTING & DEVOPS",
    "HARDWARE & IOT",
    "ACADEMIC / GENERAL",
  ]

  // Available tags for certificates
  const availableTags = [
    { id: "online", label: "Online", color: "#3B82F6" },
    { id: "hands-on", label: "Hands-on", color: "#10B981" },
    { id: "certificate_of_completion", label: "Certificate of Completion", color: "#8B5CF6" },
    { id: "exam_passed", label: "Exam Passed", color: "#EF4444" },
    { id: "instructor_led", label: "Instructor Led", color: "#F59E0B" },
    { id: "selfpaced", label: "Self-paced", color: "#06B6D4" },
    { id: "openbadge", label: "Open Badge", color: "#84CC16" },
    { id: "recognized", label: "Industry Recognized", color: "#EC4899" },
  ]

  useEffect(() => {
    if (isLoggedIn) {
      initializeSystem()
    }
  }, [isLoggedIn])

  const initializeSystem = () => {
    loadData()
    setupConnectionMonitoring()
    setupRealTimeListeners()
  }

  const setupConnectionMonitoring = () => {
    const updateConnectionStatus = () => {
      setRealTimeStatus(navigator.onLine ? "connected" : "disconnected")
    }

    window.addEventListener("online", updateConnectionStatus)
    window.addEventListener("offline", updateConnectionStatus)
    updateConnectionStatus()
  }

  const setupRealTimeListeners = () => {
    const handleDataUpdate = () => {
      loadData()
    }

    window.addEventListener("adminDataUpdated", handleDataUpdate)
    AdminStorage.addListener(handleDataUpdate)

    return () => {
      window.removeEventListener("adminDataUpdated", handleDataUpdate)
    }
  }

  const loadData = () => {
    try {
      const adminData = AdminStorage.getData()
      setData(adminData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const saveData = (newData: any) => {
    try {
      AdminStorage.saveData(newData)
      setData(newData)
      showNotification("Data saved successfully!", "success")
    } catch (error) {
      console.error("Error saving data:", error)
      showNotification("Error saving data!", "error")
    }
  }

  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 z-[90] px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
      type === "success"
        ? "bg-green-600 text-white"
        : type === "error"
          ? "bg-red-600 text-white"
          : "bg-blue-600 text-white"
    }`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.opacity = "0"
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  // Certificate management
  const handleSaveCertificate = (certificate: any) => {
    const newData = { ...data }

    if (certificate.id && certificate.id !== 0) {
      // Update existing
      const index = newData.certificates.findIndex((c: any) => c.id === certificate.id)
      if (index !== -1) {
        newData.certificates[index] = {
          ...certificate,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      // Add new
      newData.certificates.push({
        ...certificate,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    saveData(newData)
    setShowModal(false)
    setEditingItem(null)
  }

  const handleDeleteCertificate = (id: number) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      const newData = { ...data }
      newData.certificates = newData.certificates.filter((c: any) => c.id !== id)
      saveData(newData)
    }
  }

  const toggleCertificateVisibility = (id: number) => {
    const newData = { ...data }
    const certificate = newData.certificates.find((c: any) => c.id === id)
    if (certificate) {
      certificate.isVisible = !certificate.isVisible
      certificate.updatedAt = new Date().toISOString()
      saveData(newData)
    }
  }

  // Project management
  const handleSaveProject = (project: any) => {
    const newData = { ...data }

    if (project.id && project.id !== 0) {
      // Update existing
      const index = newData.projects.findIndex((p: any) => p.id === project.id)
      if (index !== -1) {
        newData.projects[index] = {
          ...project,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      // Add new
      newData.projects.push({
        ...project,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    saveData(newData)
    setShowModal(false)
    setEditingItem(null)
  }

  const handleDeleteProject = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const newData = { ...data }
      newData.projects = newData.projects.filter((p: any) => p.id !== id)
      saveData(newData)
    }
  }

  const toggleProjectVisibility = (id: number) => {
    const newData = { ...data }
    const project = newData.projects.find((p: any) => p.id === id)
    if (project) {
      project.isVisible = !project.isVisible
      project.updatedAt = new Date().toISOString()
      saveData(newData)
    }
  }

  // Blog management
  const handleSaveBlogPost = (post: any) => {
    const newData = { ...data }

    if (post.id && post.id !== 0) {
      // Update existing
      const index = newData.blogPosts.findIndex((p: any) => p.id === post.id)
      if (index !== -1) {
        newData.blogPosts[index] = {
          ...post,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      // Add new
      newData.blogPosts.push({
        ...post,
        id: Date.now(),
        slug: post.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    saveData(newData)
    setShowModal(false)
    setEditingItem(null)
  }

  const handleDeleteBlogPost = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      const newData = { ...data }
      newData.blogPosts = newData.blogPosts.filter((p: any) => p.id !== id)
      saveData(newData)
    }
  }

  const toggleBlogPostVisibility = (id: number) => {
    const newData = { ...data }
    const post = newData.blogPosts.find((p: any) => p.id === id)
    if (post) {
      post.isVisible = !post.isVisible
      post.updatedAt = new Date().toISOString()
      saveData(newData)
    }
  }

  // Home content management
  const handleSaveHomeContent = (homeContent: any) => {
    const newData = { ...data }
    if (!newData.siteContent) newData.siteContent = {}
    newData.siteContent.home = homeContent
    saveData(newData)
    setShowModal(false)
    setEditingItem(null)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `daghlar-admin-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    showNotification("Data exported successfully!", "success")
  }

  const getFilteredItems = (items: any[], type: string) => {
    let filtered = items || []

    if (searchTerm) {
      filtered = filtered.filter((item: any) => {
        const searchableText =
          `${item.title || item.name || ""} ${item.description || ""} ${item.content || ""} ${item.institution || ""} ${item.category || ""}`.toLowerCase()
        return searchableText.includes(searchTerm.toLowerCase())
      })
    }

    if (selectedCategory !== "all" && type === "certificates") {
      filtered = filtered.filter((item: any) => item.category === selectedCategory)
    }

    return filtered
  }

  const getDashboardStats = () => {
    const certificates = data.certificates || []
    const projects = data.projects || []
    const blogPosts = data.blogPosts || []

    return {
      totalCertificates: certificates.length,
      visibleCertificates: certificates.filter((c: any) => c.isVisible).length,
      totalProjects: projects.length,
      visibleProjects: projects.filter((p: any) => p.isVisible).length,
      totalBlogPosts: blogPosts.length,
      publishedPosts: blogPosts.filter((p: any) => p.status === "published").length,
      expiringSoon: certificates.filter((c: any) => {
        if (!c.expiryDate) return false
        const expiry = new Date(c.expiryDate)
        const today = new Date()
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays <= 90 && diffDays > 0
      }).length,
    }
  }

  if (!isLoggedIn) return null

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "home", label: "Home Content", icon: Home },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "projects", label: "Projects", icon: Code },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const stats = getDashboardStats()

  return (
    <div className="fixed inset-0 z-[60] flex bg-black text-white font-mono">
      {/* Sidebar */}
      <div className="w-80 bg-black border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-800 border border-gray-700 text-white flex items-center justify-center font-bold text-lg rounded-lg">
              D
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <p className="text-sm text-gray-400">Real-time Content Management</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div
                className={`w-2 h-2 rounded-full ${
                  realTimeStatus === "connected" ? "bg-green-500 animate-pulse" : "bg-gray-600"
                }`}
              />
              <span>{realTimeStatus === "connected" ? "Real-time sync active" : "Offline"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className={`w-3 h-3 ${realTimeStatus === "connected" ? "text-green-500" : "text-gray-600"}`} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 font-mono rounded-lg ${
                    isActive ? "bg-white text-black font-bold" : "text-gray-300 hover:text-white hover:bg-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Button
            onClick={exportData}
            className="w-full bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 font-mono text-xs"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button
            onClick={onLogout}
            className="w-full bg-red-600 border border-red-500 text-white hover:bg-red-700 font-mono text-xs"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-black text-white">
        <div className="p-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">Dashboard Overview</h3>
                  <p className="text-gray-400 mt-2">Welcome back, Admin. Here's your portfolio overview.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    System Online
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Certificates</p>
                      <p className="text-2xl font-bold text-white">{stats.totalCertificates}</p>
                      <p className="text-xs text-green-400">{stats.visibleCertificates} visible</p>
                    </div>
                    <Award className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Projects</p>
                      <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
                      <p className="text-xs text-green-400">{stats.visibleProjects} visible</p>
                    </div>
                    <Code className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Blog Posts</p>
                      <p className="text-2xl font-bold text-white">{stats.totalBlogPosts}</p>
                      <p className="text-xs text-green-400">{stats.publishedPosts} published</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Expiring Soon</p>
                      <p className="text-2xl font-bold text-white">{stats.expiringSoon}</p>
                      <p className="text-xs text-orange-400">Next 90 days</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Home Content */}
          {activeTab === "home" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">Home Content Management</h3>
                  <p className="text-gray-400 mt-2">Manage your homepage content and layout</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem(data.siteContent?.home || {})
                    setEditingType("home")
                    setShowModal(true)
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700 font-mono font-bold"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Home Content
                </Button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Current Content</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Title</p>
                        <p className="text-white">{data.siteContent?.home?.title || "Daghlar."}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Subtitle</p>
                        <p className="text-white">
                          {data.siteContent?.home?.subtitle || "Computer Engineering Student"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Footer</p>
                        <p className="text-white">
                          {data.siteContent?.home?.footer || "Nişantaşı University - Computer Engineering"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Descriptions</h4>
                    <div className="space-y-2">
                      {(
                        data.siteContent?.home?.descriptions || [
                          "Cybersecurity Expert",
                          "Software Developer",
                          "AI Enthusiast",
                        ]
                      ).map((desc: string, index: number) => (
                        <p key={index} className="text-gray-300 text-sm">
                          • {desc}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Certificates */}
          {activeTab === "certificates" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">Certificates Management</h3>
                  <p className="text-gray-400 mt-2">Manage your professional certificates</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem({
                      id: 0,
                      name: "",
                      institution: "",
                      certificateId: "",
                      issueDate: "",
                      expiryDate: "",
                      category: "CYBERSECURITY",
                      subcategory: "",
                      verificationUrl: "",
                      description: "",
                      skills: [],
                      tags: [],
                      isValid: true,
                      isVisible: true,
                    })
                    setEditingType("certificate")
                    setShowModal(true)
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700 font-mono font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certificate
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {certificateCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Certificates List */}
              <div className="space-y-4">
                {getFilteredItems(data.certificates || [], "certificates").map((certificate: any) => (
                  <div key={certificate.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white">{certificate.name}</h4>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs">
                            {certificate.category}
                          </span>
                          {certificate.isVisible ? (
                            <Eye className="w-4 h-4 text-green-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{certificate.institution}</p>
                        <p className="text-gray-400 text-sm">
                          Issued: {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : "N/A"}
                          {certificate.expiryDate && (
                            <span> • Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          onClick={() => toggleCertificateVisibility(certificate.id)}
                          className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                        >
                          {certificate.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingItem(certificate)
                            setEditingType("certificate")
                            setShowModal(true)
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCertificate(certificate.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white"
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

          {/* Projects */}
          {activeTab === "projects" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">Projects Management</h3>
                  <p className="text-gray-400 mt-2">Manage your project portfolio</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem({
                      id: 0,
                      title: "",
                      description: "",
                      content: "",
                      tags: [],
                      githubUrl: "",
                      demoUrl: "",
                      status: "active",
                      category: "Development",
                      isVisible: true,
                    })
                    setEditingType("project")
                    setShowModal(true)
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700 font-mono font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                {getFilteredItems(data.projects || [], "projects").map((project: any) => (
                  <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white">{project.title}</h4>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-xs">
                            {project.status}
                          </span>
                          {project.isVisible ? (
                            <Eye className="w-4 h-4 text-green-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {(project.tags || []).map((tag: string, index: number) => (
                            <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          onClick={() => toggleProjectVisibility(project.id)}
                          className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                        >
                          {project.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingItem(project)
                            setEditingType("project")
                            setShowModal(true)
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white"
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

          {/* Blog */}
          {activeTab === "blog" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">Blog Management</h3>
                  <p className="text-gray-400 mt-2">Manage your blog posts and articles</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem({
                      id: 0,
                      title: "",
                      excerpt: "",
                      content: "",
                      category: "Technology",
                      tags: [],
                      status: "draft",
                      readTime: 5,
                      isVisible: true,
                    })
                    setEditingType("blog")
                    setShowModal(true)
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700 font-mono font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog Post
                </Button>
              </div>

              {/* Blog Posts List */}
              <div className="space-y-4">
                {getFilteredItems(data.blogPosts || [], "blog").map((post: any) => (
                  <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white">{post.title}</h4>
                          <span
                            className={`px-2 py-1 rounded-md text-xs ${
                              post.status === "published"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {post.status}
                          </span>
                          {post.isVisible ? (
                            <Eye className="w-4 h-4 text-green-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                        <p className="text-gray-400 text-xs">
                          Category: {post.category} • Read time: {post.readTime} min
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          onClick={() => toggleBlogPostVisibility(post.id)}
                          className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                        >
                          {post.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingItem(post)
                            setEditingType("blog")
                            setShowModal(true)
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteBlogPost(post.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white"
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

          {/* Settings */}
          {activeTab === "settings" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">Settings</h3>
                  <p className="text-gray-400 mt-2">Configure your admin panel and site settings</p>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-4">Security Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Admin Password</label>
                    <input
                      type="password"
                      value={data.security?.adminPassword || ""}
                      onChange={(e) => {
                        const newData = { ...data }
                        if (!newData.security) newData.security = {}
                        newData.security.adminPassword = e.target.value
                        saveData(newData)
                      }}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Max Login Attempts</label>
                    <input
                      type="number"
                      value={data.security?.maxLoginAttempts || 3}
                      onChange={(e) => {
                        const newData = { ...data }
                        if (!newData.security) newData.security = {}
                        newData.security.maxLoginAttempts = Number.parseInt(e.target.value)
                        saveData(newData)
                      }}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for editing items */}
      {showModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingType === "certificate" && "Certificate Editor"}
                {editingType === "project" && "Project Editor"}
                {editingType === "blog" && "Blog Post Editor"}
                {editingType === "home" && "Home Content Editor"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingItem(null)
                }}
                className="p-2 text-gray-400 hover:text-white transition-smooth"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Certificate Editor */}
            {editingType === "certificate" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Certificate Name *</label>
                    <input
                      type="text"
                      value={editingItem.name || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter certificate name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Institution *</label>
                    <input
                      type="text"
                      value={editingItem.institution || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter institution name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Certificate ID</label>
                    <input
                      type="text"
                      value={editingItem.certificateId || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, certificateId: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Certificate ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                    <select
                      value={editingItem.category || "CYBERSECURITY"}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {certificateCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Issue Date *</label>
                    <input
                      type="date"
                      value={editingItem.issueDate || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, issueDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={editingItem.expiryDate || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={editingItem.description || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Describe the certificate..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={editingItem.skills?.join(", ") || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        skills: e.target.value
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter((s: string) => s),
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter skills separated by commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Verification URL</label>
                  <input
                    type="url"
                    value={editingItem.verificationUrl || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, verificationUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingItem.isVisible || false}
                      onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-400">Visible on website</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingItem.isValid || false}
                      onChange={(e) => setEditingItem({ ...editingItem, isValid: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-400">Currently valid</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSaveCertificate(editingItem)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Certificate
                  </Button>
                </div>
              </div>
            )}

            {/* Project Editor */}
            {editingType === "project" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Project Title *</label>
                  <input
                    type="text"
                    value={editingItem.title || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
                  <textarea
                    value={editingItem.description || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Describe the project..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
                  <textarea
                    value={editingItem.content || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Detailed project content..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={editingItem.githubUrl || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Demo URL</label>
                    <input
                      type="url"
                      value={editingItem.demoUrl || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, demoUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://demo.example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editingItem.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tags: e.target.value
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter((s: string) => s),
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="React, Next.js, TypeScript"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      value={editingItem.status || "active"}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <input
                      type="text"
                      value={editingItem.category || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Development, Security, AI"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingItem.isVisible || false}
                      onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-400">Visible on website</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSaveProject(editingItem)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Project
                  </Button>
                </div>
              </div>
            )}

            {/* Blog Post Editor */}
            {editingType === "blog" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Blog Title *</label>
                  <input
                    type="text"
                    value={editingItem.title || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter blog post title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt *</label>
                  <textarea
                    value={editingItem.excerpt || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Brief description of the blog post..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Content *</label>
                  <textarea
                    value={editingItem.content || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                    rows={12}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Write your blog post content here... (Markdown supported)"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <input
                      type="text"
                      value={editingItem.category || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Technology, Security, AI"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      value={editingItem.status || "draft"}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Read Time (minutes)</label>
                    <input
                      type="number"
                      value={editingItem.readTime || 5}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, readTime: Number.parseInt(e.target.value) || 5 })
                      }
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editingItem.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tags: e.target.value
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter((s: string) => s),
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="security, tutorial, javascript"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingItem.isVisible || false}
                      onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-400">Visible on website</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSaveBlogPost(editingItem)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Blog Post
                  </Button>
                </div>
              </div>
            )}

            {/* Home Content Editor */}
            {editingType === "home" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                    <input
                      type="text"
                      value={editingItem.title || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Daghlar."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={editingItem.subtitle || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Computer Engineering Student"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Descriptions (one per line)</label>
                  <textarea
                    value={editingItem.descriptions?.join("\n") || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        descriptions: e.target.value.split("\n").filter((line: string) => line.trim()),
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Cybersecurity Expert&#10;Software Developer&#10;AI Enthusiast"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Footer Text</label>
                  <input
                    type="text"
                    value={editingItem.footer || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, footer: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Nişantaşı University - Computer Engineering"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSaveHomeContent(editingItem)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Home Content
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
