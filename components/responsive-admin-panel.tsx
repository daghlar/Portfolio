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
  EyeOff,
  Calendar,
  User,
  Mail,
  Link,
  Star,
  Clock,
  BarChart3,
  Shield,
  Palette,
  Search,
  Download,
  Copy,
  Check,
  X,
} from "lucide-react"
import Image from "next/image"
import { LivePreview } from "@/components/live-preview"
import { SecurityLogsModal } from "@/components/security-logs-modal"
import { SecurityEnhancements } from "@/lib/security-enhancements"

interface ResponsiveAdminPanelProps {
  isLoggedIn: boolean
  onLogout: () => void
}

export function ResponsiveAdminPanel({ isLoggedIn, onLogout }: ResponsiveAdminPanelProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [data, setData] = useState<any>({})
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingType, setEditingType] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showLivePreview, setShowLivePreview] = useState(false)
  const [showSecurityLogs, setShowSecurityLogs] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()

    // Listen for admin updates
    const handleAdminUpdate = () => {
      loadData()
    }

    window.addEventListener("adminDataUpdated", handleAdminUpdate)
    return () => window.removeEventListener("adminDataUpdated", handleAdminUpdate)
  }, [])

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
      window.dispatchEvent(new Event("adminDataUpdated"))
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

  // Certificate Management
  const saveCertificate = async (certificateData: any) => {
    const newData = { ...data }
    if (!newData.certificates) newData.certificates = []

    if (editingItem?.id) {
      const index = newData.certificates.findIndex((c: any) => c.id === editingItem.id)
      if (index !== -1) {
        newData.certificates[index] = { ...certificateData, id: editingItem.id, updatedAt: new Date().toISOString() }
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
    setEditingItem(null)
    setEditingType("")
  }

  const deleteCertificate = (id: number) => {
    const newData = { ...data }
    newData.certificates = newData.certificates.filter((c: any) => c.id !== id)
    saveData(newData)
  }

  // Project Management
  const saveProject = async (projectData: any) => {
    const newData = { ...data }
    if (!newData.projects) newData.projects = []

    if (editingItem?.id) {
      const index = newData.projects.findIndex((p: any) => p.id === editingItem.id)
      if (index !== -1) {
        newData.projects[index] = { ...projectData, id: editingItem.id, updatedAt: new Date().toISOString() }
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
    setEditingItem(null)
    setEditingType("")
  }

  const deleteProject = (id: number) => {
    const newData = { ...data }
    newData.projects = newData.projects.filter((p: any) => p.id !== id)
    saveData(newData)
  }

  // Blog Management
  const saveBlogPost = async (blogData: any) => {
    const newData = { ...data }
    if (!newData.blogPosts) newData.blogPosts = []

    if (editingItem?.id) {
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
        status: "draft",
      })
    }

    saveData(newData)
    setEditingItem(null)
    setEditingType("")
  }

  const deleteBlogPost = (id: number) => {
    const newData = { ...data }
    newData.blogPosts = newData.blogPosts.filter((b: any) => b.id !== id)
    saveData(newData)
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

  // Skills Management
  const saveSkill = (category: string, skills: string[]) => {
    const newData = { ...data }
    if (!newData.skills) newData.skills = {}
    newData.skills[category] = skills
    saveData(newData)
  }

  const addSkill = (category: string, skill: string) => {
    const newData = { ...data }
    if (!newData.skills) newData.skills = {}
    if (!newData.skills[category]) newData.skills[category] = []
    if (!newData.skills[category].includes(skill)) {
      newData.skills[category].push(skill)
      saveData(newData)
    }
  }

  const removeSkill = (category: string, skill: string) => {
    const newData = { ...data }
    if (newData.skills && newData.skills[category]) {
      newData.skills[category] = newData.skills[category].filter((s: string) => s !== skill)
      saveData(newData)
    }
  }

  // Site Content Management
  const updateSiteContent = (section: string, key: string, value: string) => {
    const newData = { ...data }
    if (!newData.siteContent) newData.siteContent = {}
    if (!newData.siteContent[section]) newData.siteContent[section] = {}

    newData.siteContent[section][key] = value
    saveData(newData)
  }

  // SEO Management
  const updateSEO = (key: string, value: string) => {
    const newData = { ...data }
    if (!newData.seo) newData.seo = {}
    newData.seo[key] = value
    saveData(newData)
  }

  // Contact Management
  const updateContact = (key: string, value: string) => {
    const newData = { ...data }
    if (!newData.contact) newData.contact = {}
    newData.contact[key] = value
    saveData(newData)
  }

  // Theme Management
  const updateTheme = (key: string, value: string) => {
    const newData = { ...data }
    if (!newData.theme) newData.theme = {}
    newData.theme[key] = value
    saveData(newData)
  }

  // Security Management
  const updatePassword = (newPassword: string) => {
    const newData = { ...data }
    if (!newData.security) newData.security = {}
    newData.security.adminPassword = newPassword
    saveData(newData)
    alert("Password updated successfully!")
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
              <h2 className="text-xl font-light text-white">Admin Panel</h2>
              <p className="text-sm text-gray-400">Content Management System</p>
            </div>
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
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-light text-white">Dashboard</h3>
                <div className="text-sm text-gray-400">Last updated: {new Date().toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <Award className="w-8 h-8 text-white" />
                    <div>
                      <p className="text-gray-400">Certificates</p>
                      <p className="text-2xl font-light text-white">{certificates.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <Code className="w-8 h-8 text-white" />
                    <div>
                      <p className="text-gray-400">Projects</p>
                      <p className="text-2xl font-light text-white">{projects.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <FileText className="w-8 h-8 text-white" />
                    <div>
                      <p className="text-gray-400">Blog Posts</p>
                      <p className="text-2xl font-light text-white">{blogPosts.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <Globe className="w-8 h-8 text-white" />
                    <div>
                      <p className="text-gray-400">Social Links</p>
                      <p className="text-2xl font-light text-white">{socialLinks.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                <h4 className="text-xl font-light mb-6 text-white">Recent Activity</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white">Admin panel accessed</p>
                      <p className="text-sm text-gray-400">{new Date().toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Site Content Management */}
          {activeTab === "content" && (
            <div>
              <h3 className="text-3xl font-light mb-8 text-white">Site Content Management</h3>

              {/* Home Page Content */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 mb-8">
                <h4 className="text-xl font-light mb-6 text-white">Home Page</h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Main Title</label>
                    <Input
                      defaultValue={data.siteContent?.home?.title || ""}
                      onChange={(e) => updateSiteContent("home", "title", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      placeholder="Enter main title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Subtitle</label>
                    <Input
                      defaultValue={data.siteContent?.home?.subtitle || ""}
                      onChange={(e) => updateSiteContent("home", "subtitle", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      placeholder="Enter subtitle..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Footer Text</label>
                    <Input
                      defaultValue={data.siteContent?.home?.footer || ""}
                      onChange={(e) => updateSiteContent("home", "footer", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      placeholder="Enter footer text..."
                    />
                  </div>
                </div>
              </div>

              {/* About Page Content */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                <h4 className="text-xl font-light mb-6 text-white">About Page</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Name</label>
                    <Input
                      defaultValue={data.siteContent?.about?.name || ""}
                      onChange={(e) => updateSiteContent("about", "name", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      placeholder="Enter your name..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Age</label>
                    <Input
                      defaultValue={data.siteContent?.about?.age || ""}
                      onChange={(e) => updateSiteContent("about", "age", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      placeholder="Enter your age..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Location</label>
                    <Input
                      defaultValue={data.siteContent?.about?.location || ""}
                      onChange={(e) => updateSiteContent("about", "location", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      placeholder="Enter your location..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Experience</label>
                    <Input
                      defaultValue={data.siteContent?.about?.experience || ""}
                      onChange={(e) => updateSiteContent("about", "experience", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      placeholder="Enter your experience..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Certificates Management */}
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
                        defaultValue={editingItem?.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Institution</label>
                      <Input
                        placeholder="Institution"
                        defaultValue={editingItem?.institution || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Certificate ID</label>
                      <Input
                        placeholder="Certificate ID"
                        defaultValue={editingItem?.certificateId || ""}
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Issue Date</label>
                      <Input
                        type="date"
                        defaultValue={editingItem?.issueDate || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, issueDate: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Expiry Date</label>
                      <Input
                        type="date"
                        defaultValue={editingItem?.expiryDate || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Certificate URL</label>
                      <Input
                        placeholder="Certificate URL"
                        defaultValue={editingItem?.url || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Upload Image</label>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                        disabled={uploadingImage}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
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
                      <label className="block text-sm font-light text-gray-300 mb-3">Image Preview</label>
                      <div className="w-32 h-32 border border-gray-600/50 rounded-xl overflow-hidden">
                        <Image
                          src={editingItem.imageUrl || "/placeholder.svg"}
                          alt="Certificate preview"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <label className="block text-sm font-light text-gray-300 mb-3">Description</label>
                    <Textarea
                      placeholder="Certificate description..."
                      defaultValue={editingItem?.description || ""}
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
                  <div key={certificate.id} className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h4 className="text-xl font-light text-white">{certificate.name}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              certificate.isActive !== false ? "bg-white/20 text-white" : "bg-gray-600/20 text-gray-400"
                            }`}
                          >
                            {certificate.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-3">{certificate.institution}</p>
                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-4">
                          {certificate.category && <span>Category: {certificate.category}</span>}
                          {certificate.certificateId && <span>ID: {certificate.certificateId}</span>}
                          {certificate.issueDate && (
                            <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                          )}
                          {certificate.expiryDate && (
                            <span>Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</span>
                          )}
                        </div>
                        {certificate.description && <p className="text-gray-300 mb-4">{certificate.description}</p>}
                        {certificate.url && (
                          <a
                            href={certificate.url}
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
                ))}
              </div>
            </div>
          )}

          {/* Projects Management */}
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
                        defaultValue={editingItem?.title || ""}
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">GitHub URL</label>
                      <Input
                        placeholder="GitHub URL"
                        defaultValue={editingItem?.githubUrl || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Demo URL</label>
                      <Input
                        placeholder="Demo URL"
                        defaultValue={editingItem?.demoUrl || ""}
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Tags (comma separated)</label>
                      <Input
                        placeholder="React, Node.js, MongoDB"
                        defaultValue={editingItem?.tags?.join(", ") || ""}
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
                    <label className="block text-sm font-light text-gray-300 mb-3">Short Description</label>
                    <Textarea
                      placeholder="Brief project description..."
                      defaultValue={editingItem?.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-light text-gray-300 mb-3">Detailed Content</label>
                    <Textarea
                      placeholder="Detailed project content (supports Markdown)..."
                      defaultValue={editingItem?.content || ""}
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
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-4">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-white hover:text-gray-300 text-sm"
                            >
                              <Code className="w-3 h-3" />
                              GitHub
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

          {/* Blog Management */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Post Title</label>
                      <Input
                        placeholder="Blog post title..."
                        defaultValue={editingItem?.title || ""}
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
                        defaultValue={editingItem?.readTime || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, readTime: Number.parseInt(e.target.value) })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-light text-gray-300 mb-3">Tags (comma separated)</label>
                      <Input
                        placeholder="security, tutorial, beginner"
                        defaultValue={editingItem?.tags?.join(", ") || ""}
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
                      defaultValue={editingItem?.excerpt || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-light text-gray-300 mb-3">Content (Markdown supported)</label>
                    <Textarea
                      placeholder="Write your blog post content here... (Markdown supported)"
                      defaultValue={editingItem?.content || ""}
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
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                                #{tag}
                              </span>
                            ))}
                          </div>
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

          {/* Social Media Management */}
          {activeTab === "social" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-light text-white">Social Media Management</h3>
                <Button
                  onClick={() => {
                    setEditingItem({})
                    setEditingType("social")
                  }}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </Button>
              </div>

              {editingType === "social" && (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 mb-8">
                  <h4 className="text-xl font-light mb-6 text-white">
                    {editingItem?.id ? "Edit Social Link" : "Add New Social Link"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Platform Name</label>
                      <Input
                        placeholder="Platform name (e.g., GitHub, LinkedIn)"
                        defaultValue={editingItem?.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">URL</label>
                      <Input
                        placeholder="https://github.com/username"
                        defaultValue={editingItem?.url || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Icon</label>
                      <Select
                        value={editingItem?.icon || ""}
                        onValueChange={(value) => setEditingItem({ ...editingItem, icon: value })}
                      >
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50 text-white">
                          <SelectValue placeholder="Select Icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Github">GitHub</SelectItem>
                          <SelectItem value="Mail">Email</SelectItem>
                          <SelectItem value="Hash">Element/Matrix</SelectItem>
                          <SelectItem value="Zap">Bluesky</SelectItem>
                          <SelectItem value="Link">Website</SelectItem>
                          <SelectItem value="Phone">Phone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={editingItem?.isActive !== false}
                          onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={() => saveSocialLink(editingItem)}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Link
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
                {socialLinks.map((link: any) => (
                  <div key={link.id} className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-light text-white">{link.name}</h4>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white text-sm"
                          >
                            {link.url}
                          </a>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            link.isActive !== false ? "bg-white/20 text-white" : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          {link.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                          onClick={() => {
                            setEditingItem(link)
                            setEditingType("social")
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600/50 text-gray-400 hover:text-red-400 hover:border-red-600/50"
                          onClick={() => deleteSocialLink(link.id)}
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

          {/* Skills Management */}
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
                        <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg">
                          <span className="text-white text-sm">{skill}</span>
                          <button
                            onClick={() => removeSkill(category, skill)}
                            className="text-gray-400 hover:text-red-400"
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

          {/* Contact Management */}
          {activeTab === "contact" && (
            <div>
              <h3 className="text-3xl font-light mb-8 text-white">Contact Information</h3>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Email</label>
                    <Input
                      placeholder="your@email.com"
                      defaultValue={data.contact?.email || ""}
                      onChange={(e) => updateContact("email", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Phone</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      defaultValue={data.contact?.phone || ""}
                      onChange={(e) => updateContact("phone", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Address</label>
                    <Input
                      placeholder="City, Country"
                      defaultValue={data.contact?.address || ""}
                      onChange={(e) => updateContact("address", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Availability</label>
                    <Input
                      placeholder="Available for freelance work"
                      defaultValue={data.contact?.availability || ""}
                      onChange={(e) => updateContact("availability", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Management */}
          {activeTab === "seo" && (
            <div>
              <h3 className="text-3xl font-light mb-8 text-white">SEO Settings</h3>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Page Title</label>
                    <Input
                      placeholder="Your Name - Professional Title"
                      defaultValue={data.seo?.title || ""}
                      onChange={(e) => updateSEO("title", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Meta Description</label>
                    <Textarea
                      placeholder="Brief description of your website for search engines..."
                      defaultValue={data.seo?.description || ""}
                      onChange={(e) => updateSEO("description", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Keywords (comma separated)</label>
                    <Input
                      placeholder="cybersecurity, developer, AI, computer engineering"
                      defaultValue={data.seo?.keywords?.join(", ") || ""}
                      onChange={(e) =>
                        updateSEO(
                          "keywords",
                          e.target.value.split(",").map((k: string) => k.trim()),
                        )
                      }
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Open Graph Image URL</label>
                    <Input
                      placeholder="/og-image.jpg"
                      defaultValue={data.seo?.ogImage || ""}
                      onChange={(e) => updateSEO("ogImage", e.target.value)}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Theme Management */}
          {activeTab === "theme" && (
            <div>
              <h3 className="text-3xl font-light mb-8 text-white">Theme Settings</h3>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Primary Color</label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        defaultValue={data.theme?.primaryColor || "#FFFFFF"}
                        onChange={(e) => updateTheme("primaryColor", e.target.value)}
                        className="w-16 h-10 bg-gray-700/30 border-gray-600/50"
                      />
                      <Input
                        placeholder="#FFFFFF"
                        defaultValue={data.theme?.primaryColor || "#FFFFFF"}
                        onChange={(e) => updateTheme("primaryColor", e.target.value)}
                        className="flex-1 bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Background Color</label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        defaultValue={data.theme?.backgroundColor || "#000000"}
                        onChange={(e) => updateTheme("backgroundColor", e.target.value)}
                        className="w-16 h-10 bg-gray-700/30 border-gray-600/50"
                      />
                      <Input
                        placeholder="#000000"
                        defaultValue={data.theme?.backgroundColor || "#000000"}
                        onChange={(e) => updateTheme("backgroundColor", e.target.value)}
                        className="flex-1 bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-3">Accent Color</label>
                    <div className="flex gap-3">
                      <Input
                        type="color"
                        defaultValue={data.theme?.accentColor || "#3B82F6"}
                        onChange={(e) => updateTheme("accentColor", e.target.value)}
                        className="w-16 h-10 bg-gray-700/30 border-gray-600/50"
                      />
                      <Input
                        placeholder="#3B82F6"
                        defaultValue={data.theme?.accentColor || "#3B82F6"}
                        onChange={(e) => updateTheme("accentColor", e.target.value)}
                        className="flex-1 bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Management */}
          {activeTab === "security" && (
            <div>
              <h3 className="text-3xl font-light mb-8 text-white">Security Settings</h3>

              <div className="space-y-8">
                {/* Password Change */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                  <h4 className="text-xl font-light mb-6 text-white">Change Admin Password</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">Current Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          defaultValue={data.security?.adminPassword || ""}
                          className="bg-gray-700/30 border-gray-600/50 text-white pr-10"
                          readOnly
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-3">New Password</label>
                      <Input
                        type="password"
                        placeholder="Enter new password..."
                        onChange={(e) => setEditingItem({ ...editingItem, newPassword: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 text-white"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        if (editingItem?.newPassword) {
                          updatePassword(editingItem.newPassword)
                          setEditingItem({})
                        }
                      }}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Copy Current Password */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                  <h4 className="text-xl font-light mb-6 text-white">Current Password</h4>
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      value={data.security?.adminPassword || ""}
                      className="bg-gray-700/30 border-gray-600/50 text-white"
                      readOnly
                    />
                    <Button
                      onClick={() => copyToClipboard(data.security?.adminPassword || "")}
                      variant="outline"
                      className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === "analytics" && (
            <div>
              <h3 className="text-3xl font-light mb-8 text-white">Analytics</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <User className="w-8 h-8 text-white" />
                    <div>
                      <p className="text-gray-400">Total Visitors</p>
                      <p className="text-2xl font-light text-white">{data.analytics?.totalVisitors || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <Eye className="w-8 h-8 text-white" />
                    <div>
                      <p className="text-gray-400">Page Views</p>
                      <p className="text-2xl font-light text-white">{data.analytics?.pageViews || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                    <div>
                      <p className="text-gray-400">Bounce Rate</p>
                      <p className="text-2xl font-light text-white">{data.analytics?.bounceRate || 0}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-white" />
                    <div>
                      <p className="text-gray-400">Avg. Session</p>
                      <p className="text-2xl font-light text-white">{data.analytics?.avgSessionDuration || 0}s</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                <h4 className="text-xl font-light mb-6 text-white">Analytics Integration</h4>
                <p className="text-gray-400 mb-4">
                  Connect your Google Analytics or other analytics service to track visitor data.
                </p>
                <Button className="bg-white text-black hover:bg-gray-200">
                  <Link className="w-4 h-4 mr-2" />
                  Connect Analytics
                </Button>
              </div>
            </div>
          )}

          {/* Images Management */}
          {activeTab === "images" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-light text-white">Image Management</h3>
                <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-black hover:bg-gray-200">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || [])
                    for (const file of files) {
                      await handleImageUpload(file)
                    }
                  }}
                />
              </div>

              <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                <h4 className="text-xl font-light mb-6 text-white">Uploaded Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Placeholder for uploaded images */}
                  <div className="aspect-square bg-gray-700/50 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div>
              <h3 className="text-3xl font-light mb-8 text-white">System Settings</h3>

              <div className="space-y-8">
                {/* Data Management */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                  <h4 className="text-xl font-light mb-6 text-white">Data Management</h4>
                  <div className="flex gap-4">
                    <Button onClick={exportData} className="bg-white text-black hover:bg-gray-200">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                    <Button
                      onClick={() => {
                        if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
                          localStorage.removeItem("daghlar_admin_data")
                          window.location.reload()
                        }
                      }}
                      variant="outline"
                      className="border-red-600/50 text-red-400 hover:text-red-300 hover:bg-red-600/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset All Data
                    </Button>
                  </div>
                </div>

                {/* System Info */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                  <h4 className="text-xl font-light mb-6 text-white">System Information</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Version:</span>
                      <span className="text-white">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-white">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Storage Used:</span>
                      <span className="text-white">{Math.round(JSON.stringify(data).length / 1024)} KB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
