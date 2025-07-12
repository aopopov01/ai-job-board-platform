'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  ArrowRight,
  Briefcase,
  UserPlus,
  BarChart3,
  Settings,
  Bell,
  Shield,
  Zap,
  Globe,
  Award,
  Star,
  PlayCircle
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

// Company Hero Section
function CompanyHeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center justify-center">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm"></div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
                  Find Top Talent
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  with AI Precision
                </span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Join 10,000+ companies using TalentAIze to discover, connect, and hire the best talent with our AI-powered neuronic matching system.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">98%</div>
                <div className="text-sm text-white/80">Match Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">5x</div>
                <div className="text-sm text-white/80">Faster Hiring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24h</div>
                <div className="text-sm text-white/80">Avg Response</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/company/onboarding" className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <UserPlus className="w-5 h-5" />
                Start Free Trial
              </Link>
              <Link href="/company/demo" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Company Dashboard</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold text-white mb-1">156</div>
                    <div className="text-sm text-white/80">Active Jobs</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-2xl font-bold text-white mb-1">2.3k</div>
                    <div className="text-sm text-white/80">Applications</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Software Engineer</div>
                      <div className="text-white/60 text-xs">23 applications</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Product Manager</div>
                      <div className="text-white/60 text-xs">18 applications</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Features Section for Companies
function CompanyFeaturesSection() {
  const features = [
    {
      icon: Target,
      title: 'AI-Powered Candidate Matching',
      description: 'Our neuronic AI system analyzes millions of data points to find candidates who perfectly match your requirements and company culture.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics Dashboard',
      description: 'Track hiring metrics, analyze candidate quality, and optimize your recruitment process with detailed insights and reporting.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration Tools',
      description: 'Streamline your hiring process with collaborative features that let your team review, rate, and discuss candidates efficiently.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Zap,
      title: 'Automated Workflows',
      description: 'Save time with automated screening, interview scheduling, and candidate communication workflows powered by AI.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'Compliance & Security',
      description: 'Built-in compliance tools and enterprise-grade security ensure your hiring process meets all regulatory requirements.',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Globe,
      title: 'Global Talent Pool',
      description: 'Access candidates from around the world with our international platform and built-in visa/relocation support.',
      color: 'from-indigo-500 to-blue-600'
    }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
              Everything You Need to Hire Smarter
            </span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Our comprehensive platform combines AI intelligence with human insight to revolutionize your hiring process.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pricing Section
function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$99',
      period: 'per month',
      description: 'Perfect for small teams and startups',
      features: [
        'Up to 10 job postings',
        'Basic AI matching',
        'Email support',
        'Standard analytics',
        'Team collaboration (5 users)'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$299',
      period: 'per month',
      description: 'Ideal for growing companies',
      features: [
        'Up to 50 job postings',
        'Advanced AI matching',
        'Priority support',
        'Advanced analytics',
        'Team collaboration (25 users)',
        'Custom workflows',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations',
      features: [
        'Unlimited job postings',
        'Premium AI matching',
        'Dedicated support',
        'White-label solution',
        'Unlimited users',
        'Custom integrations',
        'SLA guarantees'
      ],
      popular: false
    }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Start with a free trial and scale as your hiring needs grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`relative ${plan.popular ? 'transform scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">
                    {plan.price}
                    <span className="text-lg font-normal text-white/80">/{plan.period}</span>
                  </div>
                  <p className="text-white/80">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/company/onboarding" className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}>
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "TalentAIze reduced our hiring time by 70% and the quality of candidates has never been better. The AI matching is incredibly accurate.",
      author: "Sarah Chen",
      role: "Head of Talent",
      company: "TechCorp",
      rating: 5
    },
    {
      quote: "The analytics dashboard gives us insights we never had before. We can now predict hiring trends and optimize our process continuously.",
      author: "Michael Rodriguez",
      role: "VP of Engineering",
      company: "Innovation Labs",
      rating: 5
    },
    {
      quote: "The collaboration features have transformed how our team reviews candidates. Everyone stays aligned throughout the hiring process.",
      author: "Emily Johnson",
      role: "Talent Acquisition Manager",
      company: "Global Dynamics",
      rating: 5
    }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
              Trusted by Leading Companies
            </span>
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of companies that have revolutionized their hiring process with TalentAIze.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/90 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-white/80">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-12 text-center shadow-xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
              Ready to Transform Your Hiring?
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the AI revolution in recruitment. Start your free trial today and discover how TalentAIze can help you find the perfect candidates faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/onboarding" className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <UserPlus className="w-5 h-5" />
              Start Free Trial
            </Link>
            <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg">
              <Building2 className="w-5 h-5" />
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function CompanyPage() {
  return (
    <NeuronicLayout variant="default">
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="border-b border-white/10 backdrop-blur-md bg-white/5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-white" />
                <span className="text-xl font-bold text-white">TalentAIze</span>
              </Link>
              
              <div className="flex items-center gap-6">
                <Link href="/company/features" className="text-white/90 hover:text-white transition-colors">Features</Link>
                <Link href="/company/pricing" className="text-white/90 hover:text-white transition-colors">Pricing</Link>
                <Link href="/company/demo" className="text-white/90 hover:text-white transition-colors">Demo</Link>
                <Link href="/company/login" className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors">Login</Link>
                <Link href="/company/onboarding" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">Sign Up</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          <CompanyHeroSection />
          <CompanyFeaturesSection />
          <PricingSection />
          <TestimonialsSection />
          <CTASection />
        </main>
      </div>
    </NeuronicLayout>
  )
}