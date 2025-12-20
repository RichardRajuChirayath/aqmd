"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LoadingFlow } from "@/components/loading-flow"
import { useGuestId } from "@/lib/guest-identity"
import { apiUrl } from "@/lib/api-url"

export default function HomePage() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const guestId = useGuestId()

  const handleAnalyze = async () => {
    if (!question.trim() || !answer.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(apiUrl("/api/analyze-intent"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, guestId }),
      })

      const data = await response.json()

      if (data.id) {
        // Redirect to the new dynamic shareable page
        router.push(`/result/${data.id}`)
      } else {
        // Fallback for session storage if no DB ID (shouldn't happen now)
        sessionStorage.setItem("analysisResult", JSON.stringify({ ...data, question, answer }))
        router.push("/result")
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      // We don't set isLoading(false) immediately because the navigation 
      // is taking place and we want to keep the loading screen visible
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-xl glass-card overflow-hidden">
          <LoadingFlow />
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4 tracking-tight">
            AQMD – Answer–Question Mismatch Detector
          </h1>
          <p className="text-muted-foreground text-lg">AI-powered precision assessment for educational content.</p>
        </div>

        <Card className="glass-card animate-float border-primary/10">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Start Analysis</CardTitle>
            <CardDescription className="text-base">
              Enter the context below for a deep semantic alignment check.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="question" className="text-sm font-semibold text-primary/80">
                The Question
              </Label>
              <Textarea
                id="question"
                placeholder="What exactly was asked?"
                className="min-h-[120px] resize-none text-base border-primary/5 focus:border-primary/20"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="answer" className="text-sm font-semibold text-primary/80">
                The Student's Response
              </Label>
              <Textarea
                id="answer"
                placeholder="How did they answer it?"
                className="min-h-[160px] resize-none text-base border-primary/5 focus:border-primary/20"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!question.trim() || !answer.trim() || isLoading}
              className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-primary/20 transition-all"
              size="lg"
            >
              Start AI Analysis
            </Button>
          </CardContent>
        </Card>

        <div className="mt-12 text-center flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-8">
            <a
              href="/history"
              className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-8 flex items-center gap-2"
            >
              Review Analysis History
            </a>
            <a
              href="/pathways"
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-8 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Try Learning Pathway Mapper
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
