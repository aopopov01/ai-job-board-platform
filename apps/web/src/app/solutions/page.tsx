import React from 'react'
import Link from 'next/link'
import { 
  Users, 
  Briefcase, 
  Target, 
  BarChart3,
  Zap as Lightning,
  Brain,
  Shield,
  Globe,
  Bot,
  MessageSquare,
  Clock,
  Eye,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Rocket,
  Award,
  TrendingUp,
  Search,
  Filter,
  Star
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

// Solutions Hero Section
function SolutionsHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/20 border-2 border-blue-400/40 rounded-full mb-10 backdrop-blur-sm shadow-lg">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            <span className="text-sm text-blue-100 font-bold tracking-wide">⚡ LIGHTNING SOLUTIONS</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8">
            <span className="text-white block leading-tight drop-shadow-2xl">Powerful solutions</span>
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block leading-tight drop-shadow-2xl py-2">
              for every journey
            </span>
          </h1>
          
          <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-16 font-medium">
            ⚡ Whether you're a candidate seeking your dream role or a recruiter building world-class teams, 
            TalentAIze delivers lightning-powered solutions tailored to your needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="#candidates">
              <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl">
                For Candidates
              </button>
            </Link>
            <Link href="#recruiters">
              <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md">
                For Recruiters
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Candidate Solutions Section
function CandidateSolutions() {
  const candidateFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Profile Optimization",
      description: "Lightning-fast AI analysis identifies skill gaps and optimizes your profile for maximum visibility to top recruiters.",
      features: ["Smart skill recommendations", "Profile strength scoring", "ATS optimization", "Industry insights"]
    },
    {
      icon: Target,
      title: "Precision Job Matching",
      description: "Advanced algorithms match you with roles that align perfectly with your skills, goals, and career aspirations.",
      features: ["99.2% match accuracy", "Real-time opportunities", "Salary range matching", "Cultural fit analysis"]
    },
    {
      icon: Lightning,
      title: "Lightning Alerts & Notifications",
      description: "Instant notifications when dream opportunities arise or when recruiters view your profile.",
      features: ["Real-time job alerts", "Profile view notifications", "Application status updates", "Interview reminders"]
    },
    {
      icon: Bot,
      title: "AI Interview Coach",
      description: "Personalized interview preparation with real-time feedback and industry-specific question practice.",
      features: ["Mock interview sessions", "Performance analytics", "Industry-specific prep", "Confidence building"]
    },
    {
      icon: BarChart3,
      title: "Career Analytics Dashboard",
      description: "Comprehensive insights into your career trajectory, market positioning, and growth opportunities.",
      features: ["Career progress tracking", "Market analysis", "Skill demand trends", "Salary benchmarking"]
    },
    {
      icon: MessageSquare,
      title: "Smart Networking Tools",
      description: "AI-powered networking recommendations and conversation starters to expand your professional network.",
      features: ["Network analysis", "Connection recommendations", "Message templates", "Follow-up reminders"]
    }
  ]

  return (
    <section id="candidates" className="py-32 bg-black/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border-2 border-white/30 rounded-full mb-8 backdrop-blur-sm">
            <Users className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-bold tracking-wide">FOR CANDIDATES</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Accelerate your career with AI
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto font-medium">
            From profile optimization to interview coaching, our lightning-powered tools 
            give you the competitive edge to land your dream role.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidateFeatures.map((feature, idx) => (
            <div key={idx} className="p-8 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-white font-black mb-4 text-xl">{feature.title}</h3>
              <p className="text-white/80 text-base leading-relaxed font-medium mb-6">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                {feature.features.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-white/70 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/auth/signup">
            <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl flex items-center gap-3 mx-auto">
              Start Your Journey
              <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Recruiter Solutions Section
function RecruiterSolutions() {
  const recruiterFeatures = [
    {
      icon: Search,
      title: "Lightning-Fast Talent Discovery",
      description: "AI-powered search that finds the perfect candidates in seconds, not weeks. Filter by skills, experience, and cultural fit.",
      features: ["Advanced search filters", "Instant candidate matching", "Skill verification", "Cultural assessment"]
    },
    {
      icon: Filter,
      title: "Smart Candidate Screening",
      description: "Automated screening processes that evaluate candidates against your specific requirements with 99% accuracy.",
      features: ["Automated screening", "Skill assessments", "Video interviews", "Reference checks"]
    },
    {
      icon: BarChart3,
      title: "Recruitment Analytics",
      description: "Comprehensive insights into your hiring pipeline, candidate sources, and team performance metrics.",
      features: ["Pipeline analytics", "Source tracking", "Time-to-hire metrics", "ROI analysis"]
    },
    {
      icon: Bot,
      title: "AI Recruitment Assistant",
      description: "Intelligent automation for scheduling, follow-ups, and candidate communication throughout the hiring process.",
      features: ["Automated scheduling", "Smart follow-ups", "Candidate messaging", "Interview coordination"]
    },
    {
      icon: Shield,
      title: "Compliance & Security",
      description: "Enterprise-grade security with built-in compliance tools for GDPR, EEOC, and industry regulations.",
      features: ["GDPR compliance", "Security audits", "Access controls", "Data encryption"]
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Real-time market data and salary benchmarks to make competitive offers and strategic hiring decisions.",
      features: ["Salary benchmarking", "Market trends", "Competitive analysis", "Demand forecasting"]
    }
  ]

  return (
    <section id="recruiters" className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border-2 border-white/30 rounded-full mb-8 backdrop-blur-sm">
            <Briefcase className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-bold tracking-wide">FOR RECRUITERS</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Build exceptional teams faster
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto font-medium">
            Transform your hiring process with AI-powered tools that identify top talent, 
            streamline workflows, and deliver measurable results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recruiterFeatures.map((feature, idx) => (
            <div key={idx} className="p-8 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-purple-500/30">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-white font-black mb-4 text-xl">{feature.title}</h3>
              <p className="text-white/80 text-base leading-relaxed font-medium mb-6">
                {feature.description}
              </p>
              
              <div className="space-y-2">
                {feature.features.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    <span className="text-white/70 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/auth/signup">
            <button className="h-16 px-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl flex items-center gap-3 mx-auto">
              Start Hiring Smarter
              <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Solutions CTA Section
function SolutionsCTA() {
  return (
    <section className="py-32 bg-black/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-black/70 backdrop-blur-md border-2 border-white/30 rounded-3xl p-20 shadow-2xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/30 border-2 border-blue-400/50 rounded-full mb-10 backdrop-blur-sm shadow-lg">
              <Rocket className="w-5 h-5 text-blue-300" />
              <span className="text-sm text-blue-100 font-bold tracking-wide">READY TO TRANSFORM?</span>
            </div>
            
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
              Experience the
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent block">
                lightning difference
              </span>
            </h2>
            
            <p className="text-2xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-16 font-medium">
              Join thousands of professionals and companies who have already electrified their careers 
              and hiring processes with TalentAIze.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md">
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SolutionsPage() {
  return (
    <NeuronicLayout variant="intense" className="overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/50 border-b-2 border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              <Link href="/" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white tracking-tight">TalentAIze</span>
              </Link>
              
              <nav className="hidden lg:flex items-center gap-16">
                <Link href="/platform" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Platform
                </Link>
                <Link href="/solutions" className="text-white transition-colors font-bold text-[16px] border-b-2 border-blue-400">
                  Solutions
                </Link>
                <Link href="/pricing" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Pricing
                </Link>
              </nav>
              
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="h-12 px-6 flex items-center text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Sign in
                </Link>
                <Link href="/auth/signup">
                  <button className="h-12 px-8 bg-white text-black rounded-xl font-black text-[16px] hover:bg-gray-100 transition-all shadow-lg">
                    Get started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <SolutionsHero />
          <CandidateSolutions />
          <RecruiterSolutions />
          <SolutionsCTA />
        </main>
      </div>
    </NeuronicLayout>
  )
}