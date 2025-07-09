import { getOpenAIClient } from './client'

export interface AdvancedMatchingRequest {
  candidateProfile: {
    id: string
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
    personality_traits?: string[]
    career_goals?: string
    work_style?: string
  }
  jobRequirements: {
    title: string
    description: string
    requirements: string
    skills_required: string[]
    skills_nice_to_have: string[]
    experience_level: string
    company_culture: string
    team_size: number
    reporting_structure: string
    growth_opportunities: string
  }
  contextualFactors: {
    company_size: string
    industry: string
    funding_stage?: string
    company_age: number
    market_position: string
    recent_news?: string[]
  }
}

export interface AdvancedMatchingResponse {
  overall_score: number // 0-100
  confidence_level: number // 0-100
  match_breakdown: {
    technical_skills: {
      score: number
      critical_gaps: string[]
      strength_areas: string[]
      learning_curve_estimate: string
    }
    experience_fit: {
      score: number
      relevant_experience: string[]
      transferable_skills: string[]
      seniority_match: boolean
    }
    cultural_fit: {
      score: number
      personality_alignment: string[]
      work_style_compatibility: string
      team_integration_likelihood: string
    }
    growth_potential: {
      score: number
      career_progression_fit: string
      learning_opportunities: string[]
      long_term_retention_likelihood: string
    }
    compensation_fit: {
      score: number
      salary_alignment: string
      negotiation_flexibility: string
      total_compensation_attractiveness: string
    }
  }
  success_predictions: {
    performance_prediction: string
    retention_likelihood: string
    promotion_timeline: string
    team_impact_assessment: string
  }
  recommendations: {
    hiring_decision: 'strong_hire' | 'hire' | 'maybe' | 'no_hire'
    interview_focus_areas: string[]
    onboarding_considerations: string[]
    development_plan_suggestions: string[]
  }
  risk_assessment: {
    flight_risk: 'low' | 'medium' | 'high'
    performance_risk: 'low' | 'medium' | 'high'
    cultural_risk: 'low' | 'medium' | 'high'
    mitigation_strategies: string[]
  }
  detailed_analysis: string
  competitive_analysis: {
    market_attractiveness: string
    candidate_uniqueness: string
    hiring_urgency: string
  }
}

export const performAdvancedMatching = async (
  request: AdvancedMatchingRequest
): Promise<AdvancedMatchingResponse> => {
  const client = getOpenAIClient()
  
  const prompt = `
Perform a comprehensive AI-powered job matching analysis for this candidate and position.

CANDIDATE PROFILE:
Skills: ${request.candidateProfile.skills.map(s => `${s.name} (${s.proficiency_level}, ${s.years_of_experience} years)`).join(', ')}

Recent Experience:
${request.candidateProfile.experience.slice(0, 3).map(exp => 
  `- ${exp.title} at ${exp.company} (${exp.duration}): ${exp.description}`
).join('\n')}

Education: ${request.candidateProfile.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})`).join(', ')}

Preferences:
- Salary: ${request.candidateProfile.preferences.salary_min}-${request.candidateProfile.preferences.salary_max}
- Remote: ${request.candidateProfile.preferences.remote_preference}
- Job Types: ${request.candidateProfile.preferences.job_types.join(', ')}
- Career Goals: ${request.candidateProfile.career_goals || 'Not specified'}
- Work Style: ${request.candidateProfile.work_style || 'Not specified'}

JOB REQUIREMENTS:
Title: ${request.jobRequirements.title}
Description: ${request.jobRequirements.description}
Requirements: ${request.jobRequirements.requirements}
Required Skills: ${request.jobRequirements.skills_required.join(', ')}
Nice-to-have Skills: ${request.jobRequirements.skills_nice_to_have.join(', ')}
Experience Level: ${request.jobRequirements.experience_level}
Company Culture: ${request.jobRequirements.company_culture}
Team Size: ${request.jobRequirements.team_size}
Growth Opportunities: ${request.jobRequirements.growth_opportunities}

COMPANY CONTEXT:
Size: ${request.contextualFactors.company_size}
Industry: ${request.contextualFactors.industry}
Age: ${request.contextualFactors.company_age} years
Market Position: ${request.contextualFactors.market_position}
Recent News: ${request.contextualFactors.recent_news?.join(', ') || 'None'}

