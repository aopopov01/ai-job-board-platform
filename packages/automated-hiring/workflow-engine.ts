import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export interface HiringWorkflow {
  id: string
  companyId: string
  jobId: string
  workflowName: string
  description: string
  stages: WorkflowStage[]
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated'
  approvalRequirements: ApprovalRequirement[]
  slaTargets: SLATarget[]
  integrations: WorkflowIntegration[]
  status: 'draft' | 'active' | 'paused' | 'archived'
  version: string
  createdBy: string
  createdAt: string
  updatedAt: string
  metrics: WorkflowMetrics
}

export interface WorkflowStage {
  id: string
  name: string
  description: string
  type: 'screening' | 'assessment' | 'interview' | 'reference_check' | 'decision' | 'offer' | 'onboarding'
  order: number
  automationConfig: StageAutomation
  passingCriteria: PassingCriteria
  actions: StageAction[]
  timeouts: StageTimeout[]
  notifications: NotificationConfig[]
  isRequired: boolean
  parallelProcessing: boolean
  dependencies: string[] // Stage IDs that must complete first
}

export interface StageAutomation {
  isAutomated: boolean
  automationType: 'ai_screening' | 'rule_based' | 'integration_based' | 'human_required'
  aiModel?: string
  rules: AutomationRule[]
  fallbackToHuman: boolean
  confidenceThreshold: number // 0-100
  maxCandidatesAutoAdvance?: number
}

export interface AutomationRule {
  id: string
  name: string
  condition: RuleCondition
  action: RuleAction
  priority: number
  isActive: boolean
}

export interface RuleCondition {
  type: 'skill_match' | 'experience_years' | 'education_level' | 'location' | 'salary_expectation' | 'assessment_score' | 'custom_field'
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range' | 'matches_regex'
  value: any
  weight: number // 0-100
}

export interface RuleAction {
  type: 'advance' | 'reject' | 'flag_for_review' | 'assign_score' | 'send_notification' | 'schedule_interview' | 'request_additional_info'
  parameters: any
  reason: string
}

export interface PassingCriteria {
  minimumScore: number
  requiredAssessments: string[]
  manualApprovalRequired: boolean
  approverRoles: string[]
  customCriteria: CustomCriterion[]
}

export interface CustomCriterion {
  id: string
  name: string
  description: string
  evaluationType: 'boolean' | 'score' | 'ranking'
  weight: number
  required: boolean
}

export interface StageAction {
  id: string
  name: string
  type: 'email' | 'sms' | 'assessment' | 'interview_scheduling' | 'reference_request' | 'background_check' | 'offer_generation'
  trigger: 'stage_entry' | 'stage_completion' | 'timeout' | 'manual'
  config: ActionConfig
  isAutomated: boolean
  delay?: number // minutes
}

export interface ActionConfig {
  template?: string
  recipients?: string[]
  parameters: { [key: string]: any }
  integrationEndpoint?: string
  requiredApprovals?: string[]
}

export interface StageTimeout {
  id: string
  description: string
  timeoutDuration: number // hours
  timeoutAction: 'auto_advance' | 'auto_reject' | 'send_reminder' | 'escalate'
  escalationPath?: string[]
  reminderFrequency?: number // hours
}

