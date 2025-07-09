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

export interface JobRecommendationRequest {
  candidateProfile: IndividualProfile & { user_profiles: UserProfile }
  availableJobs: Array<Job & { 
    company_profiles: { company_name: string; industry: string }
    job_categories?: { name: string }
  }>
  userSkills: string[]
  limit?: number
}

export interface JobRecommendation {
  job: Job & { 
    company_profiles: { company_name: string; industry: string }
    job_categories?: { name: string }
  }
  matchScore: number
  reasoning: string
  highlights: string[]
  skillsMatch: {
    matching: string[]
    missing: string[]
  }
  priority: 'high' | 'medium' | 'low'
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
    
    // Handle different error types
    if (error.code === 'insufficient_quota') {
      throw new Error('AI service quota exceeded. Please try again later.')
    }
    
    if (error.code === 'rate_limit_exceeded') {
      throw new Error('Too many requests. Please wait before trying again.')
    }
    
    if (error.code === 'invalid_api_key') {
      throw new Error('AI service configuration error. Please contact support.')
    }
    
    if (error.name === 'SyntaxError') {
      console.error('Failed to parse AI response:', content)
      throw new Error('Invalid AI response format')
    }
    
    // Return fallback response for better user experience
    return {
      score: 0,
      fit_analysis: 'Unable to analyze match due to technical issues',
      strengths: [],
      weaknesses: ['Technical analysis unavailable'],
      recommendations: ['Please try again later or contact support']
    }
  }
  }
}

export const getJobRecommendations = async (request: JobRecommendationRequest): Promise<JobRecommendation[]> => {
  const openai = getOpenAIClient()
  
  const candidateInfo = `
CANDIDATE PROFILE:
- Experience: ${request.candidateProfile.years_of_experience || 0} years
- Current Role: ${request.candidateProfile.current_job_title || 'Not specified'}
- Job Search Status: ${request.candidateProfile.job_search_status}
- Remote Preference: ${request.candidateProfile.remote_preference}
- Location: ${request.candidateProfile.user_profiles.location || 'Not specified'}
- Skills: ${request.userSkills.join(', ')}
- Salary Expectations: ${request.candidateProfile.salary_expectation_min && request.candidateProfile.salary_expectation_max 
  ? `${request.candidateProfile.salary_currency} ${request.candidateProfile.salary_expectation_min}-${request.candidateProfile.salary_expectation_max}`
  : 'Not specified'}
`

  const jobsInfo = request.availableJobs.map((job, index) => `
JOB ${index + 1}:
- ID: ${job.id}
- Title: ${job.title}
- Company: ${job.company_profiles.company_name} (${job.company_profiles.industry})
- Experience Level: ${job.experience_level}
- Work Style: ${job.work_style}
- Location: ${job.location || 'Not specified'}
- Salary: ${job.salary_min && job.salary_max ? `${job.salary_currency} ${job.salary_min}-${job.salary_max}` : 'Not specified'}
- Category: ${job.job_categories?.name || 'Not specified'}
- Description: ${job.description.substring(0, 200)}...
- Skills Required: ${job.skills_required.join(', ')}
`).join('\n')

  const prompt = `
${candidateInfo}

AVAILABLE JOBS:
${jobsInfo}

TASK:
Analyze each job for this candidate and recommend the top ${request.limit || 5} best matches. For each recommendation, provide:

1. Match score (0-100) based on:
   - Skills alignment (40%)
   - Experience level fit (25%)
   - Salary compatibility (15%)
   - Location/work style match (10%)
   - Industry/role relevance (10%)

2. Clear reasoning for the match
3. Key highlights that make this job attractive
4. Skills analysis (matching vs missing)
5. Priority level (high: 80+, medium: 60-79, low: 40-59)

Return a JSON array with this structure:
[
  {
    "jobId": "job-id",
    "matchScore": 85,
    "reasoning": "Strong alignment with your React/TypeScript skills and senior-level experience",
    "highlights": [
      "Perfect match for your frontend expertise",
      "Remote-first company culture",
      "Competitive salary range"
    ],
    "skillsMatch": {
      "matching": ["React", "TypeScript", "Node.js"],
      "missing": ["GraphQL", "AWS"]
    },
    "priority": "high"
  }
]

Only include jobs with a match score of 40 or higher. Sort by match score descending.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career advisor AI. Provide personalized job recommendations based on detailed candidate analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return []
    }

    const recommendations = JSON.parse(content)
    
    // Map the recommendations back to include full job objects
    return recommendations.map((rec: any) => {
      const job = request.availableJobs.find(j => j.id === rec.jobId)
      if (!job) return null
      
      return {
        job,
        matchScore: rec.matchScore,
        reasoning: rec.reasoning,
        highlights: rec.highlights,
        skillsMatch: rec.skillsMatch,
        priority: rec.priority
      }
    }).filter(Boolean)

  } catch (error) {
    console.error('Error getting job recommendations:', error)
    
    // Fallback: Simple scoring algorithm
    return request.availableJobs
      .map(job => {
        const score = calculateSimpleMatchScore(request.candidateProfile, job, request.userSkills)
        if (score < 40) return null
        
        return {
          job,
          matchScore: score,
          reasoning: `Based on experience level and basic skill matching`,
          highlights: [`${score > 70 ? 'Good' : 'Partial'} skills match`, 'Experience level alignment'],
          skillsMatch: {
            matching: job.skills_required.filter(skill => 
              request.userSkills.some(userSkill => 
                userSkill.toLowerCase().includes(skill.toLowerCase())
              )
            ),
            missing: job.skills_required.filter(skill => 
              !request.userSkills.some(userSkill => 
                userSkill.toLowerCase().includes(skill.toLowerCase())
              )
            )
          },
          priority: score > 70 ? 'high' as const : score > 55 ? 'medium' as const : 'low' as const
        }
      })
      .filter((item): item is JobRecommendation => item !== null)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, request.limit || 5)
  }
}

function calculateSimpleMatchScore(
  candidate: IndividualProfile & { user_profiles: UserProfile }, 
  job: any, 
  userSkills: string[]
): number {
  let score = 0
  
  // Skills match (40% weight)
  const skillsMatch = job.skills_required.filter((skill: string) => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  ).length
  
  const skillsScore = job.skills_required.length > 0 
    ? (skillsMatch / job.skills_required.length) * 40 
    : 20
  
  score += skillsScore
  
  // Experience match (25% weight)
  const expMap = { entry: 1, mid: 3, senior: 7, lead: 10, executive: 15 }
  const jobExpLevel = expMap[job.experience_level as keyof typeof expMap] || 3
  const candidateExp = candidate.years_of_experience || 0
  
  const expDiff = Math.abs(candidateExp - jobExpLevel)
  const expScore = Math.max(0, 25 - (expDiff * 3))
  score += expScore
  
  // Work style match (15% weight)
  const workMatch = candidate.remote_preference === 'flexible' ? 15 :
    candidate.remote_preference === job.work_style ? 15 :
    candidate.remote_preference === 'hybrid' && job.work_style !== 'onsite' ? 12 :
    8
  score += workMatch
  
  // Salary match (10% weight)
  if (candidate.salary_expectation_min && job.salary_max) {
    score += job.salary_max >= candidate.salary_expectation_min ? 10 : 5
  } else {
    score += 8 // neutral if unknown
  }
  
  // Base relevance (10% weight)
  score += 10
  
  return Math.min(Math.round(score), 100)
}
