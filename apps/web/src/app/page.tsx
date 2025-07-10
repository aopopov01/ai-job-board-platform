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
  Award
} from 'lucide-react'

// Enhanced Hero Section Component with Modern Design
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-primary/5 to-accent/10 min-h-[90vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-primary/6"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="container relative z-10">
        <div className="section flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in-up shadow-lg backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            AI-Powered Job Matching Platform
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse ml-2"></div>
          </div>
          
          {/* Enhanced Hero Title */}
          <h1 className="text-responsive-4xl lg:text-6xl xl:text-7xl font-bold text-gradient mb-8 animate-fade-in-up leading-tight">
            Revolutionize Your Career
            <br />
            <span className="text-primary">with AI</span>
          </h1>
          
          {/* Enhanced Description */}
          <p className="text-responsive-xl lg:text-2xl text-neutral-600 mb-12 max-w-3xl animate-fade-in-up leading-relaxed" style={{animationDelay: '0.2s'}}>
            Experience the future of job searching with TalentAIze. Our advanced AI algorithms analyze your skills, preferences, and career goals to match you with perfect opportunities and optimize your professional journey.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link href="/auth/register" className="btn btn-primary btn-lg px-8 py-4 text-base font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Zap className="w-5 h-5 mr-2" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/jobs" className="btn btn-outline btn-lg px-8 py-4 text-base font-semibold border-2 hover:bg-primary hover:text-white hover:border-primary transform hover:scale-105 transition-all duration-300">
              <Search className="w-5 h-5 mr-2" />
              Browse Jobs
            </Link>
          </div>
          
          {/* Enhanced Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-16 text-sm text-neutral-600 animate-fade-in-up flex-wrap" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200/50 shadow-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              Free to use
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200/50 shadow-sm">
              <Shield className="w-4 h-4 text-success" />
              No spam guaranteed
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200/50 shadow-sm">
              <Target className="w-4 h-4 text-success" />
              Instant AI matching
            </div>
          </div>
          
          {/* Social Proof */}
          <div className="mt-16 text-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <p className="text-sm text-neutral-500 mb-4">Trusted by professionals at</p>
            <div className="flex items-center justify-center gap-8 opacity-60 flex-wrap">
              <div className="text-neutral-400 font-semibold">TechCorp</div>
              <div className="text-neutral-400 font-semibold">StartupCo</div>
              <div className="text-neutral-400 font-semibold">InnovateInc</div>
              <div className="text-neutral-400 font-semibold">CreativeStudio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Enhanced Stats Section Component
function StatsSection() {
  const stats = [
    { number: '50K+', label: 'AI-Matched Jobs', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { number: '25K+', label: 'AI-Powered Companies', icon: Users, color: 'from-green-500 to-green-600' },
    { number: '1M+', label: 'AI-Optimized Careers', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { number: '98%', label: 'AI Match Accuracy', icon: Star, color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <section className="section-sm bg-gradient-to-br from-neutral-50 to-neutral-100/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-neutral-200/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-responsive-3xl font-bold text-gradient mb-4">
            Powering Careers with AI Intelligence
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Join millions of professionals who trust TalentAIze to accelerate their career growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="group animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="card-interactive p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="stat-number text-4xl font-bold text-neutral-800 mb-2 group-hover:text-primary transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="stat-label text-neutral-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border border-neutral-200/50 shadow-lg">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-neutral-700">Industry Leading AI Technology</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Enhanced Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: Target,
      title: 'AI-Powered Matching',
      description: 'Advanced machine learning algorithms analyze your skills, experience, and career goals to deliver hyper-personalized job recommendations.',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and private. Control what information you share and with whom.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Globe,
      title: 'Global Opportunities',
      description: 'Access jobs from companies worldwide, including remote positions and international opportunities.',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Zap,
      title: 'AI Instant Alerts',
      description: 'Intelligent notifications powered by AI predict and alert you about opportunities before they become competitive.',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Users,
      title: 'AI Company Intelligence',
      description: 'AI-powered company analysis provides deep insights into culture, growth potential, and hiring patterns to help you make informed decisions.',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Award,
      title: 'Career Growth',
      description: 'Track your career progression and get personalized advice to advance your professional journey.',
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-50'
    },
  ]

  return (
    <section className="section bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-responsive-3xl lg:text-5xl font-bold text-gradient mb-6">
            Everything You Need to Find
            <br />Your Dream Job
          </h2>
          <p className="text-responsive-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Our platform combines cutting-edge AI technology with human insight to make job searching more effective, efficient, and enjoyable than ever before.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="group animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className={`card-interactive p-8 h-full ${feature.bgColor} border-0 shadow-lg hover:shadow-2xl bg-white/80 backdrop-blur-sm`}>
                {/* Icon */}
                <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-neutral-800 mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link href="/jobs" className="btn btn-primary btn-lg px-8 py-4 text-base font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <Target className="w-5 h-5 mr-2" />
            Explore All Features
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// How It Works Section
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
    <section className="section bg-gradient-to-br from-muted/30 to-primary/5">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-responsive-3xl font-bold text-gradient mb-6">
            How TalentAIze Works
          </h2>
          <p className="text-responsive-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and let our AI do the heavy lifting to find your next opportunity.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="card bg-white p-8 text-center animate-fade-in-up" style={{animationDelay: `${index * 0.2}s`}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-2xl text-xl font-bold mb-6">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
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
      quote: "TalentFlow found me the perfect role in just 2 weeks. The AI matching is incredibly accurate and saved me hours of searching.",
      author: "Sarah Chen",
      role: "Software Engineer",
      company: "TechCorp"
    },
    {
      quote: "As a hiring manager, TalentAIze has revolutionized how we find candidates. The AI-powered matches are extraordinarily accurate.",
      author: "Michael Rodriguez",
      role: "Head of Talent",
      company: "Innovation Labs"
    },
    {
      quote: "The career insights and company information helped me make the best decision for my future. Highly recommended!",
      author: "Emily Johnson",
      role: "Product Designer",
      company: "Creative Studio"
    },
  ]

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-responsive-3xl font-bold text-gradient mb-6">
            Loved by Professionals Worldwide
          </h2>
          <p className="text-responsive-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through TalentAIze.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.author} className="testimonial-card animate-fade-in-up" style={{animationDelay: `${index * 0.2}s`}}>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar flex items-center justify-center text-white font-semibold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
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
    <section className="cta-section">
      <div className="container relative z-10">
        <div className="section text-center max-w-3xl mx-auto">
          <h2 className="text-responsive-3xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-responsive-xl opacity-90 mb-8">
            Join thousands of professionals who have already discovered their dream jobs through TalentAIze. 
            Your next opportunity is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn bg-white text-primary hover:bg-gray-100 btn-lg px-8">
              <Heart className="w-5 h-5 mr-2" />
              Start Your Journey
            </Link>
            <Link href="/jobs" className="btn border-2 border-white/30 text-white hover:bg-white/10 btn-lg px-8">
              Explore Opportunities
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-gradient">
                TalentAIze
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/jobs" className="nav-link">Jobs</Link>
                <Link href="/companies" className="nav-link">Companies</Link>
                <Link href="/about" className="nav-link">About</Link>
                <Link href="/pricing" className="nav-link">Pricing</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="nav-link">Sign In</Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Sections */}
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container">
          <div className="section-sm">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-2xl font-bold text-gradient mb-4">TalentAIze</div>
                <p className="text-gray-400 mb-4">
                  Where AI meets talent. Revolutionize your career with intelligent job matching and optimization.
                </p>
                <div className="flex gap-4">
                  {/* Social links would go here */}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">For Job Seekers</h4>
                <div className="space-y-2 text-gray-400">
                  <Link href="/jobs" className="block hover:text-white transition-colors">Browse Jobs</Link>
                  <Link href="/companies" className="block hover:text-white transition-colors">Companies</Link>
                  <Link href="/salary" className="block hover:text-white transition-colors">Salary Insights</Link>
                  <Link href="/career-advice" className="block hover:text-white transition-colors">Career Advice</Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">For Employers</h4>
                <div className="space-y-2 text-gray-400">
                  <Link href="/post-job" className="block hover:text-white transition-colors">Post a Job</Link>
                  <Link href="/pricing" className="block hover:text-white transition-colors">Pricing</Link>
                  <Link href="/recruiting" className="block hover:text-white transition-colors">Recruiting Solutions</Link>
                  <Link href="/enterprise" className="block hover:text-white transition-colors">Enterprise</Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <div className="space-y-2 text-gray-400">
                  <Link href="/about" className="block hover:text-white transition-colors">About Us</Link>
                  <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
                  <Link href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="block hover:text-white transition-colors">Terms of Service</Link>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400">
                © 2025 TalentAIze. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-gray-400 text-sm">
                <span>Made with ❤️ for job seekers worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}