import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

function generateGoogleSearchUrl(institution: string, grade: string, subject: string): string {
  const query = `${institution} ${grade} ${subject} previous year question paper PDF download`
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

export async function POST(req: Request) {
  try {
    const { institution, grade, subject } = await req.json()

    if (!institution || !grade || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const googleSearchUrl = generateGoogleSearchUrl(institution, grade, subject)

    // Portal suggestions
    const papersPrompt = `
      Suggest 3 educational portals for ${institution} ${grade} ${subject} question papers.
      Return JSON: {"papers": [{"title": "...", "portalName": "SelfStudys/Shaalaa/Vedantu", "description": "..."}]}
    `

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: papersPrompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    })

    const aiResult = JSON.parse(completion.choices[0].message.content || "{}")

    // Career relevance
    const careerPrompt = `
      For ${subject} at ${institution} ${grade}, provide career data.
      Return JSON: {"companies": ["Co1", "Co2"], "roles": ["Role1", "Role2"], "marketDemand": 85, "summary": "Career value sentence."}
    `

    const careerCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: careerPrompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    })

    const career = JSON.parse(careerCompletion.choices[0].message.content || "{}")

    // NEW: Question Evolution Analysis
    const evolutionPrompt = `
      Analyze how ${institution} ${grade} ${subject} exam patterns evolved over the last 5 years (2019-2024).
      
      Return JSON:
      {
        "yearlyChanges": [
          {"year": 2019, "mcqPercent": 40, "theoryPercent": 60, "avgDifficulty": 6},
          {"year": 2020, "mcqPercent": 45, "theoryPercent": 55, "avgDifficulty": 6},
          {"year": 2021, "mcqPercent": 50, "theoryPercent": 50, "avgDifficulty": 7},
          {"year": 2022, "mcqPercent": 55, "theoryPercent": 45, "avgDifficulty": 7},
          {"year": 2023, "mcqPercent": 60, "theoryPercent": 40, "avgDifficulty": 8}
        ],
        "keyTrends": ["MCQs increasing +5% yearly", "Theory decreasing", "Difficulty rising"],
        "prediction2025": {
          "mcqPercent": 65,
          "theoryPercent": 35,
          "avgDifficulty": 8,
          "newTopics": ["Latest topic 1", "Latest topic 2"],
          "tip": "Focus on quick problem-solving, expect more application-based MCQs"
        }
      }
    `

    const evolutionCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: evolutionPrompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    })

    const evolution = JSON.parse(evolutionCompletion.choices[0].message.content || "{}")

    // NEW: Most Important Questions Predictor
    const questionsPrompt = `
      Analyze ${institution} ${grade} ${subject} past 5 years papers and predict most important questions for 2025.
      
      Return JSON:
      {
        "predictedQuestions": [
          {
            "question": "Exact question or topic that repeats",
            "chapter": "Chapter name",
            "frequency": 4,
            "lastAsked": 2023,
            "probability": 87,
            "marks": 5,
            "difficulty": "Medium"
          }
        ],
        "chapterWiseImportance": [
          {"chapter": "Chapter Name", "weightage": 15, "mustStudyTopics": ["Topic1", "Topic2"]}
        ],
        "sureShots": ["Question that appears EVERY year"],
        "newPredictions": ["New question likely based on syllabus changes"]
      }
    `

    const questionsCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: questionsPrompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    })

    const importantQuestions = JSON.parse(questionsCompletion.choices[0].message.content || "{}")

    return NextResponse.json({
      papers: aiResult.papers || [],
      career,
      googleSearchUrl,
      evolution,
      importantQuestions  // NEW: Question predictions
    })
  } catch (error) {
    console.error("Discovery API Error:", error)
    return NextResponse.json({ error: "Failed to discover papers" }, { status: 500 })
  }
}
