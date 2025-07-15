# Vercel Deployment Instructions

## Root Directory Configuration

⚠️ **Important**: Use the correct Root Directory format in Vercel dashboard:

### ✅ Correct Format:
```
apps/web
```

### ❌ Invalid Formats:
```
./apps/web
/apps/web
../apps/web
```

## Step-by-Step Deployment

1. **Connect GitHub Repository**
   - Repository: `aopopov01/ai-job-board-platform`

2. **Configure Project Settings**
   - **Root Directory**: Leave **empty** (blank)
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `apps/web/.next`
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://rzwumwbmjvbkaedrgmbo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3Vtd2JtanZia2FlZHJnbWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Njc0NjQsImV4cCI6MjA2NzA0MzQ2NH0.JwhIeTEdqCAQ9dU5epmB5lfgqBqJlJ82QeeyZatnV-4
   NEXTAUTH_SECRET=job_board_super_secret_key_2025
   NEXTAUTH_URL=https://your-vercel-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Troubleshooting

- **"Root Directory does not exist"**: Make sure you're using `apps/web` (not `./apps/web` or `/apps/web`)
- **"No Next.js detected"**: Ensure Root Directory is set to `apps/web`
- **404 errors**: Check that environment variables are properly configured

## Project Structure
```
ai-job-board-platform/
├── apps/
│   └── web/          ← Root Directory points here
│       ├── package.json
│       ├── next.config.js
│       └── src/
└── vercel.json       ← Alternative configuration
```