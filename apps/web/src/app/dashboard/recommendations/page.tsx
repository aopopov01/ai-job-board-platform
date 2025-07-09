'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { jobService, individualProfileService, userSkillService } from '@job-board/database'
import { getJobRecommendations, type JobRecommendation } from '@job-board/ai'

export default function RecommendationsPage() {
  const { profile, user } = useAuthStore()
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user || !profile || profile.user_type !== 'individual') {
        setLoading(false)
        return
      }

      try {
        // Load user's full profile data
        const [individualProfileData, userSkillsData, jobsData] = await Promise.all([
          individualProfileService.getById(user.id),
          userSkillService.getByUser(user.id),
          jobService.search({ limit: 50 }) // Get more jobs for better recommendations
        ])

        if (individualProfileData.error || jobsData.error) {
          throw new Error('Failed to load profile or jobs data')
        }

        const candidateProfile = {
          ...individualProfileData.data,
          user_profiles: profile
        }

        const userSkills = userSkillsData.data?.map(us => (us as any).skills?.name || 'Unknown') || []
        const availableJobs = jobsData.data || []

        // Get AI-powered recommendations
        const aiRecommendations = await getJobRecommendations({
          candidateProfile,
          availableJobs: availableJobs as any,
          userSkills,
          limit: 10
        })

        setRecommendations(aiRecommendations)
      } catch (error: any) {
        console.error('Error loading recommendations:', error)
        setError(error.message || 'Failed to load job recommendations')
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [user, profile])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (profile?.user_type !== 'individual') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Job recommendations are only available for job seekers.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Analyzing jobs and generating recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Job Recommendations</h1>
        <p className="mt-1 text-sm text-gray-600">
          Personalized job recommendations based on your skills, experience, and preferences
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations available</h3>
            <p className="text-gray-500 mb-6">
              {error 
                ? 'We couldn\'t generate recommendations at this time. Please try again later.'
                : 'Complete your profile and add skills to get personalized job recommendations.'
              }
            </p>
            <div className="space-x-4">
              <Link href="/dashboard/profile">
                <Button>Complete Profile</Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline">Browse All Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🤖</span>
                <span>AI Analysis Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {recommendations.filter(r => r.priority === 'high').length}
                  </div>
                  <div className="text-sm text-gray-600">High Priority Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {recommendations.filter(r => r.priority === 'medium').length}
                  </div>
                  <div className="text-sm text-gray-600">Medium Priority Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Average Match Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.map((recommendation, index) => (
            <Card key={recommendation.job.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      <Link 
                        href={`/jobs/${recommendation.job.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {recommendation.job.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-900">
                          {recommendation.job.company_profiles.company_name}
                        </span>
                        <span>•</span>
                        <span>{recommendation.job.location || 'Remote'}</span>
                        <span>•</span>
                        <span>{recommendation.job.work_style.replace('_', ' ')}</span>
                        {recommendation.job.job_categories && (
                          <>
                            <span>•</span>
                            <span>{recommendation.job.job_categories.name}</span>
                          </>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority} priority
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {recommendation.matchScore}%
                      </div>
                      <div className="text-xs text-gray-500">match</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* AI Reasoning */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🧠 AI Analysis</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-md">
                    {recommendation.reasoning}
                  </p>
                </div>

                {/* Highlights */}
                {recommendation.highlights.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">✨ Key Highlights</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {recommendation.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-gray-700 text-sm">{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills Analysis */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🛠️ Skills Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendation.skillsMatch.matching.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-green-700 mb-1">
                          ✅ Matching Skills ({recommendation.skillsMatch.matching.length})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {recommendation.skillsMatch.matching.map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {recommendation.skillsMatch.missing.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-orange-700 mb-1">
                          📚 Skills to Learn ({recommendation.skillsMatch.missing.length})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {recommendation.skillsMatch.missing.map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-orange-100 text-orange-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Experience:</span>
                      <p className="text-gray-900">{recommendation.job.experience_level.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Industry:</span>
                      <p className="text-gray-900">{recommendation.job.company_profiles.industry}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Type:</span>
                      <p className="text-gray-900">{recommendation.job.job_type.replace('_', ' ')}</p>
                    </div>
                    {recommendation.job.salary_min && recommendation.job.salary_max && (
                      <div>
                        <span className="font-medium text-gray-500">Salary:</span>
                        <p className="text-gray-900">
                          {recommendation.job.salary_currency} {recommendation.job.salary_min.toLocaleString()}-{recommendation.job.salary_max.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Link href={`/jobs/${recommendation.job.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    Apply Now
                  </Button>
                  <Button size="sm" variant="outline">
                    Save Job
                  </Button>
                </div>
              </CardContent>

              {/* Match rank badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                  #{index + 1}
                </span>
              </div>
            </Card>
          ))}

          {/* Load More */}
          <div className="text-center py-6">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Recommendations
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}