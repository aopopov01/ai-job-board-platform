# Job Board Platform

A modern, AI-powered job board platform built with Next.js and React Native.

## Features

- 🔍 **Smart Job Search** - AI-powered job discovery and matching
- 👤 **User Profiles** - Comprehensive candidate and employer profiles  
- 📱 **Mobile App** - Native mobile experience with React Native
- 🔐 **Authentication** - Secure user authentication with Supabase
- 📊 **Analytics** - Dashboard analytics for jobs and applications
- 💼 **Company Profiles** - Dedicated company pages and job management

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-board-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   # Start both web and mobile apps
   npm run dev:all

   # Or start individually
   npm run dev:web    # Web app on http://localhost:3001
   npm run dev:mobile # Mobile app with Expo
   ```

## Project Structure

```
job-board-platform/
├── apps/
│   ├── web/          # Next.js web application
│   └── mobile/       # React Native mobile app
├── packages/
│   ├── ui/           # Shared UI components
│   ├── shared/       # Shared utilities and hooks
│   ├── database/     # Database schemas and migrations
│   └── ai/           # AI/ML utilities
└── docs/             # Documentation
```

## Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run lint` - Run linting across all packages
- `npm run type-check` - Run TypeScript type checking

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React Native** - Mobile app development
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management

### Backend & Database
- **Supabase** - Database and authentication
- **Next.js API Routes** - Backend API endpoints

### Development Tools
- **Turbo** - Monorepo build system
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Environment Setup

Create a `.env.local` file in the `apps/web` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Deployment

### Web Application
The web app is configured for deployment on Vercel:

```bash
npm run build:web
```

### Mobile Application
Build mobile app with Expo EAS:

```bash
npm run build:mobile
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.