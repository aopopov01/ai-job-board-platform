# Job Board Platform - Claude Code Development Plan

## Project Overview
**Timeline**: 8 weeks (July 4 - August 29, 2025)
**Demo Target**: July 31, 2025
**Full Launch**: August 29, 2025

Building the world's best AI-powered job board with intelligent matching, bias reduction, fraud detection, mobile apps, and comprehensive automation features.

## Available Development Tools
- **Claude Code**: Primary development assistant
- **Supabase MCP**: Database and backend operations
- **GitHub MCP**: Version control and deployment
- **Magic UI**: Pre-built React components
- **Framelik Figma**: Design system integration
- **Puppeteer MCP**: Testing and automation

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Mobile**: React Native / Expo
- **Styling**: Tailwind CSS + Magic UI components
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Supabase Realtime

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Social OAuth
- **File Storage**: Supabase Storage
- **AI**: OpenAI GPT-4 API
- **Email**: Resend

### Deployment
- **Web**: Vercel
- **Mobile**: Expo EAS + App Stores
- **Database**: Supabase Cloud

## Project Structure
```
job-board-platform/
├── apps/
│   ├── web/                 # Next.js web application
│   └── mobile/              # React Native mobile app
├── packages/
│   ├── shared/              # Shared components and logic
│   ├── ui/                  # Magic UI component library
│   ├── database/            # Supabase schema and types
│   └── ai/                  # OpenAI integration
├── docs/                    # Documentation
└── tools/                   # Development tools and scripts
```

## Database Schema (Core Tables)

### User Management
```sql
-- user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    user_type TEXT NOT NULL CHECK (user_type IN ('individual', 'company', 'admin')),
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    location TEXT,
    profile_picture_url TEXT,
    bio TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'el', 'ru')),
    google_id TEXT UNIQUE,
    linkedin_id TEXT UNIQUE,
    github_id TEXT UNIQUE,
    apple_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

-- individual_profiles table
CREATE TABLE individual_profiles (
    id UUID PRIMARY KEY REFERENCES user_profiles(id),
    job_search_status TEXT DEFAULT 'not_looking' CHECK (job_search_status IN ('actively_looking', 'open_to_opportunities', 'not_looking', 'hidden')),
    years_of_experience INTEGER,
    current_job_title TEXT,
    current_company TEXT,
    salary_expectation_min DECIMAL,
    salary_expectation_max DECIMAL,
    salary_currency TEXT DEFAULT 'EUR',
    remote_preference TEXT DEFAULT 'flexible' CHECK (remote_preference IN ('remote_only', 'hybrid', 'onsite', 'flexible')),
    subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'pro')),
    auto_apply_enabled BOOLEAN DEFAULT FALSE,
    auto_apply_preferences JSONB,
    profile_completion_score INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE,
    total_referrals INTEGER DEFAULT 0
);

-- company_profiles table
CREATE TABLE company_profiles (
    id UUID PRIMARY KEY REFERENCES user_profiles(id),
    company_name TEXT NOT NULL,
    company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
    industry TEXT,
    founded_year INTEGER,
    company_description TEXT,
    company_logo_url TEXT,
    company_website TEXT,
    subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
    jobs_posted_count INTEGER DEFAULT 0,
    jobs_limit INTEGER DEFAULT 1,
    candidate_searches_count INTEGER DEFAULT 0,
    candidate_searches_limit INTEGER DEFAULT 5,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    custom_branding_enabled BOOLEAN DEFAULT FALSE,
    referral_code TEXT UNIQUE,
    total_referrals INTEGER DEFAULT 0
);
```

