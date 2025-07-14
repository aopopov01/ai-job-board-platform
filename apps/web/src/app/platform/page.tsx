import React from 'react'
import Link from 'next/link'
import { 
  Brain, 
  Target, 
  BarChart3,
  Zap as Lightning,
  Shield,
  Globe,
  Bot,
  MessageSquare,
  Clock,
  Eye,
  Sparkles,
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

// Platform Features Hero Section
function PlatformHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/20 border-2 border-blue-400/40 rounded-full mb-10 backdrop-blur-sm shadow-lg">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            <span className="text-sm text-blue-100 font-bold tracking-wide">⚡ PLATFORM OVERVIEW</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8">
            <span className="text-white block leading-tight drop-shadow-2xl">Lightning-powered</span>
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block leading-tight drop-shadow-2xl py-2">
              AI platform
            </span>
          </h1>
          
          <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-16 font-medium">
            ⚡ Experience the future of career matching with our comprehensive AI-powered platform. 
            Advanced features designed to electrify your professional journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl">
              Explore Features
            </button>
            <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Core AI Features Section
function CoreAIFeatures() {
  const features = [
    {
      icon: Brain,
      title: "Neural Matching Engine",
      description: "Advanced deep learning algorithms analyze skills, experience, and career aspirations to create precision matches.",
      metrics: "99.2% accuracy",
      highlights: ["Deep skill analysis", "Career trajectory prediction", "Cultural fit assessment"]
    },
    {
      icon: Target,
      title: "Smart Targeting System",
      description: "Intelligent filtering and targeting based on role requirements, location preferences, and career goals.",
      metrics: "96.8% relevance",
      highlights: ["Multi-factor filtering", "Geographic optimization", "Salary range matching"]
    },
    {
      icon: Lightning,
      title: "Real-time Lightning Alerts",
      description: "Instant notifications when high-match opportunities become available or when your profile is viewed.",
      metrics: "<2 seconds",
      highlights: ["Instant notifications", "Priority alerts", "Smart batching"]
    },
    {
      icon: BarChart3,
      title: "Career Analytics Dashboard",
      description: "Comprehensive insights into your career progression, market trends, and optimization opportunities.",
      metrics: "15+ metrics",
      highlights: ["Market analysis", "Skill gap identification", "Salary benchmarking"]
    }
  ]

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border-2 border-white/30 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-bold tracking-wide">CORE AI FEATURES</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Powered by advanced AI
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto font-medium">
            Our lightning-fast AI engine processes millions of data points to deliver 
            unparalleled matching accuracy and career insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="p-10 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white mb-4">{feature.title}</h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-4 font-medium">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/40 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-300 font-bold text-sm">{feature.metrics}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {feature.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-white/80 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Platform Capabilities Section
function PlatformCapabilities() {
  const capabilities = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption, GDPR compliance, and granular privacy controls protect your data.",
      features: ["End-to-end encryption", "GDPR compliance", "SOC 2 certified", "Privacy controls"]
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Access opportunities across 50+ countries with localized matching and cultural insights.",
      features: ["50+ countries", "Multi-language support", "Cultural matching", "Local market data"]
    },
    {
      icon: Bot,
      title: "AI Interview Coach",
      description: "Personalized interview preparation with real-time feedback and performance analytics.",
      features: ["Mock interviews", "Real-time feedback", "Performance tracking", "Industry-specific prep"]
    },
    {
      icon: MessageSquare,
      title: "Smart Communication",
      description: "AI-powered messaging and networking tools to connect with the right people.",
      features: ["Smart introductions", "Message optimization", "Network analysis", "Follow-up reminders"]
    },
    {
      icon: Clock,
      title: "Workflow Automation",
      description: "Automate repetitive tasks and streamline your job search with intelligent workflows.",
      features: ["Auto-applications", "Status tracking", "Calendar integration", "Task automation"]
    },
    {
      icon: Eye,
      title: "Market Intelligence",
      description: "Real-time market insights, salary data, and career trend analysis.",
      features: ["Salary benchmarks", "Market trends", "Skill demand", "Career forecasting"]
    }
  ]

  return (
    <section className="py-32 bg-black/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Complete platform capabilities
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto font-medium">
            Everything you need to supercharge your career journey, from AI matching to market intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, idx) => (
            <div key={idx} className="p-8 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 border border-white/30">
                <capability.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-white font-bold mb-4 text-xl">{capability.title}</h3>
              <p className="text-white/80 text-base leading-relaxed font-medium mb-6">
                {capability.description}
              </p>
              
              <div className="space-y-2">
                {capability.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-white/70 text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function PlatformCTA() {
  return (
    <section className="py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-black/70 backdrop-blur-md border-2 border-white/30 rounded-3xl p-20 shadow-2xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/30 border-2 border-blue-400/50 rounded-full mb-10 backdrop-blur-sm shadow-lg">
              <Rocket className="w-5 h-5 text-blue-300" />
              <span className="text-sm text-blue-100 font-bold tracking-wide">START YOUR JOURNEY</span>
            </div>
            
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
              Ready to ignite
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent block">
                your career?
              </span>
            </h2>
            
            <p className="text-2xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-16 font-medium">
              Experience the power of AI-driven career matching. Join thousands of professionals 
              who have already electrified their careers with TalentAIze.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/solutions">
              <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md">
                Explore Solutions
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PlatformPage() {
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
                <Link href="/platform" className="text-white transition-colors font-bold text-[16px] border-b-2 border-blue-400">
                  Platform
                </Link>
                <Link href="/solutions" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
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
          <PlatformHero />
          <CoreAIFeatures />
          <PlatformCapabilities />
          <PlatformCTA />
        </main>
      </div>
    </NeuronicLayout>
  )
}