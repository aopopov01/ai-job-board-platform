'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Building2,
  MapPin,
  Users,
  Star,
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
  DollarSign,
  Home,
  Laptop,
  Calendar,
  Eye,
  Heart
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

// Company subscription tiers
type SubscriptionTier = 'premium' | 'professional' | 'free'

// Real Tech Island member companies data with subscription tiers and comprehensive info
const companiesData = [
  // PREMIUM TIER - Highest paying customers
  {
    id: "prognosys-solutions",
    name: "Prognosys Solutions",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=80&h=80&fit=crop&crop=center",
    tagline: "Regulatory Compliance Solutions for Financial Industry",
    location: "Nicosia, Cyprus",
    employees: "50-100",
    industry: "RegTech (Regulatory Technology)",
    workType: "Hybrid",
    rating: 4.7,
    reviewCount: 89,
    openJobs: 2,
    subscriptionTier: "premium" as SubscriptionTier,
    founded: "2004",
    website: "https://prognosys.com.cy",
    specialties: ["Regulatory Compliance", "Financial Reporting", "Risk Management", "Tax Reporting"],
    techStack: ["VB.NET", "C#", "MS SQL Server", "REST API", "SOAP", "SQL Stored Procedures"],
    companySize: "Medium",
    benefits: [
      "Competitive salary package",
      "On-the-job training programs",
      "Flexible working hours",
      "Professional development opportunities",
      "Health insurance coverage",
      "Career growth opportunities",
      "Modern office environment",
      "Team building activities"
    ],
    culture: {
      workLifeBalance: 4.6,
      compensation: 4.5,
      careerGrowth: 4.7,
      management: 4.4,
      diversity: 4.3
    },
    teamMembers: [
      { name: "Andreas Economides", role: "CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" },
      { name: "Maria Constantinou", role: "CTO", image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=60&h=60&fit=crop&crop=face" },
      { name: "Dimitris Ioannou", role: "Head of Development", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" }
    ],
    testimonials: [
      { 
        author: "Sofia Georgiou", 
        role: "Software Developer", 
        content: "Great company culture with excellent learning opportunities. The team is supportive and the technology stack is modern.",
        rating: 5
      },
      {
        author: "Michalis Petrou",
        role: "Implementation Engineer", 
        content: "Professional growth opportunities are outstanding. Management is very supportive of career development.",
        rating: 5
      }
    ],
    recentNews: [
      {
        title: "Prognosys Expands Regulatory Solutions",
        date: "2024-01-20",
        summary: "New compliance modules launched for European financial institutions"
      },
      {
        title: "ISO 27001 Certification Achieved",
        date: "2024-01-15", 
        summary: "Enhanced security standards for financial data protection"
      }
    ],
    description: "Prognosys Solutions helps Financial Institutions automate, simplify and streamline Regulatory Compliance, Financial, Tax and Risk Reporting. With over 20 years of experience, we provide comprehensive solutions that ensure compliance with evolving regulatory requirements while improving operational efficiency."
  },
  
  {
    id: "adtech-holding",
    name: "AdTech Holding",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&h=80&fit=crop&crop=center",
    tagline: "Innovation hub for AdTech & MarTech ecosystem",
    location: "Limassol, Cyprus", 
    employees: "500+",
    industry: "AdTech & MarTech",
    workType: "Hybrid",
    rating: 4.8,
    reviewCount: 312,
    openJobs: 15,
    subscriptionTier: "premium" as SubscriptionTier,
    founded: "2011",
    website: "https://adtechholding.com",
    specialties: ["Predictive Targeting AI", "Fraud Prevention", "Machine Learning", "Big Data Analysis", "Programmatic Media"],
    techStack: ["Python", "JavaScript", "React", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    companySize: "Large",
    benefits: [
      "Health Insurance coverage",
      "Office lunch provided",
      "Personal development budget",
      "Hybrid work flexibility", 
      "Conference attendance support",
      "Free language courses",
      "5 extra vacation days",
      "Corporate events and parties",
      "Modern tech equipment",
      "Relocation assistance"
    ],
    culture: {
      workLifeBalance: 4.7,
      compensation: 4.9,
      careerGrowth: 4.8,
      management: 4.6,
      diversity: 4.7
    },
    teamMembers: [
      { name: "Dmitry Starostin", role: "CEO", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" },
      { name: "Elena Vishnevskaya", role: "CTO", image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=60&h=60&fit=crop&crop=face" },
      { name: "Alexander Petrov", role: "Head of AI", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" }
    ],
    testimonials: [
      { 
        author: "Anna Kowalski", 
        role: "Machine Learning Engineer", 
        content: "Innovative company with cutting-edge technology. Great opportunities for professional growth in AdTech.",
        rating: 5
      },
      {
        author: "Pavel Novak",
        role: "Data Scientist", 
        content: "Excellent work-life balance and supportive team environment. The projects are challenging and rewarding.",
        rating: 5
      }
    ],
    recentNews: [
      {
        title: "AdTech Holding Launches New AI Platform",
        date: "2024-02-01",
        summary: "Revolutionary predictive targeting solution for programmatic advertising"
      },
      {
        title: "Expansion to European Markets",
        date: "2024-01-25", 
        summary: "Opening new offices in Berlin and Amsterdam to serve European clients"
      }
    ],
    description: "AdTech Holding is an innovation hub that creates startup ecosystems and cutting-edge technologies for AdTech & MarTech projects. With over 500 experts and multiple successful brands including PropellerAds, Notix, and Remoby, we're at the forefront of digital advertising innovation."
  },

  // PROFESSIONAL TIER - Mid-tier customers  
  {
    id: "3cx-ltd",
    name: "3CX Ltd",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=80&h=80&fit=crop&crop=center",
    tagline: "Business VOIP solutions for modern communication",
    location: "Cyprus",
    employees: "200-500", 
    industry: "Telecommunications",
    workType: "Hybrid",
    rating: 4.5,
    reviewCount: 156,
    openJobs: 8,
    subscriptionTier: "professional" as SubscriptionTier,
    founded: "2005",
    website: "https://3cx.com",
    specialties: ["VOIP Solutions", "Business Communications", "PBX Systems", "Cloud Telephony"],
    companySize: "Medium",
    benefits: [
      "Competitive salary package",
      "Health insurance",
      "Remote work options",
      "Professional development",
      "Flexible working hours",
      "Team building events"
    ],
    culture: {
      workLifeBalance: 4.4,
      compensation: 4.3,
      careerGrowth: 4.6,
      management: 4.2,
      diversity: 4.3
    },
    description: "3CX is a leading developer of open standards communications solutions that replace proprietary PBX systems. We serve over 25,000 channel partners worldwide with innovative VOIP technology."
  },

  {
    id: "advent-digital",
    name: "Advent Digital",
    logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=80&h=80&fit=crop&crop=center", 
    tagline: "Digital consulting and product development",
    location: "Cyprus",
    employees: "50-100",
    industry: "Digital Consulting",
    workType: "Remote",
    rating: 4.6,
    reviewCount: 78,
    openJobs: 5,
    subscriptionTier: "professional" as SubscriptionTier,
    founded: "2018",
    website: "https://advent.digital",
    specialties: ["Product Development", "Software Development", "Data Analytics", "Digital Strategy"],
    companySize: "Small",
    benefits: [
      "Remote-first culture",
      "Flexible working hours",
      "Professional development budget",
      "Health benefits",
      "Project diversity",
      "Innovation time"
    ],
    culture: {
      workLifeBalance: 4.7,
      compensation: 4.4,
      careerGrowth: 4.5,
      management: 4.3,
      diversity: 4.6
    },
    description: "Advent Digital is a niche digital consultancy specializing in product development and innovative software solutions. We help businesses transform through cutting-edge technology and data-driven insights."
  },

  // FREE TIER - Recently registered companies
  {
    id: "0100-ventures",
    name: "0100 Ventures",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=80&h=80&fit=crop&crop=center",
    tagline: "Venture builder fostering startup ecosystems", 
    location: "Slovakia / Cyprus",
    employees: "100-200",
    industry: "Venture Capital",
    workType: "Hybrid",
    rating: 4.4,
    reviewCount: 67,
    openJobs: 3,
    subscriptionTier: "free" as SubscriptionTier,
    founded: "2014",
    website: "https://0100ventures.com",
    specialties: ["Startup Building", "Venture Capital", "Innovation Consulting", "Ecosystem Development"],
    companySize: "Medium",
    benefits: [
      "Startup environment",
      "Learning opportunities",
      "International exposure",
      "Flexible work arrangements",
      "Conference attendance"
    ],
    culture: {
      workLifeBalance: 4.3,
      compensation: 4.1,
      careerGrowth: 4.6,
      management: 4.2,
      diversity: 4.5
    },
    description: "0100 Ventures is a venture builder helping create and support awesome companies while fostering local and international talent. We're building the startup ecosystem in Central Europe."
  },

  {
    id: "aleph-holding",
    name: "Aleph Holding",
    logo: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=80&h=80&fit=crop&crop=center",
    tagline: "Global digital advertising and technology solutions",
    location: "Dubai, UAE / Cyprus", 
    employees: "1000+",
    industry: "Digital Advertising",
    workType: "Remote",
    rating: 4.3,
    reviewCount: 245,
    openJobs: 12,
    subscriptionTier: "free" as SubscriptionTier,
    founded: "2005",
    website: "https://alephholding.com",
    specialties: ["Digital Advertising", "Technology Platforms", "Cross-border Payments", "Market Expansion"],
    companySize: "Large",
    benefits: [
      "Global opportunities",
      "Remote work flexibility",
      "International team",
      "Professional development",
      "Diverse projects"
    ],
    culture: {
      workLifeBalance: 4.2,
      compensation: 4.4,
      careerGrowth: 4.1,
      management: 4.0,
      diversity: 4.7
    },
    description: "Aleph Holding is a global network of digital experts connecting 26,000+ advertisers across 130+ countries. We provide comprehensive digital advertising solutions and technology platforms for global market expansion."
  },

  {
    id: "adsterra",
    name: "Adsterra",
    logo: "https://images.unsplash.com/photo-1560472355-109703aa3edc?w=80&h=80&fit=crop&crop=center",
    tagline: "Global advertising network trusted worldwide",
    location: "Cyprus", 
    employees: "200-500",
    industry: "Digital Advertising",
    workType: "Remote",
    rating: 4.2,
    reviewCount: 189,
    openJobs: 6,
    subscriptionTier: "free" as SubscriptionTier,
    founded: "2013",
    website: "https://adsterra.com",
    specialties: ["Advertising Network", "Publisher Solutions", "Advertiser Services", "Performance Marketing"],
    companySize: "Medium",
    benefits: [
      "Remote work culture",
      "Performance bonuses",
      "Flexible schedule",
      "Professional growth",
      "International team"
    ],
    culture: {
      workLifeBalance: 4.1,
      compensation: 4.2,
      careerGrowth: 4.0,
      management: 3.9,
      diversity: 4.3
    },
    description: "Adsterra is a global advertising network trusted by 30,000+ advertisers and publishers worldwide. We provide comprehensive solutions for both advertisers looking to reach their target audience and publishers monetizing their traffic."
  }
]

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

// Companies Hero Section
function CompaniesHero({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const totalCompanies = companiesData.length
  const premiumCount = companiesData.filter(c => c.subscriptionTier === 'premium').length
  const professionalCount = companiesData.filter(c => c.subscriptionTier === 'professional').length

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleQuickFilter = (filterType: string) => {
    const filterMap: { [key: string]: string } = {
      'Premium Partners': 'premium',
      'Remote-First': 'remote',
      'Hybrid Work': 'hybrid',
      'Startup Culture': 'startup',
      'High Compensation': 'high compensation'
    }
    onSearch(filterMap[filterType] || filterType)
  }

  return (
    <section className="relative min-h-[70vh] flex items-center pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/20 border-2 border-blue-400/40 rounded-full mb-10 backdrop-blur-sm shadow-lg">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            <span className="text-sm text-blue-100 font-bold tracking-wide">⚡ COMPANY DIRECTORY</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8 leading-none">
            <span className="text-white block drop-shadow-2xl">Discover your next</span>
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block drop-shadow-2xl pb-2">
              dream company
            </span>
          </h1>
          
          <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12 font-medium">
            ⚡ Explore {totalCompanies}+ innovative companies. From cutting-edge startups to industry leaders, 
            find the perfect culture and opportunities that match your career goals.
          </p>

          {/* Company Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            <div className="p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <div className="text-3xl font-black text-blue-400 mb-2">{totalCompanies}+</div>
              <div className="text-white/80 font-medium text-sm">Total Companies</div>
            </div>
            <div className="p-6 bg-black/40 backdrop-blur-md border-2 border-yellow-400/40 rounded-2xl shadow-xl">
              <div className="text-3xl font-black text-yellow-400 mb-2">{premiumCount}</div>
              <div className="text-white/80 font-medium text-sm">Premium Partners</div>
            </div>
            <div className="p-6 bg-black/40 backdrop-blur-md border-2 border-blue-400/40 rounded-2xl shadow-xl">
              <div className="text-3xl font-black text-blue-400 mb-2">{professionalCount}</div>
              <div className="text-white/80 font-medium text-sm">Verified Companies</div>
            </div>
            <div className="p-6 bg-black/40 backdrop-blur-md border-2 border-green-400/40 rounded-2xl shadow-xl">
              <div className="text-3xl font-black text-green-400 mb-2">
                {companiesData.reduce((sum, c) => sum + c.openJobs, 0)}+
              </div>
              <div className="text-white/80 font-medium text-sm">Open Positions</div>
            </div>
          </div>
          
          {/* Advanced Search Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-white/60" />
              </div>
              <input
                type="text"
                placeholder="Search companies by name, location, industry, benefits, or work type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-16 pl-16 pr-32 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-white/60 text-lg font-medium focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30"
              />
              <button 
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 h-16 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => handleQuickFilter('Premium Partners')}
                className="px-4 py-2 text-sm text-white/80 border-2 border-white/30 rounded-lg hover:border-white/60 hover:text-white transition-all font-semibold backdrop-blur-sm bg-white/5"
              >
                <Crown className="w-4 h-4 inline mr-2" />
                Premium Partners
              </button>
              <button 
                onClick={() => handleQuickFilter('Remote-First')}
                className="px-4 py-2 text-sm text-white/80 border-2 border-white/30 rounded-lg hover:border-white/60 hover:text-white transition-all font-semibold backdrop-blur-sm bg-white/5"
              >
                <Laptop className="w-4 h-4 inline mr-2" />
                Remote-First
              </button>
              <button 
                onClick={() => handleQuickFilter('Hybrid Work')}
                className="px-4 py-2 text-sm text-white/80 border-2 border-white/30 rounded-lg hover:border-white/60 hover:text-white transition-all font-semibold backdrop-blur-sm bg-white/5"
              >
                <Home className="w-4 h-4 inline mr-2" />
                Hybrid Work
              </button>
              <button 
                onClick={() => handleQuickFilter('Startup Culture')}
                className="px-4 py-2 text-sm text-white/80 border-2 border-white/30 rounded-lg hover:border-white/60 hover:text-white transition-all font-semibold backdrop-blur-sm bg-white/5"
              >
                <Briefcase className="w-4 h-4 inline mr-2" />
                Startup Culture
              </button>
              <button 
                onClick={() => handleQuickFilter('High Compensation')}
                className="px-4 py-2 text-sm text-white/80 border-2 border-white/30 rounded-lg hover:border-white/60 hover:text-white transition-all font-semibold backdrop-blur-sm bg-white/5"
              >
                <DollarSign className="w-4 h-4 inline mr-2" />
                High Compensation
              </button>
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
  companies: typeof companiesData
}) {
  return (
    <section className="py-8 bg-black/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
              className="h-12 px-4 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-xl text-white font-medium focus:outline-none focus:border-blue-400/60"
            >
              <option value="" className="bg-black">All Industries</option>
              <option value="RegTech" className="bg-black">RegTech (Regulatory Technology)</option>
              <option value="AdTech" className="bg-black">AdTech & MarTech</option>
              <option value="Telecommunications" className="bg-black">Telecommunications</option>
              <option value="Digital Consulting" className="bg-black">Digital Consulting</option>
              <option value="Venture Capital" className="bg-black">Venture Capital</option>
              <option value="Digital Advertising" className="bg-black">Digital Advertising</option>
            </select>
            
            {/* Company Size Filter */}
            <select 
              value={filters.size}
              onChange={(e) => onFilterChange('size', e.target.value)}
              className="h-12 px-4 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-xl text-white font-medium focus:outline-none focus:border-blue-400/60"
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
              className="h-12 px-4 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-xl text-white font-medium focus:outline-none focus:border-blue-400/60"
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
              className="h-12 px-4 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-xl text-white font-medium focus:outline-none focus:border-blue-400/60"
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
      </div>
    </section>
  )
}

// Premium Company Card
function PremiumCompanyCard({ company }: { company: typeof companiesData[0] }) {
  const tierStyling = getTierStyling(company.subscriptionTier)
  const BadgeIcon = tierStyling.badgeIcon

  return (
    <div className={`group relative p-8 bg-black/50 backdrop-blur-md border-2 ${tierStyling.borderClass} rounded-3xl shadow-2xl hover:bg-black/60 transition-all cursor-pointer`}>
      {/* Premium Badge */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className={`inline-flex items-center gap-2 px-4 py-2 ${tierStyling.badgeClass} text-white rounded-full text-sm font-bold shadow-lg`}>
          <BadgeIcon className="w-4 h-4" />
          {tierStyling.badgeText}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start mt-4">
        
        {/* Company Info */}
        <div className="lg:col-span-2">
          <div className="flex items-start gap-6 mb-6">
            {/* Company Logo */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 border-2 border-white/20">
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Company Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2 leading-none pb-1 group-hover:text-blue-200 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-white/80 font-medium text-xl leading-none pb-1 mb-2">
                    {company.tagline}
                  </p>
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-bold text-lg">{company.rating}</span>
                    <span className="text-white/60 text-sm">({company.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="flex items-center gap-2 text-white/70">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium text-sm">{company.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">{company.employees} employees</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium text-sm">{company.industry}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium text-sm">{company.workType}</span>
                </div>
              </div>
              
              <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                {company.description}
              </p>
              
              {/* Tech Stack for Premium */}
              {company.subscriptionTier === 'premium' && company.techStack && (
                <div className="mb-6">
                  <h4 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {company.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-600/20 border border-purple-400/40 rounded-lg text-purple-200 font-medium text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-6">
                {company.specialties.map((specialty, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-600/20 border border-blue-400/40 rounded-lg text-blue-200 font-medium text-sm">
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Team Members for Premium */}
              {company.subscriptionTier === 'premium' && company.teamMembers && (
                <div className="mb-6">
                  <h4 className="text-white font-bold text-lg mb-3">Leadership Team</h4>
                  <div className="flex gap-4">
                    {company.teamMembers.map((member, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-black/40 border border-white/20 rounded-lg">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-white font-medium text-sm">{member.name}</div>
                          <div className="text-white/60 text-xs">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Company Stats & Actions */}
        <div className="space-y-6">
          
          {/* Culture Ratings */}
          <div className="p-6 bg-black/40 border-2 border-white/20 rounded-2xl">
            <h4 className="text-white font-bold text-lg mb-4">Culture Ratings</h4>
            <div className="space-y-3">
              {Object.entries(company.culture).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-white/80 font-medium text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(value) ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-blue-400 font-bold text-xs">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="p-6 bg-black/40 border-2 border-white/20 rounded-2xl">
            <h4 className="text-white font-bold text-lg mb-4">Benefits & Perks</h4>
            <div className="space-y-2">
              {company.benefits.slice(0, company.subscriptionTier === 'premium' ? 6 : 4).map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-white/80 text-sm font-medium">{benefit}</span>
                </div>
              ))}
              {company.benefits.length > (company.subscriptionTier === 'premium' ? 6 : 4) && (
                <div className="text-blue-400 text-sm font-medium">
                  +{company.benefits.length - (company.subscriptionTier === 'premium' ? 6 : 4)} more benefits
                </div>
              )}
            </div>
          </div>

          {/* Employee Testimonials for Premium */}
          {company.subscriptionTier === 'premium' && company.testimonials && (
            <div className="p-6 bg-black/40 border-2 border-white/20 rounded-2xl">
              <h4 className="text-white font-bold text-lg mb-4">Employee Reviews</h4>
              <div className="space-y-4">
                {company.testimonials.slice(0, 2).map((testimonial, i) => (
                  <div key={i} className="p-4 bg-black/50 border border-white/20 rounded-lg">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-white/80 text-sm italic mb-2">"{testimonial.content}"</p>
                    <div className="text-blue-400 text-xs font-medium">
                      {testimonial.author} - {testimonial.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link href={`/companies/${company.id}`}>
              <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4" />
                View Jobs ({company.openJobs})
              </button>
            </Link>
            <Link href={`/companies/${company.id}/profile`}>
              <button className="w-full h-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                {company.subscriptionTier === 'premium' ? 'Full Profile & Videos' : 'View Profile'}
              </button>
            </Link>
            {company.subscriptionTier === 'premium' && (
              <button className="w-full h-12 bg-red-600/20 hover:bg-red-600/30 text-red-300 border-2 border-red-400/40 rounded-xl font-bold transition-all backdrop-blur-md flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Follow Company
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Standard Company Card (Professional/Free)
function StandardCompanyCard({ company }: { company: typeof companiesData[0] }) {
  const tierStyling = getTierStyling(company.subscriptionTier)
  const BadgeIcon = tierStyling.badgeIcon

  return (
    <div className={`group p-6 bg-black/50 backdrop-blur-md border-2 ${tierStyling.borderClass} rounded-2xl shadow-xl hover:bg-black/60 transition-all cursor-pointer`}>
      
      {/* Tier Badge */}
      {company.subscriptionTier !== 'free' && (
        <div className="flex justify-end mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 ${tierStyling.badgeClass} text-white rounded-full text-xs font-bold`}>
            <BadgeIcon className="w-3 h-3" />
            {tierStyling.badgeText}
          </div>
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        {/* Company Logo */}
        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0 border border-white/20">
          <img 
            src={company.logo} 
            alt={`${company.name} logo`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Company Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-black text-white mb-1 leading-none pb-1 group-hover:text-blue-200 transition-colors">
                {company.name}
              </h3>
              <p className="text-white/80 font-medium text-base leading-none pb-1">
                {company.tagline}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white font-bold text-sm">{company.rating}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <div className="flex items-center gap-1 text-white/70">
              <MapPin className="w-3 h-3" />
              <span className="font-medium text-xs">{company.location}</span>
            </div>
            <div className="flex items-center gap-1 text-white/70">
              <Users className="w-3 h-3" />
              <span className="font-medium text-xs">{company.employees}</span>
            </div>
            <div className="flex items-center gap-1 text-white/70">
              <Globe className="w-3 h-3" />
              <span className="font-medium text-xs">{company.workType}</span>
            </div>
          </div>
          
          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mb-4">
            {company.specialties.slice(0, 3).map((specialty, i) => (
              <span key={i} className="px-2 py-1 bg-blue-600/20 border border-blue-400/40 rounded text-blue-200 font-medium text-xs">
                {specialty}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/companies/${company.id}`}>
              <button className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg flex items-center gap-2">
                <Briefcase className="w-3 h-3" />
                Jobs ({company.openJobs})
              </button>
            </Link>
            <Link href={`/companies/${company.id}/profile`}>
              <button className="h-10 px-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-lg font-bold text-sm transition-all backdrop-blur-md">
                View Profile
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Companies Listing
function CompaniesListing({ companies, loading }: { 
  companies: typeof companiesData, 
  loading: boolean 
}) {
  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-white font-black text-2xl mb-4">⚡ Searching Neural Networks</h3>
            <p className="text-white/80 text-lg">Finding the perfect companies for you...</p>
          </div>
        </div>
      </section>
    )
  }

  if (companies.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white/60" />
            </div>
            <h3 className="text-white font-black text-2xl mb-4">No companies found</h3>
            <p className="text-white/70 mb-8">
              Try adjusting your search criteria or filters
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-2xl"
            >
              Show All Companies
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Sort companies by subscription tier: premium -> professional -> free
  const sortedCompanies = [...companies].sort((a, b) => {
    const tierOrder = { premium: 0, professional: 1, free: 2 }
    return tierOrder[a.subscriptionTier] - tierOrder[b.subscriptionTier]
  })

  const premiumCompanies = sortedCompanies.filter(company => company.subscriptionTier === 'premium')
  const professionalCompanies = sortedCompanies.filter(company => company.subscriptionTier === 'professional')
  const freeCompanies = sortedCompanies.filter(company => company.subscriptionTier === 'free')

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="space-y-8">
          
          {/* Premium Companies */}
          {premiumCompanies.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h2 className="text-3xl font-black text-white">Premium Partners</h2>
                <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/40 rounded-full text-yellow-200 text-sm font-bold">
                  Featured Companies
                </div>
              </div>
              <div className="space-y-8">
                {premiumCompanies.map(company => (
                  <PremiumCompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}

          {/* Professional Companies */}
          {professionalCompanies.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-black text-white">Verified Companies</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {professionalCompanies.map(company => (
                  <StandardCompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}

          {/* Free Tier Companies */}
          {freeCompanies.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-gray-400" />
                <h2 className="text-2xl font-black text-white">Recently Listed</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freeCompanies.map(company => (
                  <StandardCompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold text-xl transition-all backdrop-blur-md flex items-center gap-3 mx-auto">
            Load More Companies
            <TrendingUp className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default function CompaniesPage() {
  const [companies, setCompanies] = React.useState(companiesData)
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [filters, setFilters] = React.useState({
    industry: '',
    size: '',
    workType: '',
    location: ''
  })

  const handleSearch = async (query: string) => {
    setLoading(true)
    setSearchQuery(query)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const filtered = companiesData.filter(company => 
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.tagline.toLowerCase().includes(query.toLowerCase()) ||
      company.industry.toLowerCase().includes(query.toLowerCase()) ||
      company.location.toLowerCase().includes(query.toLowerCase()) ||
      company.description.toLowerCase().includes(query.toLowerCase()) ||
      company.specialties.some(spec => spec.toLowerCase().includes(query.toLowerCase()))
    )
    setCompanies(filtered)
    setLoading(false)
  }

  const handleFilterChange = async (filterType: string, value: string) => {
    setLoading(true)
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let filtered = companiesData.filter(company => {
      const searchMatch = !searchQuery || 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const industryMatch = !newFilters.industry || company.industry.toLowerCase().includes(newFilters.industry.toLowerCase())
      const sizeMatch = !newFilters.size || company.companySize?.toLowerCase() === newFilters.size.toLowerCase()
      const workTypeMatch = !newFilters.workType || company.workType.toLowerCase() === newFilters.workType.toLowerCase()
      const locationMatch = !newFilters.location || company.location.toLowerCase().includes(newFilters.location.toLowerCase())
      
      return searchMatch && industryMatch && sizeMatch && workTypeMatch && locationMatch
    })
    
    // Sort by subscription tier: premium -> professional -> free
    filtered.sort((a, b) => {
      const tierOrder = { premium: 0, professional: 1, free: 2 }
      return tierOrder[a.subscriptionTier] - tierOrder[b.subscriptionTier]
    })
    
    setCompanies(filtered)
    setLoading(false)
  }

  return (
    <NeuronicLayout variant="intense" className="overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Navigation */}
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
                <Link href="/jobs" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Jobs
                </Link>
                <Link href="/companies" className="text-white transition-colors font-bold text-[16px] border-b-2 border-blue-400">
                  Companies
                </Link>
              </nav>
              
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="h-12 px-6 flex items-center text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Sign in
                </Link>
                <Link href="/auth/signup">
                  <button className="h-12 px-8 bg-white text-black rounded-xl font-black text-[16px] hover:bg-gray-100 transition-all shadow-lg">
                    Get started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <CompaniesHero onSearch={handleSearch} />
          <AdvancedFilters onFilterChange={handleFilterChange} filters={filters} companies={companies} />
          <CompaniesListing companies={companies} loading={loading} />
        </main>
      </div>
    </NeuronicLayout>
  )
}