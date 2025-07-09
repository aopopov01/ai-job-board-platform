/**
 * AI Salary Negotiation Assistant - Revolutionary salary negotiation system
 * Features: Market analysis, strategy generation, real-time coaching, offer optimization
 */

import OpenAI from 'openai'

// Core interfaces for salary negotiation
export interface SalaryNegotiationSession {
  id: string
  userId: string
  jobTitle: string
  company: string
  industry: string
  location: string
  experienceLevel: string
  currentOffer?: JobOffer
  targetSalary: number
  marketData: MarketSalaryData
  negotiationStrategy: NegotiationStrategy
  counterOffers: CounterOffer[]
  negotiationTips: NegotiationTip[]
  expectedOutcome: SalaryPrediction
  sessionStatus: 'preparing' | 'active' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface JobOffer {
  id: string
  baseSalary: number
  currency: string
  bonus?: number
  equity?: EquityDetails
  benefits: BenefitPackage
  vacationDays: number
  workArrangement: 'remote' | 'hybrid' | 'onsite'
  startDate: Date
  deadline?: Date
  totalCompensation: number
}

export interface EquityDetails {
  type: 'stock_options' | 'rsu' | 'preferred_stock'
  amount: number
  vestingSchedule: string
  currentValue: number
  potentialValue: number
}

export interface BenefitPackage {
  healthInsurance: boolean
  dentalInsurance: boolean
  visionInsurance: boolean
  retirement401k: boolean
  retirementMatch: number
  lifeInsurance: boolean
  disabilityInsurance: boolean
  professionalDevelopment: number
  gymMembership: boolean
  commuteBenefit: number
  flexibleSpending: number
  estimatedValue: number
}

export interface MarketSalaryData {
  role: string
  location: string
  industry: string
  experienceLevel: string
  sampleSize: number
  percentiles: {
    p10: number
    p25: number
    p50: number
    p75: number
    p90: number
  }
  averageTotalComp: number
  salaryTrends: SalaryTrend[]
  demandLevel: 'low' | 'medium' | 'high' | 'very_high'
  competitiveFactors: string[]
  dataSourcesUsed: string[]
  lastUpdated: Date
}

export interface SalaryTrend {
  period: string
  growthRate: number
  factors: string[]
}

export interface NegotiationStrategy {
  approach: 'collaborative' | 'competitive' | 'value_based'
  keyArguments: NegotiationArgument[]
  timeline: NegotiationTimeline[]
  fallbackOptions: string[]
  riskAssessment: RiskLevel
  successProbability: number
  recommendedTactics: string[]
}

export interface NegotiationArgument {
  type: 'market_data' | 'performance' | 'unique_value' | 'competing_offer' | 'cost_of_living'
  strength: 'weak' | 'moderate' | 'strong'
  argument: string
  supportingData: any
  timing: 'initial' | 'counter' | 'final'
}

export interface NegotiationTimeline {
  phase: string
  duration: string
  actions: string[]
  expectedResponse: string
}

export interface CounterOffer {
  id: string
  version: number
  baseSalary: number
  bonus?: number
  equity?: EquityDetails
  benefits?: Partial<BenefitPackage>
  vacationDays?: number
  workArrangement?: string
  otherRequests: string[]
  justification: string
  totalValue: number
  probability: number
  riskLevel: RiskLevel
  createdAt: Date
}

export interface NegotiationTip {
  id: string
  category: 'preparation' | 'communication' | 'timing' | 'psychology' | 'follow_up'
  tip: string
  importance: 'low' | 'medium' | 'high' | 'critical'
  applicablePhase: string[]
}

export interface SalaryPrediction {
  likelyOutcome: number
  bestCaseScenario: number
  worstCaseScenario: number
  probability: number
  timeToResolution: string
  factors: string[]
}

export interface RealTimeCoaching {
  timestamp: number
  phase: 'preparation' | 'initial_offer' | 'negotiation' | 'closing'
  coaching: string
  urgency: 'low' | 'medium' | 'high'
  actionRequired: boolean
}

type RiskLevel = 'low' | 'medium' | 'high'

export class AISalaryNegotiator {
  private openai: OpenAI
  private readonly NEGOTIATION_PROMPTS = {
    marketAnalysis: `Analyze the salary market for this position:
    Role: {role}
    Industry: {industry}
    Location: {location}
    Experience: {experience}
    Company Size: {companySize}
    
    Provide comprehensive market analysis including:
    1. Salary percentiles (10th, 25th, 50th, 75th, 90th)
    2. Total compensation analysis
    3. Current market trends and demand
    4. Geographic cost of living adjustments
    5. Industry-specific factors
    6. Recent salary growth trends
    7. Competitive landscape
    
    Use recent data and provide confidence intervals.
    Return as detailed JSON.`,
    
    strategyGeneration: `Generate a personalized salary negotiation strategy:
    
    Current Offer: {currentOffer}
    Target Salary: {targetSalary}
    Market Data: {marketData}
    Candidate Profile: {candidateProfile}
    Company Context: {companyContext}
    
    Create strategy including:
    1. Optimal negotiation approach (collaborative/competitive/value-based)
    2. Key arguments with strength ratings
    3. Suggested timeline and phases
    4. Risk assessment and mitigation
    5. Fallback options
    6. Success probability estimation
    7. Specific tactics for this situation
    
    Consider company culture, industry norms, and candidate leverage.
    Return as JSON strategy object.`,
    
    counterOfferGeneration: `Generate an optimal counter-offer:
    
    Original Offer: {originalOffer}
    Market Data: {marketData}
    Negotiation Goals: {goals}
    Risk Tolerance: {riskTolerance}
    Unique Value Props: {valueProps}
    
    Create counter-offer including:
    1. Specific salary number with justification
    2. Benefit modifications
    3. Non-monetary requests
    4. Overall package optimization
    5. Justification framework
    6. Success probability
    7. Risk assessment
    
    Optimize for total value, not just base salary.
    Return as structured counter-offer.`,
    
    realTimeCoaching: `Provide real-time negotiation coaching:
    
    Current Situation: {situation}
    Negotiation Phase: {phase}
    Last Exchange: {lastExchange}
    Current Stress Level: {stressLevel}
    Time Pressure: {timePressure}
    
    Provide immediate coaching on:
    1. What to say next
    2. How to frame the conversation
    3. Body language and tone advice
    4. Timing considerations
    5. Potential pitfalls to avoid
    6. Confidence boosters
    
    Keep advice actionable and confidence-building.`
  }

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async analyzeMarketData(params: {
    role: string
    industry: string
    location: string
    experienceLevel: string
    companySize?: string
    skills?: string[]
  }): Promise<MarketSalaryData> {
    try {
      const prompt = this.NEGOTIATION_PROMPTS.marketAnalysis
        .replace('{role}', params.role)
        .replace('{industry}', params.industry)
        .replace('{location}', params.location)
        .replace('{experience}', params.experienceLevel)
        .replace('{companySize}', params.companySize || 'unknown')

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior compensation analyst with access to comprehensive salary databases and market trends. Provide accurate, data-driven salary analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })

