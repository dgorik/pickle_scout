// Pre-built search query generators for different search types

export function buildTrendQuery(userInput: string): string {
  return `Pickle ${userInput} dress rental`
}

export function buildSourcingQuery(brand: string, style: string): string[] {
  return [
    `Buy ${brand} ${style} dress on sale 2026`,
    `Depop ${brand} ${style} dress`,
    `Poshmark ${brand} dress`,
    `Zulily ${brand} dress`,
    `ASOS ${brand} dress clearance`,
    `Revolve ${brand} dress discount`,
  ]
}

export function buildROIQuery(brand: string, description: string): string {
  return `Pickle ${brand} ${description} dress average rental price`
}

export function buildPricingQuery(brand: string, description: string): string {
  return `Pickle ${brand} ${description} dress price`
}

