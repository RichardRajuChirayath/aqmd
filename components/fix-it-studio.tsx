
"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RefreshCcw, Sparkles, CheckCircle2, TrendingUp, Zap } from "lucide-react"
import debounce from "lodash.debounce"

interface FixItStudioProps {
    question: string
    initialAnswer: string
    initialScore: number
}

export function FixItStudio({ question, initialAnswer, initialScore }: FixItStudioProps) {
    const [answer, setAnswer] = useState(initialAnswer)
    const [score, setScore] = useState(initialScore)
    const [feedback, setFeedback] = useState("Edit your answer to see real-time improvement...")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [history, setHistory] = useState<{ score: number, time: number }[]>([])

    // Debounced analysis function
    const analyze = async (currentAnswer: string) => {
        setIsAnalyzing(true)
        try {
            const res = await fetch("/api/analyze-score", {
                method: "POST",
                body: JSON.stringify({ question, answer: currentAnswer, originalScore: initialScore })
            })
            const data = await res.json()

            if (data.score) {
                setScore(data.score)
                setFeedback(data.feedback)
                setHistory(prev => [...prev.slice(-10), { score: data.score, time: Date.now() }])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsAnalyzing(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedAnalyze = useCallback(debounce(analyze, 1200), [question])

    useEffect(() => {
        if (answer !== initialAnswer) {
            debouncedAnalyze(answer)
        }
    }, [answer, debouncedAnalyze, initialAnswer])

    const scoreColor = score >= 80 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-red-500"
    const scoreBg = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"

    return (
        <section className="mt-16 pt-16 border-t border-gray-100">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 animate-pulse">
                            <Zap className="w-3 h-3 mr-1" /> Live Beta
                        </Badge>
                        <h2 className="text-2xl font-serif font-bold text-gray-900">Live "Fix-It" Studio</h2>
                    </div>
                    <p className="text-gray-500 font-serif italic text-sm">
                        Don't just read the feedback. Apply it. Watch your score rise in real-time.
                    </p>
                </div>

                {/* Live Gauge */}
                <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-gray-400">Live Score</p>
                        <motion.span
                            key={score}
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-3xl font-black ${scoreColor}`}
                        >
                            {score}
                        </motion.span>
                    </div>
                    <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                            <motion.circle
                                animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - score / 100) }}
                                transition={{ type: "spring", stiffness: 50 }}
                                cx="32" cy="32" r="28"
                                stroke={score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"}
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 28}
                                strokeLinecap="round"
                            />
                        </svg>
                        {isAnalyzing && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <RefreshCcw className="w-4 h-4 animate-spin text-gray-400" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Editor */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Your Draft</label>
                        {score > initialScore && (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none transition-all">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +{score - initialScore} pts improved
                            </Badge>
                        )}
                    </div>
                    <div className="relative group">
                        <Textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="min-h-[250px] p-6 text-lg font-serif leading-relaxed resize-none rounded-xl border-gray-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner bg-gray-50/50"
                            placeholder="Start rewriting your answer..."
                        />
                        <div className="absolute bottom-4 right-4">
                            {isAnalyzing ? (
                                <span className="text-[10px] text-primary animate-pulse flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Analyzing...
                                </span>
                            ) : (
                                <span className="text-[10px] text-gray-400">Saved</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Live Feedback */}
                <div className="space-y-4">
                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">AI Coach</label>
                    <div className="h-full min-h-[250px] p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={feedback}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="z-10 max-w-sm"
                            >
                                {score >= 90 ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <p className="text-emerald-900 font-medium text-lg">Excellent! You've nailed the intent.</p>
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-600 font-serif italic leading-relaxed">
                                        "{feedback}"
                                    </p>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Background Decoration */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${score >= 80 ? 'emerald' : score >= 50 ? 'amber' : 'red'}-400 to-transparent opacity-20`} />
                    </div>
                </div>
            </div>
        </section>
    )
}