### Job Management
```sql
-- job_categories table
CREATE TABLE job_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES job_categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES company_profiles(id),
    posted_by UUID NOT NULL REFERENCES user_profiles(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    job_type TEXT NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'contract', 'internship', 'freelance')),
    work_style TEXT NOT NULL CHECK (work_style IN ('remote', 'hybrid', 'onsite')),
    experience_level TEXT NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead', 'executive')),
    category_id UUID REFERENCES job_categories(id),
    location TEXT,
    salary_min DECIMAL,
    salary_max DECIMAL,
    salary_currency TEXT DEFAULT 'EUR',
    skills_required JSONB,
    skills_nice_to_have JSONB,
    application_deadline DATE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'active', 'paused', 'closed', 'expired')),
    application_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    auto_screening_enabled BOOLEAN DEFAULT TRUE,
    bias_removal_enabled BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    candidate_id UUID NOT NULL REFERENCES individual_profiles(id),
    cover_letter TEXT
,
    application_type TEXT DEFAULT 'manual' CHECK (application_type IN ('manual', 'auto_applied', 'company_reached_out')),
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'shortlisted', 'interview_scheduled', 'interviewed', 'offered', 'hired', 'rejected', 'withdrawn')),
    ai_screening_score DECIMAL,
    ai_screening_notes JSONB,
    recruiter_notes TEXT,
    status_history JSONB,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_status_change TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Skills & Matching
```sql
-- skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    skill_type TEXT DEFAULT 'technical' CHECK (skill_type IN ('technical', 'soft', 'language', 'certification', 'tool')),
    related_skills JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- user_skills table
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES individual_profiles(id),
    skill_id UUID NOT NULL REFERENCES skills(id),
    proficiency_level TEXT NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience DECIMAL,
    is_verified BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'cv_parsed', 'linkedin_import', 'github_import', 'assessment')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- cv_documents table
CREATE TABLE cv_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES individual_profiles(id),
    version_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT,
    file_name TEXT,
    parsed_data JSONB,
    skills_extracted JSONB,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, version_number)
);

-- messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES user_profiles(id),
    recipient_id UUID NOT NULL REFERENCES user_profiles(id),
    job_id UUID REFERENCES jobs(id),
    application_id UUID REFERENCES applications(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_automated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- referral_programs table
CREATE TABLE referral_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES user_profiles(id),
    referred_id UUID REFERENCES user_profiles(id),
    referral_code TEXT UNIQUE NOT NULL,
    referral_type TEXT NOT NULL CHECK (referral_type IN ('individual_signup', 'company_signup', 'subscription_upgrade', 'successful_hire'))
,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
    reward_type TEXT NOT NULL CHECK (reward_type IN ('credit', 'discount', 'cash', 'premium_upgrade')),
    reward_amount DECIMAL,
    reward_applied BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Week-by-Week Development Plan

### Week 1 (July 4-11): Foundation & Design System
**Priority: Get core infrastructure running**

#### Day 1-2: Project Setup
- [ ] Initialize Next.js + Expo monorepo with TypeScript
- [ ] Setup Supabase project via MCP (create database, configure auth)
- [ ] Configure GitHub repository with automated workflows
- [ ] Setup Magic UI component library integration
- [ ] Configure Framelik Figma design system
- [ ] Setup development environment

#### Day 3-4: Authentication & Core Infrastructure
- [ ] Implement Supabase Auth with social providers (Google, LinkedIn, GitHub)
- [ ] Create core database schema using Supabase MCP
- [ ] Setup Row Level Security (RLS) policies
- [ ] Configure Vercel deployment pipeline
- [ ] Setup Expo EAS for mobile builds

#### Day 5-7: Design System & Shared Components
- [ ] Import design tokens from Framelik Figma
- [ ] Build shared component library using Magic UI
- [ ] Create responsive layout components
- [ ] Setup state management (Zustand + React Query)
- [ ] Implement form validation system (React Hook Form + Zod)

### Week 2 (July 11-18): User Management & Profiles
**Priority: Complete user registration and profile management**

#### Day 8-10: User Registration & Onboarding
- [ ] Build registration flow with social auth integration
- [ ] Create user type selection (individual/company/admin)
- [ ] Implement profile creation wizards
- [ ] Add email verification and welcome sequences
- [ ] Build profile completion scoring system

#### Day 11-12: Individual User Profiles
- [ ] Create comprehensive profile forms
- [ ] Implement CV upload with AI parsing (OpenAI + Puppeteer)
- [ ] Build skills management system with AI suggestions
- [ ] Add portfolio and social media integration
- [ ] Create privacy settings and profile visibility controls

#### Day 13-14: Company Profiles & Team Management
- [ ] Build company profile creation flow
- [ ] Implement company verification system
- [ ] Create team invitation and role management
- [ ] Add company branding customization
- [ ] Build approval workflow configuration

### Week 3 (July 18-25): Job Management & AI Matching
**Priority: Core job board functionality with AI**

#### Day 15-17: Job Posting & Management
- [ ] Create job posting forms with rich text editor
- [ ] Implement job categorization and tagging
- [ ] Build job search with advanced filtering
- [ ] Add job analytics and performance tracking
- [ ] Create job promotion and priority features

#### Day 18-19: AI-Powered Matching System
- [ ] Integrate OpenAI for job-candidate matching
- [ ] Build skill inference and suggestion engine
- [ ] Implement automated job recommendations
- [ ] Create AI-powered application screening
- [ ] Add semantic search capabilities

#### Day 20-21: Application System
- [ ] Build job application flow with auto-apply options
- [ ] Implement application status tracking
- [ ] Create company application management dashboard
- [ ] Add bulk application processing
- [ ] Build application analytics

### Week 4 (July 25 - August 1): Communication & Mobile (Demo Ready)
**Priority: Get demo-ready platform with mobile app**

#### Day 22-24: Messaging & Communication
- [ ] Build real-time messaging system using Supabase Realtime
- [ ] Create message templates and automation
- [ ] Implement email notifications with Resend
- [ ] Add interview scheduling with calendar integration
- [ ] Build notification management system

#### Day 25-27: Mobile App Development
- [ ] Port core features to React Native
- [ ] Implement mobile-specific UI components
- [ ] Add push notifications for job matches
- [ ] Create mobile CV scanning with camera
- [ ] Build offline job browsing capabilities

#### Day 28-29: Demo Preparation (Milestone 1)
- [ ] Create demo data and test scenarios
- [ ] Build demo presentation flow
- [ ] Conduct internal testing and bug fixes
- [ ] **DEMO DAY: July 31st - Core Platform Demo**

### Week 5-8: Advanced Features & Launch
**Priority: Complete platform with all features**

### Week 5 (August 1-8): Advanced Features & Fraud Detection
- [ ] Implement fraud detection using Puppeteer
- [ ] Build skill verification system
- [ ] Create referral program functionality
- [ ] Add bias removal in matching algorithms
- [ ] Build predictive analytics

### Week 6 (August 8-15): Payments & Subscriptions
- [ ] Integrate Stripe for subscription management
- [ ] Implement tiered feature access control
- [ ] Build billing and invoice management
- [ ] Create subscription analytics
- [ ] Add promo codes and discount system

### Week 7 (August 15-22): Integrations & Enterprise Features
- [ ] Implement LinkedIn and GitHub integrations
- [ ] Build ATS system integrations (Greenhouse, Lever)
- [ ] Create enterprise features and custom branding
- [ ] Add API access for enterprise clients
- [ ] Prepare mobile app store submissions

### Week 8 (August 22-29): Launch Preparation & Final Polish
- [ ] Comprehensive testing using Puppeteer
- [ ] Multi-language support (EN/EL/RU)
- [ ] GDPR compliance features
- [ ] Performance optimization
- [ ] **FINAL LAUNCH: August 29th - Complete Platform**

## Development Commands & Scripts

### Initial Setup Commands
```bash
# Create monorepo structure
npx create-next-app@latest apps/web --typescript --tailwind --eslint --app
npx create-expo-app@latest apps/mobile --template

# Install dependencies
npm install @supabase/supabase-js zustand @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod openai stripe
```

### Development Workflow
```bash
# Start development servers
npm run dev:web          # Next.js web app
npm run dev:mobile       # Expo mobile app
npm run dev:all          # Both simultaneously

# Database operations
npm run db:generate      # Generate types from Supabase
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed development data

# Testing
npm run test:unit        # Unit tests
npm run test:e2e         # End-to-end tests with Puppeteer
npm run test:mobile      # Mobile app tests

# Deployment
npm run deploy:web       # Deploy to Vercel
npm run build:mobile     # Build mobile app for stores
```

## AI Integration Points

### OpenAI Integration
```typescript
// AI matching system
interface MatchingRequest {
  candidateProfile: CandidateProfile;
  jobRequirements: JobRequirements;
  matchingCriteria: MatchingCriteria;
}

// CV parsing with fraud detection
interface CVParsingRequest {
  cvText: string;
  fraudDetectionEnabled: boolean;
  skillExtractionEnabled: boolean;
}
```

## Success Criteria

### Week 1 Success Criteria
- ✅ Authentication system fully functional
- ✅ Basic user profiles working
- ✅ Database schema implemented
- ✅ Design system integrated

### Week 4 Success Criteria (Demo Milestone)
- ✅ Real-time messaging working
- ✅ Mobile app core features functional
- ✅ Demo-ready platform
- ✅ **SUCCESSFUL DEMO PRESENTATION**

### Final Success Criteria (Week 8)
- ✅ Complete platform operational
- ✅ Mobile apps submitted to stores
- ✅ Payment system integrated
- ✅ All enterprise features working
- ✅ **SUCCESSFUL PLATFORM LAUNCH**

## Critical Notes for Claude Code

1. **Priority Focus**: Always prioritize features that directly impact the demo on July 31st
2. **Tool Integration**: Leverage Magic UI components and Supabase MCP for maximum development speed
3. **Quality Standards**: Maintain high code quality with TypeScript strict mode and comprehensive testing
4. **Performance**: Optimize for performance from day one, especially for mobile
5. **Security**: Implement proper RLS policies and security measures throughout development
6. **Documentation**: Keep documentation updated as features are implemented

## Quick Start Instructions for Claude Code

### Step 1: Project Initialization
```bash
# Navigate to your projects directory
cd ~/Desktop/Projects

# Create the main project directory
mkdir job-board-platform
cd job-board-platform

# Initialize the monorepo
npm init -y
```

### Step 2: Setup Applications
```bash
# Create apps directory
mkdir apps

# Initialize Next.js web app
npx create-next-app@latest apps/web --typescript --tailwind --eslint --app

# Initialize React Native mobile app
npx create-expo-app@latest apps/mobile --template
```

### Step 3: Setup Packages
```bash
# Create packages directory structure
mkdir -p packages/shared packages/ui packages/database packages/ai

# Initialize each package
cd packages/shared && npm init -y
cd ../ui && npm init -y
cd ../database && npm init -y
cd ../ai && npm init -y
cd ../..
```

### Step 4: Supabase Setup via MCP
1. Create new Supabase project
2. Configure authentication providers (Google, LinkedIn, GitHub)
3. Run the database schema from this plan
4. Setup RLS policies
5. Generate TypeScript types

### Step 5: Development Environment
```bash
# Install root dependencies
npm install --save-dev typescript @types/node

# Setup workspaces in package.json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}

# Install all dependencies
npm install
```

## Feature Implementation Priority

### Demo-Critical Features (Week 1-4)
1. **Authentication & User Management**
2. **Job Posting & Search**
3. **Application System**
4. **Basic AI Matching**
5. **Real-time Messaging**
6. **Mobile App Core Features**

### Post-Demo Features (Week 5-8)
1. **Advanced AI & Fraud Detection**
2. **Payment System**
3. **Referral Program**
4. **External Integrations**
5. **Enterprise Features**
6. **Mobile Store Submission**

This plan provides Claude Code with everything needed to build the complete job board platform within the 8-week timeline. The structured approach, clear milestones, and detailed technical specifications ensure efficient development while maintaining high quality standards.

**Ready to start building! 🚀**
