import { NextResponse } from "next/server"

// Scrape search results from DuckDuckGo (doesn't block like Google)
export async function POST(req: Request) {
    try {
        const { query } = await req.json()

        if (!query) {
            return NextResponse.json({ error: "Query required" }, { status: 400 })
        }

        // Use DuckDuckGo HTML search (more permissive than Google)
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`

        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })

        const html = await response.text()

        // Parse results from DDG HTML
        const results: { title: string; url: string; snippet: string }[] = []

        // Extract result links using regex (simple parsing)
        const linkRegex = /<a[^>]+class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g
        const snippetRegex = /<a[^>]+class="result__snippet"[^>]*>([^<]+)/g

        let linkMatch
        let snippetMatch
        const links: { url: string; title: string }[] = []
        const snippets: string[] = []

        while ((linkMatch = linkRegex.exec(html)) !== null) {
            // DDG wraps URLs, extract actual URL
            const uddg = linkMatch[1]
            const urlMatch = uddg.match(/uddg=([^&]+)/)
            const actualUrl = urlMatch ? decodeURIComponent(urlMatch[1]) : uddg
            links.push({ url: actualUrl, title: linkMatch[2].trim() })
        }

        while ((snippetMatch = snippetRegex.exec(html)) !== null) {
            snippets.push(snippetMatch[1].trim())
        }

        // Combine results
        for (let i = 0; i < Math.min(links.length, 10); i++) {
            results.push({
                title: links[i].title,
                url: links[i].url,
                snippet: snippets[i] || ''
            })
        }

        return NextResponse.json({ results })
    } catch (error) {
        console.error("Search error:", error)
        return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }
}
