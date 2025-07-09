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

export interface ApplicationScreeningRequest {
  candidateData: {
    name: string
    years_of_experience: number
    current_job_title: string
    skills: string[]
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
  }
  jobRequirements: {
    title: string
    description: string
    requirements: string
    skills_required: string[]
    skills_nice_to_have: string[]
    experience_level: string
    job_type: string
    work_style: string
  }
  coverLetter?: string
}

export interface ApplicationScreeningResponse {
  score: number // 0-100
  recommendation: 'hire' | 'interview' | 'maybe' | 'pass'
  strengths: string[]
  concerns: string[]
  skillMatch: {
    requiredSkillsMatch: number // percentage
    niceToHaveSkillsMatch: number // percentage
    matchedSkills: string[]
    missingSkills: string[]
  }
  experienceMatch: {
    levelMatch: boolean
    relevantExperience: string[]
    experienceScore: number
  }
  summary: string
  interviewQuestions?: string[]
}

export const screenApplication = async (request: ApplicationScreeningRequest): Promise<ApplicationScreeningResponse> => {
  const openai = getOpenAIClient()
  
  const prompt = `
Analyze this job application and provide a comprehensive screening assessment.

JOB REQUIREMENTS:
Title: ${request.jobRequirements.title}
Description: ${request.jobRequirements.description}
Requirements: ${request.jobRequirements.requirements}
Required Skills: ${request.jobRequirements.skills_required.join(', ')}
Nice-to-have Skills: ${request.jobRequirements.skills_nice_to_have.join(', ')}
Experience Level: ${request.jobRequirements.experience_level}
Job Type: ${request.jobRequirements.job_type}
Work Style: ${request.jobRequirements.work_style}

CANDIDATE:
Name: ${request.candidateData.name}
Years of Experience: ${request.candidateData.years_of_experience}
Current Role: ${request.candidateData.current_job_title}
Skills: ${request.candidateData.skills.join(', ')}

Recent Experience:
${request.candidateData.experience.slice(0, 3).map(exp => 
  `- ${exp.title} at ${exp.company} (${exp.duration}): ${exp.description.slice(0, 200)}...`
).join('\n')}

Education:
${request.candidateData.education.map(edu => 
  `- ${edu.degree} from ${edu.institution} (${edu.year})`
).join('\n')}

${request.coverLetter ? `Cover Letter: ${request.coverLetter}` : ''}

Provide analysis as JSON:
{
  "score": 85,
  "recommendation": "interview",
  "strengths": ["Strong technical background", "Relevant experience"],
  "concerns": ["Limited experience with specific technology"],
  "skillMatch": {
    "requiredSkillsMatch": 80,
    "niceToHaveSkillsMatch": 60,
    "matchedSkills": ["skill1", "skill2"],
    "missingSkills": ["skill3"]
  },
  "experienceMatch": {
    "levelMatch": true,
    "relevantExperience": ["description1", "description2"],
    "experienceScore": 85
  },
  "summary": "Comprehensive assessment summary",
  "interviewQuestions": ["Question about missing skills", "Question about experience"]
}

Recommendation levels:
- hire: 90-100 (exceptional fit)
- interview: 70-89 (good fit, worth interviewing)
- maybe: 50-69 (borderline, consider if desperate)
- pass: 0-49 (not a good fit)
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert talent acquisition specialist. Provide thorough, fair, and unbiased candidate assessments. Focus on skills, experience, and job fit.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    return JSON.parse(content) as ApplicationScreeningResponse
  } catch (error) {
    console.error('Error screening application:', error)
    throw new Error('Failed to screen application')
  }
}
