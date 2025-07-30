'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Briefcase, Globe, Clock, MapPin, Users, Filter, Heart, Wifi, Building2, Zap, Eye, Rocket } from 'lucide-react'
import JobApplicationForm from '../components/JobApplicationForm'
import JobDetailsModal from '../components/JobDetailsModal'
import { ShimmerButton, MagicCard, AnimatedList, TextReveal, SimpleNeural } from '../components/ui'
import { jobsData } from '../data/jobs'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  workStyle: string
  description: string
  companyDescription?: string
  responsibilities?: string
  requirements: string[]
  posted: string
  department: string
  experience_level: string
}

// Load real job data from JSON file in public folder
const loadJobsData = async (): Promise<Job[]> => {
  try {
    console.log('Loading job data from public/job_openings_data.json')
    
    const response = await fetch('/job_openings_data.json')
    console.log('Fetch response status:', response.status, response.statusText)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const jobOpeningsData = await response.json()
    console.log('Fetched data keys:', Object.keys(jobOpeningsData))
    console.log('Premium tier companies:', Object.keys(jobOpeningsData.premium_tier_job_openings || {}))
    console.log('Professional tier companies:', Object.keys(jobOpeningsData.professional_tier_job_openings || {}))
    
    const realJobs: Job[] = []
    let jobIdCounter = 1
    
    // Process Premium tier jobs
    if (jobOpeningsData.premium_tier_job_openings) {
      Object.entries(jobOpeningsData.premium_tier_job_openings).forEach(([companyName, companyData]: [string, any]) => {
        if (companyData.job_openings && Array.isArray(companyData.job_openings)) {
          companyData.job_openings.forEach((job: any) => {
            realJobs.push({
              id: `${jobIdCounter++}`,
              title: job.job_title,
              company: companyName,
              location: job.location,
              salary: job.salary_range || 'Competitive',
              type: job.employment_type || 'Full-time',
              workStyle: job.work_arrangement === 'Remote/Hybrid' ? 'Hybrid' : 
                        job.work_arrangement === 'Remote' ? 'Remote' : 'On-site',
              description: job.job_description_summary,
              requirements: job.key_requirements,
              posted: getRandomPostedTime(),
              department: job.department,
              experience_level: job.experience_level
            })
          })
        }
      })
    }
    
    // Process Professional tier jobs
    if (jobOpeningsData.professional_tier_job_openings) {
      Object.entries(jobOpeningsData.professional_tier_job_openings).forEach(([companyName, companyData]: [string, any]) => {
        if (companyData.job_openings && Array.isArray(companyData.job_openings)) {
          companyData.job_openings.forEach((job: any) => {
            realJobs.push({
              id: `${jobIdCounter++}`,
              title: job.job_title,
              company: companyName,
              location: job.location,
              salary: job.salary_range || 'Competitive',
              type: job.employment_type || 'Full-time',
              workStyle: job.work_arrangement === 'Remote/Hybrid' ? 'Hybrid' : 
                        job.work_arrangement === 'Remote' ? 'Remote' : 'On-site',
              description: job.job_description_summary,
              requirements: job.key_requirements,
              posted: getRandomPostedTime(),
              department: job.department,
              experience_level: job.experience_level
            })
          })
        }
      })
    }
    
    console.log('Processed jobs:', realJobs.length)
    return realJobs
  } catch (error) {
    console.error('Error loading job data:', error)
    console.log('Falling back to static jobs data...')
    return jobsData
  }
}

// Helper function to generate realistic posted times
const getRandomPostedTime = (): string => {
  const options = ['1 day ago', '2 days ago', '3 days ago', '4 days ago', '1 week ago', '2 weeks ago']
  return options[Math.floor(Math.random() * options.length)]
}

