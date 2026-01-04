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
    const containerRef = useRef<HTMLDivElement>(null)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
        setLoading(false)
        onPageChange(1, numPages)
    }

    function onPageLoadSuccess() {
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
            // Reset scroll position on page change
            if (containerRef.current) {
                containerRef.current.scrollTop = 0
                containerRef.current.scrollLeft = 0
            }
        }
    }, [pageNumber, numPages, onPageChange])

    const goToNextPage = useCallback(() => {
        if (pageNumber < numPages) {
            const newPage = pageNumber + 1
            setPageNumber(newPage)
            onPageChange(newPage, numPages)
            // Reset scroll position on page change
            if (containerRef.current) {
                containerRef.current.scrollTop = 0
                containerRef.current.scrollLeft = 0
            }
        }
    }, [pageNumber, numPages, onPageChange])

    const zoomIn = () => setScale(prev => Math.min(prev + 0.3, 3.0))
    const zoomOut = () => setScale(prev => Math.max(prev - 0.3, 0.8))
    const resetZoom = () => {
        setScale(1.0)
        if (containerRef.current) {
            containerRef.current.scrollTop = 0
            containerRef.current.scrollLeft = 0
        }
    }

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
            {/* Controls Bar - STICKY at top */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="p-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-bold text-white min-w-[120px] text-center">
                        {pageNumber} / {numPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="p-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={zoomOut}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <button
                        onClick={resetZoom}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <span className="text-xs font-mono text-slate-400">{Math.round(scale * 100)}%</span>
                    </button>
                    <button
                        onClick={zoomIn}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Interaction hint */}
            <div className="text-center py-1 bg-slate-900/50 text-xs text-slate-500">
                Zoom with buttons • Scroll to navigate when zoomed
            </div>

            {/* PDF Viewer - ALWAYS shows scrollbars when content overflows */}
            <div
                ref={containerRef}
                className="flex-1 p-4 bg-slate-950"
                style={{
                    overflow: 'scroll', // ALWAYS show scrollbars
                    display: 'block', // Remove flex so scrollbars work
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                }}
            >
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                )}
                {/* NO flex wrapper - PDF can be wider than viewport */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="shadow-2xl rounded-lg overflow-hidden inline-block"
                    style={{
                        minWidth: 'fit-content' // Allow PDF to determine width
                    }}
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
