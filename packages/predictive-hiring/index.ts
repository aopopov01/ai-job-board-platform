import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export interface HiringPrediction {
  id: string
  jobId: string
  candidateId: string
  companyId: string
  predictionType: 'success_probability' | 'time_to_hire' | 'retention_likelihood' | 'performance_score' | 'cultural_fit'
  score: number // 0-100
  confidence: number // 0-100
  factors: PredictionFactor[]
  modelVersion: string
  generatedAt: string
  expiresAt: string
  actualOutcome?: ActualOutcome
}

export interface PredictionFactor {
  factor: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number // 0-1
  score: number // 0-100
  explanation: string
  category: 'skills' | 'experience' | 'education' | 'cultural' | 'behavioral' | 'performance'
}

export interface ActualOutcome {
  hired: boolean
  hireDate?: string
  performanceRating?: number // 1-5
  retentionMonths?: number
  terminationReason?: string
  recordedAt: string
}

export interface TalentPoolAnalysis {
  id: string
  companyId: string
  analysisType: 'market_availability' | 'competitive_landscape' | 'skill_gap_analysis' | 'salary_benchmarking'
  targetRole: string
  targetSkills: string[]
  location: string[]
  experience: {
    min: number
    max: number
  }
  findings: AnalysisFinding[]
  recommendations: string[]
  marketMetrics: MarketMetrics
  generatedAt: string
  validUntil: string
}

export interface AnalysisFinding {
  type: 'opportunity' | 'challenge' | 'trend' | 'insight'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number // 0-100
  data: any
}

export interface MarketMetrics {
  totalCandidates: number
  activeCandidates: number
  averageSalaryExpectation: number
  salaryRanges: {
    p25: number
    p50: number
    p75: number
    p90: number
  }
  timeToFill: number // average days
  competitionLevel: 'low' | 'medium' | 'high' | 'extreme'
  demandSupplyRatio: number
  topSkillsInDemand: string[]
  emergingSkills: string[]
}

export interface HiringVelocityAnalysis {
  id: string
  companyId: string
  periodStart: string
  periodEnd: string
  roles: RoleVelocityMetrics[]
  overallMetrics: VelocityMetrics
  bottlenecks: HiringBottleneck[]
  recommendations: VelocityRecommendation[]
  benchmarkComparison: BenchmarkData
  generatedAt: string
}

export interface RoleVelocityMetrics {
  role: string
  department: string
  metrics: VelocityMetrics
  stagePerformance: StagePerformance[]
}

export interface VelocityMetrics {
  totalHires: number
  averageTimeToHire: number // days
  averageTimeToOffer: number // days
  offerAcceptanceRate: number // 0-100
  candidateDropoffRate: number // 0-100
  sourceEffectiveness: { [source: string]: number }
  costPerHire: number
  qualityOfHire: number // 0-100
}

export interface StagePerformance {
  stageName: string
  averageTime: number // days
  passRate: number // 0-100
  bottleneckIndicator: boolean
  improvementPotential: number // 0-100
}

export interface HiringBottleneck {
  stage: string
  severity: 'minor' | 'moderate' | 'major' | 'critical'
  impact: string
  avgDelay: number // days
  affectedRoles: string[]
  recommendations: string[]
}

export interface VelocityRecommendation {
  type: 'process_improvement' | 'resource_allocation' | 'technology_adoption' | 'training_need'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  expectedImpact: string
  implementationEffort: 'low' | 'medium' | 'high'
  estimatedTimeSaving: number // days
  estimatedCostSaving: number
}

export interface BenchmarkData {
  industryAverages: VelocityMetrics
  peerCompanies: VelocityMetrics
  topPerformers: VelocityMetrics
  userPerformance: 'below' | 'average' | 'above' | 'top_tier'
}

export interface CandidateMatch {
  candidateId: string
  jobId: string
  overallScore: number // 0-100
  skillsMatch: SkillsMatchAnalysis
  experienceMatch: ExperienceMatchAnalysis
  culturalFit: CulturalFitAnalysis
  salaryAlignment: SalaryAlignmentAnalysis
  locationFit: LocationFitAnalysis
  availabilityMatch: AvailabilityMatchAnalysis
  riskFactors: RiskFactor[]
  strengthFactors: StrengthFactor[]
  interviewRecommendations: InterviewRecommendation[]
}

export interface SkillsMatchAnalysis {
  overallMatch: number // 0-100
  requiredSkillsMatch: RequiredSkillMatch[]
  preferredSkillsMatch: PreferredSkillMatch[]
  missingCriticalSkills: string[]
  extraSkills: string[]
  skillGapAnalysis: SkillGap[]
  trainabilityScore: number // 0-100
}

export interface RequiredSkillMatch {
  skill: string
  required: boolean
  candidateLevel: number // 0-100
  requiredLevel: number // 0-100
  match: number // 0-100
  verificationMethod: 'resume' | 'assessment' | 'certification' | 'portfolio' | 'interview'
}

export interface PreferredSkillMatch {
  skill: string
  candidateLevel: number // 0-100
  bonus: number // additional points
}

