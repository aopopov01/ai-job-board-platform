'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Building2, 
  MapPin, 
  Users, 
  User,
  Globe, 
  Mail, 
  Phone,
  Calendar,
  Star,
  Briefcase,
  TrendingUp,
  Award,
  Coffee,
  Wifi,
  Car,
  Heart,
  GraduationCap,
  Target,
  Clock,
  DollarSign,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Image,
  Video,
  FileText,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Share2,
  Bookmark
} from 'lucide-react'
import NeuronicLayout from '../../../components/layout/NeuronicLayout'

interface CompanyProfile {
  id: string
  company_name: string
  company_description: string
  industry: string
  company_size: string
  company_website: string
  location: string
  founded_year: string
  logo_url?: string
  banner_url?: string
  mission?: string
  vision?: string
  values?: string[]
  benefits?: string[]
  culture?: string
  social_links?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  team_members?: Array<{
    name: string
    role: string
    bio: string
    image?: string
  }>
  office_photos?: string[]
  awards?: Array<{
    title: string
    year: string
    description: string
  }>
}

interface Job {
  id: string
  title: string
  department: string
  location: string
  job_type: string
  work_style: string
  salary_min?: number
  salary_max?: number
  salary_currency?: string
  created_at: string
  applications_count: number
  featured: boolean
}