export default function JobsPage() {
  // Use premium and professional tier jobs only
  const [jobs, setJobs] = useState<Job[]>([])
  const [allJobs, setAllJobs] = useState<Job[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    type: '',
    workStyle: ''
  })
  const [applicationForm, setApplicationForm] = useState({ isOpen: false, jobTitle: '', companyName: '' })
  const [jobDetailsModal, setJobDetailsModal] = useState<{ isOpen: boolean, job: Job | null }>({ isOpen: false, job: null })

  const getWorkStyleIcon = (workStyle: string) => {
    switch (workStyle.toLowerCase()) {
      case 'remote':
        return Wifi
      case 'on-site':
        return Building2
      case 'hybrid':
        return Zap
      default:
        return Globe
    }
  }

  // Load jobs on component mount
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true)
      try {
        const premiumAndProfessionalJobs = await loadJobsData()
        setAllJobs(premiumAndProfessionalJobs)
        setJobs(premiumAndProfessionalJobs)
      } catch (error) {
        console.error('Error loading jobs:', error)
        setAllJobs([])
        setJobs([])
      }
      setLoading(false)
    }
    
    loadJobs()
  }, [])

  const handleSearch = async () => {
    setSearchLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filtered = allJobs.filter(job => {
      const queryMatch = !filters.query || 
        job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.location.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.department.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.experience_level.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(filters.query.toLowerCase()))
      
      const locationMatch = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      const typeMatch = !filters.type || job.type === filters.type
      const workStyleMatch = !filters.workStyle || job.workStyle === filters.workStyle
      
      return queryMatch && locationMatch && typeMatch && workStyleMatch
    })
    
    setJobs(filtered)
    setSearchLoading(false)
  }

  useEffect(() => {
    handleSearch()
  }, [filters])

  const openApplicationForm = (jobTitle: string, companyName: string) => {
    setApplicationForm({ isOpen: true, jobTitle, companyName })
  }

  const closeApplicationForm = () => {
    setApplicationForm({ isOpen: false, jobTitle: '', companyName: '' })
  }


  const openJobDetailsModal = (job: Job) => {
    setJobDetailsModal({ isOpen: true, job })
  }

  const closeJobDetailsModal = () => {
    setJobDetailsModal({ isOpen: false, job: null })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Neuronic Background */}
      <SimpleNeural />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"></div>
      
      {/* Navigation */}
      <header className="relative z-50 backdrop-blur-2xl bg-black/50 border-b-2 border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">TalentAIze</span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-16">
              <Link href="/jobs" className="text-white hover:text-white transition-colors font-bold text-[16px] border-b-2 border-blue-400">
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

      <main className="relative z-10">
        {/* Hero Section */}  
        <section className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] mb-6 py-4">
                <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block animate-pulse pb-2">
                  Find
                </span>
                <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block animate-pulse pb-2">your dream job</span>
              </h1>
              
              <p className="text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto mb-12">
                ⚡ Discover {allJobs.length} exciting opportunities with Cyprus's leading tech companies. 
                Your perfect match is waiting to ignite your professional journey.
              </p>
              
              {/* Centralized Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search jobs, companies, skills..."
                    value={filters.query}
                    onChange={(e) => setFilters({...filters, query: e.target.value})}
                    className="w-full h-16 pl-6 pr-16 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all shadow-2xl font-medium text-lg"
                  />
                  <Search className="absolute right-6 top-5 w-6 h-6 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section with Filters and Jobs */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Left Side - Filters */}
              <div className="lg:col-span-1">
                <MagicCard variant="neural" className="p-6 shadow-2xl sticky top-8">
                  <h3 className="text-xl font-black text-white mb-6">Filters</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white/80 font-medium mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all shadow-lg font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 font-medium mb-2">Job Type</label>
                      <select
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                        className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all shadow-lg font-medium"
                      >
                        <option value="">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 font-medium mb-2">Work Style</label>
                      <select
                        value={filters.workStyle}
                        onChange={(e) => setFilters({...filters, workStyle: e.target.value})}
                        className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all shadow-lg font-medium"
                      >
                        <option value="">Work Style</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                </MagicCard>
              </div>
              
              {/* Right Side - Jobs */}
              <div className="lg:col-span-3">
                {loading ? (
                  <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    <p className="text-white/80 mt-6 text-lg font-medium">⚡ Loading premium & verified company jobs...</p>
                  </div>
                ) : searchLoading ? (
                  <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    <p className="text-white/80 mt-6 text-lg font-medium">⚡ Lightning-fast job matching...</p>
                  </div>
                ) : (
                  <AnimatedList variant="neural" delay={500} stagger={200} className="grid gap-6">
                    {jobs.map((job) => (
                      <MagicCard key={job.id} variant="holographic" className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Briefcase className="w-6 h-6 text-white" />
                              </div>
                              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-xs font-bold">
                                {job.type}
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-black text-white mb-2 hover:text-blue-300 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-blue-300 text-lg font-bold mb-3">{job.company}</p>
                            
                            <div className="flex flex-wrap gap-4 mb-4 text-white/70 text-sm">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">{job.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-blue-300">{job.salary}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {(() => {
                                  const IconComponent = getWorkStyleIcon(job.workStyle);
                                  return <IconComponent className="w-4 h-4" />;
                                })()}
                                <span className="font-medium">{job.workStyle}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{job.posted}</span>
                              </div>
                            </div>
                            
                            <p className="text-white/80 text-sm leading-relaxed mb-4 font-medium">{job.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.requirements.map((req, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-300 text-xs font-semibold">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4 lg:mt-0 lg:ml-6 space-y-3 lg:min-w-[180px]">
                            <ShimmerButton 
                              variant="neural"
                              onClick={() => openJobDetailsModal(job)}
                              className="w-full h-12 text-sm"
                            >
                              View Details
                            </ShimmerButton>
                            <button
                              onClick={() => openApplicationForm(job.title, job.company)}
                              className="w-full h-12 px-4 bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-emerald-600/30 hover:from-emerald-500/40 hover:via-teal-400/40 hover:to-emerald-500/40 text-white border-2 border-emerald-400/50 hover:border-teal-400/60 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-teal-400/30 font-bold text-sm relative overflow-hidden group"
                              onMouseEnter={(e) => {
                                const rocket = e.currentTarget.querySelector('.rocket-icon');
                                if (rocket) {
                                  rocket.classList.add('fill-orange-500', 'text-orange-500');
                                }
                              }}
                              onMouseLeave={(e) => {
                                const rocket = e.currentTarget.querySelector('.rocket-icon');
                                if (rocket) {
                                  rocket.classList.remove('fill-orange-500', 'text-orange-500');
                                }
                              }}
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <Rocket className="rocket-icon w-4 h-4 transition-all duration-300" />
                                Apply Now
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 transform -translate-x-full"></div>
                            </button>
                          </div>
                        </div>
                      </MagicCard>
                    ))}
                  </AnimatedList>
                )}
                
                {jobs.length === 0 && !searchLoading && (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/30">
                      <Search className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">No lightning matches found</h3>
                    <p className="text-white/80 text-lg font-medium mb-8">Try adjusting your search criteria to discover more opportunities.</p>
                    <Link href="/">
                      <ShimmerButton variant="electric" className="h-14 px-10 text-lg">
                        ⚡ Back to Home
                      </ShimmerButton>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Job Application Form Modal */}
      <JobApplicationForm
        isOpen={applicationForm.isOpen}
        onClose={closeApplicationForm}
        jobTitle={applicationForm.jobTitle}
        companyName={applicationForm.companyName}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={jobDetailsModal.isOpen}
        onClose={closeJobDetailsModal}
        job={jobDetailsModal.job}
        onApplyNow={openApplicationForm}
      />
    </div>
  )
}