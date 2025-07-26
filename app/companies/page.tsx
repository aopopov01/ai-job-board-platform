'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2,
  Users,
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Brain,
  Globe,
  Target,
  CheckCircle,
  Crown,
  Award,
  Zap,
  Play,
  Code,
  Shield,
  Clock,
  Home,
  Laptop,
  Calendar,
  Eye,
  Heart,
  Wifi,
  ExternalLink,
  ChevronUp
} from 'lucide-react'
import { ShimmerButton, MagicCard, AnimatedList, TextReveal, SimpleNeural } from '../components/ui'

// Company subscription tiers
type SubscriptionTier = 'premium' | 'professional' | 'free'

// Company interface based on our research data
interface Company {
  id: number
  name: string
  website: string
  description: string
  logo_path: string | null
  industry_category: string
  company_size: string
  founded_year: number | null
  location: string
  tech_island_member: boolean
  social_media: {
    linkedin: string | null
    twitter: string | null
    facebook: string | null
  }
  tags: string[]
  // Additional computed fields for display
  subscriptionTier?: SubscriptionTier
  openJobs?: number
  tagline?: string
  employees?: string
  workType?: string
}

// Load and process our comprehensive research data
const loadCompaniesData = async (): Promise<Company[]> => {
  try {
    // Load the comprehensive research data
    const response = await fetch('/cyprus-tech-companies-comprehensive.json')
    const companiesData = await response.json()
    
    // Process and enhance the data
    return companiesData.map((company: any) => ({
      ...company,
      // Assign subscription tiers based on company characteristics
      subscriptionTier: assignSubscriptionTier(company),
      // Generate display fields
      openJobs: generateOpenJobs(company),
      tagline: generateTagline(company),
      employees: formatEmployeeCount(company.company_size),
      workType: assignWorkType(company.industry_category)
    }))
  } catch (error) {
    console.error('Error loading companies data:', error)
    return []
  }
}

// Helper functions to enhance the data
const assignSubscriptionTier = (company: any): SubscriptionTier => {
  // Premium tier for large companies or well-known brands
  if (company.company_size === 'Large' || 
      ['Mastercard', 'JetBrains', 'MY.GAMES', 'Iron Mountain', 'Depositphotos'].includes(company.name)) {
    return 'premium'
  }
  // Professional tier for medium companies
  if (company.company_size === 'Medium') {
    return 'professional'
  }
  // Free tier for others
  return 'free'
}


const generateOpenJobs = (company: any): number => {
  const baseJobs = company.company_size === 'Large' ? 12 : company.company_size === 'Medium' ? 6 : 2
  return baseJobs + Math.floor(Math.random() * 8)
}

const generateTagline = (company: any): string => {
  // Create taglines based on industry and description
  const taglines: Record<string, string> = {
    'FinTech/Financial Services': 'Financial innovation for the digital age',
    'Software Development': 'Building tomorrow\'s technology today',
    'Gaming/Entertainment': 'Creating immersive gaming experiences',
    'AI/Machine Learning': 'Powering the future with artificial intelligence',
    'Cybersecurity': 'Protecting digital assets and privacy',
    'Telecommunications': 'Connecting the world through technology',
    'E-commerce/Retail': 'Revolutionizing online commerce',
    'Healthcare/Biotech': 'Advancing healthcare through technology',
    'Marketing/AdTech': 'Digital marketing innovation',
    'Real Estate/PropTech': 'Transforming real estate with technology',
    'Education/EdTech': 'Educational technology solutions',
    'Transportation/Logistics': 'Smart mobility and logistics solutions',
    'Consulting/Professional Services': 'Expert consulting and professional services',
    'Investment/Venture Capital': 'Funding innovation and growth',
    'Media/Content': 'Digital media and content solutions'
  }
  return taglines[company.industry_category] || 'Innovation and technology solutions'
}

const formatEmployeeCount = (size: string): string => {
  const formats: Record<string, string> = {
    'Startup': '1-50',
    'Small': '51-250',
    'Medium': '251-1000',
    'Large': '1000+'
  }
  return formats[size] || '1-50'
}

