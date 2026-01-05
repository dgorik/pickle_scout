# Environment Variables Setup

## Quick Setup

### For Local Development

1. Copy the example file:

   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Perplexity API key:

   ```bash
   PERPLEXITY_API_KEY=your_actual_api_key_here
   ```

3. Get your Perplexity API key from: https://www.perplexity.ai/

### For Production (Vercel)

**Option 1: Via Vercel Dashboard (Recommended)**

1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `PERPLEXITY_API_KEY` = `your_api_key`
4. Redeploy your project

**Option 2: Via Vercel CLI**

```bash
vercel env add PERPLEXITY_API_KEY
# Enter your API key when prompted
```

## How It Works

The app uses the Perplexity SDK for search:

- **Perplexity API** (requires `PERPLEXITY_API_KEY`)
  - Uses your Perplexity API key
  - Works in both local and production
  - Returns up to 10 search results per query

## Files

- `.env.local` - Your local environment (gitignored)
- `.env.local.example` - Template for local setup
- `.env.production.example` - Template for production (reference only)

## Security Notes

- ✅ `.env.local` is gitignored (won't be committed)
- ✅ `.env.production` is gitignored (won't be committed)
- ✅ Never commit real API keys to git
- ✅ Use Vercel dashboard for production secrets
