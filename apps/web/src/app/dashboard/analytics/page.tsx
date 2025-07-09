'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { applicationService } from '@job-board/database'

interface ApplicationStats {
  total: number
  by_status: Record<string, number>
  recent: Array<{
    id: string
    status: string | null
    applied_at: string | null
    jobs: { title: string }
    individual_profiles: {
      user_profiles: {
        first_name: string
        last_name: string
      }
    }
  }>
}

export default function AnalyticsPage() {
  const { profile } = useAuthStore()
  const [stats, setStats] = useState<ApplicationStats>({ total: 0, by_status: {}, recent: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      if (!profile || profile.user_type !== 'company') return

      try {
        const data = await applicationService.getApplicationStats(profile.id)
        setStats({
          total: data.total,
          by_status: data.by_status,
          recent: (data.recent || []).map((app: any) => ({
            id: app.id,
            status: app.status || 'pending',
            applied_at: app.applied_at || new Date().toISOString(),
            jobs: app.jobs || { title: 'Unknown' },
            individual_profiles: app.individual_profiles || { user_profiles: { first_name: 'Unknown', last_name: 'User' } }
          }))
        })
      } catch (error: any) {
        setError(error.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [profile])

  const statusLabels = {
    applied: 'New Applications',
    screening: 'Under Review',
    shortlisted: 'Shortlisted',
    interview_scheduled: 'Interview Scheduled',
    interviewed: 'Interviewed',
    offered: 'Offered',
    hired: 'Hired',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500'
      case 'screening': return 'bg-yellow-500'
      case 'shortlisted': return 'bg-purple-500'
      case 'interview_scheduled': return 'bg-indigo-500'
      case 'interviewed': return 'bg-orange-500'
      case 'offered': return 'bg-green-500'
      case 'hired': return 'bg-green-600'
      case 'rejected': return 'bg-red-500'
      case 'withdrawn': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  const calculateConversionRate = (fromStatus: string, toStatus: string) => {
    const fromCount = stats.by_status[fromStatus] || 0
    const toCount = stats.by_status[toStatus] || 0
    return fromCount > 0 ? ((toCount / fromCount) * 100).toFixed(1) : '0.0'
  }

  if (profile?.user_type !== 'company') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Analytics are only available for company accounts.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hiring Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track your hiring performance and application insights
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.by_status.applied || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.by_status.hired || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Hire Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.total > 0 ? ((stats.by_status.hired || 0) / stats.total * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Status Distribution */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Application Status Distribution</CardTitle>
          <CardDescription>
            Breakdown of applications by current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.by_status).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${getStatusColor(status)}`}></div>
                  <span className="text-sm font-medium text-gray-900">
                    {statusLabels[status as keyof typeof statusLabels] || status}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{count} applications</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStatusColor(status)}`}
                      style={{ width: `${stats.total > 0 ? (count / stats.total * 100) : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {stats.total > 0 ? (count / stats.total * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rates */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Conversion Rates</CardTitle>
          <CardDescription>
            How well applications progress through your hiring pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Application → Interview</div>
              <div className="text-2xl font-bold text-blue-900">
                {calculateConversionRate('applied', 'interview_scheduled')}%
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Interview → Offer</div>
              <div className="text-2xl font-bold text-green-900">
                {calculateConversionRate('interview_scheduled', 'offered')}%
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Offer → Hire</div>
              <div className="text-2xl font-bold text-purple-900">
                {calculateConversionRate('offered', 'hired')}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>
            Latest applications received for your job postings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recent.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No recent applications</div>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recent.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">
                      {application.individual_profiles.user_profiles.first_name} {application.individual_profiles.user_profiles.last_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Applied to: {application.jobs.title}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'screening' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'shortlisted' ? 'bg-purple-100 text-purple-800' :
                      application.status === 'hired' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status?.replace('_', ' ') || 'pending'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(application.applied_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}