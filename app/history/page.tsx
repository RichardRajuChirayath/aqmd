"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGuestId } from "@/lib/guest-identity"

interface HistoryItem {
  id: string
  question: string
  intentScore: number
  createdAt: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const guestId = useGuestId()

  useEffect(() => {
    if (!guestId) return // Wait for guestId to be available

    async function fetchHistory() {
      try {
        const response = await fetch(`/api/history?guestId=${encodeURIComponent(guestId)}`)
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

    fetchHistory()
  }, [guestId])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200"
    if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-red-100 text-red-800 border-red-200"
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
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading history...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">Analysis History</h1>
          <p className="text-muted-foreground">Your last 3 analyses are shown below.</p>
        </div>

        {error ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        ) : history.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No analyses yet.</p>
              <Button onClick={() => router.push("/")}>Start Your First Analysis</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <Card
                key={item.id}
                className="glass-card cursor-pointer hover:border-primary/20 transition-colors"
                onClick={() => router.push(`/result/${item.id}`)}
              >
                <CardHeader className="pb-3 px-6 pt-6">
                  <div className="flex items-start justify-between gap-6">
                    <CardTitle className="font-serif text-lg font-medium leading-relaxed">
                      {truncateQuestion(item.question)}
                    </CardTitle>
                    <Badge variant="outline" className={`px-4 py-1 font-semibold ${getScoreColor(item.intentScore)}`}>
                      {item.intentScore}%
                    </Badge>
                  </div>
                  <CardDescription className="text-xs font-mono mt-2">{formatDate(item.createdAt)}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Analyze
          </Button>
        </div>
      </div>
    </main>
  )
}
