"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    Search,
    History,
    Settings,
    Zap,
    LayoutDashboard,
    BrainCircuit,
    GraduationCap
} from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import { GuestBadge } from "./guest-badge"

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Vault", href: "/papers", icon: GraduationCap },
    { name: "History", href: "/history", icon: History },
]

export function DashboardNav() {
    const pathname = usePathname()

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border-r border-border/50 z-50 p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-bold text-xl tracking-tight tech-heading gradient-text">AQMD</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.name} href={item.href}>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20"
                                        : "text-muted-foreground hover:bg-secondary/50"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                                    <span className="font-medium text-sm">{item.name}</span>
                                </motion.div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-border/50 space-y-4">
                    <GuestBadge />
                    <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-mono text-muted-foreground">PREMIUM MODE</span>
                        <ThemeToggle />
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-border/50 z-50 flex items-center justify-around px-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.name} href={item.href} className="flex-1 h-full">
                            <div className={`flex flex-col items-center justify-center h-full gap-1 transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                                }`}>
                                <Icon className="w-5 h-5" />
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </div>
                        </Link>
                    )
                })}
                <div className="flex-1 flex justify-center">
                    <ThemeToggle />
                </div>
            </nav>
        </>
    )
}
