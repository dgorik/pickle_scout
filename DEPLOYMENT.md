# Deployment Guide

This guide will help you deploy Pickle Inventory Scout to production.

## Prerequisites

- Node.js 18+ installed
- Perplexity API key
- Git repository (optional, for Vercel)

## Pre-Deployment Checklist

### 1. Environment Variables

Create a `.env.local` file (for local development) and set environment variables in your hosting platform:

```bash
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

**Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

### 2. Build Test

Test the production build locally:

```bash
npm run build
npm run start
```

Visit `http://localhost:3000` to verify everything works.

### 3. Type Check

Ensure TypeScript compiles without errors:

```bash
npm run type-check
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

Vercel is the easiest way to deploy Next.js apps.

#### Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

3. **Or deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Add environment variable: `PERPLEXITY_API_KEY`
   - Deploy!

#### Environment Variables on Vercel:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add: `PERPLEXITY_API_KEY` with your API key
4. Redeploy

### Option 2: Other Platforms

#### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variable: `PERPLEXITY_API_KEY`

#### Railway

1. Connect your GitHub repo
2. Railway auto-detects Next.js
3. Add environment variable in dashboard
4. Deploy

#### Self-Hosted (VPS/Docker)

1. Build the app: `npm run build`
2. Start production server: `npm run start`
3. Use PM2 or similar for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "pickle-scout" -- start
   ```

## Post-Deployment

### 1. Verify Environment Variables

Check that `PERPLEXITY_API_KEY` is set correctly in your hosting platform.

### 2. Test the API

Visit your deployed site and test the search functionality.

### 3. Monitor Logs

Check your hosting platform's logs for any errors:
- Vercel: Dashboard → Project → Logs
- Netlify: Site → Functions → Logs

### 4. Set Up Custom Domain (Optional)

Most platforms allow custom domains:
- Vercel: Project Settings → Domains
- Netlify: Site Settings → Domain Management

## Troubleshooting

### Build Fails

- Check TypeScript errors: `npm run type-check`
- Verify all dependencies are in `package.json`
- Check Node.js version (needs 18+)

### API Errors

- Verify `PERPLEXITY_API_KEY` is set correctly
- Check API key permissions and rate limits
- Review error logs in hosting platform

### Environment Variables Not Working

- Ensure variable name matches exactly: `PERPLEXITY_API_KEY`
- Redeploy after adding environment variables
- Check for typos or extra spaces

## Performance Optimization

The app is already optimized with:
- ✅ Next.js 14 App Router
- ✅ React Server Components
- ✅ SWC minification
- ✅ Automatic code splitting
- ✅ Image optimization (if added)

## Security

- ✅ API keys stored as environment variables
- ✅ Security headers configured
- ✅ No sensitive data in client-side code
- ✅ API routes protected server-side

## Monitoring

Consider adding:
- Error tracking (Sentry, LogRocket)
- Analytics (Vercel Analytics, Google Analytics)
- Uptime monitoring (UptimeRobot, Pingdom)

## Support

For issues, check:
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
- Perplexity API docs: https://docs.perplexity.ai/

