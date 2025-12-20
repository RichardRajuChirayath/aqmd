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
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const prisma = global.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) {
    global.prisma = prisma;
}
;
const __TURBOPACK__default__export__ = prisma;
}),
"[project]/app/api/generate-pathway/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/groq-sdk/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
;
;
;
const groq = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]({
    apiKey: process.env.GROQ_API_KEY
});
async function POST(request) {
    try {
        const { topic, guestId, fullText } = await request.json();
        if (!topic || typeof topic !== "string") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Topic is required"
            }, {
                status: 400
            });
        }
        const pathway = await generatePathway(topic.trim(), fullText);
        const savedPathway = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].pathway.create({
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
                masteryRule: pathway.masteryRule
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            id: savedPathway.id,
            topic: savedPathway.topic,
            ...pathway
        });
    } catch (error) {
        console.error("Pathway generation error:", error?.message || error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to generate pathway"
        }, {
            status: 500
        });
    }
}
async function generatePathway(topic, context) {
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
}`;
    const userPrompt = context ? `Generate a tailored explanation and learning pathway based on these study notes:\n\n"${context}"\n\nInferred Topic: "${topic}"` : `Generate a complete learning pathway for the topic: "${topic}"`;
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            max_tokens: 3000,
            response_format: {
                type: "json_object"
            }
        });
        const responseText = completion.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(responseText);
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
            masteryRule: String(parsed.masteryRule || "Mastery rule unavailable.")
        };
    } catch (error) {
        console.error("Groq API error for pathway:", error?.message || error);
        throw error;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4fab0b8e._.js.map