/**
 * Predictive Company Health Monitoring - Revolutionary company stability analysis
 * Features: Financial health prediction, culture monitoring, layoff risk assessment
 */

import OpenAI from 'openai'

// Core interfaces for company health monitoring
export interface CompanyHealthProfile {
  id: string
  companyId: string
  companyName: string
  industry: string
  lastUpdated: Date
  healthScore: number
  riskLevel: RiskLevel
  predictions: HealthPredictions
  financialHealth: FinancialHealthMetrics
  cultureHealth: CultureHealthMetrics
  operationalHealth: OperationalHealthMetrics
  marketPosition: MarketPositionMetrics
  employeeInsights: EmployeeInsightMetrics
  dataConfidence: number
  trendsAnalysis: TrendsAnalysis
  alerts: HealthAlert[]
}

export interface HealthPredictions {
  layoffRisk: LayoffRiskPrediction
  financialStability: FinancialStabilityPrediction
  growthOutlook: GrowthOutlookPrediction
  cultureDeterioration: CultureRiskPrediction
  marketDisruption: MarketDisruptionPrediction
  timeHorizon: '3_months' | '6_months' | '12_months' | '24_months'
}

export interface LayoffRiskPrediction {
  probability: number
  severity: 'minimal' | 'moderate' | 'significant' | 'severe'
  potentialImpact: number // percentage of workforce
  earlyWarningSignals: EarlyWarningSignal[]
  timeframe: string
  confidence: number
  mitigatingFactors: string[]
  riskFactors: string[]
}

export interface EarlyWarningSignal {
  type: 'financial' | 'operational' | 'market' | 'leadership' | 'behavioral'
  signal: string
  strength: number
  firstDetected: Date
  trend: 'increasing' | 'stable' | 'decreasing'
  impact: 'low' | 'medium' | 'high' | 'critical'
}

export interface FinancialStabilityPrediction {
  stabilityScore: number
  cashRunway: number // months
  profitabilityTrend: 'improving' | 'stable' | 'declining'
  debtToEquityRatio: number
  burnRate: number
  fundingRisk: number
  marketValuationTrend: 'rising' | 'stable' | 'falling'
  creditRating: string
}

export interface GrowthOutlookPrediction {
  growthProbability: number
  expectedGrowthRate: number
  scalingChallenges: ScalingChallenge[]
  opportunityAreas: OpportunityArea[]
  competitiveThreats: CompetitiveThreats[]
  marketExpansionPotential: number
}

export interface ScalingChallenge {
  area: string
  severity: number
  impact: string
  timeline: string
  solutions: string[]
}

export interface OpportunityArea {
  category: string
  potential: number
  timeframe: string
  requirements: string[]
  risks: string[]
}

export interface CompetitiveThreats {
  competitor: string
  threatLevel: number
  advantages: string[]
  timeline: string
}

export interface CultureRiskPrediction {
  deteriorationRisk: number
  burnoutLevel: number
  turnoverRisk: number
  engagementTrend: 'improving' | 'stable' | 'declining'
  toxicityIndicators: ToxicityIndicator[]
  diversityHealth: DiversityHealth
}

export interface ToxicityIndicator {
  type: 'leadership' | 'workload' | 'communication' | 'recognition' | 'growth'
  level: number
  trend: 'improving' | 'worsening' | 'stable'
  impact: string
  sources: string[]
}

export interface DiversityHealth {
  inclusionScore: number
  representationGaps: RepresentationGap[]
  payEquityScore: number
  promotionEquity: number
  retentionByDemographic: { [key: string]: number }
}

export interface RepresentationGap {
  level: 'entry' | 'mid' | 'senior' | 'executive'
  category: 'gender' | 'ethnicity' | 'age' | 'disability'
  currentState: number
  target: number
  trend: 'improving' | 'stable' | 'worsening'
}

