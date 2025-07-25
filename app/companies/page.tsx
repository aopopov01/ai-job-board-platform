'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NeuronicBackground from '@/components/NeuronicBackground'
import Header from '@/components/Header'

interface Company {
  id: string
  name: string
  industry: string
  location: string
  employees: string
  subscriptionTier: 'premium' | 'professional' | 'free'
  description: string
  specialties: string[]
  workTypes: string[]
  founded: string
  website: string
  openJobs: number
}

const companiesData: Company[] = [
  {
    id: 'prognosys-solutions',
    name: 'Prognosys Solutions',
    industry: 'RegTech (Regulatory Technology)',
    location: 'Nicosia, Cyprus',
    employees: '50-100',
    subscriptionTier: 'premium',
    description: 'Leading provider of regulatory technology solutions for financial institutions across Europe.',
    specialties: ['Regulatory Compliance', 'Risk Management', 'Financial Technology', 'Data Analytics'],
    workTypes: ['Hybrid', 'On-site'],
    founded: '2015',
    website: 'prognosys.com',
    openJobs: 3
  },
  {
    id: 'adtech-holding',
    name: 'AdTech Holding',
    industry: 'Digital Advertising Technology',
    location: 'Limassol, Cyprus',
    employees: '100-200',
    subscriptionTier: 'premium',
    description: 'Innovative ad tech company specializing in programmatic advertising and machine learning.',
    specialties: ['Programmatic Advertising', 'Machine Learning', 'Big Data', 'Real-time Bidding'],
    workTypes: ['Remote', 'Hybrid'],
    founded: '2018',
    website: 'adtechholding.com',
    openJobs: 5
  },
  {
    id: '3cx-ltd',
    name: '3CX Ltd',
    industry: 'Unified Communications',
    location: 'Nicosia, Cyprus',
    employees: '200-500',
    subscriptionTier: 'professional',
    description: 'Global leader in unified communications solutions and VoIP technology.',
    specialties: ['VoIP Technology', 'Unified Communications', 'Enterprise Software', 'Cloud Solutions'],
    workTypes: ['On-site', 'Hybrid'],
    founded: '2005',
    website: '3cx.com',
    openJobs: 2
  },
  {
    id: 'advent-digital',
    name: 'Advent Digital',
    industry: 'Digital Marketing',
    location: 'Limassol, Cyprus',
    employees: '20-50',
    subscriptionTier: 'professional',
    description: 'Full-service digital marketing agency serving international clients.',
    specialties: ['Digital Marketing', 'SEO/SEM', 'Social Media', 'Content Strategy'],
    workTypes: ['Remote', 'Hybrid'],
    founded: '2020',
    website: 'adventdigital.com',
    openJobs: 4
  },
  {
    id: 'aleph-holding',
    name: 'Aleph Holding',
    industry: 'Investment Technology',
    location: 'Nicosia, Cyprus',
    employees: '10-20',
    subscriptionTier: 'professional',
    description: 'Investment technology company focused on algorithmic trading and fintech solutions.',
    specialties: ['Algorithmic Trading', 'Financial Technology', 'Investment Analytics', 'Risk Management'],
    workTypes: ['On-site', 'Hybrid'],
    founded: '2019',
    website: 'alephholding.com',
    openJobs: 2
  },
  {
    id: '0100-ventures',
    name: '0100 Ventures',
    industry: 'Venture Capital',
    location: 'Limassol, Cyprus',
    employees: '5-10',
    subscriptionTier: 'free',
    description: 'Early-stage venture capital fund investing in European tech startups.',
    specialties: ['Venture Capital', 'Startup Investment', 'Business Development', 'Market Analysis'],
    workTypes: ['Remote', 'Hybrid'],
    founded: '2021',
    website: '0100ventures.com',
    openJobs: 1
  },
  {
    id: 'adsterra',
    name: 'Adsterra',
    industry: 'Advertising Network',
    location: 'Limassol, Cyprus',
    employees: '100-200',
    subscriptionTier: 'professional',
    description: 'Global advertising network connecting advertisers with publishers worldwide.',
    specialties: ['Advertising Network', 'Publisher Relations', 'Ad Optimization', 'Traffic Monetization'],
    workTypes: ['Remote', 'On-site'],
    founded: '2013',
    website: 'adsterra.com',
    openJobs: 6
  },
  {
    id: 'achelec',
    name: 'ACHELEC',
    industry: 'Audio Visual Technology',
    location: 'Limassol, Cyprus',
    employees: '10-50',
    subscriptionTier: 'free',
    description: 'Specialized audio visual solutions provider for commercial and marine applications.',
    specialties: ['Audio Visual Solutions', 'Interactive Displays', 'Digital Signage', 'LED Technology', 'Marine Audio Systems'],
    workTypes: ['On-site'],
    founded: '2010',
    website: 'achelec.com',
    openJobs: 2
  }
]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(companiesData)
  const [searchLoading, setSearchLoading] = useState(false)
  const [filters, setFilters] = useState({
    query: '',
    industry: '',
    location: '',
    size: '',
    workType: ''
  })

  const handleSearch = async () => {
    setSearchLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filtered = companiesData.filter(company => {
      const queryMatch = !filters.query || 
        company.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        company.industry.toLowerCase().includes(filters.query.toLowerCase()) ||
        company.location.toLowerCase().includes(filters.query.toLowerCase()) ||
        company.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        company.specialties.some(specialty => specialty.toLowerCase().includes(filters.query.toLowerCase()))
      
      const industryMatch = !filters.industry || 
        company.industry.toLowerCase().includes(filters.industry.toLowerCase())
      const locationMatch = !filters.location || 
        company.location.toLowerCase().includes(filters.location.toLowerCase())
      const sizeMatch = !filters.size || company.employees === filters.size
      const workTypeMatch = !filters.workType || 
        company.workTypes.includes(filters.workType)
      
      return queryMatch && industryMatch && locationMatch && sizeMatch && workTypeMatch
    })

    // Sort by subscription tier (premium first)
    filtered.sort((a, b) => {
      const tierOrder = { premium: 0, professional: 1, free: 2 }
      return tierOrder[a.subscriptionTier] - tierOrder[b.subscriptionTier]
    })
    
    setCompanies(filtered)
    setSearchLoading(false)
  }

  useEffect(() => {
    handleSearch()
  }, [filters])

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">👑 Premium Partner</span>
      case 'professional':
        return <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">✓ Verified</span>
      case 'free':
        return <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm">Recently Listed</span>
      default:
        return null
    }
  }

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
                discover amazing
              </span>
              <span className="text-white">
                tech companies
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8">
              Explore {companies.length} innovative companies in Cyprus&apos;s thriving tech ecosystem
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">{companies.length}+</div>
                <div className="text-slate-400">Total Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">{companies.filter(c => c.subscriptionTier === 'premium').length}</div>
                <div className="text-slate-400">Premium Partners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{companies.reduce((sum, c) => sum + c.openJobs, 0)}+</div>
                <div className="text-slate-400">Open Positions</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search companies, industries, or specialties..."
                  value={filters.query}
                  onChange={(e) => setFilters({...filters, query: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  placeholder="Industry"
                  value={filters.industry}
                  onChange={(e) => setFilters({...filters, industry: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <select
                  value={filters.size}
                  onChange={(e) => setFilters({...filters, size: e.target.value})}
                  className="w-full h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Company Size</option>
                  <option value="5-10">5-10 employees</option>
                  <option value="10-20">10-20 employees</option>
                  <option value="10-50">10-50 employees</option>
                  <option value="20-50">20-50 employees</option>
                  <option value="50-100">50-100 employees</option>
                  <option value="100-200">100-200 employees</option>
                  <option value="200-500">200-500 employees</option>
                </select>
              </div>
              <div>
                <select
                  value={filters.workType}
                  onChange={(e) => setFilters({...filters, workType: e.target.value})}
                  className="w-full h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Work Type</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Companies Listing */}
        <section className="container mx-auto px-4 py-8">
          {searchLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-slate-400 mt-4">Searching companies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {companies.map((company) => (
                <div key={company.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{company.name}</h3>
                      <p className="text-blue-400 mb-2">{company.industry}</p>
                    </div>
                    {getTierBadge(company.subscriptionTier)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-400">
                    <div>📍 {company.location}</div>
                    <div>👥 {company.employees}</div>
                    <div>📅 Founded {company.founded}</div>
                    <div>💼 {company.openJobs} open jobs</div>
                  </div>
                  
                  <p className="text-slate-300 mb-4">{company.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded-full text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-2">Work Options:</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.workTypes.map((workType, index) => (
                        <span key={index} className="bg-green-900/30 text-green-300 px-2 py-1 rounded-full text-xs">
                          {workType}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button className="flex-1">
                      View Jobs ({company.openJobs})
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Visit Website
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {companies.length === 0 && !searchLoading && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-white mb-4">No companies found</h3>
              <p className="text-slate-400">Try adjusting your search criteria or browse all available companies.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}