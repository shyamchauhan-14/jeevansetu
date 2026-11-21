# JeevanSetu 2.0 — Deployment & Operations Guide

## 1. Environment Configuration
Create a local `.env` file (do NOT commit to git repository):
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional Alert Gateway / SMS Provider (Leave empty for Demo Simulation Mode)
VITE_ALERT_PROVIDER_API_KEY=
```

## 2. Local Setup & Execution Commands
```bash
# Clone the repository
git clone https://github.com/shyamchauhan-14/jeevansetu.git
cd jeevansetu

# Switch to enhancement branch
git checkout feature/jeevansetu-2.0-enhancements

# Install dependencies
npm install

# Run type checker
npm run typecheck

# Run test suite
npm run test

# Run development server
npm run dev
```

## 3. Production Deployment (Vercel)
1. Link GitHub repository to Vercel dashboard.
2. Build Settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Environment variables: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Enforce HTTPS in production.

## 4. Rollback Strategy
- Every database migration is versioned and additive.
- Frontend git branches allow instantaneous rollback to previous stable commits via Vercel instant rollback.