export interface SkillGap {
  skill: string
  gap: number // 0-100
  trainingTime: number // estimated weeks
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface ExperienceMatchAnalysis {
  overallMatch: number // 0-100
  yearsExperience: {
    candidate: number
    required: number
    match: number
  }
  industryExperience: IndustryExperienceMatch[]
  roleProgression: RoleProgressionAnalysis
  companyTypeMatch: CompanyTypeMatch
  teamLeadershipExperience: boolean
  projectManagementExperience: boolean
}

export interface IndustryExperienceMatch {
  industry: string
  candidateYears: number
  relevanceScore: number // 0-100
  isTargetIndustry: boolean
}

export interface RoleProgressionAnalysis {
  progressionScore: number // 0-100
  careerTrajectory: 'ascending' | 'lateral' | 'declining' | 'transitioning'
  leadershipProgression: boolean
  responsibilityGrowth: boolean
  roleAlignment: number // 0-100
}

export interface CompanyTypeMatch {
  candidateBackground: 'startup' | 'scaleup' | 'enterprise' | 'agency' | 'nonprofit'
  targetCompanyType: 'startup' | 'scaleup' | 'enterprise' | 'agency' | 'nonprofit'
  adaptabilityScore: number // 0-100
}

export interface CulturalFitAnalysis {
  overallFit: number // 0-100
  valuesAlignment: ValuesAlignment[]
  workStyleMatch: WorkStyleMatch
  communicationStyleMatch: CommunicationStyleMatch
  teamDynamicsFit: TeamDynamicsFit
  personalityFit: PersonalityFit
  riskIndicators: string[]
}

export interface ValuesAlignment {
  value: string
  candidateScore: number // 0-100
  companyScore: number // 0-100
  alignment: number // 0-100
  importance: 'low' | 'medium' | 'high' | 'critical'
}

export interface WorkStyleMatch {
  remoteReadiness: number // 0-100
  autonomyPreference: number // 0-100
  collaborationStyle: number // 0-100
  pacePreference: 'fast' | 'moderate' | 'deliberate'
  feedbackStyle: 'direct' | 'diplomatic' | 'supportive'
}

export interface CommunicationStyleMatch {
  formalityLevel: number // 0-100
  directnessLevel: number // 0-100
  meetingFrequencyPreference: 'minimal' | 'moderate' | 'frequent'
  documentationStyle: 'detailed' | 'concise' | 'visual'
}

export interface TeamDynamicsFit {
  teamSizePreference: 'small' | 'medium' | 'large'
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'lead'
  mentorshipCapability: number // 0-100
  crossFunctionalCollaboration: number // 0-100
}

export interface PersonalityFit {
  introversion: number // 0-100
  conscientiousness: number // 0-100
  openness: number // 0-100
  agreeableness: number // 0-100
  emotionalStability: number // 0-100
  culturalCompatibility: number // 0-100
}

export interface SalaryAlignmentAnalysis {
  alignment: number // 0-100
  candidateExpectation: number
  jobBudget: number
  marketRate: number
  negotiationProbability: number // 0-100
  riskLevel: 'low' | 'medium' | 'high'
  recommendations: string[]
}

export interface LocationFitAnalysis {
  match: number // 0-100
  candidateLocation: string
  jobLocation: string
  relocationRequired: boolean
  relocationWillingness: number // 0-100
  remoteCompatibility: number // 0-100
  commuteFeasibility: number // 0-100
}

export interface AvailabilityMatchAnalysis {
  match: number // 0-100
  candidateAvailability: string
  jobUrgency: 'immediate' | 'within_2_weeks' | 'within_month' | 'flexible'
  noticePeriod: number // weeks
  startDateAlignment: number // 0-100
}

export interface RiskFactor {
  type: 'skill_gap' | 'experience_mismatch' | 'overqualification' | 'salary_mismatch' | 'cultural_misfit' | 'availability_conflict'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  mitigation: string[]
  impact: number // 0-100
}

export interface StrengthFactor {
  type: 'exceptional_skills' | 'relevant_experience' | 'cultural_champion' | 'growth_potential' | 'leadership_qualities'
  description: string
  impact: number // 0-100
  evidence: string[]
}

export interface InterviewRecommendation {
  focus: string
  questions: string[]
  assessments: string[]
  redFlags: string[]
  positiveIndicators: string[]
}

export interface SuccessPredictionModel {
  id: string
  modelName: string
  version: string
  trainingData: {
    totalSamples: number
    timeRange: {
      start: string
      end: string
    }
    industries: string[]
    roles: string[]
  }
  accuracy: number // 0-100
  precision: number // 0-100
  recall: number // 0-100
  features: ModelFeature[]
  lastTrained: string
  isActive: boolean
}

export interface ModelFeature {
  name: string
  importance: number // 0-1
  type: 'categorical' | 'numerical' | 'text' | 'boolean'
  description: string
}

export interface HiringOutcomeTracking {
  id: string
  candidateId: string
  jobId: string
  companyId: string
  hired: boolean
  hireDate?: string
  rejectionReason?: string
  onboardingScore?: number // 0-100
  thirtyDayPerformance?: number // 0-100
  sixtyDayPerformance?: number // 0-100
  ninetyDayPerformance?: number // 0-100
  oneYearRetention?: boolean
  twoYearRetention?: boolean
  promotionWithinYear?: boolean
  managerSatisfaction?: number // 0-100
  employeeSatisfaction?: number // 0-100
  culturalIntegration?: number // 0-100
  updatedAt: string
}

export class PredictiveHiringIntelligence {
  private companyId: string
  private currentModel: SuccessPredictionModel | null = null

  constructor(companyId: string) {
    this.companyId = companyId
  }

  // Candidate-Job Matching
  async generateCandidateMatch(candidateId: string, jobId: string): Promise<CandidateMatch> {
    try {
      // Get comprehensive data for both candidate and job
      const [candidate, job, company] = await Promise.all([
        this.getCandidateData(candidateId),
        this.getJobData(jobId),
        this.getCompanyData(this.companyId)
      ])

      // Analyze different aspects of the match
      const [
        skillsMatch,
        experienceMatch,
        culturalFit,
        salaryAlignment,
        locationFit,
        availabilityMatch
      ] = await Promise.all([
        this.analyzeSkillsMatch(candidate, job),
        this.analyzeExperienceMatch(candidate, job),
        this.analyzeCulturalFit(candidate, company),
        this.analyzeSalaryAlignment(candidate, job),
        this.analyzeLocationFit(candidate, job),
        this.analyzeAvailabilityMatch(candidate, job)
      ])

      // Calculate overall score
      const overallScore = this.calculateOverallMatchScore({
        skillsMatch,
        experienceMatch,
        culturalFit,
        salaryAlignment,
        locationFit,
        availabilityMatch
      })

      // Identify risk and strength factors
      const riskFactors = this.identifyRiskFactors({
        skillsMatch,
        experienceMatch,
        culturalFit,
        salaryAlignment,
        locationFit,
        availabilityMatch
      })

      const strengthFactors = this.identifyStrengthFactors({
        skillsMatch,
        experienceMatch,
        culturalFit,
        salaryAlignment,
        locationFit,
        availabilityMatch
      })

      // Generate interview recommendations
      const interviewRecommendations = await this.generateInterviewRecommendations(
        candidate,
        job,
        { riskFactors, strengthFactors }
      )

      const candidateMatch: CandidateMatch = {
        candidateId,
        jobId,
        overallScore,
        skillsMatch,
        experienceMatch,
        culturalFit,
        salaryAlignment,
        locationFit,
        availabilityMatch,
        riskFactors,
        strengthFactors,
        interviewRecommendations
      }

      // Store the match analysis
      await this.storeCandidateMatch(candidateMatch)

      return candidateMatch
    } catch (error) {
      console.error('Failed to generate candidate match:', error)
      throw error
    }
  }

