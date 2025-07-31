"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Shield, Trash2, Download, RefreshCw } from "lucide-react"
import { SecurityEnhancements } from "@/lib/security-enhancements"

interface SecurityLogsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SecurityLogsModal({ isOpen, onClose }: SecurityLogsModalProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (isOpen) {
      loadLogs()
    }
  }, [isOpen])

  const loadLogs = () => {
    setIsLoading(true)
    try {
      const securityLogs = SecurityEnhancements.getSecurityLogs()
      setLogs(securityLogs)
    } catch (error) {
      console.error("Error loading security logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    SecurityEnhancements.clearSecurityLogs()
    setLogs([])
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `security-logs-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getEventIcon = (event: string) => {
    switch (event) {
      case "login_success":
        return "🟢"
      case "login_failed":
        return "🟡"
      case "login_locked_out":
        return "🔴"
      case "xss_detected":
        return "⚠️"
      case "rate_limit_exceeded":
        return "🚫"
      default:
        return "ℹ️"
    }
  }

  const getEventColor = (event: string) => {
    switch (event) {
      case "login_success":
        return "text-green-400"
      case "login_failed":
        return "text-yellow-400"
      case "login_locked_out":
        return "text-red-400"
      case "xss_detected":
        return "text-orange-400"
      case "rate_limit_exceeded":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  const filteredLogs = logs.filter(log => {
    if (filter === "all") return true
    return log.event === filter
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Güvenlik Logları
            </h2>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">Tümü</option>
                <option value="login_success">Başarılı Giriş</option>
                <option value="login_failed">Başarısız Giriş</option>
                <option value="login_locked_out">Hesap Kilitlendi</option>
                <option value="xss_detected">XSS Tespit Edildi</option>
                <option value="rate_limit_exceeded">Rate Limit Aşıldı</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLogs}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              <Trash2 className="w-4 h-4" />
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
            ) : filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <Shield className="w-8 h-8 mr-2" />
                Henüz güvenlik logu bulunmuyor
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getEventIcon(log.event)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${getEventColor(log.event)}`}>
                              {log.event.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleString('tr-TR')}
                            </span>
                          </div>
                          {log.details && (
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                              <pre className="whitespace-pre-wrap text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          )}
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <div>IP: {log.details?.ipAddress || 'Bilinmiyor'}</div>
                            <div>User Agent: {log.userAgent}</div>
                            <div>URL: {log.url}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 