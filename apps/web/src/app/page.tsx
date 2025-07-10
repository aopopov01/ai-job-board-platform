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

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-accent/20">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5"></div>
      <div className="container relative">
        <div className="section flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4" />
            AI-Powered Job Matching
          </div>
          
          <h1 className="text-responsive-4xl font-bold text-gradient mb-6 animate-fade-in-up">
            Revolutionize Your Career with AI
          </h1>
          
          <p className="text-responsive-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Experience the future of job searching with TalentAIze. Our advanced AI algorithms analyze your skills, preferences, and career goals to match you with perfect opportunities and optimize your professional journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link href="/auth/register" className="btn btn-primary btn-lg flex-1">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/jobs" className="btn btn-secondary btn-lg flex-1">
              Browse Jobs
            </Link>
          </div>
          
          <div className="flex items-center gap-8 mt-12 text-sm text-muted-foreground animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Free to use
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              No spam
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Instant matching
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Stats Section Component
function StatsSection() {
  const stats = [
    { number: '50K+', label: 'AI-Matched Jobs', icon: Briefcase },
    { number: '25K+', label: 'AI-Powered Companies', icon: Users },
    { number: '1M+', label: 'AI-Optimized Careers', icon: TrendingUp },
    { number: '98%', label: 'AI Match Accuracy', icon: Star },
  ]

  return (
    <section className="section-sm bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="stat-card animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: Target,
      title: 'AI-Powered Matching',
      description: 'Advanced machine learning algorithms analyze your skills, experience, and career goals to deliver hyper-personalized job recommendations.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and private. Control what information you share and with whom.'
    },
    {
      icon: Globe,
      title: 'Global Opportunities',
      description: 'Access jobs from companies worldwide, including remote positions and international opportunities.'
    },
    {
      icon: Zap,
      title: 'AI Instant Alerts',
      description: 'Intelligent notifications powered by AI predict and alert you about opportunities before they become competitive.'
    },
    {
      icon: Users,
      title: 'AI Company Intelligence',
      description: 'AI-powered company analysis provides deep insights into culture, growth potential, and hiring patterns to help you make informed decisions.'
    },
    {
      icon: Award,
      title: 'Career Growth',
      description: 'Track your career progression and get personalized advice to advance your professional journey.'
    },
  ]

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-responsive-3xl font-bold text-gradient mb-6">
            Everything You Need to Find Your Dream Job
          </h2>
          <p className="text-responsive-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with human insight to make job searching more effective and enjoyable.
          </p>
        </div>
        
        <div className="grid grid-auto-fit gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="feature-card animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <feature.icon className="feature-icon" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
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
                <div className="text-2xl font-bold text-gradient mb-4">TalentFlow</div>
                <p className="text-gray-400 mb-4">
                  Where great careers begin. Connect with opportunities that match your potential.
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