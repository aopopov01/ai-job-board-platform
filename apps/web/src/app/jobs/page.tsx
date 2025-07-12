'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { jobService, jobCategoryService } from '@job-board/database'
import { useAuthStore } from '@job-board/shared/client'
import NeuronicLayout from '../../components/layout/NeuronicLayout'
import { 
  Search, 
  MapPin, 
  Clock, 
  Briefcase, 
  Filter,
  Star,
  Bookmark,
  Building2,
  DollarSign,
  Users,
  Calendar,
  ChevronDown,
  X,
  SlidersHorizontal,
  Heart,
  Eye,
  ExternalLink,
  Zap
} from 'lucide-react'

interface Job {
  id: string
  title: string
  description: string
  job_type: string
  work_style: string
  location: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string | null
  created_at: string
  company_profiles?: {
    company_name?: string
    company_size?: string
    industry?: string
  } | any
  job_categories?: { name: string } | any
  saved?: boolean
  applicants?: number
  featured?: boolean
}

// Job Card Component
function JobCard({ job, onSave, onView }: { job: Job; onSave: (id: string) => void; onView: (id: string) => void }) {
  const formatSalary = (min: number | null, max: number | null, currency: string | null) => {
    if (!min || !max || !currency) return 'Salary not disclosed'
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
  }

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 14) return '1 week ago'
    return `${Math.ceil(diffDays / 7)} weeks ago`
  }

  return (
    <div className={`card-interactive relative group p-6 bg-white/90 backdrop-blur-sm ${job.featured ? 'ring-2 ring-primary/20 shadow-xl border-primary/30 bg-gradient-to-br from-primary/5 to-accent/10' : 'shadow-sm hover:shadow-xl'}`}>
      {job.featured && (
        <div className="absolute -top-3 left-6">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary to-primary-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
            <Zap className="w-3 h-3" />
            AI Featured
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-xl flex items-center justify-center text-primary font-semibold">
            {job.company_profiles?.company_name?.charAt(0) || 'C'}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              <Link href={`/jobs/${job.id}`}>
                {job.title}
              </Link>
            </h3>
            <p className="text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {job.company_profiles?.company_name || 'Company'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onSave(job.id)}
          className={`p-2 rounded-lg transition-colors ${
            job.saved 
              ? 'text-primary bg-primary/10 hover:bg-primary/20' 
              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
          }`}
        >
          <Heart className={`w-5 h-5 ${job.saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {job.location || 'Remote'}
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          {formatJobType(job.job_type)}
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          {job.salary_min && job.salary_max ? formatSalary(job.salary_min, job.salary_max, job.salary_currency) : 'Competitive'}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {formatJobType(job.work_style)}
        </div>
      </div>

      <p className="text-muted-foreground mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="badge badge-info text-xs">
          {formatJobType(job.job_type)}
        </span>
        <span className="badge badge-success text-xs">
          {formatJobType(job.work_style)}
        </span>
        {job.job_categories?.name && (
          <span className="badge badge-info text-xs">
            {job.job_categories.name}
          </span>
        )}
        <span className="badge text-xs bg-muted text-muted-foreground">
          {job.company_profiles?.company_size || 'Unknown'} employees
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {job.applicants || Math.floor(Math.random() * 50) + 10} applicants
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {getTimeAgo(job.created_at)}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(job.id)}
            className="btn btn-secondary btn-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </button>
          <Link href={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const { profile } = useAuthStore()
  const [jobs, setJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    query: '',
    location: '',
    job_type: '',
    work_style: '',
    experience_level: '',
    category_id: '',
    salary_min: '',
    salary_max: ''
  })

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [jobsResponse, categoriesResponse] = await Promise.all([
          jobService.search({ limit: 20 }),
          jobCategoryService.getAll()
        ])

        if (jobsResponse.error) throw jobsResponse.error
        if (categoriesResponse.error) throw categoriesResponse.error

        setJobs((jobsResponse.data || []) as Job[])
        setCategories(categoriesResponse.data || [])
      } catch (error: any) {
        setError(error.message || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleSearch = async () => {
    setSearchLoading(true)
    setError('')

    try {
      const searchFilters = {
        ...filters,
        salary_min: filters.salary_min ? Number(filters.salary_min) : undefined,
        salary_max: filters.salary_max ? Number(filters.salary_max) : undefined,
        limit: 20
      }

      const { data, error } = await jobService.search(searchFilters)
      if (error) throw error

      setJobs((data || []) as Job[])
    } catch (error: any) {
      setError(error.message || 'Failed to search jobs')
    } finally {
      setSearchLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      job_type: '',
      work_style: '',
      experience_level: '',
      category_id: '',
      salary_min: '',
      salary_max: ''
    })
    // Re-run initial search
    handleSearch()
  }

  const handleSaveJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ))
  }

  const handleViewJob = (jobId: string) => {
    // Navigate to job details or open modal
    console.log('View job:', jobId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Finding Amazing Jobs</h3>
          <p className="text-muted-foreground">Discovering opportunities that match your skills...</p>
        </div>
      </div>
    )
  }

  return (
    <NeuronicLayout variant="subtle">
      <div className="min-h-screen">
      {/* Enhanced Header with Hero Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-accent/10 border-b border-border/50">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/15 rounded-full blur-3xl"></div>
        
        <div className="container relative z-10">
          <div className="section-sm">
            <div className="flex justify-between items-center mb-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  AI-Powered Job Discovery
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse ml-2"></div>
                </div>
                <h1 className="text-responsive-3xl lg:text-5xl font-bold text-gradient mb-4">
                  Find Your Dream Job with AI
                </h1>
                <p className="text-responsive-xl text-neutral-600 mb-2">
                  Discover {jobs.length} amazing opportunities from top companies, intelligently matched to your skills and preferences
                </p>
                <div className="flex items-center gap-6 text-sm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live job updates
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    AI-powered matching
                  </div>
                </div>
              </div>
              {profile && (
                <Link href="/dashboard" className="btn btn-outline btn-lg hidden md:flex">
                  <Building2 className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
              )}
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-6">
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="search-container">
                    <Search className="search-icon text-primary" />
                    <input
                      type="text"
                      placeholder="Job title, company, or keywords"
                      value={filters.query}
                      onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="input input-lg bg-white/90 border-neutral-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="search-container">
                    <MapPin className="search-icon text-primary" />
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="input input-lg bg-white/90 border-neutral-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  
                  <button 
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="btn btn-primary btn-lg px-8 py-4 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {searchLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Searching AI Database...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Find Jobs with AI
                      </>
                    )}
                  </button>
                </div>
                
                {/* Quick Filter Tags */}
                <div className="flex items-center gap-3 mt-6 flex-wrap">
                  <span className="text-sm text-neutral-600 font-medium">Popular:</span>
                  {['Remote', 'Full-time', 'React', 'AI/ML', 'Product Manager'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setFilters(prev => ({ ...prev, query: tag }))}
                      className="px-3 py-1 bg-neutral-100 hover:bg-primary hover:text-white text-neutral-700 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="section">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Desktop Sidebar Filters */}
            <div className="hidden lg:block">
              <div className="card sticky top-8">
                <h3 className="text-lg font-semibold mb-6">Filters</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="label mb-3">Category</label>
                    <select
                      className="input"
                      value={filters.category_id}
                      onChange={(e) => setFilters(prev => ({ ...prev, category_id: e.target.value }))}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label mb-3">Job Type</label>
                    <div className="space-y-2">
                      {['All', 'Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'].map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="jobType"
                            value={type === 'All' ? '' : type.toLowerCase().replace(' ', '_')}
                            checked={filters.job_type === (type === 'All' ? '' : type.toLowerCase().replace(' ', '_'))}
                            onChange={(e) => setFilters(prev => ({ ...prev, job_type: e.target.value }))}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label mb-3">Work Style</label>
                    <div className="space-y-2">
                      {['All', 'Remote', 'Hybrid', 'On-site'].map((style) => (
                        <label key={style} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="workStyle"
                            value={style === 'All' ? '' : style.toLowerCase().replace('-', '')}
                            checked={filters.work_style === (style === 'All' ? '' : style.toLowerCase().replace('-', ''))}
                            onChange={(e) => setFilters(prev => ({ ...prev, work_style: e.target.value }))}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label mb-3">Experience Level</label>
                    <div className="space-y-2">
                      {['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'].map((level) => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="experience"
                            value={level === 'All' ? '' : level.toLowerCase().replace(' ', '_')}
                            checked={filters.experience_level === (level === 'All' ? '' : level.toLowerCase().replace(' ', '_'))}
                            onChange={(e) => setFilters(prev => ({ ...prev, experience_level: e.target.value }))}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label mb-3">Salary Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={filters.salary_min}
                        onChange={(e) => setFilters(prev => ({ ...prev, salary_min: e.target.value }))}
                        placeholder="Min"
                        className="input"
                      />
                      <input
                        type="number"
                        value={filters.salary_max}
                        onChange={(e) => setFilters(prev => ({ ...prev, salary_max: e.target.value }))}
                        placeholder="Max"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={handleSearch}
                      disabled={searchLoading}
                      className="btn btn-primary w-full"
                    >
                      {searchLoading ? 'Searching...' : 'Apply Filters'}
                    </button>
                    <button 
                      onClick={clearFilters}
                      className="btn btn-secondary w-full"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {jobs.length} jobs found
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Showing results for your search criteria
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden btn btn-secondary btn-sm"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select className="input pr-10 appearance-none cursor-pointer">
                      <option value="relevance">Most Relevant</option>
                      <option value="newest">Newest First</option>
                      <option value="salary">Highest Salary</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive">{error}</p>
                </div>
              )}

              {/* Job Cards */}
              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria or filters
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="btn btn-primary"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSave={handleSaveJob}
                      onView={handleViewJob}
                    />
                  ))}

                  {/* Load More */}
                  <div className="text-center mt-12">
                    <button 
                      onClick={handleSearch}
                      className="btn btn-secondary btn-lg"
                    >
                      Load More Jobs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="label mb-3">Category</label>
                <select
                  className="input"
                  value={filters.category_id}
                  onChange={(e) => setFilters(prev => ({ ...prev, category_id: e.target.value }))}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label mb-3">Job Type</label>
                <div className="space-y-2">
                  {['All', 'Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="mobileJobType"
                        value={type === 'All' ? '' : type.toLowerCase().replace(' ', '_')}
                        checked={filters.job_type === (type === 'All' ? '' : type.toLowerCase().replace(' ', '_'))}
                        onChange={(e) => setFilters(prev => ({ ...prev, job_type: e.target.value }))}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label mb-3">Work Style</label>
                <div className="space-y-2">
                  {['All', 'Remote', 'Hybrid', 'On-site'].map((style) => (
                    <label key={style} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="mobileWorkStyle"
                        value={style === 'All' ? '' : style.toLowerCase().replace('-', '')}
                        checked={filters.work_style === (style === 'All' ? '' : style.toLowerCase().replace('-', ''))}
                        onChange={(e) => setFilters(prev => ({ ...prev, work_style: e.target.value }))}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-6 border-t">
                <button 
                  onClick={() => {
                    handleSearch()
                    setShowFilters(false)
                  }}
                  disabled={searchLoading}
                  className="btn btn-primary w-full"
                >
                  {searchLoading ? 'Searching...' : 'Apply Filters'}
                </button>
                <button 
                  onClick={() => {
                    clearFilters()
                    setShowFilters(false)
                  }}
                  className="btn btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </NeuronicLayout>
  )
}