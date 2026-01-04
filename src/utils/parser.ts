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
 * Parse Perplexity search results into DressListing objects
 */
export function parsePickleListings(results: SearchResult[]): DressListing[] {
  const listings: DressListing[] = []
  
  results.forEach((result, index) => {
    const price = extractPrice(result.snippet) || extractPrice(result.title)
    if (!price) return

    const brand = extractBrand(result.title) || extractBrand(result.snippet) || 'Unknown'
    const style = extractStyle(result.title + ' ' + result.snippet)

    listings.push({
      id: `listing-${index}`,
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
 * Parse retail source results
 */
export function parseRetailSources(results: SearchResult[]): RetailSource[] {
  const sources: RetailSource[] = []
  
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

