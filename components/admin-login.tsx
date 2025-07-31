"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, AlertTriangle, Lock, Clock } from "lucide-react"
import { SecurityManager } from "@/lib/security"
import { AdminStorage } from "@/lib/admin-storage"
import { SecurityEnhancements } from "@/lib/security-enhancements"

interface AdminLoginProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (success: boolean) => void
}

export function AdminLogin({ isOpen, onClose, onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<number>(0)

  const handleLogin = () => {
    const visitorInfo = SecurityManager.getVisitorInfo()
    const ipAddress = visitorInfo.ip || "unknown"

    const loginCheck = SecurityEnhancements.checkLoginAttempts(ipAddress)
    if (!loginCheck.canLogin) {
      setIsLocked(true)
      setLockoutTime(loginCheck.remainingTime || 0)
      setError(`Too many failed attempts. Please try again in ${Math.ceil((loginCheck.remainingTime || 0) / 60000)} minutes.`)
      SecurityEnhancements.logSecurityEvent("login_locked_out", { ipAddress, remainingTime: loginCheck.remainingTime })
      return
    }

    const adminData = AdminStorage.getData()
    const correctPassword = adminData?.security?.adminPassword || "Xzaqwe1234+"

    if (password === correctPassword) {
      SecurityEnhancements.recordLoginAttempt(ipAddress, true)
      SecurityEnhancements.updateLastActivity()
      SecurityEnhancements.logSecurityEvent("login_success", { ipAddress })
      onLogin(true)
      setPassword("")
      setError("")
      setAttempts(0)
      setIsLocked(false)
    } else {
      SecurityEnhancements.recordLoginAttempt(ipAddress, false)
      SecurityEnhancements.logSecurityEvent("login_failed", { ipAddress, attempts: attempts + 1 })
      setAttempts((prev) => prev + 1)
      setError(`Yanlış şifre! Deneme: ${attempts + 1}/5`)
      setPassword("")

      if (attempts >= 4) {
        setIsLocked(true)
        setLockoutTime(15 * 60 * 1000)
        setTimeout(() => {
          onClose()
          setAttempts(0)
          setError("")
          setIsLocked(false)
        }, 15 * 60 * 1000)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-2xl p-8 w-full max-w-md backdrop-blur-xl shadow-2xl">
        {/* Header with Shield Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-black border border-gray-800 rounded-xl flex items-center justify-center mb-4 relative">
            <Shield className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
          <p className="text-gray-400 text-sm text-center">Enter credentials to access admin panel</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-3">Security Key</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLocked && handleLogin()}
              className="bg-black border-gray-800 text-white placeholder-gray-500 h-12 font-mono"
              placeholder="Enter admin security key..."
              disabled={isLocked}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm font-medium bg-red-900/20 border border-red-800/30 rounded-lg p-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
              {lockoutTime > 0 && (
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <Clock className="w-3 h-3" />
                  {Math.ceil(lockoutTime / 60000)} minutes remaining
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleLogin}
              className="flex-1 bg-white text-black hover:bg-gray-100 font-medium h-12"
              disabled={isLocked || attempts >= 3}
            >
              <Lock className="w-4 h-4 mr-2" />
              {isLocked ? "Access Locked" : "Access System"}
            </Button>
            <Button
              onClick={onClose}
              className="bg-black border border-gray-800 text-white hover:bg-gray-900 font-medium h-12 px-6"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