const assignWorkType = (industry: string): string => {
  // Assign work types based on industry trends
  const remoteIndustries = ['Software Development', 'AI/Machine Learning', 'Marketing/AdTech']
  const hybridIndustries = ['FinTech/Financial Services', 'Consulting/Professional Services']
  
  if (remoteIndustries.includes(industry)) return 'Remote'
  if (hybridIndustries.includes(industry)) return 'Hybrid'
  return Math.random() > 0.5 ? 'Hybrid' : 'Remote'
}

// Company tier styling
const getTierStyling = (tier: SubscriptionTier) => {
  switch (tier) {
    case 'premium':
      return {
        borderClass: 'border-yellow-400/60 ring-2 ring-yellow-400/30',
        badgeClass: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        badgeIcon: Crown,
        badgeText: 'Premium Partner'
      }
    case 'professional':
      return {
        borderClass: 'border-blue-400/60 ring-1 ring-blue-400/20',
        badgeClass: 'bg-gradient-to-r from-blue-500 to-purple-500',
        badgeIcon: Award,
        badgeText: 'Verified'
      }
    case 'free':
      return {
        borderClass: 'border-white/20',
        badgeClass: 'bg-gray-600',
        badgeIcon: Building2,
        badgeText: 'Listed'
      }
  }
}

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

