'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@job-board/shared/client'
import { jobService, applicationService } from '@job-board/database'
import NeuronicLayout from '../../components/layout/NeuronicLayout'
import { 
  User, 
  Briefcase, 
  Heart, 
  Eye, 
  Bell, 
  Settings, 
  FileText, 
  TrendingUp, 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  Building2, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  Upload,
  Target,
  Award,
  Zap,
  BarChart3,
  Users,
  Mail,
  Phone,
  Globe,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Trophy,
  Activity
} from 'lucide-react'

export default function UserDashboard() {
  const { profile } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    activeJobs: 0,
    pendingApplications: 0,
    profileViews: 156,
    savedJobs: 12,
    interviews: 6,
    offers: 2
  })
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockUserData = {
    profile: {
      name: profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'User',
      email: profile?.email || 'user@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      title: 'Senior Software Engineer',
      experience: '5+ years',
      skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'],
      profileCompletion: 85,
      resumeUploaded: true,
      portfolioUrl: 'https://example.dev'
    },
    recentApplications: [
      {
        id: '1',
        jobTitle: 'Senior Software Engineer',
        company: 'TechCorp',
        appliedDate: '2024-01-15',
        status: 'Interview Scheduled',
        statusColor: 'text-blue-400 bg-blue-600/20',
        salary: '$150K - $200K',
        location: 'San Francisco, CA'
      },
      {
        id: '2',
        jobTitle: 'Full Stack Developer',
        company: 'StartupXYZ',
        appliedDate: '2024-01-12',
        status: 'Under Review',
        statusColor: 'text-yellow-400 bg-yellow-600/20',
        salary: '$130K - $180K',
        location: 'Remote'
      },
      {
        id: '3',
        jobTitle: 'Frontend Engineer',
        company: 'DesignCorp',
        appliedDate: '2024-01-10',
        status: 'Offer Received',
        statusColor: 'text-green-400 bg-green-600/20',
        salary: '$140K - $190K',
        location: 'New York, NY'
      }
    ],
    savedJobs: [
      {
        id: '1',
        title: 'Lead Software Engineer',
        company: 'InnovateTech',
        location: 'Seattle, WA',
        salary: '$180K - $250K',
        posted: '2 days ago',
        featured: true
      },
      {
        id: '2',
        title: 'DevOps Engineer',
        company: 'CloudTech',
        location: 'Austin, TX',
        salary: '$140K - $200K',
        posted: '1 week ago',
        featured: false
      }
    ],
    interviews: [
      {
        id: '1',
        jobTitle: 'Senior Software Engineer',
        company: 'TechCorp',
        date: '2024-01-20',
        time: '2:00 PM',
        type: 'Technical Interview',
        interviewer: 'Sarah Chen',
        meetingLink: 'https://zoom.us/j/123456789'
      },
      {
        id: '2',
        jobTitle: 'Full Stack Developer',
        company: 'StartupXYZ',
        date: '2024-01-22',
        time: '10:00 AM',
        type: 'Culture Fit',
        interviewer: 'Mike Rodriguez',
        meetingLink: 'https://meet.google.com/abc-def-ghi'
      }
    ],
    recommendations: [
      {
        skill: 'React',
        level: 'Expert',
        jobs: 23,
        color: 'from-blue-500 to-indigo-600'
      },
      {
        skill: 'Node.js',
        level: 'Advanced',
        jobs: 18,
        color: 'from-green-500 to-emerald-600'
      },
      {
        skill: 'TypeScript',
        level: 'Advanced',
        jobs: 15,
        color: 'from-purple-500 to-violet-600'
      }
    ]
  }

  useEffect(() => {
    const loadStats = async () => {
      if (!profile) return

      try {
        if (profile.user_type === 'company') {
          const { data: jobs } = await jobService.getByCompany(profile.id)
          const activeJobs = jobs?.filter(job => job.status === 'active').length || 0
          const totalApplications = jobs?.reduce((sum, job) => sum + (job.applications?.length || 0), 0) || 0
          const pendingApplications = jobs?.reduce((sum, job) => 
            sum + (job.applications?.filter(app => app.status === 'applied').length || 0), 0) || 0

          setStats({
            jobs: jobs?.length || 0,
            applications: totalApplications,
            activeJobs,
            pendingApplications,
            profileViews: 156,
            savedJobs: 12,
            interviews: 6,
            offers: 2
          })
        } else if (profile.user_type === 'individual') {
          const { data: applications } = await applicationService.getByCandidate(profile.id)
          const pendingApplications = applications?.filter(app => 
            ['applied', 'screening'].includes(app.status || '')).length || 0

          setStats({
            jobs: 0,
            applications: applications?.length || 0,
            activeJobs: 0,
            pendingApplications,
            profileViews: 156,
            savedJobs: 12,
            interviews: 6,
            offers: 2
          })
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [profile])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Interview Scheduled':
        return <Calendar className="w-4 h-4" />
      case 'Under Review':
        return <Clock className="w-4 h-4" />
      case 'Offer Received':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
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

  const isCompany = profile?.user_type === 'company'

  if (!profile) return null

  return (
    <NeuronicLayout variant="subtle">
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-white/20 backdrop-blur-md bg-white/10 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Dashboard</h1>
                  <p className="text-white/70 text-sm">Welcome back, {mockUserData.profile.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-xl">
                      <h3 className="font-semibold text-white mb-3">Notifications</h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-white/10 rounded-lg">
                          <p className="text-white text-sm">New interview scheduled for TechCorp</p>
                          <p className="text-white/60 text-xs">2 hours ago</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-lg">
                          <p className="text-white text-sm">Profile viewed by StartupXYZ</p>
                          <p className="text-white/60 text-xs">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Link href="/profile/edit" className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-4 text-center">
              <Briefcase className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{loading ? '...' : stats.applications}</div>
              <div className="text-white/70 text-sm">Applications</div>
            </div>
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-4 text-center">
              <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.interviews}</div>
              <div className="text-white/70 text-sm">Interviews</div>
            </div>
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.offers}</div>
              <div className="text-white/70 text-sm">Offers</div>
            </div>
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-4 text-center">
              <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.profileViews}</div>
              <div className="text-white/70 text-sm">Profile Views</div>
            </div>
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-4 text-center">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats.savedJobs}</div>
              <div className="text-white/70 text-sm">Saved Jobs</div>
            </div>
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-4 text-center">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-white/70 text-sm">Skills Endorsed</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-2 mb-8">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'applications', label: 'Applications', icon: Briefcase },
                { id: 'interviews', label: 'Interviews', icon: Calendar },
                { id: 'saved', label: 'Saved Jobs', icon: Heart },
                { id: 'profile', label: 'Profile', icon: User }
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
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* Recent Applications */}
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white">Recent Applications</h2>
                      <Link href="/dashboard/applications" className="text-emerald-400 hover:text-emerald-300 text-sm">
                        View All
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {mockUserData.recentApplications.map((app) => (
                        <div key={app.id} className="p-4 bg-white/10 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-white">{app.jobTitle}</h3>
                              <p className="text-white/70 text-sm">{app.company}</p>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${app.statusColor}`}>
                              {getStatusIcon(app.status)}
                              <span className="text-xs font-medium">{app.status}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/70">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {app.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {app.salary}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {getTimeAgo(app.appliedDate)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Interviews */}
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white">Upcoming Interviews</h2>
                      <Link href="/dashboard/interviews" className="text-emerald-400 hover:text-emerald-300 text-sm">
                        View All
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {mockUserData.interviews.map((interview) => (
                        <div key={interview.id} className="p-4 bg-white/10 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-white">{interview.jobTitle}</h3>
                              <p className="text-white/70 text-sm">{interview.company}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-emerald-400 font-medium">{interview.date}</div>
                              <div className="text-white/70 text-sm">{interview.time}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <Users className="w-4 h-4" />
                              {interview.type} with {interview.interviewer}
                            </div>
                            <a
                              href={interview.meetingLink}
                              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Join Meeting
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'applications' && (
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">All Applications</h2>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {mockUserData.recentApplications.map((app) => (
                      <div key={app.id} className="p-4 bg-white/10 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-white">{app.jobTitle}</h3>
                            <p className="text-white/70 text-sm">{app.company}</p>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${app.statusColor}`}>
                            {getStatusIcon(app.status)}
                            <span className="text-xs font-medium">{app.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {app.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {app.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {getTimeAgo(app.appliedDate)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                            View Details
                          </button>
                          <button className="px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm">
                            Withdraw
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'saved' && (
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Saved Jobs</h2>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                        <Search className="w-4 h-4" />
                        Search Saved
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {mockUserData.savedJobs.map((job) => (
                      <div key={job.id} className="p-4 bg-white/10 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white">{job.title}</h3>
                              {job.featured && (
                                <span className="px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-white/70 text-sm">{job.company}</p>
                          </div>
                          <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.posted}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/jobs/${job.id}`} className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                            View Job
                          </Link>
                          <button className="px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Completion</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-sm">Progress</span>
                    <span className="text-white font-semibold">{mockUserData.profile.profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${mockUserData.profile.profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/80">Basic info completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-white/80">Resume uploaded</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/80">Add portfolio projects</span>
                  </div>
                </div>
                <Link href="/profile/edit" className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors text-center block">
                  Complete Profile
                </Link>
              </div>

              {/* Skill Recommendations */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Skill Recommendations</h3>
                <div className="space-y-3">
                  {mockUserData.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{rec.skill}</span>
                        <span className="text-xs text-white/70">{rec.level}</span>
                      </div>
                      <div className="text-xs text-white/70 mb-2">
                        {rec.jobs} jobs available
                      </div>
                      <div className={`w-full h-1 bg-gradient-to-r ${rec.color} rounded-full`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/jobs" className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Search className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-sm">Browse Jobs</span>
                  </Link>
                  <Link href="/ai-advisor" className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm">AI Career Advisor</span>
                  </Link>
                  <Link href="/profile/edit" className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Edit className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">Edit Profile</span>
                  </Link>
                  <Link href="/resume/builder" className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <FileText className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm">Resume Builder</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NeuronicLayout>
  )
}