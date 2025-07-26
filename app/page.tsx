'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import JobApplicationForm from './components/JobApplicationForm'
import { ShimmerButton, MagicCard, AnimatedList, TextReveal, SimpleNeural } from './components/ui'
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
  Eye,
  X,
  Wifi,
  Building2
} from 'lucide-react'

// Job data from Jobs section
const sampleJobs = [
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
    applicants: 8,
    featured: true,
    matchScore: 92
  },
  {
    id: '3',
    title: 'Machine Learning Engineer',
    description: 'Develop and deploy machine learning models for advertising technology. Work with large datasets, implement algorithms, and optimize model performance. Experience with Python, TensorFlow, and cloud platforms required.',
    company: 'AdTech Holding',
    location: 'Limassol, Cyprus',
    salary: '€50k - €70k',
    type: 'Full-time',
    workStyle: 'Remote',
    posted: '1 week ago',
    applicants: 15,
    featured: true,
    matchScore: 96
  }
]

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(sampleJobs)
  const [showResults, setShowResults] = useState(false)
  const [applicationForm, setApplicationForm] = useState({ isOpen: false, jobTitle: '', companyName: '' })

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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(sampleJobs)
      setShowResults(false)
      return
    }

    const filtered = sampleJobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    setSearchResults(filtered)
    setShowResults(true)
  }

  const handleQuickSearch = (role: string) => {
    setSearchQuery(role)
    const filtered = sampleJobs.filter(job => 
      job.title.toLowerCase().includes(role.toLowerCase()) ||
      job.description.toLowerCase().includes(role.toLowerCase())
    )
    setSearchResults(filtered)
    setShowResults(true)
  }

  const openApplicationForm = (jobTitle: string, companyName: string) => {
    setApplicationForm({ isOpen: true, jobTitle, companyName })
  }

  const closeApplicationForm = () => {
    setApplicationForm({ isOpen: false, jobTitle: '', companyName: '' })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <SimpleNeural />
      <div className="fixed inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
      
      <header className="relative z-50 backdrop-blur-2xl bg-black/50 border-b-2 border-white/20 shadow-2xl">
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

      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">

          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.2] px-6 py-8">
              <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block animate-pulse mb-4 pb-2">
                Ignite your
              </span>
              <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block animate-pulse pb-2">
                career lightning
              </span>
            </h1>
            
            <div className="max-w-3xl mx-auto mt-6">
              <p className="text-xl text-white/90 leading-relaxed font-medium">
                ⚡ Electrify your career with AI-powered lightning-speed matching. 
                Unleash your potential and spark extraordinary opportunities.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-white mb-4">Find Your Perfect Match</h2>
                
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for roles, companies, or skills..."
                    className="w-full h-14 pl-6 pr-28 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all shadow-2xl font-medium text-base"
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-2 top-2 h-10 px-6 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg text-base"
                  >
                    Search
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'].map((role) => (
                    <button 
                      key={role} 
                      onClick={() => handleQuickSearch(role)}
                      className="px-4 py-2 text-sm text-white/80 border-2 border-white/30 rounded-lg hover:border-white/60 hover:text-white transition-all font-semibold backdrop-blur-sm bg-white/5"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <ShimmerButton variant="electric" className="h-12 px-8 text-base w-full">
                  Get Started
                </ShimmerButton>
                <button className="h-12 px-8 bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-emerald-600/30 hover:from-emerald-500/40 hover:via-teal-400/40 hover:to-emerald-500/40 text-white border-2 border-emerald-400/50 hover:border-teal-400/60 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-teal-400/30 font-bold text-base w-full relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center">
                    Watch Demo
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 transform -translate-x-full"></div>
                </button>
              </div>

              {showResults && (
                <div className="mt-6">
                  <div className="p-6 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold text-lg">Search Results ({searchResults.length})</h3>
                      <button 
                        onClick={() => setShowResults(false)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {searchResults.length > 0 ? (
                      <div className="space-y-4">
                        {searchResults.map((job) => (
                          <div key={job.id} className="p-4 bg-black/40 border border-white/20 rounded-xl hover:border-blue-400/40 transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-white font-semibold text-base">{job.title}</h4>
                                <p className="text-white/70 text-sm">{job.company}</p>
                              </div>
                              <span className="text-blue-300 font-bold text-sm">{job.salary}</span>
                            </div>
                            <p className="text-white/60 text-sm mb-2">{job.location} • {job.type}</p>
                            <Link href="/jobs" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                              View Details →
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/60 text-base mb-4">No jobs found matching your search.</p>
                        <Link href="/jobs" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                          Browse All Jobs →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <MagicCard variant="neural" className="p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <TextReveal 
                        text="AI Match Score"
                        variant="neural"
                        speed="fast"
                        className="text-white font-bold text-lg"
                      />
                      <div className="text-white/70 text-base font-medium">98% compatibility</div>
                    </div>
                  </div>
                  
                  <AnimatedList variant="neural" delay={500} stagger={200}>
                    {[
                      { role: 'Senior Frontend Engineer', company: 'Stripe', match: '96%' },
                      { role: 'Product Designer', company: 'Linear', match: '94%' },
                      { role: 'Full Stack Developer', company: 'Vercel', match: '92%' }
                    ].map((job, idx) => (
                      <MagicCard key={idx} variant="electric" className="p-4 shadow-lg">
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
                      </MagicCard>
                    ))}
                  </AnimatedList>
                </div>
              </MagicCard>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-[1.2] mb-6 py-2">
              <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block animate-pulse mb-2 pb-1">Top jobs</span>
              <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block animate-pulse pb-2">
                waiting for you
              </span>
            </h2>
            <p className="text-lg text-white/90 leading-relaxed max-w-3xl mx-auto mb-8 font-medium">
              ⚡ Discover handpicked opportunities from leading companies with AI-powered matching.
            </p>
          </div>

          <AnimatedList variant="neural" delay={1000} stagger={300} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleJobs.map((job, index) => (
              <MagicCard key={index} variant="holographic" className="p-6 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-xs font-bold">
                    {job.type}
                  </span>
                </div>
                
                <TextReveal 
                  text={job.title}
                  variant="neural"
                  speed="fast"
                  className="text-white font-black text-lg mb-2 group-hover:text-blue-300 transition-colors"
                  as="h3"
                />
                <p className="text-white/70 font-medium text-sm mb-3">{job.company}</p>
                <p className="text-white/60 text-xs mb-3 flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  {job.location}
                </p>
                <p className="text-white/60 text-xs mb-3 flex items-center gap-2">
                  {(() => {
                    const IconComponent = getWorkStyleIcon(job.workStyle);
                    return <IconComponent className="w-3 h-3" />;
                  })()}
                  {job.workStyle}
                </p>
                <p className="text-blue-300 font-bold text-base">{job.salary}</p>
                
                <div className="mt-4 pt-4 space-y-2">
                  <Link href="/jobs">
                    <ShimmerButton variant="neural" className="w-full h-10 text-sm">
                      View Details
                    </ShimmerButton>
                  </Link>
                  <button 
                    onClick={() => openApplicationForm(job.title, job.company)}
                    className="w-full h-10 px-4 bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-emerald-600/30 hover:from-emerald-500/40 hover:via-teal-400/40 hover:to-emerald-500/40 text-white border-2 border-emerald-400/50 hover:border-teal-400/60 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-teal-400/30 font-bold text-sm relative overflow-hidden group"
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
              </MagicCard>
            ))}
          </AnimatedList>
        </div>
      </section>

      <JobApplicationForm
        isOpen={applicationForm.isOpen}
        onClose={closeApplicationForm}
        jobTitle={applicationForm.jobTitle}
        companyName={applicationForm.companyName}
      />
    </div>
  )
}

export default function Home() {
  return <HeroSection />
}