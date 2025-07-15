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

// Company jobs mapping
const companyJobs: { [key: string]: any[] } = {
  'prognosys-solutions': [
    {
      id: '1',
      title: 'Implementation Engineer',
      description: 'Configure and test software solutions for financial institutions. Analyze requirements, conduct QA, and provide user training for regulatory compliance systems.',
      salary: '€35k - €45k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '3 days ago',
      applicants: 12,
      requirements: ['Computer Science degree', 'MS SQL database skills', 'English and Greek proficiency', 'Problem-solving abilities']
    },
    {
      id: '2', 
      title: 'Software Developer (Back-End)',
      description: 'Design and develop software products using VB.NET, C#, and SQL. Create stored procedures, REST & SOAP APIs, and enhance existing programs.',
      salary: '€40k - €55k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '5 days ago',
      applicants: 18,
      requirements: ['VB.NET/C# experience', 'SQL Server proficiency', 'API development', 'Unit testing knowledge']
    },
    {
      id: '14',
      title: 'Quality Assurance Engineer',
      description: 'Ensure software quality for financial compliance systems. Design and execute test cases, perform manual and automated testing.',
      salary: '€32k - €42k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '2 days ago',
      applicants: 16,
      requirements: ['QA experience', 'Test automation', 'Financial software knowledge', 'Attention to detail']
    }
  ],
  'adtech-holding': [
    {
      id: '3',
      title: 'Machine Learning Engineer',
      description: 'Develop and implement ML algorithms for advertising technology. Work with predictive targeting AI, fraud prevention systems, and big data analysis.',
      salary: '€50k - €70k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '1 week ago',
      applicants: 34,
      requirements: ['Python/ML libraries', 'Deep learning frameworks', 'Big data experience', 'AdTech knowledge']
    },
    {
      id: '4',
      title: 'Data Scientist - AdTech',
      description: 'Apply machine learning and statistical analysis to programmatic advertising data. Build predictive models for user behavior.',
      salary: '€45k - €65k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '4 days ago',
      applicants: 27,
      requirements: ['Statistics/Data Science', 'Machine learning', 'Programming skills', 'Analytical thinking']
    },
    {
      id: '10',
      title: 'DevOps Engineer - AdTech',
      description: 'Maintain and scale infrastructure for high-traffic advertising platforms. Work with Docker, Kubernetes, and cloud technologies.',
      salary: '€48k - €65k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '1 week ago',
      applicants: 31,
      requirements: ['Docker/Kubernetes', 'Cloud platforms', 'CI/CD pipelines', 'Monitoring tools']
    }
  ],
  '3cx-ltd': [
    {
      id: '5',
      title: 'Software Engineer - VOIP',
      description: 'Develop and maintain business communication solutions. Work on PBX systems, cloud telephony, and VOIP technologies.',
      salary: '€38k - €52k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '6 days ago',
      applicants: 15,
      requirements: ['Telecommunications protocols', 'Software development', 'VOIP experience', 'System architecture']
    },
    {
      id: '12',
      title: 'Sales Representative - VOIP Solutions',
      description: 'Promote and sell business communication solutions to enterprises. Develop client relationships and conduct product demonstrations.',
      salary: '€30k - €45k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '1 week ago',
      applicants: 24,
      requirements: ['Sales experience', 'Communication skills', 'Technical aptitude', 'Customer focus']
    }
  ],
  'advent-digital': [
    {
      id: '6',
      title: 'Full-Stack Developer',
      description: 'Build modern web applications using React, Node.js, and cloud technologies. Work on digital consulting projects for various clients.',
      salary: '€42k - €58k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '2 days ago',
      applicants: 22,
      requirements: ['React/Node.js', 'Full-stack development', 'Cloud technologies', 'Modern JavaScript']
    },
    {
      id: '11',
      title: 'Frontend Developer - React',
      description: 'Build responsive user interfaces for digital consulting projects. Work with modern frameworks including React, TypeScript, and modern CSS.',
      salary: '€35k - €48k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '4 days ago',
      applicants: 33,
      requirements: ['React expertise', 'TypeScript', 'Modern CSS', 'Responsive design']
    }
  ],
  'aleph-holding': [
    {
      id: '7',
      title: 'Product Manager - Digital Advertising',
      description: 'Lead product development for digital advertising platforms. Work with global teams across 130+ countries.',
      salary: '$60k - $80k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '1 week ago',
      applicants: 41,
      requirements: ['Product management', 'AdTech knowledge', 'Global experience', 'Analytical skills']
    },
    {
      id: '13',
      title: 'Marketing Manager - Global Campaigns',
      description: 'Lead marketing campaigns for global advertising technology company. Develop marketing strategies and manage digital campaigns.',
      salary: '$45k - $65k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '6 days ago',
      applicants: 37,
      requirements: ['Marketing experience', 'Campaign management', 'Digital marketing', 'International markets']
    }
  ],
  '0100-ventures': [
    {
      id: '8',
      title: 'Business Development Manager',
      description: 'Drive business growth for our venture capital and startup ecosystem. Work with entrepreneurs, investors, and corporate partners.',
      salary: '€35k - €50k',
      type: 'Full-time',
      workStyle: 'Hybrid',
      posted: '5 days ago',
      applicants: 19,
      requirements: ['Business development', 'Startup ecosystem', 'Networking skills', 'Strategic thinking']
    }
  ],
  'adsterra': [
    {
      id: '9',
      title: 'Account Manager - Publishers',
      description: 'Manage relationships with publishers in our global advertising network. Optimize revenue and provide technical support.',
      salary: '$35k - $45k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '3 days ago',
      applicants: 28,
      requirements: ['Account management', 'Publisher relations', 'Revenue optimization', 'Technical support']
    },
    {
      id: '15',
      title: 'Technical Support Specialist',
      description: 'Provide technical support for advertising network platform. Help advertisers and publishers resolve technical issues.',
      salary: '$25k - $35k',
      type: 'Full-time',
      workStyle: 'Remote',
      posted: '5 days ago',
      applicants: 21,
      requirements: ['Technical support', 'Problem solving', 'Customer service', 'AdTech knowledge']
    }
  ]
}

