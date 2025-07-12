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
import NeuronicLayout from '../components/layout/NeuronicLayout'

// Neuronic Hero Section Component
function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[480px] flex items-center justify-center">
      {/* High contrast glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-slate-900/40 to-emerald-900/40 backdrop-blur-sm"></div>
      
      <div className="container relative z-10">
        <div className="flex flex-col gap-6 items-center text-center max-w-4xl mx-auto px-4">
          {/* Enhanced Hero Title with Glow Effect */}
          <h1 className="text-white text-4xl font-black leading-tight tracking-tight @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent">
              Unlock Your Career Potential
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              with AI Intelligence
            </span>
          </h1>
          
          {/* Enhanced Hero Subtitle */}
          <h2 className="text-white/90 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal drop-shadow-lg">
            Experience the future of job searching with our AI-powered neuronic platform that learns, adapts, and connects you to your ideal career path.
          </h2>
          
          {/* Enhanced Search Bar with High Contrast Glass Effect */}
          <div className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl">
              <div className="text-white/80 flex items-center justify-center pl-[15px] rounded-l-lg border-r-0">
                <Search className="w-5 h-5" />
              </div>
              <input
                placeholder="Job title or keywords"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-white/80 px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
              />
              <div className="flex items-center justify-center rounded-r-lg border-l-0 pr-[7px]">
                <Link href="/jobs" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] transition-all duration-300 shadow-lg hover:shadow-xl">
                  <span className="truncate">Search</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Additional CTA buttons with higher contrast */}
          <div className="flex gap-4 mt-4">
            <Link href="/ai-advisor" className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg">
              <Zap className="w-4 h-4" />
              AI Career Advisor
            </Link>
            <Link href="/company" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600/30 to-slate-600/30 backdrop-blur-md text-white rounded-lg hover:from-gray-600/40 hover:to-slate-600/40 transition-all duration-300 border border-white/30 shadow-lg">
              <Briefcase className="w-4 h-4" />
              For Companies
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Featured Jobs Section (Neuronic Design)
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
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 drop-shadow-lg">Featured Jobs</h2>
        <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-stretch p-4 gap-3">
            {featuredJobs.map((job, index) => (
              <div key={index} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col group-hover:scale-105 transition-transform duration-300"
                  style={{backgroundImage: `url("${job.image}")`}}
                ></div>
                <div className="p-4">
                  <p className="text-white text-base font-medium leading-normal">{job.title}</p>
                  <p className="text-white/80 text-sm font-normal leading-normal">{job.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// AI-Driven Career Insights Section (Neuronic Design)
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
        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 drop-shadow-lg">AI-Driven Career Insights</h2>
        <div className="flex flex-wrap gap-4 p-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
              <p className="text-white text-base font-medium leading-normal">{insight.title}</p>
              <p className="text-white tracking-light text-2xl font-bold leading-tight">{insight.value}</p>
              <p className="text-green-400 text-base font-medium leading-normal">{insight.change}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Enhanced Features Section Component (Neuronic Design)
function FeaturesSection() {
  const features = [
    {
      icon: Target,
      title: 'AI-Powered Matching',
      description: 'Advanced machine learning algorithms analyze your skills, experience, and career goals to deliver hyper-personalized job recommendations.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is secure and private. Control what information you share and with whom.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Globe,
      title: 'Global Opportunities',
      description: 'Access jobs from companies worldwide, including remote positions and international opportunities.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Zap,
      title: 'AI Instant Alerts',
      description: 'Intelligent notifications powered by AI predict and alert you about opportunities before they become competitive.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'AI Company Intelligence',
      description: 'AI-powered company analysis provides deep insights into culture, growth potential, and hiring patterns to help you make informed decisions.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Award,
      title: 'Career Growth',
      description: 'Track your career progression and get personalized advice to advance your professional journey.',
      color: 'from-indigo-500 to-blue-600'
    },
  ]

  return (
    <section className="px-40 py-16">
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-400/30">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-white text-4xl font-bold leading-tight tracking-[-0.015em] mb-6 drop-shadow-lg">
            Everything You Need to Find
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Your Dream Job
            </span>
          </h2>
          <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
            Our platform combines cutting-edge AI technology with human insight to make job searching more effective, efficient, and enjoyable than ever before.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="group">
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-8 h-full hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl">
                {/* Icon */}
                <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link href="/jobs" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold">
            <Target className="w-5 h-5" />
            Explore All Features
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// How It Works Section (Neuronic Design)
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
    <section className="px-40 py-16">
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-white text-4xl font-bold leading-tight tracking-[-0.015em] mb-6 drop-shadow-lg">
            <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
              How TalentAIze Works
            </span>
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Get started in minutes and let our AI do the heavy lifting to find your next opportunity.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-8 text-center hover:bg-white/30 transition-all duration-300 shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-xl font-bold mb-6 shadow-lg">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
              <p className="text-white/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section (Neuronic Design)
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "TalentAIze found me the perfect role in just 2 weeks. The AI matching is incredibly accurate and saved me hours of searching.",
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
    <section className="px-40 py-16">
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-white text-4xl font-bold leading-tight tracking-[-0.015em] mb-6 drop-shadow-lg">
            <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
              Loved by Professionals Worldwide
            </span>
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through TalentAIze.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.author} className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-8 hover:bg-white/30 transition-all duration-300 shadow-xl">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white/90 text-lg leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-white/70">{testimonial.role} at {testimonial.company}</div>
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

// Main Landing Page Component - Neuronic Design
export default function LandingPage() {
  return (
    <NeuronicLayout variant="intense" className="overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Enhanced Navigation with High Contrast Glass Effect */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-white/20 px-10 py-3 backdrop-blur-md bg-white/10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-white">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">TalentAIze</h2>
            </div>
            <div className="flex items-center gap-9">
              <Link className="text-white/90 hover:text-white text-sm font-medium leading-normal transition-colors" href="/jobs">Jobs</Link>
              <Link className="text-white/90 hover:text-white text-sm font-medium leading-normal transition-colors" href="/ai-advisor">AI Advisor</Link>
              <Link className="text-white/90 hover:text-white text-sm font-medium leading-normal transition-colors" href="/company">Company</Link>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-white/80 flex border-none bg-white/20 backdrop-blur-sm items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <Search className="w-6 h-6" />
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-white/20 backdrop-blur-sm focus:border-none h-full placeholder:text-white/80 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
            <div className="flex gap-2">
              <Link href="/auth/register" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                <span className="truncate">Sign Up</span>
              </Link>
              <Link href="/auth/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors border border-white/20">
                <span className="truncate">Login</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <HeroSection />
            <FeaturedJobsSection />
            <CareerInsightsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <FinalCTASection />
          </div>
        </div>

        {/* Footer */}
        <FigmaFooter />
      </div>
    </NeuronicLayout>
  )
}