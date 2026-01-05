import { NextRequest, NextResponse } from 'next/server'
import type { SearchRequest, SearchResult } from '@/types'
import { parsePickleListings, parseRetailSources } from '@/utils/parser'
import { calculateAveragePrice, calculatePriceRange, getTopBrands } from '@/utils/calculations'
import { trendingQuery, buildSourcingPrompt } from '@/utils/searchPrompts'

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

async function performSearch(prompt: string): Promise<SearchResult[]> {
  const perplexityApiKey = process.env.PERPLEXITY_API_KEY
  if (!perplexityApiKey) {
    throw new Error('PERPLEXITY_API_KEY is not configured')
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that extracts data from websites and returns it in valid JSON format only. Do not include any markdown, explanations, or text outside the JSON array.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Perplexity API error:', errorText)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    console.log('Perplexity response:', content)

    return [
      {
        title: 'Perplexity Result',
        url: '',
        snippet: content,
      },
    ]
  } catch (error) {
    console.error('Perplexity search error:', error)
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

    // Build prompt based on type
    let prompt = trendingQuery
    if (type === 'sourcing') {
      // Use brand/style query passed from client to build sourcing prompt
      prompt = buildSourcingPrompt(query, query)
    }

    const searchResults = await performSearch(prompt)

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
