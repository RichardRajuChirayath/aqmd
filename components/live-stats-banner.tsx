"use client";

import { useEffect, useState } from "react";
import { Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { apiUrl } from "@/lib/api-url";

export function LiveStatsBanner() {
    const [stats, setStats] = useState<{ users: number; actions: number } | null>(null);

    useEffect(() => {
        async function fetchPublicStats() {
            try {
                const res = await fetch(apiUrl("/api/public-stats"));
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch public stats:", err);
            }
        }
        fetchPublicStats();
    }, []);

    if (!stats || stats.users === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border-b border-blue-500/10"
        >
            <div className="flex items-center gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-semibold">{stats.users}+</span>
                    <span className="text-muted-foreground hidden sm:inline">learners</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-500" />
                <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-semibold">{stats.actions}+</span>
                    <span className="text-muted-foreground hidden sm:inline">AI study sessions</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 ml-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-muted-foreground text-xs">Live</span>
                </div>
            </div>
        </motion.div>
    );
}
