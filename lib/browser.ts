import { toast } from "sonner"

let Browser: any = null

// Dynamically import Capacitor Browser (only available in native app)
async function getBrowser() {
    if (Browser) return Browser

    try {
        // Try to import Capacitor Browser (works in APK/native)
        const module = await import('@capacitor/browser')
        Browser = module.Browser
        return Browser
    } catch (e) {
        console.warn("Capacitor Browser plugin not available, using web fallback", e)
        return null
    }
}

/**
 * Opens a URL in the best way for the current platform:
 * - APK/Native: Uses in-app browser with close button
 * - Web: Opens in new tab
 */
export async function openLink(url: string) {
    if (!url) {
        toast.error("Invalid URL")
        return
    }

    toast.info("Opening paper source...")

    try {
        const browser = await getBrowser()

        if (browser && typeof window !== 'undefined' && (window as any).Capacitor) {
            // Native app - open in-app browser with close button
            await browser.open({
                url,
                presentationStyle: 'fullscreen', // Fullscreen is more reliable on Android
                toolbarColor: '#0f172a',
            })
        } else {
            // Web fallback - open in new tab
            const win = window.open(url, '_blank', 'noopener,noreferrer')
            if (!win) {
                toast.error("Browser blocked a popup. Please allow popups.")
            }
        }
    } catch (err) {
        console.error("Failed to open link:", err)
        // Final fallback
        window.location.href = url
    }
}

/**
 * Check if running in native app
 */
export async function isNativeApp(): Promise<boolean> {
    try {
        const { Capacitor } = await import('@capacitor/core')
        return Capacitor.isNativePlatform()
    } catch {
        return false
    }
}
