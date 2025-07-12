'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  ArrowRight,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  Settings,
  Bell,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  TrendingDown
} from 'lucide-react'
import NeuronicLayout from '../../../components/layout/NeuronicLayout'

// Mock data for demonstration
const mockStats = {
  totalJobs: 24,
  activeJobs: 18,
  totalApplications: 1247,
  newApplications: 43,
  interviews: 28,
  offers: 12,
  hired: 8,
  avgTimeToHire: 18
}

const mockJobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    status: 'Active',
    applications: 67,
    posted: '2024-01-15',
    expires: '2024-02-15',
    salary: '$120K - $180K',
    views: 234
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    status: 'Active',
    applications: 89,
    posted: '2024-01-10',
    expires: '2024-02-10',
    salary: '$100K - $150K',
    views: 312
  },
  {
    id: 3,
    title: 'UX Designer',
    department: 'Design',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'Draft',
    applications: 0,
    posted: '2024-01-20',
    expires: '2024-02-20',
    salary: '$80K - $120K',
    views: 0
  },
  {
    id: 4,
    title: 'Data Scientist',
    department: 'Data',
    location: 'Seattle, WA',
    type: 'Full-time',
    status: 'Closed',
    applications: 156,
    posted: '2023-12-01',
    expires: '2024-01-01',
    salary: '$130K - $200K',
    views: 445
  }
]

const mockApplications = [
  {
    id: 1,
    candidateName: 'Sarah Johnson',
    jobTitle: 'Senior Software Engineer',
    appliedDate: '2024-01-18',
    status: 'New',
    score: 92,
    experience: '8 years',
    location: 'San Francisco, CA'
  },
  {
    id: 2,
    candidateName: 'Michael Chen',
    jobTitle: 'Product Manager',
    appliedDate: '2024-01-17',
    status: 'Interview',
    score: 88,
    experience: '6 years',
    location: 'Remote'
  },
  {
    id: 3,
    candidateName: 'Emily Rodriguez',
    jobTitle: 'UX Designer',
    appliedDate: '2024-01-16',
    status: 'Offer',
    score: 95,
    experience: '5 years',
    location: 'New York, NY'
  },
  {
    id: 4,
    candidateName: 'David Kim',
    jobTitle: 'Data Scientist',
    appliedDate: '2024-01-15',
    status: 'Rejected',
    score: 72,
    experience: '4 years',
    location: 'Seattle, WA'
  }
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return 'bg-green-500'
    case 'draft': return 'bg-yellow-500'
    case 'closed': return 'bg-gray-500'
    case 'new': return 'bg-blue-500'
    case 'interview': return 'bg-purple-500'
    case 'offer': return 'bg-green-500'
    case 'rejected': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

export default function CompanyDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJobs, setSelectedJobs] = useState<number[]>([])

  return (
    <NeuronicLayout variant="subtle">
      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-md bg-white/5 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2">
                  <Building2 className="w-8 h-8 text-white" />
                  <span className="text-xl font-bold text-white">TalentAIze</span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'overview' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'jobs' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Jobs
                  </button>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'applications' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Applications
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'analytics' 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Analytics
                  </button>
                </nav>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome back, John!</h1>
                    <p className="text-white/80">Here's what's happening with your hiring process.</p>
                  </div>
                  <Link href="/company/jobs/new" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Post New Job
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Active Jobs</p>
                      <p className="text-2xl font-bold text-white">{mockStats.activeJobs}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">+12% from last month</span>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Total Applications</p>
                      <p className="text-2xl font-bold text-white">{mockStats.totalApplications}</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">+8% from last month</span>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Interviews</p>
                      <p className="text-2xl font-bold text-white">{mockStats.interviews}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">+15% from last month</span>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Avg. Time to Hire</p>
                      <p className="text-2xl font-bold text-white">{mockStats.avgTimeToHire} days</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingDown className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">-3 days from last month</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Recent Applications</h3>
                    <div className="space-y-4">
                      {mockApplications.slice(0, 5).map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {application.candidateName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-white">{application.candidateName}</p>
                              <p className="text-sm text-white/70">{application.jobTitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-white/90">AI Score: {application.score}%</p>
                              <p className="text-xs text-white/70">{application.appliedDate}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(application.status)}`}>
                              {application.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link href="/company/applications" className="text-blue-400 hover:text-blue-300 font-medium">
                        View all applications →
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Top Performing Jobs</h3>
                    <div className="space-y-4">
                      {mockJobs.filter(job => job.status === 'Active').slice(0, 3).map((job) => (
                        <div key={job.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white text-sm">{job.title}</p>
                            <p className="text-xs text-white/70">{job.applications} applications</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-white/90">{job.views} views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link href="/company/jobs/new" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <Plus className="w-4 h-4 text-blue-400" />
                        <span className="text-white">Post New Job</span>
                      </Link>
                      <Link href="/company/applications" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-white">Review Applications</span>
                      </Link>
                      <Link href="/company/analytics" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <BarChart3 className="w-4 h-4 text-green-400" />
                        <span className="text-white">View Analytics</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              {/* Jobs Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Job Postings</h2>
                <Link href="/company/jobs/new" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Post New Job
                </Link>
              </div>

              {/* Jobs Filters */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 text-white rounded-lg hover:bg-white/30 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Jobs List */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Job</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Applications</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Posted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                      {mockJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-white/10">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-white">{job.title}</div>
                              <div className="text-sm text-white/70">{job.department} • {job.location}</div>
                              <div className="text-sm text-white/60">{job.salary}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-white">{job.applications}</td>
                          <td className="px-6 py-4 text-sm text-white">{job.views}</td>
                          <td className="px-6 py-4 text-sm text-white/80">{job.posted}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-white/70 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-white/70 hover:text-white">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-white/70 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {/* Applications Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Applications</h2>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 text-white rounded-lg hover:bg-white/30 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Applications List */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Candidate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Job</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">AI Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Applied</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                      {mockApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-white/5">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {application.candidateName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{application.candidateName}</div>
                                <div className="text-sm text-white/70">{application.experience} • {application.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-white">{application.jobTitle}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-2 bg-white/20 rounded-full">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                  style={{ width: `${application.score}%` }}
                                />
                              </div>
                              <span className="text-sm text-white font-medium">{application.score}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-white/80">{application.appliedDate}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-white/70 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-white/70 hover:text-white">
                                <Mail className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-white/70 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Conversion Rate</p>
                      <p className="text-2xl font-bold text-white">3.2%</p>
                    </div>
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Cost per Hire</p>
                      <p className="text-2xl font-bold text-white">$2,450</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Quality Score</p>
                      <p className="text-2xl font-bold text-white">87%</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Offer Acceptance</p>
                      <p className="text-2xl font-bold text-white">78%</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Hiring Funnel</h3>
                  <div className="h-64 flex items-center justify-center text-white/60">
                    <PieChart className="w-16 h-16 mb-2" />
                  </div>
                </div>

                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Application Trends</h3>
                  <div className="h-64 flex items-center justify-center text-white/60">
                    <BarChart3 className="w-16 h-16 mb-2" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </NeuronicLayout>
  )
}