'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { useAuthStore } from '@job-board/shared'
import { jobService, applicationService } from '@job-board/database'

interface JobDetails {
  id: string
  title: string
  description: string
  requirements: string
  responsibilities: string
  benefits: string
  job_type: string
  work_style: string
  experience_level: string
  location: string
  salary_min: number
  salary_max: number
  salary_currency: string
  skills_required: string[]
  skills_nice_to_have: string[]
  application_deadline: string
  created_at: string
  company_profiles: {
    company_name: string
    company_size: string
    industry: string
    company_website: string
    company_description: string
    user_profiles: {
      first_name: string
      last_name: string
      linkedin_url: string
    }
  }
  job_categories?: { name: string }
  applications: Array<{ id: string; status: string; applied_at: string }>
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuthStore()
  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadJob = async () => {
      try {
        const { data, error } = await jobService.getById(params.id as string)
        if (error) throw error
        
        setJob(data)

        // Check if user has already applied
        if (user && profile?.user_type === 'individual') {
          const existingApplication = data?.applications?.find(
            app => app.candidate_id === profile.id
          )
          setHasApplied(!!existingApplication)
        }
      } catch (error: any) {
        setError(error.message || 'Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadJob()
    }
  }, [params.id, user, profile])

  const handleApply = async () => {
    if (!user || !profile || profile.user_type !== 'individual') {
      router.push('/auth/login')
      return
    }

    setApplying(true)
    try {
      await applicationService.create({
        job_id: job!.id,
        candidate_id: profile.id,
        cover_letter: coverLetter || null,
        status: 'applied'
      })

      setHasApplied(true)
      setShowApplicationForm(false)
      setCoverLetter('')
    } catch (error: any) {
      setError(error.message || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This job may have been removed or doesn\'t exist.'}</p>
          <Link href="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isJobOwner = profile?.user_type === 'company' && profile.id === job.company_profiles.user_profiles.id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/jobs">
              <Button variant="outline" size="sm">← Back to Jobs</Button>
            </Link>
            {isJobOwner && (
              <Link href={`/dashboard/jobs/${job.id}/edit`}>
                <Button variant="outline" size="sm">Edit Job</Button>
              </Link>
            )}
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-lg">
                <Link 
                  href={job.company_profiles.company_website || '#'}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                  target="_blank"
                >
                  {job.company_profiles.company_name}
                </Link>
                <span className="text-gray-500">•</span>
                <span className="text-gray-700">{job.location || 'Remote'}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-700">{job.work_style.replace('_', ' ')}</span>
              </div>
            </div>
            
            <div className="text-right">
              {job.salary_min && job.salary_max && (
                <div className="text-xl font-semibold text-green-600">
                  {job.salary_currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                </div>
              )}
              <div className="text-sm text-gray-500 mt-1">
                Posted {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Job Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {job.job_type.replace('_', ' ')}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {job.work_style.replace('_', ' ')}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {job.experience_level.replace('_', ' ')} level
            </span>
            {job.job_categories && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                {job.job_categories.name}
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {job.company_profiles.company_size} employees
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line text-gray-700">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && (
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700">{job.responsibilities}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700">{job.requirements}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700">{job.benefits}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                {job.skills_required.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.skills_nice_to_have.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Nice to Have</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_nice_to_have.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Application</CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      You need to sign in to apply for this job.
                    </p>
                    <Link href="/auth/login">
                      <Button className="w-full">Sign In to Apply</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button variant="outline" className="w-full">Create Account</Button>
                    </Link>
                  </div>
                ) : profile?.user_type === 'company' ? (
                  <p className="text-gray-600 text-sm">
                    Company accounts cannot apply for jobs. Switch to a job seeker account to apply.
                  </p>
                ) : hasApplied ? (
                  <div className="text-center">
                    <div className="text-green-600 font-medium mb-2">✅ Applied</div>
                    <p className="text-gray-600 text-sm">
                      Your application has been submitted successfully.
                    </p>
                    <Link href="/dashboard/applications">
                      <Button variant="outline" className="w-full mt-3">
                        View Application Status
                      </Button>
                    </Link>
                  </div>
                ) : showApplicationForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Letter (Optional)
                      </label>
                      <textarea
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Tell the employer why you're interested in this role..."
                        maxLength={1000}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {coverLetter.length}/1000 characters
                      </p>
                    </div>
                    
                    {error && (
                      <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleApply}
                        disabled={applying}
                        className="flex-1"
                      >
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowApplicationForm(false)}
                        disabled={applying}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full"
                  >
                    Apply for This Job
                  </Button>
                )}

                {job.application_deadline && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Application Deadline:</span><br />
                      {new Date(job.application_deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company_profiles.company_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Industry:</span>
                    <p className="text-sm text-gray-900">{job.company_profiles.industry}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Company Size:</span>
                    <p className="text-sm text-gray-900">{job.company_profiles.company_size} employees</p>
                  </div>
                  {job.company_profiles.company_description && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">About:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {job.company_profiles.company_description}
                      </p>
                    </div>
                  )}
                  {job.company_profiles.company_website && (
                    <div>
                      <Link
                        href={job.company_profiles.company_website}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Visit Company Website →
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Job Stats for Company Owners */}
            {isJobOwner && (
              <Card>
                <CardHeader>
                  <CardTitle>Job Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Applications:</span>
                      <span className="text-sm font-medium">{job.applications.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">New Applications:</span>
                      <span className="text-sm font-medium">
                        {job.applications.filter(app => app.status === 'applied').length}
                      </span>
                    </div>
                    <Link href={`/dashboard/applications?job=${job.id}`}>
                      <Button variant="outline" className="w-full mt-3">
                        Review Applications
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}