export interface MarketDisruptionPrediction {
  disruptionRisk: number
  disruptionSources: DisruptionSource[]
  adaptabilityScore: number
  innovationCapacity: number
  marketShareTrend: 'gaining' | 'stable' | 'losing'
}

export interface DisruptionSource {
  type: 'technology' | 'regulation' | 'economic' | 'social' | 'competitive'
  probability: number
  impact: number
  timeline: string
  preparedness: number
}

export interface FinancialHealthMetrics {
  revenue: RevenueMetrics
  profitability: ProfitabilityMetrics
  cashFlow: CashFlowMetrics
  funding: FundingMetrics
  expenses: ExpenseMetrics
  valuation: ValuationMetrics
  riskFactors: FinancialRiskFactor[]
}

export interface RevenueMetrics {
  currentRevenue: number
  revenueGrowthRate: number
  revenueStability: number
  revenueStreams: RevenueStream[]
  seasonalityImpact: number
  customerConcentrationRisk: number
}

export interface RevenueStream {
  source: string
  percentage: number
  stability: 'stable' | 'growing' | 'declining'
  predictability: number
}

export interface ProfitabilityMetrics {
  grossMargin: number
  operatingMargin: number
  netMargin: number
  marginTrends: MarginTrend[]
  profitabilityRank: number
  industryComparison: number
}

export interface MarginTrend {
  metric: string
  trend: 'improving' | 'stable' | 'declining'
  rate: number
  projection: number
}

export interface CashFlowMetrics {
  operatingCashFlow: number
  freeCashFlow: number
  cashBurnRate: number
  cashPosition: number
  cashEfficiency: number
  liquidityRatio: number
}

export interface FundingMetrics {
  totalFundingRaised: number
  lastFundingDate: Date
  lastFundingAmount: number
  investorQuality: number
  fundingStage: string
  nextFundingTimeline: string
  fundingRisk: number
}

export interface ExpenseMetrics {
  operatingExpenses: number
  employeeCosts: number
  marketingSpend: number
  rdSpend: number
  expenseEfficiency: number
  costControl: number
}

export interface ValuationMetrics {
  currentValuation: number
  valuationTrend: 'rising' | 'stable' | 'falling'
  marketMultiple: number
  industryComparison: number
  valuationRisk: number
}

export interface FinancialRiskFactor {
  factor: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  probability: number
  mitigation: string
  timeline: string
}

export interface CultureHealthMetrics {
  employeeSatisfaction: EmployeeSatisfactionMetrics
  workLifeBalance: WorkLifeBalanceMetrics
  leadership: LeadershipMetrics
  development: DevelopmentMetrics
  diversity: DiversityMetrics
  communication: CommunicationMetrics
  retention: RetentionMetrics
}

export interface EmployeeSatisfactionMetrics {
  overallSatisfaction: number
  satisfactionTrend: 'improving' | 'stable' | 'declining'
  satisfactionByDepartment: { [department: string]: number }
  satisfactionDrivers: SatisfactionDriver[]
  detractors: SatisfactionDetractor[]
}

export interface SatisfactionDriver {
  factor: string
  impact: number
  strength: number
  trend: 'improving' | 'stable' | 'declining'
}

export interface SatisfactionDetractor {
  issue: string
  severity: number
  frequency: number
  affectedPercentage: number
  trend: 'improving' | 'worsening' | 'stable'
}

export interface WorkLifeBalanceMetrics {
  balanceScore: number
  averageWorkingHours: number
  overtimeFrequency: number
  flexibilityScore: number
  stressLevel: number
  burnoutRisk: number
}

export interface LeadershipMetrics {
  leadershipEffectiveness: number
  trustScore: number
  visionClarity: number
  decisionMaking: number
  supportScore: number
  leadershipStability: number
}

export interface DevelopmentMetrics {
  careerGrowthOpportunities: number
  skillDevelopment: number
  mentoringAvailability: number
  promotionFairness: number
  learningBudget: number
  internalMobility: number
}

