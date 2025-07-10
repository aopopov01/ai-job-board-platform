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

// Figma-Inspired Hero Section Component
function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[480px] flex items-center justify-center bg-cover bg-center bg-no-repeat" 
             style={{
               backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkA8_T3e5WWhkjy0GsTN8R_qXwXSbhLEAMqsR1h5egfNA3EdQvbbKVMLzWmM09wa6yM8GttI4McI3ZzlkURWz1P-CVmXmHP-mw-7SLm8FkGIqm0brkibLrzj_QigMuX87z_ug5B3whJ6TMtFkLsHm6huO596KQk313qOrrdqY52Dr6KbBBXWqQdAox9KkQZ2TT8PU-cQpSbYAO96o9kahfZViyxNALKqUS-vb8p6suvxtW6LTkgjq-tKjI7pPnzGhadNyQpaGlEA")`
             }}>
      <div className="container relative z-10">
        <div className="flex flex-col gap-6 items-center text-center max-w-4xl mx-auto px-4">
          {/* Figma Hero Title */}
          <h1 className="text-white text-4xl font-black leading-tight tracking-tight @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-tight">
            Unlock Your Career Potential with AI
          </h1>
          
          {/* Figma Hero Subtitle */}
          <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
            Find your dream job and gain insights with our AI-powered platform.
          </h2>
          
          {/* Figma Search Bar */}
          <div className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#4e6e97] flex border border-[#d0dae7] bg-slate-50 items-center justify-center pl-[15px] rounded-l-lg border-r-0">
                <Search className="w-5 h-5" />
              </div>
              <input
                placeholder="Job title or keywords"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dae7] bg-slate-50 focus:border-[#d0dae7] h-full placeholder:text-[#4e6e97] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
              />
              <div className="flex items-center justify-center rounded-r-lg border-l-0 border border-[#d0dae7] bg-slate-50 pr-[7px]">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#186ddc] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                  <span className="truncate">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Featured Jobs Section (Figma Design)
function FeaturedJobsSection() {
  const featuredJobs = [
    {
      title: "Software Engineer",
      company: "Tech Innovators Inc.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOTKKlYJNHktoCoCoXEk2d6zTPVcJzlBjUs3_lEGtiOY6Gi9DcrlRoVikjuSIwpf5wYIbd95XP5_kNRISlUtnM1NiYDtRS1e0orDmg1WgJfLIifzpwbMqeOhNMLXOSCyrqU67s9BqiOBtzDhADwxQIeNMRPVPjlxsERJI9Ko1vMN8_77cH5yJmMZTEqGg1v1jkk25GTZjAAejxFXuSwcneqo9FPgv67yhy9bpInWkNs4TUjXV4r7B_i9uCiG87a9RsbtJ3KKWRJw"
    },
    {
      title: "Registered Nurse",
      company: "Community Health Systems",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGkY7s-RQmpmtKCarLg9jg2h_l05vax9NEczb0uWRH1sZM4oCbehfbBb0-4MFvTTEQCxjAJC_AvY6VUY1qMZkFtUnCD1CCGSCisTzmYfYvyYQunMUZg8EaycKnWzhgas7rMXDB3PtKVGVLr90TE-rmzHriCixiZxyoPkxuV_sE3DaxqyEQRoxjJVzLj9FbqNhFQHoLiOwu13S8sK3W55WKl41BQKwO3C6beEPzmPkAn4pKUrFjS6lWz-rf5Gu6n3gJIGgglSuViA"
    },
    {
      title: "Financial Analyst",
      company: "Global Investments LLC",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChmM8JFqA2PYJ0ZDeocp4uAfj-s0klvV21KRRN1zLoi3yQWGwYaOacAll0tKJ3G6ZHrxkolMS0teUlyP0YIODq6dUeomUJk-JhiN0Ty51hDyongX33t10WiHSD0MmOCeEKgd6gHZyJBc4cCNBI1XJWnD2-NLuYS8gyJo0_DpmR-3XAeAccra9FzDnU5Ll-pGFGxMk7mbKSS3QfNwuHpZ-sX5OaZ0mh-9vckNKL0iOmxLNbNPW-HvyZaW1lKeDQLMXL3gPrVI5S6g"
    }
  ]

  return (
    <section className="px-40 py-5">
      <div className="max-w-[960px] mx-auto">
        <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Jobs</h2>
        <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch p-4 gap-3">
            {featuredJobs.map((job, index) => (
              <div key={index} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col"
                  style={{backgroundImage: `url("${job.image}")`}}
                ></div>
                <div>
                  <p className="text-[#0e141b] text-base font-medium leading-normal">{job.title}</p>
                  <p className="text-[#4e6e97] text-sm font-normal leading-normal">{job.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// AI-Driven Career Insights Section (Figma Design)
function CareerInsightsSection() {
  const insights = [
    {
      title: "Average Salary Increase",
      value: "+15%",
      change: "+15%",
      isPositive: true
    },
    {
      title: "Job Application Success Rate",
      value: "2x Higher",
      change: "+100%",
      isPositive: true
    },
    {
      title: "Career Path Optimization",
      value: "90% Satisfaction",
      change: "+90%",
      isPositive: true
    }
  ]

  return (
    <section className="px-40 py-5">
      <div className="max-w-[960px] mx-auto">
        <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">AI-Driven Career Insights</h2>
        <div className="flex flex-wrap gap-4 p-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7ecf3]">
              <p className="text-[#0e141b] text-base font-medium leading-normal">{insight.title}</p>
              <p className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight">{insight.value}</p>
              <p className="text-[#07883b] text-base font-medium leading-normal">{insight.change}</p>
            </div>
          ))}
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

// Final CTA Section (Figma Design)
function FinalCTASection() {
  return (
    <section className="px-40 py-5">
      <div className="max-w-[960px] mx-auto">
        <div className="@container">
          <div className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                Ready to Elevate Your Career?
              </h1>
            </div>
            <div className="flex flex-1 justify-center">
              <div className="flex justify-center">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#186ddc] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow">
                  <span className="truncate">Get Started</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Figma Footer Section
function FigmaFooter() {
  return (
    <footer className="flex justify-center">
      <div className="flex max-w-[960px] flex-1 flex-col">
        <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
          <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
            <Link className="text-[#4e6e97] text-base font-normal leading-normal min-w-40" href="/about">About Us</Link>
            <Link className="text-[#4e6e97] text-base font-normal leading-normal min-w-40" href="/contact">Contact</Link>
            <Link className="text-[#4e6e97] text-base font-normal leading-normal min-w-40" href="/privacy">Privacy Policy</Link>
            <Link className="text-[#4e6e97] text-base font-normal leading-normal min-w-40" href="/terms">Terms of Service</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#">
              <div className="text-[#4e6e97] w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z" />
                </svg>
              </div>
            </Link>
            <Link href="#">
              <div className="text-[#4e6e97] w-6 h-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z" />
                </svg>
              </div>
            </Link>
          </div>
          <p className="text-[#4e6e97] text-base font-normal leading-normal">© 2024 TalentAIze. All rights reserved.</p>
        </footer>
      </div>
    </footer>
  )
}

// Main Landing Page Component - Figma Design
export default function LandingPage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Figma Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7ecf3] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#0e141b]">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">TalentAIze</h2>
            </div>
            <div className="flex items-center gap-9">
              <Link className="text-[#0e141b] text-sm font-medium leading-normal" href="/jobs">Jobs</Link>
              <Link className="text-[#0e141b] text-sm font-medium leading-normal" href="/ai-advisor">AI Advisor</Link>
              <Link className="text-[#0e141b] text-sm font-medium leading-normal" href="/company">Company</Link>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-[#4e6e97] flex border-none bg-[#e7ecf3] items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e141b] focus:outline-0 focus:ring-0 border-none bg-[#e7ecf3] focus:border-none h-full placeholder:text-[#4e6e97] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
            <div className="flex gap-2">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#186ddc] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Sign Up</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7ecf3] text-[#0e141b] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Login</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <HeroSection />
            <FeaturedJobsSection />
            <CareerInsightsSection />
            <FinalCTASection />
          </div>
        </div>

        {/* Footer */}
        <FigmaFooter />
      </div>
    </div>
  )
}