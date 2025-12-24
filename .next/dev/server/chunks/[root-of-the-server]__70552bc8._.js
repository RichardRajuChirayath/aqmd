module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/web [external] (node:stream/web, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/web", () => require("node:stream/web"));

module.exports = mod;
}),
"[project]/app/api/papers/discover/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/groq-sdk/index.mjs [app-route] (ecmascript) <locals>");
;
;
const groq = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]({
    apiKey: process.env.GROQ_API_KEY
});
function generateGoogleSearchUrl(institution, grade, subject) {
    const query = `${institution} ${grade} ${subject} previous year question paper PDF download`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
async function POST(req) {
    try {
        const { institution, grade, subject } = await req.json();
        if (!institution || !grade || !subject) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        const googleSearchUrl = generateGoogleSearchUrl(institution, grade, subject);
        // Portal suggestions
        const papersPrompt = `
      Suggest 3 educational portals for ${institution} ${grade} ${subject} question papers.
      Return JSON: {"papers": [{"title": "...", "portalName": "SelfStudys/Shaalaa/Vedantu", "description": "..."}]}
    `;
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: papersPrompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: {
                type: "json_object"
            }
        });
        const aiResult = JSON.parse(completion.choices[0].message.content || "{}");
        // Career relevance
        const careerPrompt = `
      For ${subject} at ${institution} ${grade}, provide career data.
      Return JSON: {"companies": ["Co1", "Co2"], "roles": ["Role1", "Role2"], "marketDemand": 85, "summary": "Career value sentence."}
    `;
        const careerCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: careerPrompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: {
                type: "json_object"
            }
        });
        const career = JSON.parse(careerCompletion.choices[0].message.content || "{}");
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
    `;
        const evolutionCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: evolutionPrompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: {
                type: "json_object"
            }
        });
        const evolution = JSON.parse(evolutionCompletion.choices[0].message.content || "{}");
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
    `;
        const questionsCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: questionsPrompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: {
                type: "json_object"
            }
        });
        const importantQuestions = JSON.parse(questionsCompletion.choices[0].message.content || "{}");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            papers: aiResult.papers || [],
            career,
            googleSearchUrl,
            evolution,
            importantQuestions
        });
    } catch (error) {
        console.error("Discovery API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to discover papers"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__70552bc8._.js.map