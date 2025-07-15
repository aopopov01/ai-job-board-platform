# Vercel Settings Sync Instructions

## Current Issue
**"Configuration Settings in the current Production deployment differ from your current Project Settings."**

This means your Vercel dashboard settings don't match the new configuration we just pushed.

## Required Actions

### 1. Update Vercel Project Settings
Go to your Vercel project dashboard and update these settings:

**Build & Development Settings:**
- **Root Directory**: Leave **empty/blank**
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev:web`

### 2. Environment Variables
Ensure these are set in your Vercel project:
```
NEXT_PUBLIC_SUPABASE_URL=https://rzwumwbmjvbkaedrgmbo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3Vtd2JtanZia2FlZHJnbWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Njc0NjQsImV4cCI6MjA2NzA0MzQ2NH0.JwhIeTEdqCAQ9dU5epmB5lfgqBqJlJ82QeeyZatnV-4
NEXTAUTH_SECRET=job_board_super_secret_key_2025
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

### 3. Force Redeploy
After updating settings:
1. Go to the **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or trigger a new deployment by pushing a small change to GitHub

### 4. What Changed
Our new configuration:
- ✅ Moved Next.js detection to root level
- ✅ Build command now targets `apps/web` from root
- ✅ Output directory properly configured
- ✅ Simplified deployment process

### 5. If Still Having Issues
Try these steps:
1. **Clear Build Cache**: In Vercel dashboard, go to Settings > Functions and clear cache
2. **Reimport Project**: Delete the project and reimport from GitHub
3. **Check Branch**: Ensure you're deploying from the `master` branch

## Quick Settings Summary
```
Root Directory: [EMPTY]
Framework: Next.js
Build Command: npm run build
Output Directory: apps/web/.next
Install Command: npm install
Node.js Version: 18.x
```

The key change is that **Root Directory must be empty** and the build process will handle routing to `apps/web` automatically.