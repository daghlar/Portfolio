"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, Lock } from "lucide-react"
import { ComprehensiveAdminPanel } from "./comprehensive-admin-panel"

export function EnhancedAdminTrigger() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0)
  const [dKeyPresses, setDKeyPresses] = useState(0)
  const [lastDKeyPress, setLastDKeyPress] = useState(0)

  const ADMIN_PASSWORD = "Xzaqwe1234+"
  const MAX_ATTEMPTS = 5
  const LOCK_DURATION = 15 * 60 * 1000
  const D_KEY_TIMEOUT = 2000

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // e.key kontrolü eklendi
      if (!e.key) return

      if (e.key.toLowerCase() === "d") {
        const now = Date.now()
        if (now - lastDKeyPress > D_KEY_TIMEOUT) {
          setDKeyPresses(1)
        } else {
          setDKeyPresses((prev) => prev + 1)
        }
        setLastDKeyPress(now)

        // 4 kere basıldığında tetikle
        if (dKeyPresses + 1 >= 4) {
          setIsVisible(true)
          setDKeyPresses(0)
        }
      }
    }

    // Admin trigger event listener'ını da ekle
    const handleAdminTrigger = () => {
      setIsVisible(true)
      setDKeyPresses(0)
    }

    // Event listener'ları ekle
    document.addEventListener("keydown", handleKeyPress)
    window.addEventListener("admin-panel-trigger", handleAdminTrigger)

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
      window.removeEventListener("admin-panel-trigger", handleAdminTrigger)
    }
  }, [dKeyPresses, lastDKeyPress])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) return

    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      setPassword("")
      setLoginAttempts(0)
    } else {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      setPassword("")

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true)
        setLockTimeRemaining(LOCK_DURATION)
        setTimeout(() => {
          setIsLocked(false)
          setLoginAttempts(0)
        }, LOCK_DURATION)
      }
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsVisible(false)
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
          {!isLoggedIn ? (
            <div className="bg-black border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 font-mono">
              <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-black border border-gray-800 rounded-xl flex items-center justify-center mb-4 relative">
                  <Shield className="w-8 h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
                <p className="text-gray-400 text-sm text-center">Enter credentials to access admin panel</p>
              </div>

              {isLocked ? (
                <div className="text-center space-y-6">
                  <div className="bg-red-900/20 border border-red-500/30 text-white p-4 rounded-lg">
                    <p className="text-sm mb-2 flex items-center justify-center gap-2 text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      ACCESS DENIED
                    </p>
                    <p className="text-xs text-gray-400">RETRY IN {formatTime(lockTimeRemaining)}</p>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="w-full bg-black border border-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">Security Key</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 font-mono h-12"
                      placeholder="Enter admin security key..."
                      required
                      autoFocus
                    />
                  </div>

                  {loginAttempts > 0 && (
                    <div className="bg-red-900/20 border border-red-500/30 text-white p-3 rounded-lg">
                      <p className="text-xs flex items-center justify-center gap-2 text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        INVALID CREDENTIALS • {MAX_ATTEMPTS - loginAttempts} ATTEMPTS REMAINING
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-white text-black py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center justify-center gap-2 h-12"
                      disabled={isLocked}
                    >
                      <Lock className="w-4 h-4" />
                      Access System
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsVisible(false)}
                      className="px-6 bg-black border border-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium h-12"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <ComprehensiveAdminPanel isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          )}
        </div>
      )}
    </>
  )
}
