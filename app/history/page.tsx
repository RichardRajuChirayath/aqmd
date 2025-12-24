"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGuestId } from "@/lib/guest-identity"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { apiUrl } from "@/lib/api-url"
import { motion } from "framer-motion"

interface HistoryItem {
  id: string
  question: string
  intentScore: number
  createdAt: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClearing, setIsClearing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const guestId = useGuestId()

  const fetchHistory = async () => {
    if (!guestId) return
    try {
      const response = await fetch(apiUrl(`/api/history?guestId=${encodeURIComponent(guestId)}`))
      if (!response.ok) {
        throw new Error("Failed to fetch history")
      }
      const data = await response.json()
      setHistory(data)
    } catch (err) {
      console.error("Error fetching history:", err)
      setError("Failed to load history")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [guestId])

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear all your history? This cannot be undone.")) {
      return
    }

    setIsClearing(true)
    try {
      const response = await fetch(apiUrl(`/api/clear-history?guestId=${encodeURIComponent(guestId)}`), {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to clear history")
      }

      const data = await response.json()
      setHistory([])
      toast.success(`Cleared ${data.deleted.analyses} analyses and ${data.deleted.pathways} pathways`)
    } catch (err) {
      console.error("Error clearing history:", err)
      toast.error("Failed to clear history")
    } finally {
      setIsClearing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    if (score >= 50) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateQuestion = (question: string, maxLength = 80) => {
    if (question.length <= maxLength) return question
    return question.substring(0, maxLength) + "..."
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <Loader2 className="w-6 h-6 animate-spin text-primary mr-3" />
        <p className="text-muted-foreground font-mono text-sm tracking-widest">DECRYPTING_HISTORY...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-1 space-y-8">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center lg:text-left mb-10">
          <h2 className="tech-label text-blue-600 dark:text-blue-400 mb-2">Diagnostic Archives</h2>
          <h1 className="text-3xl sm:text-4xl font-bold tech-heading mb-2 gradient-text">Analysis History</h1>
          <p className="text-muted-foreground text-sm">Review your past semantic alignment checks and improvement trends.</p>
        </div>

        {error ? (
          <div className="tech-card p-12 text-center">
            <p className="text-red-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="tech-button border-red-500/30 text-red-500 mx-auto"
            >
              RETRY_CONNECTION
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="tech-card p-12 text-center">
            <p className="text-muted-foreground mb-6">No diagnostic data found in local archives.</p>
            <button
              onClick={() => router.push("/")}
              className="tech-button-primary mx-auto"
            >
              START_FIRST_ANALYSIS
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearHistory}
                disabled={isClearing}
                className="text-[10px] font-mono uppercase tracking-widest text-red-500 hover:opacity-80 transition-opacity flex items-center gap-2"
              >
                {isClearing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
                PURGE_ARCHIVES
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ x: 5 }}
                  className="tech-card p-5 sm:p-6 cursor-pointer hover:border-primary/40 group relative overflow-hidden"
                  onClick={() => router.push(`/result/${item.id}`)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {truncateQuestion(item.question)}
                      </h3>
                      <p className="text-[10px] font-mono text-muted-foreground/60 tracking-wider">
                        {formatDate(item.createdAt)} • ID: {item.id.substring(0, 8)}
                      </p>
                    </div>
                    <div className={`self-start sm:self-center px-4 py-2 rounded-lg font-mono font-bold text-lg border ${getScoreColor(item.intentScore)}`}>
                      {item.intentScore}%
                    </div>
                  </div>
                  {/* Decorative faint background text for tech feel */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] select-none pointer-events-none font-mono text-6xl font-black rotate-[-15deg]">
                    HISTORY
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="tech-button"
          >
            ← RETURN_TO_TERMINAL
          </button>
        </div>
      </div>
    </main>
  )
}
