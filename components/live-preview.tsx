"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Eye, EyeOff, RefreshCw } from "lucide-react"
import { AdminStorage } from "@/lib/admin-storage"

interface LivePreviewProps {
  isOpen: boolean
  onClose: () => void
}

export function LivePreview({ isOpen, onClose }: LivePreviewProps) {
  const [previewData, setPreviewData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    if (isOpen) {
      loadPreviewData()
      setupDataListener()
    }
  }, [isOpen])

  const setupDataListener = () => {
    const handleDataUpdate = () => {
      loadPreviewData()
    }

    window.addEventListener("adminDataUpdated", handleDataUpdate)
    return () => {
      window.removeEventListener("adminDataUpdated", handleDataUpdate)
    }
  }

  const loadPreviewData = () => {
    setIsLoading(true)
    try {
      const data = AdminStorage.getData()
      setPreviewData(data)
    } catch (error) {
      console.error("Error loading preview data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPreview = () => {
    loadPreviewData()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Canlı Önizleme
            </h2>
            <div className="flex space-x-2">
              {["home", "about", "projects", "blog", "certificates"].map((section) => (
                <Button
                  key={section}
                  variant={activeSection === section ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSection(section)}
                  className="capitalize"
                >
                  {section}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshPreview}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {activeSection === "home" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ana Sayfa İçeriği</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Başlık</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {previewData.siteContent?.home?.title || "Başlık yok"}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Alt Başlık</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {previewData.siteContent?.home?.subtitle || "Alt başlık yok"}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Açıklamalar</h4>
                      <div className="flex flex-wrap gap-2">
                        {previewData.siteContent?.home?.descriptions?.map((desc: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                            {desc}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Kartlar</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {previewData.siteContent?.home?.cards?.map((card: any) => (
                          <div key={card.id} className={`p-4 border rounded-lg ${!card.isVisible ? "opacity-50" : ""}`}>
                            <h5 className="font-medium">{card.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{card.description}</p>
                            <span className="text-xs text-gray-500">{card.isVisible ? "Görünür" : "Gizli"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "about" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Hakkımda İçeriği</h3>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Başlık</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {previewData.siteContent?.about?.title || "Başlık yok"}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">İçerik</h4>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {previewData.siteContent?.about?.content || "İçerik yok"}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Yetenekler</h4>
                      <div className="space-y-2">
                        {Object.entries(previewData.skills || {}).map(([category, skills]: [string, any]) => (
                          <div key={category}>
                            <h5 className="font-medium capitalize">{category}</h5>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skills.map((skill: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "projects" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Projeler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {previewData.projects?.map((project: any) => (
                        <div key={project.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies?.map((tech: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {project.isVisible ? "Görünür" : "Gizli"} | {project.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "blog" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Blog Yazıları</h3>
                    <div className="space-y-4">
                      {previewData.blogPosts?.map((post: any) => (
                        <div key={post.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{post.category}</span>
                            <span>{post.isVisible ? "Görünür" : "Gizli"}</span>
                            <span>{post.readTime} dk okuma</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "certificates" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Sertifikalar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {previewData.certificates?.map((cert: any) => (
                        <div key={cert.id} className="p-4 border rounded-lg">
                          <h4 className="font-medium">{cert.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{cert.issuer}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{cert.issueDate}</span>
                            <span>{cert.isVisible ? "Görünür" : "Gizli"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 