# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git repository set up
- Environment variables ready

## Environment Variables Required
```
VITE_ALPACA_API_KEY=your_alpaca_api_key
VITE_ALPACA_SECRET_KEY=your_alpaca_secret_key
VITE_ALPACA_PAPER=true
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy automatically

## Option 2: Netlify
1. Push code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Import from GitHub
4. Add environment variables in Site Settings
5. Deploy automatically

## Option 3: Render
1. Push code to GitHub
2. Visit [render.com](https://render.com)
3. Create new Static Site
4. Connect GitHub repository
5. Add environment variables
6. Deploy

## Option 4: Manual Build
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview locally
npm run preview

# Upload 'dist' folder to any static host
```

## Security Notes
- NEVER commit .env files
- Use production API keys carefully
- Enable CORS properly
- Set up rate limiting
- Monitor API usage