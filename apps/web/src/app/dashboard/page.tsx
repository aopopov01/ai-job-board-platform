'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { jobService, applicationService } from '@job-board/database'
import Link from 'next/link'
import { 
  Search, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Bell,
  MessageSquare,
  Eye,
  Plus,
  FileText,
  Settings,
  Star,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Target,
  Zap,
  Heart,
  Trophy,
  Activity
} from 'lucide-react'

export default function DashboardPage() {
  const { profile } = useAuthStore()
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    activeJobs: 0,
    pendingApplications: 0
  })
  const [loading, setLoading] = useState(true)

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
            pendingApplications
          })
        } else if (profile.user_type === 'individual') {
          const { data: applications } = await applicationService.getByCandidate(profile.id)
          const pendingApplications = applications?.filter(app => 
            ['applied', 'screening'].includes(app.status || '')).length || 0

          setStats({
            jobs: 0,
            applications: applications?.length || 0,
            activeJobs: 0,
            pendingApplications
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

  if (!profile) return null

  const isCompany = profile.user_type === 'company'
  const isIndividual = profile.user_type === 'individual'

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container">
        <div className="section">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-responsive-3xl font-bold text-gradient mb-2">
                  Welcome back, {profile.first_name}!
                </h1>
                <p className="text-responsive-xl text-muted-foreground">
                  {isCompany 
                    ? 'Manage your hiring pipeline and connect with top talent' 
                    : 'Track your applications and discover amazing opportunities'
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="btn btn-secondary btn-sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </button>
                <Link href="/dashboard/settings" className="btn btn-secondary btn-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-border">
              {isCompany ? (
                <>
                  <Link href="/dashboard/jobs/new" className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Link>
                  <Link href="/dashboard/applications" className="btn btn-secondary">
                    <FileText className="w-4 h-4 mr-2" />
                    Review Applications
                  </Link>
                  <Link href="/dashboard/analytics" className="btn btn-secondary">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/jobs" className="btn btn-primary">
                    <Search className="w-4 h-4 mr-2" />
                    Search Jobs
                  </Link>
                  <Link href="/dashboard/applications" className="btn btn-secondary">
                    <FileText className="w-4 h-4 mr-2" />
                    My Applications
                  </Link>
                  <Link href="/dashboard/profile" className="btn btn-secondary">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isCompany && (
              <>
                <div className="stat-card bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <span className="badge badge-info text-xs">Jobs</span>
                  </div>
                  <div className="stat-number">{loading ? '...' : stats.jobs}</div>
                  <div className="stat-label">Total Job Postings</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.activeJobs} currently active
                  </p>
                </div>
                
                <div className="stat-card bg-gradient-to-br from-success/5 to-success/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-success" />
                    </div>
                    <span className="badge badge-success text-xs">Applications</span>
                  </div>
                  <div className="stat-number">{loading ? '...' : stats.applications}</div>
                  <div className="stat-label">Total Applications</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.pendingApplications} pending review
                  </p>
                </div>

                <div className="stat-card bg-gradient-to-br from-warning/5 to-warning/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-warning" />
                    </div>
                    <span className="badge bg-warning/10 text-warning text-xs">Views</span>
                  </div>
                  <div className="stat-number">--</div>
                  <div className="stat-label">Job Views</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Coming soon
                  </p>
                </div>

                <div className="stat-card bg-gradient-to-br from-purple-500/5 to-purple-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-500" />
                    </div>
                    <span className="badge bg-purple-100 text-purple-800 text-xs">Analytics</span>
                  </div>
                  <div className="stat-number">--</div>
                  <div className="stat-label">Hire Rate</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Coming soon
                  </p>
                </div>
              </>
            )}

            {isIndividual && (
              <>
                <div className="stat-card bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <span className="badge badge-info text-xs">Applications</span>
                  </div>
                  <div className="stat-number">{loading ? '...' : stats.applications}</div>
                  <div className="stat-label">Applications Sent</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats.pendingApplications} pending response
                  </p>
                </div>

                <div className="stat-card bg-gradient-to-br from-success/5 to-success/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-success" />
                    </div>
                    <span className="badge badge-success text-xs">Profile</span>
                  </div>
                  <div className="stat-number">--</div>
                  <div className="stat-label">Profile Views</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Coming soon
                  </p>
                </div>

                <div className="stat-card bg-gradient-to-br from-warning/5 to-warning/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-warning" />
                    </div>
                    <span className="badge bg-warning/10 text-warning text-xs">Saved</span>
                  </div>
                  <div className="stat-number">--</div>
                  <div className="stat-label">Saved Jobs</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Coming soon
                  </p>
                </div>

                <div className="stat-card bg-gradient-to-br from-purple-500/5 to-purple-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-500" />
                    </div>
                    <span className="badge bg-purple-100 text-purple-800 text-xs">Score</span>
                  </div>
                  <div className="stat-number">--</div>
                  <div className="stat-label">Match Score</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Coming soon
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Main Dashboard Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Primary Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Activity Widget */}
              <div className="widget">
                <div className="widget-header">
                  <h3 className="widget-title">Recent Activity</h3>
                  <Link href="/dashboard/activity" className="widget-action">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {isCompany ? (
                    <>
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">New application received</p>
                          <p className="text-sm text-muted-foreground">Senior Frontend Developer • 2 hours ago</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-warning" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Job posting expires soon</p>
                          <p className="text-sm text-muted-foreground">Product Designer • Expires in 3 days</p>
                        </div>
                        <AlertCircle className="w-5 h-5 text-warning" />
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Job posting performing well</p>
                          <p className="text-sm text-muted-foreground">Full Stack Developer • 15 applications</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-success" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Application submitted</p>
                          <p className="text-sm text-muted-foreground">TechCorp Innovation • 1 hour ago</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-warning" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Job saved</p>
                          <p className="text-sm text-muted-foreground">Design Studio Pro • 3 hours ago</p>
                        </div>
                        <Star className="w-5 h-5 text-warning" />
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Perfect match found</p>
                          <p className="text-sm text-muted-foreground">Senior React Developer • 95% match</p>
                        </div>
                        <Zap className="w-5 h-5 text-success" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Performance Chart Widget */}
              <div className="widget">
                <div className="widget-header">
                  <h3 className="widget-title">
                    {isCompany ? 'Hiring Performance' : 'Application Progress'}
                  </h3>
                  <Link href="/dashboard/analytics" className="widget-action">
                    View Analytics <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
                
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Analytics Dashboard</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Detailed analytics and insights coming soon
                  </p>
                  <button className="btn btn-secondary btn-sm">
                    Get Notified
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="widget">
                <div className="widget-header">
                  <h3 className="widget-title">Quick Actions</h3>
                </div>
                
                <div className="space-y-3">
                  {isCompany ? (
                    <>
                      <Link href="/dashboard/jobs/new" className="btn btn-primary w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Post New Job
                      </Link>
                      <Link href="/dashboard/jobs" className="btn btn-secondary w-full justify-start">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Manage Jobs
                      </Link>
                      <Link href="/dashboard/candidates" className="btn btn-secondary w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Browse Candidates
                      </Link>
                      <Link href="/dashboard/messages" className="btn btn-secondary w-full justify-start">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Messages
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/jobs" className="btn btn-primary w-full justify-start">
                        <Search className="w-4 h-4 mr-2" />
                        Search Jobs
                      </Link>
                      <Link href="/dashboard/applications" className="btn btn-secondary w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        My Applications
                      </Link>
                      <Link href="/dashboard/cv" className="btn btn-secondary w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Upload CV
                      </Link>
                      <Link href="/dashboard/profile" className="btn btn-secondary w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="widget">
                <div className="widget-header">
                  <h3 className="widget-title">Notifications</h3>
                  <span className="badge badge-info">3</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New message received</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Profile view</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Weekly summary ready</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                </div>
                
                <Link href="/dashboard/notifications" className="widget-action mt-4 block">
                  View All Notifications <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Getting Started Guide */}
          <div className="mt-8">
            {isCompany && (
              <div className="widget">
                <div className="widget-header">
                  <h3 className="widget-title">Get Started with Hiring</h3>
                  <span className="badge badge-info">3 steps</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Complete your company profile</p>
                      <p className="text-sm text-muted-foreground">Add company details and culture information</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border-l-4 border-muted">
                    <div className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Post your first job</p>
                      <p className="text-sm text-muted-foreground">Create detailed job descriptions</p>
                    </div>
                    <button className="btn btn-primary btn-sm">
                      Start Now
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border-l-4 border-muted">
                    <div className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Review applications</p>
                      <p className="text-sm text-muted-foreground">Find the best candidates for your team</p>
                    </div>
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}

            {isIndividual && (
              <div className="widget">
                <div className="widget-header">
                  <h3 className="widget-title">Find Your Dream Job</h3>
                  <span className="badge badge-info">3 steps</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Complete your profile</p>
                      <p className="text-sm text-muted-foreground">Add skills, experience, and preferences</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border-l-4 border-muted">
                    <div className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Upload your CV</p>
                      <p className="text-sm text-muted-foreground">Make your application stand out</p>
                    </div>
                    <button className="btn btn-primary btn-sm">
                      Upload
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border-l-4 border-muted">
                    <div className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Start applying to jobs</p>
                      <p className="text-sm text-muted-foreground">Discover opportunities that match your skills</p>
                    </div>
                    <Link href="/jobs" className="btn btn-primary btn-sm">
                      Browse Jobs
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}