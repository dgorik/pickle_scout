Pickle Inventory Scout - MVP Specification
Project Overview
A web app that helps Pickle sellers (dress lenders) identify trending dresses and find them at discounted prices to maximize rental ROI.

Core Problem
Pickle sellers need to:

Know what dresses are trending (high rental demand)

Find those dresses at discount prices to buy cheaply

Understand optimal pricing for their listings

Make data-driven inventory decisions

MVP Features (Priority Order)
Feature 1: Trend Analyzer
What it does:

User enters a dress description or brand name

App searches current Pickle listings

Shows what's trending and at what price points

UI Components:

Input field: "Search Pickle (e.g., 'black midi dress', 'Zara dress')"

Results card showing:

Top 5-10 listings from Pickle for that search

Brand

Rental price

Item description/category

Average price for that category

"Mark as trending" button

API Calls:

search_web(["Pickle {user_input} dress rental"])

Feature 2: Sourcing Finder
What it does:

For items identified as trending, find where to buy them cheap

Shows discount retailers and secondhand options

UI Components:

List of trending items from Feature 1

"Find Discount Sources" button for each item

Results showing:

Retail stores with discounts (Zulily, ASOS, etc.)

Secondhand platforms (Depop, Poshmark)

Prices and discount percentages

Direct links or "search this" buttons

API Calls:

search_web(["Buy {brand} {style} dress on sale 2026"])

search_web(["Depop {brand} {style} dress"])

search_web(["Poshmark {brand} dress"])

search_web(["Zulily {brand} dress"])

Feature 3: ROI Calculator
What it does:

User inputs purchase price and dress details

App searches Pickle for similar items' rental rates

Shows break-even point and profit potential

UI Components:

Input fields:

Brand name

Dress description (midi, bodycon, etc.)

Your purchase price

Estimated condition (new, like new, good)

Results showing:

Average rental price on Pickle for similar items

Estimated rentals per year (assume 8-12 times)

Monthly income potential

Break-even months

Annual profit estimate

API Calls:

search_web(["Pickle {brand} {description} dress average rental price"])

Feature 4: Pricing Guide
What it does:

User inputs dress they want to list on Pickle

App shows what similar dresses rent for

Suggests optimal pricing

UI Components:

Input fields:

Brand

Dress description

Your retail price paid

Results showing:

Price range for similar items on Pickle (min, max, average)

Suggested price to be competitive

"Underpriced" vs "Fairly priced" vs "Premium" indicator

API Calls:

search_web(["Pickle {brand} {description} price"])

Feature 5: Saved Inventory Tracker
What it does:

User can save dresses they're watching or own

Tracks basic info

UI Components:

"Add to My Inventory" button on results

Saved items list showing:

Brand, style, purchase price

Current Pickle average rental price

Potential annual income

Delete button

Storage:

localStorage: saved_inventory array

Each item: { id, brand, description, purchasePrice, pickleAveragePrice, dateAdded }

Technical Architecture
Frontend Stack
Framework: Next.js 14+ with React and TypeScript

Styling: Tailwind CSS or simple CSS

State Management: React hooks or localStorage

Type Safety: Full TypeScript support for all components and utilities

Structure:

text
src/
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ └── api/
│ └── search/
│ └── route.ts
├── components/
│ ├── TrendAnalyzer.tsx
│ ├── SourcingFinder.tsx
│ ├── ROICalculator.tsx
│ ├── PricingGuide.tsx
│ └── InventoryTracker.tsx
├── utils/
│ ├── searchQueries.ts (pre-built queries)
│ ├── parser.ts (parse search results)
│ ├── calculations.ts (ROI, pricing logic)
│ └── types.ts (TypeScript interfaces)
├── types/
│ └── index.ts (global types)
└── styles/
└── globals.css
Backend/API Integration
Runtime: Next.js API routes (serverless by default on Vercel)

Language: TypeScript

Role: Call search_web API and return parsed results

Example endpoint: /api/search?q=Pickle+dress+rental&type=trends

API Usage Pattern
typescript
// Frontend calls backend
const response = await fetch('/api/search', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
query: 'Pickle black midi dress rental',
type: 'trends' // or 'sourcing', 'pricing', 'roi'
})
})

const data: SearchResult[] = await response.json()

// Backend (route.ts) calls search_web
// Parses results with TypeScript types
// Returns structured data to frontend
TypeScript Types
typescript
interface DressListing {
id: string
brand: string
style: string
rentalPrice: number
condition: 'new' | 'like new' | 'good'
location?: string
reviews?: number
}

interface RetailSource {
retailer: string
originalPrice: number
salePrice: number
discountPercent: number
url?: string
}

interface InventoryItem {
id: string
brand: string
description: string
purchasePrice: number
pickleAveragePrice: number
dateAdded: Date
estimatedAnnualIncome?: number
}
Parsing Logic
Extract price: look for "$XX" or "
−
−" patterns

Extract brand: first capitalized word usually

Extract description: from listing title

Extract source: from URL domain

Calculate percentages: (originalPrice - salePrice) / originalPrice \* 100

Key Search Query Patterns
Trend Analysis Queries
text
"Pickle {brand} dress rental"
"Pickle {style} dress trending"
"Pickle dress rental {season}" (e.g., winter, summer)
"Pickle designer dresses average price"
Sourcing Queries
text
"Buy {brand} {style} dress on sale"
"Depop {brand} dress"
"Poshmark {brand} dress"
"Zulily {brand} flash sale"
"ASOS {brand} dress clearance"
"Revolve {brand} dress discount"
Pricing Queries
text
"Pickle {brand} {style} dress price"
"Pickle similar midi dress rental rate"
"Pickle {brand} average rental price 2026"
Data to Extract from Results
From Pickle Listings
Brand name

Dress style (midi, mini, maxi, bodycon, etc.)

Rental price

Item condition

Lender location (if available)

Number of reviews/rentals (if available)

From Retail/Discount Sources
Original price

Sale price

Discount percentage

Retailer name

Availability

Link/store

MVP Success Criteria
✅ User can search for trending dresses on Pickle

✅ User can find discount sources for those dresses

✅ User can calculate ROI on a dress purchase

✅ User can see suggested pricing for their listings

✅ User can save items to track (localStorage)

✅ Results are displayed clearly with actionable data

✅ App can be refreshed to get updated pricing

✅ TypeScript provides type safety throughout

✅ API routes handle all search operations

Future Enhancements (Post-MVP)
Browser notifications for price drops on saved items

Email alerts for trending items

Historical pricing trends

Integration with Pickle API (when available)

Export inventory to spreadsheet

Performance analytics (her own listings)

Seasonal trend forecasting

Comparative analysis: "Should I rent or sell?"

Auto-sync with her Pickle closet

Database integration (PostgreSQL/Supabase) for persistence

User authentication for multi-device sync

Notes for Cursor
Keep the MVP to ONE main feature at a time - start with Trend Analyzer

Use Next.js app router (not pages router) for modern setup

Add TypeScript interfaces in types/index.ts for all data structures

Focus on clean UI that shows data clearly

Results should be actionable (links to buy, price to set, etc.)

localStorage for saved items keeps it simple - no database needed initially

Test with real searches to ensure parsing works

Make search queries flexible - user should control what they search for

Consider rate limiting - don't hammer search_web too hard

Show loading states while searching

Add error handling for failed searches with TypeScript error types

Consider caching results briefly to avoid duplicate searches

Use React Server Components where appropriate for performance

Deploy to Vercel for seamless Next.js experience
