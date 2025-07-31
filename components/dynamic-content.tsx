"use client"

import React, { useState, useEffect } from "react"
import { realTimeManager } from "@/lib/real-time-manager"

interface DynamicContentProps {
  page: string
  section: string
  contentKey: string
  defaultValue: string | string[]
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export function DynamicContent({
  page,
  section,
  contentKey,
  defaultValue,
  as: Component = "div",
  className = "",
}: DynamicContentProps) {
  const [content, setContent] = useState(defaultValue)

  useEffect(() => {
    loadContent()

    // Subscribe to real-time updates
    const unsubscribe = realTimeManager.subscribe("home_content_updated", (data) => {
      loadContent()
    })

    return unsubscribe
  }, [page, section, contentKey])

  const loadContent = () => {
    try {
      const adminData = localStorage.getItem("daghlar_admin_data")
      if (adminData) {
        const parsedData = JSON.parse(adminData)
        if (parsedData.homeContent) {
          const homeContent = parsedData.homeContent

          // Map content keys to actual data
          switch (contentKey) {
            case "title":
              setContent(homeContent.title || defaultValue)
              break
            case "subtitle":
              setContent(homeContent.subtitle || defaultValue)
              break
            case "descriptions":
              setContent(homeContent.descriptions || defaultValue)
              break
            case "footer":
              setContent(homeContent.footer || defaultValue)
              break
            default:
              setContent(defaultValue)
          }
        }
      }
    } catch (error) {
      console.error("Error loading dynamic content:", error)
      setContent(defaultValue)
    }
  }

  // Handle array content (descriptions) - Force horizontal layout
  if (Array.isArray(content) && contentKey === "descriptions") {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 lg:gap-12 ${className}`}>
        {content.map((desc, index) => (
          <React.Fragment key={index}>
            <span>{desc}</span>
            {index < content.length - 1 && (
              <>
                <div className="w-1 h-1 bg-gray-500 rounded-full hidden sm:block" />
                <br className="sm:hidden" />
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  // Handle string content
  return React.createElement(Component, { className }, content as string)
}
