"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Upload, BookOpen, Clock, FileText, ArrowRight, Loader2, Plus, Share2 } from "lucide-react"
import { useGuestId } from "@/lib/guest-identity"
import { apiUrl } from "@/lib/api-url"
import { useSharedPDF } from "@/hooks/use-shared-pdf"

interface StudySession {
    id: string
    pdfName: string
    currentPage: number
    totalPages: number | null
    status: string
    createdAt: string
    updatedAt: string
}

export default function StudyPage() {
    const [sessions, setSessions] = useState<StudySession[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const router = useRouter()
    const guestId = useGuestId()

    useEffect(() => {
        if (guestId) {
            fetchSessions()
        }
    }, [guestId])

    // Handle shared PDF from Android using native plugin
    useEffect(() => {
        const checkSharedPDF = async () => {
            if (!guestId) return

            try {
                // Try to get shared PDF from native plugin
                const SharedPdf = await import("@/plugins/shared-pdf").then(m => m.default)
                const sharedData = await SharedPdf.getSharedPdf()

                if (sharedData && sharedData.data) {
                    // Check if recent (within last 10 seconds)
                    if (Date.now() - sharedData.timestamp < 10000) {
                        console.log("[Share] Processing native shared PDF:", sharedData.name)
                        await processSharedPDF(sharedData.name, sharedData.data)
                        await SharedPdf.clearSharedPdf()
                    }
                }
            } catch (error) {
                // Not on Capacitor or plugin not available
                console.log("[Share] Native plugin not available")
            }
        }
        checkSharedPDF()
    }, [guestId])


    const processSharedPDF = async (name: string, pdfData: string) => {
        setIsUploading(true)
        try {
            const res = await fetch(apiUrl("/api/study/session"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    guestId,
                    pdfName: name
                })
            })

            const data = await res.json()
            if (data.session) {
                localStorage.setItem(`study_session_${data.session.id}`, JSON.stringify({
                    ...data.session,
                    pdfUrl: pdfData
                }))
                router.push(`/study/${data.session.id}`)
            }
        } catch (error) {
            console.error("[Share] Failed to create session:", error)
            alert("Failed to process shared PDF")
        } finally {
            setIsUploading(false)
        }
    }

    const fetchSessions = async () => {
        try {
            const res = await fetch(apiUrl(`/api/study/session?guestId=${encodeURIComponent(guestId)}`))
            const data = await res.json()
            if (data.session) {
                setSessions([data.session])
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error)
        }
    }


    const handleFileUpload = async (file: File) => {
        if (!file.type.includes("pdf")) {
            alert("Please upload a PDF file")
            return
        }

        // Check file size (max 20MB)
        const maxSize = 20 * 1024 * 1024 // 20MB in bytes
        if (file.size > maxSize) {
            alert("File too large. Maximum size is 20MB.")
            return
        }

        console.log("[Study] Starting upload for:", file.name, "Size:", file.size)
        setIsUploading(true)

        // Convert PDF to data URL for LOCAL storage only (not sent to server - too large)
        const reader = new FileReader()

        reader.onload = async (e) => {
            try {
                const pdfUrl = e.target?.result as string
                console.log("[Study] PDF loaded, size:", pdfUrl.length, "chars")

                // Create session via API - DO NOT send pdfUrl (too large for DB)
                const res = await fetch(apiUrl("/api/study/session"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        guestId,
                        pdfName: file.name
                        // pdfUrl NOT sent to server - stored locally only
                    })
                })

                const data = await res.json()
                console.log("[Study] Session response:", data)

                if (data.session) {
                    // Store PDF in localStorage (client-side only)
                    localStorage.setItem(`study_session_${data.session.id}`, JSON.stringify({
                        ...data.session,
                        pdfUrl // PDF stays in browser only
                    }))
                    router.push(`/study/${data.session.id}`)
                } else {
                    console.error("No session returned:", data)
                    alert("Failed to create session: " + (data.error || "Unknown error"))
                    setIsUploading(false)
                }
            } catch (error) {
                console.error("Upload failed:", error)
                alert("Upload failed. Please try again.")
                setIsUploading(false)
            }
        }

        reader.onerror = () => {
            console.error("Failed to read file")
            alert("Failed to read file. Please try again.")
            setIsUploading(false)
        }

        reader.readAsDataURL(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFileUpload(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    return (
        <main className="min-h-screen bg-background dark:bg-slate-950 text-foreground">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute inset-0 blueprint-grid opacity-20" />
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-mono mb-4"
                    >
                        <BookOpen className="w-3 h-3" />
                        SMART PDF STUDY COMPANION
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold tech-heading mb-4 gradient-text">
                        Learn Smarter, Not Harder
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Upload any PDF and get AI-powered summaries, reflection questions, and personalized help as you read.
                    </p>
                </div>

                {/* Upload Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`relative tech-card p-12 text-center transition-all cursor-pointer ${isDragging
                            ? "border-purple-500 bg-purple-500/10"
                            : "hover:border-slate-600"
                            }`}
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                                <p className="text-lg font-medium">Processing PDF...</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Drop your PDF here</h3>
                                <p className="text-muted-foreground mb-6">or click to browse</p>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleFileUpload(file)
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        PDF files only
                                    </span>
                                    <span>•</span>
                                    <span>Max 20MB</span>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Recent Sessions */}
                {sessions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Continue Reading
                        </h2>
                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => router.push(`/study/${session.id}`)}
                                    className="w-full tech-card p-5 text-left group hover:-translate-y-1 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-foreground dark:text-slate-200 truncate group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                                                {session.pdfName}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span>Page {session.currentPage}{session.totalPages ? ` of ${session.totalPages}` : ""}</span>
                                                <span>•</span>
                                                <span className={`px-2 py-0.5 rounded-full ${session.status === "active"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-slate-500/20 text-slate-400"
                                                    }`}>
                                                    {session.status}
                                                </span>
                                            </div>
                                            {session.totalPages && (
                                                <div className="mt-3 h-1.5 w-full max-w-xs bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                                        style={{ width: `${(session.currentPage / session.totalPages) * 100}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </main>
    )
}
