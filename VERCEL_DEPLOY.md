# Quick Vercel Deployment Guide

## Prerequisites
- Vercel account (free at vercel.com)
- Git repository (optional but recommended)

## Method 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel auto-detects Next.js - click **"Deploy"**
5. Done! Your app is live at `your-project.vercel.app`

## Method 2: Deploy via CLI

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name? (press Enter for default)
- Directory? (press Enter for `./`)
- Override settings? **No**

### Step 3: Deploy to Production
```bash
vercel --prod
```

## Environment Variables

If you need environment variables (like `USE_MOCK_DATA`):

**Via Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add variable: `USE_MOCK_DATA` = `false`
3. Redeploy

**Via CLI:**
```bash
vercel env add USE_MOCK_DATA
# Enter value: false
```

## Notes

- ✅ `search_web` function is available globally in Vercel environment
- ✅ No API keys needed if using `search_web`
- ✅ Automatic HTTPS and CDN
- ✅ Automatic deployments on git push (if connected to GitHub)

## Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Run `npm run build` locally first to catch errors

**Function not found?**
- Ensure `search_web` is available in Vercel runtime
- Check Vercel function logs

**Need custom domain?**
- Go to Project Settings → Domains
- Add your domain

