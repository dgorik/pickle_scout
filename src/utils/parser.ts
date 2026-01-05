// Parse search results from Perplexity API into structured data
import type { DressListing, RetailSource, SearchResult } from '@/types'

/**
 * Extract price from text (handles $XX, $XX.XX, XX-XX formats)
 */
export function extractPrice(text: string): number | null {
  // Match $XX or $XX.XX
  const priceMatch = text.match(/\$(\d+(?:\.\d{2})?)/)
  if (priceMatch) {
    return parseFloat(priceMatch[1])
  }

  // Match XX-XX range and take average
  const rangeMatch = text.match(/\$(\d+)\s*-\s*\$(\d+)/)
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1])
    const max = parseFloat(rangeMatch[2])
    return (min + max) / 2
  }

  return null
}

/**
 * Extract brand name from text (usually first capitalized word)
 */
export function extractBrand(text: string): string | null {
  // Common dress brands
  const brands = [
    'Zara', 'H&M', 'ASOS', 'Reformation', 'Revolve', 'Free People',
    'Anthropologie', 'Nordstrom', 'Mango', 'Massimo Dutti', 'COS',
    'Arket', 'Everlane', 'Aritzia', 'Aritzia', 'Lulus', 'Showpo',
    'Princess Polly', 'Shein', 'Fashion Nova', 'PrettyLittleThing',
  ]

  const upperCaseWords = text.match(/\b[A-Z][a-z]+\b/g) || []
  
  for (const word of upperCaseWords) {
    if (brands.includes(word)) {
      return word
    }
  }

  // Return first capitalized word if no brand match
  return upperCaseWords[0] || null
}

/**
 * Extract dress style from description
 */
export function extractStyle(description: string): string {
  const styles = ['mini', 'midi', 'maxi', 'bodycon', 'a-line', 'wrap', 'shift', 'fit and flare']
  const lowerDesc = description.toLowerCase()
  
  for (const style of styles) {
    if (lowerDesc.includes(style)) {
      return style
    }
  }
  
  return 'dress'
}

/**
 * Parse JSON response from Perplexity into DressListing objects
 */
export function parsePickleListings(results: SearchResult[]): DressListing[] {
  const listings: DressListing[] = []
  
  // Try to parse JSON from the first result's snippet (Perplexity returns structured data)
  if (results.length > 0 && results[0].snippet) {
    try {
      // Try to extract JSON array from the response
      const jsonMatch = results[0].snippet.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any, index: number) => {
            const price = extractPrice(item.price || '') || 0
            const { brand, style } = extractBrandAndStyle(item.name || '')
            
            listings.push({
              id: `listing-${index}`,
              name: item.name || 'Unknown Dress',
              brand,
              style,
              rentalPrice: price,
              condition: 'like new' as const,
              description: item.name || '',
              url: item.url || '',
              picture: item.picture || '',
            })
          })
          return listings
        }
      }
    } catch (e) {
      // JSON parsing failed, fall back to text extraction
      console.log('JSON parsing failed, using text extraction')
    }
  }

  // Fallback: Extract from unstructured text
  results.forEach((result, index) => {
    const price = extractPrice(result.snippet) || extractPrice(result.title)
    if (!price) return

    const brand = extractBrand(result.title) || extractBrand(result.snippet) || 'Unknown'
    const style = extractStyle(result.title + ' ' + result.snippet)

    listings.push({
      id: `listing-${index}`,
      name: result.title || `${brand} ${style} Dress`,
      brand,
      style,
      rentalPrice: price,
      condition: 'like new' as const,
      description: result.snippet,
      url: result.url,
    })
  })

  return listings
}

/**
 * Extract brand and style from a combined name string
 */
function extractBrandAndStyle(name: string): { brand: string; style: string } {
  const brand = extractBrand(name) || 'Unknown'
  const style = extractStyle(name)
  return { brand, style }
}

/**
 * Parse retail source results
 * Supports structured JSON from Perplexity and falls back to text extraction
 */
export function parseRetailSources(results: SearchResult[]): RetailSource[] {
  const sources: RetailSource[] = []

  // Try to parse JSON array from the first result's snippet
  if (results.length > 0 && results[0].snippet) {
    try {
      const jsonMatch = results[0].snippet.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            const salePrice = extractPrice(item.current_price || '') || extractPrice(item.price || '') || 0
            const historicalPrice = extractPrice(item.historical_price || '') || extractPrice(item.msrp || '') || salePrice || 0
            const retailer = item.retailer || extractRetailer(item.url || '') || 'Unknown'
            if (!salePrice || !retailer) return

            const originalPrice = historicalPrice || salePrice
            const discountPercent = originalPrice > 0 ? ((originalPrice - salePrice) / originalPrice) * 100 : 0

            sources.push({
              retailer,
              originalPrice: Math.round(originalPrice * 100) / 100,
              salePrice: Math.round(salePrice * 100) / 100,
              discountPercent: Math.round(discountPercent),
              url: item.url || '',
              availability: item.condition || item.availability || undefined,
            })
          })
          if (sources.length > 0) return sources
        }
      }
    } catch (e) {
      console.log('Retail JSON parsing failed, falling back to text extraction')
    }
  }

  // Fallback: Extract from unstructured text
  results.forEach((result) => {
    const price = extractPrice(result.snippet) || extractPrice(result.title)
    const retailer = extractRetailer(result.url)
    
    if (!price || !retailer) return

    // Try to extract original price and sale price
    const prices = extractAllPrices(result.snippet + ' ' + result.title)
    const salePrice = prices.length > 0 ? Math.min(...prices) : price
    const originalPrice = prices.length > 1 ? Math.max(...prices) : salePrice * 1.3 // Estimate if not found
    const discountPercent = ((originalPrice - salePrice) / originalPrice) * 100

    sources.push({
      retailer,
      originalPrice: Math.round(originalPrice * 100) / 100,
      salePrice: Math.round(salePrice * 100) / 100,
      discountPercent: Math.round(discountPercent),
      url: result.url,
    })
  })

  return sources
}

/**
 * Extract retailer name from URL
 */
function extractRetailer(url: string): string | null {
  const domain = url.match(/https?:\/\/(?:www\.)?([^\/]+)/)?.[1]
  if (!domain) return null

  const retailers: Record<string, string> = {
    'depop.com': 'Depop',
    'poshmark.com': 'Poshmark',
    'zulily.com': 'Zulily',
    'asos.com': 'ASOS',
    'revolve.com': 'Revolve',
    'nordstrom.com': 'Nordstrom',
    'anthropologie.com': 'Anthropologie',
  }

  return retailers[domain] || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
}

/**
 * Extract all prices from text
 */
function extractAllPrices(text: string): number[] {
  const prices: number[] = []
  const priceRegex = /\$(\d+(?:\.\d{2})?)/g
  let match

  while ((match = priceRegex.exec(text)) !== null) {
    prices.push(parseFloat(match[1]))
  }

  return prices
}

