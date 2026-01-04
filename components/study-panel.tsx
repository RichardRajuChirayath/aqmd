"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    Lightbulb,
    MessageCircle,
    CheckCircle2,
    XCircle,
    Send,
    Loader2,
    Sparkles,
    BookOpen
} from "lucide-react"

interface ReflectionQuestion {
    question: string
    expectedAnswer: string
    userAnswer?: string
    isCorrect?: boolean
}

interface StudyPanelProps {
    isOpen: boolean
    onClose: () => void
    pageNumber: number
    summary: string | null
    questions: ReflectionQuestion[]
    studyTip: string | null
    helpResponse: {
        greeting: string
        explanation: string
        keyTakeaway: string
        encouragement: string
    } | null
    isLoadingHelp: boolean
    onSubmitAnswer: (questionIndex: number, answer: string) => void
}

export default function StudyPanel({
    isOpen,
    onClose,
    pageNumber,
    summary,
    questions,
    studyTip,
    helpResponse,
    isLoadingHelp,
    onSubmitAnswer
}: StudyPanelProps) {
    const [answers, setAnswers] = useState<{ [key: number]: string }>({})
    const [activeTab, setActiveTab] = useState<"summary" | "questions" | "help">("summary")

    const handleAnswerChange = (index: number, value: string) => {
        setAnswers(prev => ({ ...prev, [index]: value }))
    }

    const handleSubmit = (index: number) => {
        if (answers[index]?.trim()) {
            onSubmitAnswer(index, answers[index])
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-40 flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                        <div>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-400" />
                                Study Panel
                            </h2>
                            <p className="text-xs text-slate-500 font-mono">Page {pageNumber}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-800">
                        {[
                            { id: "summary", label: "Summary", icon: BookOpen },
                            { id: "questions", label: "Questions", icon: MessageCircle },
                            { id: "help", label: "AI Help", icon: Lightbulb }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                                    : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content - Scrollable area */}
                    <div
                        className="flex-1 p-6"
                        style={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            maxHeight: 'calc(100vh - 180px)' // Account for header and tabs
                        }}
                    >
                        {/* Summary Tab */}
                        {activeTab === "summary" && (
                            <div className="space-y-6">
                                {summary ? (
                                    <>
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-mono text-slate-400 uppercase flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Page Summary
                                            </h3>
                                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                                <p className="text-slate-200 leading-relaxed">{summary}</p>
                                            </div>
                                        </div>

                                        {studyTip && (
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-mono text-slate-400 uppercase flex items-center gap-2">
                                                    <Lightbulb className="w-4 h-4" />
                                                    Study Tip
                                                </h3>
                                                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-600/30">
                                                    <p className="text-amber-200">💡 {studyTip}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
                                        <p className="text-slate-400">No summary yet</p>
                                        <p className="text-xs text-slate-500 mt-1">Mark the page as done to generate a summary</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Questions Tab */}
                        {activeTab === "questions" && (
                            <div className="space-y-6">
                                {questions.length > 0 ? (
                                    questions.map((q, index) => (
                                        <div key={index} className="space-y-3">
                                            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                                <p className="text-slate-200 font-medium mb-3">
                                                    Q{index + 1}: {q.question}
                                                </p>

                                                {q.isCorrect !== undefined ? (
                                                    <div className={`p-3 rounded-lg ${q.isCorrect ? "bg-green-600/20 border border-green-600/40" : "bg-red-600/20 border border-red-600/40"}`}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {q.isCorrect ? (
                                                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                            ) : (
                                                                <XCircle className="w-5 h-5 text-red-400" />
                                                            )}
                                                            <span className={q.isCorrect ? "text-green-400" : "text-red-400"}>
                                                                {q.isCorrect ? "Correct!" : "Not quite..."}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-400">
                                                            Expected: {q.expectedAnswer}
                                                        </p>
                                                    </div>
                                                ) : q.userAnswer && q.isCorrect === undefined ? (
                                                    // Loading state - answer submitted but waiting for AI
                                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-600/10 border border-blue-600/30">
                                                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                                        <span className="text-blue-400 text-sm">Checking your answer...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Your answer..."
                                                            value={answers[index] || ""}
                                                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter' && answers[index]?.trim()) {
                                                                    handleSubmit(index)
                                                                }
                                                            }}
                                                            className="flex-1 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none text-sm"
                                                        />
                                                        <button
                                                            onClick={() => handleSubmit(index)}
                                                            disabled={!answers[index]?.trim()}
                                                            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <MessageCircle className="w-12 h-12 text-slate-600 mb-4" />
                                        <p className="text-slate-400">No questions yet</p>
                                        <p className="text-xs text-slate-500 mt-1">Complete the page to get reflection questions</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* AI Help Tab */}
                        {activeTab === "help" && (
                            <div className="space-y-4">
                                {isLoadingHelp ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
                                        <p className="text-slate-400">Your AI tutor is thinking...</p>
                                    </div>
                                ) : helpResponse ? (
                                    <>
                                        <div className="p-4 rounded-xl bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-600/30">
                                            <p className="text-green-300 font-medium">{helpResponse.greeting}</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                                                {helpResponse.explanation}
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/30">
                                            <p className="text-xs text-slate-400 uppercase mb-2">Key Takeaway</p>
                                            <p className="text-blue-300 font-medium">📌 {helpResponse.keyTakeaway}</p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-600/30">
                                            <p className="text-amber-300 italic">{helpResponse.encouragement}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Lightbulb className="w-12 h-12 text-slate-600 mb-4" />
                                        <p className="text-slate-400">Need help?</p>
                                        <p className="text-xs text-slate-500 mt-1">Click "I'm Stuck" to get AI assistance</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
