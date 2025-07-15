import React from 'react'
import Link from 'next/link'
import { 
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Eye,
  Heart,
  Share2,
  Briefcase,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  Brain,
  Zap
} from 'lucide-react'
import NeuronicLayout from '../../../components/layout/NeuronicLayout'

// Sample company data
const companyData = {
  id: "techcorp-inc",
  name: "TechCorp Inc.",
  logo: "/api/placeholder/120/120",
  coverImage: "/api/placeholder/1200/400",
  tagline: "Building the future of artificial intelligence",
  description: "TechCorp is a leading AI technology company focused on developing cutting-edge machine learning solutions that transform industries. We're passionate about creating intelligent systems that enhance human capabilities and solve complex global challenges.",
  founded: "2018",
  employees: "500-1000",
  headquarters: "San Francisco, CA",
  website: "https://techcorp.ai",
  industry: "Artificial Intelligence",
  specialties: ["Machine Learning", "Deep Learning", "Computer Vision", "Natural Language Processing"],
  rating: 4.8,
  reviewCount: 234,
  culture: {
    workLifeBalance: 4.7,
    compensation: 4.5,
    careerGrowth: 4.6,
    management: 4.4,
    diversity: 4.8
  },
  stats: {
    openJobs: 23,
    profileViews: "12.5K",
    followers: "3.2K"
  },
  benefits: [
    "Comprehensive health insurance",
    "Flexible working hours",
    "Remote work options",
    "Professional development budget",
    "Stock options",
    "Unlimited PTO",
    "Free meals and snacks",
    "Gym membership",
    "Mental health support",
    "Parental leave"
  ],
  values: [
    "Innovation-driven culture",
    "Diversity and inclusion",
    "Work-life balance",
    "Continuous learning",
    "Environmental responsibility"
  ],
  recentNews: [
    {
      title: "TechCorp Raises $50M Series B Funding",
      date: "2024-01-15",
      summary: "Funding will accelerate AI research and product development"
    },
    {
      title: "Named 'Best AI Company' by Tech Magazine",
      date: "2023-12-10", 
      summary: "Recognition for breakthrough innovations in machine learning"
    },
    {
      title: "Launches New Computer Vision Platform",
      date: "2023-11-20",
      summary: "Revolutionary platform for image and video analysis"
    }
  ]
}

// Company Header Section
function CompanyHeader() {
  return (
    <section className="relative">
      {/* Cover Image */}
      <div className="h-64 lg:h-80 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
              {/* Company Logo */}
              <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white/20">
                <Building2 className="w-16 h-16 text-blue-600" />
              </div>
              
              {/* Company Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white mb-2 leading-none pb-2">
                      {companyData.name}
                    </h1>
                    <p className="text-xl text-white/90 font-medium mb-4 leading-none pb-2">
                      {companyData.tagline}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-white/80">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{companyData.headquarters}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{companyData.employees} employees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Founded {companyData.founded}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="h-12 px-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Follow
                    </button>
                    <button className="h-12 px-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <Link href={`/companies/${companyData.id}/jobs`}>
                      <button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        View Jobs ({companyData.stats.openJobs})
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Company Stats Section
function CompanyStats() {
  return (
    <section className="py-8 bg-black/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
            <div className="text-3xl font-black text-blue-400 mb-2">{companyData.stats.openJobs}</div>
            <div className="text-white/80 font-medium text-sm">Open Positions</div>
          </div>
          <div className="text-center p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
            <div className="text-3xl font-black text-blue-400 mb-2">{companyData.stats.profileViews}</div>
            <div className="text-white/80 font-medium text-sm">Profile Views</div>
          </div>
          <div className="text-center p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
            <div className="text-3xl font-black text-blue-400 mb-2">{companyData.stats.followers}</div>
            <div className="text-white/80 font-medium text-sm">Followers</div>
          </div>
          <div className="text-center p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <div className="text-3xl font-black text-blue-400">{companyData.rating}</div>
            </div>
            <div className="text-white/80 font-medium text-sm">{companyData.reviewCount} Reviews</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Company Overview Section
function CompanyOverview() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <div className="p-8 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black text-white mb-6 leading-none pb-2">About TechCorp</h2>
              <p className="text-white/80 text-lg leading-relaxed font-medium mb-6">
                {companyData.description}
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {companyData.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-4 py-2 bg-blue-600/20 border border-blue-400/40 rounded-lg text-blue-200 font-medium text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Culture & Values */}
            <div className="p-8 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black text-white mb-6 leading-none pb-2">Culture & Values</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Our Values</h3>
                  <div className="space-y-3">
                    {companyData.values.map((value, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-white/80 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Ratings</h3>
                  <div className="space-y-3">
                    {Object.entries(companyData.culture).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-white/80 font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(value) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-blue-400 font-bold text-sm">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent News */}
            <div className="p-8 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black text-white mb-6 leading-none pb-2">Recent News</h2>
              <div className="space-y-4">
                {companyData.recentNews.map((news, idx) => (
                  <div key={idx} className="p-6 bg-black/50 border border-white/20 rounded-2xl">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-bold text-white">{news.title}</h3>
                      <span className="text-white/60 text-sm font-medium">{news.date}</span>
                    </div>
                    <p className="text-white/80 font-medium">{news.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Company Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <a href={companyData.website} className="text-blue-400 hover:text-blue-300 font-medium">
                    Visit Website
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80 font-medium">{companyData.industry}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80 font-medium">Founded {companyData.founded}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80 font-medium">{companyData.employees} employees</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Benefits & Perks</h3>
              <div className="space-y-2">
                {companyData.benefits.slice(0, 6).map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-white/80 text-sm font-medium">{benefit}</span>
                  </div>
                ))}
                {companyData.benefits.length > 6 && (
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    +{companyData.benefits.length - 6} more benefits
                  </button>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-400/40 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Interested in TechCorp?</h3>
              <div className="space-y-3">
                <Link href={`/companies/${companyData.id}/jobs`}>
                  <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    View Open Positions
                  </button>
                </Link>
                <button className="w-full h-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  Follow Company
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function CompanyProfilePage() {
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
        <main className="pt-24">
          <CompanyHeader />
          <CompanyStats />
          <CompanyOverview />
        </main>
      </div>
    </NeuronicLayout>
  )
}