export interface NotificationConfig {
  id: string
  trigger: 'stage_entry' | 'stage_completion' | 'timeout' | 'approval_needed' | 'exception'
  recipients: NotificationRecipient[]
  template: string
  channels: ('email' | 'sms' | 'in_app' | 'slack' | 'teams')[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface NotificationRecipient {
  type: 'candidate' | 'hiring_manager' | 'recruiter' | 'team_member' | 'admin' | 'external'
  identifier: string
  conditions?: string[]
}

export interface ApprovalRequirement {
  stageId: string
  approverRole: string
  approverIds?: string[]
  approvalType: 'any' | 'all' | 'majority' | 'specific_sequence'
  timeoutHours: number
  escalationPath: string[]
  bypassConditions?: string[]
}

export interface SLATarget {
  stageId: string
  targetDuration: number // hours
  urgencyLevel: 'normal' | 'high' | 'critical'
  consequences: SLAConsequence[]
  exceptions: string[]
}

export interface SLAConsequence {
  type: 'notification' | 'escalation' | 'auto_action' | 'penalty'
  action: string
  delay: number // hours after SLA breach
}

export interface WorkflowIntegration {
  id: string
  name: string
  type: 'ats' | 'assessment_platform' | 'background_check' | 'reference_check' | 'interview_scheduling' | 'offer_management' | 'hris'
  provider: string
  apiEndpoint: string
  authConfig: IntegrationAuth
  mappings: FieldMapping[]
  isActive: boolean
}

export interface IntegrationAuth {
  type: 'api_key' | 'oauth2' | 'basic_auth' | 'jwt'
  credentials: { [key: string]: string }
  refreshToken?: string
  expiresAt?: string
}

export interface FieldMapping {
  sourceField: string
  targetField: string
  transformation?: string
  required: boolean
}

export interface WorkflowMetrics {
  totalApplications: number
  stageCompletionRates: { [stageId: string]: number }
  averageTimePerStage: { [stageId: string]: number }
  automationSuccessRate: number
  manualInterventionRate: number
  candidateDropoffRates: { [stageId: string]: number }
  qualityScores: { [stageId: string]: number }
  costPerHire: number
  timeToHire: number
  offerAcceptanceRate: number
  lastUpdated: string
}

export interface CandidateWorkflowState {
  id: string
  candidateId: string
  workflowId: string
  currentStageId: string
  status: 'in_progress' | 'completed' | 'rejected' | 'withdrawn' | 'on_hold'
  stageHistory: StageProgress[]
  overallScore: number
  automationDecisions: AutomationDecision[]
  manualInterventions: ManualIntervention[]
  exceptions: WorkflowException[]
  metrics: CandidateMetrics
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface StageProgress {
  stageId: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'
  score?: number
  startedAt: string
  completedAt?: string
  duration?: number // minutes
  feedback?: string
  approvals: StageApproval[]
  automationUsed: boolean
  exceptionsRaised: string[]
}

export interface StageApproval {
  approverId: string
  approverRole: string
  decision: 'approved' | 'rejected' | 'needs_revision'
  reason: string
  timestamp: string
  delegatedFrom?: string
}

export interface AutomationDecision {
  id: string
  stageId: string
  decision: 'advance' | 'reject' | 'flag_for_review' | 'request_additional_info'
  confidence: number // 0-100
  reasoning: string
  rulesApplied: string[]
  aiModel?: string
  humanOverride?: boolean
  timestamp: string
}

export interface ManualIntervention {
  id: string
  stageId: string
  reason: 'automation_failed' | 'low_confidence' | 'exception_raised' | 'manual_review_requested'
  interventionBy: string
  interventionType: 'review' | 'decision' | 'escalation' | 'workflow_modification'
  action: string
  result: string
  timestamp: string
  timeSpent: number // minutes
}

export interface WorkflowException {
  id: string
  type: 'automation_failure' | 'integration_error' | 'timeout' | 'business_rule_violation' | 'data_quality_issue'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  stageId: string
  metadata: any
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: string
  resolution?: string
  timestamp: string
}

export interface CandidateMetrics {
  totalTimeInWorkflow: number // hours
  stageCompletionTimes: { [stageId: string]: number }
  automationUtilization: number // percentage
  qualityScores: { [stageId: string]: number }
  engagementLevel: number // 0-100
  responsiveness: number // 0-100
}

export interface AssessmentResult {
  id: string
  candidateId: string
  assessmentType: 'cognitive' | 'personality' | 'technical' | 'situational' | 'cultural_fit'
  assessmentProvider: string
  scores: AssessmentScore[]
  overallScore: number
  percentile: number
  completedAt: string
  validityPeriod: number // days
  proctored: boolean
  flaggedIssues: string[]
}

export interface AssessmentScore {
  dimension: string
  score: number
  percentile: number
  description: string
  benchmark: string
}

export interface InterviewSession {
  id: string
  candidateId: string
  interviewerId: string
  sessionType: 'phone' | 'video' | 'in_person' | 'panel' | 'technical'
  scheduledAt: string
  actualStartTime?: string
  actualEndTime?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  evaluations: InterviewEvaluation[]
  recording?: InterviewRecording
  transcription?: string
  aiInsights?: AIInterviewInsights
}

export interface InterviewEvaluation {
  evaluatorId: string
  dimensions: EvaluationDimension[]
  overallScore: number
  recommendation: 'strong_hire' | 'hire' | 'maybe' | 'no_hire' | 'strong_no_hire'
  feedback: string
  strengths: string[]
  concerns: string[]
  followUpQuestions: string[]
}

export interface EvaluationDimension {
  name: string
  score: number // 1-5
  weight: number
  comments: string
}

export interface InterviewRecording {
  recordingUrl: string
  duration: number // seconds
  quality: 'low' | 'medium' | 'high'
  transcriptionAvailable: boolean
  analysisAvailable: boolean
}

export interface AIInterviewInsights {
  sentimentAnalysis: SentimentScore[]
  communicationSkills: number // 0-100
  confidenceLevel: number // 0-100
  technicalCompetency: number // 0-100
  culturalFit: number // 0-100
  redFlags: string[]
  strengths: string[]
  recommendedFollowUp: string[]
}

export interface SentimentScore {
  timestamp: number // seconds from start
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number // 0-100
  emotion?: string
}

export interface OfferDetails {
  id: string
  candidateId: string
  jobId: string
  offerType: 'standard' | 'competitive' | 'premium' | 'custom'
  compensation: OfferCompensation
  benefits: OfferBenefit[]
  terms: OfferTerms
  conditions: OfferCondition[]
  deadlines: OfferDeadline[]
  negotiationRoom: NegotiationParameters
  approvals: OfferApproval[]
  status: 'draft' | 'pending_approval' | 'sent' | 'under_negotiation' | 'accepted' | 'rejected' | 'expired' | 'withdrawn'
  generatedAt: string
  sentAt?: string
  respondedAt?: string
  signedAt?: string
}

export interface OfferCompensation {
  baseSalary: number
  currency: string
  bonus: BonusStructure[]
  equity?: EquityOffer
  totalPackageValue: number
  payFrequency: string
}

export interface EquityOffer {
  type: 'stock_options' | 'restricted_stock' | 'equity_grant'
  quantity: number
  vestingPeriod: number // months
  strikePrice?: number
  currentValue: number
}

export interface OfferBenefit {
  type: string
  description: string
  value: number
  startDate: string
  provider?: string
}

export interface OfferTerms {
  startDate: string
  employmentType: string
  workLocation: string
  probationPeriod?: number // days
  noticePeriod: number // days
  workingHours: string
  remoteWorkPolicy: string
}

export interface OfferCondition {
  type: 'background_check' | 'reference_check' | 'drug_test' | 'visa_verification' | 'education_verification' | 'custom'
  description: string
  deadline: string
  required: boolean
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
}

export interface OfferDeadline {
  type: 'response' | 'acceptance' | 'start_date' | 'condition_completion'
  deadline: string
  consequences: string
  extensible: boolean
}

export interface NegotiationParameters {
  salaryRange: { min: number; max: number }
  bonusNegotiable: boolean
  equityNegotiable: boolean
  benefitsNegotiable: boolean
  startDateFlexible: boolean
  locationNegotiable: boolean
  approvalRequired: boolean
  counterOfferLimit: number
}

export interface OfferApproval {
  approverId: string
  approverRole: string
  decision: 'approved' | 'rejected' | 'changes_requested'
  comments: string
  timestamp: string
  level: number
}

export class AutomatedHiringWorkflowEngine {
  private workflowId: string
  private companyId: string

  constructor(workflowId: string, companyId: string) {
    this.workflowId = workflowId
    this.companyId = companyId
  }

  // Workflow Management
  async createWorkflow(workflowData: Omit<HiringWorkflow, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Promise<HiringWorkflow> {
    try {
      const workflowId = this.generateWorkflowId()
      
      const workflow: HiringWorkflow = {
        ...workflowData,
        id: workflowId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metrics: {
          totalApplications: 0,
          stageCompletionRates: {},
          averageTimePerStage: {},
          automationSuccessRate: 0,
          manualInterventionRate: 0,
          candidateDropoffRates: {},
          qualityScores: {},
          costPerHire: 0,
          timeToHire: 0,
          offerAcceptanceRate: 0,
          lastUpdated: new Date().toISOString()
        }
      }

      await supabase
        .from('hiring_workflows')
        .insert({
          id: workflow.id,
          company_id: workflow.companyId,
          job_id: workflow.jobId,
          workflow_name: workflow.workflowName,
          description: workflow.description,
          stages: workflow.stages,
          automation_level: workflow.automationLevel,
          approval_requirements: workflow.approvalRequirements,
          sla_targets: workflow.slaTargets,
          integrations: workflow.integrations,
          status: workflow.status,
          version: workflow.version,
          created_by: workflow.createdBy,
          created_at: workflow.createdAt,
          updated_at: workflow.updatedAt,
          metrics: workflow.metrics
        })

      // Initialize workflow automation
      await this.initializeWorkflowAutomation(workflowId)

      return workflow
    } catch (error) {
      console.error('Failed to create hiring workflow:', error)
      throw error
    }
  }

  private async initializeWorkflowAutomation(workflowId: string): Promise<void> {
    try {
      const { data: workflow } = await supabase
        .from('hiring_workflows')
        .select('stages, integrations')
        .eq('id', workflowId)
        .single()

      if (!workflow) throw new Error('Workflow not found')

      // Setup automated stages
      for (const stage of workflow.stages) {
        if (stage.automation_config?.is_automated) {
          await this.setupStageAutomation(workflowId, stage.id, stage.automation_config)
        }
      }

      // Setup integrations
      for (const integration of workflow.integrations) {
        if (integration.is_active) {
          await this.setupIntegration(workflowId, integration)
        }
      }
    } catch (error) {
      console.error('Failed to initialize workflow automation:', error)
    }
  }

  // Candidate Processing
  async processCandidateApplication(candidateId: string, applicationData: any): Promise<CandidateWorkflowState> {
    try {
      const { data: workflow } = await supabase
        .from('hiring_workflows')
        .select('*')
        .eq('id', this.workflowId)
        .single()

      if (!workflow) throw new Error('Workflow not found')

      // Create candidate workflow state
      const candidateState: CandidateWorkflowState = {
        id: this.generateStateId(),
        candidateId,
        workflowId: this.workflowId,
        currentStageId: this.getFirstStageId(workflow.stages),
        status: 'in_progress',
        stageHistory: [],
        overallScore: 0,
        automationDecisions: [],
        manualInterventions: [],
        exceptions: [],
        metrics: {
          totalTimeInWorkflow: 0,
          stageCompletionTimes: {},
          automationUtilization: 0,
          qualityScores: {},
          engagementLevel: 0,
          responsiveness: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await supabase
        .from('candidate_workflow_states')
        .insert({
          id: candidateState.id,
          candidate_id: candidateState.candidateId,
          workflow_id: candidateState.workflowId,
          current_stage_id: candidateState.currentStageId,
          status: candidateState.status,
          stage_history: candidateState.stageHistory,
          overall_score: candidateState.overallScore,
          automation_decisions: candidateState.automationDecisions,
          manual_interventions: candidateState.manualInterventions,
          exceptions: candidateState.exceptions,
          metrics: candidateState.metrics,
          created_at: candidateState.createdAt,
          updated_at: candidateState.updatedAt
        })

      // Start processing first stage
      await this.processStage(candidateState.id, candidateState.currentStageId, applicationData)

      return candidateState
    } catch (error) {
      console.error('Failed to process candidate application:', error)
      throw error
    }
  }

  private async processStage(candidateStateId: string, stageId: string, inputData: any): Promise<void> {
    try {
      const [candidateState, workflow] = await Promise.all([
        this.getCandidateState(candidateStateId),
        this.getWorkflow()
      ])

      if (!candidateState || !workflow) throw new Error('Candidate state or workflow not found')

      const stage = workflow.stages.find(s => s.id === stageId)
      if (!stage) throw new Error('Stage not found')

      // Record stage entry
      const stageProgress: StageProgress = {
        stageId,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        approvals: [],
        automationUsed: stage.automationConfig.isAutomated,
        exceptionsRaised: []
      }

      // Execute stage actions for entry
      await this.executeStageActions(candidateStateId, stage, 'stage_entry', inputData)

      // Process stage based on automation config
      let decision: AutomationDecision | null = null
      if (stage.automationConfig.isAutomated) {
        decision = await this.executeAutomatedStageProcessing(candidateStateId, stage, inputData)
        
        // Check if automation succeeded or needs human intervention
        if (decision.confidence < stage.automationConfig.confidenceThreshold || 
            decision.decision === 'flag_for_review') {
          await this.requestManualIntervention(candidateStateId, stageId, 'low_confidence', decision)
          stageProgress.status = 'pending'
        } else {
          stageProgress.status = 'completed'
          stageProgress.completedAt = new Date().toISOString()
          stageProgress.score = decision.confidence
          
          // Auto-advance or reject based on decision
          if (decision.decision === 'advance') {
            await this.advanceToNextStage(candidateStateId, stageId)
          } else if (decision.decision === 'reject') {
            await this.rejectCandidate(candidateStateId, decision.reasoning)
          }
        }
      } else {
        // Manual processing required
        await this.requestManualIntervention(candidateStateId, stageId, 'manual_review_requested', null)
        stageProgress.status = 'pending'
      }

      // Update candidate state
      await this.updateCandidateStateWithStageProgress(candidateStateId, stageProgress, decision)

      // Execute completion actions if stage is completed
      if (stageProgress.status === 'completed') {
        await this.executeStageActions(candidateStateId, stage, 'stage_completion', { decision })
      }

    } catch (error) {
      console.error('Failed to process stage:', error)
      await this.handleStageException(candidateStateId, stageId, 'automation_failure', error.message)
    }
  }

  private async executeAutomatedStageProcessing(
    candidateStateId: string, 
    stage: WorkflowStage, 
    inputData: any
  ): Promise<AutomationDecision> {
    try {
      const candidateState = await this.getCandidateState(candidateStateId)
      if (!candidateState) throw new Error('Candidate state not found')

      const candidateData = await this.getCandidateData(candidateState.candidateId)
      
      let decision: AutomationDecision

      switch (stage.automationConfig.automationType) {
        case 'ai_screening':
          decision = await this.executeAIScreening(candidateStateId, stage, candidateData, inputData)
          break
        case 'rule_based':
          decision = await this.executeRuleBasedProcessing(candidateStateId, stage, candidateData, inputData)
          break
        case 'integration_based':
          decision = await this.executeIntegrationBasedProcessing(candidateStateId, stage, candidateData, inputData)
          break
        default:
          throw new Error(`Unknown automation type: ${stage.automationConfig.automationType}`)
      }

      return decision
    } catch (error) {
      console.error('Failed to execute automated stage processing:', error)
      throw error
    }
  }

  private async executeAIScreening(
    candidateStateId: string,
    stage: WorkflowStage,
    candidateData: any,
    inputData: any
  ): Promise<AutomationDecision> {
    try {
      // Get job requirements
      const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', inputData.jobId || candidateData.jobId)
        .single()

      const prompt = `
        Analyze this candidate for the ${stage.name} stage of the hiring process.
        
        Job Requirements:
        - Title: ${job?.title}
        - Required Skills: ${job?.required_skills?.join(', ')}
        - Experience Required: ${job?.experience_required} years
        - Education: ${job?.education_requirements}
        - Industry: ${job?.industry}
        
        Candidate Profile:
        - Name: ${candidateData.first_name} ${candidateData.last_name}
        - Experience: ${candidateData.years_experience} years
        - Current Role: ${candidateData.current_role}
        - Skills: ${candidateData.user_skills?.map((s: any) => `${s.skill_name} (${s.proficiency_level}%)`).join(', ')}
        - Education: ${candidateData.education_level}
        - Location: ${candidateData.location}
        
        Stage Type: ${stage.type}
        Passing Criteria: Minimum score ${stage.passingCriteria.minimumScore}
        
        Please evaluate:
        1. Skill alignment with job requirements
        2. Experience relevance and level
        3. Education fit
        4. Overall candidate quality for this role
        5. Red flags or concerns
        6. Recommendation: advance, reject, or flag_for_review
        
        Provide a confidence score (0-100) and detailed reasoning.
        Format as JSON with decision, confidence, and reasoning.
      `

      const completion = await openai.chat.completions.create({
        model: stage.automationConfig.aiModel || "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert hiring manager and recruiter. Provide objective, unbiased candidate evaluations based on job requirements and qualifications."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      })

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')

      const decision: AutomationDecision = {
        id: this.generateId(),
        stageId: stage.id,
        decision: aiResponse.decision || 'flag_for_review',
        confidence: aiResponse.confidence || 50,
        reasoning: aiResponse.reasoning || 'AI evaluation completed',
        rulesApplied: ['ai_screening'],
        aiModel: stage.automationConfig.aiModel || "gpt-4",
        timestamp: new Date().toISOString()
      }

      return decision
    } catch (error) {
      console.error('Failed to execute AI screening:', error)
      return {
        id: this.generateId(),
        stageId: stage.id,
        decision: 'flag_for_review',
        confidence: 0,
        reasoning: `AI screening failed: ${error.message}`,
        rulesApplied: [],
        timestamp: new Date().toISOString()
      }
    }
  }

  private async executeRuleBasedProcessing(
    candidateStateId: string,
    stage: WorkflowStage,
    candidateData: any,
    inputData: any
  ): Promise<AutomationDecision> {
    try {
      let totalScore = 0
      let totalWeight = 0
      const appliedRules: string[] = []
      let finalDecision: 'advance' | 'reject' | 'flag_for_review' = 'flag_for_review'

      // Evaluate each automation rule
      for (const rule of stage.automationConfig.rules) {
        if (!rule.isActive) continue

        const ruleResult = await this.evaluateRule(rule, candidateData, inputData)
        if (ruleResult.matches) {
          appliedRules.push(rule.id)
          
          // Apply rule action
          if (rule.action.type === 'advance' || rule.action.type === 'reject') {
            finalDecision = rule.action.type
            totalScore += ruleResult.score * rule.condition.weight
            totalWeight += rule.condition.weight
            break // Stop processing if definitive decision is made
          } else if (rule.action.type === 'assign_score') {
            totalScore += ruleResult.score * rule.condition.weight
            totalWeight += rule.condition.weight
          }
        }
      }

      // Calculate final confidence score
      const confidence = totalWeight > 0 ? Math.min((totalScore / totalWeight), 100) : 50

      // Determine final decision if not already set
      if (finalDecision === 'flag_for_review') {
        if (confidence >= stage.passingCriteria.minimumScore) {
          finalDecision = 'advance'
        } else {
          finalDecision = 'reject'
        }
      }

      const decision: AutomationDecision = {
        id: this.generateId(),
        stageId: stage.id,
        decision: finalDecision,
        confidence,
        reasoning: `Rule-based evaluation: ${appliedRules.length} rules applied, score: ${confidence}`,
        rulesApplied: appliedRules,
        timestamp: new Date().toISOString()
      }

      return decision
    } catch (error) {
      console.error('Failed to execute rule-based processing:', error)
      throw error
    }
  }

  private async evaluateRule(rule: AutomationRule, candidateData: any, inputData: any): Promise<{ matches: boolean; score: number }> {
    try {
      const condition = rule.condition
      let candidateValue: any

      // Extract candidate value based on condition field
      switch (condition.field) {
        case 'years_experience':
          candidateValue = candidateData.years_experience || 0
          break
        case 'education_level':
          candidateValue = candidateData.education_level
          break
        case 'location':
          candidateValue = candidateData.location
          break
        case 'salary_expectation':
          candidateValue = candidateData.salary_expectation || 0
          break
        default:
          // Handle custom fields
          candidateValue = candidateData[condition.field]
      }

      // Evaluate condition
      let matches = false
      switch (condition.operator) {
        case 'equals':
          matches = candidateValue === condition.value
          break
        case 'not_equals':
          matches = candidateValue !== condition.value
          break
        case 'greater_than':
          matches = Number(candidateValue) > Number(condition.value)
          break
        case 'less_than':
          matches = Number(candidateValue) < Number(condition.value)
          break
        case 'contains':
          matches = String(candidateValue).toLowerCase().includes(String(condition.value).toLowerCase())
          break
        case 'in_range':
          const [min, max] = condition.value
          matches = Number(candidateValue) >= min && Number(candidateValue) <= max
          break
        case 'matches_regex':
          const regex = new RegExp(condition.value)
          matches = regex.test(String(candidateValue))
          break
      }

      const score = matches ? condition.weight : 0

      return { matches, score }
    } catch (error) {
      console.error('Failed to evaluate rule:', error)
      return { matches: false, score: 0 }
    }
  }

  private async executeIntegrationBasedProcessing(
    candidateStateId: string,
    stage: WorkflowStage,
    candidateData: any,
    inputData: any
  ): Promise<AutomationDecision> {
    try {
      // Find integration for this stage
      const { data: workflow } = await supabase
        .from('hiring_workflows')
        .select('integrations')
        .eq('id', this.workflowId)
        .single()

      const integration = workflow?.integrations?.find((i: WorkflowIntegration) => 
        i.type === this.getIntegrationTypeForStage(stage.type)
      )

      if (!integration) {
        throw new Error(`No integration found for stage type: ${stage.type}`)
      }

      // Execute integration call
      const integrationResult = await this.callIntegration(integration, candidateData, inputData)

      const decision: AutomationDecision = {
        id: this.generateId(),
        stageId: stage.id,
        decision: integrationResult.decision,
        confidence: integrationResult.confidence,
        reasoning: `Integration-based evaluation via ${integration.provider}: ${integrationResult.reasoning}`,
        rulesApplied: [`integration_${integration.id}`],
        timestamp: new Date().toISOString()
      }

      return decision
    } catch (error) {
      console.error('Failed to execute integration-based processing:', error)
      throw error
    }
  }

  private getIntegrationTypeForStage(stageType: WorkflowStage['type']): WorkflowIntegration['type'] {
    const mapping = {
      'screening': 'ats',
      'assessment': 'assessment_platform',
      'interview': 'interview_scheduling',
      'reference_check': 'reference_check',
      'decision': 'ats',
      'offer': 'offer_management',
      'onboarding': 'hris'
    }
    return mapping[stageType] || 'ats'
  }

  private async callIntegration(
    integration: WorkflowIntegration,
    candidateData: any,
    inputData: any
  ): Promise<{ decision: 'advance' | 'reject' | 'flag_for_review'; confidence: number; reasoning: string }> {
    try {
      // Simulate integration call (in production, this would make actual API calls)
      // Each integration would have its own implementation
      
      switch (integration.type) {
        case 'assessment_platform':
          return await this.callAssessmentPlatform(integration, candidateData, inputData)
        case 'background_check':
          return await this.callBackgroundCheck(integration, candidateData, inputData)
        case 'reference_check':
          return await this.callReferenceCheck(integration, candidateData, inputData)
        default:
          return {
            decision: 'flag_for_review',
            confidence: 50,
            reasoning: `Integration type ${integration.type} not implemented`
          }
      }
    } catch (error) {
      console.error('Failed to call integration:', error)
      return {
        decision: 'flag_for_review',
        confidence: 0,
        reasoning: `Integration call failed: ${error.message}`
      }
    }
  }

  private async callAssessmentPlatform(
    integration: WorkflowIntegration,
    candidateData: any,
    inputData: any
  ): Promise<{ decision: 'advance' | 'reject' | 'flag_for_review'; confidence: number; reasoning: string }> {
    // Simulate assessment platform API call
    const mockAssessmentResult = {
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
      completed: true,
      timeSpent: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
      flaggedIssues: []
    }

    return {
      decision: mockAssessmentResult.overallScore >= 75 ? 'advance' : 'reject',
      confidence: mockAssessmentResult.overallScore,
      reasoning: `Assessment completed with score ${mockAssessmentResult.overallScore}%`
    }
  }

  private async callBackgroundCheck(
    integration: WorkflowIntegration,
    candidateData: any,
    inputData: any
  ): Promise<{ decision: 'advance' | 'reject' | 'flag_for_review'; confidence: number; reasoning: string }> {
    // Simulate background check API call
    const mockResult = {
      passed: Math.random() > 0.1, // 90% pass rate
      flaggedIssues: Math.random() > 0.8 ? ['Minor traffic violation'] : []
    }

    return {
      decision: mockResult.passed ? 'advance' : 'flag_for_review',
      confidence: mockResult.passed ? 95 : 30,
      reasoning: mockResult.passed ? 'Background check passed' : `Background check issues: ${mockResult.flaggedIssues.join(', ')}`
    }
  }

  private async callReferenceCheck(
    integration: WorkflowIntegration,
    candidateData: any,
    inputData: any
  ): Promise<{ decision: 'advance' | 'reject' | 'flag_for_review'; confidence: number; reasoning: string }> {
    // Simulate reference check API call
    const mockResult = {
      referencesContacted: Math.floor(Math.random() * 3) + 2, // 2-4
      averageRating: Math.random() * 2 + 3, // 3-5
      recommendationRate: Math.random() * 0.3 + 0.7 // 70-100%
    }

    const decision = mockResult.averageRating >= 4 && mockResult.recommendationRate >= 0.8 ? 'advance' : 'flag_for_review'

    return {
      decision,
      confidence: Math.floor(mockResult.averageRating * 20),
      reasoning: `References: ${mockResult.referencesContacted} contacted, average rating: ${mockResult.averageRating.toFixed(1)}`
    }
  }

  // Stage Management
  private async advanceToNextStage(candidateStateId: string, currentStageId: string): Promise<void> {
    try {
      const [candidateState, workflow] = await Promise.all([
        this.getCandidateState(candidateStateId),
        this.getWorkflow()
      ])

      if (!candidateState || !workflow) throw new Error('Candidate state or workflow not found')

      const currentStage = workflow.stages.find(s => s.id === currentStageId)
      if (!currentStage) throw new Error('Current stage not found')

      // Find next stage
      const nextStage = this.getNextStage(workflow.stages, currentStage.order)
      
      if (nextStage) {
        // Update candidate state to next stage
        await supabase
          .from('candidate_workflow_states')
          .update({
            current_stage_id: nextStage.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', candidateStateId)

        // Process next stage
        await this.processStage(candidateStateId, nextStage.id, { previousStage: currentStageId })
      } else {
        // Workflow completed
        await this.completeWorkflow(candidateStateId, 'completed')
      }
    } catch (error) {
      console.error('Failed to advance to next stage:', error)
      throw error
    }
  }

  private async rejectCandidate(candidateStateId: string, reason: string): Promise<void> {
    try {
      await supabase
        .from('candidate_workflow_states')
        .update({
          status: 'rejected',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateStateId)

      // Send rejection notification
      await this.sendCandidateNotification(candidateStateId, 'rejection', { reason })
    } catch (error) {
      console.error('Failed to reject candidate:', error)
      throw error
    }
  }

  private async completeWorkflow(candidateStateId: string, status: 'completed' | 'rejected' | 'withdrawn'): Promise<void> {
    try {
      await supabase
        .from('candidate_workflow_states')
        .update({
          status,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateStateId)

      // Update workflow metrics
      await this.updateWorkflowMetrics(candidateStateId)

      // Send completion notification
      await this.sendCandidateNotification(candidateStateId, 'workflow_completed', { status })
    } catch (error) {
      console.error('Failed to complete workflow:', error)
      throw error
    }
  }

  // Helper Methods
  private getFirstStageId(stages: WorkflowStage[]): string {
    const sortedStages = stages.sort((a, b) => a.order - b.order)
    return sortedStages[0]?.id || ''
  }

  private getNextStage(stages: WorkflowStage[], currentOrder: number): WorkflowStage | null {
    const sortedStages = stages.sort((a, b) => a.order - b.order)
    return sortedStages.find(s => s.order > currentOrder) || null
  }

  private async getCandidateState(candidateStateId: string): Promise<CandidateWorkflowState | null> {
    try {
      const { data, error } = await supabase
        .from('candidate_workflow_states')
        .select('*')
        .eq('id', candidateStateId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get candidate state:', error)
      return null
    }
  }

  private async getWorkflow(): Promise<HiringWorkflow | null> {
    try {
      const { data, error } = await supabase
        .from('hiring_workflows')
        .select('*')
        .eq('id', this.workflowId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get workflow:', error)
      return null
    }
  }

  private async getCandidateData(candidateId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_skills(*),
          work_experience(*),
          education(*)
        `)
        .eq('id', candidateId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get candidate data:', error)
      return null
    }
  }

  private async updateCandidateStateWithStageProgress(
    candidateStateId: string,
    stageProgress: StageProgress,
    decision: AutomationDecision | null
  ): Promise<void> {
    try {
      const candidateState = await this.getCandidateState(candidateStateId)
      if (!candidateState) throw new Error('Candidate state not found')

      const updatedStageHistory = [...candidateState.stage_history, stageProgress]
      const updatedAutomationDecisions = decision ? 
        [...candidateState.automation_decisions, decision] : 
        candidateState.automation_decisions

      await supabase
        .from('candidate_workflow_states')
        .update({
          stage_history: updatedStageHistory,
          automation_decisions: updatedAutomationDecisions,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateStateId)
    } catch (error) {
      console.error('Failed to update candidate state with stage progress:', error)
    }
  }

  private async executeStageActions(
    candidateStateId: string,
    stage: WorkflowStage,
    trigger: 'stage_entry' | 'stage_completion' | 'timeout' | 'manual',
    inputData: any
  ): Promise<void> {
    try {
      const actionsToExecute = stage.actions.filter(action => action.trigger === trigger)

      for (const action of actionsToExecute) {
        if (action.delay && action.delay > 0) {
          // Schedule delayed action (in production, would use a job queue)
          setTimeout(async () => {
            await this.executeAction(candidateStateId, action, inputData)
          }, action.delay * 60 * 1000) // Convert minutes to milliseconds
        } else {
          await this.executeAction(candidateStateId, action, inputData)
        }
      }
    } catch (error) {
      console.error('Failed to execute stage actions:', error)
    }
  }

  private async executeAction(candidateStateId: string, action: StageAction, inputData: any): Promise<void> {
    try {
      switch (action.type) {
        case 'email':
          await this.sendEmailAction(candidateStateId, action, inputData)
          break
        case 'sms':
          await this.sendSMSAction(candidateStateId, action, inputData)
          break
        case 'assessment':
          await this.triggerAssessmentAction(candidateStateId, action, inputData)
          break
        case 'interview_scheduling':
          await this.scheduleInterviewAction(candidateStateId, action, inputData)
          break
        case 'reference_request':
          await this.requestReferenceAction(candidateStateId, action, inputData)
          break
        case 'background_check':
          await this.initiateBackgroundCheckAction(candidateStateId, action, inputData)
          break
        case 'offer_generation':
          await this.generateOfferAction(candidateStateId, action, inputData)
          break
        default:
          console.warn(`Unknown action type: ${action.type}`)
      }
    } catch (error) {
      console.error(`Failed to execute action ${action.type}:`, error)
    }
  }

  private async sendEmailAction(candidateStateId: string, action: StageAction, inputData: any): Promise<void> {
    // Implement email sending logic
    // This would integrate with email service provider
  }

  private async sendSMSAction(candidateStateId: string, action: StageAction, inputData: any): Promise<void> {
    // Implement SMS sending logic
    // This would integrate with SMS service provider
  }

  private async triggerAssessmentAction(candidateStateId: string, action: StageAction, inputData: any): Promise<void> {
    // Implement assessment triggering logic
    // This would integrate with assessment platforms
  }

  private async scheduleInterviewAction(candidateStateId: string, action: StageAction, inputData: any): Promise<void> {
    // Implement interview scheduling logic
    // This would integrate with calendar systems
  }

  private async requestReferenceAction(candidateStateId: string, action: StageAction, inputData: any): Promise<void> {
    // Implement reference request logic
    // This would integrate with reference checking services
  }

  private async initiateBackgroundCheckAction(candidateStateId: string, action: StageAction, inputData: any): Promise<void> {
    // Implement background check initiation logic
    // This would integrate with background check providers
  }

  private async generateOfferAction(candidateStateId: string, action: StageAction, inputData: any): Promise<void> {
    // Implement offer generation logic
    // This would create and send job offers
  }

  private async requestManualIntervention(
    candidateStateId: string,
    stageId: string,
    reason: ManualIntervention['reason'],
    automationDecision: AutomationDecision | null
  ): Promise<void> {
    try {
      const intervention: ManualIntervention = {
        id: this.generateId(),
        stageId,
        reason,
        interventionBy: 'system',
        interventionType: 'review',
        action: 'pending_manual_review',
        result: 'pending',
        timestamp: new Date().toISOString(),
        timeSpent: 0
      }

      const candidateState = await this.getCandidateState(candidateStateId)
      if (!candidateState) throw new Error('Candidate state not found')

      const updatedInterventions = [...candidateState.manual_interventions, intervention]

      await supabase
        .from('candidate_workflow_states')
        .update({
          manual_interventions: updatedInterventions,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateStateId)

      // Notify appropriate personnel
      await this.notifyManualReview(candidateStateId, stageId, reason, automationDecision)
    } catch (error) {
      console.error('Failed to request manual intervention:', error)
    }
  }

  private async handleStageException(
    candidateStateId: string,
    stageId: string,
    type: WorkflowException['type'],
    description: string
  ): Promise<void> {
    try {
      const exception: WorkflowException = {
        id: this.generateId(),
        type,
        severity: 'high',
        description,
        stageId,
        metadata: { candidateStateId, timestamp: new Date().toISOString() },
        resolved: false,
        timestamp: new Date().toISOString()
      }

      const candidateState = await this.getCandidateState(candidateStateId)
      if (!candidateState) throw new Error('Candidate state not found')

      const updatedExceptions = [...candidateState.exceptions, exception]

      await supabase
        .from('candidate_workflow_states')
        .update({
          exceptions: updatedExceptions,
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateStateId)

      // Escalate critical exceptions
      if (exception.severity === 'critical') {
        await this.escalateException(candidateStateId, exception)
      }
    } catch (error) {
      console.error('Failed to handle stage exception:', error)
    }
  }

  private async notifyManualReview(
    candidateStateId: string,
    stageId: string,
    reason: string,
    automationDecision: AutomationDecision | null
  ): Promise<void> {
    // Notify hiring managers or recruiters for manual review
    // This would send notifications via various channels
  }

  private async escalateException(candidateStateId: string, exception: WorkflowException): Promise<void> {
    // Escalate critical exceptions to administrators
    // This would send urgent notifications and potentially pause the workflow
  }

  private async setupStageAutomation(workflowId: string, stageId: string, automationConfig: StageAutomation): Promise<void> {
    // Setup automation monitoring and triggers for the stage
    // This would configure automation infrastructure
  }

  private async setupIntegration(workflowId: string, integration: WorkflowIntegration): Promise<void> {
    // Setup integration connections and authentication
    // This would establish API connections with external services
  }

  private async sendCandidateNotification(
    candidateStateId: string,
    type: string,
    data: any
  ): Promise<void> {
    try {
      const candidateState = await this.getCandidateState(candidateStateId)
      if (!candidateState) return

      await supabase
        .from('notifications')
        .insert({
          user_id: candidateState.candidate_id,
          type: `workflow_${type}`,
          title: this.getNotificationTitle(type),
          message: this.getNotificationMessage(type, data),
          data: { candidateStateId, workflowId: this.workflowId, ...data },
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Failed to send candidate notification:', error)
    }
  }

  private getNotificationTitle(type: string): string {
    const titles = {
      'rejection': 'Application Update',
      'workflow_completed': 'Application Completed',
      'manual_review': 'Application Under Review',
      'stage_completed': 'Application Progress'
    }
    return titles[type] || 'Application Update'
  }

  private getNotificationMessage(type: string, data: any): string {
    const messages = {
      'rejection': `Thank you for your interest. After careful consideration, we have decided to move forward with other candidates. ${data.reason || ''}`,
      'workflow_completed': 'Your application has been completed. We will be in touch with next steps.',
      'manual_review': 'Your application is currently under manual review by our hiring team.',
      'stage_completed': 'Your application has progressed to the next stage of our hiring process.'
    }
    return messages[type] || 'Your application status has been updated.'
  }

  private async updateWorkflowMetrics(candidateStateId: string): Promise<void> {
    try {
      // Calculate and update workflow performance metrics
      // This would analyze completion rates, times, automation success, etc.
      
      const candidateState = await this.getCandidateState(candidateStateId)
      if (!candidateState) return

      // Update workflow metrics in database
      // This is a simplified version - production would have comprehensive metrics calculation
      
      await supabase
        .from('hiring_workflows')
        .update({
          metrics: {
            // Updated metrics would be calculated here
            lastUpdated: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', this.workflowId)
    } catch (error) {
      console.error('Failed to update workflow metrics:', error)
    }
  }

  private generateWorkflowId(): string {
    return 'wf_' + crypto.randomBytes(16).toString('hex')
  }

  private generateStateId(): string {
    return 'ws_' + crypto.randomBytes(16).toString('hex')
  }

  private generateId(): string {
    return crypto.randomBytes(12).toString('hex')
  }

  // Public API Methods
  async getWorkflowStatus(candidateId: string): Promise<CandidateWorkflowState | null> {
    try {
      const { data, error } = await supabase
        .from('candidate_workflow_states')
        .select('*')
        .eq('candidate_id', candidateId)
        .eq('workflow_id', this.workflowId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get workflow status:', error)
      return null
    }
  }

  async getWorkflowMetrics(): Promise<WorkflowMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('hiring_workflows')
        .select('metrics')
        .eq('id', this.workflowId)
        .single()

      if (error) throw error
      return data?.metrics
    } catch (error) {
      console.error('Failed to get workflow metrics:', error)
      return null
    }
  }

  async pauseWorkflow(candidateStateId: string, reason: string): Promise<void> {
    try {
      await supabase
        .from('candidate_workflow_states')
        .update({
          status: 'on_hold',
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateStateId)

      await this.sendCandidateNotification(candidateStateId, 'workflow_paused', { reason })
    } catch (error) {
      console.error('Failed to pause workflow:', error)
      throw error
    }
  }

  async resumeWorkflow(candidateStateId: string): Promise<void> {
    try {
      const candidateState = await this.getCandidateState(candidateStateId)
      if (!candidateState) throw new Error('Candidate state not found')

      await supabase
        .from('candidate_workflow_states')
        .update({
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', candidateStateId)

      // Resume processing from current stage
      await this.processStage(candidateStateId, candidateState.current_stage_id, { resumed: true })
    } catch (error) {
      console.error('Failed to resume workflow:', error)
      throw error
    }
  }
}

export default AutomatedHiringWorkflowEngine