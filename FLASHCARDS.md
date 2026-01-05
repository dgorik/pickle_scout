# 📚 Flashcards: Pickle Inventory Scout Development

## Perplexity API

### Q: What's the difference between Perplexity's Search API and Chat Completions API?
**A:** 
- **Search API** (`search.create`) = Returns web search results (URLs, snippets) for a query
- **Chat Completions API** = Understands complex prompts, can return structured data, follows instructions

### Q: Which Perplexity model should you use for web-enabled AI responses?
**A:** `sonar` model - it has built-in web search capability and can access live web data

### Q: What temperature setting should you use for factual, consistent responses?
**A:** Low temperature (0.1) - produces more deterministic, factual outputs

### Q: How do you call Perplexity Chat Completions API?
**A:** 
```typescript
POST https://api.perplexity.ai/chat/completions
{
  model: 'sonar',
  messages: [{ role: 'user', content: 'prompt' }],
  temperature: 0.1
}
```

---

## Prompt Engineering

### Q: What makes a good prompt for structured data extraction?
**A:** 
- Clear, concise instructions
- Explicit context (e.g., "Pickle is a platform, not a brand")
- Example output format
- Request JSON-only output

### Q: Why are shorter prompts often better?
**A:** Less confusion for the model, clearer intent, faster processing

### Q: How do you ensure the AI returns JSON format?
**A:** 
- Add system message: "Return ONLY JSON, no markdown or explanations"
- Include example JSON structure in prompt
- Use low temperature for consistency

---

## TypeScript

### Q: How do you declare a global function that TypeScript doesn't know about?
**A:** 
```typescript
declare function search_web(queries: string[]): Promise<SearchResult[]>
```

### Q: What's the issue with `.map().filter()` when filtering null values?
**A:** TypeScript doesn't narrow types properly. Use `forEach` with early return or explicit type guards:
```typescript
const results: Type[] = []
items.forEach(item => {
  if (condition) results.push(item)
})
```

### Q: How do you add new fields to an existing interface?
**A:** 
```typescript
export interface DressListing {
  // existing fields...
  name: string      // new field
  picture?: string  // optional new field
}
```

---

## Next.js 14

### Q: Where do you put API routes in Next.js App Router?
**A:** `src/app/api/[route-name]/route.ts` - exports `GET`, `POST`, etc. functions

### Q: When do you need `'use client'` directive?
**A:** For components that use:
- React hooks (`useState`, `useEffect`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs
- Client-side interactivity

### Q: How do you access environment variables in Next.js API routes?
**A:** `process.env.VARIABLE_NAME` - automatically loaded from `.env.local`

### Q: What's the difference between `page.tsx` and `layout.tsx`?
**A:**
- `layout.tsx` = Wraps all pages, shared UI (headers, footers)
- `page.tsx` = Specific page content

---

## Project Architecture

### Q: What's the purpose of the `parser.ts` file?
**A:** Converts raw API responses into structured TypeScript objects (e.g., `SearchResult[]` → `DressListing[]`)

### Q: Why separate `searchPrompts.ts` from the API route?
**A:** 
- Reusability
- Easier prompt iteration
- Cleaner code organization
- Can version control prompts separately

### Q: What does `calculations.ts` contain?
**A:** Business logic functions:
- `calculateAveragePrice()`
- `calculatePriceRange()`
- `calculateROI()`
- `generatePricingGuide()`

---

## Deployment

### Q: What's the easiest way to deploy a Next.js app?
**A:** Vercel - auto-detects Next.js, zero config needed

### Q: How do you set environment variables in Vercel?
**A:** 
1. Dashboard: Settings → Environment Variables
2. CLI: `vercel env add VARIABLE_NAME`

### Q: What files should NEVER be committed to git?
**A:** 
- `.env.local` (contains secrets)
- `.env.production` (contains secrets)
- `node_modules/`
- `.next/` (build output)

### Q: How do you test a production build locally?
**A:** 
```bash
npm run build
npm run start
```

---

## React Patterns

### Q: How do you handle loading states in React?
**A:** 
```typescript
const [loading, setLoading] = useState(false)
// Set to true before async call
// Set to false in finally block
```

### Q: How do you conditionally render based on state?
**A:** 
```typescript
{loading && <Spinner />}
{error && <ErrorMessage />}
{results && <Results data={results} />}
```

### Q: What's a good pattern for managing multiple boolean states?
**A:** Use `Set` for collections:
```typescript
const [trendingItems, setTrendingItems] = useState<Set<string>>(new Set())
// Add: new Set(trendingItems).add(id)
// Remove: new Set(trendingItems).delete(id)
```

---

## Error Handling

### Q: How do you handle API errors in Next.js API routes?
**A:** 
```typescript
try {
  // API call
} catch (error) {
  console.error('Error:', error)
  return NextResponse.json(
    { error: 'User-friendly message' },
    { status: 500 }
  )
}
```

### Q: Why shouldn't you expose internal error details to clients?
**A:** Security - don't leak API keys, stack traces, or internal system info

### Q: How do you implement rate limiting?
**A:** 
- Track requests per IP in a Map
- Check count against limit
- Reset after time window
- Return 429 status if exceeded

---

## UI/UX Patterns

### Q: How do you create a modal overlay?
**A:** 
```typescript
<div className="fixed inset-0 bg-black bg-opacity-50">
  <div onClick={(e) => e.stopPropagation()}>
    {/* Modal content */}
  </div>
</div>
```

### Q: What's a good pattern for image error handling?
**A:** 
```typescript
<img 
  src={url}
  onError={(e) => {
    (e.target as HTMLImageElement).style.display = 'none'
  }}
/>
```

### Q: How do you make a button disabled during loading?
**A:** 
```typescript
<button 
  disabled={loading}
  className="disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

---

## Quick Reference

### Q: What's the command to check TypeScript errors?
**A:** `npm run type-check`

### Q: What's the command to run the dev server?
**A:** `npm run dev`

### Q: What's the command to build for production?
**A:** `npm run build`

### Q: What file contains all TypeScript type definitions?
**A:** `src/types/index.ts`

---

## Key Takeaways

### Q: What's the most important thing about prompt engineering?
**A:** Be explicit, provide context, show examples, request specific formats

### Q: What's the most important thing about TypeScript?
**A:** Let the compiler catch errors before runtime - use proper types everywhere

### Q: What's the most important thing about Next.js API routes?
**A:** They run server-side - perfect for API keys, database access, and sensitive operations

### Q: What's the most important thing about deployment?
**A:** Never commit secrets - use environment variables and `.gitignore`

---

## 🎯 Study Tips

1. **Practice:** Try modifying prompts and see how responses change
2. **Experiment:** Test different Perplexity models (`sonar`, `sonar-pro`)
3. **Debug:** Check browser console and server logs for API responses
4. **Refactor:** Look for opportunities to extract reusable functions
5. **Document:** Add comments explaining "why" not just "what"

---

*Generated from Pickle Inventory Scout development session*

