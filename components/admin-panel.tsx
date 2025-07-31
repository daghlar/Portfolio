"use client"

import { useState, useEffect } from "react"
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
  Palette,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  ExternalLink,
} from "lucide-react"
import { AdminStorage } from "@/lib/admin-storage"
import { SecurityManager } from "@/lib/security"

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>({})

  // Form states
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editingType, setEditingType] = useState<string>("")

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, activeTab])

  const loadData = () => {
    setLoading(true)
    try {
      const adminData = AdminStorage.getData()
      setData(adminData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveData = (newData: any) => {
    AdminStorage.saveData(newData)
    setData(newData)
    // Trigger page refresh to show changes
    window.dispatchEvent(new Event("adminDataUpdated"))
  }

  // Certificate operations
  const saveCertificate = (certificateData: any) => {
    const sanitizedData = SecurityManager.validateFormData(certificateData)
    const newData = { ...data }

    if (editingItem?.id) {
      // Update existing
      const index = newData.certificates.findIndex((c: any) => c.id === editingItem.id)
      if (index !== -1) {
        newData.certificates[index] = { ...sanitizedData, id: editingItem.id }
      }
    } else {
      // Add new
      newData.certificates.push({
        ...sanitizedData,
        id: AdminStorage.generateId(),
        createdAt: new Date().toISOString(),
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

  // Project operations
  const saveProject = (projectData: any) => {
    const sanitizedData = SecurityManager.validateFormData(projectData)
    const newData = { ...data }

    if (editingItem?.id) {
      const index = newData.projects.findIndex((p: any) => p.id === editingItem.id)
      if (index !== -1) {
        newData.projects[index] = { ...sanitizedData, id: editingItem.id }
      }
    } else {
      newData.projects.push({
        ...sanitizedData,
        id: AdminStorage.generateId(),
        createdAt: new Date().toISOString(),
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

  // Blog operations
  const saveBlogPost = (blogData: any) => {
    const sanitizedData = SecurityManager.validateFormData(blogData)
    const newData = { ...data }

    if (editingItem?.id) {
      const index = newData.blogPosts.findIndex((b: any) => b.id === editingItem.id)
      if (index !== -1) {
        newData.blogPosts[index] = {
          ...sanitizedData,
          id: editingItem.id,
          updatedAt: new Date().toISOString(),
        }
      }
    } else {
      newData.blogPosts.push({
        ...sanitizedData,
        id: AdminStorage.generateId(),
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

  // Site content operations
  const updateSiteContent = (section: string, key: string, value: string) => {
    const newData = { ...data }
    if (!newData.siteContent[section]) {
      newData.siteContent[section] = {}
    }
    newData.siteContent[section][key] = SecurityManager.sanitizeInput(value)
    saveData(newData)
  }

  if (!isOpen) return null

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Settings },
    { id: "content", label: "Site Content", icon: Home },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "projects", label: "Projects", icon: Code },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "visitors", label: "Visitors", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "theme", label: "Theme", icon: Palette },
  ]

  const visitorLogs = data.visitorLogs || []
  const certificates = data.certificates || []
  const projects = data.projects || []
  const blogPosts = data.blogPosts || []

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900/90 border-r border-gray-700/50 p-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-light">Admin Panel</h2>
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
                  {tab.label}
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
            Logout
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

            {/* Dashboard */}
            {activeTab === "dashboard" && (
              <div>
                <h3 className="text-3xl font-light mb-8">Dashboard</h3>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-8 h-8 text-blue-400" />
                      <div>
                        <h4 className="text-xl font-light">Visitors</h4>
                        <p className="text-3xl font-thin text-blue-400">{visitorLogs.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-8 h-8 text-yellow-400" />
                      <div>
                        <h4 className="text-xl font-light">Certificates</h4>
                        <p className="text-3xl font-thin text-yellow-400">{certificates.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Code className="w-8 h-8 text-green-400" />
                      <div>
                        <h4 className="text-xl font-light">Projects</h4>
                        <p className="text-3xl font-thin text-green-400">{projects.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-8 h-8 text-purple-400" />
                      <div>
                        <h4 className="text-xl font-light">Blog Posts</h4>
                        <p className="text-3xl font-thin text-purple-400">{blogPosts.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-light mb-6">Recent Visitors</h4>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {visitorLogs.slice(0, 10).map((log: any) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {log.device === "Mobile" ? (
                            <Smartphone className="w-4 h-4" />
                          ) : (
                            <Monitor className="w-4 h-4" />
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
                        <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Site Content Management */}
            {activeTab === "content" && (
              <div>
                <h3 className="text-3xl font-light mb-8">Site Content Management</h3>

                {/* Home Page Content */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
                  <h4 className="text-xl font-light mb-6">Home Page</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Main Title</label>
                      <Input
                        defaultValue={data.siteContent?.home?.title || ""}
                        onChange={(e) => updateSiteContent("home", "title", e.target.value)}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Subtitle</label>
                      <Input
                        defaultValue={data.siteContent?.home?.subtitle || ""}
                        onChange={(e) => updateSiteContent("home", "subtitle", e.target.value)}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Footer Text</label>
                      <Input
                        defaultValue={data.siteContent?.home?.footer || ""}
                        onChange={(e) => updateSiteContent("home", "footer", e.target.value)}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                    </div>
                  </div>
                </div>

                {/* About Page Content */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-light mb-6">About Page</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-light text-gray-300 mb-2">Name</label>
                        <Input
                          defaultValue={data.siteContent?.about?.name || ""}
                          onChange={(e) => updateSiteContent("about", "name", e.target.value)}
                          className="bg-gray-700/30 border-gray-600/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-300 mb-2">Age</label>
                        <Input
                          defaultValue={data.siteContent?.about?.age || ""}
                          onChange={(e) => updateSiteContent("about", "age", e.target.value)}
                          className="bg-gray-700/30 border-gray-600/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-300 mb-2">Location</label>
                        <Input
                          defaultValue={data.siteContent?.about?.location || ""}
                          onChange={(e) => updateSiteContent("about", "location", e.target.value)}
                          className="bg-gray-700/30 border-gray-600/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-300 mb-2">Experience</label>
                        <Input
                          defaultValue={data.siteContent?.about?.experience || ""}
                          onChange={(e) => updateSiteContent("about", "experience", e.target.value)}
                          className="bg-gray-700/30 border-gray-600/50"
                        />
                      </div>
                    </div>
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
                          {(data.certificateCategories || []).map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
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
                      <Input
                        type="number"
                        placeholder="Sort Order"
                        defaultValue={editingItem?.sortOrder || 0}
                        onChange={(e) => setEditingItem({ ...editingItem, sortOrder: Number.parseInt(e.target.value) })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                    </div>
                    <Textarea
                      placeholder="Description"
                      defaultValue={editingItem?.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="bg-gray-700/30 border-gray-600/50 mt-6"
                    />
                    <div className="flex gap-4 mt-6">
                      <Button onClick={() => saveCertificate(editingItem)} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save
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
                          <h4 className="text-xl font-light mb-2">{certificate.name}</h4>
                          <p className="text-gray-400 mb-2">{certificate.institution}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>Category: {certificate.category}</span>
                            <span>Date: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                            {certificate.expiryDate && (
                              <span>Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</span>
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

            {/* Projects Management */}
            {activeTab === "projects" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-light">Project Management</h3>
                  <Button
                    onClick={() => {
                      setEditingItem({})
                      setEditingType("project")
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>

                {editingType === "project" && (
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
                    <h4 className="text-xl font-light mb-6">{editingItem?.id ? "Edit Project" : "Add New Project"}</h4>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          placeholder="Project Title"
                          defaultValue={editingItem?.title || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
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
                            {(data.projectCategories || []).map((cat: any) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="GitHub URL"
                          defaultValue={editingItem?.githubUrl || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                          className="bg-gray-700/30 border-gray-600/50"
                        />
                        <Input
                          placeholder="Demo URL"
                          defaultValue={editingItem?.demoUrl || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, demoUrl: e.target.value })}
                          className="bg-gray-700/30 border-gray-600/50"
                        />
                      </div>
                      <Textarea
                        placeholder="Project Description"
                        defaultValue={editingItem?.description || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                      <Textarea
                        placeholder="Detailed Content (Markdown supported)"
                        defaultValue={editingItem?.content || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 min-h-32"
                      />
                      <Input
                        placeholder="Tags (comma separated)"
                        defaultValue={editingItem?.tags?.join(", ") || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button onClick={() => saveProject(editingItem)} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save
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
                  {projects.map((project: any) => (
                    <div key={project.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-xl font-light mb-2">{project.title}</h4>
                          <p className="text-gray-400 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(project.tags || []).map((tag: string) => (
                              <span key={tag} className="px-2 py-1 bg-gray-700/50 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>Category: {project.category}</span>
                            <span>Status: {project.status}</span>
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <ExternalLink className="w-3 h-3 inline mr-1" />
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
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
                            className="text-red-400 border-red-600/50"
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
                  <h3 className="text-3xl font-light">Blog Management</h3>
                  <Button
                    onClick={() => {
                      setEditingItem({})
                      setEditingType("blog")
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </div>

                {editingType === "blog" && (
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 mb-8">
                    <h4 className="text-xl font-light mb-6">
                      {editingItem?.id ? "Edit Blog Post" : "Create New Post"}
                    </h4>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          placeholder="Post Title"
                          defaultValue={editingItem?.title || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                          className="bg-gray-700/30 border-gray-600/50"
                        />
                        <Input
                          placeholder="URL Slug"
                          defaultValue={editingItem?.slug || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
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
                            {(data.blogCategories || []).map((cat: any) => (
                              <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={editingItem?.status || "draft"}
                          onValueChange={(value) => setEditingItem({ ...editingItem, status: value })}
                        >
                          <SelectTrigger className="bg-gray-700/30 border-gray-600/50">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        placeholder="Excerpt"
                        defaultValue={editingItem?.excerpt || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                      <Textarea
                        placeholder="Content (Markdown supported)"
                        defaultValue={editingItem?.content || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                        className="bg-gray-700/30 border-gray-600/50 min-h-64"
                      />
                      <Input
                        placeholder="Tags (comma separated)"
                        defaultValue={editingItem?.tags?.join(", ") || ""}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                      <Input
                        type="number"
                        placeholder="Read Time (minutes)"
                        defaultValue={editingItem?.readTime || 5}
                        onChange={(e) => setEditingItem({ ...editingItem, readTime: Number.parseInt(e.target.value) })}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button onClick={() => saveBlogPost(editingItem)} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save
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
                  {blogPosts.map((post: any) => (
                    <div key={post.id} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-light">{post.title}</h4>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
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
                          <p className="text-gray-400 mb-3">{post.excerpt}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>Category: {post.category}</span>
                            <span>Read Time: {post.readTime} min</span>
                            <span>Views: {post.views || 0}</span>
                            <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
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
                            className="text-red-400 border-red-600/50"
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

            {/* Visitors */}
            {activeTab === "visitors" && (
              <div>
                <h3 className="text-3xl font-light mb-8">Visitor Analytics</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                      <Eye className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Total Visits</p>
                        <p className="text-2xl font-light text-blue-400">{visitorLogs.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                      <Globe className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">Unique IPs</p>
                        <p className="text-2xl font-light text-green-400">
                          {new Set(visitorLogs.map((log: any) => log.ip)).size}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Mobile Users</p>
                        <p className="text-2xl font-light text-purple-400">
                          {visitorLogs.filter((log: any) => log.device === "Mobile").length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-light mb-6">Recent Visitors</h4>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {visitorLogs.map((log: any) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {log.device === "Mobile" ? (
                              <Smartphone className="w-5 h-5 text-purple-400" />
                            ) : (
                              <Monitor className="w-5 h-5 text-blue-400" />
                            )}
                            <div>
                              <p className="font-light">
                                {log.browser} on {log.os}
                              </p>
                              <p className="text-sm text-gray-400">
                                {log.ip} • {log.page}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-light">{new Date(log.timestamp).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                    {visitorLogs.length === 0 && (
                      <div className="text-center py-8 text-gray-500">No visitor data available yet.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div>
                <h3 className="text-3xl font-light mb-8">Security & Monitoring</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <h4 className="text-xl font-light mb-4">Security Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-light text-gray-300 mb-2">Admin Password</label>
                        <Input
                          type="password"
                          defaultValue={data.security?.adminPassword || ""}
                          onChange={(e) => {
                            const newData = { ...data }
                            if (!newData.security) newData.security = {}
                            newData.security.adminPassword = e.target.value
                            saveData(newData)
                          }}
                          className="bg-gray-700/30 border-gray-600/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-300 mb-2">Max Login Attempts</label>
                        <Input
                          type="number"
                          defaultValue={data.security?.maxLoginAttempts || 3}
                          onChange={(e) => {
                            const newData = { ...data }
                            if (!newData.security) newData.security = {}
                            newData.security.maxLoginAttempts = Number.parseInt(e.target.value)
                            saveData(newData)
                          }}
                          className="bg-gray-700/30 border-gray-600/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                    <h4 className="text-xl font-light mb-4">Security Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Brute Force Protection</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Input Sanitization</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Session Management</span>
                        <span className="text-green-400">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Visitor Logging</span>
                        <span className="text-green-400">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-light mb-6">Login Attempts</h4>
                  <div className="space-y-3">
                    {Object.keys(localStorage)
                      .filter((key) => key.startsWith("login_attempts_"))
                      .map((key) => {
                        const ip = key.replace("login_attempts_", "")
                        const data = JSON.parse(localStorage.getItem(key) || '{"attempts":[]}')
                        return (
                          <div key={ip} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div>
                              <p className="font-light">{ip}</p>
                              <p className="text-sm text-gray-400">{data.attempts.length} failed attempts</p>
                            </div>
                            <div className="text-right">
                              {data.attempts.length > 0 && (
                                <p className="text-xs text-red-400">
                                  Last: {new Date(data.attempts[data.attempts.length - 1]).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Theme */}
            {activeTab === "theme" && (
              <div>
                <h3 className="text-3xl font-light mb-8">Theme Settings</h3>

                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
                  <h4 className="text-xl font-light mb-6">Color Scheme</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Primary Color</label>
                      <Input
                        type="color"
                        defaultValue={data.theme?.primaryColor || "#FFFFFF"}
                        onChange={(e) => {
                          const newData = { ...data }
                          if (!newData.theme) newData.theme = {}
                          newData.theme.primaryColor = e.target.value
                          saveData(newData)
                        }}
                        className="bg-gray-700/30 border-gray-600/50 h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Background Color</label>
                      <Input
                        type="color"
                        defaultValue={data.theme?.backgroundColor || "#000000"}
                        onChange={(e) => {
                          const newData = { ...data }
                          if (!newData.theme) newData.theme = {}
                          newData.theme.backgroundColor = e.target.value
                          saveData(newData)
                        }}
                        className="bg-gray-700/30 border-gray-600/50 h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Accent Color</label>
                      <Input
                        type="color"
                        defaultValue={data.theme?.accentColor || "#3B82F6"}
                        onChange={(e) => {
                          const newData = { ...data }
                          if (!newData.theme) newData.theme = {}
                          newData.theme.accentColor = e.target.value
                          saveData(newData)
                        }}
                        className="bg-gray-700/30 border-gray-600/50 h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-gray-300 mb-2">Border Color</label>
                      <Input
                        defaultValue={data.theme?.borderColor || "rgba(255, 255, 255, 0.08)"}
                        onChange={(e) => {
                          const newData = { ...data }
                          if (!newData.theme) newData.theme = {}
                          newData.theme.borderColor = e.target.value
                          saveData(newData)
                        }}
                        className="bg-gray-700/30 border-gray-600/50"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        const newData = { ...data }
                        newData.theme = {
                          primaryColor: "#FFFFFF",
                          backgroundColor: "#000000",
                          accentColor: "#3B82F6",
                          borderColor: "rgba(255, 255, 255, 0.08)",
                        }
                        saveData(newData)
                        window.location.reload()
                      }}
                      variant="outline"
                      className="border-gray-600/50"
                    >
                      Reset to Default
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
