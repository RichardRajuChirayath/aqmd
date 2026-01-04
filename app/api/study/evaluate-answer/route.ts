import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
    try {
        const { question, expectedAnswer, userAnswer } = await request.json()

        if (!question || !expectedAnswer || !userAnswer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Use AI to evaluate if the answer is semantically correct
        const prompt = `You are evaluating a student's answer to a study question.

Question: ${question}
Expected Answer: ${expectedAnswer}
Student Answer: ${userAnswer}

Evaluate if the student's answer is semantically correct. Consider:
1. Does it capture the main concept/idea of the expected answer?
2. Is it factually accurate?
3. Minor wording differences are OK if the meaning is the same

Respond with ONLY "true" if correct, or "false" if incorrect.`

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-70b-versatile',
            temperature: 0.1,
            max_tokens: 10
        })

        const result = completion.choices[0]?.message?.content?.trim().toLowerCase()
        const isCorrect = result === 'true'

        return NextResponse.json({ isCorrect })
    } catch (error: any) {
        console.error('Answer evaluation error:', error)
        return NextResponse.json(
            { error: error?.message || 'Evaluation failed' },
            { status: 500 }
        )
    }
}
