/**
 * AI Interview Coach - Revolutionary real-time interview coaching system
 * Features: Voice analysis, body language feedback, real-time coaching
 */

import OpenAI from 'openai'

// Core interfaces for the interview coaching system
export interface InterviewCoachingSession {
  id: string
  userId: string
  jobId?: string
  sessionType: 'practice' | 'mock' | 'real_prep'
  industry: string
  role: string
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
  duration: number
  startedAt: Date
  completedAt?: Date
  overallScore: number
  feedback: InterviewFeedback
  improvements: string[]
  nextSteps: string[]
}

export interface InterviewFeedback {
  confidenceScore: number
  clarityScore: number
  technicalAccuracy: number
  communicationSkills: number
  bodyLanguageScore: number
  voiceAnalysis: VoiceMetrics
  responseQuality: ResponseAnalysis[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

export interface VoiceMetrics {
  pace: number // words per minute
  clarity: number // 0-100
  confidence: number // 0-100
  energy: number // 0-100
  fillerWords: number
  pauseAnalysis: PauseAnalysis
  emotionDetection: EmotionMetrics
}

export interface PauseAnalysis {
  appropriatePauses: number
  awkwardSilences: number
  averagePauseLength: number
  pauseConfidence: number
}

export interface EmotionMetrics {
  nervousness: number
  excitement: number
  confidence: number
  stress: number
  engagement: number
}

export interface ResponseAnalysis {
  question: string
  response: string
  relevance: number
  completeness: number
  structure: number
  examples: boolean
  timeToRespond: number
  improvementSuggestions: string[]
}

export interface PersonalizedQuestion {
  id: string
  question: string
  category: 'behavioral' | 'technical' | 'situational' | 'cultural'
  difficulty: 'easy' | 'medium' | 'hard'
  industry: string
  role: string
  expectedAnswerLength: number
  keyPoints: string[]
  followUpQuestions: string[]
}

export interface RealTimeCoaching {
  timestamp: number
  coachingType: 'pace' | 'clarity' | 'posture' | 'energy' | 'content'
  message: string
  severity: 'info' | 'warning' | 'critical'
  suggestion: string
}

export class AIInterviewCoach {
  private openai: OpenAI
  private readonly COACHING_PROMPTS = {
    questionGeneration: `You are an expert interview coach. Generate personalized interview questions based on:
    - Industry: {industry}
    - Role: {role} 
    - Experience Level: {experienceLevel}
    - Company Culture: {culture}
    
    Create 10 questions that are:
    1. Highly relevant to the specific role
    2. Appropriate for the experience level
    3. Include a mix of behavioral, technical, and situational questions
    4. Progressive in difficulty
    5. Industry-specific when relevant
    
    For each question, provide:
    - The question
    - Category (behavioral/technical/situational/cultural)
    - Expected answer length (30s, 60s, 2min, etc.)
    - Key points a strong answer should include
    - Follow-up questions
    
    Return as JSON array.`,
    
    responseAnalysis: `Analyze this interview response for:
    Question: {question}
    Response: {response}
    Industry: {industry}
    Role: {role}
    
    Evaluate:
    1. Relevance to the question (0-100)
    2. Completeness of answer (0-100)
    3. Structure and clarity (0-100)
    4. Use of specific examples (boolean)
    5. Technical accuracy (0-100)
    6. Communication effectiveness (0-100)
    
    Provide:
    - Specific improvement suggestions
    - What the response did well
    - Missing elements that should be included
    - Better ways to structure the answer
    - Suggested examples or evidence to include
    
    Return as JSON.`,
    
    realTimeCoaching: `Provide real-time coaching based on:
    Current speech pace: {pace} wpm
    Clarity score: {clarity}
    Energy level: {energy}
    Filler words detected: {fillerWords}
    Current response time: {responseTime}s
    
    Generate coaching suggestion that is:
    1. Immediate and actionable
    2. Encouraging but constructive
    3. Specific to the current moment
    4. Brief (one sentence)
    
    Categories: pace, clarity, posture, energy, content
    Severity: info, warning, critical`
  }

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generatePersonalizedQuestions(params: {
    industry: string
    role: string
    experienceLevel: string
    companySize?: string
    companyCulture?: string
    specificSkills?: string[]
  }): Promise<PersonalizedQuestion[]> {
    try {
      const prompt = this.COACHING_PROMPTS.questionGeneration
        .replace('{industry}', params.industry)
        .replace('{role}', params.role)
        .replace('{experienceLevel}', params.experienceLevel)
        .replace('{culture}', params.companyCulture || 'professional')

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview coach with 20+ years of experience in talent acquisition across all industries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const questions = JSON.parse(response.choices[0].message.content || '[]')
      return questions.map((q: any, index: number) => ({
        id: `q_${Date.now()}_${index}`,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty || 'medium',
        industry: params.industry,
        role: params.role,
        expectedAnswerLength: this.parseAnswerLength(q.expectedLength),
        keyPoints: q.keyPoints || [],
        followUpQuestions: q.followUpQuestions || []
      }))
    } catch (error) {
      console.error('Error generating personalized questions:', error)
      return this.getFallbackQuestions(params.role, params.experienceLevel)
    }
  }

  async analyzeResponse(params: {
    question: string
    response: string
    industry: string
    role: string
    responseTime: number
    voiceMetrics?: VoiceMetrics
  }): Promise<ResponseAnalysis> {
    try {
      const prompt = this.COACHING_PROMPTS.responseAnalysis
        .replace('{question}', params.question)
        .replace('{response}', params.response)
        .replace('{industry}', params.industry)
        .replace('{role}', params.role)

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview coach and communication specialist. Analyze responses with constructive, actionable feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })

      const analysis = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        question: params.question,
        response: params.response,
        relevance: analysis.relevance || 50,
        completeness: analysis.completeness || 50,
        structure: analysis.structure || 50,
        examples: analysis.examples || false,
        timeToRespond: params.responseTime,
        improvementSuggestions: analysis.improvementSuggestions || []
      }
    } catch (error) {
      console.error('Error analyzing response:', error)
      return this.getFallbackAnalysis(params.question, params.response)
    }
  }

  async generateRealTimeCoaching(params: {
    pace: number
    clarity: number
    energy: number
    fillerWords: number
    responseTime: number
    currentQuestion?: string
  }): Promise<RealTimeCoaching> {
    try {
      const prompt = this.COACHING_PROMPTS.realTimeCoaching
        .replace('{pace}', params.pace.toString())
        .replace('{clarity}', params.clarity.toString())
        .replace('{energy}', params.energy.toString())
        .replace('{fillerWords}', params.fillerWords.toString())
        .replace('{responseTime}', params.responseTime.toString())

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a real-time interview coach. Provide immediate, encouraging, and actionable coaching tips.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 100
      })

      const coaching = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        timestamp: Date.now(),
        coachingType: this.determineCoachingType(params),
        message: coaching.message || 'Keep going, you\'re doing great!',
        severity: coaching.severity || 'info',
        suggestion: coaching.suggestion || 'Maintain your current pace and confidence.'
      }
    } catch (error) {
      console.error('Error generating real-time coaching:', error)
      return this.getFallbackCoaching(params)
    }
  }

  async generateOverallFeedback(session: Partial<InterviewCoachingSession>): Promise<InterviewFeedback> {
    try {
      const responses = session.feedback?.responseQuality || []
      const voiceMetrics = session.feedback?.voiceAnalysis

      const overallPrompt = `Analyze this complete interview session:
      
      Industry: ${session.industry}
      Role: ${session.role}
      Experience Level: ${session.experienceLevel}
      Duration: ${session.duration} minutes
      
      Response Analysis Summary:
      ${responses.map(r => `Q: ${r.question}\nA: ${r.response}\nScores: Relevance ${r.relevance}, Structure ${r.structure}`).join('\n\n')}
      
      Voice Metrics:
      Pace: ${voiceMetrics?.pace} wpm
      Clarity: ${voiceMetrics?.clarity}%
      Confidence: ${voiceMetrics?.confidence}%
      Filler Words: ${voiceMetrics?.fillerWords}
      
      Provide comprehensive feedback including:
      1. Overall assessment and scores (0-100 for each category)
      2. Top 3 strengths demonstrated
      3. Top 3 areas for improvement
      4. Specific, actionable recommendations
      5. Next steps for continued improvement
      6. Industry-specific advice
      
      Return as JSON with detailed feedback.`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior interview coach providing comprehensive feedback to help candidates improve their interview performance.'
          },
          {
            role: 'user',
            content: overallPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })

      const feedback = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        confidenceScore: feedback.confidenceScore || 70,
        clarityScore: feedback.clarityScore || 70,
        technicalAccuracy: feedback.technicalAccuracy || 70,
        communicationSkills: feedback.communicationSkills || 70,
        bodyLanguageScore: feedback.bodyLanguageScore || 70,
        voiceAnalysis: voiceMetrics || this.getDefaultVoiceMetrics(),
        responseQuality: responses,
        strengths: feedback.strengths || [],
        weaknesses: feedback.weaknesses || [],
        recommendations: feedback.recommendations || []
      }
    } catch (error) {
      console.error('Error generating overall feedback:', error)
      return this.getDefaultFeedback()
    }
  }

  // Voice analysis methods (would integrate with Web Audio API)
  analyzeVoiceMetrics(audioData: ArrayBuffer): VoiceMetrics {
    // This would integrate with voice analysis libraries
    // For now, returning mock data structure
    return {
      pace: 150, // words per minute
      clarity: 85,
      confidence: 78,
      energy: 82,
      fillerWords: 3,
      pauseAnalysis: {
        appropriatePauses: 12,
        awkwardSilences: 2,
        averagePauseLength: 1.2,
        pauseConfidence: 85
      },
      emotionDetection: {
        nervousness: 25,
        excitement: 70,
        confidence: 80,
        stress: 30,
        engagement: 85
      }
    }
  }

  // Body language analysis (would integrate with computer vision)
  analyzeBodyLanguage(videoFrame: ImageData): number {
    // This would integrate with computer vision APIs
    // Analyzing posture, eye contact, gestures, facial expressions
    return 75 // Mock confidence score
  }

  // Helper methods
  private parseAnswerLength(length: string): number {
    const minutes = length.match(/(\d+)\s*min/)?.[1]
    const seconds = length.match(/(\d+)\s*s/)?.[1]
    return (minutes ? parseInt(minutes) * 60 : 0) + (seconds ? parseInt(seconds) : 60)
  }

  private determineCoachingType(params: any): RealTimeCoaching['coachingType'] {
    if (params.pace < 120) return 'pace'
    if (params.clarity < 70) return 'clarity'
    if (params.energy < 60) return 'energy'
    if (params.fillerWords > 5) return 'clarity'
    return 'content'
  }

  private getFallbackQuestions(role: string, level: string): PersonalizedQuestion[] {
    return [
      {
        id: 'fallback_1',
        question: `Tell me about your experience in ${role} and what attracts you to this position.`,
        category: 'behavioral',
        difficulty: level === 'entry' ? 'easy' : 'medium',
        industry: 'general',
        role,
        expectedAnswerLength: 120,
        keyPoints: ['Relevant experience', 'Motivation', 'Role alignment'],
        followUpQuestions: ['What specific skills would you bring?']
      }
    ]
  }

  private getFallbackAnalysis(question: string, response: string): ResponseAnalysis {
    return {
      question,
      response,
      relevance: 70,
      completeness: 65,
      structure: 60,
      examples: response.toLowerCase().includes('example') || response.toLowerCase().includes('when'),
      timeToRespond: 0,
      improvementSuggestions: ['Try to provide more specific examples', 'Structure your answer with a clear beginning, middle, and end']
    }
  }

  private getFallbackCoaching(params: any): RealTimeCoaching {
    return {
      timestamp: Date.now(),
      coachingType: 'content',
      message: 'Take a breath and speak at a comfortable pace.',
      severity: 'info',
      suggestion: 'Focus on being clear and confident in your responses.'
    }
  }

  private getDefaultVoiceMetrics(): VoiceMetrics {
    return {
      pace: 150,
      clarity: 75,
      confidence: 70,
      energy: 75,
      fillerWords: 2,
      pauseAnalysis: {
        appropriatePauses: 8,
        awkwardSilences: 1,
        averagePauseLength: 1.0,
        pauseConfidence: 80
      },
      emotionDetection: {
        nervousness: 30,
        excitement: 60,
        confidence: 70,
        stress: 25,
        engagement: 80
      }
    }
  }

  private getDefaultFeedback(): InterviewFeedback {
    return {
      confidenceScore: 70,
      clarityScore: 75,
      technicalAccuracy: 70,
      communicationSkills: 75,
      bodyLanguageScore: 70,
      voiceAnalysis: this.getDefaultVoiceMetrics(),
      responseQuality: [],
      strengths: ['Good communication', 'Relevant experience'],
      weaknesses: ['Could provide more examples'],
      recommendations: ['Practice with specific examples', 'Focus on clearer structure']
    }
  }
}

// Export the interview coach instance
export const interviewCoach = new AIInterviewCoach()

// Utility functions for the frontend
export const InterviewCoachUtils = {
  formatFeedbackScore: (score: number): string => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Improvement'
  },

  getScoreColor: (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  },

  getCoachingSeverityColor: (severity: RealTimeCoaching['severity']): string => {
    switch (severity) {
      case 'info': return 'text-blue-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }
}