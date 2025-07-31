"use client"

import Link from "next/link"
import Image from "next/image"
import React from "react"
import { ChevronRight, Sparkles, Code, FileText, Star, Award, Globe, Shield, Settings } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { SocialTicker } from "@/components/social-ticker"
import { EnhancedAdminTrigger } from "@/components/enhanced-admin-trigger"
import { useState, useEffect } from "react"
import { AdminStorage } from "@/lib/admin-storage"

// Dynamic Cards Component
function DynamicCards() {
  const [cards, setCards] = useState([
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
  ])

  useEffect(() => {
    loadCards()

    // Set up real-time listener
    const removeListener = AdminStorage.addListener(() => {
      loadCards()
    })

    // Listen for admin data updates
    const handleDataUpdate = () => {
      loadCards()
    }

    window.addEventListener("adminDataUpdated", handleDataUpdate)

    return () => {
      removeListener()
      window.removeEventListener("adminDataUpdated", handleDataUpdate)
    }
  }, [])

  const loadCards = () => {
    try {
      const adminData = AdminStorage.getData()
      if (adminData.siteContent?.home?.cards) {
        setCards(adminData.siteContent.home.cards)
      }
    } catch (error) {
      console.error("Error loading cards:", error)
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      case "Code":
        return <Code className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      case "FileText":
        return <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      case "Star":
        return <Star className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      case "Award":
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      case "Globe":
        return <Globe className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      case "Shield":
        return <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      case "Settings":
        return <Settings className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
      default:
        return <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
    }
  }

  const visibleCards = cards.filter((card) => card.isVisible)

  return (
    <div className="w-full max-w-4xl animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      <div className="unified-container rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden">
        {visibleCards.map((card, index) => (
          <Link key={card.id} href={card.link}>
            <div
              className={`p-4 sm:p-6 lg:p-8 hover:bg-white/5 transition-smooth group ${
                index < visibleCards.length - 1 ? "border-b border-gray-800/50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gray-800/50 border border-gray-700/50 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-smooth backdrop-blur-sm flex-shrink-0">
                    {getIcon(card.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg lg:text-2xl font-light mb-1 sm:mb-2 text-white">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 font-light text-xs sm:text-sm lg:text-base">{card.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-500 group-hover:text-white group-hover:translate-x-2 transition-smooth flex-shrink-0" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Dynamic Content Component
function DynamicContent({
  contentKey,
  defaultValue,
  as: Component = "div",
  className = "",
}: {
  contentKey: string
  defaultValue: string | string[]
  as?: keyof JSX.IntrinsicElements
  className?: string
}) {
  const [content, setContent] = useState(defaultValue)

  useEffect(() => {
    loadContent()

    // Set up real-time listener
    const removeListener = AdminStorage.addListener(() => {
      loadContent()
    })

    // Listen for admin data updates
    const handleDataUpdate = () => {
      loadContent()
    }

    window.addEventListener("adminDataUpdated", handleDataUpdate)

    return () => {
      removeListener()
      window.removeEventListener("adminDataUpdated", handleDataUpdate)
    }
  }, [contentKey])

  const loadContent = () => {
    try {
      const adminData = AdminStorage.getData()
      const homeContent = adminData.siteContent?.home

      if (homeContent) {
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
          <span key={index}>
            {desc}
            {index < content.length - 1 && (
              <>
                <div className="w-1 h-1 bg-gray-500 rounded-full hidden sm:inline-block mx-4" />
                <br className="sm:hidden" />
              </>
            )}
          </span>
        ))}
      </div>
    )
  }

  // Handle string content
  return React.createElement(Component, { className }, content as string)
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Sidebar />
      <EnhancedAdminTrigger />

      {/* Animated grid background */}
      <div className="fixed inset-0 grid-bg animate-grid-move opacity-30" />
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black" />

      {/* Floating elements */}
      <div className="fixed top-1/4 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-float hidden sm:block" />
      <div
        className="fixed bottom-1/3 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse-slow hidden sm:block"
        style={{ animationDelay: "2s" }}
      />

      {/* Social Media Ticker - At the very top */}
      <div className="relative z-20 pt-4">
        <SocialTicker />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 w-full relative z-10 lg:ml-20">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 w-full max-w-6xl animate-fade-in-up">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Profile Photo - Mobile */}
            <div className="relative mb-6 animate-float">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-700/50">
                <Image
                  src="/profile-photo.jpg"
                  alt="Daghlar Mammadov"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full animate-pulse-slow" />
            </div>

            {/* Title - Mobile */}
            <div className="space-y-4 mb-8">
              <div className="text-3xl font-thin tracking-wider">
                <div>Hey,</div>
                <div>I'm</div>
              </div>
              <DynamicContent
                contentKey="title"
                defaultValue="Daghlar."
                as="h1"
                className="text-4xl font-thin tracking-wider"
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-center gap-6 lg:gap-12 mb-8 lg:mb-12">
            {/* Hey, I'm - Left Side */}
            <div className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-thin tracking-wider text-left">
              <div>Hey,</div>
              <div>I'm</div>
            </div>

            {/* Profile Photo - Center */}
            <div className="relative animate-float">
              <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full overflow-hidden border-4 border-gray-700/50">
                <Image
                  src="/profile-photo.jpg"
                  alt="Daghlar Mammadov"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full animate-pulse-slow" />
            </div>

            {/* Daghlar - Right Side */}
            <DynamicContent
              contentKey="title"
              defaultValue="Daghlar."
              as="h1"
              className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-thin tracking-wider"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <DynamicContent
              contentKey="subtitle"
              defaultValue="Computer Engineering Student"
              as="p"
              className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-light text-gray-300"
            />

            {/* Role descriptions - Now properly horizontal */}
            <DynamicContent
              contentKey="descriptions"
              defaultValue={["Cybersecurity Expert", "Software Developer", "AI Enthusiast"]}
              className="text-sm sm:text-base lg:text-lg text-gray-400"
            />
          </div>
        </div>

        {/* Unified Card Container - Mobile Optimized */}
        <DynamicCards />

        {/* Footer */}
        <div className="mt-8 sm:mt-12 lg:mt-20 text-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <div className="inline-flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gray-900/30 border border-gray-700/50 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse-slow" />
            <DynamicContent
              contentKey="footer"
              defaultValue="Nişantaşı University - Computer Engineering"
              as="p"
              className="text-gray-400 font-light text-xs sm:text-sm lg:text-base"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
