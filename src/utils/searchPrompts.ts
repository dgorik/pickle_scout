export const trendingQuery = `Search for popular dress rentals on Pickle (shoponpickle.com), the peer-to-peer dress rental marketplace.

Find 10 dresses currently available for rent. For each dress, provide:
- name: Brand and description (e.g., "Reformation Green Midi Dress")
- price: Rental price (e.g., "$55")
- picture: Image URL if available
- url: Link to the listing

Return as JSON array only:
[{"name": "Brand Dress Name", "price": "$XX", "picture": "url", "url": "url"}]

Important: Pickle is the platform, not the brand. Extract real brand names (Zara, Reformation, Revolve, etc.) from listings.`

export const buildSourcingPrompt = (brand: string, style: string) => `
Search the web for places to BUY this dress in good condition at a price LOWER than its typical/historical price:
- Brand: ${brand}
- Style/description: ${style}

Return ONLY a JSON array of up to 8 items with:
- retailer: Store or marketplace name (Depop, Poshmark, ASOS, eBay, etc.)
- item_name: Listing title (include brand + style)
- condition: New / Like new / Good
- current_price: Current sale/ask price (USD, e.g., "$85")
- historical_price: Typical or historical price (MSRP or average) if mentioned; otherwise leave empty string
- discount_percent: Percentage off vs historical_price if both are present; otherwise estimate from context
- url: Direct link to the listing

Rules:
- Prefer listings that are clearly below historical/MSRP or show discount %
- Prefer "Like new" or "Good" condition
- Exclude irrelevant items (not dresses or wrong brand/style)
- Return JSON only, no explanations or markdown.
`

