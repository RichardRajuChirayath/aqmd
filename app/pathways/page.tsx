"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingFlow } from "@/components/loading-flow"
import {
    Sparkles, ArrowRight, Route, Upload,
    FileText, Image as ImageIcon, X, GraduationCap, ListOrdered, Camera, RefreshCw
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useGuestId } from "@/lib/guest-identity"

export default function PathwaysPage() {
    const [topic, setTopic] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCameraOpen, setIsCameraOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const router = useRouter()
    const guestId = useGuestId()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("File too large (max 5MB)")
                return
            }
            setFile(selectedFile)
            if (selectedFile.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onloadend = () => setPreview(reader.result as string)
                reader.readAsDataURL(selectedFile)
            } else {
                setPreview(null)
            }
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) {
            if (droppedFile.size > 5 * 1024 * 1024) {
                toast.error("File too large (max 5MB)")
                return
            }
            if (!droppedFile.type.startsWith("image/") && droppedFile.type !== "application/pdf") {
                toast.error("Please upload an image or PDF")
                return
            }
            setFile(droppedFile)
            if (droppedFile.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onloadend = () => setPreview(reader.result as string)
                reader.readAsDataURL(droppedFile)
            } else {
                setPreview(null)
            }
            toast.success("File received! Ready to analyze.")
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const startCamera = async () => {
        setIsCameraOpen(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (err) {
            console.error("Camera access error:", err)
            toast.error("Could not access camera. Please check permissions.")
            setIsCameraOpen(false)
        }
    }

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject as MediaStream
        stream?.getTracks().forEach(track => track.stop())
        setIsCameraOpen(false)
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
                setPreview(dataUrl)

                const fetchAndSet = async () => {
                    const res = await fetch(dataUrl)
                    const blob = await res.blob()
                    const capturedFile = new File([blob], "captured-photo.jpg", { type: "image/jpeg" })
                    setFile(capturedFile)
                }

                fetchAndSet()
                stopCamera()
            }
        }
    }

    const handleGenerate = async () => {
        if (!topic.trim() && !file) return

        setIsLoading(true)
        try {
            let finalTopic = topic.trim()
            let context = ""

            if (file) {
                const formData = new FormData()
                formData.append("file", file)

                const analyzeRes = await fetch("/api/analyze-document", {
                    method: "POST",
                    body: formData,
                })

                if (!analyzeRes.ok) throw new Error("Document analysis failed")
                const analyzeData = await analyzeRes.json()
                finalTopic = analyzeData.topic
                context = analyzeData.fullText || ""
            }

            const response = await fetch("/api/generate-pathway", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: finalTopic, guestId, fullText: context }),
            })

            const data = await response.json()

            if (data.id) {
                router.push(`/pathways/${data.id}`)
            }
        } catch (error) {
            console.error("Pathway generation failed:", error)
            toast.error("Failed to generate pathway. Please try again.")
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-xl glass-card overflow-hidden">
                    <LoadingFlow />
                </Card>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 bg-gradient-to-b from-background to-primary/5">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                    >
                        <Route className="w-4 h-4" />
                        Document-to-Mastery
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl font-serif font-bold text-foreground mb-4 tracking-tight leading-tight"
                    >
                        Photo-to-Path. <br /> <span className="text-primary italic">Zero Effort.</span>
                    </motion.h1>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Snap a picture of your notes or textbook on the spot. Our AI builds your roadmap instantly.
                    </p>
                </div>

                <Card className="glass-card animate-float border-primary/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                    <CardHeader className="text-center pb-4 relative z-10">
                        <CardTitle className="font-serif text-2xl flex items-center justify-center gap-3">
                            <Camera className="w-6 h-6 text-primary" />
                            Analyze Your Source Material
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 relative z-10">
                        {/* Interactive Upload/Camera Zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 group/upload relative min-h-[350px]
                ${isDragging ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(var(--primary),0.3)] scale-[1.02]' : file ? 'border-primary/40 bg-primary/5 shadow-inner' : 'border-border hover:border-primary/30 hover:bg-muted/50'}`}
                        >
                            {isCameraOpen ? (
                                <div className="w-full flex flex-col items-center gap-6">
                                    <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden border-2 border-primary shadow-[0_0_30px_rgba(var(--primary),0.2)] bg-black group/video">
                                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 border-[30px] border-black/20 pointer-events-none" />
                                        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/40 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />
                                        <div className="absolute top-4 left-4 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded">Live View</span>
                                        </div>
                                    </div>
                                    <canvas ref={canvasRef} className="hidden" />
                                    <div className="flex gap-4">
                                        <Button variant="outline" size="lg" onClick={stopCamera} className="gap-2 rounded-full px-8 border-primary/20 hover:bg-primary/5">
                                            <X className="w-4 h-4" /> Cancel
                                        </Button>
                                        <Button size="lg" onClick={capturePhoto} className="gap-2 bg-primary rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                            <Camera className="w-4 h-4" /> Capture Note
                                        </Button>
                                    </div>
                                </div>
                            ) : !file ? (
                                <div className="flex flex-col items-center gap-6">
                                    <div className="flex gap-8">
                                        {/* Method: Upload */}
                                        <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
                                            <label
                                                htmlFor="file-upload"
                                                className="w-20 h-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center relative cursor-pointer group/choice hover:bg-primary/10 transition-colors"
                                            >
                                                <Upload className="w-8 h-8 text-primary/70 group-hover/choice:text-primary transition-colors" />
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Upload</p>
                                        </motion.div>

                                        <div className="w-[1px] bg-border my-6" />

                                        {/* Method: Camera */}
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            className="flex flex-col items-center gap-3 cursor-pointer"
                                            onClick={startCamera}
                                        >
                                            <div className="w-20 h-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center hover:bg-primary/10 transition-colors group/choice">
                                                <Camera className="w-8 h-8 text-primary/70 group-hover/choice:text-primary transition-colors" />
                                            </div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">On Spot</p>
                                        </motion.div>
                                    </div>

                                    <div className="text-center">
                                        <p className="font-medium text-foreground/80">Drop a file or snap a picture</p>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                                            We'll extract <strong>every word</strong>, explain the concept in depth, and show you exactly what to learn and what's safe to skip.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-6 w-full animate-in fade-in zoom-in duration-300">
                                    <div className="relative w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted shadow-2xl group/preview">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                                <FileText className="w-12 h-12 text-primary/40" />
                                                <span className="text-xs font-mono font-bold tracking-widest">{file.name.split('.').pop()?.toUpperCase()}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => { setFile(null); setPreview(null); }}
                                                className="bg-white text-black p-3 rounded-full shadow-2xl hover:bg-black hover:text-white transition-all transform hover:scale-110"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-center mt-2">
                                        <div className="flex items-center gap-2 justify-center mb-1">
                                            <p className="font-bold text-sm truncate max-w-[220px] text-primary">
                                                {file.name === "captured-photo.jpg" ? "CAPTURED_STUDY_MATERIAL" : file.name}
                                            </p>
                                            <RefreshCw className="w-3 h-3 text-primary animate-spin-slow" />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Source Linked & Ready</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-4 py-2">
                            <div className="h-[1px] bg-border flex-1" />
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">Manual Entry</span>
                            <div className="h-[1px] bg-border flex-1" />
                        </div>

                        <div className="relative group/input">
                            <Input
                                type="text"
                                placeholder="What are you studying? (e.g., Photosynthesis)"
                                className="h-16 text-lg px-6 pr-14 border-primary/10 focus:border-primary/40 bg-background/50 placeholder:text-muted-foreground/30 hover:bg-background/80 transition-all rounded-xl"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                disabled={!!file}
                            />
                            <Sparkles className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/30 group-hover/input:text-primary/60 transition-colors" />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={(!topic.trim() && !file) || isLoading}
                            className="w-full h-16 text-xl font-bold shadow-2xl hover:shadow-primary/30 transition-all gap-4 overflow-hidden relative group/btn rounded-xl"
                            size="lg"
                        >
                            <span className="relative z-10">GENERATE BLUEPRINT</span>
                            <ArrowRight className="w-6 h-6 relative z-10 transition-transform group-hover/btn:translate-x-2" />
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-opacity" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Info Grid */}
                <div className="mt-16 grid grid-cols-4 gap-8">
                    {[
                        { label: "Vision AI", icon: ImageIcon, text: "OCR & Analysis" },
                        { label: "Path Mapping", icon: Route, text: "Logic Chaining" },
                        { label: "Goal Setting", icon: GraduationCap, text: "The Mastery Rule" },
                        { label: "Strategic", icon: ListOrdered, text: "Ideal Flow" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                <item.icon className="w-6 h-6 text-primary/60 group-hover:text-white transition-colors" />
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-[11px] font-medium text-foreground/80">{item.text}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center flex items-center justify-center gap-8 border-t border-border/50 pt-10">
                    <a
                        href="/"
                        className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-8 uppercase tracking-widest"
                    >
                        Mismatch Detector
                    </a>
                    <a
                        href="/history"
                        className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-8 uppercase tracking-widest"
                    >
                        Global History
                    </a>
                </div>
            </div>
        </main>
    )
}
