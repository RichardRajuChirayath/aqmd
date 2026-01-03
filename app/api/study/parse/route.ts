import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
export const dynamic = 'force-dynamic'

const OCR_SPACE_API_KEY = "K84303568988957"

// POST: Parse PDF page via OCR and store
export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const sessionId = formData.get("sessionId") as string
        const pageNumber = parseInt(formData.get("pageNumber") as string)
        const pageImage = formData.get("pageImage") as string // Base64 image of the page

        if (!sessionId || !pageNumber || !pageImage) {
            return NextResponse.json({
                error: "sessionId, pageNumber, and pageImage required"
            }, { status: 400 })
        }

        // Perform OCR via OCR.space
        const ocrFormData = new FormData()
        ocrFormData.append("apikey", OCR_SPACE_API_KEY)
        ocrFormData.append("base64Image", pageImage)
        ocrFormData.append("language", "eng")
        ocrFormData.append("isOverlayRequired", "false")
        ocrFormData.append("detectOrientation", "true")
        ocrFormData.append("scale", "true")
        ocrFormData.append("OCREngine", "2")

        const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            body: ocrFormData,
        })

        if (!ocrResponse.ok) {
            throw new Error("OCR Service failed")
        }

        const ocrData = await ocrResponse.json()
        const extractedText = ocrData.ParsedResults?.[0]?.ParsedText || ""

        // Upsert the page record
        const page = await prisma.studyPage.upsert({
            where: {
                sessionId_pageNumber: { sessionId, pageNumber }
            },
            update: {
                extractedText
            },
            create: {
                sessionId,
                pageNumber,
                extractedText
            }
        })

        return NextResponse.json({
            page,
            textLength: extractedText.length,
            success: extractedText.length > 0
        })
    } catch (error: any) {
        console.error("Parse page error:", error)
        return NextResponse.json({
            error: error?.message || "Failed to parse page"
        }, { status: 500 })
    }
}
