import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const pathway = await prisma.pathway.findUnique({
            where: { id },
        })

        if (!pathway) {
            return NextResponse.json({ error: "Pathway not found" }, { status: 404 })
        }

        return NextResponse.json(pathway)
    } catch (error) {
        console.error("Fetch pathway error:", error)
        return NextResponse.json({ error: "Failed to fetch pathway" }, { status: 500 })
    }
}