  private async analyzeSkillsMatch(candidate: any, job: any): Promise<SkillsMatchAnalysis> {
    const requiredSkills = job.required_skills || []
    const preferredSkills = job.preferred_skills || []
    const candidateSkills = candidate.user_skills || []

    const requiredSkillsMatch: RequiredSkillMatch[] = requiredSkills.map((skill: string) => {
      const candidateSkill = candidateSkills.find((cs: any) => 
        cs.skill_name.toLowerCase() === skill.toLowerCase()
      )
      
      const candidateLevel = candidateSkill ? candidateSkill.proficiency_level : 0
      const requiredLevel = 70 // Default requirement level
      const match = candidateLevel >= requiredLevel ? 100 : (candidateLevel / requiredLevel) * 100

      return {
        skill,
        required: true,
        candidateLevel,
        requiredLevel,
        match,
        verificationMethod: candidateSkill ? 'resume' : 'missing'
      }
    })

    const preferredSkillsMatch: PreferredSkillMatch[] = preferredSkills.map((skill: string) => {
      const candidateSkill = candidateSkills.find((cs: any) => 
        cs.skill_name.toLowerCase() === skill.toLowerCase()
      )
      
      return {
        skill,
        candidateLevel: candidateSkill ? candidateSkill.proficiency_level : 0,
        bonus: candidateSkill ? candidateSkill.proficiency_level * 0.1 : 0
      }
    })

    const missingCriticalSkills = requiredSkillsMatch
      .filter(rsm => rsm.match < 50)
      .map(rsm => rsm.skill)

    const extraSkills = candidateSkills
      .filter((cs: any) => 
        !requiredSkills.includes(cs.skill_name) && 
        !preferredSkills.includes(cs.skill_name)
      )
      .map((cs: any) => cs.skill_name)

    const overallMatch = requiredSkillsMatch.length > 0 
      ? requiredSkillsMatch.reduce((sum, rsm) => sum + rsm.match, 0) / requiredSkillsMatch.length
      : 100

    return {
      overallMatch,
      requiredSkillsMatch,
      preferredSkillsMatch,
      missingCriticalSkills,
      extraSkills,
      skillGapAnalysis: missingCriticalSkills.map(skill => ({
        skill,
        gap: 70,
        trainingTime: 4,
        criticalityLevel: 'high' as const
      })),
      trainabilityScore: this.calculateTrainabilityScore(candidate, missingCriticalSkills)
    }
  }

  private async analyzeExperienceMatch(candidate: any, job: any): Promise<ExperienceMatchAnalysis> {
    const candidateYears = candidate.years_experience || 0
    const requiredYears = job.experience_required || 0
    const experienceMatch = candidateYears >= requiredYears ? 100 : (candidateYears / requiredYears) * 100

    const industryExperience: IndustryExperienceMatch[] = []
    if (candidate.work_experience) {
      const industryMap = new Map()
      candidate.work_experience.forEach((exp: any) => {
        const years = industryMap.get(exp.industry) || 0
        industryMap.set(exp.industry, years + (exp.duration_years || 1))
      })

      industryMap.forEach((years, industry) => {
        industryExperience.push({
          industry,
          candidateYears: years,
          relevanceScore: industry === job.industry ? 100 : 50,
          isTargetIndustry: industry === job.industry
        })
      })
    }

    return {
      overallMatch: experienceMatch,
      yearsExperience: {
        candidate: candidateYears,
        required: requiredYears,
        match: experienceMatch
      },
      industryExperience,
      roleProgression: {
        progressionScore: 75, // Would be calculated from role history
        careerTrajectory: 'ascending',
        leadershipProgression: false,
        responsibilityGrowth: true,
        roleAlignment: 80
      },
      companyTypeMatch: {
        candidateBackground: 'enterprise',
        targetCompanyType: 'scaleup',
        adaptabilityScore: 70
      },
      teamLeadershipExperience: false,
      projectManagementExperience: true
    }
  }

  private async analyzeCulturalFit(candidate: any, company: any): Promise<CulturalFitAnalysis> {
    // This would integrate with personality assessments and company culture data
    return {
      overallFit: 75,
      valuesAlignment: [
        {
          value: 'Innovation',
          candidateScore: 80,
          companyScore: 90,
          alignment: 85,
          importance: 'high'
        },
        {
          value: 'Collaboration',
          candidateScore: 70,
          companyScore: 85,
          alignment: 75,
          importance: 'medium'
        }
      ],
      workStyleMatch: {
        remoteReadiness: 85,
        autonomyPreference: 70,
        collaborationStyle: 80,
        pacePreference: 'fast',
        feedbackStyle: 'direct'
      },
      communicationStyleMatch: {
        formalityLevel: 60,
        directnessLevel: 75,
        meetingFrequencyPreference: 'moderate',
        documentationStyle: 'concise'
      },
      teamDynamicsFit: {
        teamSizePreference: 'medium',
        seniorityLevel: 'mid',
        mentorshipCapability: 65,
        crossFunctionalCollaboration: 80
      },
      personalityFit: {
        introversion: 40,
        conscientiousness: 85,
        openness: 90,
        agreeableness: 75,
        emotionalStability: 80,
        culturalCompatibility: 75
      },
      riskIndicators: []
    }
  }

  private async analyzeSalaryAlignment(candidate: any, job: any): Promise<SalaryAlignmentAnalysis> {
    const candidateExpectation = candidate.salary_expectation || 0
    const jobBudget = job.salary_max || 0
    const marketRate = await this.getMarketSalaryRate(job.title, job.location)

    const alignment = candidateExpectation <= jobBudget ? 100 : (jobBudget / candidateExpectation) * 100

    return {
      alignment,
      candidateExpectation,
      jobBudget,
      marketRate,
      negotiationProbability: alignment < 90 ? 80 : 20,
      riskLevel: alignment < 80 ? 'high' : alignment < 90 ? 'medium' : 'low',
      recommendations: alignment < 90 ? ['Consider negotiation strategy', 'Highlight total compensation package'] : []
    }
  }

  private async analyzeLocationFit(candidate: any, job: any): Promise<LocationFitAnalysis> {
    const candidateLocation = candidate.location || ''
    const jobLocation = job.location || ''
    const isRemote = job.remote_type === 'fully_remote'
    const isHybrid = job.remote_type === 'hybrid'

    let match = 100
    let relocationRequired = false

    if (!isRemote && candidateLocation !== jobLocation) {
      relocationRequired = true
      match = candidate.relocation_willingness ? 70 : 30
    }

    return {
      match,
      candidateLocation,
      jobLocation,
      relocationRequired,
      relocationWillingness: candidate.relocation_willingness || 0,
      remoteCompatibility: isRemote || isHybrid ? 100 : 0,
      commuteFeasibility: relocationRequired ? 0 : 100
    }
  }

  private async analyzeAvailabilityMatch(candidate: any, job: any): Promise<AvailabilityMatchAnalysis> {
    const candidateAvailability = candidate.availability || 'flexible'
    const jobUrgency = job.urgency || 'flexible'
    
    // Simplified availability matching logic
    let match = 100
    if (candidateAvailability === 'immediate' && jobUrgency === 'immediate') {
      match = 100
    } else if (candidateAvailability === 'within_month' && jobUrgency === 'immediate') {
      match = 70
    } else if (candidateAvailability !== 'immediate' && jobUrgency === 'immediate') {
      match = 40
    }

    return {
      match,
      candidateAvailability,
      jobUrgency,
      noticePeriod: candidate.notice_period || 2,
      startDateAlignment: match
    }
  }

