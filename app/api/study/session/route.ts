import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
export const dynamic = 'force-dynamic'

// GET: Get active study session for guest
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const guestId = searchParams.get("guestId")

        if (!guestId) {
            return NextResponse.json({ error: "guestId required" }, { status: 400 })
        }

        // Get active session or most recent
        const session = await prisma.studySession.findFirst({
            where: { guestId, status: "active" },
            include: {
                pages: {
                    orderBy: { pageNumber: "asc" }
                }
            },
            orderBy: { updatedAt: "desc" }
        })

        return NextResponse.json({ session })
    } catch (error: any) {
        console.error("Get session error:", error)
        return NextResponse.json({ error: error?.message || "Failed to get session" }, { status: 500 })
    }
}

// POST: Create new study session
export async function POST(request: Request) {
    try {
        const { guestId, pdfName, pdfUrl, totalPages } = await request.json()

        if (!guestId || !pdfName) {
            return NextResponse.json({ error: "guestId and pdfName required" }, { status: 400 })
        }

        // Mark any existing active sessions as paused
        await prisma.studySession.updateMany({
            where: { guestId, status: "active" },
            data: { status: "paused" }
        })

        // Create new session
        const session = await prisma.studySession.create({
            data: {
                guestId,
                pdfName,
                pdfUrl: pdfUrl || "",
                totalPages: totalPages || null,
                currentPage: 1,
                status: "active"
            }
        })

        return NextResponse.json({ session })
    } catch (error: any) {
        console.error("Create session error:", error)
        return NextResponse.json({ error: error?.message || "Failed to create session" }, { status: 500 })
    }
}

// PATCH: Update session (current page, status)
export async function PATCH(request: Request) {
    try {
        const { sessionId, currentPage, status, totalPages } = await request.json()

        if (!sessionId) {
            return NextResponse.json({ error: "sessionId required" }, { status: 400 })
        }

        const updateData: any = { updatedAt: new Date() }
        if (currentPage !== undefined) updateData.currentPage = currentPage
        if (status !== undefined) updateData.status = status
        if (totalPages !== undefined) updateData.totalPages = totalPages

        const session = await prisma.studySession.update({
            where: { id: sessionId },
            data: updateData
        })

        return NextResponse.json({ session })
    } catch (error: any) {
        console.error("Update session error:", error)
        return NextResponse.json({ error: error?.message || "Failed to update session" }, { status: 500 })
    }
}
