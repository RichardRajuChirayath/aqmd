"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Award, Flame, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface LeaderboardEntry {
    guestId: string
    fullId: string
    displayName: string
    analyses: number
    pathways: number
    total: number
}

export function Leaderboard() {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        fetch("/api/leaderboard")
            .then(res => res.json())
            .then(data => {
                setLeaders(data.leaderboard || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return null

    if (leaders.length === 0) return null

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="w-3 h-3 text-yellow-500" />
        if (index === 1) return <Medal className="w-3 h-3 text-gray-400" />
        if (index === 2) return <Award className="w-3 h-3 text-amber-600" />
        return <span className="text-[10px] font-bold text-muted-foreground w-3 text-center">{index + 1}</span>
    }

    return (
        <div className="flex flex-col items-start gap-2">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                    <Trophy className="w-3 h-3" />
                    Show LeaderBoard
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-background/90 backdrop-blur-xl border border-primary/20 rounded-2xl p-3 shadow-2xl w-48 relative overflow-hidden"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <TrendingUp className="w-3 h-3 rotate-180" />
                        </button>

                        <div className="flex items-center gap-2 mb-3">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80">Top Learners</h3>
                        </div>

                        <div className="space-y-1.5">
                            {leaders.slice(0, 5).map((leader, index) => (
                                <motion.div
                                    key={leader.fullId}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex items-center gap-2.5 p-1.5 rounded-lg transition-colors ${index === 0 ? 'bg-yellow-500/5 border border-yellow-500/10' : 'hover:bg-muted/50'
                                        }`}
                                >
                                    {getRankIcon(index)}
                                    <span className="font-mono text-[10px] font-bold text-foreground flex-1 truncate">
                                        {leader.displayName}
                                    </span>
                                    <span className="text-[9px] font-bold text-primary bg-primary/5 px-1 rounded">
                                        {leader.total}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-[8px] text-muted-foreground text-center mt-3 uppercase tracking-widest opacity-60">
                            Analyses + Pathways
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
