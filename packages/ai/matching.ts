import { getOpenAIClient } from './client'
import type { UserProfile, IndividualProfile, Job } from '@job-board/database'

export interface JobMatchRequest {
  candidateProfile: IndividualProfile & { user_profiles: UserProfile }
  job: Job
  requiredSkills: string[]
  niceToHaveSkills: string[]
}

export interface JobMatchResponse {
  matchScore: number
  reasoning: string
  strengths: string[]
  concerns: string[]
  recommendations: string[]
}

export const matchCandidateToJob = async (request: JobMatchRequest): Promise<JobMatchResponse> => {
  const openai = getOpenAIClient()
  
  const prompt = `
You are an expert AI recruiter analyzing candidate-job compatibility. 

CANDIDATE PROFILE:
- Name: ${request.candidateProfile.user_profiles.first_name} ${request.candidateProfile.user_profiles.last_name}
- Experience: ${request.candidateProfile.years_of_experience || 0} years
- Current Role: ${request.candidateProfile.current_job_title || 'Not specified'}
- Job Search Status: ${request.candidateProfile.job_search_status}
- Remote Preference: ${request.candidateProfile.remote_preference}
- Location: ${request.candidateProfile.user_profiles.location || 'Not specified'}

JOB REQUIREMENTS:
- Title: ${request.job.title}
- Experience Level: ${request.job.experience_level}
- Work Style: ${request.job.work_style}
- Location: ${request.job.location || 'Not specified'}
- Required Skills: ${request.requiredSkills.join(', ')}
- Nice-to-Have Skills: ${request.niceToHaveSkills.join(', ')}

TASK:
Analyze this candidate's fit for the job and provide:
1. Match score (0-100)
2. Brief reasoning
3. Top 3 strengths
4. Top 3 concerns (if any)
5. Recommendations for both candidate and employer

Respond in JSON format with the structure:
{
  "matchScore": number,
  "reasoning": string,
  "strengths": string[],
  "concerns": string[],
  "recommendations": string[]
}
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI recruiter. Provide objective, unbiased candidate evaluations focused on skills and experience match.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    return JSON.parse(content) as JobMatchResponse
  } catch (error) {
    console.error('Error in job matching:', error)
    throw new Error('Failed to analyze candidate-job match')
  }
}
