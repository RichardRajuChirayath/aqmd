"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Share2, ArrowLeft, Loader2, Target, CheckCircle2, AlertCircle, Lightbulb, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { FixItStudio } from "@/components/fix-it-studio"

interface AnalysisResult {
    id: string
    intentScore: number
    mismatchType: string
    explanation: string
    expectedIntent: string
    suggestedReframe: string
    question: string
    answer: string
    createdAt: string
}

export default function ResultDetailPage() {
    const params = useParams()
    const id = params?.id as string
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchAnalysis() {
            if (!id) return
            try {
                const response = await fetch(`/api/analysis/${id}`)
                if (!response.ok) throw new Error("Analysis not found")
                const data = await response.json()
                setResult(data)
            } catch (err) {
                console.error("Error fetching analysis:", err)
                toast.error("Analysis not found")
                router.push("/")
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnalysis()
    }, [id, router])

    const handleShare = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        toast.success("Academic link copied!")
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className="w-12 h-12 text-primary opacity-20" />
                </motion.div>
                <p className="mt-4 font-serif italic text-muted-foreground animate-pulse">
                    Synthesizing academic evaluation...
                </p>
            </main>
        )
    }

    if (!result) return null

    const scoreColor = result.intentScore >= 80 ? "emerald" : result.intentScore >= 50 ? "amber" : "red"
    const ScoreIcon = result.intentScore >= 80 ? CheckCircle2 : result.intentScore >= 50 ? AlertCircle : Target

    return (
        <main className="min-h-screen bg-[#faf9f6] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12"
                >
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/history")}
                        className="group hover:bg-primary/5 text-muted-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Repository
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={handleShare} className="rounded-full px-4 border-primary/20">
                            <Share2 className="w-3.5 h-3.5 mr-2" /> Share
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-black/5 overflow-hidden"
                >
                    <div className="p-8 sm:p-12 border-b border-gray-50 bg-[#fdfdfd]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded">Official Release</span>
                                </div>
                                <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
                                    Academic Intent Analysis
                                </h1>
                                <p className="text-gray-500 font-serif italic text-lg leading-relaxed max-w-lg">
                                    A professional evaluation of alignment between student response and pedagogical intent.
                                </p>
                            </div>
                            <div className="text-left md:text-right shrink-0">
                                <div className="inline-block p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Evaluation ID</p>
                                    <p className="font-mono text-xs font-bold text-gray-900">{result.id.slice(0, 8).toUpperCase()}</p>
                                    <p className="text-[10px] font-medium text-gray-400 mt-2">{new Date(result.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-12 space-y-12">
                        <div className="grid lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-5 flex flex-col items-center">
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                                        <motion.circle
                                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - result.intentScore / 100) }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            cx="96" cy="96" r="88"
                                            stroke={result.intentScore >= 80 ? '#10b981' : result.intentScore >= 50 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="12"
                                            fill="transparent"
                                            strokeDasharray={2 * Math.PI * 88}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-5xl font-black tracking-tighter text-gray-900">{result.intentScore}</span>
                                        <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Percent Fit</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-7 space-y-4">
                                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${result.intentScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    result.intentScore >= 50 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-red-50 text-red-100 border-red-100'
                                    }`}>
                                    <ScoreIcon className="w-3.5 h-3.5" />
                                    {result.mismatchType}
                                </span>
                                <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight">
                                    Synthesis & Diagnostic Summary
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-lg font-serif italic text-justify">
                                    {result.explanation}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h4 className="flex items-center text-[11px] font-black uppercase tracking-widest text-primary/60">
                                        <Target className="w-3.5 h-3.5 mr-2" /> Academic Inquiry
                                    </h4>
                                    <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 text-gray-800 text-sm leading-relaxed font-serif italic shadow-inner">
                                        {result.question}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="flex items-center text-[11px] font-black uppercase tracking-widest text-primary/60">
                                        <Sparkles className="w-3.5 h-3.5 mr-2" /> Respondent Submission
                                    </h4>
                                    <div className="p-6 rounded-3xl bg-gray-50/50 border border-gray-100 text-gray-800 text-sm leading-relaxed font-serif shadow-inner">
                                        {result.answer}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h4 className="flex items-center text-[11px] font-black uppercase tracking-widest text-emerald-600/60">
                                        <Lightbulb className="w-3.5 h-3.5 mr-2" /> Pedagogical Correction
                                    </h4>
                                    <div className="p-8 rounded-[2rem] bg-emerald-50/20 border border-emerald-100/50 relative overflow-hidden group">
                                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                            <Sparkles className="w-24 h-24 text-emerald-600" />
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">Suggested Reframing</p>
                                        <p className="text-lg font-serif italic font-medium text-emerald-900 leading-relaxed">
                                            "{result.suggestedReframe}"
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="flex items-center text-[11px] font-black uppercase tracking-widest text-gray-400">
                                        <Target className="w-3.5 h-3.5 mr-2" /> Required Intent
                                    </h4>
                                    <div className="pl-6 border-l-4 border-primary/20">
                                        <p className="text-base text-gray-600 font-serif leading-relaxed italic">
                                            {result.expectedIntent}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Fix-It Studio Integration */}
                        <FixItStudio
                            question={result.question}
                            initialAnswer={result.answer}
                            initialScore={result.intentScore}
                        />

                        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-primary">AQ</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase">
                                    AQMD Intelligence Report • Confidential Academic Use
                                </p>
                            </div>
                            <p className="text-[9px] text-gray-300 font-mono italic">
                                Core Engine v2.4
                            </p>
                        </div>
                    </div>
                </motion.div>

                {result.intentScore < 70 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-12 p-8 rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 text-white shadow-2xl shadow-primary/20 flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
                    >
                        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm shadow-inner">
                            <Lightbulb className="w-12 h-12" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="text-2xl font-serif font-bold tracking-tight">Level Up Your Understanding</h3>
                            <p className="text-white/80 font-serif italic text-lg leading-relaxed">
                                It looks like there's a significant gap in intent. We've prepared a customized learning pathway to help you master this topic.
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="rounded-full px-8 h-14 text-primary font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                            onClick={() => router.push("/pathways")}
                        >
                            Explore Pathway
                        </Button>
                    </motion.div>
                )}
            </div>
        </main>
    )
}
