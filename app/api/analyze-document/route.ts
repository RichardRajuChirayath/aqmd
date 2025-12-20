import { NextResponse } from "next/server"
import Groq from "groq-sdk"
export const dynamic = 'force-dynamic'

const OCR_SPACE_API_KEY = "K84303568988957"

export async function POST(request: Request) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    })
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        // Check if it's an image
        if (!file.type.startsWith("image/")) {
            if (file.type === "application/pdf") {
                return NextResponse.json({
                    topic: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                    reasoning: "Inferred from filename (PDF text extraction pending library installation)"
                })
            }
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
        }

        // Convert image to base64 for OCR.space
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`

        // 1. Perform OCR via OCR.space
        const ocrFormData = new FormData()
        ocrFormData.append("apikey", OCR_SPACE_API_KEY)
        ocrFormData.append("base64Image", base64Image)
        ocrFormData.append("language", "eng")
        ocrFormData.append("isOverlayRequired", "false")
        ocrFormData.append("detectOrientation", "true")
        ocrFormData.append("scale", "true")
        ocrFormData.append("ocrEngine", "2") // Engine 2 is much better for notes/handwriting

        const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            body: ocrFormData,
        })

        if (!ocrResponse.ok) {
            throw new Error("OCR Service failed")
        }

        const ocrData = await ocrResponse.json()
        const extractedText = ocrData.ParsedResults?.[0]?.ParsedText || ""

        if (!extractedText.trim()) {
            return NextResponse.json({
                topic: "Unknown Document",
                reasoning: "OCR could not extract any text from this image."
            })
        }

        // 2. Use Groq Text Model to infer topic from extracted text
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert pedagogical analyst. Your task is to identify the main academic topic from the following extracted text of a study document (notes, textbook, or exam)."
                },
                {
                    role: "user",
                    content: `Extracted Text:\n"${extractedText}"\n\nReturn ONLY a JSON object: { "topic": "Short Topic Title", "reasoning": "Brief explanation" }`,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            max_tokens: 512,
            response_format: { type: "json_object" },
        })

        const responseText = completion.choices[0]?.message?.content || "{}"
        const parsed = JSON.parse(responseText)

        return NextResponse.json({
            topic: parsed.topic || "Inferred Topic",
            fullText: extractedText,
            reasoning: parsed.reasoning || "Deep OCR extraction complete.",
        })
    } catch (error: any) {
        console.error("Document analysis error:", error?.message || error)
        // Return the actual error message for debugging purposes
        return NextResponse.json(
            { error: error?.message || "Failed to analyze document", details: String(error) },
            { status: 500 }
        )
    }
}
