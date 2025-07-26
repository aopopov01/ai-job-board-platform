'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Briefcase, Globe, Clock, MapPin, Users, Filter, Heart, Wifi, Building2, Zap } from 'lucide-react'
import JobApplicationForm from '../components/JobApplicationForm'
import { ShimmerButton, MagicCard, AnimatedList, TextReveal, SimpleNeural } from '../components/ui'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  workStyle: string
  description: string
  requirements: string[]
  posted: string
}

const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Implementation Engineer',
    company: 'Prognosys Solutions',
    location: 'Nicosia, Cyprus',
    salary: '€35k - €45k',
    type: 'Full-time',
    workStyle: 'Hybrid',
    description: 'Configure and test software solutions for financial institutions. Analyze requirements, conduct QA, and provide user training for regulatory compliance systems.',
    requirements: ['Computer Science degree', 'VB.NET/C# experience', 'MS SQL database skills', 'REST API knowledge'],
    posted: '2 days ago'
  },
  {
    id: '2',
    title: 'Software Developer (Back-End)',
    company: 'Prognosys Solutions',
    location: 'Nicosia, Cyprus',
    salary: '€40k - €55k',
    type: 'Full-time',
    workStyle: 'Hybrid',
    description: 'Design and develop software products using VB.NET, C#, and SQL. Create stored procedures, REST & SOAP APIs, and enhance existing programs.',
    requirements: ['3+ years experience', 'C++/JavaScript', 'VoIP protocols', 'Real-time systems'],
    posted: '1 day ago'
  },
  {
    id: '3',
    title: 'Machine Learning Engineer',
    company: 'AdTech Holding',
    location: 'Limassol, Cyprus',
    salary: '€50k - €70k',
    type: 'Full-time',
    workStyle: 'Remote',
    description: 'Develop and deploy machine learning models for advertising technology. Work with large datasets, implement algorithms, and optimize model performance.',
    requirements: ['Python/TensorFlow', 'ML algorithms', 'Big data processing', 'Ad tech experience'],
    posted: '1 week ago'
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'AdTech Holding',  
    location: 'Limassol, Cyprus',
    salary: '€45k - €60k',
    type: 'Full-time',
    workStyle: 'Hybrid',
    description: 'Analyze advertising data to optimize campaign performance and ROI using advanced statistical methods.',
    requirements: ['Statistics/Mathematics', 'R/Python', 'Data visualization', 'Business intelligence'],
    posted: '5 days ago'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'AdTech Holding',
    location: 'Limassol, Cyprus',
    salary: '€45k - €58k',
    type: 'Full-time',
    workStyle: 'Remote',
    description: 'Manage cloud infrastructure and deployment pipelines for ad tech platforms.',
    requirements: ['AWS/Azure', 'Docker/Kubernetes', 'CI/CD pipelines', 'Infrastructure as Code'],
    posted: '4 days ago'
  },
  {
    id: '6',
    title: 'QA Engineer',
    company: 'Prognosys Solutions',
    location: 'Nicosia, Cyprus',
    salary: '€30k - €40k',
    type: 'Full-time',
    workStyle: 'Hybrid',
    description: 'Ensure quality of regulatory technology solutions through comprehensive testing.',
    requirements: ['Testing methodologies', 'Automation tools', 'SQL knowledge', 'Regulatory understanding'],
    posted: '6 days ago'
  }
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs)
  const [searchLoading, setSearchLoading] = useState(false)
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    type: '',
    workStyle: ''
  })
  const [applicationForm, setApplicationForm] = useState({ isOpen: false, jobTitle: '', companyName: '' })
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

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

  const handleSearch = async () => {
    setSearchLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filtered = sampleJobs.filter(job => {
      const queryMatch = !filters.query || 
        job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.location.toLowerCase().includes(filters.query.toLowerCase())
      
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

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSaved = new Set(prev)
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId)
      } else {
        newSaved.add(jobId)
      }
      return newSaved
    })
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
                ⚡ Discover {jobs.length} exciting opportunities with Cyprus's leading tech companies. 
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
                {searchLoading ? (
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
                            
                            <TextReveal 
                              text={job.title}
                              variant="neural"
                              speed="fast"
                              className="text-xl font-black text-white mb-2 hover:text-blue-300 transition-colors"
                              as="h3"
                            />
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
                              variant="electric"
                              onClick={() => openApplicationForm(job.title, job.company)}
                              className="w-full h-12 text-sm"
                            >
                              Apply Now
                            </ShimmerButton>
                            <button
                              onClick={() => toggleSaveJob(job.id)}
                              className="w-full h-12 px-4 bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-emerald-600/30 hover:from-emerald-500/40 hover:via-teal-400/40 hover:to-emerald-500/40 text-white border-2 border-emerald-400/50 hover:border-teal-400/60 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-teal-400/30 font-bold text-sm relative overflow-hidden group"
                              onMouseEnter={(e) => {
                                const heart = e.currentTarget.querySelector('.heart-icon');
                                if (heart && !savedJobs.has(job.id)) {
                                  heart.classList.add('fill-red-500', 'text-red-500');
                                }
                              }}
                              onMouseLeave={(e) => {
                                const heart = e.currentTarget.querySelector('.heart-icon');
                                if (heart && !savedJobs.has(job.id)) {
                                  heart.classList.remove('fill-red-500', 'text-red-500');
                                }
                              }}
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <Heart 
                                  className={`heart-icon w-4 h-4 transition-all duration-300 ${
                                    savedJobs.has(job.id) ? 'fill-red-500 text-red-500' : ''
                                  }`} 
                                />
                                {savedJobs.has(job.id) ? 'Saved' : 'Save'}
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
    </div>
  )
}