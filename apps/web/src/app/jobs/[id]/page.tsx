'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { useAuthStore } from '@job-board/shared/client'
import { jobService, applicationService } from '@job-board/database'
import NeuronicLayout from '../../../components/layout/NeuronicLayout'
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
  Phone,
  Zap,
  Award,
  Target,
  Eye,
  Coffee,
  Wifi,
  Car,
  GraduationCap
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
      <NeuronicLayout variant="subtle">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">Loading Job Details</h3>
            <p className="text-white/80">Getting all the information ready for you...</p>
          </div>
        </div>
      </NeuronicLayout>
    )
  }

  if (error || !job) {
    return (
      <NeuronicLayout variant="subtle">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-white/60" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Job Not Found</h2>
            <p className="text-white/80 mb-6">
              {error || 'This job may have been removed or doesn\'t exist.'}
            </p>
            <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </NeuronicLayout>
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
    <NeuronicLayout variant="subtle">
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-white/20 backdrop-blur-md bg-white/10 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/jobs" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Jobs
                </Link>
                {isJobOwner && (
                  <Link href={`/dashboard/jobs/${job.id}/edit`} className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                    Edit Job
                  </Link>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                  <Heart className="w-4 h-4" />
                  Save
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Job Header */}
          <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                <div className="flex items-center gap-4 text-white/80 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <Link 
                      href={job.company_profiles.company_website || '#'}
                      className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                      target="_blank"
                    >
                      {job.company_profiles.company_name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location || 'Remote'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {getTimeAgo(job.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    1,234 views
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {job.applications?.length || 0} applications
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {job.salary_min && job.salary_max && (
                  <div className="text-2xl font-bold text-white mb-2">
                    {job.salary_currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                  </div>
                )}
                <div className="text-emerald-400 text-sm">+ Benefits</div>
              </div>
            </div>

            {/* Job Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/10 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-white/80 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">Type</span>
                </div>
                <div className="text-white font-semibold">{formatJobType(job.job_type)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-white/80 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Work Style</span>
                </div>
                <div className="text-white font-semibold">{formatJobType(job.work_style)}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-white/80 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Experience</span>
                </div>
                <div className="text-white font-semibold">{formatJobType(job.experience_level)} Level</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-white/80 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Category</span>
                </div>
                <div className="text-white font-semibold">{job.job_categories?.name || 'General'}</div>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Job Description</h2>
                <div className="text-white/90 space-y-4 leading-relaxed">
                  <p className="whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">Key Responsibilities</h2>
                  <div className="text-white/90 space-y-4 leading-relaxed">
                    <p className="whitespace-pre-line">
                      {job.responsibilities}
                    </p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && (
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">Requirements</h2>
                  <div className="text-white/90 space-y-4 leading-relaxed">
                    <p className="whitespace-pre-line">
                      {job.requirements}
                    </p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">Benefits & Perks</h2>
                  <div className="text-white/90 space-y-4 leading-relaxed">
                    <p className="whitespace-pre-line">
                      {job.benefits}
                    </p>
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Skills & Technologies</h2>
                
                {job.skills_required.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-red-400" />
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm border border-red-400/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.skills_nice_to_have.length > 0 && (
                  <div>
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Nice to Have
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_nice_to_have.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-full text-sm border border-emerald-400/30"
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
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-white mb-6">Apply for this role</h3>
                
                {!user ? (
                  <div className="space-y-4">
                    <p className="text-white/80 text-sm">
                      Sign in to apply for this amazing opportunity
                    </p>
                    <Link href="/auth/login" className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors font-semibold text-center block">
                      Sign In to Apply
                    </Link>
                    <Link href="/auth/register" className="w-full px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold text-center block">
                      Create Account
                    </Link>
                  </div>
                ) : profile?.user_type === 'company' ? (
                  <div className="text-center py-6">
                    <AlertCircle className="w-12 h-12 text-white/60 mx-auto mb-3" />
                    <p className="text-white/80 text-sm">
                      Company accounts cannot apply for jobs. Switch to a job seeker account to apply.
                    </p>
                  </div>
                ) : hasApplied ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h4 className="font-semibold text-emerald-400 mb-2">Application Submitted!</h4>
                    <p className="text-white/80 text-sm mb-4">
                      Your application has been sent to the hiring team.
                    </p>
                    <Link href="/dashboard/applications" className="w-full px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold text-center block">
                      Track Application
                    </Link>
                  </div>
                ) : showApplicationForm ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">
                        Cover Letter (Optional)
                      </label>
                      <textarea
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[120px] resize-none"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Tell the employer why you're interested in this role and what makes you a great fit..."
                        maxLength={1000}
                      />
                      <p className="text-xs text-white/60 mt-1">
                        {coverLetter.length}/1000 characters
                      </p>
                    </div>
                    
                    {error && (
                      <div className="p-3 bg-red-600/20 border border-red-400/30 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors font-semibold"
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
                        className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors font-semibold"
                  >
                    Apply Now
                  </button>
                )}

                {job.application_deadline && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium text-white">Deadline:</span>
                      <span className="text-white/80">
                        {new Date(job.application_deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Company Information */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">About {job.company_profiles.company_name}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-white/60" />
                    <div>
                      <p className="text-sm font-medium text-white">Industry</p>
                      <p className="text-sm text-white/80">{job.company_profiles.industry}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/60" />
                    <div>
                      <p className="text-sm font-medium text-white">Company Size</p>
                      <p className="text-sm text-white/80">{job.company_profiles.company_size} employees</p>
                    </div>
                  </div>
                  
                  {job.company_profiles.company_description && (
                    <div>
                      <p className="text-sm font-medium text-white mb-2">About the Company</p>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {job.company_profiles.company_description}
                      </p>
                    </div>
                  )}
                  
                  {job.company_profiles.company_website && (
                    <Link
                      href={job.company_profiles.company_website}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
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
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Job Performance</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-sm text-white/80">Total Applications</span>
                      <span className="text-lg font-semibold text-white">{job.applications.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-emerald-600/20 rounded-lg">
                      <span className="text-sm text-white/80">New Applications</span>
                      <span className="text-lg font-semibold text-emerald-400">
                        {job.applications.filter(app => app.status === 'applied').length}
                      </span>
                    </div>
                    
                    <Link href={`/dashboard/applications?job=${job.id}`} className="w-full px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-semibold text-center block">
                      Review Applications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NeuronicLayout>
  )
}