// Company data mapping
const companyDataMap: { [key: string]: any } = {
  'prognosys-solutions': {
    id: "prognosys-solutions",
    name: "Prognosys Solutions",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=120&fit=crop&crop=center",
    coverImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&h=400&fit=crop",
    tagline: "Regulatory Compliance Solutions for Financial Industry",
    description: "Prognosys Solutions helps Financial Institutions automate, simplify and streamline Regulatory Compliance, Financial, Tax and Risk Reporting. With over 20 years of experience, we provide comprehensive solutions that ensure compliance with evolving regulatory requirements while improving operational efficiency.",
    founded: "2004",
    employees: "50-100",
    headquarters: "Nicosia, Cyprus",
    website: "https://prognosys.com.cy",
    industry: "RegTech (Regulatory Technology)",
    specialties: ["Regulatory Compliance", "Financial Reporting", "Risk Management", "Tax Reporting"],
    rating: 4.7,
    reviewCount: 89,
    culture: {
      workLifeBalance: 4.6,
      compensation: 4.5,
      careerGrowth: 4.7,
      management: 4.4,
      diversity: 4.3
    },
    stats: {
      openJobs: 3,
      profileViews: "2.1K",
      followers: "856"
    },
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
    values: [
      "Innovation in RegTech",
      "Client-focused solutions",
      "Continuous learning",
      "Work-life balance",
      "Professional excellence"
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
    ]
  },
  'adtech-holding': {
    id: "adtech-holding",
    name: "AdTech Holding",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop&crop=center",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop",
    tagline: "Innovation hub for AdTech & MarTech ecosystem",
    description: "AdTech Holding is an innovation hub that creates startup ecosystems and cutting-edge technologies for AdTech & MarTech projects. With over 500 experts and multiple successful brands including PropellerAds, Notix, and Remoby, we're at the forefront of digital advertising innovation.",
    founded: "2011",
    employees: "500+",
    headquarters: "Limassol, Cyprus",
    website: "https://adtechholding.com",
    industry: "AdTech & MarTech",
    specialties: ["Predictive Targeting AI", "Fraud Prevention", "Machine Learning", "Big Data Analysis"],
    rating: 4.8,
    reviewCount: 312,
    culture: {
      workLifeBalance: 4.7,
      compensation: 4.9,
      careerGrowth: 4.8,
      management: 4.6,
      diversity: 4.7
    },
    stats: {
      openJobs: 15,
      profileViews: "8.7K",
      followers: "2.3K"
    },
    benefits: [
      "Health Insurance coverage",
      "Office lunch provided",
      "Personal development budget",
      "Hybrid work flexibility",
      "Conference attendance support",
      "Free language courses",
      "5 extra vacation days",
      "Corporate events and parties"
    ],
    values: [
      "Innovation-driven culture",
      "Data-driven decisions",
      "Global mindset",
      "Continuous learning",
      "Team collaboration"
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
    ]
  }
}

