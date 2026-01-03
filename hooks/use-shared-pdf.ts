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
    const router = useRouter()

    useEffect(() => {
        // Only run on Capacitor (mobile)
        if (typeof window === "undefined") return

        const checkForSharedFile = async () => {
            try {
                // Dynamic import to avoid SSR issues
                const { App } = await import("@capacitor/app")
                const { Filesystem, Directory } = await import("@capacitor/filesystem")

                // Listen for app URL open events (shared files come through here)
                App.addListener("appUrlOpen", async (event: { url: string }) => {
                    console.log("[Share] Received URL:", event.url)

                    // Handle content:// URIs from Android share
                    if (event.url.startsWith("content://") || event.url.endsWith(".pdf")) {
                        try {
                            // Read the shared file
                            const fileName = event.url.split("/").pop() || "shared.pdf"

                            // For content:// URIs, we need to copy to app storage first
                            // The Capacitor app will handle this automatically
                            setSharedFile({
                                name: fileName,
                                uri: event.url
                            })

                            // Navigate to study page with shared file intent
                            router.push(`/study?shared=true&uri=${encodeURIComponent(event.url)}`)
                        } catch (error) {
                            console.error("[Share] Failed to process shared file:", error)
                        }
                    }
                })

                // Check if app was opened with a shared file (cold start)
                const launchUrl = await App.getLaunchUrl()
                if (launchUrl?.url) {
                    console.log("[Share] Launch URL:", launchUrl.url)
                    if (launchUrl.url.endsWith(".pdf") || launchUrl.url.includes("pdf")) {
                        setSharedFile({
                            name: launchUrl.url.split("/").pop() || "shared.pdf",
                            uri: launchUrl.url
                        })
                        router.push(`/study?shared=true&uri=${encodeURIComponent(launchUrl.url)}`)
                    }
                }
            } catch (error) {
                // Not on Capacitor, ignore
                console.log("[Share] Not on Capacitor platform")
            }
        }

        checkForSharedFile()
    }, [router])

    return sharedFile
}
