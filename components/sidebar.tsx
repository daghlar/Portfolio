"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, Home, Code, MessageSquare, FileText, Award, X, User } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/about", icon: User, label: "About" },
  { href: "/certificates", icon: Award, label: "Certificates" },
  { href: "/projects", icon: Code, label: "Projects" },
  { href: "/contact", icon: MessageSquare, label: "Contact" },
  { href: "/blog", icon: FileText, label: "Blog" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dClickCount, setDClickCount] = useState(0)
  const [lastDClick, setLastDClick] = useState(0)
  const pathname = usePathname()

  const handleAdminAccess = () => {
    const now = Date.now()

    // Reset counter if too much time has passed (2 seconds)
    if (now - lastDClick > 2000) {
      setDClickCount(1)
    } else {
      setDClickCount((prev) => prev + 1)
    }

    setLastDClick(now)

    // Show admin panel after 4 clicks
    if (dClickCount >= 3) {
      // 3 because we just incremented
      window.dispatchEvent(new CustomEvent("admin-panel-trigger"))
      setDClickCount(0)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden w-12 h-12 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex items-center justify-center"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Desktop Hover Trigger Zone */}
      <div className="hidden lg:block fixed left-0 top-0 w-4 h-full z-40" onMouseEnter={() => setIsOpen(true)} />

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-50 ${
          isOpen ? "w-20" : "w-0 overflow-hidden"
        }`}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="w-20 flex-col items-center py-8 bg-black/95 backdrop-blur-xl border-r border-gray-800/50 flex">
          {/* Logo with Admin Access - 4 clicks required */}
          <div className="mb-12">
            <button
              onClick={handleAdminAccess}
              className="w-12 h-12 bg-gray-900/50 border border-gray-700/50 rounded-2xl flex items-center justify-center animate-float backdrop-blur-sm hover:bg-gray-800/50 transition-colors relative"
            >
              <span className="text-white/90 font-light text-lg">D</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`
                      relative w-12 h-12 flex items-center justify-center rounded-xl transition-smooth group
                      ${isActive ? "bg-white text-black" : "hover:bg-gray-800/50 text-gray-400 hover:text-white"}
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="h-5 w-5" />

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                    )}

                    {/* Tooltip */}
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900/90 backdrop-blur-xl text-white text-sm opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none whitespace-nowrap rounded-lg border border-gray-700/50">
                      {item.label}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Bottom indicator */}
          <div className="mt-auto">
            <div className="w-1 h-12 bg-gradient-to-t from-transparent via-gray-600/50 to-transparent rounded-full animate-pulse-slow" />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-black/95 backdrop-blur-xl border-r border-gray-800/50 z-50 lg:hidden mobile-menu ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="flex flex-col p-8 pt-20">
          {/* Logo with Admin Access - 4 clicks required */}
          <div className="mb-12 flex items-center gap-4">
            <button
              onClick={handleAdminAccess}
              className="w-12 h-12 bg-gray-900/50 border border-gray-700/50 rounded-2xl flex items-center justify-center backdrop-blur-sm hover:bg-gray-800/50 transition-colors relative"
            >
              <span className="text-white/90 font-light text-lg">D</span>
            </button>
            <span className="text-2xl font-thin tracking-wide">Daghlar</span>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <div
                    className={`
                      flex items-center gap-4 p-4 rounded-xl transition-smooth
                      ${isActive ? "bg-white text-black" : "hover:bg-gray-800/50 text-gray-400 hover:text-white"}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-light">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
