"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { apiUrl } from "@/lib/api-url"
import StudyBubble from "@/components/study-bubble"
import StudyPanel from "@/components/study-panel"

// Dynamic import for PDF reader (client-side only)
const PDFReader = dynamic(() => import("@/components/pdf-reader"), {
    ssr: false,
    loading: () => (
        <div className="h-screen flex items-center justify-center bg-slate-950">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    )
})

interface StudySession {
    id: string
    pdfName: string
    pdfUrl: string
    currentPage: number
    totalPages: number | null
    status: string
}

interface StudyPageData {
    id: string
    pageNumber: number
    extractedText: string
    summary: string | null
    reflectionQs: any[] | null
    studyTip: string | null
}

interface HelpResponse {
    greeting: string
    explanation: string
    keyTakeaway: string
    encouragement: string
}

export default function StudySessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const resolvedParams = use(params)
    const { sessionId } = resolvedParams

    const [session, setSession] = useState<StudySession | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [pageData, setPageData] = useState<StudyPageData | null>(null)
    const [parsedPages, setParsedPages] = useState<Set<number>>(new Set())
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [helpResponse, setHelpResponse] = useState<HelpResponse | null>(null)
    const [isLoadingHelp, setIsLoadingHelp] = useState(false)
    const router = useRouter()

    // Fetch session data
    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch(apiUrl(`/api/study/session?guestId=`))
                // For now, we'll fetch by getting and finding our session
                // In production, add a sessionId query param
            } catch (error) {
                console.error("Failed to fetch session:", error)
            }
        }

        // For now, use the pdfUrl from localStorage as a workaround
        const storedSession = localStorage.getItem(`study_session_${sessionId}`)
        if (storedSession) {
            setSession(JSON.parse(storedSession))
        }
    }, [sessionId])

    // Handle page change
    const handlePageChange = useCallback(async (pageNumber: number, total: number) => {
        setCurrentPage(pageNumber)
        setTotalPages(total)

        // Update session in database
        await fetch(apiUrl("/api/study/session"), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId,
                currentPage: pageNumber,
                totalPages: total
            })
        })

        // Fetch page data if exists
        const res = await fetch(apiUrl(`/api/study/page?sessionId=${sessionId}&pageNumber=${pageNumber}`))
        const data = await res.json()
        if (data.page) {
            setPageData(data.page)
            if (data.page.extractedText) {
                setParsedPages(prev => new Set(prev).add(pageNumber))
            }
        } else {
            setPageData(null)
        }

        // Reset help response when changing pages
        setHelpResponse(null)
    }, [sessionId])

    // Handle page rendered - extract text via OCR
    const handlePageRendered = useCallback(async (pageNumber: number, canvas: HTMLCanvasElement) => {
        if (parsedPages.has(pageNumber)) return

        try {
            // Convert canvas to base64 image
            const pageImage = canvas.toDataURL("image/png")

            // Send to OCR API
            const formData = new FormData()
            formData.append("sessionId", sessionId)
            formData.append("pageNumber", pageNumber.toString())
            formData.append("pageImage", pageImage)

            const res = await fetch(apiUrl("/api/study/parse"), {
                method: "POST",
                body: formData
            })

            const data = await res.json()
            if (data.success) {
                setParsedPages(prev => new Set(prev).add(pageNumber))
            }
        } catch (error) {
            console.error("Failed to parse page:", error)
        }
    }, [sessionId, parsedPages])

    // Mark page as done - trigger AI analysis
    const handleMarkDone = async () => {
        if (!parsedPages.has(currentPage)) {
            alert("Please wait for page text to be extracted first.")
            return
        }

        setIsAnalyzing(true)
        try {
            const res = await fetch(apiUrl("/api/study/page"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    pageNumber: currentPage,
                    action: "analyze"
                })
            })

            const data = await res.json()
            if (data.page) {
                setPageData(data.page)
                setIsPanelOpen(true)
            }
        } catch (error) {
            console.error("Analysis failed:", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    // Request AI help
    const handleNeedHelp = async () => {
        setIsLoadingHelp(true)
        setIsPanelOpen(true)

        try {
            const res = await fetch(apiUrl("/api/study/help"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    pageNumber: currentPage
                })
            })

            const data = await res.json()
            setHelpResponse(data)
        } catch (error) {
            console.error("Help request failed:", error)
        } finally {
            setIsLoadingHelp(false)
        }
    }

    // Submit answer to reflection question
    const handleSubmitAnswer = (questionIndex: number, answer: string) => {
        // For now, just mark as answered
        // In production, send to AI for evaluation
        if (pageData?.reflectionQs) {
            const updatedQs = [...pageData.reflectionQs]
            updatedQs[questionIndex] = {
                ...updatedQs[questionIndex],
                userAnswer: answer,
                isCorrect: true // Simplified - AI would evaluate
            }
            setPageData({
                ...pageData,
                reflectionQs: updatedQs
            })
        }
    }

    // If no session data, show loading or redirect
    if (!session) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                <p className="text-slate-400">Loading study session...</p>
                <button
                    onClick={() => router.push("/study")}
                    className="mt-4 text-sm text-blue-400 hover:underline"
                >
                    Back to Study
                </button>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-slate-950">
            {/* PDF Reader */}
            <PDFReader
                pdfUrl={session.pdfUrl}
                sessionId={sessionId}
                onPageChange={handlePageChange}
                onPageRendered={handlePageRendered}
            />

            {/* Study Bubble */}
            <StudyBubble
                currentPage={currentPage}
                totalPages={totalPages}
                isPageParsed={parsedPages.has(currentPage)}
                isAnalyzing={isAnalyzing}
                onMarkDone={handleMarkDone}
                onNeedHelp={handleNeedHelp}
                onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
                isPanelOpen={isPanelOpen}
            />

            {/* Study Panel */}
            <StudyPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                pageNumber={currentPage}
                summary={pageData?.summary || null}
                questions={pageData?.reflectionQs || []}
                studyTip={pageData?.studyTip || null}
                helpResponse={helpResponse}
                isLoadingHelp={isLoadingHelp}
                onSubmitAnswer={handleSubmitAnswer}
            />
        </div>
    )
}
