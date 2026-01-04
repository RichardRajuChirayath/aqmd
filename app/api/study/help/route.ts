import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import prisma from "@/lib/prisma"
export const dynamic = 'force-dynamic'

// POST: "I'm Stuck" - Get AI explanation with real-life examples
export async function POST(request: Request) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    })

    try {
        const { sessionId, pageNumber, specificQuestion } = await request.json()

        if (!sessionId || !pageNumber) {
            return NextResponse.json({ error: "sessionId and pageNumber required" }, { status: 400 })
        }

        // Get the page content
        const page = await prisma.studyPage.findUnique({
            where: {
                sessionId_pageNumber: { sessionId, pageNumber }
            }
        })

        if (!page || !page.extractedText) {
            return NextResponse.json({ error: "Page content not found" }, { status: 404 })
        }

        // Generate helpful explanation
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a friendly, patient AI tutor. A student is struggling to understand this content.
                    
                    Your job is to:
                    1. Explain the concepts in simple, everyday language
                    2. Use bullet points for KEY concepts
                    3. Provide 2-3 real-life examples (also as bullet points)
                    4. Break down complex terms in a numbered list
                    5. Give a memorable summary at the end
                    
                    Be encouraging and supportive. Avoid jargon. Make it feel like a helpful friend explaining things.
                    
                    Format your explanation with:
                    • Bullet points for main concepts
                    • Examples numbered as "Example 1:", "Example 2:"
                    • Line breaks between sections
                    
                    Return ONLY a JSON object:
                    {
                        "greeting": "A short encouraging message",
                        "explanation": "The main explanation with bullet points and examples",
                        "keyTakeaway": "One sentence memorable summary",
                        "encouragement": "A motivating closing message"
                    }`
                },
                {
                    role: "user",
                    content: specificQuestion
                        ? `The student is specifically confused about: "${specificQuestion}"\n\nPage Content:\n"${page.extractedText.substring(0, 3000)}"`
                        : `Help me understand this content:\n"${page.extractedText.substring(0, 3000)}"`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1500,
            response_format: { type: "json_object" }
        })

        const responseText = completion.choices[0]?.message?.content || "{}"
        const parsed = JSON.parse(responseText)

        // Update page to mark help was requested
        await prisma.studyPage.update({
            where: { id: page.id },
            data: {
                helpRequested: true,
                aiExplanation: parsed.explanation || "Let me help you understand this better..."
            }
        })

        return NextResponse.json({
            greeting: parsed.greeting || "Let's figure this out together! 💪",
            explanation: parsed.explanation || "I'll help you understand this step by step.",
            keyTakeaway: parsed.keyTakeaway || "Focus on the main concept and practice it.",
            encouragement: parsed.encouragement || "You've got this! Every expert was once a beginner."
        })
    } catch (error: any) {
        console.error("Help request error:", error)
        return NextResponse.json({ error: error?.message || "Failed to get help" }, { status: 500 })
    }
}
