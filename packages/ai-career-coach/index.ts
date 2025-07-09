import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export interface CareerGoal {
  id: string
  userId: string
  targetRole: string
  targetIndustry: string
  targetCompany?: string
  timeframe: '3_months' | '6_months' | '1_year' | '2_years' | '5_years'
  priority: 'high' | 'medium' | 'low'
  currentProgress: number // 0-100
  milestones: CareerMilestone[]
  createdAt: string
  updatedAt: string
}

export interface CareerMilestone {
  id: string
  title: string
  description: string
  targetDate: string
  completed: boolean
  completedAt?: string
  requiredSkills: string[]
  requiredExperience: string[]
  estimatedDifficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

export interface SkillGap {
  skill: string
  currentLevel: number // 0-100
  requiredLevel: number // 0-100
  gap: number
  importance: 'critical' | 'important' | 'nice_to_have'
  learningResources: LearningResource[]
  estimatedTimeToAcquire: number // days
}

export interface LearningResource {
  id: string
  title: string
  type: 'course' | 'certification' | 'book' | 'article' | 'video' | 'practice'
  provider: string
  url: string
  duration: number // hours
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  cost: number
  rating: number
  relevanceScore: number // 0-100
}

export interface CareerPathRecommendation {
  id: string
  userId: string
  currentRole: string
  targetRole: string
  pathSteps: CareerStep[]
  estimatedTimeframe: string
  successProbability: number // 0-100
  requiredSkills: string[]
  salaryProgression: SalaryProgression
  recommendationReason: string
  alternatives: AlternativePath[]
}

export interface CareerStep {
  stepNumber: number
  role: string
  description: string
  typicalDuration: string
  requiredSkills: string[]
  expectedSalaryRange: {
    min: number
    max: number
    currency: string
  }
  companies: string[]
  successTips: string[]
}

export interface SalaryProgression {
  current: number
  sixMonths: number
  oneYear: number
  twoYears: number
  fiveYears: number
  currency: string
}

export interface AlternativePath {
  pathName: string
  description: string
  timeframe: string
  difficulty: 'easier' | 'similar' | 'harder'
  salaryPotential: 'lower' | 'similar' | 'higher'
}

export interface InterviewPreparation {
  id: string
  userId: string
  jobId?: string
  company: string
  role: string
  interviewType: 'phone' | 'video' | 'in_person' | 'technical' | 'behavioral' | 'case_study'
  questions: InterviewQuestion[]
  userResponses: InterviewResponse[]
  feedback: InterviewFeedback
  overallScore: number // 0-100
  createdAt: string
}

export interface InterviewQuestion {
  id: string
  question: string
  type: 'behavioral' | 'technical' | 'situational' | 'company_specific'
  difficulty: 'easy' | 'medium' | 'hard'
  suggestedAnswerStructure: string
  keyPoints: string[]
  commonMistakes: string[]
}

export interface InterviewResponse {
  questionId: string
  userAnswer: string
  recordingUrl?: string
  responseTime: number // seconds
  confidence: number // 0-100
  clarity: number // 0-100
  relevance: number // 0-100
}

export interface InterviewFeedback {
  strengths: string[]
  improvements: string[]
  technicalScore: number
  communicationScore: number
  confidenceScore: number
  overallRecommendation: string
  nextSteps: string[]
}

export interface SalaryNegotiation {
  id: string
  userId: string
  currentOffer?: {
    baseSalary: number
    bonus: number
    equity: number
    benefits: string[]
    currency: string
  }
  marketData: {
    percentile25: number
    percentile50: number
    percentile75: number
    percentile90: number
    averageTotalComp: number
    currency: string
  }
  negotiationStrategy: NegotiationStrategy
  practiceScenarios: NegotiationScenario[]
  recommendations: string[]
}

export interface NegotiationStrategy {
  approach: 'collaborative' | 'competitive' | 'accommodating'
  keyPoints: string[]
  fallbackOptions: string[]
  walkAwayPoint: number
  idealOutcome: number
  timeline: string
}

export interface NegotiationScenario {
  id: string
  scenario: string
  employerResponse: string
  suggestedReply: string
  reasoning: string
  alternativeReplies: string[]
}

export class AICareerCoach {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // Career Planning & Goal Setting
  async createCareerGoal(goalData: Omit<CareerGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'currentProgress' | 'milestones'>): Promise<CareerGoal> {
    const goal: CareerGoal = {
      id: this.generateId(),
      userId: this.userId,
      ...goalData,
      currentProgress: 0,
      milestones: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Generate AI-powered milestones
    const milestones = await this.generateCareerMilestones(goal)
    goal.milestones = milestones

    try {
      await supabase
        .from('career_goals')
        .insert({
          id: goal.id,
          user_id: goal.userId,
          target_role: goal.targetRole,
          target_industry: goal.targetIndustry,
          target_company: goal.targetCompany,
          timeframe: goal.timeframe,
          priority: goal.priority,
          current_progress: goal.currentProgress,
          milestones: goal.milestones,
          created_at: goal.createdAt,
          updated_at: goal.updatedAt
        })

      return goal
    } catch (error) {
      console.error('Failed to create career goal:', error)
      throw error
    }
  }

  async generateCareerPath(targetRole: string, currentRole?: string): Promise<CareerPathRecommendation> {
    try {
      // Get user's current profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', this.userId)
        .single()

      if (!profile) throw new Error('User profile not found')

      // Get user's skills and experience
      const { data: userSkills } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', this.userId)

      const prompt = `
        Create a detailed career path recommendation for a professional transitioning from "${currentRole || profile.current_role || 'their current position'}" to "${targetRole}".
        
        Current Profile:
        - Role: ${profile.current_role || 'Not specified'}
        - Industry: ${profile.industry || 'Not specified'}
        - Experience: ${profile.years_experience || 0} years
        - Skills: ${userSkills?.map(s => s.skill_name).join(', ') || 'Not specified'}
        - Education: ${profile.education || 'Not specified'}
        
        Please provide:
        1. A step-by-step career progression path (3-5 steps)
        2. Required skills for each step
        3. Estimated timeframes and salary ranges
        4. Success probability assessment
        5. Alternative paths to consider
        6. Specific recommendations and action items
        
        Format as detailed JSON with realistic market data.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert career coach with deep knowledge of industry career paths, salary data, and professional development. Provide detailed, actionable career guidance based on current market conditions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')

      const recommendation: CareerPathRecommendation = {
        id: this.generateId(),
        userId: this.userId,
        currentRole: currentRole || profile.current_role || 'Current Position',
        targetRole,
        pathSteps: aiResponse.pathSteps || [],
        estimatedTimeframe: aiResponse.estimatedTimeframe || '2-3 years',
        successProbability: aiResponse.successProbability || 75,
        requiredSkills: aiResponse.requiredSkills || [],
        salaryProgression: aiResponse.salaryProgression || {
          current: 50000,
          sixMonths: 55000,
          oneYear: 65000,
          twoYears: 80000,
          fiveYears: 120000,
          currency: 'USD'
        },
        recommendationReason: aiResponse.recommendationReason || 'Based on your background and market trends',
        alternatives: aiResponse.alternatives || []
      }

      // Store in database
      await supabase
        .from('career_path_recommendations')
        .insert({
          id: recommendation.id,
          user_id: recommendation.userId,
          current_role: recommendation.currentRole,
          target_role: recommendation.targetRole,
          path_steps: recommendation.pathSteps,
          estimated_timeframe: recommendation.estimatedTimeframe,
          success_probability: recommendation.successProbability,
          required_skills: recommendation.requiredSkills,
          salary_progression: recommendation.salaryProgression,
          recommendation_reason: recommendation.recommendationReason,
          alternatives: recommendation.alternatives,
          created_at: new Date().toISOString()
        })

      return recommendation
    } catch (error) {
      console.error('Failed to generate career path:', error)
      throw error
    }
  }

  async analyzeSkillGaps(targetRole: string): Promise<SkillGap[]> {
    try {
      // Get user's current skills
      const { data: userSkills } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', this.userId)

      // Get target role requirements (from job postings or predefined data)
      const { data: roleRequirements } = await supabase
        .from('role_skill_requirements')
        .select('*')
        .eq('role_name', targetRole)

      const prompt = `
        Analyze skill gaps for someone transitioning to "${targetRole}".
        
        Current Skills:
        ${userSkills?.map(s => `${s.skill_name}: ${s.proficiency_level}/100`).join('\n') || 'No skills specified'}
        
        Please identify:
        1. Critical skill gaps that must be addressed
        2. Important skills that would be beneficial
        3. Nice-to-have skills for competitive advantage
        4. Learning resources and time estimates for each
        5. Priority order for skill development
        
        Format as detailed JSON with specific recommendations.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a career development expert specializing in skill gap analysis and professional development planning. Provide detailed, actionable skill development recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')
      return aiResponse.skillGaps || []
    } catch (error) {
      console.error('Failed to analyze skill gaps:', error)
      throw error
    }
  }

  // Interview Preparation
  async generateInterviewQuestions(jobId: string, company: string, role: string): Promise<InterviewQuestion[]> {
    try {
      // Get job details
      const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      // Get company information
      const { data: companyInfo } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('company_name', company)
        .single()

      const prompt = `
        Generate comprehensive interview questions for a ${role} position at ${company}.
        
        Job Details:
        ${job ? `
        - Title: ${job.title}
        - Description: ${job.description}
        - Requirements: ${job.requirements}
        - Skills: ${job.required_skills?.join(', ')}
        ` : 'Job details not available'}
        
        Company Information:
        ${companyInfo ? `
        - Industry: ${companyInfo.industry}
        - Size: ${companyInfo.company_size}
        - Culture: ${companyInfo.culture_description}
        ` : 'Company details not available'}
        
        Please generate 20-25 questions covering:
        1. Behavioral questions (STAR method)
        2. Technical questions specific to the role
        3. Situational/problem-solving questions
        4. Company and culture fit questions
        5. Industry-specific questions
        
        For each question, provide:
        - Question text
        - Question type and difficulty
        - Suggested answer structure
        - Key points to address
        - Common mistakes to avoid
        
        Format as detailed JSON.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert interview coach with extensive knowledge of hiring practices across industries. Generate comprehensive, realistic interview questions that help candidates prepare effectively."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')
      return aiResponse.questions || []
    } catch (error) {
      console.error('Failed to generate interview questions:', error)
      throw error
    }
  }

  async analyzeInterviewResponse(questionId: string, userAnswer: string): Promise<InterviewFeedback> {
    try {
      // Get the original question
      const { data: question } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('id', questionId)
        .single()

      const prompt = `
        Analyze this interview response and provide detailed feedback.
        
        Question: ${question?.question || 'Question not found'}
        Question Type: ${question?.type || 'unknown'}
        Difficulty: ${question?.difficulty || 'medium'}
        
        User's Answer: "${userAnswer}"
        
        Please provide:
        1. Overall assessment (score 0-100)
        2. Specific strengths in the response
        3. Areas for improvement
        4. Technical accuracy (if applicable)
        5. Communication effectiveness
        6. Confidence and clarity
        7. Specific recommendations for improvement
        8. Example of a stronger response
        
        Be constructive and specific in feedback.
        Format as detailed JSON.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an experienced interview coach and hiring manager. Provide detailed, constructive feedback on interview responses to help candidates improve their performance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')
      
      return {
        strengths: aiResponse.strengths || [],
        improvements: aiResponse.improvements || [],
        technicalScore: aiResponse.technicalScore || 70,
        communicationScore: aiResponse.communicationScore || 70,
        confidenceScore: aiResponse.confidenceScore || 70,
        overallRecommendation: aiResponse.overallRecommendation || 'Continue practicing to improve confidence and clarity',
        nextSteps: aiResponse.nextSteps || []
      }
    } catch (error) {
      console.error('Failed to analyze interview response:', error)
      throw error
    }
  }

  // Salary Negotiation
  async generateSalaryNegotiationStrategy(
    role: string,
    company: string,
    currentOffer?: SalaryNegotiation['currentOffer']
  ): Promise<SalaryNegotiation> {
    try {
      // Get market salary data
      const marketData = await this.getMarketSalaryData(role, company)

      const prompt = `
        Create a comprehensive salary negotiation strategy for a ${role} position at ${company}.
        
        Current Offer:
        ${currentOffer ? `
        - Base Salary: ${currentOffer.baseSalary} ${currentOffer.currency}
        - Bonus: ${currentOffer.bonus} ${currentOffer.currency}
        - Equity: ${currentOffer.equity}
        - Benefits: ${currentOffer.benefits?.join(', ')}
        ` : 'No current offer provided'}
        
        Market Data:
        - 25th percentile: ${marketData.percentile25}
        - 50th percentile: ${marketData.percentile50}
        - 75th percentile: ${marketData.percentile75}
        - 90th percentile: ${marketData.percentile90}
        
        Please provide:
        1. Negotiation strategy and approach
        2. Key talking points and value propositions
        3. Fallback options and alternatives
        4. Practice scenarios with responses
        5. Timeline and process recommendations
        6. Walk-away point guidance
        7. Ideal outcome targets
        
        Format as detailed JSON with specific tactics.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert salary negotiation coach with deep knowledge of compensation strategies across industries. Provide detailed, tactical advice for successful negotiations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')

      const negotiation: SalaryNegotiation = {
        id: this.generateId(),
        userId: this.userId,
        currentOffer,
        marketData,
        negotiationStrategy: aiResponse.negotiationStrategy || {
          approach: 'collaborative',
          keyPoints: [],
          fallbackOptions: [],
          walkAwayPoint: marketData.percentile25,
          idealOutcome: marketData.percentile75,
          timeline: '1-2 weeks'
        },
        practiceScenarios: aiResponse.practiceScenarios || [],
        recommendations: aiResponse.recommendations || []
      }

      // Store in database
      await supabase
        .from('salary_negotiations')
        .insert({
          id: negotiation.id,
          user_id: negotiation.userId,
          current_offer: negotiation.currentOffer,
          market_data: negotiation.marketData,
          negotiation_strategy: negotiation.negotiationStrategy,
          practice_scenarios: negotiation.practiceScenarios,
          recommendations: negotiation.recommendations,
          created_at: new Date().toISOString()
        })

      return negotiation
    } catch (error) {
      console.error('Failed to generate salary negotiation strategy:', error)
      throw error
    }
  }

  // Helper Methods
  private async generateCareerMilestones(goal: CareerGoal): Promise<CareerMilestone[]> {
    const prompt = `
      Create detailed career milestones for someone pursuing a ${goal.targetRole} role in ${goal.targetIndustry} within ${goal.timeframe}.
      
      Please generate 4-6 specific, actionable milestones that include:
      1. Clear deliverable or achievement
      2. Target completion date
      3. Required skills to develop
      4. Required experience to gain
      5. Estimated difficulty level
      
      Make milestones SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
      Format as JSON array.
    `

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a career development expert. Create specific, actionable milestones that guide professional growth."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '[]')
      return aiResponse.map((milestone: any) => ({
        id: this.generateId(),
        title: milestone.title,
        description: milestone.description,
        targetDate: milestone.targetDate,
        completed: false,
        requiredSkills: milestone.requiredSkills || [],
        requiredExperience: milestone.requiredExperience || [],
        estimatedDifficulty: milestone.estimatedDifficulty || 'medium'
      }))
    } catch (error) {
      console.error('Failed to generate career milestones:', error)
      return []
    }
  }

  private async getMarketSalaryData(role: string, company: string): Promise<SalaryNegotiation['marketData']> {
    // In a real implementation, this would integrate with salary data APIs
    // For now, return realistic mock data based on role
    const baseSalary = this.estimateBaseSalary(role)
    
    return {
      percentile25: Math.round(baseSalary * 0.8),
      percentile50: baseSalary,
      percentile75: Math.round(baseSalary * 1.2),
      percentile90: Math.round(baseSalary * 1.4),
      averageTotalComp: Math.round(baseSalary * 1.15),
      currency: 'USD'
    }
  }

  private estimateBaseSalary(role: string): number {
    // Simplified salary estimation - in production would use real market data
    const roleSalaries: { [key: string]: number } = {
      'software engineer': 95000,
      'senior software engineer': 130000,
      'product manager': 120000,
      'senior product manager': 160000,
      'data scientist': 110000,
      'senior data scientist': 145000,
      'marketing manager': 85000,
      'senior marketing manager': 115000,
      'sales manager': 90000,
      'senior sales manager': 125000
    }

    return roleSalaries[role.toLowerCase()] || 75000
  }

  private generateId(): string {
    return 'coach_' + Math.random().toString(36).substring(2, 15)
  }

  // Public API Methods
  async getUserCareerGoals(): Promise<CareerGoal[]> {
    const { data, error } = await supabase
      .from('career_goals')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async updateCareerGoalProgress(goalId: string, progress: number): Promise<void> {
    await supabase
      .from('career_goals')
      .update({ 
        current_progress: progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .eq('user_id', this.userId)
  }

  async completeCareerMilestone(goalId: string, milestoneId: string): Promise<void> {
    const { data: goal } = await supabase
      .from('career_goals')
      .select('milestones')
      .eq('id', goalId)
      .eq('user_id', this.userId)
      .single()

    if (goal) {
      const milestones = goal.milestones.map((m: any) => 
        m.id === milestoneId ? { ...m, completed: true, completedAt: new Date().toISOString() } : m
      )

      const completedCount = milestones.filter((m: any) => m.completed).length
      const progress = Math.round((completedCount / milestones.length) * 100)

      await supabase
        .from('career_goals')
        .update({ 
          milestones,
          current_progress: progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .eq('user_id', this.userId)
    }
  }
}

export default AICareerCoach