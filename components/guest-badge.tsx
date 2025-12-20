"use client"

import { useGuestId } from "@/lib/guest-identity"
import { ShieldCheck, User, Fingerprint } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function GuestBadge() {
    const guestId = useGuestId()

    if (!guestId) return null

    // Shorten the ID for display
    const shortId = guestId.split("-")[0].toUpperCase()

    return (
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 sm:gap-2 bg-background/80 backdrop-blur-md border border-primary/20 pl-2 pr-2.5 py-1 sm:pl-2.5 sm:pr-3 sm:py-1.5 rounded-full shadow-lg shadow-primary/10 group"
            >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Fingerprint className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
                <div>
                    <div className="flex items-center gap-1">
                        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-primary/60 hidden sm:inline">Guest</span>
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-mono font-bold text-foreground">
                        {shortId}
                    </p>
                </div>

                {/* Tooltip on hover - hidden on mobile */}
                <div className="hidden sm:block absolute top-full mt-2 right-0 w-40 p-2 bg-black/90 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none leading-relaxed border border-white/10 shadow-xl">
                    <p className="font-bold mb-0.5 flex items-center gap-1 text-primary">
                        <User className="w-2.5 h-2.5" /> Anonymous
                    </p>
                    Private session. No signup needed.
                </div>
            </motion.div>
        </div>
    )
}
