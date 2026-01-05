// Core data types for Pickle Inventory Scout

export interface DressListing {
  id: string
  brand: string
  style: string
  rentalPrice: number
  condition: 'new' | 'like new' | 'good'
  location?: string
  reviews?: number
  description?: string
  url?: string
}

export interface RetailSource {
  retailer: string
  originalPrice: number
  salePrice: number
  discountPercent: number
  url?: string
  availability?: string
}

export interface InventoryItem {
  id: string
  brand: string
  description: string
  purchasePrice: number
  pickleAveragePrice: number
  dateAdded: Date
  estimatedAnnualIncome?: number
}

export interface SearchResult {
  title: string
  url: string
  snippet: string
  price?: number
  brand?: string
  source?: string
}

export interface TrendAnalysisResult {
  listings: DressListing[]
  averagePrice: number
  priceRange: {
    min: number
    max: number
  }
  topBrands: string[]
}

export interface ROICalculation {
  purchasePrice: number
  averageRentalPrice: number
  estimatedRentalsPerYear: number
  monthlyIncome: number
  breakEvenMonths: number
  annualProfit: number
}

export interface PricingGuide {
  priceRange: {
    min: number
    max: number
    average: number
  }
  suggestedPrice: number
  pricingIndicator: 'underpriced' | 'fairly_priced' | 'premium'
  similarListings: DressListing[]
}

export type SearchType = 'trends' | 'sourcing' | 'pricing' | 'roi'

export interface SearchRequest {
  query: string
  type: SearchType
}

