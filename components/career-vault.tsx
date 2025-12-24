"use client"

import React, { useState } from "react"
import { Search, GraduationCap, Briefcase, ExternalLink, ArrowRight, Zap, Target, TrendingUp, AlertCircle, Sparkles, Flame, BookOpen, CheckCircle, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { apiUrl } from "@/lib/api-url"
import { openLink } from "@/lib/browser"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Paper {
    title: string
    portalName: string
    description: string
}

interface CareerStats {
    companies: string[]
    roles: string[]
    marketDemand: number
    summary: string
}

interface YearlyChange {
    year: number
    mcqPercent: number
    theoryPercent: number
    avgDifficulty: number
}

interface Evolution {
    yearlyChanges: YearlyChange[]
    keyTrends: string[]
    prediction2025: {
        mcqPercent: number
        theoryPercent: number
        avgDifficulty: number
        newTopics: string[]
        tip: string
    }
}

interface PredictedQuestion {
    question: string
    chapter: string
    frequency: number
    lastAsked: number
    probability: number
    marks: number
    difficulty: string
}

interface ChapterImportance {
    chapter: string
    weightage: number
    mustStudyTopics: string[]
}

interface ImportantQuestions {
    predictedQuestions: PredictedQuestion[]
    chapterWiseImportance: ChapterImportance[]
    sureShots: string[]
    newPredictions: string[]
}

interface SearchResult {
    title: string
    url: string
    snippet: string
}

interface Results {
    papers: Paper[]
    career: CareerStats
    googleSearchUrl: string
    evolution: Evolution
    importantQuestions: ImportantQuestions
}

export default function CareerVaultUI() {
    const [institution, setInstitution] = useState("")
    const [grade, setGrade] = useState("")
    const [subject, setSubject] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchingPapers, setSearchingPapers] = useState(false)
    const [results, setResults] = useState<Results | null>(null)
    const [liveResults, setLiveResults] = useState<SearchResult[]>([])
    const router = useRouter()

    // In-app search function
    const searchPapersInApp = async () => {
        if (!institution || !grade || !subject) return

        setSearchingPapers(true)
        try {
            const query = `${institution} ${grade} ${subject} question paper PDF previous year`
            const response = await fetch(apiUrl("/api/search"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            })
            const data = await response.json()
            setLiveResults(data.results || [])
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setSearchingPapers(false)
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!institution || !grade || !subject) return

        setLoading(true)
        setLiveResults([])
        try {
            const response = await fetch(apiUrl("/api/papers/discover"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ institution, grade, subject }),
            })
            const data = await response.json()
            setResults(data)
            // Also trigger live search for actual papers
            searchPapersInApp()
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4"
                >
                    <Zap className="w-3 h-3" />
                    THE QUESTION VAULT
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold tech-heading mb-4 gradient-text">
                    Find Any Past Paper,<br />Launch Your Career
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Search for papers IN-APP and see how every topic connects to high-paying jobs.
                </p>
            </div>

            {/* Search Form */}
            <div className="tech-card p-6 mb-12">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-muted-foreground uppercase">Institution</label>
                        <input
                            type="text"
                            placeholder="CBSE, ICSE, VTU..."
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            className="w-full bg-background dark:bg-slate-900/50 border border-input dark:border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-muted-foreground uppercase">Grade</label>
                        <input
                            type="text"
                            placeholder="12th, 3rd Sem..."
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full bg-background dark:bg-slate-900/50 border border-input dark:border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-muted-foreground uppercase">Subject</label>
                        <input
                            type="text"
                            placeholder="Physics, DSA..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full bg-background dark:bg-slate-900/50 border border-input dark:border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            disabled={loading}
                            className="w-full tech-button-primary h-[46px] flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Search className="w-4 h-4" />SEARCH</>}
                        </button>
                    </div>
                </form>
            </div>

            <AnimatePresence mode="wait">
                {results && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                        {/* 📄 LIVE PAPER RESULTS - IN-APP SEARCH */}
                        <div className="tech-card p-6 border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/5">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-cyan-500/20">
                                        <Search className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            Live Paper Results
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">IN-APP</span>
                                        </h3>
                                        <p className="text-xs text-slate-500">Real-time search results from the web</p>
                                    </div>
                                </div>
                                {searchingPapers && (
                                    <div className="flex items-center gap-2 text-sm text-cyan-400">
                                        <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                                        Searching...
                                    </div>
                                )}
                            </div>

                            {liveResults.length > 0 ? (
                                <div className="space-y-3">
                                    {liveResults.map((result, idx) => (
                                        <motion.div
                                            key={idx}
                                            onClick={() => openLink(result.url)}
                                            whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                            whileTap={{ scale: 0.96 }}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="block p-4 rounded-lg bg-card/50 dark:bg-slate-900/50 border border-border dark:border-slate-800 hover:border-cyan-500/50 transition-all group cursor-pointer shadow-sm relative overflow-hidden"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-foreground group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors truncate mb-1">
                                                        {result.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{result.snippet}</p>
                                                    <p className="text-[10px] text-cyan-600 dark:text-cyan-500 mt-1 truncate">{result.url}</p>
                                                </div>
                                                <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm">
                                                    <ExternalLink className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    {searchingPapers ? (
                                        <p>Fetching papers from the web...</p>
                                    ) : (
                                        <div>
                                            <p className="mb-4">No results yet. Click below to search externally:</p>
                                            <button
                                                onClick={() => openLink(results.googleSearchUrl)}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Search on Google
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Question Evolution Timeline - NEW! */}
                        {results.evolution && results.evolution.yearlyChanges && (
                            <div className="tech-card p-6 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-purple-500/20">
                                        <TrendingUp className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Question Evolution Timeline</h3>
                                        <p className="text-xs text-slate-500">How exam patterns changed (2019-2024) & 2025 predictions</p>
                                    </div>
                                </div>

                                {/* Trend Visualization */}
                                <div className="grid grid-cols-5 gap-3 mb-6">
                                    {results.evolution.yearlyChanges.map((year, idx) => (
                                        <motion.div
                                            key={year.year}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="space-y-2"
                                        >
                                            <div className="text-[10px] font-mono text-slate-500 text-center">{year.year}</div>
                                            <div className="relative h-32 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${year.mcqPercent}%` }}
                                                    transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                                                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400"
                                                />
                                                <div className="absolute inset-0 flex flex-col justify-between p-2 text-[9px] font-bold text-white z-10">
                                                    <span>{year.mcqPercent}%</span>
                                                    <span className="text-slate-300">{year.theoryPercent}%</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500">
                                                <span>Diff:</span>
                                                <span className="text-amber-400">{year.avgDifficulty}/10</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Legend */}
                                <div className="flex gap-4 mb-6 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-gradient-to-t from-blue-600 to-blue-400" />
                                        <span className="text-slate-400">MCQs</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-slate-700" />
                                        <span className="text-slate-400">Theory</span>
                                    </div>
                                </div>

                                {/* Key Trends */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {results.evolution.keyTrends && (
                                        <div>
                                            <h4 className="text-sm font-mono text-slate-400 uppercase mb-3 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Key Trends
                                            </h4>
                                            <ul className="space-y-2">
                                                {results.evolution.keyTrends.map((trend, idx) => (
                                                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">▸</span>
                                                        {trend}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* 2025 Prediction */}
                                    {results.evolution.prediction2025 && (
                                        <div className="tech-card p-4 border-amber-500/30 bg-amber-500/5">
                                            <h4 className="text-sm font-mono text-amber-400 uppercase mb-3 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                2025 Prediction
                                            </h4>
                                            <div className="space-y-2 mb-3">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-400">MCQs</span>
                                                    <span className="text-blue-400 font-bold">{results.evolution.prediction2025.mcqPercent}%</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-400">Theory</span>
                                                    <span className="text-slate-300 font-bold">{results.evolution.prediction2025.theoryPercent}%</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-400">Difficulty</span>
                                                    <span className="text-amber-400 font-bold">{results.evolution.prediction2025.avgDifficulty}/10</span>
                                                </div>
                                            </div>
                                            {results.evolution.prediction2025.tip && (
                                                <div className="pt-3 border-t border-amber-500/20">
                                                    <p className="text-[11px] text-slate-300 italic">💡 {results.evolution.prediction2025.tip}</p>
                                                </div>
                                            )}
                                            {results.evolution.prediction2025.newTopics && results.evolution.prediction2025.newTopics.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-amber-500/20">
                                                    <span className="text-[10px] text-slate-500 uppercase block mb-2">New Topics to Watch</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {results.evolution.prediction2025.newTopics.map((topic, idx) => (
                                                            <span key={idx} className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 🔥 MOST IMPORTANT QUESTIONS PREDICTOR - THE KILLER FEATURE */}
                        {results.importantQuestions && (
                            <div className="tech-card p-6 border-red-500/30 bg-gradient-to-br from-red-500/5 to-orange-500/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-red-500/20 animate-pulse">
                                        <Flame className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            Most Important Questions
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono">AI PREDICTED</span>
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Questions most likely to appear in {new Date().getFullYear() + 1} based on 5-year analysis</p>
                                    </div>
                                </div>

                                {/* Sure-Shot Questions */}
                                {results.importantQuestions.sureShots && results.importantQuestions.sureShots.length > 0 && (
                                    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                                        <h4 className="text-sm font-mono text-green-400 uppercase mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Sure-Shot Questions (100% Repeat History)
                                        </h4>
                                        <ul className="space-y-2">
                                            {results.importantQuestions.sureShots.map((q, idx) => (
                                                <li key={idx} className="text-sm text-foreground dark:text-slate-200 flex items-start gap-2 bg-background dark:bg-slate-900/50 p-2 rounded border border-border dark:border-transparent">
                                                    <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                                    {q}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Predicted Questions Grid */}
                                {results.importantQuestions.predictedQuestions && results.importantQuestions.predictedQuestions.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-mono text-slate-400 uppercase mb-3">Top Predicted Questions</h4>
                                        <div className="space-y-3">
                                            {results.importantQuestions.predictedQuestions.slice(0, 5).map((q, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-start gap-3 sm:gap-4 p-3 rounded-lg bg-card/50 dark:bg-slate-900/50 border border-border dark:border-slate-800 hover:border-red-500/30 transition-colors shadow-sm"
                                                >
                                                    {/* Probability Badge */}
                                                    <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center ${q.probability >= 80 ? 'bg-red-500/20 border border-red-500/40' :
                                                        q.probability >= 60 ? 'bg-orange-500/20 border border-orange-500/40' :
                                                            'bg-yellow-500/20 border border-yellow-500/40'
                                                        }`}>
                                                        <span className={`text-lg font-bold ${q.probability >= 80 ? 'text-red-400' :
                                                            q.probability >= 60 ? 'text-orange-400' :
                                                                'text-yellow-400'
                                                            }`}>{q.probability}%</span>
                                                        <span className="text-[8px] text-slate-500">LIKELY</span>
                                                    </div>

                                                    {/* Question Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground dark:text-slate-200 mb-2">{q.question}</p>
                                                        <div className="flex flex-wrap gap-2 text-[10px]">
                                                            <span className="px-2 py-0.5 rounded bg-secondary dark:bg-slate-800 text-muted-foreground dark:text-slate-400 border border-border dark:border-slate-700">
                                                                📚 {q.chapter}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                                {q.frequency}/5 years
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                                {q.marks} marks
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded border ${q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                                q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                                                }`}>
                                                                {q.difficulty}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Chapter-wise Importance */}
                                {results.importantQuestions.chapterWiseImportance && results.importantQuestions.chapterWiseImportance.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-mono text-slate-400 uppercase mb-3 flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" />
                                            Chapter Weightage
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {results.importantQuestions.chapterWiseImportance.map((ch, idx) => (
                                                <div key={idx} className="p-3 rounded-lg bg-card/50 dark:bg-slate-900/50 border border-border dark:border-slate-800 shadow-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-semibold text-foreground/80 dark:text-slate-300">{ch.chapter}</span>
                                                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{ch.weightage}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${ch.weightage}%` }}
                                                            className="h-full bg-gradient-to-r from-orange-600 to-red-400"
                                                        />
                                                    </div>
                                                    {ch.mustStudyTopics && ch.mustStudyTopics.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {ch.mustStudyTopics.map((topic, tidx) => (
                                                                <span key={tidx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                                                    {topic}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Predictions */}
                                {results.importantQuestions.newPredictions && results.importantQuestions.newPredictions.length > 0 && (
                                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                        <h4 className="text-sm font-mono text-purple-400 uppercase mb-3 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" />
                                            New Questions Expected (Never Asked Before)
                                        </h4>
                                        <ul className="space-y-2">
                                            {results.importantQuestions.newPredictions.map((q, idx) => (
                                                <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                                    <span className="text-purple-400">⚡</span>
                                                    {q}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Portal Suggestions */}
                            <div className="lg:col-span-2 space-y-6">
                                {results.papers && results.papers.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-mono text-slate-500 uppercase">Trusted Portals:</h4>
                                        {results.papers.map((paper, idx) => (
                                            <div key={idx} className="tech-card p-4 hover:border-slate-700 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-slate-300 mb-1">{paper.portalName}</h5>
                                                        <p className="text-xs text-slate-500">{paper.description}</p>
                                                    </div>
                                                    <a
                                                        href={results.googleSearchUrl + ` site:${paper.portalName.toLowerCase().replace(/\s+/g, '')}.com`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="tech-button py-2 px-4 text-xs whitespace-nowrap"
                                                    >
                                                        <Search className="w-3 h-3 mr-2" />
                                                        SEARCH
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Career Impact */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold tech-heading flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-emerald-400" />
                                    Career Impact
                                </h3>
                                <div className="tech-card p-6 space-y-6 border-emerald-500/20 bg-emerald-500/5">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-mono text-slate-400">MARKET DEMAND</span>
                                            <span className="text-lg font-bold text-emerald-400">{results.career.marketDemand}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${results.career.marketDemand}%` }}
                                                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-[10px] font-mono text-slate-500 block mb-2 uppercase">Top Roles</span>
                                            <div className="flex flex-wrap gap-2">
                                                {results.career.roles.map((role, idx) => (
                                                    <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700">{role}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono text-slate-500 block mb-2 uppercase">Hiring Companies</span>
                                            <div className="flex flex-wrap gap-2">
                                                {results.career.companies.map((company, idx) => (
                                                    <span key={idx} className="px-2 py-1 rounded bg-emerald-500/10 text-[11px] text-emerald-400 border border-emerald-500/20">{company}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800">
                                        <p className="text-xs italic text-slate-400">"{results.career.summary}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
