import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Get leaderboard: count analyses and pathways per guestId
        const analysisLeaders = await prisma.analysis.groupBy({
            by: ['guestId'],
            _count: { id: true },
            where: { guestId: { not: "" } },
            orderBy: { _count: { id: 'desc' } },
            take: 10
        })

        const pathwayLeaders = await prisma.pathway.groupBy({
            by: ['guestId'],
            _count: { id: true },
            where: { guestId: { not: "" } },
            orderBy: { _count: { id: 'desc' } },
            take: 10
        })

        // Combine scores
        const scoreMap = new Map<string, { analyses: number; pathways: number; total: number }>()

        for (const leader of analysisLeaders) {
            scoreMap.set(leader.guestId, {
                analyses: leader._count.id,
                pathways: 0,
                total: leader._count.id
            })
        }

        for (const leader of pathwayLeaders) {
            const existing = scoreMap.get(leader.guestId)
            if (existing) {
                existing.pathways = leader._count.id
                existing.total += leader._count.id
            } else {
                scoreMap.set(leader.guestId, {
                    analyses: 0,
                    pathways: leader._count.id,
                    total: leader._count.id
                })
            }
        }

        // Sort by total and take top 10
        const leaderboard = Array.from(scoreMap.entries())
            .map(([guestId, scores]) => ({
                guestId: guestId.split("-")[0].toUpperCase(),
                fullId: guestId,
                ...scores
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10)

        return NextResponse.json({ leaderboard })
    } catch (error: any) {
        console.error("Leaderboard error:", error?.message || error)
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
    }
}
