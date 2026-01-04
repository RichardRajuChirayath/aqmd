"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, Maximize2 } from "lucide-react"
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
    const pdfWrapperRef = useRef<HTMLDivElement>(null)

    // Touch gesture states
    const [isPanning, setIsPanning] = useState(false)
    const [startPan, setStartPan] = useState({ x: 0, y: 0 })
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
    const touchStartDistance = useRef<number>(0)

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
            setPanOffset({ x: 0, y: 0 }) // Reset pan on page change
        }
    }, [pageNumber, numPages, onPageChange])

    const goToNextPage = useCallback(() => {
        if (pageNumber < numPages) {
            const newPage = pageNumber + 1
            setPageNumber(newPage)
            onPageChange(newPage, numPages)
            setPanOffset({ x: 0, y: 0 }) // Reset pan on page change
        }
    }, [pageNumber, numPages, onPageChange])

    const zoomIn = () => setScale(prev => Math.min(prev + 0.3, 3.0))
    const zoomOut = () => {
        setScale(prev => Math.max(prev - 0.3, 0.8))
        if (scale < 1.5) setPanOffset({ x: 0, y: 0 }) // Reset pan when zooming out
    }
    const resetZoom = () => {
        setScale(1.0)
        setPanOffset({ x: 0, y: 0 })
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

    // Touch gestures - Pinch to zoom and pan
    useEffect(() => {
        const wrapper = pdfWrapperRef.current
        if (!wrapper) return

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                // Pinch zoom
                const dx = e.touches[0].clientX - e.touches[1].clientX
                const dy = e.touches[0].clientY - e.touches[1].clientY
                touchStartDistance.current = Math.sqrt(dx * dx + dy * dy)
            } else if (e.touches.length === 1 && scale > 1) {
                // Pan
                setIsPanning(true)
                setStartPan({
                    x: e.touches[0].clientX - panOffset.x,
                    y: e.touches[0].clientY - panOffset.y
                })
            }
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                // Pinch zoom
                e.preventDefault()
                const dx = e.touches[0].clientX - e.touches[1].clientX
                const dy = e.touches[0].clientY - e.touches[1].clientY
                const distance = Math.sqrt(dx * dx + dy * dy)
                const scaleDiff = distance / touchStartDistance.current
                setScale(prev => Math.max(0.8, Math.min(3.0, prev * scaleDiff)))
                touchStartDistance.current = distance
            } else if (isPanning && e.touches.length === 1) {
                // Pan
                e.preventDefault()
                setPanOffset({
                    x: e.touches[0].clientX - startPan.x,
                    y: e.touches[0].clientY - startPan.y
                })
            }
        }

        const handleTouchEnd = () => {
            setIsPanning(false)
        }

        wrapper.addEventListener('touchstart', handleTouchStart, { passive: false })
        wrapper.addEventListener('touchmove', handleTouchMove, { passive: false })
        wrapper.addEventListener('touchend', handleTouchEnd)

        return () => {
            wrapper.removeEventListener('touchstart', handleTouchStart)
            wrapper.removeEventListener('touchmove', handleTouchMove)
            wrapper.removeEventListener('touchend', handleTouchEnd)
        }
    }, [scale, isPanning, startPan, panOffset])

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
                Pinch to zoom • Drag when zoomed • Tap edges to navigate
            </div>

            {/* PDF Viewer with touch support */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto flex items-start justify-center p-4 bg-slate-950"
                style={{ touchAction: scale > 1 ? 'none' : 'auto' }}
            >
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                )}
                <motion.div
                    ref={pdfWrapperRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="shadow-2xl rounded-lg overflow-hidden"
                    style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                        cursor: scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
                        transition: isPanning ? 'none' : 'transform 0.2s ease-out'
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
