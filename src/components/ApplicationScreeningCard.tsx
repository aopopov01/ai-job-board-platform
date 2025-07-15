'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'

interface ApplicationScreeningCardProps {
  application: {
    id: string
    ai_screening_score: number
    ai_screening_notes: any
    status: string
    applied_at: string
    individual_profiles?: {
      user_profiles: {
        first_name: string
        last_name: string
      }
      current_job_title: string
      years_of_experience: number
    }
  }
  onStatusUpdate: (applicationId: string, newStatus: string) => void
}

export default function ApplicationScreeningCard({ application, onStatusUpdate }: ApplicationScreeningCardProps) {
  const screeningData = application.ai_screening_notes ? JSON.parse(application.ai_screening_notes) : null

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-blue-600 bg-blue-50'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'hire': return 'bg-green-100 text-green-800'
      case 'interview': return 'bg-blue-100 text-blue-800'
      case 'maybe': return 'bg-yellow-100 text-yellow-800'
      case 'pass': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {application.individual_profiles?.user_profiles.first_name} {application.individual_profiles?.user_profiles.last_name}
            </CardTitle>
            <CardDescription>
              {application.individual_profiles?.current_job_title} • {application.individual_profiles?.years_of_experience} years experience
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            {application.ai_screening_score && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(application.ai_screening_score)}`}>
                {application.ai_screening_score}/100
              </div>
            )}
            {screeningData?.recommendation && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(screeningData.recommendation)}`}>
                {screeningData.recommendation}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {screeningData && (
          <div className="space-y-4">
            {/* AI Summary */}
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">AI Assessment Summary</h4>
              <p className="text-sm text-gray-700">{screeningData.summary}</p>
            </div>

            {/* Strengths and Concerns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {screeningData.strengths && screeningData.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {screeningData.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {screeningData.concerns && screeningData.concerns.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Concerns</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {screeningData.concerns.map((concern: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 mr-2">!</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Skills Match */}
            {screeningData.skillMatch && (
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Skills Analysis</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Required Skills Match:</span>
                    <div className="text-blue-700">{screeningData.skillMatch.requiredSkillsMatch}%</div>
                  </div>
                  <div>
                    <span className="font-medium">Nice-to-Have Match:</span>
                    <div className="text-blue-700">{screeningData.skillMatch.niceToHaveSkillsMatch}%</div>
                  </div>
                </div>
                
                {screeningData.skillMatch.matchedSkills && screeningData.skillMatch.matchedSkills.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium text-green-800">Matched Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {screeningData.skillMatch.matchedSkills.map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {screeningData.skillMatch.missingSkills && screeningData.skillMatch.missingSkills.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium text-red-800">Missing Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {screeningData.skillMatch.missingSkills.map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Interview Questions */}
            {screeningData.interviewQuestions && screeningData.interviewQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-md">
                <h4 className="font-medium text-purple-900 mb-2">Suggested Interview Questions</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  {screeningData.interviewQuestions.map((question: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">{index + 1}.</span>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(application.id, 'screening')}
                disabled={['screening', 'shortlisted', 'hired', 'rejected'].includes(application.status)}
              >
                Start Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(application.id, 'shortlisted')}
                disabled={['hired', 'rejected'].includes(application.status)}
              >
                Shortlist
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(application.id, 'interview_scheduled')}
                disabled={['hired', 'rejected'].includes(application.status)}
              >
                Schedule Interview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(application.id, 'offered')}
                disabled={['hired', 'rejected'].includes(application.status)}
              >
                Make Offer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(application.id, 'hired')}
                disabled={application.status === 'rejected'}
                className="text-green-600 hover:text-green-700"
              >
                Hire
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusUpdate(application.id, 'rejected')}
                disabled={application.status === 'hired'}
                className="text-red-600 hover:text-red-700"
              >
                Reject
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}