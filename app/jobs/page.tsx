'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NeuronicBackground from '@/components/NeuronicBackground'
import Header from '@/components/Header'

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
    description: 'Join our RegTech team to implement cutting-edge regulatory solutions for financial institutions.',
    requirements: ['Computer Science degree', 'VB.NET/C# experience', 'MS SQL database skills', 'REST API knowledge'],
    posted: '2 days ago'
  },
  {
    id: '2',
    title: 'Software Developer',
    company: '3CX Ltd',
    location: 'Nicosia, Cyprus',
    salary: '€40k - €55k',
    type: 'Full-time',
    workStyle: 'On-site',
    description: 'Develop and maintain unified communications solutions for global enterprises.',
    requirements: ['3+ years experience', 'C++/JavaScript', 'VoIP protocols', 'Real-time systems'],
    posted: '1 day ago'
  },
  {
    id: '3',
    title: 'Audio Visual Systems Engineer',
    company: 'ACHELEC',
    location: 'Limassol, Cyprus',
    salary: '€32k - €42k',
    type: 'Full-time',
    workStyle: 'On-site',
    description: 'Design and implement audio visual solutions for commercial and marine applications.',
    requirements: ['Electronics/Engineering degree', 'AV systems experience', 'Marine audio knowledge', 'Project management'],
    posted: '3 days ago'
  },
  {
    id: '4',
    title: 'Machine Learning Engineer',
    company: 'AdTech Holding',
    location: 'Limassol, Cyprus',
    salary: '€50k - €65k',
    type: 'Full-time',
    workStyle: 'Remote',
    description: 'Build ML models for programmatic advertising and audience targeting.',
    requirements: ['Python/TensorFlow', 'ML algorithms', 'Big data processing', 'Ad tech experience'],
    posted: '1 week ago'
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'AdTech Holding',
    location: 'Limassol, Cyprus',
    salary: '€45k - €60k',
    type: 'Full-time',
    workStyle: 'Hybrid',
    description: 'Analyze advertising data to optimize campaign performance and ROI.',
    requirements: ['Statistics/Mathematics', 'R/Python', 'Data visualization', 'Business intelligence'],
    posted: '5 days ago'
  },
  {
    id: '6',
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
    id: '7',
    title: 'QA Engineer',
    company: 'Prognosys Solutions',
    location: 'Nicosia, Cyprus',
    salary: '€30k - €40k',
    type: 'Full-time',
    workStyle: 'Hybrid',
    description: 'Ensure quality of regulatory technology solutions through comprehensive testing.',
    requirements: ['Testing methodologies', 'Automation tools', 'SQL knowledge', 'Regulatory understanding'],
    posted: '6 days ago'
  },
  {
    id: '8',
    title: 'Sales Representative',
    company: '3CX Ltd',
    location: 'Nicosia, Cyprus',
    salary: '€25k - €35k + commission',
    type: 'Full-time',
    workStyle: 'On-site',
    description: 'Drive sales of unified communications solutions to enterprise clients.',
    requirements: ['Sales experience', 'B2B background', 'Communication skills', 'CRM systems'],
    posted: '1 week ago'
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

  return (
    <div className="min-h-screen">
      <NeuronicBackground />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6">
              <span className="text-gradient block pb-2">
                find your next
              </span>
              <span className="text-white">
                career opportunity
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8">
              Discover {jobs.length} exciting job opportunities with Cyprus&apos;s leading tech companies
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={filters.query}
                  onChange={(e) => setFilters({...filters, query: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <select
                  value={filters.workStyle}
                  onChange={(e) => setFilters({...filters, workStyle: e.target.value})}
                  className="w-full h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Work Style</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Listing */}
        <section className="container mx-auto px-4 py-8">
          {searchLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-slate-400 mt-4">Searching jobs...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                      <p className="text-blue-400 text-lg mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-400">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary}</span>
                        <span>⏰ {job.type}</span>
                        <span>🏢 {job.workStyle}</span>
                        <span>🕒 {job.posted}</span>
                      </div>
                      <p className="text-slate-300 mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <span key={index} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <Button size="lg" className="w-full lg:w-auto">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {jobs.length === 0 && !searchLoading && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-white mb-4">No jobs found</h3>
              <p className="text-slate-400">Try adjusting your search criteria or browse all available positions.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}