"use client"

import { useGuestProfile } from "@/lib/guest-identity"
import { ShieldCheck, Fingerprint, Edit2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function GuestBadge() {
    const { guestId, guestName, updateName } = useGuestProfile()
    const [isEditing, setIsEditing] = useState(false)
    const [tempName, setTempName] = useState("")

    if (!guestId) return null

    const shortId = guestId.split("-")[0].toUpperCase()
    const displayName = guestName || shortId

    const handleStartEdit = () => {
        setTempName(guestName)
        setIsEditing(true)
    }

    const handleSave = async () => {
        if (tempName.trim()) {
            updateName(tempName.trim())
            // Sync with server for leaderboard
            try {
                await fetch("/api/leaderboard", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ guestId, name: tempName.trim() })
                })
            } catch (e) {
                console.error("Failed to sync name:", e)
            }
            toast.success("Name has been updated!")
        }
        setIsEditing(false)
    }

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
                    {isEditing ? (
                        <Input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Your name"
                            className="h-5 text-[9px] w-20 px-1"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave()
                                if (e.key === "Escape") setIsEditing(false)
                            }}
                            onBlur={handleSave}
                        />
                    ) : (
                        <div
                            className="flex flex-col cursor-pointer group/name"
                            onClick={handleStartEdit}
                        >
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-2 h-2 text-emerald-500" />
                                <p className="text-[9px] sm:text-[10px] font-mono font-bold text-foreground">
                                    {shortId}
                                </p>
                            </div>
                            {guestName && (
                                <p className="text-[8px] font-bold text-primary/80 uppercase tracking-tighter -mt-0.5">
                                    {guestName}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
