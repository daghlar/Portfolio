"use client"

import { useState, useEffect } from "react"
import { AdminLogin } from "./admin-login"
import { AdminPanel } from "./admin-panel"
import { SecurityManager } from "@/lib/security"
import { AdminStorage } from "@/lib/admin-storage"

export function AdminTrigger() {
  const [clickCount, setClickCount] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    // Check if already logged in
    if (SecurityManager.validateSession()) {
      setIsLoggedIn(true)
    }

    // Track visitor
    const visitorInfo = SecurityManager.getVisitorInfo()
    AdminStorage.addVisitorLog(visitorInfo)

    const handleClick = (e: MouseEvent) => {
      // Only trigger on footer clicks
      const target = e.target as HTMLElement
      if (target.closest("footer") || target.textContent?.includes("Nişantaşı University")) {
        setClickCount((prev) => {
          const newCount = prev + 1
          if (newCount === 4) {
            setShowLogin(true)
            return 0
          }
          return newCount
        })
      }
    }

    // Reset click count after 3 seconds of inactivity
    const resetTimer = setTimeout(() => {
      setClickCount(0)
    }, 3000)

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
      clearTimeout(resetTimer)
    }
  }, [clickCount])

  const handleLogin = (success: boolean) => {
    if (success) {
      SecurityManager.createSession()
      setIsLoggedIn(true)
      setShowLogin(false)
      setShowPanel(true)
    }
  }

  const handleLogout = () => {
    SecurityManager.destroySession()
    setIsLoggedIn(false)
    setShowPanel(false)
    setClickCount(0)
  }

  // Admin shortcut for logged in users
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isLoggedIn && e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault()
        setShowPanel(true)
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isLoggedIn])

  return (
    <>
      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      <AdminPanel isOpen={showPanel} onClose={handleLogout} />

      {/* Admin indicator for logged in users */}
      {isLoggedIn && !showPanel && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowPanel(true)}
            className="w-12 h-12 bg-red-600/20 border border-red-500/50 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-red-600/30 transition-all"
            title="Admin Panel (Ctrl+Shift+A)"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
        </div>
      )}
    </>
  )
}
