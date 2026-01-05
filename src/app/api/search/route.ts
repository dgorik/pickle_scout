import { NextRequest, NextResponse } from 'next/server'
import type { SearchRequest, SearchResult } from '@/types'
import { parsePickleListings, parseRetailSources } from '@/utils/parser'
import { calculateAveragePrice, calculatePriceRange, getTopBrands } from '@/utils/calculations'

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { query, type } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Call Perplexity API
    const perplexityApiKey = process.env.PERPLEXITY_API_KEY
    if (!perplexityApiKey) {
      return NextResponse.json(
        { error: 'Perplexity API key not configured' },
        { status: 500 }
      )
    }

    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides web search results in a structured format. Return results as JSON with title, url, and snippet fields.',
          },
          {
            role: 'user',
            content: query,
          },
        ],
        return_citations: true,
      }),
    })

    if (!perplexityResponse.ok) {
      const errorData = await perplexityResponse.text()
      console.error('Perplexity API error:', errorData)
      return NextResponse.json(
        { error: 'Search failed', details: errorData },
        { status: 500 }
      )
    }

    const perplexityData = await perplexityResponse.json()
    
    // Parse Perplexity response into SearchResult format
    const searchResults: SearchResult[] = []
    
    if (perplexityData.citations && Array.isArray(perplexityData.citations)) {
      perplexityData.citations.forEach((citation: any, index: number) => {
        searchResults.push({
          title: citation.title || `Result ${index + 1}`,
          url: citation.url || '',
          snippet: citation.snippet || citation.text || '',
        })
      })
    }

    // If no citations, try to parse from content
    if (searchResults.length === 0 && perplexityData.choices?.[0]?.message?.content) {
      const content = perplexityData.choices[0].message.content
      // Simple fallback: create a result from the content
      searchResults.push({
        title: query,
        url: '',
        snippet: content,
      })
    }

    // Process results based on search type
    if (type === 'trends') {
      const listings = parsePickleListings(searchResults)
      const averagePrice = calculateAveragePrice(listings)
      const priceRange = calculatePriceRange(listings)
      const topBrands = getTopBrands(listings)

      return NextResponse.json({
        listings: listings.slice(0, 10), // Top 10
        averagePrice,
        priceRange,
        topBrands,
      })
    }

    if (type === 'sourcing') {
      const sources = parseRetailSources(searchResults)
      return NextResponse.json({ sources })
    }

    // Default: return raw search results
    return NextResponse.json({ results: searchResults })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

