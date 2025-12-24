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
"[project]/lib/google-search.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Simplified PDF discovery using web search
// No API keys required!
__turbopack_context__.s([
    "categorizeLinkType",
    ()=>categorizeLinkType,
    "extractPdfUrl",
    ()=>extractPdfUrl,
    "generateGoogleSearchUrl",
    ()=>generateGoogleSearchUrl,
    "generateSmartLinks",
    ()=>generateSmartLinks,
    "searchPapersSimple",
    ()=>searchPapersSimple
]);
async function searchPapersSimple(query) {
    // Use Google search directly via a search query
    // This approach doesn't need API keys
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' site:selfstudys.com OR site:shaalaa.com OR site:vedantu.com OR site:vturesource.com')}`;
    console.log('[Simple Search] Would search:', query);
    // For now, return empty and let AI handle it
    // This is more reliable than broken API keys
    return [];
}
function extractPdfUrl(pageUrl, pageTitle) {
    // Direct PDF links
    if (pageUrl.endsWith('.pdf')) {
        return pageUrl;
    }
    // Common PDF viewer patterns
    const pdfViewerPatterns = [
        /advance-pdf-viewer/i,
        /pdf-viewer/i,
        /viewpdf/i,
        /download.*pdf/i
    ];
    for (const pattern of pdfViewerPatterns){
        if (pattern.test(pageUrl) || pattern.test(pageTitle)) {
            return pageUrl // This is likely a PDF viewer page
            ;
        }
    }
    // Site-specific handling
    if (pageUrl.includes('selfstudys.com')) {
        // SelfStudys often uses /books/ or /advance-pdf-viewer/
        if (pageUrl.includes('/books/') || pageUrl.includes('pdf-viewer')) {
            return pageUrl;
        }
    }
    if (pageUrl.includes('shaalaa.com')) {
        // Shaalaa question papers
        if (pageUrl.includes('question-paper')) {
            return pageUrl;
        }
    }
    if (pageUrl.includes('vturesource.com') || pageUrl.includes('vtustudent.com')) {
        // VTU resource sites
        return pageUrl;
    }
    return null;
}
function categorizeLinkType(url) {
    if (url.endsWith('.pdf')) {
        return 'Direct PDF';
    }
    if (url.includes('pdf-viewer') || url.includes('viewpdf')) {
        return 'Direct PDF';
    }
    return 'Source Portal';
}
function generateGoogleSearchUrl(institution, grade, subject, year) {
    const query = `${institution} ${grade} ${subject} question paper ${year || 'previous year'} PDF download`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
function generateSmartLinks(institution, grade, subject) {
    const papers = [];
    const normalizedSubject = subject.toLowerCase().replace(/\s+/g, '-');
    const normalizedInst = institution.toLowerCase();
    // SelfStudys patterns
    if (normalizedInst.includes('cbse') || normalizedInst.includes('icse')) {
        papers.push({
            title: `${institution} ${grade} ${subject} Previous Year Papers`,
            link: `https://www.selfstudys.com/books/${normalizedInst}-prev-paper/english/${grade}/${normalizedSubject}-pyp`,
            snippet: `Official ${subject} question papers with solutions`
        });
    }
    // Shaalaa patterns
    papers.push({
        title: `${subject} Question Papers - ${institution} ${grade}`,
        link: `https://www.shaalaa.com/question-paper-solution/${normalizedInst}/${normalizedSubject}-${grade}`,
        snippet: `Practice papers and solutions for ${subject}`
    });
    // Vedantu
    papers.push({
        title: `${institution} ${grade} ${subject} Important Questions PDF`,
        link: `https://www.vedantu.com/${normalizedInst}-${grade}-${normalizedSubject}`,
        snippet: `Study materials and previous year papers`
    });
    return papers;
}
}),
"[project]/app/api/papers/discover/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/groq-sdk/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$google$2d$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/google-search.ts [app-route] (ecmascript)");
;
;
;
const groq = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]({
    apiKey: process.env.GROQ_API_KEY
});
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
        console.log('[Discovery] Searching for:', institution, grade, subject);
        // Generate smart portal links based on URL patterns
        const smartLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$google$2d$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSmartLinks"])(institution, grade, subject);
        const papers = smartLinks.map((result)=>({
                title: result.title,
                url: result.link,
                source: result.link.includes('selfstudys') ? 'SelfStudys' : result.link.includes('shaalaa') ? 'Shaalaa' : result.link.includes('vedantu') ? 'Vedantu' : 'Web',
                type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$google$2d$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["categorizeLinkType"])(result.link),
                googleFallback: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$google$2d$search$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateGoogleSearchUrl"])(institution, grade, subject)
            }));
        console.log('[Discovery] Generated', papers.length, 'smart links');
        // Always generate career relevance
        const careerPrompt = `
      For ${subject} at ${institution} ${grade} level, provide career relevance data.
      
      Return JSON:
      {
        "companies": ["Top Company 1", "Top Company 2"],
        "roles": ["Job Role 1", "Job Role 2"],
        "marketDemand": 85,
        "summary": "One sentence on career value of mastering this subject."
      }
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            papers,
            career
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

//# sourceMappingURL=%5Broot-of-the-server%5D__9312f650._.js.map