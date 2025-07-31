"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  Users,
  FileText,
  Code,
  LogOut,
  Shield,
  Award,
  Plus,
  Edit,
  Trash2,
  Save,
  Home,
  Globe,
  Monitor,
  Smartphone,
  Upload,
  ImageIcon,
  TrendingUp,
  Activity,
  Database,
  Zap,
} from "lucide-react"
import { AdvancedSecurity } from "@/lib/advanced-security"
import { RealTimeManager } from "@/lib/real-time-manager"
import { ImageManager } from "@/lib/image-manager"

interface AdvancedAdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AdvancedAdminPanel({ isOpen, onClose }: AdvancedAdminPanelProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>({})
  const [realTimeStats, setRealTimeStats] = useState<any>({})
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingType, setEditingType] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      loadData()
      startRealTimeUpdates()
    }

    return () => {
      stopRealTimeUpdates()
    }
  }, [isOpen, activeTab])

  const loadData = () => {
    setLoading(true)
    try {
      const adminData = JSON.parse(localStorage.getItem("daghlar_admin_data") || "{}")
      setData(adminData)
      setRealTimeStats(RealTimeManager.getAnalytics())
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveData = (newData: any) => {
    try {
      // Encrypt sensitive data
      const encryptedData = AdvancedSecurity.encryptData(JSON.stringify(newData))
      localStorage.setItem("daghlar_admin_data", encryptedData)
      setData(newData)

      // Queue real-time update
      RealTimeManager.queueUpdate("content_update", newData)

      // Trigger page refresh
      window.dispatchEvent(new Event("adminDataUpdated"))

      // Log security event
      AdvancedSecurity.logSecurityEvent("data_updated", {
        section: activeTab,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }

  const startRealTimeUpdates = () => {
    const interval = setInterval(() => {
      setRealTimeStats(RealTimeManager.getAnalytics())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }

  const stopRealTimeUpdates = () => {
    // Cleanup handled by useEffect return
  }

  // Image Upload Handler
  const handleImageUpload = async (file: File, category: string) => {
    setUploadingImage(true)
    try {
      const result = await ImageManager.uploadImage(file, category)
      if (result.success) {
        return result.url
      } else {
        alert(result.error)
        return null
      }
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
    const sanitizedData = AdvancedSecurity.sanitizeInput(JSON.stringify(certificateData))
    const parsedData = JSON.parse(sanitizedData)

    const newData = { ...data }
    if (!newData.certificates) newData.certificates = []

    if (editingItem?.id) {
      const index = newData.certificates.findIndex((c: any) => c.id === editingItem.id)
      if (index !== -1) {
        newData.certificates[index] = { ...parsedData, id: editingItem.id, updatedAt: new Date().toISOString() }
      }
    } else {
      newData.certificates.push({
        ...parsedData,
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
    const sanitizedData = AdvancedSecurity.sanitizeInput(JSON.stringify(projectData))
    const parsedData = JSON.parse(sanitizedData)

    const newData = { ...data }
    if (!newData.projects) newData.projects = []

    if (editingItem?.id) {
      const index = newData.projects.findIndex((p: any) => p.id === editingItem.id)
      if (index !== -1) {
        newData.projects[index] = { ...parsedData, id: editingItem.id, updatedAt: new Date().toISOString() }
      }
    } else {
      newData.projects.push({
        ...parsedData,
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
    const sanitizedData = AdvancedSecurity.sanitizeInput(JSON.stringify(blogData))
    const parsedData = JSON.parse(sanitizedData)

    const newData = { ...data }
    if (!newData.blogPosts) newData.blogPosts = []

    if (editingItem?.id) {
      const index = newData.blogPosts.findIndex((b: any) => b.id === editingItem.id)
      if (index !== -1) {
        newData.blogPosts[index] = {
          ...parsedData,
          id: editingItem.id,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      newData.blogPosts.push({
        ...parsedData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
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
    const sanitizedData = AdvancedSecurity.sanitizeInput(JSON.stringify(socialData))
    const parsedData = JSON.parse(sanitizedData)

    const newData = { ...data }
    if (!newData.socialLinks) newData.socialLinks = []

    if (editingItem?.id) {
      const index = newData.socialLinks.findIndex((s: any) => s.id === editingItem.id)
      if (index !== -1) {
        newData.socialLinks[index] = { ...parsedData, id: editingItem.id }
      }
    } else {
      newData.socialLinks.push({
        ...parsedData,
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

    newData.siteContent[section][key] = AdvancedSecurity.sanitizeInput(value)
    saveData(newData)
  }

  if (!isOpen) return null

  const tabs = [
    { id: "dashboard", label: "Real-time Dashboard", icon: Activity },
    { id: "content", label: "Site Content", icon: Home },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "projects", label: "Projects", icon: Code },
    { id: "blog", label: "Blog System", icon: FileText },
    { id: "social", label: "Social Media", icon: Globe },
    { id: "visitors", label: "Visitor Analytics", icon: Users },
    { id: "security", label: "Security Center", icon: Shield },
    { id: "images", label: "Image Manager", icon: ImageIcon },
    { id: "settings", label: "System Settings", icon: Settings },
  ]

  const certificates = data.certificates || []
  const projects = data.projects || []
  const blogPosts = data.blogPosts || []
  const socialLinks = data.socialLinks || []
  const visitorLogs = data.visitorLogs || []
  const securityLogs = data.securityLogs || []

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] overflow-hidden">
      <div className="flex h-full">
        {/* Enhanced Sidebar */}
        <div className="w-80 bg-gray-900/90 border-r border-gray-700/50 p-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-light">Advanced Admin</h2>
              <p className="text-xs text-gray-400">Real-time Management</p>
            </div>
          </div>

          {/* Real-time Status */}
          <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-light">System Status</span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Threat Level: {realTimeStats.security?.threatLevel || "NONE"}</div>
              <div>Active Users: {realTimeStats.visitors?.lastHour || 0}</div>
              <div>Queue: {realTimeStats.performance?.updateQueueSize || 0}</div>
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth text-left ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-light text-sm">{tab.label}</span>
                </button>
              )
            })}
          </nav>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full mt-8 border-red-600/50 text-red-400 hover:bg-red-600/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Secure Logout
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            )}

            {/* Real-time Dashboard */}
            {activeTab === "dashboard" && (
              <div>
                <h3 className="text-3xl font-light mb-8">Real-time Dashboard</h3>

                {/* Live Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-8 h-8 text-green-400" />
                      <div>
                        <h4 className="text-xl font-light">Live Visitors</h4>
                        <p className="text-3xl font-thin text-green-400">{realTimeStats.visitors?.lastHour || 0}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Total: {realTimeStats.visitors?.total || 0} | Unique: {realTimeStats.visitors?.uniqueIPs || 0}
                    </div>
                  </div>

                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-8 h-8 text-blue-400" />
                      <div>
                        <h4 className="text-xl font-light">Security</h4>
                        <p
                          className={`text-3xl font-thin ${
                            realTimeStats.security?.threatLevel === "HIGH"
                              ? "text-red-400"
                              : realTimeStats.security?.threatLevel === "MEDIUM"
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {realTimeStats.security?.threatLevel || "SAFE"}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Events: {realTimeStats.security?.lastHour || 0} (Last Hour)
                    </div>
                  </div>

                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="w-8 h-8 text-purple-400" />
                      <div>
                        <h4 className="text-xl font-light">Content</h4>
                        <p className="text-3xl font-thin text-purple-400">
                          {(realTimeStats.content?.projects || 0) +
                            (realTimeStats.content?.blogPosts || 0) +
                            (realTimeStats.content?.certificates || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      P: {realTimeStats.content?.projects || 0} | B: {realTimeStats.content?.blogPosts || 0} | C:{" "}
                      {realTimeStats.content?.certificates || 0}
                    </div>
                  </div>

                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-8 h-8 text-yellow-400" />
                      <div>
                        <h4 className="text-xl font-light">Performance</h4>
                        <p className="text-3xl font-thin text-yellow-400">
                          {realTimeStats.performance?.updateQueueSize || 0}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">Queue Size | Real-time Updates</div>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-light mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Live Activity Feed
                  </h4>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {visitorLogs.slice(0, 10).map((log: any) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {log.device === "Mobile" ? (
                            <Smartphone className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Monitor className="w-4 h-4 text-blue-400" />
                          )}
                          <div>
                            <p className="text-sm font-light">
                              {log.browser} on {log.os}
                            </p>
                            <p className="text-xs text-gray-400">
                              {log.ip} • {log.page}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Certificates Management */}
            {activeTab === "certificates" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-light">Certificate Management</h3>
                  <Button
                    onClick={() => {
                      setEditingItem({})
                      setEditingType("certificate")
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Certificate
                  </Button>
                </div>

                {editingType === "certificate" && (
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
                    <h4 className="text-xl font-light mb-6">
                      {editingItem?.id ? "Edit Certificate" : "Add New Certificate"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        placeholder="Certificate Name"
                        defaultValue={editingItem?.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                      <Input
                        placeholder="Institution"
                        defaultValue={editingItem?.institution || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                      <Input
                        placeholder="Certificate ID"
                        defaultValue={editingItem?.certificateId || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, certificateId: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                      <Select
                        value={editingItem?.category || ""}
                        onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                      >
                        <SelectTrigger className="bg-gray-700/30 border-gray-600/50">
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
                      <Input
                        type="date"
                        placeholder="Issue Date"
                        defaultValue={editingItem?.issueDate || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, issueDate: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                      <Input
                        type="date"
                        placeholder="Expiry Date"
                        defaultValue={editingItem?.expiryDate || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                      <Input
                        placeholder="Certificate URL"
                        defaultValue={editingItem?.url || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="flex-1"
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
                              const imageUrl = await handleImageUpload(file, "certificates")
                              if (imageUrl) {
                                setEditingItem({ ...editingItem, imageUrl })
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <Textarea
                      placeholder="Description"
                      defaultValue={editingItem?.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 mt-6"
                    />
                    <div className="flex items-center gap-4 mt-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingItem?.isActive !== false}
                          onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Active</span>
                      </label>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button onClick={() => saveCertificate(editingItem)} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Certificate
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingItem(null)
                          setEditingType("")
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {certificates.map((certificate: any) => (
                    <div key={certificate.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <h4 className="text-xl font-light">{certificate.name}</h4>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                certificate.isActive !== false
                                  ? "bg-green-600/20 text-green-400"
                                  : "bg-gray-600/20 text-gray-400"
                              }`}
                            >
                              {certificate.isActive !== false ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-gray-400 mb-2">{certificate.institution}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>Category: {certificate.category}</span>
                            <span>ID: {certificate.certificateId}</span>
                            {certificate.issueDate && (
                              <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
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
                            className="text-red-400 border-red-600/50"
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

            {/* Continue with other sections... */}
          </div>
        </div>
      </div>
    </div>
  )
}
