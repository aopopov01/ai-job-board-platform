'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { useAuthStore } from '@job-board/shared/client'
import { jobService, applicationService } from '@job-board/database'
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Briefcase, 
  Building2,
  DollarSign,
  Users,
  Calendar,
  Heart,
  Share2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Star,
  Badge,
  Globe,
  Mail,
  Phone
} from 'lucide-react'

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
        
        setJob(data as any)

        // Check if user has already applied
        if (user && profile?.user_type === 'individual') {
          const existingApplication = data?.applications?.find(
            app => (app as any).candidate_id === profile.id
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
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Job Details</h3>
          <p className="text-muted-foreground">Getting all the information ready for you...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'This job may have been removed or doesn\'t exist.'}
          </p>
          <Link href="/jobs" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    )
  }

  const isJobOwner = profile?.user_type === 'company' && profile.id === (job as any)?.company_id

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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container">
          <div className="section-sm">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/jobs" className="btn btn-secondary btn-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Jobs
                </Link>
                {isJobOwner && (
                  <Link href={`/dashboard/jobs/${job.id}/edit`} className="btn btn-secondary btn-sm">
                    Edit Job
                  </Link>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="btn btn-secondary btn-sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </button>
                <button className="btn btn-secondary btn-sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </div>

            {/* Job Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start gap-6 flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-2xl flex items-center justify-center text-primary font-bold text-xl">
                  {job.company_profiles.company_name.charAt(0)}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-responsive-3xl font-bold text-foreground mb-3">
                    {job.title}
                  </h1>
                  
                  <div className="flex items-center gap-6 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      <Link 
                        href={job.company_profiles.company_website || '#'}
                        className="font-semibold text-primary hover:text-primary-600 transition-colors"
                        target="_blank"
                      >
                        {job.company_profiles.company_name}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {job.location || 'Remote'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {getTimeAgo(job.created_at)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-info">
                      {formatJobType(job.job_type)}
                    </span>
                    <span className="badge badge-success">
                      {formatJobType(job.work_style)}
                    </span>
                    <span className="badge bg-purple-100 text-purple-800">
                      {formatJobType(job.experience_level)} Level
                    </span>
                    {job.job_categories && (
                      <span className="badge bg-orange-100 text-orange-800">
                        {job.job_categories.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {job.salary_min && job.salary_max && (
                  <div className="text-2xl font-bold text-success mb-2">
                    {job.salary_currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {job.applications?.length || 0} applications
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="section">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Job Description</h2>
                <div className="prose prose-blue max-w-none">
                  <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-6">Key Responsibilities</h2>
                  <div className="prose prose-blue max-w-none">
                    <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {job.responsibilities}
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-6">Requirements</h2>
                  <div className="prose prose-blue max-w-none">
                    <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {job.requirements}
                    </p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-6">Benefits & Perks</h2>
                  <div className="prose prose-blue max-w-none">
                    <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {job.benefits}
                    </p>
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Skills & Technologies</h2>
                
                {job.skills_required.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-destructive" />
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-destructive/10 text-destructive font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.skills_nice_to_have.length > 0 && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Nice to Have
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_nice_to_have.map((skill, index) => (
                        <span
                          key={index}
                          className="badge badge-info"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Card */}
              <div className="card sticky top-8">
                <h3 className="text-lg font-semibold mb-6">Apply for this role</h3>
                
                {!user ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Sign in to apply for this amazing opportunity
                    </p>
                    <Link href="/auth/login" className="btn btn-primary w-full">
                      Sign In to Apply
                    </Link>
                    <Link href="/auth/register" className="btn btn-secondary w-full">
                      Create Account
                    </Link>
                  </div>
                ) : profile?.user_type === 'company' ? (
                  <div className="text-center py-6">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Company accounts cannot apply for jobs. Switch to a job seeker account to apply.
                    </p>
                  </div>
                ) : hasApplied ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-success" />
                    </div>
                    <h4 className="font-semibold text-success mb-2">Application Submitted!</h4>
                    <p className="text-muted-foreground text-sm mb-4">
                      Your application has been sent to the hiring team.
                    </p>
                    <Link href="/dashboard/applications" className="btn btn-secondary w-full">
                      Track Application
                    </Link>
                  </div>
                ) : showApplicationForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="label mb-2">
                        Cover Letter (Optional)
                      </label>
                      <textarea
                        className="input min-h-[120px] resize-none"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Tell the employer why you're interested in this role and what makes you a great fit..."
                        maxLength={1000}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {coverLetter.length}/1000 characters
                      </p>
                    </div>
                    
                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="btn btn-primary flex-1"
                      >
                        {applying ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                      <button
                        onClick={() => setShowApplicationForm(false)}
                        disabled={applying}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="btn btn-primary w-full btn-lg"
                  >
                    Apply Now
                  </button>
                )}

                {job.application_deadline && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-warning" />
                      <span className="font-medium">Deadline:</span>
                      <span className="text-muted-foreground">
                        {new Date(job.application_deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Company Information */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-6">About {job.company_profiles.company_name}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Industry</p>
                      <p className="text-sm text-muted-foreground">{job.company_profiles.industry}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Company Size</p>
                      <p className="text-sm text-muted-foreground">{job.company_profiles.company_size} employees</p>
                    </div>
                  </div>
                  
                  {job.company_profiles.company_description && (
                    <div>
                      <p className="text-sm font-medium mb-2">About the Company</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {job.company_profiles.company_description}
                      </p>
                    </div>
                  )}
                  
                  {job.company_profiles.company_website && (
                    <Link
                      href={job.company_profiles.company_website}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary-600 text-sm font-medium transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Company Website
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Job Stats for Company Owners */}
              {isJobOwner && (
                <div className="card">
                  <h3 className="text-lg font-semibold mb-6">Job Performance</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Total Applications</span>
                      <span className="text-lg font-semibold text-foreground">{job.applications.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm text-muted-foreground">New Applications</span>
                      <span className="text-lg font-semibold text-primary">
                        {job.applications.filter(app => app.status === 'applied').length}
                      </span>
                    </div>
                    
                    <Link href={`/dashboard/applications?job=${job.id}`} className="btn btn-secondary w-full">
                      Review Applications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}