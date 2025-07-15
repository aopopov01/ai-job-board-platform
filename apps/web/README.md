# Job Board Platform - Web Application

This is the Next.js web application for the AI-powered job board platform.

## Deployment on Vercel

### Root Directory Setting
When deploying to Vercel, set the **Root Directory** to: `apps/web`

### Environment Variables
Add these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://rzwumwbmjvbkaedrgmbo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3Vtd2JtanZia2FlZHJnbWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Njc0NjQsImV4cCI6MjA2NzA0MzQ2NH0.JwhIeTEdqCAQ9dU5epmB5lfgqBqJlJ82QeeyZatnV-4
NEXTAUTH_SECRET=job_board_super_secret_key_2025
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

### Build Settings
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Features

- 🏢 **8 Tech Island Companies**: Complete Cyprus tech ecosystem
- 💼 **17 Real Job Positions**: Authentic job opportunities
- 🔍 **Advanced Search**: Working filters and search functionality
- 🎨 **Modern UI**: Neuronic design with consistent navigation
- 🔒 **Enterprise Security**: Comprehensive authentication
- 📱 **Mobile Responsive**: Full functionality across devices
- 🗄️ **Supabase Integration**: Real database connectivity

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`