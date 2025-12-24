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
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardNav } from "@/components/dashboard-nav"
import { GuestBadge } from "@/components/guest-badge"
import { Zap } from "lucide-react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex min-h-screen lg:flex-row flex-col">
            <DashboardNav />
            <main className="flex-1 lg:ml-64 pb-24 lg:pb-0">
              {/* Mobile Only Header */}
              <div className="lg:hidden flex items-center justify-between px-6 h-16 border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-40">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-bold text-lg tracking-tight tech-heading gradient-text">AQMD</span>
                </div>
                <GuestBadge />
              </div>
              {children}
            </main>
          </div>

          {/* Footer */}
          <footer className="py-4 text-center border-t border-border/30 bg-background/50 backdrop-blur-sm lg:ml-64 transition-all">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Built with <span className="text-red-500">❤️</span> in <span className="font-bold text-orange-500">India</span> 🇮🇳
            </p>
          </footer>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
