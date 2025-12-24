// In-app browser utility for Capacitor
// Opens links inside the app with a close button

let Browser: any = null

// Dynamically import Capacitor Browser (only available in native app)
async function getBrowser() {
    if (Browser) return Browser

    try {
        // Try to import Capacitor Browser (works in APK/native)
        const module = await import('@capacitor/browser')
        Browser = module.Browser
        return Browser
    } catch {
        // Fallback for web - Browser plugin not available
        return null
    }
}

/**
 * Opens a URL in the best way for the current platform:
 * - APK/Native: Uses in-app browser with close button
 * - Web: Opens in new tab
 */
export async function openLink(url: string) {
    const browser = await getBrowser()

    if (browser) {
        // Native app - open in-app browser with close button
        await browser.open({
            url,
            presentationStyle: 'popover', // iOS: shows as popover
            toolbarColor: '#0f172a', // Match your dark theme
        })
    } else {
        // Web fallback - open in new tab
        window.open(url, '_blank', 'noopener,noreferrer')
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
