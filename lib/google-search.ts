// Simplified PDF discovery using web search
// No API keys required!

interface SearchResult {
    title: string
    link: string
    snippet: string
}

export async function searchPapersSimple(query: string): Promise<SearchResult[]> {
    // Use Google search directly via a search query
    // This approach doesn't need API keys
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' site:selfstudys.com OR site:shaalaa.com OR site:vedantu.com OR site:vturesource.com')}`

    console.log('[Simple Search] Would search:', query)

    // For now, return empty and let AI handle it
    // This is more reliable than broken API keys
    return []
}

export function extractPdfUrl(pageUrl: string, pageTitle: string): string | null {
    // Direct PDF links
    if (pageUrl.endsWith('.pdf')) {
        return pageUrl
    }

    // Common PDF viewer patterns
    const pdfViewerPatterns = [
        /advance-pdf-viewer/i,
        /pdf-viewer/i,
        /viewpdf/i,
        /download.*pdf/i,
    ]

    for (const pattern of pdfViewerPatterns) {
        if (pattern.test(pageUrl) || pattern.test(pageTitle)) {
            return pageUrl // This is likely a PDF viewer page
        }
    }

    // Site-specific handling
    if (pageUrl.includes('selfstudys.com')) {
        // SelfStudys often uses /books/ or /advance-pdf-viewer/
        if (pageUrl.includes('/books/') || pageUrl.includes('pdf-viewer')) {
            return pageUrl
        }
    }

    if (pageUrl.includes('shaalaa.com')) {
        // Shaalaa question papers
        if (pageUrl.includes('question-paper')) {
            return pageUrl
        }
    }

    if (pageUrl.includes('vturesource.com') || pageUrl.includes('vtustudent.com')) {
        // VTU resource sites
        return pageUrl
    }

    return null
}

export function categorizeLinkType(url: string): 'Direct PDF' | 'Source Portal' {
    if (url.endsWith('.pdf')) {
        return 'Direct PDF'
    }

    if (url.includes('pdf-viewer') || url.includes('viewpdf')) {
        return 'Direct PDF'
    }

    return 'Source Portal'
}

export function generateGoogleSearchUrl(institution: string, grade: string, subject: string, year?: string): string {
    const query = `${institution} ${grade} ${subject} question paper ${year || 'previous year'} PDF download`
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

// Generate smart portal links based on patterns
export function generateSmartLinks(institution: string, grade: string, subject: string): SearchResult[] {
    const papers: SearchResult[] = []
    const normalizedSubject = subject.toLowerCase().replace(/\s+/g, '-')
    const normalizedInst = institution.toLowerCase()

    // SelfStudys patterns
    if (normalizedInst.includes('cbse') || normalizedInst.includes('icse')) {
        papers.push({
            title: `${institution} ${grade} ${subject} Previous Year Papers`,
            link: `https://www.selfstudys.com/books/${normalizedInst}-prev-paper/english/${grade}/${normalizedSubject}-pyp`,
            snippet: `Official ${subject} question papers with solutions`
        })
    }

    // Shaalaa patterns
    papers.push({
        title: `${subject} Question Papers - ${institution} ${grade}`,
        link: `https://www.shaalaa.com/question-paper-solution/${normalizedInst}/${normalizedSubject}-${grade}`,
        snippet: `Practice papers and solutions for ${subject}`
    })

    // Vedantu
    papers.push({
        title: `${institution} ${grade} ${subject} Important Questions PDF`,
        link: `https://www.vedantu.com/${normalizedInst}-${grade}-${normalizedSubject}`,
        snippet: `Study materials and previous year papers`
    })

    return papers
}
