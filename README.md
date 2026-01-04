# Pickle Inventory Scout

A web app that helps Pickle sellers identify trending dresses and find them at discounted prices to maximize rental ROI.

## Features

- 🔍 **Trend Analyzer** - Search Pickle listings to find trending dresses and price points
- 💰 **ROI Calculator** - Calculate break-even and profit potential for dress purchases
- 📊 **Pricing Guide** - Get suggested pricing for your listings
- 🛍️ **Sourcing Finder** - Find discount retailers and secondhand options
- 📦 **Inventory Tracker** - Save and track your inventory (localStorage)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then add your Perplexity API key to `.env.local`:
   ```
   PERPLEXITY_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/search/     # API route for Perplexity search
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page with Trend Analyzer
│   └── globals.css     # Global styles
├── components/
│   ├── TrendAnalyzer.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── types/
│   └── index.ts        # TypeScript interfaces
└── utils/
    ├── searchQueries.ts
    ├── parser.ts
    └── calculations.ts
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Technologies Used

- [Next.js](https://nextjs.org/) 14 with App Router
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Perplexity API](https://www.perplexity.ai/) for web search

## Deployment

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable: `PERPLEXITY_API_KEY`
4. Deploy!

### Test Production Build Locally

```bash
npm run build
npm run start
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Security Features

- ✅ Rate limiting (10 requests per minute per IP)
- ✅ Input validation and sanitization
- ✅ Security headers configured
- ✅ API keys stored as environment variables
- ✅ Error messages don't expose sensitive information
