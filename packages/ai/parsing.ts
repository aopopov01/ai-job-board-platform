import { getOpenAIClient } from './client'

export interface CVParsingRequest {
  cvText: string
  extractSkills?: boolean
  detectFraud?: boolean
}

export interface CVParsingResponse {
  personalInfo: {
    name?: string
    email?: string
    phone?: string
    location?: string
  }
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
  skills: Array<{
    name: string
    category: string
    proficiency?: string
  }>
  fraudFlags: string[]
  summary: string
}

export const parseCVContent = async (request: CVParsingRequest): Promise<CVParsingResponse> => {
  const openai = getOpenAIClient()
  
  const prompt = `
Extract information from this CV/Resume text and detect any potential fraud indicators.

CV TEXT:
${request.cvText}

TASK:
1. Extract personal information, work experience, education, and skills
2. ${request.detectFraud ? 'Detect potential fraud indicators (copy-paste job descriptions, hidden keywords, unrealistic claims)' : ''}
3. Provide a brief professional summary

Respond in JSON format:
{
  "personalInfo": {
    "name": string,
    "email": string,
    "phone": string,
    "location": string
  },
  "experience": [{
    "title": string,
    "company": string,
    "duration": string,
    "description": string
  }],
  "education": [{
    "degree": string,
    "institution": string,
    "year": string
  }],
  "skills": [{
    "name": string,
    "category": string,
    "proficiency": string
  }],
  "fraudFlags": string[],
  "summary": string
}
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV parser and fraud detection system. Extract information accurately and flag potential inconsistencies or fraud indicators.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    return JSON.parse(content) as CVParsingResponse
  } catch (error) {
    console.error('Error parsing CV:', error)
    throw new Error('Failed to parse CV content')
  }
}

export const generateJobRecommendations = async (
  candidateProfile: any,
  availableJobs: any[],
  limit: number = 10
): Promise<string[]> => {
  const openai = getOpenAIClient()
  
  const prompt = `
Based on this candidate profile, rank the most suitable jobs from the available positions.

CANDIDATE:
- Experience: ${candidateProfile.years_of_experience || 0} years
- Current Role: ${candidateProfile.current_job_title || 'Not specified'}
- Preferences: ${candidateProfile.remote_preference}
- Skills: [Add skills when available]

AVAILABLE JOBS:
${availableJobs.map((job, index) => `
${index + 1}. ${job.title} at ${job.company_name || 'Company'}
   - Experience Level: ${job.experience_level}
   - Work Style: ${job.work_style}
   - Location: ${job.location || 'Remote'}
`).join('')}

Return the job IDs in order of best match (most suitable first), as a JSON array of strings.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert job recommendation system. Rank jobs based on candidate fit.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const recommendations = JSON.parse(content) as string[]
    return recommendations.slice(0, limit)
  } catch (error) {
    console.error('Error generating recommendations:', error)
    throw new Error('Failed to generate job recommendations')
  }
}