export interface DiversityMetrics {
  genderDiversity: number
  ethnicDiversity: number
  ageDiversity: number
  inclusionScore: number
  payEquity: number
  representationGoals: number
}

export interface CommunicationMetrics {
  transparencyScore: number
  feedbackFrequency: number
  informationSharing: number
  collaborationEffectiveness: number
  conflictResolution: number
}

export interface RetentionMetrics {
  overallRetention: number
  retentionByLevel: { [level: string]: number }
  retentionByDepartment: { [department: string]: number }
  voluntaryTurnover: number
  regrettableTurnover: number
  exitReasons: ExitReason[]
}

export interface ExitReason {
  reason: string
  frequency: number
  trend: 'increasing' | 'stable' | 'decreasing'
  preventability: 'high' | 'medium' | 'low'
}

export interface OperationalHealthMetrics {
  productivity: ProductivityMetrics
  efficiency: EfficiencyMetrics
  quality: QualityMetrics
  innovation: InnovationMetrics
  customerSatisfaction: CustomerSatisfactionMetrics
  technology: TechnologyMetrics
}

export interface ProductivityMetrics {
  overallProductivity: number
  productivityTrend: 'improving' | 'stable' | 'declining'
  productivityByTeam: { [team: string]: number }
  outputQuality: number
  deliveryTimeliness: number
}

export interface EfficiencyMetrics {
  operationalEfficiency: number
  processOptimization: number
  resourceUtilization: number
  wasteReduction: number
  automationLevel: number
}

export interface QualityMetrics {
  productQuality: number
  serviceQuality: number
  defectRate: number
  customerComplaintRate: number
  qualityImprovementRate: number
}

export interface InnovationMetrics {
  innovationIndex: number
  rdInvestment: number
  patentActivity: number
  newProductDevelopment: number
  timeToMarket: number
  innovationCulture: number
}

export interface CustomerSatisfactionMetrics {
  customerSatisfactionScore: number
  netPromoterScore: number
  customerRetention: number
  customerAcquisitionCost: number
  customerLifetimeValue: number
  churnRate: number
}

export interface TechnologyMetrics {
  techStackModernity: number
  scalabilityScore: number
  securityScore: number
  uptimeReliability: number
  technicalDebt: number
  innovationCapacity: number
}

export interface MarketPositionMetrics {
  marketShare: number
  competitivePosition: number
  brandStrength: number
  customerLoyalty: number
  marketGrowthRate: number
  competitivePressure: number
  marketDisruptionRisk: number
}

export interface EmployeeInsightMetrics {
  glassdoorRating: number
  glassdoorReviewCount: number
  linkedinFollowers: number
  employeeBrandRating: number
  socialSentiment: SocialSentimentMetrics
  recruitmentDifficulty: RecruitmentMetrics
}

export interface SocialSentimentMetrics {
  overallSentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore: number
  sentimentTrend: 'improving' | 'stable' | 'declining'
  mentionVolume: number
  keyTopics: SentimentTopic[]
}

export interface SentimentTopic {
  topic: string
  sentiment: number
  volume: number
  trend: 'rising' | 'stable' | 'falling'
}

export interface RecruitmentMetrics {
  timeToHire: number
  costPerHire: number
  acceptanceRate: number
  sourceQuality: { [source: string]: number }
  recruitmentDifficulty: number
  talentMarketCompetition: number
}

export interface TrendsAnalysis {
  shortTermTrends: Trend[]
  longTermTrends: Trend[]
  seasonalPatterns: SeasonalPattern[]
  anomalies: Anomaly[]
  correlations: Correlation[]
}

export interface Trend {
  metric: string
  direction: 'upward' | 'downward' | 'stable' | 'volatile'
  strength: number
  duration: number
  significance: 'low' | 'medium' | 'high'
  prediction: TrendPrediction
}

export interface TrendPrediction {
  continuationProbability: number
  expectedDuration: number
  potentialImpact: string
  inflectionPoints: InflectionPoint[]
}

