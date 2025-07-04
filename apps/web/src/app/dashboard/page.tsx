'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@job-board/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { jobService, applicationService } from '@job-board/database'
import Link from 'next/link'

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
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile.first_name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {isCompany ? 'Manage your job postings and applications' : 'Track your job applications and discover new opportunities'}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {isCompany && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <div className="text-2xl">💼</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.jobs}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeJobs} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <div className="text-2xl">📋</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.applications}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingApplications} pending review
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {isIndividual && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
                <div className="text-2xl">📋</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : stats.applications}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingApplications} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                <div className="text-2xl">👁️</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  Coming soon
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <div className="text-2xl">💬</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <div className="text-2xl">🔔</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              {isCompany ? 'Manage your hiring process' : 'Advance your career'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCompany && (
              <>
                <Link href="/dashboard/jobs/new">
                  <Button className="w-full justify-start">
                    <span className="mr-2">➕</span>
                    Post New Job
                  </Button>
                </Link>
                <Link href="/dashboard/jobs">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">💼</span>
                    Manage Jobs
                  </Button>
                </Link>
                <Link href="/dashboard/applications">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">📋</span>
                    Review Applications
                  </Button>
                </Link>
              </>
            )}

            {isIndividual && (
              <>
                <Link href="/jobs">
                  <Button className="w-full justify-start">
                    <span className="mr-2">🔍</span>
                    Search Jobs
                  </Button>
                </Link>
                <Link href="/dashboard/applications">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">📋</span>
                    My Applications
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">👤</span>
                    Update Profile
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              {isCompany ? 'Latest applications and job updates' : 'Your recent job applications'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>Activity feed coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Guide */}
      {isCompany && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Get Started with Hiring</CardTitle>
            <CardDescription>
              Follow these steps to start finding great candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <span>Complete your company profile</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <span>Post your first job</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <span>Review applications</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isIndividual && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Find Your Dream Job</CardTitle>
            <CardDescription>
              Get started with these steps to land your next opportunity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <span>Complete your profile</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <span>Upload your CV</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <span>Start applying to jobs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}