Provide a comprehensive analysis as JSON:
{
  "overall_score": 85,
  "confidence_level": 90,
  "match_breakdown": {
    "technical_skills": {
      "score": 80,
      "critical_gaps": ["skill1", "skill2"],
      "strength_areas": ["skill3", "skill4"],
      "learning_curve_estimate": "3-6 months to full proficiency"
    },
    "experience_fit": {
      "score": 90,
      "relevant_experience": ["exp1", "exp2"],
      "transferable_skills": ["skill1", "skill2"],
      "seniority_match": true
    },
    "cultural_fit": {
      "score": 85,
      "personality_alignment": ["trait1", "trait2"],
      "work_style_compatibility": "Excellent match",
      "team_integration_likelihood": "High"
    },
    "growth_potential": {
      "score": 88,
      "career_progression_fit": "Strong alignment",
      "learning_opportunities": ["opportunity1", "opportunity2"],
      "long_term_retention_likelihood": "High"
    },
    "compensation_fit": {
      "score": 75,
      "salary_alignment": "Within range",
      "negotiation_flexibility": "Moderate",
      "total_compensation_attractiveness": "Competitive"
    }
  },
  "success_predictions": {
    "performance_prediction": "High performer with strong contribution potential",
    "retention_likelihood": "85% likely to stay 2+ years",
    "promotion_timeline": "12-18 months to next level",
    "team_impact_assessment": "Positive impact on team dynamics"
  },
  "recommendations": {
    "hiring_decision": "hire",
    "interview_focus_areas": ["technical depth", "cultural fit"],
    "onboarding_considerations": ["mentor assignment", "skill development"],
    "development_plan_suggestions": ["training programs", "stretch assignments"]
  },
  "risk_assessment": {
    "flight_risk": "low",
    "performance_risk": "low",
    "cultural_risk": "low",
    "mitigation_strategies": ["strategy1", "strategy2"]
  },
  "detailed_analysis": "Comprehensive analysis paragraph",
  "competitive_analysis": {
    "market_attractiveness": "High demand candidate",
    "candidate_uniqueness": "Unique skill combination",
    "hiring_urgency": "Act quickly"
  }
}

Be thorough, analytical, and provide actionable insights for hiring decisions.
`

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert talent acquisition specialist with deep expertise in candidate assessment, job matching, and hiring psychology. Provide comprehensive, data-driven analysis for hiring decisions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2500
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    return JSON.parse(content) as AdvancedMatchingResponse
  } catch (error) {
    console.error('Advanced matching error:', error)
    throw new Error('Failed to perform advanced matching analysis')
  }
}

export interface BatchMatchingRequest {
  candidates: Array<{
    id: string
    profile: AdvancedMatchingRequest['candidateProfile']
  }>
  jobRequirements: AdvancedMatchingRequest['jobRequirements']
  contextualFactors: AdvancedMatchingRequest['contextualFactors']
  maxResults: number
}

export interface BatchMatchingResponse {
  ranked_candidates: Array<{
    candidate_id: string
    match_score: number
    ranking_position: number
    key_strengths: string[]
    key_concerns: string[]
    quick_summary: string
  }>
  comparison_insights: {
    strongest_candidates: string[]
    skill_gaps_analysis: string[]
    diversity_assessment: string
    hiring_recommendations: string[]
  }
}

export const performBatchMatching = async (
  request: BatchMatchingRequest
): Promise<BatchMatchingResponse> => {
  const client = getOpenAIClient()
  
  const candidatesSummary = request.candidates.map((candidate, index) => 
    `Candidate ${index + 1} (ID: ${candidate.id}):
- Skills: ${candidate.profile.skills.map(s => s.name).join(', ')}
- Experience: ${candidate.profile.experience[0]?.title || 'N/A'} with ${candidate.profile.experience[0]?.duration || 'N/A'} duration
- Education: ${candidate.profile.education[0]?.degree || 'N/A'} from ${candidate.profile.education[0]?.institution || 'N/A'}`
  ).join('\n\n')

  const prompt = `
Perform batch candidate ranking and comparison for this job position.

JOB REQUIREMENTS:
${request.jobRequirements.title} - ${request.jobRequirements.description}
Required Skills: ${request.jobRequirements.skills_required.join(', ')}
Experience Level: ${request.jobRequirements.experience_level}

CANDIDATES TO EVALUATE:
${candidatesSummary}

COMPANY CONTEXT:
Industry: ${request.contextualFactors.industry}
Size: ${request.contextualFactors.company_size}
Market Position: ${request.contextualFactors.market_position}