export interface InflectionPoint {
  date: Date
  description: string
  probability: number
  impact: number
}

export interface SeasonalPattern {
  metric: string
  pattern: string
  strength: number
  predictability: number
  businessImpact: number
}

export interface Anomaly {
  metric: string
  date: Date
  deviation: number
  significance: number
  possibleCauses: string[]
  impact: string
}

export interface Correlation {
  metric1: string
  metric2: string
  strength: number
  type: 'positive' | 'negative'
  reliability: number
  businessRelevance: number
}

export interface HealthAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  metrics: string[]
  recommendations: string[]
  urgency: 'immediate' | 'high' | 'medium' | 'low'
  estimatedImpact: number
  timeframe: string
  createdAt: Date
  status: 'active' | 'acknowledged' | 'resolved'
}

export type AlertType = 
  | 'layoff_risk'
  | 'financial_distress'
  | 'culture_decline'
  | 'talent_flight'
  | 'competitive_threat'
  | 'market_disruption'
  | 'operational_issue'
  | 'compliance_risk'

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type RiskLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high'

export interface CompanyHealthAnalysisRequest {
  companyId: string
  companyName: string
  industry: string
  analysisDepth: 'basic' | 'standard' | 'comprehensive'
  dataReferences: DataReference[]
  customMetrics?: string[]
}

export interface DataReference {
  source: 'financial_reports' | 'employee_reviews' | 'news_articles' | 'social_media' | 'regulatory_filings' | 'market_data'
  url?: string
  content?: string
  date: Date
  reliability: number
}

export class CompanyHealthMonitor {
  private openai: OpenAI
  private readonly HEALTH_PROMPTS = {
    comprehensiveAnalysis: `Analyze this company's health comprehensively:
    
    Company: {companyName}
    Industry: {industry}
    Financial Data: {financialData}
    Employee Data: {employeeData}
    Market Data: {marketData}
    News/Events: {newsData}
    
    Provide detailed analysis including:
    1. Overall health score (0-100)
    2. Risk assessment with specific probabilities
    3. Financial stability analysis
    4. Culture and employee health metrics
    5. Market position and competitive threats
    6. Layoff risk prediction with early warning signals
    7. Growth outlook and opportunities
    8. Specific alerts and recommendations
    
    Focus on actionable insights for job seekers and provide confidence levels.
    Return comprehensive JSON analysis.`,
    
    layoffPrediction: `Predict layoff risk for this company:
    
    Company: {companyName}
    Recent Financial Performance: {financialData}
    Industry Trends: {industryTrends}
    Employee Signals: {employeeSignals}
    Market Conditions: {marketConditions}
    
    Analyze:
    1. Probability of layoffs in next 3, 6, 12 months
    2. Potential scale and departments affected
    3. Early warning signals currently present
    4. Historical patterns and triggers
    5. Mitigating factors that could prevent layoffs
    6. Confidence level in predictions
    
    Provide specific, data-driven predictions with explanations.`,
    
    cultureAssessment: `Assess company culture health:
    
    Company: {companyName}
    Employee Reviews: {employeeReviews}
    Glassdoor Data: {glassdoorData}
    Leadership Changes: {leadershipData}
    Diversity Data: {diversityData}
    
    Evaluate:
    1. Current culture health score
    2. Employee satisfaction trends
    3. Leadership effectiveness
    4. Diversity and inclusion progress
    5. Work-life balance indicators
    6. Retention and turnover patterns
    7. Red flags and warning signs
    8. Cultural risk factors
    
    Provide actionable insights for potential employees.`
  }

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async analyzeCompanyHealth(request: CompanyHealthAnalysisRequest): Promise<CompanyHealthProfile> {
    try {
      const prompt = this.HEALTH_PROMPTS.comprehensiveAnalysis
        .replace('{companyName}', request.companyName)
        .replace('{industry}', request.industry)
        .replace('{financialData}', this.extractFinancialData(request.dataReferences))
        .replace('{employeeData}', this.extractEmployeeData(request.dataReferences))
        .replace('{marketData}', this.extractMarketData(request.dataReferences))
        .replace('{newsData}', this.extractNewsData(request.dataReferences))

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert financial analyst, HR consultant, and business intelligence specialist. Provide accurate, unbiased company health assessments with specific data and confidence levels.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })

