import React from 'react'
import Link from 'next/link'
import { 
  Search, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Shield,
  Target,
  Globe,
  Heart,
  Award,
  Sparkles,
  Brain,
  Rocket,
  BarChart3,
  MessageSquare,
  Filter,
  Bot,
  Zap as Lightning,
  Clock,
  Eye
} from 'lucide-react'
import NeuronicLayout from '../components/layout/NeuronicLayout'
import { ShimmerButton } from '../components/magicui/shimmer-button'
import { MagicCard } from '../components/magicui/magic-card'
import { AnimatedList } from '../components/magicui/animated-list'
import { TextReveal } from '../components/magicui/text-reveal'
import { Ripple } from '../components/magicui/ripple'

// Extraordinary Professional Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center min-h-screen py-20">
          
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 border-2 border-white/30 rounded-full backdrop-blur-sm shadow-lg shadow-white/20">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg shadow-white/80"></div>
                <span className="text-sm text-white font-bold tracking-wide">⚡ LIGHTNING-FAST MATCHING</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none">
                <span className="text-white block drop-shadow-2xl">Ignite your</span>
                <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block drop-shadow-2xl animate-pulse pb-2">
                  career lightning
                </span>
              </h1>
              
              <p className="text-2xl text-white/90 leading-relaxed max-w-lg font-medium">
                ⚡ Electrify your career with AI-powered lightning-speed matching. 
                Unleash your potential and spark extraordinary opportunities that ignite your professional journey.
              </p>
            </div>
            
            {/* Search Interface */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for roles, companies, or skills..."
                  className="w-full h-16 pl-6 pr-32 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all shadow-2xl font-medium text-lg"
                />
                <button className="absolute right-2 top-2 h-12 px-8 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg text-lg">
                  Search
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'].map((role) => (
                  <button key={role} className="px-4 py-2 text-sm text-white/80 border-2 border-white/30 rounded-lg hover:border-white/60 hover:text-white transition-all font-semibold backdrop-blur-sm bg-white/5">
                    {role}
                  </button>
                ))}
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-2xl text-lg">
                Get Started
              </button>
              <button className="h-14 px-10 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md text-lg">
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Right Column - Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">AI Match Score</div>
                    <div className="text-white/70 text-base font-medium">98% compatibility</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { role: 'Senior Frontend Engineer', company: 'Stripe', match: '96%' },
                    { role: 'Product Designer', company: 'Linear', match: '94%' },
                    { role: 'Full Stack Developer', company: 'Vercel', match: '92%' }
                  ].map((job, idx) => (
                    <div key={idx} className="p-4 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-medium">{job.role}</div>
                          <div className="text-white/60 text-sm">{job.company}</div>
                        </div>
                        <div className="text-green-400 text-sm font-semibold">{job.match}</div>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-cyan-300 h-2 rounded-full shadow-lg" 
                          style={{ width: job.match }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Featured Jobs Section (Proper Neuronic Design)
function FeaturedJobsSection() {
  const featuredJobs = [
    {
      title: "Senior Frontend Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      salary: "$120k - $180k",
      type: "Full-time"
    },
    {
      title: "Product Manager",
      company: "InnovateAI",
      location: "Austin, TX",
      salary: "$130k - $200k",
      type: "Full-time"
    },
    {
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$90k - $140k",
      type: "Full-time"
    }
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-600/20 border-2 border-emerald-400/40 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
            <span className="text-sm text-emerald-100 font-bold tracking-wide">FEATURED OPPORTUNITIES</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Top jobs waiting for you
          </h2>
          <p className="text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto">
            Discover handpicked opportunities from leading companies actively seeking talent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredJobs.map((job, index) => (
            <div key={index} className="p-8 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl hover:border-blue-400/40 transition-all duration-300 group cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-sm font-bold">
                  {job.type}
                </span>
              </div>
              
              <h3 className="text-white font-black text-xl mb-2 group-hover:text-blue-300 transition-colors">
                {job.title}
              </h3>
              <p className="text-white/70 font-medium text-base mb-4">{job.company}</p>
              <p className="text-white/60 text-sm mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {job.location}
              </p>
              <p className="text-blue-300 font-bold text-lg">{job.salary}</p>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <button className="w-full h-12 bg-blue-600/20 hover:bg-blue-600 border-2 border-blue-400/40 hover:border-blue-400 text-blue-300 hover:text-white rounded-xl font-bold transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// AI-Driven Career Insights Section (Proper Neuronic Design)
function CareerInsightsSection() {
  const insights = [
    {
      title: "Average Salary Increase",
      value: "+40%",
      description: "Users see 40% higher salaries with AI matching",
      icon: TrendingUp,
      color: "emerald"
    },
    {
      title: "Job Match Accuracy",
      value: "98.5%",
      description: "AI precision matching with perfect compatibility",
      icon: Target,
      color: "blue"
    },
    {
      title: "Time to Hire",
      value: "3x Faster",
      description: "Reduce job search time with intelligent automation",
      icon: Clock,
      color: "purple"
    },
    {
      title: "Career Satisfaction",
      value: "95%",
      description: "Users report higher job satisfaction and growth",
      icon: Heart,
      color: "pink"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: "bg-emerald-500/20",
        border: "border-emerald-400/40",
        text: "text-emerald-300",
        glow: "shadow-emerald-500/30"
      },
      blue: {
        bg: "bg-blue-500/20",
        border: "border-blue-400/40", 
        text: "text-blue-300",
        glow: "shadow-blue-500/30"
      },
      purple: {
        bg: "bg-purple-500/20",
        border: "border-purple-400/40",
        text: "text-purple-300", 
        glow: "shadow-purple-500/30"
      },
      pink: {
        bg: "bg-pink-500/20",
        border: "border-pink-400/40",
        text: "text-pink-300",
        glow: "shadow-pink-500/30"
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-purple-600/20 border-2 border-purple-400/40 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
            <span className="text-sm text-purple-100 font-bold tracking-wide">AI-POWERED INSIGHTS</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Data-driven career intelligence
          </h2>
          <p className="text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto">
            Leverage advanced analytics and machine learning to accelerate your professional growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {insights.map((insight, index) => {
            const colorClasses = getColorClasses(insight.color)
            return (
              <div key={index} className="p-8 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl hover:border-white/40 transition-all duration-300 group">
                <div className={`w-16 h-16 ${colorClasses.bg} border-2 ${colorClasses.border} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${colorClasses.glow} group-hover:scale-110 transition-transform duration-300`}>
                  <insight.icon className={`w-8 h-8 ${colorClasses.text}`} />
                </div>
                
                <div className={`text-4xl font-black ${colorClasses.text} mb-3 drop-shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  {insight.value}
                </div>
                
                <h3 className="text-white font-bold text-lg mb-3">{insight.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed font-medium">{insight.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Extraordinary Professional Features Section
function FeaturesSection() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-4xl mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-blue-600/20 border-2 border-blue-400/40 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
            <span className="text-sm text-blue-100 font-bold tracking-wide">PLATFORM CAPABILITIES</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Precision matching powered by advanced AI
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed font-medium">
            Our platform combines machine learning, natural language processing, and behavioral analysis 
            to deliver matches that understand the nuances of career compatibility.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          
          {/* Feature 1 - AI Matching */}
          <div className="lg:col-span-2">
            <div className="h-full bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl p-10 shadow-2xl">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/30">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-6">AI-Powered Precision Matching</h3>
                <p className="text-white/80 text-xl leading-relaxed mb-10 font-medium">
                  Our neural networks analyze your skills, experience, and career aspirations to find opportunities 
                  that align with your professional trajectory and personal values.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-black/50 border-2 border-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center border border-blue-400/30">
                    <Target className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-lg">Skill Compatibility Analysis</div>
                    <div className="text-white/70 text-base font-medium">Deep learning algorithms assess technical and soft skills</div>
                  </div>
                  <div className="text-green-400 font-black text-xl">99.2%</div>
                </div>
                
                <div className="flex items-center gap-6 p-6 bg-black/50 border-2 border-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center border border-blue-400/30">
                    <BarChart3 className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-lg">Career Trajectory Prediction</div>
                    <div className="text-white/70 text-base font-medium">AI models predict optimal career paths</div>
                  </div>
                  <div className="text-green-400 font-black text-xl">96.8%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 2 - Real-time Alerts */}
          <div>
            <div className="h-full bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl p-10 shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/30">
                <Lightning className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-6">Real-time Intelligence</h3>
              <p className="text-white/80 leading-relaxed mb-10 text-lg font-medium">
                Instant notifications when opportunities matching your criteria become available.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-emerald-500/20 border-2 border-emerald-400/40 rounded-lg backdrop-blur-sm shadow-lg">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  <span className="text-emerald-300 text-base font-bold">New match found</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-500/20 border-2 border-blue-400/40 rounded-lg backdrop-blur-sm shadow-lg">
                  <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                  <span className="text-blue-300 text-base font-bold">Profile viewed</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-yellow-500/20 border-2 border-yellow-400/40 rounded-lg backdrop-blur-sm shadow-lg">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                  <span className="text-yellow-300 text-base font-bold">Application update</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Features Row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'Privacy-First Architecture', desc: 'Enterprise-grade security with granular privacy controls' },
            { icon: Globe, title: 'Global Network', desc: 'Access to opportunities across 50+ countries worldwide' },
            { icon: Bot, title: 'AI Interview Coach', desc: 'Personalized interview preparation with real-time feedback' },
            { icon: BarChart3, title: 'Career Analytics', desc: 'Comprehensive insights into your professional trajectory' }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 border border-white/30">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-white font-bold mb-4 text-lg">{feature.title}</h4>
              <p className="text-white/80 text-base leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section (Proper Neuronic Design)
function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Sign up and tell us about your skills, experience, and career goals. Our AI will learn what makes you unique.'
    },
    {
      step: '02',
      title: 'Get Matched',
      description: 'Our intelligent system analyzes thousands of job postings to find opportunities that truly fit your profile.'
    },
    {
      step: '03',
      title: 'Apply & Connect',
      description: 'Apply directly through our platform or get introduced to hiring managers. Track your progress every step of the way.'
    },
    {
      step: '04',
      title: 'Land Your Dream Job',
      description: 'With our support and insights, you\'ll be prepared to succeed in interviews and negotiate the best offer.'
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-blue-600/20 border-2 border-blue-400/40 rounded-full mb-8 backdrop-blur-sm">
            <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
            <span className="text-sm text-blue-100 font-bold tracking-wide">HOW IT WORKS</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
            Get started in 4 simple steps
          </h2>
          <p className="text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto">
            Our streamlined process gets you matched with perfect opportunities in minutes, not months.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="p-8 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl hover:border-blue-400/40 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-xl">{step.step}</span>
              </div>
              <h3 className="text-white font-black text-xl mb-4 group-hover:text-blue-300 transition-colors">{step.title}</h3>
              <p className="text-white/70 text-base leading-relaxed font-medium">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// World-Class Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "TalentAIze transformed my job search completely. The AI matching is phenomenally accurate - I landed my dream role at a unicorn startup in just 3 weeks.",
      author: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "Stripe",
      avatar: "SC",
      rating: 5
    },
    {
      quote: "As Head of Talent, I've tried every platform. TalentAIze's quality of candidates and matching precision is unmatched. It's revolutionized our hiring process.",
      author: "Marcus Rodriguez",
      role: "VP of Talent",
      company: "Vercel",
      avatar: "MR",
      rating: 5
    },
    {
      quote: "TalentAIze's career analytics and salary insights gave me the confidence to negotiate a 40% salary increase. This platform pays for itself.",
      author: "Emily Johnson",
      role: "Product Designer",
      company: "Linear",
      avatar: "EJ",
      rating: 5
    },
    {
      quote: "I was skeptical about AI-powered job matching, but TalentAIze proved me wrong. Found 3 perfect opportunities that perfectly matched my skills and goals.",
      author: "David Kim",
      role: "Data Scientist",
      company: "OpenAI",
      avatar: "DK",
      rating: 5
    },
    {
      quote: "The AI interview prep feature was a game-changer. Practiced with their AI coach and aced my interviews at FAANG companies.",
      author: "Priya Patel",
      role: "ML Engineer",
      company: "Google",
      avatar: "PP",
      rating: 5
    },
    {
      quote: "Finally, a platform that understands the nuances of senior engineering roles. The quality of opportunities is exceptional.",
      author: "Alex Thompson",
      role: "Engineering Manager",
      company: "Figma",
      avatar: "AT",
      rating: 5
    }
  ]

  return (
    <section className="py-32 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-yellow-500/20 border-2 border-yellow-400/40 text-yellow-300 text-sm font-bold mb-10 backdrop-blur-sm shadow-lg">
            <Star className="w-5 h-5 fill-current" />
            TRUSTED BY PROFESSIONALS
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-10 drop-shadow-2xl leading-none">
            Success
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent pb-1"> stories</span>
          </h2>
          
          <p className="text-2xl text-white/80 max-w-4xl mx-auto font-medium">
            Join thousands of professionals who have accelerated their careers with TalentAIze.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.author} className="p-10 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl">
              
              {/* Stars */}
              <div className="flex mb-8">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="text-white/90 text-xl leading-relaxed mb-10 italic font-medium">
                "{testimonial.quote}"
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-gray-600 rounded-full flex items-center justify-center text-white font-black text-lg border-2 border-white/20">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-black text-white text-xl">{testimonial.author}</div>
                  <div className="text-white/70 font-medium text-base">{testimonial.role}</div>
                  <div className="text-blue-300 text-base font-bold">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
          {[
            { number: "200K+", label: "Success Stories" },
            { number: "4.9/5", label: "Average Rating" },
            { number: "95%", label: "Job Match Rate" },
            { number: "3 weeks", label: "Average Time to Hire" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <div className="text-5xl font-black text-white mb-4 drop-shadow-lg">{stat.number}</div>
              <div className="text-white/80 font-bold text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <button className="px-12 py-5 text-lg font-black bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl">
            <Eye className="w-6 h-6 mr-3" />
            Join Success Stories
          </button>
        </div>
      </div>
    </section>
  )
}

// Extraordinary Professional CTA Section
function CTASection() {
  return (
    <section className="py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-black/70 backdrop-blur-md border-2 border-white/30 rounded-3xl p-20 shadow-2xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/30 border-2 border-blue-400/50 rounded-full mb-10 backdrop-blur-sm shadow-lg">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
              <span className="text-sm text-blue-100 font-bold tracking-wide">JOIN THE FUTURE</span>
            </div>
            
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-none drop-shadow-2xl">
              Ready to transform
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent block pb-2">
                your career?
              </span>
            </h2>
            
            <p className="text-2xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-16 font-medium">
              Join thousands of professionals who have accelerated their careers with precision AI matching.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl hover:shadow-3xl">
              Start Your Journey
            </button>
            <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md shadow-xl">
              Schedule Demo
            </button>
          </div>
          
          <div className="mt-16 pt-10 border-t-2 border-white/20">
            <div className="flex flex-wrap justify-center gap-12 text-white/80">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="font-bold text-lg">Free forever plan</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="font-bold text-lg">Setup in 2 minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="font-bold text-lg">No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Extraordinary Professional Footer
function ProfessionalFooter() {
  return (
    <footer className="py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">TalentAIze</span>
            </div>
            <p className="text-white/60 leading-relaxed mb-6">
              Transforming careers through precision AI matching and intelligent career insights.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
              <ul className="space-y-4">
                {['Job Search', 'Post Jobs', 'AI Matching', 'Analytics'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/60 hover:text-white transition-colors text-base">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Resources</h4>
              <ul className="space-y-4">
                {['Documentation', 'API', 'Help Center', 'Blog'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/60 hover:text-white transition-colors text-base">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-4">
                {['About', 'Careers', 'Press', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/60 hover:text-white transition-colors text-base">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-base">© 2024 TalentAIze. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-base">Privacy Policy</Link>
            <Link href="#" className="text-white/60 hover:text-white transition-colors text-base">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Navigation Header Component
function NavigationHeader() {
  return (
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
            <Link href="/jobs" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
              Jobs
            </Link>
            <Link href="/solutions" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
              Solutions
            </Link>
            <Link href="/pricing" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
              Pricing
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
              About
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <button className="h-12 px-6 text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="h-12 px-8 bg-white text-black rounded-xl font-black text-[16px] hover:bg-gray-100 transition-all shadow-lg">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function HomePage() {
  return (
    <NeuronicLayout>
      <NavigationHeader />
      <HeroSection />
      <FeaturedJobsSection />
      <CareerInsightsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <ProfessionalFooter />
    </NeuronicLayout>
  )
}