export default function CompanyProfilePage() {
  const params = useParams()
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [error, setError] = useState('')

  // Mock data for demonstration
  const mockCompany: CompanyProfile = {
    id: '1',
    company_name: 'TechCorp Solutions',
    company_description: 'Leading technology company specializing in AI-driven solutions for enterprise clients. We build innovative products that transform how businesses operate in the digital age.',
    industry: 'Technology',
    company_size: '201-1000 employees',
    company_website: 'https://techcorp.com',
    location: 'San Francisco, CA',
    founded_year: '2018',
    logo_url: '/company-logo.png',
    banner_url: '/company-banner.jpg',
    mission: 'To empower businesses through innovative technology solutions that drive growth and efficiency.',
    vision: 'To be the global leader in AI-powered business transformation.',
    values: ['Innovation', 'Integrity', 'Collaboration', 'Excellence', 'Customer Success'],
    benefits: [
      'Comprehensive health, dental, and vision insurance',
      'Unlimited PTO and flexible work arrangements',
      '$5,000 annual learning and development budget',
      'Equity participation for all employees',
      'Top-tier equipment and home office setup',
      'Monthly wellness stipend',
      'Parental leave and family support',
      'Professional development opportunities'
    ],
    culture: 'Our culture is built on trust, innovation, and collaboration. We believe in empowering our team members to do their best work while maintaining a healthy work-life balance.',
    social_links: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp',
      facebook: 'https://facebook.com/techcorp',
      instagram: 'https://instagram.com/techcorp'
    },
    team_members: [
      {
        name: 'Sarah Johnson',
        role: 'CEO & Founder',
        bio: 'Former VP of Engineering at Google with 15+ years in tech leadership.',
        image: '/team-sarah.jpg'
      },
      {
        name: 'Michael Chen',
        role: 'CTO',
        bio: 'AI researcher and entrepreneur, previously led ML teams at Microsoft.',
        image: '/team-michael.jpg'
      },
      {
        name: 'Emily Rodriguez',
        role: 'Head of Product',
        bio: 'Product strategist with expertise in enterprise software and UX design.',
        image: '/team-emily.jpg'
      }
    ],
    office_photos: [
      '/office-1.jpg',
      '/office-2.jpg',
      '/office-3.jpg',
      '/office-4.jpg'
    ],
    awards: [
      {
        title: 'Best AI Startup 2023',
        year: '2023',
        description: 'Recognized by TechCrunch for innovation in AI solutions'
      },
      {
        title: 'Top Workplace Culture Award',
        year: '2022',
        description: 'Awarded by Bay Area Business Journal for exceptional workplace culture'
      }
    ]
  }

  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      job_type: 'full_time',
      work_style: 'hybrid',
      salary_min: 150000,
      salary_max: 200000,
      salary_currency: 'USD',
      created_at: '2024-01-15T10:00:00Z',
      applications_count: 67,
      featured: true
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'Remote',
      job_type: 'full_time',
      work_style: 'remote',
      salary_min: 120000,
      salary_max: 160000,
      salary_currency: 'USD',
      created_at: '2024-01-12T10:00:00Z',
      applications_count: 89,
      featured: false
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      job_type: 'full_time',
      work_style: 'hybrid',
      salary_min: 90000,
      salary_max: 130000,
      salary_currency: 'USD',
      created_at: '2024-01-10T10:00:00Z',
      applications_count: 45,
      featured: false
    },
    {
      id: '4',
      title: 'Data Scientist',
      department: 'Data',
      location: 'New York, NY',
      job_type: 'full_time',
      work_style: 'hybrid',
      salary_min: 130000,
      salary_max: 180000,
      salary_currency: 'USD',
      created_at: '2024-01-08T10:00:00Z',
      applications_count: 78,
      featured: true
    }
  ]

  useEffect(() => {
    const loadCompany = async () => {
      try {
        // In a real app, this would fetch from API
        setCompany(mockCompany)
        setJobs(mockJobs)
      } catch (error: any) {
        setError(error.message || 'Failed to load company profile')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadCompany()
    }
  }, [params.id])

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

  if (loading) {
    return (
      <NeuronicLayout variant="subtle">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">Loading Company Profile</h3>
            <p className="text-white/80">Getting all the details ready for you...</p>
          </div>
        </div>
      </NeuronicLayout>
    )
  }

  if (error || !company) {
    return (
      <NeuronicLayout variant="subtle">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-white/60" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Company Not Found</h2>
            <p className="text-white/80 mb-6">
              {error || 'This company profile may not exist or has been removed.'}
            </p>
            <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
              <Briefcase className="w-4 h-4" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </NeuronicLayout>
    )
  }

  return (
    <NeuronicLayout variant="subtle">
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative">
          {/* Banner */}
          <div className="h-64 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
          </div>

          {/* Company Info */}
          <div className="container mx-auto px-4 relative -mt-16 z-10">
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{company.company_name}</h1>
                      <div className="flex items-center gap-4 text-white/80 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {company.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {company.company_size}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Founded {company.founded_year}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        Follow
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-white/90 text-lg leading-relaxed mb-6">{company.company_description}</p>
                  
                  <div className="flex items-center gap-4">
                    <Link 
                      href={company.company_website} 
                      target="_blank"
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    
                    <div className="flex items-center gap-2">
                      {company.social_links?.linkedin && (
                        <Link href={company.social_links.linkedin} target="_blank" className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                          <Linkedin className="w-4 h-4" />
                        </Link>
                      )}
                      {company.social_links?.twitter && (
                        <Link href={company.social_links.twitter} target="_blank" className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                          <Twitter className="w-4 h-4" />
                        </Link>
                      )}
                      {company.social_links?.facebook && (
                        <Link href={company.social_links.facebook} target="_blank" className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                          <Facebook className="w-4 h-4" />
                        </Link>
                      )}
                      {company.social_links?.instagram && (
                        <Link href={company.social_links.instagram} target="_blank" className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                          <Instagram className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 py-8">
          <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-2 mb-8">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Building2 },
                { id: 'jobs', label: 'Open Positions', icon: Briefcase },
                { id: 'culture', label: 'Culture & Values', icon: Heart },
                { id: 'team', label: 'Team', icon: Users },
                { id: 'benefits', label: 'Benefits', icon: Award }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Mission & Vision */}
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
                    <p className="text-white/90 text-lg leading-relaxed mb-6">{company.mission}</p>
                    
                    <h3 className="text-xl font-semibold text-white mb-4">Our Vision</h3>
                    <p className="text-white/90 leading-relaxed">{company.vision}</p>
                  </div>

                  {/* Core Values */}
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Core Values</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {company.values?.map((value, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
                          <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center">
                            <Star className="w-5 h-5 text-emerald-400" />
                          </div>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Awards */}
                  {company.awards && company.awards.length > 0 && (
                    <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                      <h2 className="text-2xl font-bold text-white mb-6">Awards & Recognition</h2>
                      <div className="space-y-4">
                        {company.awards.map((award, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-white/10 rounded-lg">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                              <Award className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{award.title}</h3>
                              <p className="text-emerald-400 text-sm font-medium mb-2">{award.year}</p>
                              <p className="text-white/80 text-sm">{award.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Company Stats */}
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Company Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Industry</span>
                        <span className="text-white font-medium">{company.industry}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Company Size</span>
                        <span className="text-white font-medium">{company.company_size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Founded</span>
                        <span className="text-white font-medium">{company.founded_year}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Open Positions</span>
                        <span className="text-white font-medium">{jobs.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('jobs')}
                        className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                        <span className="text-white text-sm">View Open Positions</span>
                        <ArrowRight className="w-4 h-4 text-white/60 ml-auto" />
                      </button>
                      <Link href={company.company_website} target="_blank" className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm">Visit Website</span>
                        <ExternalLink className="w-4 h-4 text-white/60 ml-auto" />
                      </Link>
                      <button className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm">Contact Company</span>
                        <ArrowRight className="w-4 h-4 text-white/60 ml-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Open Positions</h2>
                  <div className="text-white/80">
                    {jobs.length} {jobs.length === 1 ? 'position' : 'positions'} available
                  </div>
                </div>

                <div className="grid gap-6">
                  {jobs.map((job) => (
                    <div key={job.id} className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6 hover:bg-white/30 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                            {job.featured && (
                              <span className="px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-white/80 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.department}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatJobType(job.work_style)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {getTimeAgo(job.created_at)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {job.salary_min && job.salary_max && (
                            <div className="text-lg font-semibold text-white mb-1">
                              ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                            </div>
                          )}
                          <div className="text-white/70 text-sm">
                            {job.applications_count} applications
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-sm">
                            {formatJobType(job.job_type)}
                          </span>
                          <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                            {formatJobType(job.work_style)}
                          </span>
                        </div>
                        
                        <Link 
                          href={`/jobs/${job.id}`} 
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Culture Tab */}
            {activeTab === 'culture' && (
              <div className="space-y-8">
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Our Culture</h2>
                  <p className="text-white/90 text-lg leading-relaxed">{company.culture}</p>
                </div>

                {/* Office Photos */}
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Office Life</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {company.office_photos?.map((photo, index) => (
                      <div key={index} className="aspect-video bg-white/10 rounded-lg flex items-center justify-center">
                        <Image className="w-12 h-12 text-white/60" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Values */}
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">What We Value</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {company.values?.map((value, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-white/10 rounded-lg">
                        <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white mb-2">{value}</h3>
                          <p className="text-white/80 text-sm">
                            This value drives everything we do, from how we build products to how we treat each other.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Meet Our Team</h2>
                  <p className="text-white/90 max-w-2xl mx-auto">
                    Get to know the talented individuals who make our company great.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {company.team_members?.map((member, index) => (
                    <div key={index} className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{member.name}</h3>
                      <p className="text-emerald-400 font-medium mb-3">{member.role}</p>
                      <p className="text-white/80 text-sm">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Benefits & Perks</h2>
                  <p className="text-white/90 max-w-2xl mx-auto">
                    We believe in taking care of our team members with comprehensive benefits and amazing perks.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {company.benefits?.map((benefit, index) => (
                    <div key={index} className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white/90 leading-relaxed">{benefit}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Perks Icons */}
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-white mb-6 text-center">Additional Perks</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Coffee className="w-6 h-6 text-blue-400" />
                      </div>
                      <p className="text-white/80 text-sm">Free Coffee & Snacks</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Wifi className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-white/80 text-sm">High-Speed Internet</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Car className="w-6 h-6 text-green-400" />
                      </div>
                      <p className="text-white/80 text-sm">Parking & Transit</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <GraduationCap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <p className="text-white/80 text-sm">Learning Budget</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </NeuronicLayout>
  )
}