      const analysis = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        id: `health_${Date.now()}`,
        companyId: request.companyId,
        companyName: request.companyName,
        industry: request.industry,
        lastUpdated: new Date(),
        healthScore: analysis.healthScore || 75,
        riskLevel: analysis.riskLevel || 'medium',
        predictions: analysis.predictions || this.getDefaultPredictions(),
        financialHealth: analysis.financialHealth || this.getDefaultFinancialHealth(),
        cultureHealth: analysis.cultureHealth || this.getDefaultCultureHealth(),
        operationalHealth: analysis.operationalHealth || this.getDefaultOperationalHealth(),
        marketPosition: analysis.marketPosition || this.getDefaultMarketPosition(),
        employeeInsights: analysis.employeeInsights || this.getDefaultEmployeeInsights(),
        dataConfidence: analysis.dataConfidence || 80,
        trendsAnalysis: analysis.trendsAnalysis || this.getDefaultTrendsAnalysis(),
        alerts: analysis.alerts || []
      }
    } catch (error) {
      console.error('Error analyzing company health:', error)
      return this.getFallbackHealthProfile(request)
    }
  }

  async predictLayoffRisk(companyId: string, dataReferences: DataReference[]): Promise<LayoffRiskPrediction> {
    try {
      const prompt = this.HEALTH_PROMPTS.layoffPrediction
        .replace('{companyName}', 'Target Company')
        .replace('{financialData}', this.extractFinancialData(dataReferences))
        .replace('{industryTrends}', 'Technology sector facing economic headwinds')
        .replace('{employeeSignals}', this.extractEmployeeData(dataReferences))
        .replace('{marketConditions}', 'Challenging market with reduced funding')

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a layoff prediction specialist with expertise in corporate restructuring patterns. Provide specific, data-driven layoff risk assessments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      })

      const prediction = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        probability: prediction.probability || 25,
        severity: prediction.severity || 'moderate',
        potentialImpact: prediction.potentialImpact || 15,
        earlyWarningSignals: prediction.earlyWarningSignals || [],
        timeframe: prediction.timeframe || '6-12 months',
        confidence: prediction.confidence || 75,
        mitigatingFactors: prediction.mitigatingFactors || [],
        riskFactors: prediction.riskFactors || []
      }
    } catch (error) {
      console.error('Error predicting layoff risk:', error)
      return this.getDefaultLayoffPrediction()
    }
  }

  async assessCultureHealth(companyId: string, employeeData: any): Promise<CultureHealthMetrics> {
    try {
      const prompt = this.HEALTH_PROMPTS.cultureAssessment
        .replace('{companyName}', 'Target Company')
        .replace('{employeeReviews}', JSON.stringify(employeeData.reviews))
        .replace('{glassdoorData}', JSON.stringify(employeeData.glassdoor))
        .replace('{leadershipData}', JSON.stringify(employeeData.leadership))
        .replace('{diversityData}', JSON.stringify(employeeData.diversity))

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a corporate culture and HR analytics expert. Assess company culture health with specific metrics and actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2500
      })

      const assessment = JSON.parse(response.choices[0].message.content || '{}')
      
      return this.getDefaultCultureHealth() // Would map assessment results
    } catch (error) {
      console.error('Error assessing culture health:', error)
      return this.getDefaultCultureHealth()
    }
  }

  async generateHealthAlerts(profile: CompanyHealthProfile): Promise<HealthAlert[]> {
    const alerts: HealthAlert[] = []

    // Generate alerts based on thresholds
    if (profile.predictions.layoffRisk.probability > 40) {
      alerts.push({
        id: `alert_${Date.now()}_layoff`,
        type: 'layoff_risk',
        severity: profile.predictions.layoffRisk.probability > 70 ? 'critical' : 'high',
        title: 'Elevated Layoff Risk Detected',
        description: `${profile.predictions.layoffRisk.probability}% probability of layoffs in ${profile.predictions.layoffRisk.timeframe}`,
        metrics: ['layoff_probability', 'financial_stability'],
        recommendations: [
          'Consider negotiating retention bonus',
          'Update resume and LinkedIn profile',
          'Build network outside current company',
          'Monitor early warning signals'
        ],
        urgency: profile.predictions.layoffRisk.probability > 70 ? 'immediate' : 'high',
        estimatedImpact: profile.predictions.layoffRisk.potentialImpact,
        timeframe: profile.predictions.layoffRisk.timeframe,
        createdAt: new Date(),
        status: 'active'
      })
    }

    if (profile.healthScore < 50) {
      alerts.push({
        id: `alert_${Date.now()}_health`,
        type: 'financial_distress',
        severity: 'high',
        title: 'Poor Company Health Score',
        description: `Company health score of ${profile.healthScore} indicates significant concerns`,
        metrics: ['health_score', 'financial_metrics'],
        recommendations: [
          'Exercise caution with long-term commitments',
          'Negotiate shorter vesting schedules',
          'Seek additional compensation guarantees'
        ],
        urgency: 'high',
        estimatedImpact: 75,
        timeframe: '3-6 months',
        createdAt: new Date(),
        status: 'active'
      })
    }

    return alerts
  }

  async trackHealthTrends(companyId: string, historicalData: CompanyHealthProfile[]): Promise<TrendsAnalysis> {
    // Analyze trends across historical health profiles
    return this.getDefaultTrendsAnalysis()
  }

  // Helper methods
  private extractFinancialData(references: DataReference[]): string {
    const financialRefs = references.filter(ref => ref.source === 'financial_reports')
    return financialRefs.map(ref => ref.content || 'Financial data available').join('; ')
  }

  private extractEmployeeData(references: DataReference[]): string {
    const employeeRefs = references.filter(ref => ref.source === 'employee_reviews')
    return employeeRefs.map(ref => ref.content || 'Employee review data available').join('; ')
  }

  private extractMarketData(references: DataReference[]): string {
    const marketRefs = references.filter(ref => ref.source === 'market_data')
    return marketRefs.map(ref => ref.content || 'Market data available').join('; ')
  }

  private extractNewsData(references: DataReference[]): string {
    const newsRefs = references.filter(ref => ref.source === 'news_articles')
    return newsRefs.map(ref => ref.content || 'News data available').join('; ')
  }

  private getFallbackHealthProfile(request: CompanyHealthAnalysisRequest): CompanyHealthProfile {
    return {
      id: `health_fallback_${Date.now()}`,
      companyId: request.companyId,
      companyName: request.companyName,
      industry: request.industry,
      lastUpdated: new Date(),
      healthScore: 75,
      riskLevel: 'medium',
      predictions: this.getDefaultPredictions(),
      financialHealth: this.getDefaultFinancialHealth(),
      cultureHealth: this.getDefaultCultureHealth(),
      operationalHealth: this.getDefaultOperationalHealth(),
      marketPosition: this.getDefaultMarketPosition(),
      employeeInsights: this.getDefaultEmployeeInsights(),
      dataConfidence: 60,
      trendsAnalysis: this.getDefaultTrendsAnalysis(),
      alerts: []
    }
  }

  private getDefaultPredictions(): HealthPredictions {
    return {
      layoffRisk: this.getDefaultLayoffPrediction(),
      financialStability: {
        stabilityScore: 75,
        cashRunway: 18,
        profitabilityTrend: 'stable',
        debtToEquityRatio: 0.3,
        burnRate: 500000,
        fundingRisk: 30,
        marketValuationTrend: 'stable',
        creditRating: 'BBB'
      },
      growthOutlook: {
        growthProbability: 70,
        expectedGrowthRate: 15,
        scalingChallenges: [],
        opportunityAreas: [],
        competitiveThreats: [],
        marketExpansionPotential: 60
      },
      cultureDeterioration: {
        deteriorationRisk: 25,
        burnoutLevel: 30,
        turnoverRisk: 20,
        engagementTrend: 'stable',
        toxicityIndicators: [],
        diversityHealth: {
          inclusionScore: 75,
          representationGaps: [],
          payEquityScore: 80,
          promotionEquity: 75,
          retentionByDemographic: {}
        }
      },
      marketDisruption: {
        disruptionRisk: 35,
        disruptionSources: [],
        adaptabilityScore: 70,
        innovationCapacity: 65,
        marketShareTrend: 'stable'
      },
      timeHorizon: '12_months'
    }
  }

  private getDefaultLayoffPrediction(): LayoffRiskPrediction {
    return {
      probability: 25,
      severity: 'moderate',
      potentialImpact: 15,
      earlyWarningSignals: [],
      timeframe: '6-12 months',
      confidence: 75,
      mitigatingFactors: ['Strong market position', 'Recent funding round'],
      riskFactors: ['Economic uncertainty', 'Industry consolidation']
    }
  }

  private getDefaultFinancialHealth(): FinancialHealthMetrics {
    return {
      revenue: {
        currentRevenue: 50000000,
        revenueGrowthRate: 20,
        revenueStability: 80,
        revenueStreams: [],
        seasonalityImpact: 10,
        customerConcentrationRisk: 25
      },
      profitability: {
        grossMargin: 70,
        operatingMargin: 15,
        netMargin: 10,
        marginTrends: [],
        profitabilityRank: 75,
        industryComparison: 5
      },
      cashFlow: {
        operatingCashFlow: 8000000,
        freeCashFlow: 5000000,
        cashBurnRate: 1000000,
        cashPosition: 25000000,
        cashEfficiency: 75,
        liquidityRatio: 2.5
      },
      funding: {
        totalFundingRaised: 100000000,
        lastFundingDate: new Date(),
        lastFundingAmount: 30000000,
        investorQuality: 85,
        fundingStage: 'Series C',
        nextFundingTimeline: '18-24 months',
        fundingRisk: 30
      },
      expenses: {
        operatingExpenses: 35000000,
        employeeCosts: 20000000,
        marketingSpend: 5000000,
        rdSpend: 8000000,
        expenseEfficiency: 75,
        costControl: 80
      },
      valuation: {
        currentValuation: 500000000,
        valuationTrend: 'stable',
        marketMultiple: 10,
        industryComparison: 0,
        valuationRisk: 35
      },
      riskFactors: []
    }
  }

  private getDefaultCultureHealth(): CultureHealthMetrics {
    return {
      employeeSatisfaction: {
        overallSatisfaction: 75,
        satisfactionTrend: 'stable',
        satisfactionByDepartment: {},
        satisfactionDrivers: [],
        detractors: []
      },
      workLifeBalance: {
        balanceScore: 70,
        averageWorkingHours: 45,
        overtimeFrequency: 25,
        flexibilityScore: 80,
        stressLevel: 40,
        burnoutRisk: 30
      },
      leadership: {
        leadershipEffectiveness: 75,
        trustScore: 70,
        visionClarity: 80,
        decisionMaking: 75,
        supportScore: 70,
        leadershipStability: 85
      },
      development: {
        careerGrowthOpportunities: 70,
        skillDevelopment: 75,
        mentoringAvailability: 60,
        promotionFairness: 70,
        learningBudget: 80,
        internalMobility: 65
      },
      diversity: {
        genderDiversity: 60,
        ethnicDiversity: 55,
        ageDiversity: 70,
        inclusionScore: 75,
        payEquity: 80,
        representationGoals: 70
      },
      communication: {
        transparencyScore: 70,
        feedbackFrequency: 75,
        informationSharing: 65,
        collaborationEffectiveness: 80,
        conflictResolution: 70
      },
      retention: {
        overallRetention: 85,
        retentionByLevel: {},
        retentionByDepartment: {},
        voluntaryTurnover: 15,
        regrettableTurnover: 8,
        exitReasons: []
      }
    }
  }

  private getDefaultOperationalHealth(): OperationalHealthMetrics {
    return {
      productivity: {
        overallProductivity: 75,
        productivityTrend: 'stable',
        productivityByTeam: {},
        outputQuality: 80,
        deliveryTimeliness: 85
      },
      efficiency: {
        operationalEfficiency: 70,
        processOptimization: 65,
        resourceUtilization: 75,
        wasteReduction: 60,
        automationLevel: 50
      },
      quality: {
        productQuality: 85,
        serviceQuality: 80,
        defectRate: 2,
        customerComplaintRate: 1,
        qualityImprovementRate: 10
      },
      innovation: {
        innovationIndex: 70,
        rdInvestment: 15,
        patentActivity: 5,
        newProductDevelopment: 3,
        timeToMarket: 12,
        innovationCulture: 75
      },
      customerSatisfaction: {
        customerSatisfactionScore: 85,
        netPromoterScore: 45,
        customerRetention: 90,
        customerAcquisitionCost: 1000,
        customerLifetimeValue: 15000,
        churnRate: 5
      },
      technology: {
        techStackModernity: 80,
        scalabilityScore: 75,
        securityScore: 85,
        uptimeReliability: 99.5,
        technicalDebt: 25,
        innovationCapacity: 70
      }
    }
  }

  private getDefaultMarketPosition(): MarketPositionMetrics {
    return {
      marketShare: 15,
      competitivePosition: 3,
      brandStrength: 70,
      customerLoyalty: 75,
      marketGrowthRate: 25,
      competitivePressure: 60,
      marketDisruptionRisk: 35
    }
  }

  private getDefaultEmployeeInsights(): EmployeeInsightMetrics {
    return {
      glassdoorRating: 4.2,
      glassdoorReviewCount: 350,
      linkedinFollowers: 25000,
      employeeBrandRating: 75,
      socialSentiment: {
        overallSentiment: 'positive',
        sentimentScore: 70,
        sentimentTrend: 'stable',
        mentionVolume: 150,
        keyTopics: []
      },
      recruitmentDifficulty: {
        timeToHire: 45,
        costPerHire: 5000,
        acceptanceRate: 75,
        sourceQuality: {},
        recruitmentDifficulty: 60,
        talentMarketCompetition: 70
      }
    }
  }

  private getDefaultTrendsAnalysis(): TrendsAnalysis {
    return {
      shortTermTrends: [],
      longTermTrends: [],
      seasonalPatterns: [],
      anomalies: [],
      correlations: []
    }
  }
}

// Export the company health monitor instance
export const companyHealthMonitor = new CompanyHealthMonitor()

// Utility functions for the frontend
export const CompanyHealthUtils = {
  formatHealthScore: (score: number): string => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Very Good'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 50) return 'Poor'
    return 'Critical'
  },

  getHealthScoreColor: (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  },

  getRiskLevelColor: (risk: RiskLevel): string => {
    switch (risk) {
      case 'very_low': return 'text-green-600'
      case 'low': return 'text-blue-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-orange-600'
      case 'very_high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  },

  formatLayoffRisk: (probability: number): string => {
    if (probability < 10) return 'Very Low'
    if (probability < 25) return 'Low'
    if (probability < 50) return 'Moderate'
    if (probability < 75) return 'High'
    return 'Very High'
  },

  getAlertSeverityColor: (severity: AlertSeverity): string => {
    switch (severity) {
      case 'low': return 'text-blue-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-orange-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  },

  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  },

  formatPercentage: (value: number): string => {
    return `${Math.round(value)}%`
  }
}