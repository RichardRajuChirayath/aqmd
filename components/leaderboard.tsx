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

    useEffect(() => {
        fetch("/api/leaderboard")
            .then(res => res.json())
            .then(data => {
                setLeaders(data.leaderboard || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="bg-background/80 backdrop-blur-md border border-primary/10 rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-3"></div>
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 bg-muted rounded"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (leaders.length === 0) {
        return null
    }

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="w-4 h-4 text-yellow-500" />
        if (index === 1) return <Medal className="w-4 h-4 text-gray-400" />
        if (index === 2) return <Award className="w-4 h-4 text-amber-600" />
        return <span className="text-xs font-bold text-muted-foreground w-4 text-center">{index + 1}</span>
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background/80 backdrop-blur-md border border-primary/10 rounded-2xl p-4 shadow-lg"
        >
            <div className="flex items-center gap-2 mb-4">
                <Flame className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-black uppercase tracking-widest text-primary/80">Top Learners</h3>
                <TrendingUp className="w-3 h-3 text-emerald-500 ml-auto" />
            </div>

            <div className="space-y-2">
                <AnimatePresence>
                    {leaders.slice(0, 5).map((leader, index) => (
                        <motion.div
                            key={leader.fullId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${index === 0 ? 'bg-yellow-500/10 border border-yellow-500/20' : 'hover:bg-muted/50'
                                }`}
                        >
                            {getRankIcon(index)}
                            <span className="font-mono text-xs font-bold text-foreground flex-1 truncate">
                                {leader.displayName}
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                    {leader.total}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <p className="text-[9px] text-muted-foreground text-center mt-3 uppercase tracking-widest">
                Total Analyses & Pathways
            </p>
        </motion.div>
    )
}
