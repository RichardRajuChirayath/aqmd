
import { NextResponse } from "next/server"
import Groq from "groq-sdk"

// Force dynamic to avoid static caching of results
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    let client: Groq | null = null

    try {
        const apiKey = process.env.GROQ_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        }

        client = new Groq({ apiKey })
        const { question, answer, originalScore } = await req.json()

        if (!question || !answer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Lightweight prompt for speed
        const prompt = `
        You are an academic scoring engine.
        Question: "${question}"
        Student Answer: "${answer}"

        Analyze the intent alignment.
        Return ONLY a JSON object:
        {
            "score": number (0-100),
            "feedback": "short, direct sentence about what is improved or still missing"
        }`

        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant", // Faster model
            temperature: 0.1,
            response_format: { type: "json_object" }
        })

        const content = completion.choices[0]?.message?.content
        if (!content) throw new Error("No analysis generated")

        const result = JSON.parse(content)
        return NextResponse.json(result)

    } catch (error) {
        console.error("Live Score Error:", error)
        return NextResponse.json(
            { error: "Failed to analyze score", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