  private calculateOverallMatchScore(analyses: {
    skillsMatch: SkillsMatchAnalysis
    experienceMatch: ExperienceMatchAnalysis
    culturalFit: CulturalFitAnalysis
    salaryAlignment: SalaryAlignmentAnalysis
    locationFit: LocationFitAnalysis
    availabilityMatch: AvailabilityMatchAnalysis
  }): number {
    const weights = {
      skills: 0.3,
      experience: 0.25,
      cultural: 0.2,
      salary: 0.1,
      location: 0.1,
      availability: 0.05
    }

    return Math.round(
      analyses.skillsMatch.overallMatch * weights.skills +
      analyses.experienceMatch.overallMatch * weights.experience +
      analyses.culturalFit.overallFit * weights.cultural +
      analyses.salaryAlignment.alignment * weights.salary +
      analyses.locationFit.match * weights.location +
      analyses.availabilityMatch.match * weights.availability
    )
  }

  private identifyRiskFactors(analyses: any): RiskFactor[] {
    const risks: RiskFactor[] = []

    // Skills risks
    if (analyses.skillsMatch.missingCriticalSkills.length > 0) {
      risks.push({
        type: 'skill_gap',
        severity: analyses.skillsMatch.missingCriticalSkills.length > 2 ? 'high' : 'medium',
        description: `Missing ${analyses.skillsMatch.missingCriticalSkills.length} critical skills`,
        mitigation: ['Skills assessment', 'Training plan', 'Mentorship'],
        impact: 30
      })
    }

    // Salary risks
    if (analyses.salaryAlignment.alignment < 80) {
      risks.push({
        type: 'salary_mismatch',
        severity: analyses.salaryAlignment.alignment < 60 ? 'high' : 'medium',
        description: 'Salary expectations exceed budget',
        mitigation: ['Negotiate total compensation', 'Highlight growth opportunities'],
        impact: 25
      })
    }

    return risks
  }

  private identifyStrengthFactors(analyses: any): StrengthFactor[] {
    const strengths: StrengthFactor[] = []

    if (analyses.skillsMatch.overallMatch > 90) {
      strengths.push({
        type: 'exceptional_skills',
        description: 'Exceptional skills match with job requirements',
        impact: 30,
        evidence: ['High proficiency in required skills', 'Additional relevant skills']
      })
    }

    if (analyses.culturalFit.overallFit > 85) {
      strengths.push({
        type: 'cultural_champion',
        description: 'Strong cultural fit and values alignment',
        impact: 25,
        evidence: ['Values alignment', 'Work style compatibility']
      })
    }

    return strengths
  }

  // Hiring Velocity Analysis
  async analyzeHiringVelocity(periodStart: string, periodEnd: string): Promise<HiringVelocityAnalysis> {
    try {
      // Get hiring data for the period
      const hiringData = await this.getHiringData(periodStart, periodEnd)
      
      // Analyze by role
      const roleMetrics = await this.calculateRoleVelocityMetrics(hiringData)
      
      // Calculate overall metrics
      const overallMetrics = this.calculateOverallVelocityMetrics(hiringData)
      
      // Identify bottlenecks
      const bottlenecks = this.identifyHiringBottlenecks(roleMetrics)
      
      // Generate recommendations
      const recommendations = await this.generateVelocityRecommendations(bottlenecks, overallMetrics)
      
      // Get benchmark data
      const benchmarkComparison = await this.getBenchmarkData()

      const analysis: HiringVelocityAnalysis = {
        id: this.generateId(),
        companyId: this.companyId,
        periodStart,
        periodEnd,
        roles: roleMetrics,
        overallMetrics,
        bottlenecks,
        recommendations,
        benchmarkComparison,
        generatedAt: new Date().toISOString()
      }

      // Store the analysis
      await this.storeHiringVelocityAnalysis(analysis)

      return analysis
    } catch (error) {
      console.error('Failed to analyze hiring velocity:', error)
      throw error
    }
  }

  // Talent Pool Analysis
  async analyzeTalentPool(criteria: {
    targetRole: string
    targetSkills: string[]
    location: string[]
    experience: { min: number; max: number }
  }): Promise<TalentPoolAnalysis> {
    try {
      // Query available talent based on criteria
      const availableTalent = await this.queryTalentPool(criteria)
      
      // Analyze market metrics
      const marketMetrics = this.calculateMarketMetrics(availableTalent, criteria)
      
      // Generate insights using AI
      const findings = await this.generateTalentPoolInsights(availableTalent, marketMetrics, criteria)
      
      // Generate recommendations
      const recommendations = this.generateTalentPoolRecommendations(findings, marketMetrics)

      const analysis: TalentPoolAnalysis = {
        id: this.generateId(),
        companyId: this.companyId,
        analysisType: 'market_availability',
        ...criteria,
        findings,
        recommendations,
        marketMetrics,
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }

      await this.storeTalentPoolAnalysis(analysis)

      return analysis
    } catch (error) {
      console.error('Failed to analyze talent pool:', error)
      throw error
    }
  }

  // Success Prediction
  async generateSuccessPrediction(candidateId: string, jobId: string): Promise<HiringPrediction> {
    try {
      // Get or train prediction model
      const model = await this.getOrTrainPredictionModel()
      
      // Get comprehensive candidate and job data
      const [candidate, job, historicalData] = await Promise.all([
        this.getCandidateData(candidateId),
        this.getJobData(jobId),
        this.getHistoricalHiringData(jobId)
      ])

      // Generate features for prediction
      const features = this.extractPredictionFeatures(candidate, job, historicalData)
      
      // Use AI to generate prediction
      const aiPrediction = await this.generateAIPrediction(features, model)
      
      // Calculate confidence based on feature completeness and model accuracy
      const confidence = this.calculatePredictionConfidence(features, model)

      const prediction: HiringPrediction = {
        id: this.generateId(),
        jobId,
        candidateId,
        companyId: this.companyId,
        predictionType: 'success_probability',
        score: aiPrediction.score,
        confidence,
        factors: aiPrediction.factors,
        modelVersion: model.version,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }

      await this.storePrediction(prediction)

      return prediction
    } catch (error) {
      console.error('Failed to generate success prediction:', error)
      throw error
    }
  }

