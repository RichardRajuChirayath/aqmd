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
        <div className="fixed top-6 right-6 z-50">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-background/80 backdrop-blur-md border border-primary/20 pl-3 pr-4 py-2 rounded-full shadow-2xl shadow-primary/10 group"
            >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Secure Guest Session</span>
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    </div>
                    <p className="text-[11px] font-mono font-bold text-foreground flex items-center gap-1">
                        <span className="opacity-40 uppercase">ID:</span> {shortId}
                    </p>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute top-full mt-3 right-0 w-48 p-3 bg-black/90 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none leading-relaxed border border-white/10 shadow-2xl translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <p className="font-bold mb-1 flex items-center gap-1.5 text-primary">
                        <User className="w-3 h-3" /> Anonymous Identity
                    </p>
                    Your data is private to this browser. No signup required. Your pathways and history are isolated from other users.
                </div>
            </motion.div>
        </div>
    )
}