// Companies Hero Section
function CompaniesHero({ onSearch, companies }: { onSearch: (query: string) => void, companies: Company[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const totalCompanies = companies.length
  const premiumCompanies = companies.filter(c => c.subscriptionTier === 'premium').length
  const professionalCompanies = companies.filter(c => c.subscriptionTier === 'professional').length
  const freeCompanies = companies.filter(c => c.subscriptionTier === 'free').length
  const totalOpenJobs = companies.reduce((sum, company) => sum + (company.openJobs || 0), 0)

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  return (
    <section className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] mb-6 py-4">
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block animate-pulse pb-2">
              Discover your next
            </span>
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block animate-pulse pb-2">dream company</span>
          </h1>
          
          <p className="text-xl text-white/80 leading-relaxed font-medium max-w-2xl mx-auto mb-12">
            ⚡ Explore <span className="text-cyan-400 font-bold">{totalCompanies}</span> innovative companies from Cyprus's leading tech ecosystem. 
            From <span className="text-emerald-400 font-bold">startups to unicorns</span>, your perfect workplace culture is waiting to ignite your career journey.
          </p>
          
          {/* Company Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl p-6 text-center">
              <div className="text-3xl font-black text-white mb-2">{totalCompanies}</div>
              <div className="text-white/80 font-medium text-sm">Total Companies</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border-2 border-yellow-400/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-black text-yellow-400 mb-2">{premiumCompanies}</div>
              <div className="text-white/80 font-medium text-sm">Premium Partners</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border-2 border-blue-400/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-black text-blue-400 mb-2">{professionalCompanies}</div>
              <div className="text-white/80 font-medium text-sm">Verified Companies</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border-2 border-emerald-400/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-black text-emerald-400 mb-2">{totalOpenJobs}</div>
              <div className="text-white/80 font-medium text-sm">Open Positions</div>
            </div>
          </div>
          
          {/* Centralized Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search companies, industries, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-16 pl-6 pr-16 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all shadow-2xl font-medium text-lg"
              />
              <Search className="absolute right-6 top-5 w-6 h-6 text-white/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Advanced Filters Section  
function AdvancedFilters({ onFilterChange, filters, companies }: { 
  onFilterChange: (filterType: string, value: string) => void,
  filters: { industry: string, size: string, workType: string, location: string },
  companies: Company[]
}) {
  return (
    <section className="py-8 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <MagicCard variant="neural" className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-white" />
              <span className="text-white font-bold">Advanced Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {/* Industry Filter */}
              <select 
                value={filters.industry}
                onChange={(e) => onFilterChange('industry', e.target.value)}
                className="h-12 px-4 bg-black/50 backdrop-blur-md border-2 border-white/30 rounded-xl text-white font-medium focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-black">All Industries</option>
                <option value="FinTech/Financial Services" className="bg-black">FinTech/Financial Services</option>
                <option value="Software Development" className="bg-black">Software Development</option>
                <option value="Gaming/Entertainment" className="bg-black">Gaming/Entertainment</option>
                <option value="AI/Machine Learning" className="bg-black">AI/Machine Learning</option>
                <option value="Cybersecurity" className="bg-black">Cybersecurity</option>
                <option value="Telecommunications" className="bg-black">Telecommunications</option>
                <option value="E-commerce/Retail" className="bg-black">E-commerce/Retail</option>
                <option value="Healthcare/Biotech" className="bg-black">Healthcare/Biotech</option>
                <option value="Marketing/AdTech" className="bg-black">Marketing/AdTech</option>
                <option value="Real Estate/PropTech" className="bg-black">Real Estate/PropTech</option>
                <option value="Education/EdTech" className="bg-black">Education/EdTech</option>
                <option value="Transportation/Logistics" className="bg-black">Transportation/Logistics</option>
                <option value="Consulting/Professional Services" className="bg-black">Consulting/Professional Services</option>
                <option value="Investment/Venture Capital" className="bg-black">Investment/Venture Capital</option>
                <option value="Media/Content" className="bg-black">Media/Content</option>
              </select>
              
              {/* Company Size Filter */}
              <select 
                value={filters.size}
                onChange={(e) => onFilterChange('size', e.target.value)}
                className="h-12 px-4 bg-black/50 backdrop-blur-md border-2 border-white/30 rounded-xl text-white font-medium focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-black">All Sizes</option>
                <option value="Small" className="bg-black">Small (1-50)</option>
                <option value="Medium" className="bg-black">Medium (51-1000)</option>
                <option value="Large" className="bg-black">Large (1000+)</option>
              </select>
              
              {/* Work Type Filter */}
              <select 
                value={filters.workType}
                onChange={(e) => onFilterChange('workType', e.target.value)}
                className="h-12 px-4 bg-black/50 backdrop-blur-md border-2 border-white/30 rounded-xl text-white font-medium focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-black">All Work Types</option>
                <option value="Remote" className="bg-black">Remote</option>
                <option value="Hybrid" className="bg-black">Hybrid</option>
                <option value="On-site" className="bg-black">On-site</option>
              </select>
              
              {/* Location Filter */}
              <select 
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
                className="h-12 px-4 bg-black/50 backdrop-blur-md border-2 border-white/30 rounded-xl text-white font-medium focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-black">All Locations</option>
                <option value="Cyprus" className="bg-black">Cyprus</option>
                <option value="Nicosia" className="bg-black">Nicosia, Cyprus</option>
                <option value="Limassol" className="bg-black">Limassol, Cyprus</option>
                <option value="Slovakia" className="bg-black">Slovakia</option>
                <option value="Dubai" className="bg-black">Dubai, UAE</option>
                <option value="Remote" className="bg-black">Remote/Global</option>
              </select>
            </div>
            
            <div className="text-white/80 font-medium">
              Showing {companies.length} companies
            </div>
          </div>
        </MagicCard>
      </div>
    </section>
  )
}

// Company Card Component
function CompanyCard({ company, isFirst = false }: { company: Company, isFirst?: boolean }) {
  const tierStyling = getTierStyling(company.subscriptionTier || 'free')
  const BadgeIcon = tierStyling.badgeIcon
  const WorkStyleIcon = getWorkStyleIcon(company.workType || 'Hybrid')

  // Get logo URL - use actual logo or fallback
  const logoUrl = company.logo_path 
    ? `/${company.logo_path}` 
    : `https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=80&h=80&fit=crop&crop=center`

  return (
    <MagicCard variant="holographic" className={`p-4 pb-12 cursor-pointer h-72 flex flex-col relative ${isFirst ? 'bg-grid-white/[0.1] bg-[size:20px_20px]' : ''}`}>

      <div className="flex gap-3 flex-1">
        {/* Company Logo with Crown - Fixed Width Column */}
        <div className="w-12 flex-shrink-0 flex flex-col items-center">
          {/* Crown Icon or spacer - Fixed Height */}
          <div className="h-5 mb-1 flex items-center justify-center">
            {company.subscriptionTier === 'premium' && (
              <Crown className="w-5 h-5 text-yellow-400" />
            )}
          </div>
          {/* Logo - Fixed Size */}
          <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/20 bg-white/5">
            <img 
              src={logoUrl} 
              alt={`${company.name} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback for broken images
                const target = e.target as HTMLImageElement
                target.src = `https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&crop=center`
              }}
            />
          </div>
        </div>
        
        {/* Company Info - Flexible Column with Fixed Structure */}
        <div className="flex-1 flex flex-col">
          {/* Header Section - Fixed Height */}
          <div className="mb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-3">
                <h3 className="text-xl font-bold text-white leading-tight hover:text-blue-300 transition-colors">
                  {company.name}
                </h3>
              </div>
              
              <div className="text-right flex-shrink-0 ml-2">
                <div className="text-blue-400 font-bold text-base whitespace-nowrap">{company.openJobs} open jobs</div>
              </div>
            </div>
          </div>
          
          {/* Metadata Section */}
          <div className="mb-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1 text-white/60">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate">{company.employees}</span>
              </div>
              <div className="flex items-center gap-1 text-white/60">
                <WorkStyleIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate">{company.workType}</span>
              </div>
              <div className="flex items-center gap-1 text-white/60 col-span-2">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate">{company.industry_category}</span>
              </div>
              {company.founded_year && (
                <div className="flex items-center gap-1 text-white/60">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{company.founded_year}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Description Section - Flexible Height */}
          <div className="flex-1 mb-3">
            <p className="text-white/70 text-sm leading-relaxed font-medium line-clamp-2">
              {company.description.length > 100 
                ? `${company.description.substring(0, 100)}...` 
                : company.description
              }
            </p>
          </div>
          

        </div>
      </div>
      
      {/* Verified Badge - Top Left Corner */}
      {company.subscriptionTier === 'professional' && (
        <div className="absolute top-0 left-0">
          <Award className="w-6 h-6 text-blue-400" />
        </div>
      )}
      
      {/* Bottom Left - View Jobs Button (flush with bottom edge) */}
      <div className="absolute bottom-0 left-0">
        <Link href="/jobs">
          <ShimmerButton variant="electric" className="px-3 py-1.5 text-xs rounded-b-none rounded-t-lg">
            View Jobs
          </ShimmerButton>
        </Link>
      </div>
      
      {/* Bottom Right - Profile Button (flush with bottom edge) */}
      <div className="absolute bottom-0 right-0">
        <Link href={company.website} target="_blank" rel="noopener noreferrer">
          <button className="px-3 py-1.5 bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-emerald-600/30 hover:from-emerald-500/40 hover:via-teal-400/40 hover:to-emerald-500/40 text-white border-2 border-emerald-400/50 hover:border-teal-400/60 rounded-b-none rounded-t-lg backdrop-blur-md transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-teal-400/30 font-bold text-xs relative overflow-hidden group flex items-center gap-1 whitespace-nowrap">
            <span className="relative z-10">Profile</span>
            <ExternalLink className="w-3 h-3 relative z-10 flex-shrink-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 transform -translate-x-full"></div>
          </button>
        </Link>
      </div>
    </MagicCard>
  )
}

// Main Companies Page Component
export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [allCompanies, setAllCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    industry: '',
    size: '',
    workType: '',
    location: ''
  })

  // Load companies data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const companiesData = await loadCompaniesData()
        setAllCompanies(companiesData)
        setCompanies(companiesData)
      } catch (error) {
        console.error('Failed to load companies:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterCompanies(query, filters)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    filterCompanies(searchQuery, newFilters)
  }

  const filterCompanies = (query: string, currentFilters: typeof filters) => {
    let filtered = allCompanies

    // Text search
    if (query) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.tagline?.toLowerCase().includes(query.toLowerCase()) ||
        company.description.toLowerCase().includes(query.toLowerCase()) ||
        company.location.toLowerCase().includes(query.toLowerCase()) ||
        company.industry_category.toLowerCase().includes(query.toLowerCase()) ||
        company.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        company.workType?.toLowerCase().includes(query.toLowerCase()) ||
        (query === 'premium' && company.subscriptionTier === 'premium') ||
        (query === 'remote' && company.workType?.toLowerCase().includes('remote')) ||
        (query === 'hybrid' && company.workType?.toLowerCase().includes('hybrid'))
      )
    }

    // Apply filters
    if (currentFilters.industry) {
      filtered = filtered.filter(company => 
        company.industry_category.toLowerCase().includes(currentFilters.industry.toLowerCase())
      )
    }

    if (currentFilters.size) {
      filtered = filtered.filter(company => company.company_size === currentFilters.size)
    }

    if (currentFilters.workType) {
      filtered = filtered.filter(company => 
        company.workType?.toLowerCase().includes(currentFilters.workType.toLowerCase())
      )
    }

    if (currentFilters.location) {
      filtered = filtered.filter(company => 
        company.location.toLowerCase().includes(currentFilters.location.toLowerCase())
      )
    }

    setCompanies(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <SimpleNeural />
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/30 animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Loading Cyprus Tech Companies...</h2>
          <p className="text-white/60">Discovering amazing opportunities for you</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <SimpleNeural />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"></div>
      
      {/* Navigation */}
      <header className="relative z-50 backdrop-blur-2xl bg-black/50 border-b-2 border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">TalentAIze</span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-16">
              <Link href="/jobs" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                Jobs
              </Link>
              <Link href="/companies" className="text-white hover:text-white transition-colors font-bold text-[16px] border-b-2 border-blue-400">
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
        <CompaniesHero onSearch={handleSearch} companies={allCompanies} />
        
        {/* Advanced Filters */}
        <AdvancedFilters 
          onFilterChange={handleFilterChange}
          filters={filters}
          companies={companies}
        />
        
        {/* Industry Overview */}
        {!loading && allCompanies.length > 0 && (
          <section className="py-12 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-white mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Cyprus Tech Ecosystem at a Glance
                  </span>
                </h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                  Discover the thriving technology landscape with companies ranging from innovative startups to industry leaders
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                {Object.entries(
                  allCompanies.reduce((acc, company) => {
                    acc[company.industry_category] = (acc[company.industry_category] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                )
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([industry, count]) => (
                  <div key={industry} className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center hover:border-cyan-400/50 transition-colors">
                    <div className="text-2xl font-black text-cyan-400 mb-1">{count}</div>
                    <div className="text-white/80 text-sm font-medium">{industry.split('/')[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Companies Grid */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {companies.length > 0 ? (
              <>
                {/* Featured Companies Section */}
                {companies.filter(c => c.subscriptionTier === 'premium').length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                      <Crown className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-2xl font-black text-white">Featured Partners</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
                    </div>
                    <AnimatedList variant="neural" delay={200} stagger={150} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                      {companies
                        .filter(c => c.subscriptionTier === 'premium')
                        .map((company, index) => (
                          <CompanyCard key={company.id} company={company} isFirst={index === 0} />
                        ))
                      }
                    </AnimatedList>
                  </div>
                )}

                {/* Verified Companies Section */}
                {companies.filter(c => c.subscriptionTier === 'professional').length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                      <Award className="w-6 h-6 text-blue-400" />
                      <h3 className="text-2xl font-black text-white">Verified Companies</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                    </div>
                    <AnimatedList variant="neural" delay={300} stagger={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                      {companies
                        .filter(c => c.subscriptionTier === 'professional')
                        .map((company) => (
                          <CompanyCard key={company.id} company={company} />
                        ))
                      }
                    </AnimatedList>
                  </div>
                )}
                
                {/* All Other Companies */}
                {companies.filter(c => c.subscriptionTier === 'free').length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <Building2 className="w-6 h-6 text-gray-400" />
                      <h3 className="text-2xl font-black text-white">Other Companies</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-400/50 to-transparent"></div>
                    </div>
                    <AnimatedList variant="neural" delay={400} stagger={50} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
                      {companies
                        .filter(c => c.subscriptionTier === 'free')
                        .map((company) => (
                          <CompanyCard key={company.id} company={company} />
                        ))
                      }
                    </AnimatedList>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/30">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4">No companies found</h3>
                <p className="text-white/80 text-lg font-medium mb-8">Try adjusting your search criteria to discover more opportunities.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilters({ industry: '', size: '', workType: '', location: '' })
                    setCompanies(allCompanies)
                  }}
                  className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-lg"
                >
                  Show All Companies
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-cyan-400/30 text-white transition-all duration-300 flex items-center justify-center group"
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  )
}