"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// This hook listens for files shared from other apps via Android Share intent
export function useSharedPDF() {
    const [sharedFile, setSharedFile] = useState<{
        name: string
        uri: string
        data?: string
    } | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Only run on Capacitor (mobile)
        if (typeof window === "undefined") return

        const checkForSharedFile = async () => {
            try {
                // Dynamic imports to avoid SSR issues
                const SendIntent = await import("send-intent").then(m => m.SendIntent)
                const { Filesystem } = await import("@capacitor/filesystem")

                console.log("[Share] Checking for shared intent...")

                // Check if app was opened with a shared file
                const intent = await SendIntent.checkSendIntentReceived()
                console.log("[Share] Intent received:", intent)

                if (intent && intent.url) {
                    setIsProcessing(true)
                    console.log("[Share] Processing shared file:", intent.url)

                    // Get file name from intent
                    const fileName = intent.title || intent.url.split("/").pop() || "shared.pdf"

                    // For content:// URIs, we need to read the file content
                    if (intent.url.startsWith("content://") || intent.type?.includes("pdf")) {
                        try {
                            // Try to read the file as base64
                            const fileData = await Filesystem.readFile({
                                path: intent.url
                            })

                            const pdfData = `data:application/pdf;base64,${fileData.data}`

                            setSharedFile({
                                name: fileName,
                                uri: intent.url,
                                data: pdfData
                            })

                            // Store in localStorage for the study page
                            localStorage.setItem("shared_pdf", JSON.stringify({
                                name: fileName,
                                data: pdfData,
                                timestamp: Date.now()
                            }))

                            console.log("[Share] PDF stored, navigating to study...")
                            router.push("/study?shared=true")
                        } catch (readError) {
                            console.error("[Share] Failed to read file:", readError)
                            // Still navigate, let the study page handle it
                            localStorage.setItem("shared_pdf_uri", intent.url)
                            router.push("/study?shared=true")
                        }
                    }
                    setIsProcessing(false)
                }
            } catch (error) {
                // Not on Capacitor or no intent, ignore
                console.log("[Share] No shared intent or not on Capacitor:", error)
            }
        }

        // Run check immediately on mount
        checkForSharedFile()

        // Also check periodically (for when app is resumed with intent)
        const interval = setInterval(checkForSharedFile, 2000)
        return () => clearInterval(interval)
    }, [router])

    return { sharedFile, isProcessing }
}
