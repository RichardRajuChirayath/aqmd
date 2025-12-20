"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AnalysisResult {
  intentScore: number
  mismatchType: string
  explanation: string
  expectedIntent: string
  suggestedReframe: string
  question: string
  answer: string
}

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult")
    if (stored) {
      setResult(JSON.parse(stored))
    } else {
      router.push("/")
    }
  }, [router])

  if (!result) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200"
    if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Strong Match"
    if (score >= 50) return "Partial Match"
    return "Weak Match"
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">Analysis Result</h1>
          <p className="text-muted-foreground">Review the intent match analysis below.</p>
        </div>

        <div className="grid gap-6">
          {/* Intent Match Score */}
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">Intent Match Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted/20"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - result.intentScore / 100)}
                      className={result.intentScore >= 80 ? "text-emerald-500" : result.intentScore >= 50 ? "text-amber-500" : "text-red-500"}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold">{result.intentScore}%</span>
                </div>
                <div>
                  <Badge variant="outline" className={`px-4 py-1 text-sm font-medium mb-2 ${getScoreColor(result.intentScore)}`}>
                    {getScoreLabel(result.intentScore)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">The score represents the semantic alignment between the question and answer.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mismatch Type & Explanation */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg">Mismatch Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-semibold text-lg">{result.mismatchType}</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg">Expected Intent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{result.expectedIntent}</p>
              </CardContent>
            </Card>
          </div>

          {/* Explanation */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">In-Depth Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
            </CardContent>
          </Card>

          {/* Suggested Reframe */}
          <Card className="glass-card bg-primary/5 dark:bg-primary/10 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg text-primary">Suggested Reframe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background/50 p-4 rounded-lg border border-primary/10">
                <p className="text-foreground leading-relaxed italic">"{result.suggestedReframe}"</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push("/")}>
            Analyze Another
          </Button>
          <Button variant="outline" onClick={() => router.push("/history")}>
            View History
          </Button>
        </div>
      </div>
    </main>
  )
}
