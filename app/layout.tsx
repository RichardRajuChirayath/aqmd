import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Crimson_Pro } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _crimsonPro = Crimson_Pro({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "AQMD – Answer–Question Mismatch Detector",
  description: "AI-powered tool to detect whether student answers address the question intent",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

import { Toaster } from "sonner"
import { GuestBadge } from "@/components/guest-badge"
import { Leaderboard } from "@/components/leaderboard"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased min-h-screen flex flex-col`}>
        <GuestBadge />
        {/* Leaderboard - fixed on left side, hidden on mobile */}
        <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40 w-48">
          <Leaderboard />
        </div>
        <main className="flex-1">
          {children}
        </main>
        {/* Footer */}
        <footer className="py-4 text-center border-t border-border/30 bg-background/50 backdrop-blur-sm">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Built with <span className="text-red-500">❤️</span> in <span className="font-bold text-orange-500">India</span> 🇮🇳
          </p>
        </footer>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
