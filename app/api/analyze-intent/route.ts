import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import prisma from "@/lib/prisma"
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
  try {
    const { question, answer, guestId } = await request.json()

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 })
    }

    // Call Groq AI for analysis
    const analysis = await analyzeWithGroq(question, answer)

    // Save to database with guest identity
    const savedAnalysis = await prisma.analysis.create({
      data: {
        guestId: guestId || "",
        question,
        answer,
        intentScore: analysis.intentScore,
        mismatchType: analysis.mismatchType,
        explanation: analysis.explanation,
        expectedIntent: analysis.expectedIntent,
        suggestedReframe: analysis.suggestedReframe,
      },
    })

    return NextResponse.json({
      id: savedAnalysis.id,
      ...analysis,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({
      error: "Failed to analyze",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

interface AnalysisResult {
  intentScore: number
  mismatchType: string
  explanation: string
  expectedIntent: string
  suggestedReframe: string
}

async function analyzeWithGroq(question: string, answer: string, retryCount = 0): Promise<AnalysisResult> {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
  const systemPrompt = `You are a professional educational assessor. Your task is to analyze the semantic alignment between a teacher's question and a student's response.
  
  CRITICAL: You must return ONLY a JSON object. Do not include any preamble, markdown formatting, or postscript.
  
  SCHEMA:
  {
    "intentScore": <number 0-100 indicating semantic alignment>,
    "mismatchType": "<string: None - Strong Alignment | Partial Scope Mismatch | Intent Deviation | Topic Confusion | Incomplete Response>",
    "explanation": "<string: detailed pedagogical feedback explaining the score>",
    "expectedIntent": "<string: the core concept the question targeted>",
    "suggestedReframe": "<string: how the answer should be improved>"
  }`

  const userPrompt = `Question: "${question}"\nStudent Answer: "${answer}"`

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile", // Using a more capable model for JSON reliability
      temperature: 0.1,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    })

    const responseText = completion.choices[0]?.message?.content || "{}"
    const parsed = JSON.parse(responseText)

    // Ensure all fields exist with fallback strings if not returned by AI
    return {
      intentScore: typeof parsed.intentScore === 'number' ? Math.max(0, Math.min(100, parsed.intentScore)) : 50,
      mismatchType: String(parsed.mismatchType || "Analysis Pending"),
      explanation: String(parsed.explanation || "No clarification provided by AI."),
      expectedIntent: String(parsed.expectedIntent || "Intent mapping failed."),
      suggestedReframe: String(parsed.suggestedReframe || "Review question context."),
    }
  } catch (error: any) {
    console.error(`Groq API error (Attempt ${retryCount + 1}):`, error?.message || error)

    if (retryCount < 1) {
      return analyzeWithGroq(question, answer, retryCount + 1)
    }

    // Instead of a hidden 50% score, return a clear error state
    return {
      intentScore: 0, // 0 indicates a failure to process
      mismatchType: "Analysis Engine Failure",
      explanation: `The AI analysis engine encountered an error: ${error?.message || "Internal Error"}. Please check your API key or try again later.`,
      expectedIntent: "Error during pedagogical mapping.",
      suggestedReframe: "Check system health or contact support.",
    }
  }
}
