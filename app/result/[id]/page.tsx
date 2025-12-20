"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import html2pdf from "html2pdf.js"

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
    const { id } = useParams()
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const reportRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        async function fetchAnalysis() {
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

        if (id) fetchAnalysis()
    }, [id, router])

    const handleDownloadPDF = async () => {
        if (!reportRef.current || !result) return

        setIsExporting(true)
        try {
            // Wait for fonts to be ready to prevent rendering issues
            await document.fonts.ready

            // Add a small delay to ensure any dynamic content is rendered
            await new Promise(r => setTimeout(r, 600))

            const element = reportRef.current
            const opt = {
                margin: 10,
                filename: `AQMD-Report-${result.id.slice(0, 8)}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: "#ffffff",
                },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            }

            // New approach using html2pdf.js wrapper
            await html2pdf().set(opt).from(element).save()

            toast.success("Report downloaded successfully")
        } catch (err) {
            console.error("PDF Export error:", err)
            toast.error("Failed to generate PDF")
        } finally {
            setIsExporting(false)
        }
    }

    const handleShare = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading report...</span>
            </main>
        )
    }

    if (!result) return null

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
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => router.push("/history")} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to History
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                            <Share2 className="w-4 h-4" /> Share
                        </Button>
                        <Button size="sm" onClick={handleDownloadPDF} disabled={isExporting} className="gap-2">
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {isExporting ? "Exporting..." : "Download Report"}
                        </Button>
                    </div>
                </div>

                <div ref={reportRef} className="p-8 bg-white rounded-xl shadow-2xl space-y-8 border border-gray-200">
                    {/* Brand Header (Visible in PDF) */}
                    <div className="border-b border-gray-100 pb-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-gray-900">AQMD Analysis Report</h1>
                            <p className="text-sm text-gray-500 mt-1">Answer–Question Mismatch Detector</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400">ID: {result.id}</p>
                            <p className="text-[10px] text-gray-400">{new Date(result.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 text-gray-800">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Original Inputs</h2>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-blue-600 uppercase">Question</p>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                                    {result.question}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-blue-600 uppercase">Student Answer</p>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                                    {result.answer}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Analysis Result</h2>

                            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex items-center gap-6">
                                <div className="relative flex items-center justify-center">
                                    <svg className="w-20 h-20 transform -rotate-90">
                                        <circle cx="40" cy="40" r="34" stroke="#eef2ff" strokeWidth="6" fill="transparent" />
                                        <circle
                                            cx="40" cy="40" r="34"
                                            stroke={result.intentScore >= 80 ? "#10b981" : result.intentScore >= 50 ? "#f59e0b" : "#ef4444"}
                                            strokeWidth="6"
                                            fill="transparent"
                                            strokeDasharray={2 * Math.PI * 34}
                                            strokeDashoffset={2 * Math.PI * 34 * (1 - result.intentScore / 100)}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-xl font-bold">{result.intentScore}%</span>
                                </div>
                                <div>
                                    <div className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold mb-1 border ${result.intentScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        result.intentScore >= 50 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                            'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                        {getScoreLabel(result.intentScore)}
                                    </div>
                                    <p className="text-base font-bold text-gray-900">{result.mismatchType}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Expected Intent</p>
                                    <p className="text-sm border-l-2 border-gray-200 pl-4 py-0.5 italic text-gray-600">{result.expectedIntent}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">In-Depth Analysis</p>
                                    <p className="text-sm leading-relaxed text-gray-700">{result.explanation}</p>
                                </div>
                                <div className="bg-emerald-50/30 p-4 rounded-lg border border-emerald-100">
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Suggested Reframe</p>
                                    <p className="text-sm italic text-gray-800">"{result.suggestedReframe}"</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 text-center">
                        <p className="text-[9px] text-gray-400">Generated by AQMD AI Assessor – Precision Feedback for Academic Success</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