Rank the candidates and provide analysis as JSON:
{
  "ranked_candidates": [
    {
      "candidate_id": "candidate_id_1",
      "match_score": 85,
      "ranking_position": 1,
      "key_strengths": ["strength1", "strength2"],
      "key_concerns": ["concern1", "concern2"],
      "quick_summary": "Brief candidate assessment"
    }
  ],
  "comparison_insights": {
    "strongest_candidates": ["candidate_id_1", "candidate_id_2"],
    "skill_gaps_analysis": ["Most candidates lack skill X", "Strong in area Y"],
    "diversity_assessment": "Analysis of candidate diversity",
    "hiring_recommendations": ["recommendation1", "recommendation2"]
  }
}

Rank all candidates from best to worst match, limit to top ${request.maxResults} candidates.
`

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert talent acquisition specialist specializing in candidate ranking and comparison. Provide objective, data-driven candidate assessments.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    return JSON.parse(content) as BatchMatchingResponse
  } catch (error) {
    console.error('Batch matching error:', error)
    throw new Error('Failed to perform batch matching analysis')
  }
}

export interface FraudDetectionRequest {
  candidateData: {
    resume_text: string
    application_responses: Record<string, string>
    profile_data: {
      linkedin_url?: string
      github_url?: string
      portfolio_url?: string
      phone: string
      email: string
    }
    behavioral_data: {
      application_time: number // seconds spent on application
      response_patterns: string[]
      device_info: string
      location_data?: string
    }
  }
  jobContext: {
    title: string
    company: string
    salary_range?: [number, number]
    remote_opportunity: boolean
  }
}

export interface FraudDetectionResponse {
  fraud_risk_score: number // 0-100, higher = more suspicious
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  detected_flags: Array<{
    flag_type: string
    severity: 'low' | 'medium' | 'high'
    description: string
    evidence: string[]
  }>
  verification_recommendations: string[]
  manual_review_required: boolean
  confidence_level: number
  detailed_analysis: string
}

export const detectApplicationFraud = async (
  request: FraudDetectionRequest
): Promise<FraudDetectionResponse> => {
  const client = getOpenAIClient()
  
  const prompt = `
Analyze this job application for potential fraud indicators and suspicious patterns.

CANDIDATE DATA:
Resume Text: ${request.candidateData.resume_text}
Application Responses: ${JSON.stringify(request.candidateData.application_responses)}
Profile URLs: LinkedIn: ${request.candidateData.profile_data.linkedin_url || 'None'}, GitHub: ${request.candidateData.profile_data.github_url || 'None'}
Contact: ${request.candidateData.profile_data.email}, ${request.candidateData.profile_data.phone}

BEHAVIORAL DATA:
Application Time: ${request.candidateData.behavioral_data.application_time} seconds
Response Patterns: ${request.candidateData.behavioral_data.response_patterns.join(', ')}
Device: ${request.candidateData.behavioral_data.device_info}
Location: ${request.candidateData.behavioral_data.location_data || 'Not available'}

JOB CONTEXT:
Position: ${request.jobContext.title} at ${request.jobContext.company}
Salary Range: ${request.jobContext.salary_range ? `${request.jobContext.salary_range[0]}-${request.jobContext.salary_range[1]}` : 'Not specified'}
Remote: ${request.jobContext.remote_opportunity ? 'Yes' : 'No'}

FRAUD DETECTION ANALYSIS:
Look for these red flags:
1. Inconsistent information between resume and application
2. Unrealistic experience claims for age/timeline
3. Copy-pasted generic responses
4. Suspicious contact information patterns
5. Extremely fast application completion times
6. Inconsistent writing styles
7. Unrealistic salary expectations
8. Missing or suspicious social media profiles
9. Generic or templated responses
10. Technical skills not matching claimed experience

Provide analysis as JSON:
{
  "fraud_risk_score": 25,
  "risk_level": "low",
  "detected_flags": [
    {
      "flag_type": "inconsistent_timeline",
      "severity": "medium",
      "description": "Experience timeline doesn't match claimed years",
      "evidence": ["evidence1", "evidence2"]
    }
  ],
  "verification_recommendations": ["recommendation1", "recommendation2"],
  "manual_review_required": false,
  "confidence_level": 85,
  "detailed_analysis": "Comprehensive fraud analysis explanation"
}

Be thorough but avoid false positives. Only flag genuine concerns.
`

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert fraud detection specialist with expertise in identifying fake applications, resume fraud, and application manipulation. Be thorough but avoid false positives.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1500
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    return JSON.parse(content) as FraudDetectionResponse
  } catch (error) {
    console.error('Fraud detection error:', error)
    throw new Error('Failed to perform fraud detection analysis')
  }
}