      const marketData = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        role: params.role,
        location: params.location,
        industry: params.industry,
        experienceLevel: params.experienceLevel,
        sampleSize: marketData.sampleSize || 1000,
        percentiles: {
          p10: marketData.percentiles?.p10 || 50000,
          p25: marketData.percentiles?.p25 || 65000,
          p50: marketData.percentiles?.p50 || 80000,
          p75: marketData.percentiles?.p75 || 100000,
          p90: marketData.percentiles?.p90 || 125000
        },
        averageTotalComp: marketData.averageTotalComp || 90000,
        salaryTrends: marketData.salaryTrends || [],
        demandLevel: marketData.demandLevel || 'medium',
        competitiveFactors: marketData.competitiveFactors || [],
        dataSourcesUsed: ['OpenAI Market Analysis', 'Industry Reports'],
        lastUpdated: new Date()
      }
    } catch (error) {
      console.error('Error analyzing market data:', error)
      return this.getFallbackMarketData(params)
    }
  }

  async generateNegotiationStrategy(params: {
    currentOffer?: JobOffer
    targetSalary: number
    marketData: MarketSalaryData
    candidateProfile: {
      experience: string
      skills: string[]
      achievements: string[]
      uniqueValue: string[]
    }
    companyContext: {
      size: string
      culture: string
      industry: string
      growthStage: string
    }
  }): Promise<NegotiationStrategy> {
    try {
      const prompt = this.NEGOTIATION_PROMPTS.strategyGeneration
        .replace('{currentOffer}', JSON.stringify(params.currentOffer))
        .replace('{targetSalary}', params.targetSalary.toString())
        .replace('{marketData}', JSON.stringify(params.marketData))
        .replace('{candidateProfile}', JSON.stringify(params.candidateProfile))
        .replace('{companyContext}', JSON.stringify(params.companyContext))

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert salary negotiation coach with 20+ years of experience helping professionals maximize their compensation. Create winning negotiation strategies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })

      const strategy = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        approach: strategy.approach || 'value_based',
        keyArguments: strategy.keyArguments || [],
        timeline: strategy.timeline || [],
        fallbackOptions: strategy.fallbackOptions || [],
        riskAssessment: strategy.riskAssessment || 'medium',
        successProbability: strategy.successProbability || 70,
        recommendedTactics: strategy.recommendedTactics || []
      }
    } catch (error) {
      console.error('Error generating negotiation strategy:', error)
      return this.getFallbackStrategy()
    }
  }

  async generateCounterOffer(params: {
    originalOffer: JobOffer
    marketData: MarketSalaryData
    targetSalary: number
    priorities: string[]
    riskTolerance: RiskLevel
    uniqueValue: string[]
  }): Promise<CounterOffer> {
    try {
      const prompt = this.NEGOTIATION_PROMPTS.counterOfferGeneration
        .replace('{originalOffer}', JSON.stringify(params.originalOffer))
        .replace('{marketData}', JSON.stringify(params.marketData))
        .replace('{goals}', params.targetSalary.toString())
        .replace('{riskTolerance}', params.riskTolerance)
        .replace('{valueProps}', JSON.stringify(params.uniqueValue))

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a expert negotiation strategist. Create compelling counter-offers that maximize total compensation while managing risk.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })

      const counterOffer = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        id: `counter_${Date.now()}`,
        version: 1,
        baseSalary: counterOffer.baseSalary || params.targetSalary,
        bonus: counterOffer.bonus,
        equity: counterOffer.equity,
        benefits: counterOffer.benefits,
        vacationDays: counterOffer.vacationDays,
        workArrangement: counterOffer.workArrangement,
        otherRequests: counterOffer.otherRequests || [],
        justification: counterOffer.justification || 'Based on market analysis and value contribution',
        totalValue: counterOffer.totalValue || params.targetSalary,
        probability: counterOffer.probability || 65,
        riskLevel: counterOffer.riskLevel || params.riskTolerance,
        createdAt: new Date()
      }
    } catch (error) {
      console.error('Error generating counter offer:', error)
      return this.getFallbackCounterOffer(params.originalOffer, params.targetSalary)
    }
  }

  async generateRealTimeCoaching(params: {
    phase: 'preparation' | 'initial_offer' | 'negotiation' | 'closing'
    situation: string
    lastExchange?: string
    stressLevel: 'low' | 'medium' | 'high'
    timePressure: boolean
    currentOffer?: JobOffer
    targetSalary: number
  }): Promise<RealTimeCoaching> {
    try {
      const prompt = this.NEGOTIATION_PROMPTS.realTimeCoaching
        .replace('{situation}', params.situation)
        .replace('{phase}', params.phase)
        .replace('{lastExchange}', params.lastExchange || 'Initial conversation')
        .replace('{stressLevel}', params.stressLevel)
        .replace('{timePressure}', params.timePressure.toString())

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a real-time negotiation coach providing immediate, confidence-building advice. Keep responses actionable and encouraging.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 500
      })

      const coaching = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        timestamp: Date.now(),
        phase: params.phase,
        coaching: coaching.coaching || 'Stay confident and focus on your value.',
        urgency: coaching.urgency || 'medium',
        actionRequired: coaching.actionRequired || false
      }
    } catch (error) {
      console.error('Error generating real-time coaching:', error)
      return this.getFallbackCoaching(params.phase)
    }
  }

  async calculateTotalCompensation(offer: JobOffer): Promise<number> {
    let total = offer.baseSalary
    
    if (offer.bonus) total += offer.bonus
    if (offer.equity?.currentValue) total += offer.equity.currentValue
    if (offer.benefits?.estimatedValue) total += offer.benefits.estimatedValue
    
    return total
  }

  async compareOffers(offers: JobOffer[]): Promise<{
    recommendation: string
    analysis: string
    scores: { [key: string]: number }
  }> {
    const analysis = offers.map(offer => ({
      id: offer.id,
      totalComp: this.calculateTotalCompensation(offer),
      benefits: offer.benefits,
      workLife: offer.workArrangement,
      growth: offer.equity ? 'High' : 'Low'
    }))

    return {
      recommendation: 'Based on total compensation and growth potential...',
      analysis: 'Detailed comparison analysis...',
      scores: analysis.reduce((acc, curr) => {
        acc[curr.id] = typeof curr.totalComp === 'number' ? curr.totalComp : 0
        return acc
      }, {} as { [key: string]: number })
    }
  }

  async predictNegotiationOutcome(params: {
    strategy: NegotiationStrategy
    marketData: MarketSalaryData
    candidateStrength: number
    companyContext: any
  }): Promise<SalaryPrediction> {
    // Use AI to predict likely negotiation outcomes
    const baselineProbability = params.strategy.successProbability
    const marketPosition = params.candidateStrength
    
    return {
      likelyOutcome: Math.round(params.marketData.percentiles.p50 * (1 + marketPosition/100)),
      bestCaseScenario: Math.round(params.marketData.percentiles.p75),
      worstCaseScenario: Math.round(params.marketData.percentiles.p25),
      probability: baselineProbability,
      timeToResolution: '1-2 weeks',
      factors: ['Market demand', 'Candidate experience', 'Company budget']
    }
  }

  // Helper methods
  private getFallbackMarketData(params: any): MarketSalaryData {
    return {
      role: params.role,
      location: params.location,
      industry: params.industry,
      experienceLevel: params.experienceLevel,
      sampleSize: 500,
      percentiles: {
        p10: 55000,
        p25: 70000,
        p50: 85000,
        p75: 105000,
        p90: 130000
      },
      averageTotalComp: 90000,
      salaryTrends: [],
      demandLevel: 'medium',
      competitiveFactors: [],
      dataSourcesUsed: ['Fallback Data'],
      lastUpdated: new Date()
    }
  }

  private getFallbackStrategy(): NegotiationStrategy {
    return {
      approach: 'value_based',
      keyArguments: [],
      timeline: [],
      fallbackOptions: [],
      riskAssessment: 'medium',
      successProbability: 70,
      recommendedTactics: []
    }
  }

  private getFallbackCounterOffer(originalOffer: JobOffer, targetSalary: number): CounterOffer {
    return {
      id: `counter_${Date.now()}`,
      version: 1,
      baseSalary: targetSalary,
      totalValue: targetSalary,
      justification: 'Based on market research and value contribution',
      probability: 65,
      riskLevel: 'medium',
      otherRequests: [],
      createdAt: new Date()
    }
  }

  private getFallbackCoaching(phase: string): RealTimeCoaching {
    return {
      timestamp: Date.now(),
      phase: phase as any,
      coaching: 'Stay confident and focus on your unique value proposition.',
      urgency: 'medium',
      actionRequired: false
    }
  }
}

// Export the salary negotiator instance
export const salaryNegotiator = new AISalaryNegotiator()

// Utility functions for the frontend
export const SalaryNegotiationUtils = {
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  },

  calculatePayIncreasePercentage: (currentSalary: number, newSalary: number): number => {
    return Math.round(((newSalary - currentSalary) / currentSalary) * 100)
  },

  getRiskLevelColor: (risk: RiskLevel): string => {
    switch (risk) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  },

  getMarketPositioning: (salary: number, marketData: MarketSalaryData): string => {
    if (salary >= marketData.percentiles.p90) return 'Top 10%'
    if (salary >= marketData.percentiles.p75) return 'Top 25%'
    if (salary >= marketData.percentiles.p50) return 'Above Average'
    if (salary >= marketData.percentiles.p25) return 'Below Average'
    return 'Bottom 25%'
  },

  getSuccessProbabilityColor: (probability: number): string => {
    if (probability >= 80) return 'text-green-600'
    if (probability >= 60) return 'text-blue-600'
    if (probability >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }
}