// Get company data by slug
function getCompanyData(slug: string) {
  return companyDataMap[slug] || companyDataMap['prognosys-solutions'] // Default fallback
}

// Get company jobs by slug
function getCompanyJobs(slug: string) {
  return companyJobs[slug] || []
}

// Company Header Section
function CompanyHeader({ companyData }: { companyData: any }) {
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
function CompanyStats({ companyData }: { companyData: any }) {
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
function CompanyOverview({ companyData, jobs }: { companyData: any, jobs: any[] }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <div className="p-8 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black text-white mb-6 leading-none pb-2">About {companyData.name}</h2>
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

            {/* Open Jobs */}
            <div className="p-8 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black text-white mb-6 leading-none pb-2">Open Positions ({jobs.length})</h2>
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job, idx) => (
                    <div key={idx} className="p-6 bg-black/50 border border-white/20 rounded-2xl hover:border-blue-400/40 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">{job.title}</h3>
                          <p className="text-white/80 font-medium mb-3">{job.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-600/20 border border-blue-400/40 rounded-full text-blue-200 text-sm font-medium">
                              {job.type}
                            </span>
                            <span className="px-3 py-1 bg-green-600/20 border border-green-400/40 rounded-full text-green-200 text-sm font-medium">
                              {job.workStyle}
                            </span>
                            <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-400/40 rounded-full text-yellow-200 text-sm font-medium">
                              {job.salary}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-white/60 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.posted}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.applicants} applicants
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link href={`/jobs/${job.id}`}>
                            <button className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-lg flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </Link>
                          <Link href={`/jobs/${job.id}`}>
                            <button className="h-10 px-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-lg font-bold transition-all backdrop-blur-md flex items-center gap-2">
                              <ArrowRight className="w-4 h-4" />
                              Apply
                            </button>
                          </Link>
                        </div>
                      </div>
                      {job.requirements && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <h4 className="text-white font-medium mb-2">Requirements:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req: string, reqIdx: number) => (
                              <span key={reqIdx} className="px-2 py-1 bg-purple-600/20 border border-purple-400/40 rounded text-purple-200 text-xs font-medium">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">No open positions</h3>
                  <p className="text-white/60">Check back later for new opportunities</p>
                </div>
              )}
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
              <h3 className="text-xl font-bold text-white mb-4">Interested in {companyData.name}?</h3>
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

export default function CompanyProfilePage({ params }: { params: { slug: string } }) {
  const companyData = getCompanyData(params.slug)
  const jobs = getCompanyJobs(params.slug)

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
          <CompanyHeader companyData={companyData} />
          <CompanyStats companyData={companyData} />
          <CompanyOverview companyData={companyData} jobs={jobs} />
        </main>
      </div>
    </NeuronicLayout>
  )
}