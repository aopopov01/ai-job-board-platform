'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { applicationService, jobService } from '@job-board/database'

interface Application {
  id: string
  status: string
  applied_at: string
  cover_letter: string
  ai_screening_score: number
  ai_screening_notes: string
  recruiter_notes: string
  jobs?: {
    title: string
    company_profiles: {
      company_name: string
    }
  }
  individual_profiles?: {
    user_profiles: {
      first_name: string
      last_name: string
    }
    current_job_title: string
    years_of_experience: number
  }
}

export default function ApplicationsPage() {
  const { profile } = useAuthStore()
  const searchParams = useSearchParams()
  const jobFilter = searchParams.get('job')
  
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    const loadApplications = async () => {
      if (!profile) return

      try {
        let data: any[] = []

        if (profile.user_type === 'company') {
          if (jobFilter) {
            const { data: jobApplications, error } = await applicationService.getByJob(jobFilter)
            if (error) throw error
            data = jobApplications || []
          } else {
            // Get all applications for company's jobs
            const { data: jobs } = await jobService.getByCompany(profile.id)
            if (jobs) {
              const allApplications = await Promise.all(
                jobs.map(async (job) => {
                  const { data: jobApps } = await applicationService.getByJob(job.id)
                  return (jobApps || []).map(app => ({
                    ...app,
                    jobs: {
                      title: job.title,
                      company_profiles: {
                        company_name: 'Your Company'
                      }
                    }
                  }))
                })
              )
              data = allApplications.flat()
            }
          }
        } else if (profile.user_type === 'individual') {
          const { data: candidateApplications, error } = await applicationService.getByCandidate(profile.id)
          if (error) throw error
          data = candidateApplications || []
        }

        setApplications(data)
      } catch (error: any) {
        setError(error.message || 'Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [profile, jobFilter])

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await applicationService.update(applicationId, { status: newStatus })
      setApplications(apps => 
        apps.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      )
    } catch (error: any) {
      setError(error.message || 'Failed to update application status')
    }
  }

  const filteredApplications = applications.filter(app => 
    selectedStatus === 'all' || app.status === selectedStatus
  )

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'applied', label: 'New Applications' },
    { value: 'screening', label: 'Under Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'offered', label: 'Offered' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800'
      case 'screening': return 'bg-yellow-100 text-yellow-800'
      case 'shortlisted': return 'bg-purple-100 text-purple-800'
      case 'interview_scheduled': return 'bg-indigo-100 text-indigo-800'
      case 'interviewed': return 'bg-orange-100 text-orange-800'
      case 'offered': return 'bg-green-100 text-green-800'
      case 'hired': return 'bg-green-200 text-green-900'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.user_type === 'company' ? 'Job Applications' : 'My Applications'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {profile?.user_type === 'company' 
              ? 'Review and manage applications from candidates'
              : 'Track the status of your job applications'
            }
          </p>
        </div>
        {profile?.user_type === 'individual' && (
          <Link href="/jobs">
            <Button>Browse More Jobs</Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {applications.length === 0 ? 'No applications yet' : 'No applications match your filter'}
            </h3>
            <p className="text-gray-500 mb-6">
              {profile?.user_type === 'company' 
                ? applications.length === 0 
                  ? 'Applications will appear here when candidates apply to your jobs.'
                  : 'Try adjusting your filter to see more applications.'
                : applications.length === 0
                  ? 'Start applying to jobs to see your applications here.'
                  : 'Try adjusting your filter to see more applications.'
              }
            </p>
            {profile?.user_type === 'company' && applications.length === 0 && (
              <Link href="/dashboard/jobs/new">
                <Button>Post a Job</Button>
              </Link>
            )}
            {profile?.user_type === 'individual' && applications.length === 0 && (
              <Link href="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {profile?.user_type === 'company' 
                        ? `${application.individual_profiles?.user_profiles.first_name} ${application.individual_profiles?.user_profiles.last_name}`
                        : application.jobs?.title
                      }
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {profile?.user_type === 'company' 
                        ? `${application.individual_profiles?.current_job_title || 'No title'} • ${application.individual_profiles?.years_of_experience || 0} years experience`
                        : `${application.jobs?.company_profiles.company_name}`
                      }
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ')}
                    </span>
                    <div className="text-sm text-gray-500">
                      {new Date(application.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {application.cover_letter && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {application.cover_letter}
                    </p>
                  </div>
                )}

                {application.ai_screening_score && profile?.user_type === 'company' && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">AI Screening</h4>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium">Score:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          application.ai_screening_score >= 80 ? 'bg-green-100 text-green-800' :
                          application.ai_screening_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.ai_screening_score}/100
                        </span>
                      </div>
                      {application.ai_screening_notes && (
                        <p className="text-sm text-gray-700">{application.ai_screening_notes}</p>
                      )}
                    </div>
                  </div>
                )}

                {application.recruiter_notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recruiter Notes</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {application.recruiter_notes}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {profile?.user_type === 'individual' ? (
                    <>
                      <Link href={`/jobs/${application.jobs?.id}`}>
                        <Button variant="outline" size="sm">View Job</Button>
                      </Link>
                      {application.status === 'applied' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(application.id, 'withdrawn')}
                          className="text-red-600 hover:text-red-700"
                        >
                          Withdraw Application
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'screening')}
                        disabled={['screening', 'shortlisted', 'hired', 'rejected'].includes(application.status)}
                      >
                        Start Review
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'shortlisted')}
                        disabled={['hired', 'rejected'].includes(application.status)}
                      >
                        Shortlist
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'interview_scheduled')}
                        disabled={['hired', 'rejected'].includes(application.status)}
                      >
                        Schedule Interview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'offered')}
                        disabled={['hired', 'rejected'].includes(application.status)}
                      >
                        Make Offer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'hired')}
                        disabled={application.status === 'rejected'}
                        className="text-green-600 hover:text-green-700"
                      >
                        Hire
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                        disabled={application.status === 'hired'}
                        className="text-red-600 hover:text-red-700"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}