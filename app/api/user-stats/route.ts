import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const guestId = searchParams.get("guestId")

        if (!guestId) {
            return NextResponse.json({ error: "Guest ID is required" }, { status: 400 })
        }

        // Fetch counts for analyses and pathways
        const [analysisCount, pathwayCount, analyses] = await Promise.all([
            prisma.analysis.count({
                where: { guestId }
            }),
            prisma.pathway.count({
                where: { guestId }
            }),
            prisma.analysis.findMany({
                where: { guestId },
                select: { intentScore: true }
            })
        ])

        // Calculate average score (mastery)
        const averageScore = analyses.length > 0
            ? Math.round(analyses.reduce((acc, curr) => acc + curr.intentScore, 0) / analyses.length)
            : 0

        return NextResponse.json({
            analysisCount,
            pathwayCount,
            averageScore,
            totalActivity: analysisCount + pathwayCount
        })
    } catch (error) {
        console.error("User stats fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
    }
}
