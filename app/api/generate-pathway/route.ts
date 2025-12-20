import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import prisma from "@/lib/prisma"

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

interface PathwayResult {
    conceptOverview: string
    easyLearningTips: string[]
    prerequisites: string[]
    unlocks: string[]
    crossSubjectLinks: { subject: string; connection: string }[]
    commonMistakes: { mistake: string; correction: string }[]
    examRelevance: string
    safeToSkip: string[]
    learningOrder: { step: number; topic: string; description: string }[]
    masteryRule: string
}

export async function POST(request: Request) {
    try {
        const { topic, guestId, fullText } = await request.json()

        if (!topic || typeof topic !== "string") {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 })
        }

        const pathway = await generatePathway(topic.trim(), fullText)

        const savedPathway = await prisma.pathway.create({
            data: {
                guestId: guestId || "",
                topic: topic.trim(),
                sourceContent: fullText || "",
                conceptOverview: pathway.conceptOverview,
                easyLearningTips: pathway.easyLearningTips,
                prerequisites: pathway.prerequisites,
                unlocks: pathway.unlocks,
                crossSubjectLinks: pathway.crossSubjectLinks,
                commonMistakes: pathway.commonMistakes,
                examRelevance: pathway.examRelevance,
                safeToSkip: pathway.safeToSkip,
                learningOrder: pathway.learningOrder,
                masteryRule: pathway.masteryRule,
            },
        })

        return NextResponse.json({
            id: savedPathway.id,
            topic: savedPathway.topic,
            ...pathway,
        })
    } catch (error: any) {
        console.error("Pathway generation error:", error?.message || error)
        return NextResponse.json({ error: "Failed to generate pathway" }, { status: 500 })
    }
}

async function generatePathway(topic: string, context?: string): Promise<PathwayResult> {
    const systemPrompt = `You are a world-class curriculum designer and pedagogical expert. Your task is to map out the complete learning pathway, explain the core concept, and provide EASY learning tips for any academic topic.
    
    If context is provided (from a student's notes or textbook), use it to tailor the explanation and pathway.

CRITICAL: Return ONLY a valid JSON object with no extra text.

SCHEMA:
{
  "conceptOverview": "<Detailed explanation of the main concept. If context is provided, explain the specific material shared by the student.>",
  "easyLearningTips": [
    "<Tip 1: A simple analogy, shortcut, or technique to make learning easier>",
    "<Tip 2: Another practical study hack>",
    "<Tip 3: Memory trick or simplified way to think about this>"
  ],
  "prerequisites": ["<topic 1>", "<topic 2>", ...],
  "unlocks": ["<topic A>", "<topic B>", ...],
  "crossSubjectLinks": [
    { "subject": "<Subject>", "connection": "<Connection>" }
  ],
  "commonMistakes": [
    { "mistake": "<Misconception>", "correction": "<Truth>" }
  ],
  "examRelevance": "<Deep analysis of testing frequency>",
  "safeToSkip": ["<Non-essential related topic>", ...],
  "learningOrder": [
    { "step": 1, "topic": "<topic>", "description": "<rationale>" }
  ],
  "masteryRule": "<Professional-grade success criteria>"
}`

    const userPrompt = context
        ? `Generate a tailored explanation and learning pathway based on these study notes:\n\n"${context}"\n\nInferred Topic: "${topic}"`
        : `Generate a complete learning pathway for the topic: "${topic}"`

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            max_tokens: 3000,
            response_format: { type: "json_object" },
        })

        const responseText = completion.choices[0]?.message?.content || "{}"
        const parsed = JSON.parse(responseText)

        return {
            conceptOverview: String(parsed.conceptOverview || "Overview unavailable."),
            easyLearningTips: Array.isArray(parsed.easyLearningTips) ? parsed.easyLearningTips : [],
            prerequisites: Array.isArray(parsed.prerequisites) ? parsed.prerequisites : [],
            unlocks: Array.isArray(parsed.unlocks) ? parsed.unlocks : [],
            crossSubjectLinks: Array.isArray(parsed.crossSubjectLinks) ? parsed.crossSubjectLinks : [],
            commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes : [],
            examRelevance: String(parsed.examRelevance || "Exam data unavailable."),
            safeToSkip: Array.isArray(parsed.safeToSkip) ? parsed.safeToSkip : [],
            learningOrder: Array.isArray(parsed.learningOrder) ? parsed.learningOrder : [],
            masteryRule: String(parsed.masteryRule || "Mastery rule unavailable."),
        }
    } catch (error: any) {
        console.error("Groq API error for pathway:", error?.message || error)
        throw error
    }
}
