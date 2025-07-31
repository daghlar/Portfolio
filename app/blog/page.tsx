"use client"

import { ArrowLeft, Calendar, Clock, ArrowRight, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { AdminTrigger } from "@/components/admin-trigger"
import { useState, useEffect } from "react"
import { AdminStorage } from "@/lib/admin-storage"

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([])

  useEffect(() => {
    loadBlogPosts()

    // Set up real-time listener
    const removeListener = AdminStorage.addListener(() => {
      loadBlogPosts()
    })

    // Listen for admin data updates
    const handleDataUpdate = () => {
      loadBlogPosts()
    }

    window.addEventListener("adminDataUpdated", handleDataUpdate)
    window.addEventListener("blogUpdated", handleDataUpdate)

    return () => {
      removeListener()
      window.removeEventListener("adminDataUpdated", handleDataUpdate)
      window.removeEventListener("blogUpdated", handleDataUpdate)
    }
  }, [])

  const loadBlogPosts = () => {
    try {
      const adminData = AdminStorage.getData()
      const posts = adminData.blogPosts || []
      // Only show published and visible posts
      setBlogPosts(posts.filter((post: any) => post.status === "published" && post.isVisible !== false))
    } catch (error) {
      console.error("Error loading blog posts:", error)
      setBlogPosts([])
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

        <div className="max-w-5xl mx-auto">
          <div className="mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
            <h1 className="text-responsive-8xl font-thin mb-6 sm:mb-8 tracking-wide">Blog</h1>
            <p className="text-gray-400 text-responsive-3xl font-light">
              Thoughts on technology, security, and innovation
            </p>
          </div>

          <div className="unified-container rounded-2xl sm:rounded-3xl overflow-hidden animate-fade-in-up">
            {blogPosts.length > 0 ? (
              blogPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`p-6 sm:p-12 lg:p-16 hover:bg-white/5 transition-smooth group ${
                    index < blogPosts.length - 1 ? "border-b border-gray-800/50" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6 sm:mb-8 lg:mb-10">
                    <span className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/30 border border-gray-700/50 font-light rounded-full backdrop-blur-sm text-gray-300 text-sm sm:text-base w-fit">
                      {post.category}
                    </span>
                    {post.isExternal && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded-full text-blue-400 text-xs">
                        <Globe className="w-3 h-3" />
                        {post.platform}
                      </div>
                    )}
                    <div className="flex items-center gap-4 sm:gap-8 text-gray-500 font-light text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{new Date(post.createdAt || post.publishDate).toLocaleDateString()}</span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="text-responsive-5xl font-light mb-6 sm:mb-8 group-hover:text-white/90 transition-smooth tracking-wide">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 mb-6 sm:mb-8 lg:mb-10 leading-relaxed font-light text-sm sm:text-base lg:text-lg">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {post.isExternal ? (
                      <div className="flex gap-4">
                        <Link
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center text-gray-500 hover:text-white transition-smooth group-hover:gap-3 gap-2 font-light text-sm sm:text-base"
                        >
                          <span>Read on site</span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-smooth group-hover:translate-x-2" />
                        </Link>
                        <a
                          href={post.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-smooth gap-2 font-light text-sm sm:text-base"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>View original</span>
                        </a>
                      </div>
                    ) : (
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-gray-500 hover:text-white transition-smooth group-hover:gap-3 gap-2 font-light text-sm sm:text-base"
                      >
                        <span>Read more</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-smooth group-hover:translate-x-2" />
                      </Link>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg">No blog posts published yet. Add some through the admin panel!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
