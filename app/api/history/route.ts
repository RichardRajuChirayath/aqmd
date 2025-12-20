import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const guestId = searchParams.get("guestId") || ""

        const analyses = await prisma.analysis.findMany({
            where: { guestId },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
                id: true,
                question: true,
                intentScore: true,
                createdAt: true,
            },
        })

        return NextResponse.json(analyses)
    } catch (error) {
        console.error("History fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }
}
