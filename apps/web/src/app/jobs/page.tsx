'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import NeuronicLayout from '../../components/layout/NeuronicLayout'
import { 
  Search, 
  MapPin, 
  Clock, 
  Briefcase, 
  Filter,
  Heart,
  Building2,
  DollarSign,
  Users,
  X,
  SlidersHorizontal,
  Eye,
  Brain,
  Globe,
  ArrowRight,
  Target,
  TrendingUp,
  Award,
  Lightning,
  Zap,
  Sparkles,
  Star,
  CheckCircle
} from 'lucide-react'

interface Job {
  id: string
  title: string
  description: string
  company: string
  location: string
  salary: string
  type: string
  workStyle: string
  posted: string
  applicants: number
  featured?: boolean
  matchScore?: number
}

// Navigation Header Component - Exact match with landing page
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
            <Link href="/jobs" className="text-blue-300 hover:text-white transition-colors font-bold text-[16px]">
              Jobs
            </Link>
            <Link href="/companies" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
              Companies
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

// Job Card Component - Exact neuronic design from landing page
function JobCard({ job }: { job: Job }) {
  const [saved, setSaved] = useState(false)

  return (
    <div className="p-8 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl hover:border-blue-400/40 transition-all duration-300 group cursor-pointer">
      
      {/* Featured Badge */}
      {job.featured && (
        <div className="absolute top-6 left-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full text-xs font-bold text-white shadow-lg">
            <Zap className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* AI Match Score */}
      {job.matchScore && (
        <div className="absolute top-6 right-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-xs font-bold">
            <Brain className="w-3 h-3" />
            {job.matchScore}% Match
          </div>
        </div>
      )}

      {/* Company Logo */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-white font-black text-xl mb-2 group-hover:text-blue-300 transition-colors">
              {job.title}
            </h3>
            <p className="text-white/70 font-medium text-base mb-1">{job.company}</p>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.posted}
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setSaved(!saved)}
          className={`p-3 rounded-xl transition-all duration-300 ${
            saved 
              ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300' 
              : 'bg-white/10 border border-white/20 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Job Description */}
      <p className="text-white/80 text-base leading-relaxed mb-6">
        {job.description}
      </p>

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Type</p>
            <p className="text-white font-medium">{job.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Work Style</p>
            <p className="text-white font-medium">{job.workStyle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Salary</p>
            <p className="text-white font-medium">{job.salary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Applicants</p>
            <p className="text-white font-medium">{job.applicants}</p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-300 text-sm font-bold">
          {job.type}
        </span>
        <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-sm font-bold">
          {job.workStyle}
        </span>
        <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/40 rounded-full text-purple-300 text-sm font-bold">
          {job.company}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-white/20">
        <Link href={`/jobs/${job.id}`} className="flex-1">
          <button className="w-full h-12 bg-blue-600/20 hover:bg-blue-600 border-2 border-blue-400/40 hover:border-blue-400 text-blue-300 hover:text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </Link>
        <Link href={`/jobs/${job.id}`} className="flex-1">
          <button className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Apply Now
          </button>
        </Link>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    type: '',
    workStyle: '',
    salary: ''
  })

  // Real jobs from Tech Island member companies
  const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Implementation Engineer',
      description: 'Configure and test software solutions for financial institutions. Analyze requirements, conduct QA, and provide user training for regulatory compliance systems. Requires Computer Science degree, MS SQL skills, and English/Greek proficiency.',
      company: 'Prognosys Solutions',
      location: 'Nicosia, Cyprus',
      salary: '€35k - €45k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '3 days ago',
      applicants: 12,
      featured: true,
      matchScore: 94
    },
    {
      id: '2',
      title: 'Software Developer (Back-End)',
      description: 'Design and develop software products using VB.NET, C#, and SQL. Create stored procedures, REST & SOAP APIs, and enhance existing programs. Participate in unit testing and code reviews for regulatory compliance solutions.',
      company: 'Prognosys Solutions',
      location: 'Nicosia, Cyprus',
      salary: '€40k - €55k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '5 days ago',
      applicants: 18,
      matchScore: 92
    },
    {
      id: '3',
      title: 'Machine Learning Engineer',
      description: 'Develop and implement ML algorithms for advertising technology. Work with predictive targeting AI, fraud prevention systems, and big data analysis. Join our team of 500+ experts in the AdTech ecosystem.',
      company: 'AdTech Holding',
      location: 'Limassol, Cyprus',
      salary: '€50k - €70k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '1 week ago',
      applicants: 34,
      featured: true,
      matchScore: 89
    },
    {
      id: '4',
      title: 'Data Scientist - AdTech',
      description: 'Apply machine learning and statistical analysis to programmatic advertising data. Build predictive models for user behavior, optimize ad targeting algorithms, and work with big data technologies.',
      company: 'AdTech Holding',
      location: 'Limassol, Cyprus',
      salary: '€45k - €65k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '4 days ago',
      applicants: 27,
      matchScore: 87
    },
    {
      id: '5',
      title: 'Software Engineer - VOIP',
      description: 'Develop and maintain business communication solutions. Work on PBX systems, cloud telephony, and VOIP technologies. Experience with telecommunications protocols and modern software development practices required.',
      company: '3CX Ltd',
      location: 'Cyprus',
      salary: '€38k - €52k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '6 days ago',
      applicants: 15,
      matchScore: 85
    },
    {
      id: '6',
      title: 'Full-Stack Developer',
      description: 'Build modern web applications using React, Node.js, and cloud technologies. Work on digital consulting projects for various clients, from startups to enterprise solutions.',
      company: 'Advent Digital',
      location: 'Cyprus',
      salary: '€42k - €58k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '2 days ago',
      applicants: 22,
      matchScore: 83
    },
    {
      id: '7',
      title: 'Product Manager - Digital Advertising',
      description: 'Lead product development for digital advertising platforms. Work with global teams across 130+ countries to enhance advertiser and publisher experiences. Requires strong analytical skills and AdTech knowledge.',
      company: 'Aleph Holding',
      location: 'Dubai, UAE',
      salary: '$60k - $80k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '1 week ago',
      applicants: 41,
      matchScore: 81
    },
    {
      id: '8',
      title: 'Business Development Manager',
      description: 'Drive business growth for our venture capital and startup ecosystem. Work with entrepreneurs, investors, and corporate partners to build innovative companies and foster talent development.',
      company: '0100 Ventures',
      location: 'Slovakia',
      salary: '€35k - €50k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '5 days ago',
      applicants: 19,
      matchScore: 78
    },
    {
      id: '9',
      title: 'Account Manager - Publishers',
      description: 'Manage relationships with publishers in our global advertising network. Optimize revenue, provide technical support, and help publishers maximize their monetization potential.',
      company: 'Adsterra',
      location: 'Remote',
      salary: '$35k - $45k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '3 days ago',
      applicants: 28,
      matchScore: 76
    },
    {
      id: '10',
      title: 'DevOps Engineer - AdTech',
      description: 'Maintain and scale infrastructure for high-traffic advertising platforms. Work with Docker, Kubernetes, and cloud technologies to ensure reliable, high-performance systems handling millions of requests.',
      company: 'AdTech Holding',
      location: 'Limassol, Cyprus',
      salary: '€48k - €65k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '1 week ago',
      applicants: 31,
      matchScore: 74
    },
    {
      id: '11',
      title: 'Frontend Developer - React',
      description: 'Build responsive user interfaces for digital consulting projects. Work with modern frameworks including React, TypeScript, and modern CSS. Collaborate with designers and backend developers.',
      company: 'Advent Digital',
      location: 'Cyprus',
      salary: '€35k - €48k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '4 days ago',
      applicants: 33,
      matchScore: 72
    },
    {
      id: '12',
      title: 'Sales Representative - VOIP Solutions',
      description: 'Promote and sell business communication solutions to enterprises. Develop client relationships, conduct product demonstrations, and support the sales process for VOIP and PBX systems.',
      company: '3CX Ltd',
      location: 'Cyprus',
      salary: '€30k - €45k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '1 week ago',
      applicants: 24,
      matchScore: 70
    },
    {
      id: '13',
      title: 'Marketing Manager - Global Campaigns',
      description: 'Lead marketing campaigns for global advertising technology company. Develop marketing strategies, manage digital campaigns, and work with international teams to drive brand awareness.',
      company: 'Aleph Holding',
      location: 'Remote',
      salary: '$45k - $65k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '6 days ago',
      applicants: 37,
      matchScore: 68
    },
    {
      id: '14',
      title: 'Quality Assurance Engineer',
      description: 'Ensure software quality for financial compliance systems. Design and execute test cases, perform manual and automated testing, and work closely with development teams to maintain high standards.',
      company: 'Prognosys Solutions',
      location: 'Nicosia, Cyprus',
      salary: '€32k - €42k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '2 days ago',
      applicants: 16,
      matchScore: 66
    },
    {
      id: '15',
      title: 'Technical Support Specialist',
      description: 'Provide technical support for advertising network platform. Help advertisers and publishers resolve technical issues, optimize campaigns, and ensure smooth platform operation.',
      company: 'Adsterra',
      location: 'Remote',
      salary: '$25k - $35k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '5 days ago',
      applicants: 21,
      matchScore: 64
    }
  ]

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setJobs(sampleJobs)
      setLoading(false)
    }
    loadJobs()
  }, [])

  const handleSearch = async () => {
    setSearchLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filtered = sampleJobs.filter(job => {
      // Text search
      const queryMatch = !filters.query || 
        job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.location.toLowerCase().includes(filters.query.toLowerCase())
      
      // Location filter
      const locationMatch = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      
      // Job type filter
      const typeMatch = !filters.type || job.type === filters.type
      
      // Work style filter
      const workStyleMatch = !filters.workStyle || job.workStyle === filters.workStyle
      
      // Salary filter (basic implementation)
      const salaryMatch = !filters.salary || true // Could implement salary range filtering
      
      return queryMatch && locationMatch && typeMatch && workStyleMatch && salaryMatch
    })
    
    // Sort by match score if available
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    
    setJobs(filtered)
    setSearchLoading(false)
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      type: '',
      workStyle: '',
      salary: ''
    })
    setJobs(sampleJobs)
  }

  if (loading) {
    return (
      <NeuronicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-white font-black text-2xl mb-4">⚡ Scanning Neural Networks</h3>
            <p className="text-white/80 text-lg">Discovering AI-powered opportunities just for you...</p>
          </div>
        </div>
      </NeuronicLayout>
    )
  }

  return (
    <NeuronicLayout>
      <NavigationHeader />
      
      {/* Hero Section - Centered for Jobs page */}
      <section className="relative min-h-screen flex items-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center min-h-screen py-20 justify-center">
            
            {/* Centered Content */}
            <div className="space-y-8 max-w-3xl">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 border-2 border-white/30 rounded-full backdrop-blur-sm shadow-lg shadow-white/20">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg shadow-white/80"></div>
                  <span className="text-sm text-white font-bold tracking-wide">⚡ AI-POWERED JOB DISCOVERY</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight">
                  <span className="text-white block leading-tight drop-shadow-2xl">Ignite your</span>
                  <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block leading-tight drop-shadow-2xl animate-pulse py-2">
                    career lightning
                  </span>
                </h1>
                
                <p className="text-2xl text-white/90 leading-relaxed font-medium">
                  ⚡ Find {jobs.length} amazing opportunities from top companies, intelligently matched to your skills and career goals using advanced neural networks.
                </p>
              </div>
              
              {/* Search Interface */}
              <div className="space-y-4">
                <div className="relative max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder="Search for roles, companies, or skills..."
                    value={filters.query}
                    onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full h-16 pl-6 pr-32 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all shadow-2xl font-medium text-lg"
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="absolute right-2 top-2 h-12 px-8 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg text-lg"
                  >
                    {searchLoading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={handleSearch}
                  className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-2xl text-lg"
                >
                  Find Jobs with AI
                </button>
                <Link href="/auth/signup">
                  <button className="h-14 px-10 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md text-lg">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Listing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-600/20 border-2 border-emerald-400/40 rounded-full mb-8 backdrop-blur-sm">
              <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
              <span className="text-sm text-emerald-100 font-bold tracking-wide">FEATURED OPPORTUNITIES</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
              {jobs.length} AI-matched jobs waiting for you
            </h2>
            <p className="text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto">
              Discover handpicked opportunities from leading companies, intelligently ranked by neural compatibility score.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="p-8 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl sticky top-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-blue-300" />
                  </div>
                  <h3 className="text-white font-black text-xl">Smart Filters</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-white/80 font-medium mb-3 block">Location</label>
                    <input
                      type="text"
                      placeholder="Enter location..."
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 font-medium mb-3 block">Job Type</label>
                    <div className="space-y-2">
                      {['All', 'Full-time', 'Part-time', 'Contract'].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="jobType"
                            value={type === 'All' ? '' : type}
                            checked={filters.type === (type === 'All' ? '' : type)}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded"
                          />
                          <span className="text-white/70 group-hover:text-white transition-colors">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-white/80 font-medium mb-3 block">Work Style</label>
                    <div className="space-y-2">
                      {['All', 'Remote', 'Hybrid', 'On-site'].map((style) => (
                        <label key={style} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="workStyle"
                            value={style === 'All' ? '' : style}
                            checked={filters.workStyle === (style === 'All' ? '' : style)}
                            onChange={(e) => setFilters(prev => ({ ...prev, workStyle: e.target.value }))}
                            className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded"
                          />
                          <span className="text-white/70 group-hover:text-white transition-colors">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-white/80 font-medium mb-3 block">Salary Range</label>
                    <select
                      value={filters.salary}
                      onChange={(e) => setFilters(prev => ({ ...prev, salary: e.target.value }))}
                      className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
                    >
                      <option value="">Any Salary</option>
                      <option value="50k-100k">$50k - $100k</option>
                      <option value="100k-150k">$100k - $150k</option>
                      <option value="150k-200k">$150k - $200k</option>
                      <option value="200k+">$200k+</option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/20">
                    <button 
                      onClick={handleSearch}
                      disabled={searchLoading}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-2xl"
                    >
                      {searchLoading ? 'Searching...' : 'Apply Filters'}
                    </button>
                    <button 
                      onClick={clearFilters}
                      className="w-full h-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Cards */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white font-black text-2xl mb-2">
                    {jobs.length} AI-Matched Jobs
                  </h3>
                  <p className="text-white/70">
                    Intelligently ranked by neural compatibility score
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden h-10 px-4 bg-white/20 border-2 border-white/40 text-white rounded-xl font-bold backdrop-blur-md flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                  
                  <select className="h-10 px-4 bg-white/20 border-2 border-white/40 text-white rounded-xl font-bold backdrop-blur-md appearance-none cursor-pointer">
                    <option value="ai_match">Best AI Match</option>
                    <option value="newest">Newest First</option>
                    <option value="salary">Highest Salary</option>
                  </select>
                </div>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-white/60" />
                  </div>
                  <h3 className="text-white font-black text-2xl mb-4">No jobs found</h3>
                  <p className="text-white/70 mb-8">
                    Try adjusting your search criteria or clear all filters
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-2xl"
                  >
                    Show All Jobs
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-8">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}

                  {/* Load More */}
                  <div className="text-center pt-12">
                    <button className="h-14 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md">
                      Load More Neural Matches
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-black/90 backdrop-blur-md border-l-2 border-white/20 shadow-2xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black text-xl">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-white/80 font-medium mb-3 block">Location</label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-white/80 font-medium mb-3 block">Job Type</label>
                <div className="space-y-2">
                  {['All', 'Full-time', 'Part-time', 'Contract'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="mobileJobType"
                        value={type === 'All' ? '' : type}
                        checked={filters.type === (type === 'All' ? '' : type)}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded"
                      />
                      <span className="text-white/70 group-hover:text-white transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/80 font-medium mb-3 block">Work Style</label>
                <div className="space-y-2">
                  {['All', 'Remote', 'Hybrid', 'On-site'].map((style) => (
                    <label key={style} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="mobileWorkStyle"
                        value={style === 'All' ? '' : style}
                        checked={filters.workStyle === (style === 'All' ? '' : style)}
                        onChange={(e) => setFilters(prev => ({ ...prev, workStyle: e.target.value }))}
                        className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded"
                      />
                      <span className="text-white/70 group-hover:text-white transition-colors">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/80 font-medium mb-3 block">Salary Range</label>
                <select
                  value={filters.salary}
                  onChange={(e) => setFilters(prev => ({ ...prev, salary: e.target.value }))}
                  className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
                >
                  <option value="">Any Salary</option>
                  <option value="50k-100k">$50k - $100k</option>
                  <option value="100k-150k">$100k - $150k</option>
                  <option value="150k-200k">$150k - $200k</option>
                  <option value="200k+">$200k+</option>
                </select>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/20">
                <button 
                  onClick={() => {
                    handleSearch()
                    setShowFilters(false)
                  }}
                  disabled={searchLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-2xl"
                >
                  {searchLoading ? 'Searching...' : 'Apply Filters'}
                </button>
                <button 
                  onClick={() => {
                    clearFilters()
                    setShowFilters(false)
                  }}
                  className="w-full h-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </NeuronicLayout>
  )
}