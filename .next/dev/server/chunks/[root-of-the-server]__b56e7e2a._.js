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
"[project]/app/api/analyze-intent/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    try {
        const { question, answer } = await request.json();
        if (!question || !answer) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Question and answer are required"
            }, {
                status: 400
            });
        }
        // Mock AI analysis response
        // In production, this would call an AI service using AI_API_KEY
        const mockAnalysis = generateMockAnalysis(question, answer);
        // Store in history (using a simple approach without database)
        // In production, this would save to PostgreSQL via DATABASE_URL
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mockAnalysis);
    } catch (error) {
        console.error("Analysis error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to analyze"
        }, {
            status: 500
        });
    }
}
function generateMockAnalysis(question, answer) {
    // Simple heuristic-based mock analysis
    const questionLower = question.toLowerCase();
    const answerLower = answer.toLowerCase();
    // Check for question keywords in answer
    const questionWords = questionLower.split(/\s+/).filter((w)=>w.length > 4);
    const matchingWords = questionWords.filter((w)=>answerLower.includes(w));
    const baseScore = Math.min(95, Math.round(matchingWords.length / Math.max(questionWords.length, 1) * 100));
    // Add some variance
    const intentScore = Math.max(15, Math.min(95, baseScore + Math.floor(Math.random() * 20) - 10));
    let mismatchType;
    let explanation;
    let expectedIntent;
    let suggestedReframe;
    if (intentScore >= 80) {
        mismatchType = "None - Strong Alignment";
        explanation = "The student's answer directly addresses the core intent of the question. The response demonstrates understanding of what was being asked and provides relevant information.";
        expectedIntent = `The question asks for ${extractIntent(question)}.`;
        suggestedReframe = "The answer is well-aligned with the question. No significant reframing needed.";
    } else if (intentScore >= 50) {
        mismatchType = "Partial Scope Mismatch";
        explanation = "The answer touches on the topic but doesn't fully address all aspects of what the question is asking. Some key elements of the expected response are missing or underdeveloped.";
        expectedIntent = `The question expects a response that covers ${extractIntent(question)}, but the answer only partially addresses this.`;
        suggestedReframe = `Consider restructuring the answer to more directly address: "${question}" by focusing on the specific aspects being asked about.`;
    } else {
        mismatchType = "Intent Deviation";
        explanation = "The answer appears to address a different topic or interprets the question incorrectly. The response may contain relevant information but fails to connect it to what was actually being asked.";
        expectedIntent = `The question specifically asks for ${extractIntent(question)}, but the answer diverges from this intent.`;
        suggestedReframe = `The answer should be rewritten to directly respond to: "${question}". Focus on the key terms and what type of response (explanation, comparison, analysis, etc.) is expected.`;
    }
    return {
        intentScore,
        mismatchType,
        explanation,
        expectedIntent,
        suggestedReframe
    };
}
function extractIntent(question) {
    const q = question.toLowerCase();
    if (q.includes("explain") || q.includes("describe")) {
        return "an explanation or description";
    }
    if (q.includes("compare") || q.includes("contrast")) {
        return "a comparison or contrast";
    }
    if (q.includes("why") || q.includes("reason")) {
        return "reasoning or justification";
    }
    if (q.includes("how")) {
        return "a process or method";
    }
    if (q.includes("what")) {
        return "a definition or identification";
    }
    if (q.includes("analyze") || q.includes("evaluate")) {
        return "an analysis or evaluation";
    }
    return "a direct response to the topic";
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b56e7e2a._.js.map