import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
export const dynamic = 'force-dynamic'

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const guestId = searchParams.get("guestId")

        if (!guestId) {
            return NextResponse.json({ error: "Guest ID is required" }, { status: 400 })
        }

        // Delete all analyses for this guest
        const deletedAnalyses = await prisma.analysis.deleteMany({
            where: { guestId }
        })

        // Delete all pathways for this guest
        const deletedPathways = await prisma.pathway.deleteMany({
            where: { guestId }
        })

        return NextResponse.json({
            success: true,
            deleted: {
                analyses: deletedAnalyses.count,
                pathways: deletedPathways.count
            }
        })
    } catch (error: any) {
        console.error("Clear history error:", error?.message || error)
        return NextResponse.json({ error: "Failed to clear history" }, { status: 500 })
    }
}
