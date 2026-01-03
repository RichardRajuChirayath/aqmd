"use client"

import { useState } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import {
    BookOpen,
    CheckCircle,
    HelpCircle,
    ChevronUp,
    ChevronDown,
    Sparkles,
    Loader2,
    GripVertical
} from "lucide-react"

interface StudyBubbleProps {
    currentPage: number
    totalPages: number
    isPageParsed: boolean
    isAnalyzing: boolean
    onMarkDone: () => void
    onNeedHelp: () => void
    onTogglePanel: () => void
    isPanelOpen: boolean
}

export default function StudyBubble({
    currentPage,
    totalPages,
    isPageParsed,
    isAnalyzing,
    onMarkDone,
    onNeedHelp,
    onTogglePanel,
    isPanelOpen
}: StudyBubbleProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const dragControls = useDragControls()

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0.1}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
        >
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse" />

                {/* Main Bubble */}
                <div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header - Always Visible */}
                    <div
                        className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-800 cursor-move"
                        onPointerDown={(e) => dragControls.start(e)}
                    >
                        <GripVertical className="w-4 h-4 text-slate-500" />
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                            <span className="font-bold text-sm">Study Companion</span>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="ml-auto p-1 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                {/* Page Progress */}
                                <div className="px-4 py-3 border-b border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-mono text-slate-400">CURRENT PAGE</span>
                                        <span className="text-lg font-bold text-blue-400">
                                            {currentPage} / {totalPages}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                                        <span>Progress</span>
                                        <span>{Math.round((currentPage / totalPages) * 100)}%</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="p-4 space-y-2">
                                    {/* Done with this page */}
                                    <button
                                        onClick={onMarkDone}
                                        disabled={isAnalyzing}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Done with this page
                                            </>
                                        )}
                                    </button>

                                    {/* I'm Stuck */}
                                    <button
                                        onClick={onNeedHelp}
                                        disabled={isAnalyzing || !isPageParsed}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <HelpCircle className="w-5 h-5" />
                                        I'm Stuck
                                    </button>

                                    {/* Show Summary Panel */}
                                    <button
                                        onClick={onTogglePanel}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${isPanelOpen
                                                ? "bg-purple-600 border-purple-500 text-white"
                                                : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                                            }`}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        {isPanelOpen ? "Hide Study Panel" : "Show Study Panel"}
                                    </button>
                                </div>

                                {/* Status Indicator */}
                                <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                        <div className={`w-2 h-2 rounded-full ${isPageParsed ? "bg-green-500" : "bg-amber-500"} animate-pulse`} />
                                        {isPageParsed ? "Page text extracted" : "Extracting text..."}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}
