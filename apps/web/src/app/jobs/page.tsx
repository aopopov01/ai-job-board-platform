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

  // Sample jobs data
  const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Senior AI Engineer',
      description: 'Join our cutting-edge AI team to build next-generation neural networks that revolutionize how people find jobs. You will work with large language models, computer vision, and advanced machine learning algorithms to create intelligent matching systems.',
      company: 'NeuroTech AI',
      location: 'San Francisco, CA',
      salary: '$150k - $250k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '2 days ago',
      applicants: 23,
      featured: true,
      matchScore: 95
    },
    {
      id: '2',
      title: 'Product Manager - AI Platform',
      description: 'Lead the product strategy for our AI-powered job matching platform. Drive feature development, user research, and cross-functional collaboration to deliver exceptional user experiences that help millions find their dream jobs.',
      company: 'TalentAI Systems',
      location: 'Remote',
      salary: '$130k - $180k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '3 days ago',
      applicants: 45,
      matchScore: 88
    },
    {
      id: '3',
      title: 'Senior Frontend Developer',
      description: 'Build stunning user interfaces for our neuronic-designed job platform. Work with React, TypeScript, and modern design systems to create beautiful, responsive experiences that make job searching intuitive and delightful.',
      company: 'Digital Innovations',
      location: 'Austin, TX',
      salary: '$120k - $160k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '1 week ago',
      applicants: 67,
      matchScore: 82
    },
    {
      id: '4',
      title: 'UX Designer - Neural Interfaces',
      description: 'Design intuitive and beautiful user experiences for AI-powered applications. Create wireframes, prototypes, and design systems that make complex AI accessible to everyone, focusing on human-centered design principles.',
      company: 'Neural Design Co',
      location: 'Remote',
      salary: '$95k - $130k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '1 week ago',
      applicants: 34,
      matchScore: 76
    },
    {
      id: '5',
      title: 'Data Scientist - ML Platform',
      description: 'Analyze massive datasets to improve our AI matching algorithms. Build predictive models, conduct A/B tests, and drive data-driven decision making across the platform to enhance user experience and job matching accuracy.',
      company: 'DataMind Analytics',
      location: 'Seattle, WA',
      salary: '$140k - $190k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '4 days ago',
      applicants: 29,
      matchScore: 91
    },
    {
      id: '6',
      title: 'DevOps Engineer - Cloud Infrastructure',
      description: 'Build and maintain scalable cloud infrastructure for our AI platform. Work with Kubernetes, AWS, and modern DevOps practices to ensure reliable, high-performance systems that can handle millions of job searches daily.',
      company: 'CloudScale Solutions',
      location: 'Remote',
      salary: '$125k - $175k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '5 days ago',
      applicants: 41,
      matchScore: 79
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
    const filtered = sampleJobs.filter(job => 
      job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.query.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.query.toLowerCase())
    )
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
                    <label className="text-white/80 font-medium mb-3 block">Job Type</label>
                    <div className="space-y-2">
                      {['All', 'Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
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
                <label className="text-white/80 font-medium mb-3 block">Job Type</label>
                <div className="space-y-2">
                  {['All', 'Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
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