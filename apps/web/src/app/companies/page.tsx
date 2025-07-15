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

// Sample companies data with subscription tiers and comprehensive info
const companiesData = [
  // PREMIUM TIER - Highest paying customers
  {
    id: "techcorp-ai",
    name: "TechCorp AI",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=80&h=80&fit=crop&crop=center",
    tagline: "Building the future of artificial intelligence",
    location: "San Francisco, CA",
    employees: "1000+",
    industry: "Artificial Intelligence",
    workType: "Hybrid",
    rating: 4.9,
    reviewCount: 423,
    openJobs: 47,
    subscriptionTier: "premium" as SubscriptionTier,
    founded: "2018",
    website: "https://techcorp.ai",
    specialties: ["Machine Learning", "Deep Learning", "Computer Vision", "Natural Language Processing"],
    techStack: ["Python", "TensorFlow", "PyTorch", "Kubernetes", "AWS", "React", "TypeScript"],
    companySize: "Large",
    benefits: [
      "Comprehensive health, dental & vision insurance",
      "Unlimited PTO policy",
      "Stock options with high growth potential", 
      "Remote work flexibility",
      "Annual learning budget $5,000",
      "Free meals and premium snacks",
      "Gym membership and wellness stipend",
      "Parental leave 16 weeks paid",
      "Mental health support",
      "Latest tech equipment"
    ],
    culture: {
      workLifeBalance: 4.8,
      compensation: 4.9,
      careerGrowth: 4.7,
      management: 4.6,
      diversity: 4.8
    },
    teamMembers: [
      { name: "Sarah Chen", role: "CEO & Co-Founder", image: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=60&h=60&fit=crop&crop=face" },
      { name: "Marcus Rodriguez", role: "CTO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" },
      { name: "Emily Zhang", role: "Head of AI Research", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face" }
    ],
    testimonials: [
      { 
        author: "Alex Thompson", 
        role: "Senior ML Engineer", 
        content: "Best place I've ever worked. The team is brilliant and the technology challenges are fascinating.",
        rating: 5
      },
      {
        author: "Maria Garcia",
        role: "Product Manager", 
        content: "Incredible growth opportunities and work-life balance. Leadership truly cares about employees.",
        rating: 5
      }
    ],
    recentNews: [
      {
        title: "TechCorp AI Raises $100M Series C",
        date: "2024-01-15",
        summary: "Funding will accelerate AI research and global expansion"
      },
      {
        title: "Named 'Best AI Company 2024'",
        date: "2024-01-10", 
        summary: "Recognition for breakthrough innovations in machine learning"
      }
    ],
    description: "TechCorp AI is a leading artificial intelligence company focused on developing cutting-edge machine learning solutions that transform industries. We're passionate about creating intelligent systems that enhance human capabilities and solve complex global challenges. Our team of world-class researchers and engineers work on breakthrough technologies in computer vision, natural language processing, and autonomous systems."
  },
  
  {
    id: "quantum-innovations",
    name: "Quantum Innovations",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&h=80&fit=crop&crop=center",
    tagline: "Pioneering quantum computing for tomorrow",
    location: "Boston, MA", 
    employees: "500-1000",
    industry: "Quantum Computing",
    workType: "On-site",
    rating: 4.8,
    reviewCount: 287,
    openJobs: 31,
    subscriptionTier: "premium" as SubscriptionTier,
    founded: "2019",
    website: "https://quantuminnovations.com",
    specialties: ["Quantum Algorithms", "Quantum Hardware", "Quantum Software", "Research"],
    techStack: ["Qiskit", "Cirq", "Python", "C++", "MATLAB", "Docker", "Linux"],
    companySize: "Large",
    benefits: [
      "Premium health coverage",
      "Research sabbatical program", 
      "Patent bonus program",
      "Education reimbursement unlimited",
      "Relocation assistance",
      "Stock equity program",
      "Conference and training budget",
      "Flexible working hours"
    ],
    culture: {
      workLifeBalance: 4.7,
      compensation: 4.9,
      careerGrowth: 4.8,
      management: 4.5,
      diversity: 4.6
    },
    description: "Leading the quantum revolution with breakthrough computing technologies that solve previously impossible problems. Our researchers work on cutting-edge quantum algorithms and hardware."
  },

  // PROFESSIONAL TIER - Mid-tier customers  
  {
    id: "innovate-health",
    name: "Innovate Health",
    logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=80&h=80&fit=crop&crop=center",
    tagline: "Revolutionizing healthcare through technology",
    location: "Austin, TX",
    employees: "200-500", 
    industry: "Healthcare Technology",
    workType: "Hybrid",
    rating: 4.6,
    reviewCount: 189,
    openJobs: 22,
    subscriptionTier: "professional" as SubscriptionTier,
    founded: "2020",
    specialties: ["HealthTech", "Medical Devices", "Data Analytics", "Telemedicine"],
    companySize: "Medium",
    benefits: [
      "Health insurance",
      "Remote work options",
      "Professional development budget",
      "Flexible PTO",
      "Stock options",
      "Team building events"
    ],
    culture: {
      workLifeBalance: 4.5,
      compensation: 4.3,
      careerGrowth: 4.7,
      management: 4.2,
      diversity: 4.6
    },
    description: "We're transforming healthcare through innovative technology solutions that improve patient outcomes and streamline medical processes."
  },

  {
    id: "fintech-solutions",
    name: "FinTech Solutions",
    logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=80&h=80&fit=crop&crop=center", 
    tagline: "Democratizing financial services with AI",
    location: "New York, NY",
    employees: "300-500",
    industry: "Financial Technology",
    workType: "Remote",
    rating: 4.5,
    reviewCount: 156,
    openJobs: 18,
    subscriptionTier: "professional" as SubscriptionTier,
    founded: "2019",
    specialties: ["Blockchain", "Payment Systems", "Risk Analytics", "Mobile Banking"],
    companySize: "Medium",
    benefits: [
      "Competitive salary",
      "Remote-first culture",
      "Health benefits",
      "Learning stipend",
      "Equity participation"
    ],
    culture: {
      workLifeBalance: 4.4,
      compensation: 4.6,
      careerGrowth: 4.3,
      management: 4.1,
      diversity: 4.5
    },
    description: "Building the future of financial services through innovative blockchain and AI technologies."
  },

  // FREE TIER - Recently registered companies
  {
    id: "green-energy-startup",
    name: "Green Energy Startup",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=80&h=80&fit=crop&crop=center",
    tagline: "Sustainable energy for a better tomorrow", 
    location: "Portland, OR",
    employees: "50-100",
    industry: "Renewable Energy",
    workType: "Hybrid",
    rating: 4.2,
    reviewCount: 47,
    openJobs: 8,
    subscriptionTier: "free" as SubscriptionTier,
    founded: "2023",
    specialties: ["Solar Technology", "Wind Energy", "Energy Storage"],
    companySize: "Small",
    benefits: [
      "Basic health insurance",
      "Flexible hours",
      "Learning opportunities"
    ],
    culture: {
      workLifeBalance: 4.3,
      compensation: 3.8,
      careerGrowth: 4.1,
      management: 4.0,
      diversity: 4.4
    },
    description: "Early-stage company focused on sustainable energy solutions."
  },

  {
    id: "design-studio-co",
    name: "Design Studio Co",
    logo: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=80&h=80&fit=crop&crop=center",
    tagline: "Creative design solutions for digital world",
    location: "Seattle, WA", 
    employees: "20-50",
    industry: "Design & Creative",
    workType: "Remote",
    rating: 4.1,
    reviewCount: 23,
    openJobs: 5,
    subscriptionTier: "free" as SubscriptionTier,
    founded: "2023",
    specialties: ["UI/UX Design", "Branding", "Digital Marketing"],
    companySize: "Small",
    benefits: [
      "Creative freedom",
      "Remote work",
      "Project variety"
    ],
    culture: {
      workLifeBalance: 4.2,
      compensation: 3.6,
      careerGrowth: 3.9,
      management: 3.8,
      diversity: 4.2
    },
    description: "Small design studio specializing in digital brand experiences."
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
              <option value="Artificial Intelligence" className="bg-black">Artificial Intelligence</option>
              <option value="Healthcare Technology" className="bg-black">Healthcare Technology</option>
              <option value="Financial Technology" className="bg-black">Financial Technology</option>
              <option value="Quantum Computing" className="bg-black">Quantum Computing</option>
              <option value="Renewable Energy" className="bg-black">Renewable Energy</option>
              <option value="Design & Creative" className="bg-black">Design & Creative</option>
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
              <option value="San Francisco" className="bg-black">San Francisco, CA</option>
              <option value="New York" className="bg-black">New York, NY</option>
              <option value="Boston" className="bg-black">Boston, MA</option>
              <option value="Austin" className="bg-black">Austin, TX</option>
              <option value="Seattle" className="bg-black">Seattle, WA</option>
              <option value="Portland" className="bg-black">Portland, OR</option>
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