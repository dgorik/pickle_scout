import { NextRequest, NextResponse } from 'next/server'
import type { SearchRequest, SearchResult } from '@/types'
import { parsePickleListings, parseRetailSources } from '@/utils/parser'
import { calculateAveragePrice, calculatePriceRange, getTopBrands } from '@/utils/calculations'

// Declare search_web as a global function available in Cursor/Vercel environment
declare function search_web(queries: string[]): Promise<SearchResult[]>

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10
const RATE_LIMIT_WINDOW = 60000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

async function performSearch(queries: string[]): Promise<SearchResult[]> {
  if (process.env.USE_MOCK_DATA === 'true') {
    // Return mock data for local development
    return [{
      title: 'Mock Result',
      url: 'https://example.com',
      snippet: 'This is a mock result for local testing'
    }]
  }

  // In production (Vercel), search_web will be available globally
  try {
    const results = await search_web(queries)
    return results
  } catch (error) {
    throw new Error('Search service unavailable')
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body: SearchRequest = await request.json()
    const { query, type } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    if (query.length > 500) {
      return NextResponse.json(
        { error: 'Query is too long. Maximum 500 characters.' },
        { status: 400 }
      )
    }

    const searchResults = await performSearch([query])

    if (type === 'trends') {
      const listings = parsePickleListings(searchResults)
      return NextResponse.json({
        listings: listings.slice(0, 10),
        averagePrice: calculateAveragePrice(listings),
        priceRange: calculatePriceRange(listings),
        topBrands: getTopBrands(listings),
      })
    }

    if (type === 'sourcing') {
      const sources = parseRetailSources(searchResults)
      return NextResponse.json({ sources })
    }

    return NextResponse.json({ results: searchResults })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
