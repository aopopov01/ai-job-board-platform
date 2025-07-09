'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { jobService, individualProfileService, userSkillService } from '@job-board/database'
import { performAdvancedMatching, performBatchMatching, detectApplicationFraud } from '@job-board/ai'
import type { AdvancedMatchingResponse, BatchMatchingResponse } from '@job-board/ai'

interface JobPosition {
  id: string
  title: string
  description: string
  requirements: string
  skills_required: string[]
  skills_nice_to_have: string[]
  experience_level: string
  company_culture: string
  team_size: number
  growth_opportunities: string
}

interface CandidateProfile {
  id: string
  user_profiles: {
    first_name: string
    last_name: string
    email: string
  }
  skills: Array<{
    name: string
    proficiency_level: string
    years_of_experience: number
  }>
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  preferences: {
    salary_min: number
    salary_max: number
    remote_preference: string
    job_types: string[]
  }
}

export default function AdvancedMatchingPage() {
  const { profile, user } = useAuthStore()
  const [jobs, setJobs] = useState<JobPosition[]>([])
  const [candidates, setCandidates] = useState<CandidateProfile[]>([])
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [matchingResults, setMatchingResults] = useState<BatchMatchingResponse | null>(null)
  const [detailedAnalysis, setDetailedAnalysis] = useState<Record<string, AdvancedMatchingResponse>>({})
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      if (!user || !profile || profile.user_type !== 'company') return

      try {
        setLoading(true)
        
        // Load company jobs
        const { data: jobsData, error: jobsError } = await jobService.getByCompany(profile.id)
        if (jobsError) throw jobsError
        setJobs((jobsData || []).map(job => ({
          ...job,
          requirements: (job as any).requirements || '',
          company_culture: (job as any).company_culture || '',
          team_size: (job as any).team_size || 5,
          growth_opportunities: (job as any).growth_opportunities || ''
        })))

        // Load active candidates
        const { data: candidatesData, error: candidatesError } = await individualProfileService.getByJobSearchStatus('actively_looking')
        if (candidatesError) throw candidatesError

        // Get skills for each candidate
        const candidatesWithSkills = await Promise.all(
          (candidatesData || []).slice(0, 20).map(async (candidate: any) => {
            const { data: skillsData } = await userSkillService.getByUser(candidate.id)
            return {
              ...candidate,
              skills: skillsData?.map((userSkill: any) => ({
                name: userSkill.skills?.name || 'Unknown',
                proficiency_level: userSkill.proficiency_level,
                years_of_experience: userSkill.years_of_experience || 0
              })) || [],
              experience: candidate.experience || [],
              education: candidate.education || [],
              preferences: {
                salary_min: candidate.salary_expectation_min || 0,
                salary_max: candidate.salary_expectation_max || 0,
                remote_preference: candidate.remote_preference || 'flexible',
                job_types: ['full_time']
              }
            }
          })
        )

        setCandidates(candidatesWithSkills)
      } catch (error: any) {
        setError(error.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, profile])

  const performBatchAnalysis = async () => {
    if (!selectedJob || selectedCandidates.length === 0) return

    setAnalyzing(true)
    try {
      const selectedJobData = jobs.find(j => j.id === selectedJob)
      if (!selectedJobData) throw new Error('Job not found')

      const selectedCandidateData = candidates.filter(c => selectedCandidates.includes(c.id))

      const batchRequest = {
        candidates: selectedCandidateData.map(candidate => ({
          id: candidate.id,
          profile: {
            id: candidate.id,
            skills: candidate.skills,
            experience: candidate.experience,
            education: candidate.education,
            preferences: candidate.preferences,
            personality_traits: [],
            career_goals: '',
            work_style: ''
          }
        })),
        jobRequirements: {
          title: selectedJobData.title,
          description: selectedJobData.description,
          requirements: selectedJobData.requirements,
          skills_required: selectedJobData.skills_required,
          skills_nice_to_have: selectedJobData.skills_nice_to_have,
          experience_level: selectedJobData.experience_level,
          company_culture: selectedJobData.company_culture || 'Collaborative and innovative',
          team_size: selectedJobData.team_size || 5,
          reporting_structure: 'Flat organization',
          growth_opportunities: selectedJobData.growth_opportunities || 'Excellent growth potential'
        },
        contextualFactors: {
          company_size: (profile as any)?.company_size || 'mid-size',
          industry: (profile as any)?.industry || 'Technology',
          company_age: new Date().getFullYear() - ((profile as any)?.founded_year || 2020),
          market_position: 'Growing',
          recent_news: []
        },
        maxResults: 10
      }

      const results = await performBatchMatching(batchRequest)
      setMatchingResults(results)

      // Get detailed analysis for top candidates
      const topCandidates = results.ranked_candidates.slice(0, 5)
      const detailedAnalysisPromises = topCandidates.map(async (rankedCandidate) => {
        const candidateData = selectedCandidateData.find(c => c.id === rankedCandidate.candidate_id)
        if (!candidateData) return null

        const detailedRequest = {
          candidateProfile: {
            id: candidateData.id,
            skills: candidateData.skills,
            experience: candidateData.experience,
            education: candidateData.education,
            preferences: candidateData.preferences,
            personality_traits: [],
            career_goals: '',
            work_style: ''
          },
          jobRequirements: batchRequest.jobRequirements,
          contextualFactors: batchRequest.contextualFactors
        }

        const analysis = await performAdvancedMatching(detailedRequest)
        return { candidateId: rankedCandidate.candidate_id, analysis }
      })

      const detailedResults = await Promise.all(detailedAnalysisPromises)
      const detailedAnalysisMap: Record<string, AdvancedMatchingResponse> = {}
      detailedResults.forEach(result => {
        if (result) {
          detailedAnalysisMap[result.candidateId] = result.analysis
        }
      })

      setDetailedAnalysis(detailedAnalysisMap)
    } catch (error: any) {
      setError(error.message || 'Failed to perform advanced matching')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 75) return 'text-blue-600 bg-blue-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getHiringDecisionColor = (decision: string) => {
    switch (decision) {
      case 'strong_hire': return 'bg-green-100 text-green-800'
      case 'hire': return 'bg-blue-100 text-blue-800'
      case 'maybe': return 'bg-yellow-100 text-yellow-800'
      case 'no_hire': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (profile?.user_type !== 'company') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Advanced matching is only available for company accounts.</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Advanced AI Matching</h1>
        <p className="mt-1 text-sm text-gray-600">
          Comprehensive candidate analysis with deep insights and predictions
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Job Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Job Position</CardTitle>
          <CardDescription>Choose the job position you want to analyze candidates for</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={selectedJob || ''}
            onChange={(e) => setSelectedJob(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a job position...</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Candidate Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Candidates</CardTitle>
          <CardDescription>Choose up to 10 candidates to analyze against the selected position</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {candidates.map(candidate => (
              <label key={candidate.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(candidate.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCandidates(prev => [...prev, candidate.id].slice(0, 10))
                    } else {
                      setSelectedCandidates(prev => prev.filter(id => id !== candidate.id))
                    }
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {candidate.user_profiles.first_name} {candidate.user_profiles.last_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {candidate.skills.slice(0, 3).map(skill => skill.name).join(', ')}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {selectedCandidates.length} of 10 candidates selected
            </span>
            <Button
              onClick={performBatchAnalysis}
              disabled={!selectedJob || selectedCandidates.length === 0 || analyzing}
              className="ml-4"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Candidates'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {matchingResults && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>🤖 AI Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strongest Candidates</h4>
                  <ul className="space-y-1">
                    {matchingResults.comparison_insights.strongest_candidates.map((candidateId, index) => {
                      const candidate = candidates.find(c => c.id === candidateId)
                      return (
                        <li key={index} className="text-sm text-gray-700">
                          • {candidate?.user_profiles.first_name} {candidate?.user_profiles.last_name}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Hiring Recommendations</h4>
                  <ul className="space-y-1">
                    {matchingResults.comparison_insights.hiring_recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700">• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-900 mb-1">Diversity Assessment</h4>
                <p className="text-sm text-blue-800">{matchingResults.comparison_insights.diversity_assessment}</p>
              </div>
            </CardContent>
          </Card>

          {/* Ranked Candidates */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Ranked Candidates</h2>
            {matchingResults.ranked_candidates.map((rankedCandidate, index) => {
              const candidate = candidates.find(c => c.id === rankedCandidate.candidate_id)
              const detailedAnalysisData = detailedAnalysis[rankedCandidate.candidate_id]
              
              return (
                <Card key={rankedCandidate.candidate_id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center space-x-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                            #{rankedCandidate.ranking_position}
                          </span>
                          <span>{candidate?.user_profiles.first_name} {candidate?.user_profiles.last_name}</span>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {rankedCandidate.quick_summary}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(rankedCandidate.match_score)}`}>
                          {rankedCandidate.match_score}% match
                        </div>
                        {detailedAnalysisData && (
                          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${getHiringDecisionColor(detailedAnalysisData.recommendations.hiring_decision)}`}>
                            {detailedAnalysisData.recommendations.hiring_decision.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Quick Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Key Strengths</h4>
                          <ul className="space-y-1">
                            {rankedCandidate.key_strengths.map((strength, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-800 mb-2">Key Concerns</h4>
                          <ul className="space-y-1">
                            {rankedCandidate.key_concerns.map((concern, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start">
                                <span className="text-red-600 mr-2">!</span>
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Detailed Analysis */}
                      {detailedAnalysisData && (
                        <div className="space-y-4 pt-4 border-t">
                          <h4 className="font-medium text-gray-900">Detailed Analysis</h4>
                          
                          {/* Score Breakdown */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {detailedAnalysisData.match_breakdown.technical_skills.score}%
                              </div>
                              <div className="text-xs text-gray-600">Technical Skills</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">
                                {detailedAnalysisData.match_breakdown.experience_fit.score}%
                              </div>
                              <div className="text-xs text-gray-600">Experience</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600">
                                {detailedAnalysisData.match_breakdown.cultural_fit.score}%
                              </div>
                              <div className="text-xs text-gray-600">Cultural Fit</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-yellow-600">
                                {detailedAnalysisData.match_breakdown.growth_potential.score}%
                              </div>
                              <div className="text-xs text-gray-600">Growth Potential</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-600">
                                {detailedAnalysisData.match_breakdown.compensation_fit.score}%
                              </div>
                              <div className="text-xs text-gray-600">Compensation</div>
                            </div>
                          </div>

                          {/* Predictions */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Success Predictions</h5>
                            <div className="space-y-2 text-sm">
                              <div><strong>Performance:</strong> {detailedAnalysisData.success_predictions.performance_prediction}</div>
                              <div><strong>Retention:</strong> {detailedAnalysisData.success_predictions.retention_likelihood}</div>
                              <div><strong>Promotion Timeline:</strong> {detailedAnalysisData.success_predictions.promotion_timeline}</div>
                            </div>
                          </div>

                          {/* Risk Assessment */}
                          <div className="bg-red-50 p-4 rounded-lg">
                            <h5 className="font-medium text-red-900 mb-2">Risk Assessment</h5>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <strong>Flight Risk:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                  detailedAnalysisData.risk_assessment.flight_risk === 'low' ? 'bg-green-100 text-green-800' :
                                  detailedAnalysisData.risk_assessment.flight_risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {detailedAnalysisData.risk_assessment.flight_risk}
                                </span>
                              </div>
                              <div>
                                <strong>Performance Risk:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                  detailedAnalysisData.risk_assessment.performance_risk === 'low' ? 'bg-green-100 text-green-800' :
                                  detailedAnalysisData.risk_assessment.performance_risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {detailedAnalysisData.risk_assessment.performance_risk}
                                </span>
                              </div>
                              <div>
                                <strong>Cultural Risk:</strong> 
                                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                  detailedAnalysisData.risk_assessment.cultural_risk === 'low' ? 'bg-green-100 text-green-800' :
                                  detailedAnalysisData.risk_assessment.cultural_risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {detailedAnalysisData.risk_assessment.cultural_risk}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Recommendations */}
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h5 className="font-medium text-blue-900 mb-2">Interview & Onboarding Recommendations</h5>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Interview Focus:</strong> {detailedAnalysisData.recommendations.interview_focus_areas.join(', ')}
                              </div>
                              <div>
                                <strong>Onboarding:</strong> {detailedAnalysisData.recommendations.onboarding_considerations.join(', ')}
                              </div>
                              <div>
                                <strong>Development:</strong> {detailedAnalysisData.recommendations.development_plan_suggestions.join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}