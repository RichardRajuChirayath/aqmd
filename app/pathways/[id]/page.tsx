"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft, Share2, Loader2, BookOpen, Unlock, Link2,
    AlertTriangle, GraduationCap, SkipForward, ListOrdered, Trophy, Route
} from "lucide-react"
import { toast } from "sonner"
import { apiUrl } from "@/lib/api-url"

interface CrossSubjectLink {
    subject: string
    connection: string
}

interface CommonMistake {
    mistake: string
    correction: string
}

interface LearningStep {
    step: number
    topic: string
    description: string
}

interface PathwayData {
    id: string
    topic: string
    conceptOverview: string
    easyLearningTips: string[]
    prerequisites: string[]
    unlocks: string[]
    crossSubjectLinks: CrossSubjectLink[]
    commonMistakes: CommonMistake[]
    examRelevance: string
    safeToSkip: string[]
    learningOrder: LearningStep[]
    masteryRule: string
    createdAt: string
}

export default function PathwayResultPage() {
    const { id } = useParams()
    const [pathway, setPathway] = useState<PathwayData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchPathway() {
            try {
                const response = await fetch(apiUrl(`/api/pathway/${id}`))
                if (!response.ok) throw new Error("Pathway not found")
                const data = await response.json()
                setPathway(data)
            } catch (err) {
                console.error("Error fetching pathway:", err)
                toast.error("Pathway not found")
                router.push("/pathways")
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchPathway()
    }, [id, router])

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading pathway...</span>
            </main>
        )
    }

    if (!pathway) return null

    return (
        <main className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => router.push("/pathways")} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Pathways
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                        <Share2 className="w-4 h-4" /> Share
                    </Button>
                </div>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                        <Route className="w-4 h-4" />
                        Learning Pathway
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-2 tracking-tight">
                        {pathway.topic}
                    </h1>
                    <p className="text-muted-foreground">Your complete study blueprint</p>
                </div>

                {/* Concept Explanation (Primary addition) */}
                <Card className="glass-card mb-8 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-2xl font-serif flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-primary" />
                            Deep Concept Explanation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                {pathway.conceptOverview}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Easy Learning Tips */}
                {pathway.easyLearningTips && pathway.easyLearningTips.length > 0 && (
                    <Card className="glass-card mb-8 border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/5">
                        <CardHeader>
                            <CardTitle className="text-xl font-serif flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                                <span className="text-2xl">💡</span>
                                Easy Ways to Learn This
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {pathway.easyLearningTips.map((tip, i) => (
                                    <li key={i} className="flex gap-3 items-start p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm leading-relaxed text-foreground/80">{tip}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Prerequisites */}
                    <Card className="glass-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-serif flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-amber-500" />
                                Required Prerequisites
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {pathway.prerequisites.length > 0 ? (
                                    pathway.prerequisites.map((prereq, i) => (
                                        <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">{prereq}</Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No prerequisites — you can start here!</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Unlocks */}
                    <Card className="glass-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-serif flex items-center gap-2">
                                <Unlock className="w-5 h-5 text-emerald-500" />
                                What This Unlocks
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {pathway.unlocks.length > 0 ? (
                                    pathway.unlocks.map((unlock, i) => (
                                        <Badge key={i} variant="outline" className="px-3 py-1 text-sm border-emerald-200 text-emerald-700">{unlock}</Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">This is a foundational topic.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cross-Subject Links */}
                    <Card className="glass-card md:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-serif flex items-center gap-2">
                                <Link2 className="w-5 h-5 text-blue-500" />
                                Cross-Subject Connections
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {pathway.crossSubjectLinks.length > 0 ? (
                                    pathway.crossSubjectLinks.map((link, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                            <p className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase mb-1">{link.subject}</p>
                                            <p className="text-sm text-foreground/80">{link.connection}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No cross-links available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Common Mistakes */}
                    <Card className="glass-card md:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-serif flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Common Conceptual Mistakes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pathway.commonMistakes.length > 0 ? (
                                    pathway.commonMistakes.map((item, i) => (
                                        <div key={i} className="grid sm:grid-cols-2 gap-4 p-3 rounded-lg border border-red-500/20 bg-red-500/10">
                                            <div>
                                                <p className="text-xs font-bold text-red-500 dark:text-red-400 uppercase mb-1">Mistake</p>
                                                <p className="text-sm text-foreground/80">{item.mistake}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400 uppercase mb-1">Correction</p>
                                                <p className="text-sm text-foreground/80">{item.correction}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No common mistakes identified.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exam Relevance */}
                    <Card className="glass-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-serif flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                                Exam Relevance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-foreground/80">{pathway.examRelevance}</p>
                        </CardContent>
                    </Card>

                    {/* Safe to Skip */}
                    <Card className="glass-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-serif flex items-center gap-2">
                                <SkipForward className="w-5 h-5 text-gray-500" />
                                Safe to Skip (For Now)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {pathway.safeToSkip.length > 0 ? (
                                    pathway.safeToSkip.map((skip, i) => (
                                        <Badge key={i} variant="outline" className="px-3 py-1 text-sm text-gray-500 border-gray-200">{skip}</Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">Everything listed is important!</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ideal Learning Order */}
                    <Card className="glass-card md:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-serif flex items-center gap-2">
                                <ListOrdered className="w-5 h-5 text-indigo-500" />
                                Ideal Learning Order
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-3">
                                {pathway.learningOrder.length > 0 ? (
                                    pathway.learningOrder.map((step) => (
                                        <li key={step.step} className="flex gap-4 items-start p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                                                {step.step}
                                            </span>
                                            <div>
                                                <p className="font-medium text-foreground">{step.topic}</p>
                                                <p className="text-sm text-foreground/70">{step.description}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">Learning order not available.</p>
                                )}
                            </ol>
                        </CardContent>
                    </Card>

                    {/* Mastery Rule */}
                    <Card className="glass-card md:col-span-2 bg-amber-500/10 border-amber-500/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-serif flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                The Mastery Rule
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-base font-medium text-foreground italic">"{pathway.masteryRule}"</p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">If you can do this, you've truly mastered {pathway.topic}.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
