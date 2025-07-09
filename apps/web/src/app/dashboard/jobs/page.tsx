'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { jobService } from '@job-board/database'

interface Job {
  id: string
  title: string
  description: string
  job_type: string
  work_style: string
  location: string
  salary_min: number
  salary_max: number
  salary_currency: string
  status: string
  created_at: string
  applications: Array<{ id: string; status: string }>
  job_categories?: { name: string }
}

export default function JobsPage() {
  const { profile } = useAuthStore()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadJobs = async () => {
      if (!profile || profile.user_type !== 'company') return

      try {
        const { data, error } = await jobService.getByCompany(profile.id)
        if (error) throw error
        setJobs(data || [])
      } catch (error: any) {
        setError(error.message || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [profile])

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      await jobService.delete(jobId)
      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (error: any) {
      setError(error.message || 'Failed to delete job')
    }
  }

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'

    try {
      await jobService.update(jobId, { status: newStatus })
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ))
    } catch (error: any) {
      setError(error.message || 'Failed to update job status')
    }
  }

  if (profile?.user_type !== 'company') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">This page is only available for company accounts.</p>
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your job postings and track applications
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>
            <span className="mr-2">➕</span>
            Post New Job
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-6">
              Start attracting top talent by posting your first job.
            </p>
            <Link href="/dashboard/jobs/new">
              <Button>Post Your First Job</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center space-x-4 text-sm">
                        <span>{job.job_type.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{job.work_style.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{job.location || 'Remote'}</span>
                        {job.job_categories && (
                          <>
                            <span>•</span>
                            <span>{job.job_categories.name}</span>
                          </>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : job.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Applications</p>
                    <p className="text-lg font-semibold">{job.applications?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Salary Range</p>
                    <p className="text-lg font-semibold">
                      {job.salary_min && job.salary_max 
                        ? `${job.salary_currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Posted</p>
                    <p className="text-lg font-semibold">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <a href={`/dashboard/jobs/${job.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </a>
                  <a href={`/dashboard/jobs/${job.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </a>
                  <a href={`/dashboard/applications?job=${job.id}`}>
                    <Button variant="outline" size="sm">
                      Applications ({job.applications?.length || 0})
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(job.id, job.status)}
                  >
                    {job.status === 'active' ? 'Pause' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}