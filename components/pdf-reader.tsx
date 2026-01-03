"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFReaderProps {
    pdfUrl: string
    sessionId: string
    onPageChange: (pageNumber: number, totalPages: number) => void
    onPageRendered: (pageNumber: number, canvas: HTMLCanvasElement) => void
}

export default function PDFReader({ pdfUrl, sessionId, onPageChange, onPageRendered }: PDFReaderProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [scale, setScale] = useState<number>(1.0)
    const [loading, setLoading] = useState<boolean>(true)
    const pageRef = useRef<HTMLCanvasElement | null>(null)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
        setLoading(false)
        onPageChange(1, numPages)
    }

    function onPageLoadSuccess() {
        // Get the canvas after page renders
        setTimeout(() => {
            const canvas = document.querySelector(".react-pdf__Page__canvas") as HTMLCanvasElement
            if (canvas) {
                onPageRendered(pageNumber, canvas)
            }
        }, 500)
    }

    const goToPrevPage = useCallback(() => {
        if (pageNumber > 1) {
            const newPage = pageNumber - 1
            setPageNumber(newPage)
            onPageChange(newPage, numPages)
        }
    }, [pageNumber, numPages, onPageChange])

    const goToNextPage = useCallback(() => {
        if (pageNumber < numPages) {
            const newPage = pageNumber + 1
            setPageNumber(newPage)
            onPageChange(newPage, numPages)
        }
    }, [pageNumber, numPages, onPageChange])

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5))
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5))

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrevPage()
            if (e.key === "ArrowRight") goToNextPage()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [goToPrevPage, goToNextPage])

    return (
        <div className="flex flex-col h-full bg-slate-950">
            {/* Controls Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-mono text-slate-300 min-w-[100px] text-center">
                        Page {pageNumber} of {numPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={zoomOut}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-mono text-slate-400 min-w-[50px] text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={zoomIn}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto flex items-start justify-center p-4 bg-slate-950">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="shadow-2xl rounded-lg overflow-hidden"
                >
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center p-20">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            onLoadSuccess={onPageLoadSuccess}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="pdf-page"
                        />
                    </Document>
                </motion.div>
            </div>
        </div>
    )
}
