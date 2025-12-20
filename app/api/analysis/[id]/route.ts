import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const analysis = await prisma.analysis.findUnique({
            where: { id },
        })

        if (!analysis) {
            return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
        }

        return NextResponse.json(analysis)
    } catch (error) {
        console.error("Fetch analysis error:", error)
        return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 })
    }
}
