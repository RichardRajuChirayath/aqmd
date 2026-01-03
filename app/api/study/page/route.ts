import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import prisma from "@/lib/prisma"
export const dynamic = 'force-dynamic'

// POST: Analyze a completed page with AI
export async function POST(request: Request) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    })

    try {
        const { sessionId, pageNumber, extractedText, action } = await request.json()

        if (!sessionId || !pageNumber) {
            return NextResponse.json({ error: "sessionId and pageNumber required" }, { status: 400 })
        }

        // Find or create the page record
        let page = await prisma.studyPage.findUnique({
            where: {
                sessionId_pageNumber: { sessionId, pageNumber }
            }
        })

        if (!page) {
            // Create the page with extracted text
            page = await prisma.studyPage.create({
                data: {
                    sessionId,
                    pageNumber,
                    extractedText: extractedText || ""
                }
            })
        }

        // If action is "analyze" - generate summary, questions, and tip
        if (action === "analyze" && page.extractedText) {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an expert AI tutor helping students study efficiently. 
                        Analyze the following page content and provide:
                        1. A compressed summary (max 3 sentences)
                        2. Exactly 2 reflection questions to test understanding
                        3. One practical study tip for this content
                        
                        Return ONLY a JSON object in this exact format:
                        {
                            "summary": "Brief summary here",
                            "questions": [
                                {"question": "Question 1?", "expectedAnswer": "Key points for correct answer"},
                                {"question": "Question 2?", "expectedAnswer": "Key points for correct answer"}
                            ],
                            "studyTip": "Practical tip here"
                        }`
                    },
                    {
                        role: "user",
                        content: `Page Content:\n"${page.extractedText.substring(0, 4000)}"`
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.3,
                max_tokens: 1024,
                response_format: { type: "json_object" }
            })

            const responseText = completion.choices[0]?.message?.content || "{}"
            const parsed = JSON.parse(responseText)

            // Update the page with AI analysis
            page = await prisma.studyPage.update({
                where: { id: page.id },
                data: {
                    summary: parsed.summary || "Summary not available",
                    reflectionQs: parsed.questions || [],
                    studyTip: parsed.studyTip || "Focus on understanding the core concepts.",
                    completedAt: new Date()
                }
            })
        }

        return NextResponse.json({ page })
    } catch (error: any) {
        console.error("Page analysis error:", error)
        return NextResponse.json({ error: error?.message || "Failed to analyze page" }, { status: 500 })
    }
}

// GET: Get page data
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const sessionId = searchParams.get("sessionId")
        const pageNumber = searchParams.get("pageNumber")

        if (!sessionId || !pageNumber) {
            return NextResponse.json({ error: "sessionId and pageNumber required" }, { status: 400 })
        }

        const page = await prisma.studyPage.findUnique({
            where: {
                sessionId_pageNumber: { sessionId, pageNumber: parseInt(pageNumber) }
            }
        })

        return NextResponse.json({ page })
    } catch (error: any) {
        console.error("Get page error:", error)
        return NextResponse.json({ error: error?.message || "Failed to get page" }, { status: 500 })
    }
}
