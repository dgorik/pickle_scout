// Business logic calculations for ROI and pricing
import type { DressListing, ROICalculation, PricingGuide } from '@/types'

/**
 * Calculate average price from listings
 */
export function calculateAveragePrice(listings: DressListing[]): number {
  if (listings.length === 0) return 0
  const sum = listings.reduce((acc, listing) => acc + listing.rentalPrice, 0)
  return Math.round((sum / listings.length) * 100) / 100
}

/**
 * Calculate price range from listings
 */
export function calculatePriceRange(listings: DressListing[]): { min: number; max: number } {
  if (listings.length === 0) return { min: 0, max: 0 }
  
  const prices = listings.map(l => l.rentalPrice)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

/**
 * Calculate ROI for a dress purchase
 */
export function calculateROI(
  purchasePrice: number,
  averageRentalPrice: number,
  estimatedRentalsPerYear: number = 10
): ROICalculation {
  const monthlyIncome = (averageRentalPrice * estimatedRentalsPerYear) / 12
  const annualIncome = averageRentalPrice * estimatedRentalsPerYear
  const breakEvenMonths = purchasePrice / monthlyIncome
  const annualProfit = annualIncome - purchasePrice

  return {
    purchasePrice,
    averageRentalPrice,
    estimatedRentalsPerYear,
    monthlyIncome: Math.round(monthlyIncome * 100) / 100,
    breakEvenMonths: Math.round(breakEvenMonths * 10) / 10,
    annualProfit: Math.round(annualProfit * 100) / 100,
  }
}

/**
 * Generate pricing guide based on similar listings
 */
export function generatePricingGuide(
  similarListings: DressListing[],
  retailPricePaid: number
): PricingGuide {
  if (similarListings.length === 0) {
    return {
      priceRange: { min: 0, max: 0, average: 0 },
      suggestedPrice: 0,
      pricingIndicator: 'fairly_priced',
      similarListings: [],
    }
  }

  const averagePrice = calculateAveragePrice(similarListings)
  const priceRange = calculatePriceRange(similarListings)
  
  // Suggested price: slightly below average to be competitive
  const suggestedPrice = Math.round((averagePrice * 0.9) * 100) / 100

  // Determine pricing indicator
  let pricingIndicator: 'underpriced' | 'fairly_priced' | 'premium'
  const rentalToRetailRatio = averagePrice / retailPricePaid
  
  if (rentalToRetailRatio < 0.1) {
    pricingIndicator = 'underpriced'
  } else if (rentalToRetailRatio > 0.2) {
    pricingIndicator = 'premium'
  } else {
    pricingIndicator = 'fairly_priced'
  }

  return {
    priceRange: {
      ...priceRange,
      average: averagePrice,
    },
    suggestedPrice,
    pricingIndicator,
    similarListings,
  }
}

/**
 * Get top brands from listings
 */
export function getTopBrands(listings: DressListing[], limit: number = 5): string[] {
  const brandCounts: Record<string, number> = {}
  
  listings.forEach(listing => {
    brandCounts[listing.brand] = (brandCounts[listing.brand] || 0) + 1
  })

  return Object.entries(brandCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([brand]) => brand)
}

