"use client"

import { ArrowLeft, ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { AdminTrigger } from "@/components/admin-trigger"
import { useState, useEffect } from "react"
import { AdminStorage } from "@/lib/admin-storage"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    loadProjects()

    // Set up real-time listener
    const removeListener = AdminStorage.addListener(() => {
      loadProjects()
    })

    // Listen for admin data updates
    const handleDataUpdate = () => {
      loadProjects()
    }

    window.addEventListener("adminDataUpdated", handleDataUpdate)
    window.addEventListener("projectsUpdated", handleDataUpdate)

    return () => {
      removeListener()
      window.removeEventListener("adminDataUpdated", handleDataUpdate)
      window.removeEventListener("projectsUpdated", handleDataUpdate)
    }
  }, [])

  const loadProjects = () => {
    try {
      const adminData = AdminStorage.getData()
      const allProjects = adminData.projects || []
      // Only show visible projects
      setProjects(allProjects.filter((project: any) => project.isVisible !== false))
    } catch (error) {
      console.error("Error loading projects:", error)
      setProjects([])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Sidebar />
      <AdminTrigger />

      {/* Background */}
      <div className="fixed inset-0 grid-bg opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900/10 to-black" />

      <div className="lg:ml-20 p-4 sm:p-8 lg:p-16 relative z-10 pt-20 lg:pt-16">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 sm:mb-12 lg:mb-16 transition-smooth group"
        >
          <ArrowLeft className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-2 transition-smooth" />
          <span className="font-light text-sm sm:text-base">Back to home</span>
        </Link>

        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
            <h1 className="text-responsive-8xl font-thin mb-6 sm:mb-8 tracking-wide">Projects</h1>
            <p className="text-gray-400 text-responsive-3xl font-light">
              A showcase of my technical work and innovations
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No projects available. Add some through the admin panel!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="unified-container rounded-2xl sm:rounded-3xl overflow-hidden hover:bg-white/5 transition-smooth group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative overflow-hidden">
                    <div className="h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <span className="text-white font-bold text-xl sm:text-2xl">{project.title.charAt(0)}</span>
                        </div>
                        <p className="text-gray-400 text-sm font-light">{project.title}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex gap-2 sm:gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-black/60 backdrop-blur-xl border border-gray-700/50 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-smooth"
                        >
                          <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-black/60 backdrop-blur-xl border border-gray-700/50 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-smooth"
                        >
                          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-light mb-3 sm:mb-4">{project.title}</h2>
                    <p className="text-gray-400 mb-6 sm:mb-8 leading-relaxed font-light text-sm sm:text-base">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {(project.tags || []).map((tag: string, tagIndex: number) => (
                        <span
                          key={tagIndex}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800/30 border border-gray-700/50 text-xs sm:text-sm font-light hover:bg-gray-700/30 transition-smooth rounded-full backdrop-blur-sm text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