  // Helper Methods
  private async getCandidateData(candidateId: string): Promise<any> {
    const { data } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_skills(*),
        work_experience(*),
        education(*)
      `)
      .eq('id', candidateId)
      .single()

    return data
  }

  private async getJobData(jobId: string): Promise<any> {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    return data
  }

  private async getCompanyData(companyId: string): Promise<any> {
    const { data } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('id', companyId)
      .single()

    return data
  }

  private calculateTrainabilityScore(candidate: any, missingSkills: string[]): number {
    // Simplified trainability calculation
    const baseScore = 70
    const learningIndicators = candidate.user_skills?.filter((s: any) => 
      s.skill_name.toLowerCase().includes('learning') || 
      s.skill_name.toLowerCase().includes('adapt')
    ).length || 0

    return Math.min(baseScore + (learningIndicators * 10), 100)
  }

  private async getMarketSalaryRate(jobTitle: string, location: string): Promise<number> {
    // This would integrate with salary data APIs
    return 75000 // Placeholder
  }

  private async storeCandidateMatch(match: CandidateMatch): Promise<void> {
    await supabase
      .from('candidate_matches')
      .insert({
        candidate_id: match.candidateId,
        job_id: match.jobId,
        overall_score: match.overallScore,
        skills_match: match.skillsMatch,
        experience_match: match.experienceMatch,
        cultural_fit: match.culturalFit,
        salary_alignment: match.salaryAlignment,
        location_fit: match.locationFit,
        availability_match: match.availabilityMatch,
        risk_factors: match.riskFactors,
        strength_factors: match.strengthFactors,
        interview_recommendations: match.interviewRecommendations,
        created_at: new Date().toISOString()
      })
  }

  private async generateInterviewRecommendations(
    candidate: any, 
    job: any, 
    analysis: { riskFactors: RiskFactor[], strengthFactors: StrengthFactor[] }
  ): Promise<InterviewRecommendation[]> {
    const recommendations: InterviewRecommendation[] = []

    // Generate recommendations based on risks
    analysis.riskFactors.forEach(risk => {
      if (risk.type === 'skill_gap') {
        recommendations.push({
          focus: 'Skill Assessment',
          questions: [
            'Can you walk me through a project where you used [missing skill]?',
            'How would you approach learning [missing skill] if hired?'
          ],
          assessments: ['Technical assessment', 'Problem-solving scenario'],
          redFlags: ['Inability to explain learning approach', 'Lack of interest in skill development'],
          positiveIndicators: ['Clear learning plan', 'Previous successful skill acquisition']
        })
      }
    })

    // Generate recommendations based on strengths
    analysis.strengthFactors.forEach(strength => {
      if (strength.type === 'exceptional_skills') {
        recommendations.push({
          focus: 'Skill Validation',
          questions: [
            'Tell me about your most challenging project using [skill]',
            'How do you stay current with [skill] developments?'
          ],
          assessments: ['Deep technical dive', 'Architecture discussion'],
          redFlags: ['Surface-level knowledge', 'Outdated practices'],
          positiveIndicators: ['Deep expertise', 'Continuous learning mindset']
        })
      }
    })

    return recommendations
  }

  private async getHiringData(periodStart: string, periodEnd: string): Promise<any[]> {
    const { data } = await supabase
      .from('applications')
      .select(`
        *,
        jobs(*),
        application_stages(*)
      `)
      .eq('jobs.company_id', this.companyId)
      .gte('created_at', periodStart)
      .lte('created_at', periodEnd)

    return data || []
  }

  private async calculateRoleVelocityMetrics(hiringData: any[]): Promise<RoleVelocityMetrics[]> {
    // Group by role and calculate metrics
    const roleGroups = new Map()
    
    hiringData.forEach(application => {
      const role = application.jobs?.title || 'Unknown'
      if (!roleGroups.has(role)) {
        roleGroups.set(role, [])
      }
      roleGroups.get(role).push(application)
    })

    const roleMetrics: RoleVelocityMetrics[] = []
    
    for (const [role, applications] of roleGroups) {
      const metrics = this.calculateMetricsForApplications(applications)
      
      roleMetrics.push({
        role,
        department: applications[0]?.jobs?.department || 'Unknown',
        metrics,
        stagePerformance: this.calculateStagePerformance(applications)
      })
    }

    return roleMetrics
  }

  private calculateOverallVelocityMetrics(hiringData: any[]): VelocityMetrics {
    return this.calculateMetricsForApplications(hiringData)
  }

  private calculateMetricsForApplications(applications: any[]): VelocityMetrics {
    const hiredApplications = applications.filter(app => app.status === 'hired')
    const totalApplications = applications.length

    return {
      totalHires: hiredApplications.length,
      averageTimeToHire: this.calculateAverageTimeToHire(hiredApplications),
      averageTimeToOffer: this.calculateAverageTimeToOffer(applications),
      offerAcceptanceRate: this.calculateOfferAcceptanceRate(applications),
      candidateDropoffRate: this.calculateDropoffRate(applications),
      sourceEffectiveness: this.calculateSourceEffectiveness(applications),
      costPerHire: this.calculateCostPerHire(hiredApplications),
      qualityOfHire: this.calculateQualityOfHire(hiredApplications)
    }
  }

  private calculateAverageTimeToHire(hiredApplications: any[]): number {
    if (hiredApplications.length === 0) return 0
    
    const totalDays = hiredApplications.reduce((sum, app) => {
      const start = new Date(app.created_at)
      const end = new Date(app.hired_at || app.updated_at)
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }, 0)

    return totalDays / hiredApplications.length
  }

  private calculateAverageTimeToOffer(applications: any[]): number {
    const offerApplications = applications.filter(app => 
      app.application_stages?.some((stage: any) => stage.stage_name === 'offer')
    )

    if (offerApplications.length === 0) return 0

    const totalDays = offerApplications.reduce((sum, app) => {
      const start = new Date(app.created_at)
      const offerStage = app.application_stages.find((stage: any) => stage.stage_name === 'offer')
      const end = new Date(offerStage.completed_at)
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }, 0)

    return totalDays / offerApplications.length
  }

  private calculateOfferAcceptanceRate(applications: any[]): number {
    const offers = applications.filter(app => 
      app.application_stages?.some((stage: any) => stage.stage_name === 'offer')
    )
    const acceptedOffers = offers.filter(app => app.status === 'hired')

    return offers.length > 0 ? (acceptedOffers.length / offers.length) * 100 : 0
  }

  private calculateDropoffRate(applications: any[]): number {
    const droppedApplications = applications.filter(app => 
      app.status === 'withdrawn' || app.status === 'declined'
    )

    return applications.length > 0 ? (droppedApplications.length / applications.length) * 100 : 0
  }

  private calculateSourceEffectiveness(applications: any[]): { [source: string]: number } {
    const sourceMap = new Map()
    
    applications.forEach(app => {
      const source = app.source || 'direct'
      const current = sourceMap.get(source) || { total: 0, hired: 0 }
      current.total++
      if (app.status === 'hired') current.hired++
      sourceMap.set(source, current)
    })

    const effectiveness: { [source: string]: number } = {}
    for (const [source, data] of sourceMap) {
      effectiveness[source] = data.total > 0 ? (data.hired / data.total) * 100 : 0
    }

    return effectiveness
  }

  private calculateCostPerHire(hiredApplications: any[]): number {
    // This would integrate with recruitment cost tracking
    return 3500 // Placeholder average cost per hire
  }

  private calculateQualityOfHire(hiredApplications: any[]): number {
    // This would integrate with performance tracking
    return 75 // Placeholder quality score
  }

  private calculateStagePerformance(applications: any[]): StagePerformance[] {
    const stageMap = new Map()
    
    applications.forEach(app => {
      app.application_stages?.forEach((stage: any) => {
        const stageName = stage.stage_name
        if (!stageMap.has(stageName)) {
          stageMap.set(stageName, { times: [], total: 0, passed: 0 })
        }
        
        const stageData = stageMap.get(stageName)
        stageData.total++
        
        if (stage.completed_at) {
          const duration = Math.ceil(
            (new Date(stage.completed_at).getTime() - new Date(stage.started_at).getTime()) / 
            (1000 * 60 * 60 * 24)
          )
          stageData.times.push(duration)
          
          if (stage.status === 'passed') {
            stageData.passed++
          }
        }
      })
    })

    const stagePerformance: StagePerformance[] = []
    for (const [stageName, data] of stageMap) {
      const averageTime = data.times.length > 0 
        ? data.times.reduce((sum, time) => sum + time, 0) / data.times.length 
        : 0
      const passRate = data.total > 0 ? (data.passed / data.total) * 100 : 0

      stagePerformance.push({
        stageName,
        averageTime,
        passRate,
        bottleneckIndicator: averageTime > 7 || passRate < 50, // Simple bottleneck detection
        improvementPotential: 100 - passRate
      })
    }

    return stagePerformance
  }

  private identifyHiringBottlenecks(roleMetrics: RoleVelocityMetrics[]): HiringBottleneck[] {
    const bottlenecks: HiringBottleneck[] = []

    roleMetrics.forEach(roleMetric => {
      roleMetric.stagePerformance.forEach(stage => {
        if (stage.bottleneckIndicator) {
          bottlenecks.push({
            stage: stage.stageName,
            severity: stage.averageTime > 14 ? 'critical' : stage.averageTime > 7 ? 'major' : 'moderate',
            impact: `${stage.averageTime.toFixed(1)} day average, ${stage.passRate.toFixed(1)}% pass rate`,
            avgDelay: stage.averageTime,
            affectedRoles: [roleMetric.role],
            recommendations: this.generateBottleneckRecommendations(stage)
          })
        }
      })
    })

    return bottlenecks
  }

  private generateBottleneckRecommendations(stage: StagePerformance): string[] {
    const recommendations = []

    if (stage.averageTime > 7) {
      recommendations.push('Streamline process workflow')
      recommendations.push('Set clear SLAs for stage completion')
    }

    if (stage.passRate < 50) {
      recommendations.push('Review assessment criteria')
      recommendations.push('Provide interviewer training')
      recommendations.push('Improve candidate pre-screening')
    }

    return recommendations
  }

  private async generateVelocityRecommendations(
    bottlenecks: HiringBottleneck[], 
    metrics: VelocityMetrics
  ): Promise<VelocityRecommendation[]> {
    const recommendations: VelocityRecommendation[] = []

    // Generate recommendations based on bottlenecks
    bottlenecks.forEach(bottleneck => {
      if (bottleneck.severity === 'critical' || bottleneck.severity === 'major') {
        recommendations.push({
          type: 'process_improvement',
          priority: bottleneck.severity === 'critical' ? 'critical' : 'high',
          title: `Optimize ${bottleneck.stage} Stage`,
          description: `The ${bottleneck.stage} stage is causing significant delays`,
          expectedImpact: `Reduce time by ${Math.round(bottleneck.avgDelay * 0.3)} days`,
          implementationEffort: 'medium',
          estimatedTimeSaving: Math.round(bottleneck.avgDelay * 0.3),
          estimatedCostSaving: Math.round(bottleneck.avgDelay * 0.3 * 500) // $500 per day saved
        })
      }
    })

    // General recommendations based on metrics
    if (metrics.averageTimeToHire > 30) {
      recommendations.push({
        type: 'technology_adoption',
        priority: 'high',
        title: 'Implement Automated Screening',
        description: 'Reduce time-to-hire with AI-powered candidate screening',
        expectedImpact: 'Reduce screening time by 5-7 days',
        implementationEffort: 'high',
        estimatedTimeSaving: 6,
        estimatedCostSaving: 3000
      })
    }

    if (metrics.offerAcceptanceRate < 70) {
      recommendations.push({
        type: 'process_improvement',
        priority: 'medium',
        title: 'Improve Offer Strategy',
        description: 'Enhance offer competitiveness and presentation',
        expectedImpact: 'Increase acceptance rate by 10-15%',
        implementationEffort: 'low',
        estimatedTimeSaving: 3,
        estimatedCostSaving: 1500
      })
    }

    return recommendations
  }

  private async getBenchmarkData(): Promise<BenchmarkData> {
    // This would fetch industry benchmarks from external APIs or internal data
    return {
      industryAverages: {
        totalHires: 25,
        averageTimeToHire: 28,
        averageTimeToOffer: 21,
        offerAcceptanceRate: 75,
        candidateDropoffRate: 20,
        sourceEffectiveness: { 'linkedin': 15, 'referral': 25, 'direct': 10 },
        costPerHire: 4200,
        qualityOfHire: 72
      },
      peerCompanies: {
        totalHires: 30,
        averageTimeToHire: 25,
        averageTimeToOffer: 18,
        offerAcceptanceRate: 80,
        candidateDropoffRate: 15,
        sourceEffectiveness: { 'linkedin': 18, 'referral': 30, 'direct': 12 },
        costPerHire: 3800,
        qualityOfHire: 78
      },
      topPerformers: {
        totalHires: 45,
        averageTimeToHire: 18,
        averageTimeToOffer: 12,
        offerAcceptanceRate: 90,
        candidateDropoffRate: 8,
        sourceEffectiveness: { 'linkedin': 25, 'referral': 40, 'direct': 15 },
        costPerHire: 2500,
        qualityOfHire: 85
      },
      userPerformance: 'average'
    }
  }

  private async storeHiringVelocityAnalysis(analysis: HiringVelocityAnalysis): Promise<void> {
    await supabase
      .from('hiring_velocity_analyses')
      .insert({
        id: analysis.id,
        company_id: analysis.companyId,
        period_start: analysis.periodStart,
        period_end: analysis.periodEnd,
        roles: analysis.roles,
        overall_metrics: analysis.overallMetrics,
        bottlenecks: analysis.bottlenecks,
        recommendations: analysis.recommendations,
        benchmark_comparison: analysis.benchmarkComparison,
        generated_at: analysis.generatedAt
      })
  }

  private async queryTalentPool(criteria: any): Promise<any[]> {
    let query = supabase
      .from('user_profiles')
      .select(`
        *,
        user_skills(*),
        work_experience(*)
      `)
      .gte('years_experience', criteria.experience.min)
      .lte('years_experience', criteria.experience.max)

    if (criteria.location.length > 0) {
      query = query.in('location', criteria.location)
    }

    const { data } = await query.limit(1000)
    return data || []
  }

  private calculateMarketMetrics(availableTalent: any[], criteria: any): MarketMetrics {
    const totalCandidates = availableTalent.length
    const activeCandidates = availableTalent.filter(t => t.is_actively_looking).length

    const salaryExpectations = availableTalent
      .map(t => t.salary_expectation)
      .filter(s => s > 0)
      .sort((a, b) => a - b)

    const averageSalaryExpectation = salaryExpectations.length > 0 
      ? salaryExpectations.reduce((sum, sal) => sum + sal, 0) / salaryExpectations.length
      : 0

    const salaryRanges = {
      p25: salaryExpectations[Math.floor(salaryExpectations.length * 0.25)] || 0,
      p50: salaryExpectations[Math.floor(salaryExpectations.length * 0.5)] || 0,
      p75: salaryExpectations[Math.floor(salaryExpectations.length * 0.75)] || 0,
      p90: salaryExpectations[Math.floor(salaryExpectations.length * 0.9)] || 0
    }

    // Calculate skill frequency
    const skillMap = new Map()
    availableTalent.forEach(candidate => {
      candidate.user_skills?.forEach((skill: any) => {
        const count = skillMap.get(skill.skill_name) || 0
        skillMap.set(skill.skill_name, count + 1)
      })
    })

    const topSkillsInDemand = Array.from(skillMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill]) => skill)

    return {
      totalCandidates,
      activeCandidates,
      averageSalaryExpectation,
      salaryRanges,
      timeToFill: 25, // Would be calculated from historical data
      competitionLevel: totalCandidates > 100 ? 'low' : totalCandidates > 50 ? 'medium' : 'high',
      demandSupplyRatio: activeCandidates / totalCandidates,
      topSkillsInDemand,
      emergingSkills: [] // Would be identified through trend analysis
    }
  }

  private async generateTalentPoolInsights(
    availableTalent: any[], 
    marketMetrics: MarketMetrics, 
    criteria: any
  ): Promise<AnalysisFinding[]> {
    const findings: AnalysisFinding[] = []

    // Market availability insight
    if (marketMetrics.activeCandidates < 20) {
      findings.push({
        type: 'challenge',
        title: 'Limited Active Talent Pool',
        description: `Only ${marketMetrics.activeCandidates} actively looking candidates found`,
        impact: 'high',
        confidence: 90,
        data: { activeCandidates: marketMetrics.activeCandidates }
      })
    } else {
      findings.push({
        type: 'opportunity',
        title: 'Healthy Talent Pool',
        description: `${marketMetrics.activeCandidates} active candidates available`,
        impact: 'medium',
        confidence: 85,
        data: { activeCandidates: marketMetrics.activeCandidates }
      })
    }

    // Competition insight
    if (marketMetrics.competitionLevel === 'high' || marketMetrics.competitionLevel === 'extreme') {
      findings.push({
        type: 'challenge',
        title: 'High Competition for Talent',
        description: 'Limited talent pool suggests high competition among employers',
        impact: 'high',
        confidence: 80,
        data: { competitionLevel: marketMetrics.competitionLevel }
      })
    }

    // Salary insights
    if (marketMetrics.averageSalaryExpectation > 0) {
      findings.push({
        type: 'insight',
        title: 'Salary Expectations Analysis',
        description: `Average salary expectation is $${marketMetrics.averageSalaryExpectation.toLocaleString()}`,
        impact: 'medium',
        confidence: 75,
        data: { salaryData: marketMetrics.salaryRanges }
      })
    }

    return findings
  }

  private generateTalentPoolRecommendations(
    findings: AnalysisFinding[], 
    marketMetrics: MarketMetrics
  ): string[] {
    const recommendations = []

    if (marketMetrics.activeCandidates < 20) {
      recommendations.push('Consider expanding search criteria or location scope')
      recommendations.push('Implement passive candidate outreach strategy')
      recommendations.push('Enhance employer branding to attract more candidates')
    }

    if (marketMetrics.competitionLevel === 'high') {
      recommendations.push('Offer competitive compensation packages')
      recommendations.push('Highlight unique company benefits and culture')
      recommendations.push('Streamline hiring process to move quickly on top candidates')
    }

    if (marketMetrics.averageSalaryExpectation > 0) {
      recommendations.push(`Budget for salary range $${Math.round(marketMetrics.salaryRanges.p25).toLocaleString()} - $${Math.round(marketMetrics.salaryRanges.p75).toLocaleString()}`)
    }

    return recommendations
  }

  private async storeTalentPoolAnalysis(analysis: TalentPoolAnalysis): Promise<void> {
    await supabase
      .from('talent_pool_analyses')
      .insert({
        id: analysis.id,
        company_id: analysis.companyId,
        analysis_type: analysis.analysisType,
        target_role: analysis.targetRole,
        target_skills: analysis.targetSkills,
        location: analysis.location,
        experience: analysis.experience,
        findings: analysis.findings,
        recommendations: analysis.recommendations,
        market_metrics: analysis.marketMetrics,
        generated_at: analysis.generatedAt,
        valid_until: analysis.validUntil
      })
  }

  private async getOrTrainPredictionModel(): Promise<SuccessPredictionModel> {
    // Check for existing active model
    const { data: existingModel } = await supabase
      .from('prediction_models')
      .select('*')
      .eq('company_id', this.companyId)
      .eq('is_active', true)
      .single()

    if (existingModel && this.isModelCurrent(existingModel)) {
      return existingModel
    }

    // Train new model or return default
    return this.getDefaultPredictionModel()
  }

  private isModelCurrent(model: any): boolean {
    const modelAge = Date.now() - new Date(model.last_trained).getTime()
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    return modelAge < thirtyDays
  }

  private getDefaultPredictionModel(): SuccessPredictionModel {
    return {
      id: 'default_model',
      modelName: 'Default Success Prediction Model',
      version: '1.0',
      trainingData: {
        totalSamples: 1000,
        timeRange: {
          start: '2023-01-01',
          end: '2024-12-31'
        },
        industries: ['technology', 'finance', 'healthcare'],
        roles: ['software engineer', 'product manager', 'data scientist']
      },
      accuracy: 78,
      precision: 75,
      recall: 80,
      features: [
        { name: 'skills_match', importance: 0.25, type: 'numerical', description: 'Skill alignment score' },
        { name: 'experience_years', importance: 0.20, type: 'numerical', description: 'Years of experience' },
        { name: 'cultural_fit', importance: 0.18, type: 'numerical', description: 'Cultural fit score' },
        { name: 'education_level', importance: 0.15, type: 'categorical', description: 'Highest education level' },
        { name: 'previous_performance', importance: 0.12, type: 'numerical', description: 'Past job performance' },
        { name: 'interview_score', importance: 0.10, type: 'numerical', description: 'Interview assessment score' }
      ],
      lastTrained: new Date().toISOString(),
      isActive: true
    }
  }

  private extractPredictionFeatures(candidate: any, job: any, historicalData: any[]): any {
    return {
      skills_match: this.calculateSkillsMatchScore(candidate, job),
      experience_years: candidate.years_experience || 0,
      cultural_fit: 75, // Would be calculated from assessment
      education_level: candidate.education_level || 'bachelor',
      previous_performance: 80, // Would come from references
      interview_score: 85, // Would come from interview feedback
      industry_match: candidate.industry === job.industry ? 100 : 50,
      role_progression: this.calculateRoleProgression(candidate),
      company_size_fit: this.calculateCompanySizeFit(candidate, job)
    }
  }

  private calculateSkillsMatchScore(candidate: any, job: any): number {
    const requiredSkills = job.required_skills || []
    const candidateSkills = candidate.user_skills?.map((s: any) => s.skill_name.toLowerCase()) || []
    
    if (requiredSkills.length === 0) return 100

    const matchedSkills = requiredSkills.filter((skill: string) => 
      candidateSkills.includes(skill.toLowerCase())
    )

    return (matchedSkills.length / requiredSkills.length) * 100
  }

  private calculateRoleProgression(candidate: any): number {
    // Simplified role progression calculation
    return candidate.years_experience > 0 ? Math.min(candidate.years_experience * 10, 100) : 50
  }

  private calculateCompanySizeFit(candidate: any, job: any): number {
    // Simplified company size fit calculation
    return 75 // Placeholder
  }

  private async generateAIPrediction(features: any, model: SuccessPredictionModel): Promise<{ score: number, factors: PredictionFactor[] }> {
    // In a real implementation, this would use a trained ML model
    // For now, we'll use AI to simulate prediction logic
    
    const prompt = `
      Predict hiring success probability based on the following candidate features:
      ${JSON.stringify(features, null, 2)}
      
      Model features and their importance:
      ${model.features.map(f => `${f.name}: ${f.importance} (${f.description})`).join('\n')}
      
      Provide:
      1. Success probability score (0-100)
      2. Key factors affecting the prediction
      3. Explanation for each factor's impact
      
      Format as JSON with score and factors array.
    `

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert hiring prediction system. Analyze candidate features and provide accurate success probability predictions with detailed explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')
      
      return {
        score: aiResponse.score || 75,
        factors: aiResponse.factors || []
      }
    } catch (error) {
      console.error('Failed to generate AI prediction:', error)
      
      // Fallback to simple calculation
      const score = Math.round(
        features.skills_match * 0.25 +
        Math.min(features.experience_years * 10, 100) * 0.20 +
        features.cultural_fit * 0.18 +
        (features.education_level === 'master' ? 90 : features.education_level === 'bachelor' ? 75 : 60) * 0.15 +
        features.previous_performance * 0.12 +
        features.interview_score * 0.10
      )

      return {
        score,
        factors: [
          {
            factor: 'Skills Match',
            impact: features.skills_match > 80 ? 'positive' : features.skills_match > 60 ? 'neutral' : 'negative',
            weight: 0.25,
            score: features.skills_match,
            explanation: `Candidate's skills match ${features.skills_match}% of job requirements`,
            category: 'skills'
          }
        ]
      }
    }
  }

  private calculatePredictionConfidence(features: any, model: SuccessPredictionModel): number {
    // Calculate confidence based on feature completeness and model accuracy
    const featureCompleteness = Object.values(features).filter(v => v !== null && v !== undefined).length / Object.keys(features).length
    const modelReliability = model.accuracy / 100
    
    return Math.round(featureCompleteness * modelReliability * 100)
  }

  private async storePrediction(prediction: HiringPrediction): Promise<void> {
    await supabase
      .from('hiring_predictions')
      .insert({
        id: prediction.id,
        job_id: prediction.jobId,
        candidate_id: prediction.candidateId,
        company_id: prediction.companyId,
        prediction_type: prediction.predictionType,
        score: prediction.score,
        confidence: prediction.confidence,
        factors: prediction.factors,
        model_version: prediction.modelVersion,
        generated_at: prediction.generatedAt,
        expires_at: prediction.expiresAt
      })
  }

  private async getHistoricalHiringData(jobId: string): Promise<any[]> {
    // Get historical hiring data for similar roles
    const { data: job } = await supabase
      .from('jobs')
      .select('title, industry, department')
      .eq('id', jobId)
      .single()

    if (!job) return []

    const { data } = await supabase
      .from('hiring_outcome_tracking')
      .select('*')
      .eq('company_id', this.companyId)
      .or(`job_title.eq.${job.title},industry.eq.${job.industry}`)
      .limit(100)

    return data || []
  }

  private generateId(): string {
    return 'pred_' + Math.random().toString(36).substring(2, 15)
  }

  // Public API Methods
  async getPredictionsForJob(jobId: string): Promise<HiringPrediction[]> {
    const { data, error } = await supabase
      .from('hiring_predictions')
      .select('*')
      .eq('job_id', jobId)
      .eq('company_id', this.companyId)
      .gte('expires_at', new Date().toISOString())
      .order('generated_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getCompanyHiringAnalytics(): Promise<any> {
    // Get comprehensive hiring analytics for the company
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [velocityAnalysis, talentPools, predictions] = await Promise.all([
      this.analyzeHiringVelocity(thirtyDaysAgo.toISOString(), new Date().toISOString()),
      supabase.from('talent_pool_analyses').select('*').eq('company_id', this.companyId).limit(5),
      supabase.from('hiring_predictions').select('*').eq('company_id', this.companyId).limit(10)
    ])

    return {
      velocityAnalysis,
      recentTalentPools: talentPools.data || [],
      recentPredictions: predictions.data || []
    }
  }

  async trackHiringOutcome(outcomeData: Omit<HiringOutcomeTracking, 'id' | 'updatedAt'>): Promise<void> {
    await supabase
      .from('hiring_outcome_tracking')
      .upsert({
        ...outcomeData,
        id: this.generateId(),
        updated_at: new Date().toISOString()
      })

    // Update prediction model performance
    await this.updateModelPerformance(outcomeData)
  }

  private async updateModelPerformance(outcome: Omit<HiringOutcomeTracking, 'id' | 'updatedAt'>): Promise<void> {
    // Find corresponding prediction
    const { data: prediction } = await supabase
      .from('hiring_predictions')
      .select('*')
      .eq('candidate_id', outcome.candidateId)
      .eq('job_id', outcome.jobId)
      .single()

    if (prediction) {
      // Update prediction with actual outcome
      await supabase
        .from('hiring_predictions')
        .update({
          actual_outcome: {
            hired: outcome.hired,
            hireDate: outcome.hireDate,
            performanceRating: outcome.thirtyDayPerformance,
            retentionMonths: outcome.oneYearRetention ? 12 : 0,
            recordedAt: new Date().toISOString()
          }
        })
        .eq('id', prediction.id)
    }
  }
}

export default PredictiveHiringIntelligence