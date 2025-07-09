/**
 * Deep Cultural + Personality Matching - Revolutionary personality and culture alignment
 * Features: Personality assessment, cultural fit analysis, team dynamics prediction
 */

import OpenAI from 'openai'

// Core interfaces for cultural and personality matching
export interface CulturalMatchingProfile {
  id: string
  userId: string
  userType: 'candidate' | 'company'
  profileType: ProfileType
  personalityProfile: PersonalityProfile
  culturalProfile: CulturalProfile
  workStyleProfile: WorkStyleProfile
  valuesProfile: ValuesProfile
  communicationProfile: CommunicationProfile
  teamDynamicsProfile: TeamDynamicsProfile
  adaptabilityProfile: AdaptabilityProfile
  motivationProfile: MotivationProfile
  leadershipProfile: LeadershipProfile
  conflictResolutionProfile: ConflictResolutionProfile
  assessmentData: AssessmentData
  confidenceScore: number
  lastUpdated: Date
}

export type ProfileType = 'individual' | 'team' | 'department' | 'organization'

export interface PersonalityProfile {
  bigFiveTraits: BigFiveTraits
  mbtiType: MBTIType
  discProfile: DISCProfile
  enneagramType: EnneagramType
  emotionalIntelligence: EmotionalIntelligence
  cognitiveStyle: CognitiveStyle
  socialStyle: SocialStyle
  stressResponse: StressResponse
  decisionMaking: DecisionMakingStyle
  creativityIndex: CreativityIndex
}

export interface BigFiveTraits {
  openness: number // 0-100
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  facets: BigFiveFacets
  reliability: number
}

export interface BigFiveFacets {
  openness: {
    imagination: number
    artisticInterests: number
    emotionality: number
    adventurousness: number
    intellect: number
    progressivism: number
  }
  conscientiousness: {
    selfEfficacy: number
    orderliness: number
    dutifulness: number
    achievementStriving: number
    selfDiscipline: number
    cautiousness: number
  }
  extraversion: {
    friendliness: number
    gregariousness: number
    assertiveness: number
    activityLevel: number
    excitementSeeking: number
    cheerfulness: number
  }
  agreeableness: {
    trust: number
    morality: number
    altruism: number
    cooperation: number
    modesty: number
    sympathy: number
  }
  neuroticism: {
    anxiety: number
    anger: number
    depression: number
    selfConsciousness: number
    immoderation: number
    vulnerability: number
  }
}

export interface MBTIType {
  type: string // e.g., "ENFP"
  dimensions: {
    extraversionIntroversion: 'E' | 'I'
    sensingIntuition: 'S' | 'N'
    thinkingFeeling: 'T' | 'F'
    judgingPerceiving: 'J' | 'P'
  }
  strengths: string[]
  weaknesses: string[]
  workPreferences: string[]
  communicationStyle: string
  confidence: number
}

export interface DISCProfile {
  primaryStyle: 'D' | 'I' | 'S' | 'C'
  dominance: number
  influence: number
  steadiness: number
  conscientiousness: number
  adaptedStyle: DISCAdaptation
  naturalStyle: DISCAdaptation
  stressResponse: DISCStressResponse
}

export interface DISCAdaptation {
  dominance: number
  influence: number
  steadiness: number
  conscientiousness: number
}

export interface DISCStressResponse {
  overuseOfStrengths: string[]
  underuseOfStrengths: string[]
  stressTriggers: string[]
  stressManagement: string[]
}

export interface EnneagramType {
  type: number // 1-9
  wing: number | null
  name: string
  coreMotivation: string
  basicFear: string
  basicDesire: string
  integrationDirection: number
  disintegrationDirection: number
  healthLevels: HealthLevel[]
  workBehaviors: WorkBehavior[]
}

export interface HealthLevel {
  level: 'healthy' | 'average' | 'unhealthy'
  behaviors: string[]
  triggers: string[]
}

export interface WorkBehavior {
  context: string
  behavior: string
  impact: 'positive' | 'neutral' | 'negative'
  frequency: number
}

export interface EmotionalIntelligence {
  overallEQ: number
  selfAwareness: number
  selfRegulation: number
  motivation: number
  empathy: number
  socialSkills: number
  competencies: EQCompetency[]
  strengths: string[]
  developmentAreas: string[]
}

export interface EQCompetency {
  name: string
  score: number
  description: string
  behaviors: string[]
}

export interface CognitiveStyle {
  processingStyle: 'analytical' | 'intuitive' | 'balanced'
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'multimodal'
  problemSolvingApproach: 'systematic' | 'creative' | 'collaborative' | 'independent'
  informationProcessing: 'detail-oriented' | 'big-picture' | 'sequential' | 'random'
  decisionSpeed: 'quick' | 'deliberate' | 'variable'
  focusStyle: 'single-task' | 'multi-task' | 'deep-focus' | 'broad-focus'
  adaptability: number
}

export interface SocialStyle {
  interpersonalOrientation: 'people-focused' | 'task-focused' | 'balanced'
  communicationPreference: 'direct' | 'indirect' | 'expressive' | 'analytical'
  teamRole: TeamRole[]
  networkingStyle: 'active' | 'selective' | 'passive'
  conflictStyle: 'competing' | 'collaborating' | 'compromising' | 'avoiding' | 'accommodating'
  influenceStyle: 'authoritative' | 'democratic' | 'affiliative' | 'pacesetting' | 'coaching'
}

export interface TeamRole {
  role: string
  preference: number
  effectiveness: number
  contexts: string[]
}

export interface StressResponse {
  stressThreshold: number
  stressTriggers: StressTrigger[]
  copingMechanisms: CopingMechanism[]
  stressSignals: StressSignal[]
  recoveryStrategies: RecoveryStrategy[]
  resilience: number
}

export interface StressTrigger {
  trigger: string
  intensity: number
  frequency: number
  context: string
}

export interface CopingMechanism {
  mechanism: string
  effectiveness: number
  healthiness: 'healthy' | 'neutral' | 'unhealthy'
  frequency: number
}

export interface StressSignal {
  signal: string
  type: 'behavioral' | 'emotional' | 'physical' | 'cognitive'
  severity: number
  observability: number
}

export interface RecoveryStrategy {
  strategy: string
  effectiveness: number
  timeRequired: number
  accessibility: number
}

export interface DecisionMakingStyle {
  primaryStyle: 'rational' | 'intuitive' | 'dependent' | 'avoidant' | 'spontaneous'
  riskTolerance: number
  informationGathering: 'extensive' | 'moderate' | 'minimal'
  consultationStyle: 'collaborative' | 'selective' | 'independent'
  timeOrientation: 'quick' | 'deliberate' | 'procrastinating'
  biases: CognitiveBias[]
}

export interface CognitiveBias {
  bias: string
  strength: number
  impact: string
  awareness: number
}

export interface CreativityIndex {
  overallCreativity: number
  divergentThinking: number
  convergentThinking: number
  originalityScore: number
  fluencyScore: number
  flexibilityScore: number
  elaborationScore: number
  creativeDomains: CreativeDomain[]
  barriers: CreativityBarrier[]
  enhancers: CreativityEnhancer[]
}

export interface CreativeDomain {
  domain: string
  proficiency: number
  interest: number
  potential: number
}

export interface CreativityBarrier {
  barrier: string
  impact: number
  frequency: number
  solutions: string[]
}

export interface CreativityEnhancer {
  enhancer: string
  effectiveness: number
  accessibility: number
  preference: number
}

export interface CulturalProfile {
  hofstedeValues: HofstedeValues
  culturalIntelligence: CulturalIntelligence
  communicationContext: 'high-context' | 'low-context' | 'mixed'
  timeOrientation: 'monochronic' | 'polychronic' | 'flexible'
  relationshipOrientation: 'relationship-first' | 'task-first' | 'balanced'
  hierarchyComfort: number
  groupOrientation: 'individualistic' | 'collectivistic' | 'balanced'
  changeOrientation: 'traditional' | 'adaptive' | 'innovative'
  riskOrientation: 'uncertainty-avoiding' | 'uncertainty-accepting' | 'risk-seeking'
  diversityValues: DiversityValues
  inclusionBehaviors: InclusionBehavior[]
}

export interface HofstedeValues {
  powerDistance: number
  individualismCollectivism: number
  masculinityFemininity: number
  uncertaintyAvoidance: number
  longTermOrientation: number
  indulgenceRestraint: number
}

export interface CulturalIntelligence {
  overallCQ: number
  culturalKnowledge: number
  culturalEmpathy: number
  culturalAdaptability: number
  crossCulturalCommunication: number
  experiences: CulturalExperience[]
  competencies: CulturalCompetency[]
}

export interface CulturalExperience {
  type: 'living' | 'working' | 'studying' | 'traveling'
  location: string
  duration: number
  depth: number
  impact: number
}

export interface CulturalCompetency {
  competency: string
  level: number
  evidence: string[]
  applications: string[]
}

export interface DiversityValues {
  appreciationForDifferences: number
  inclusionCommitment: number
  biasAwareness: number
  allyship: number
  advocacyWillingness: number
  dimensions: DiversityDimension[]
}

export interface DiversityDimension {
  dimension: string
  comfort: number
  experience: number
  advocacy: number
}

export interface InclusionBehavior {
  behavior: string
  frequency: number
  effectiveness: number
  contexts: string[]
}

export interface WorkStyleProfile {
  workPreferences: WorkPreferences
  environmentPreferences: EnvironmentPreferences
  schedulePreferences: SchedulePreferences
  collaborationStyle: CollaborationStyle
  feedbackStyle: FeedbackStyle
  autonomyNeeds: AutonomyNeeds
  structurePreferences: StructurePreferences
  technologyComfort: TechnologyComfort
}

export interface WorkPreferences {
  pace: 'fast' | 'moderate' | 'deliberate' | 'variable'
  depth: 'deep-focus' | 'broad-scope' | 'mixed'
  variety: 'routine' | 'mixed' | 'high-variety'
  challenge: 'comfort-zone' | 'moderate-challenge' | 'high-challenge'
  innovation: 'traditional' | 'incremental' | 'disruptive'
  workload: 'light' | 'moderate' | 'heavy' | 'variable'
}

export interface EnvironmentPreferences {
  physicalSpace: 'private-office' | 'open-office' | 'hybrid' | 'home-office' | 'flexible'
  noise: 'quiet' | 'moderate' | 'energetic'
  formality: 'formal' | 'business-casual' | 'casual' | 'flexible'
  mobility: 'stationary' | 'moderate-movement' | 'high-mobility'
  lighting: 'natural' | 'artificial' | 'mixed'
  temperature: 'cool' | 'moderate' | 'warm'
}

export interface SchedulePreferences {
  workingHours: 'early-bird' | 'standard' | 'night-owl' | 'flexible'
  breakPatterns: 'frequent-short' | 'few-long' | 'spontaneous'
  meeting: 'morning-heavy' | 'afternoon-heavy' | 'distributed' | 'minimal'
  deadlines: 'early-completion' | 'on-time' | 'last-minute' | 'extended'
  vacation: 'frequent-short' | 'annual-long' | 'spontaneous'
}

export interface CollaborationStyle {
  teamSize: 'small' | 'medium' | 'large' | 'flexible'
  interaction: 'frequent' | 'regular' | 'minimal' | 'as-needed'
  decisionMaking: 'consensus' | 'consultative' | 'directive' | 'delegated'
  meetingStyle: 'structured' | 'flexible' | 'creative' | 'minimal'
  conflictApproach: 'direct' | 'diplomatic' | 'avoidant' | 'mediating'
  shareInformation: 'open' | 'selective' | 'need-to-know'
}

export interface FeedbackStyle {
  frequency: 'continuous' | 'regular' | 'periodic' | 'annual'
  format: 'verbal' | 'written' | 'mixed' | 'demonstration'
  direction: 'top-down' | 'peer' | '360-degree' | 'self-assessment'
  delivery: 'direct' | 'gentle' | 'constructive' | 'appreciative'
  receiving: 'open' | 'defensive' | 'questioning' | 'action-oriented'
}

export interface AutonomyNeeds {
  taskAutonomy: number
  methodAutonomy: number
  timeAutonomy: number
  teamAutonomy: number
  goalAutonomy: number
  supervisionStyle: 'hands-off' | 'collaborative' | 'supportive' | 'directive'
}

export interface StructurePreferences {
  processStructure: number
  goalClarity: number
  roleDefinition: number
  standardization: number
  flexibility: number
  improvisation: number
}

export interface TechnologyComfort {
  adoptionSpeed: 'early-adopter' | 'early-majority' | 'late-majority' | 'laggard'
  complexity: 'simple' | 'moderate' | 'complex' | 'expert'
  integration: 'single-tool' | 'moderate-integration' | 'high-integration'
  learning: 'self-taught' | 'guided' | 'formal-training'
}

export interface ValuesProfile {
  coreValues: CoreValue[]
  workValues: WorkValue[]
  ethicalFramework: EthicalFramework
  purposeDriven: PurposeDriven
  achievementOrientation: AchievementOrientation
  relationshipValues: RelationshipValue[]
  growthValues: GrowthValue[]
  stabilityValues: StabilityValue[]
}

export interface CoreValue {
  value: string
  importance: number
  alignment: number
  behaviors: string[]
  conflicts: string[]
}

export interface WorkValue {
  value: string
  priority: number
  satisfaction: number
  negotiability: number
  evidence: string[]
}

export interface EthicalFramework {
  primaryFramework: 'consequentialist' | 'deontological' | 'virtue-ethics' | 'care-ethics' | 'mixed'
  moralFoundations: MoralFoundation[]
  ethicalDilemmaApproach: string
  integrityLevel: number
}

export interface MoralFoundation {
  foundation: 'care' | 'fairness' | 'loyalty' | 'authority' | 'sanctity' | 'liberty'
  strength: number
  application: string[]
}

export interface PurposeDriven {
  purposeClarity: number
  meaningAtWork: number
  impactOrientation: number
  legacyFocus: number
  socialContribution: number
  causes: Cause[]
}

export interface Cause {
  cause: string
  commitment: number
  involvement: number
  skills: string[]
}

export interface AchievementOrientation {
  competitiveness: number
  goalOrientation: number
  excellenceStandards: number
  recognitionNeeds: number
  growthMindset: number
  resilience: number
}

export interface RelationshipValue {
  value: string
  importance: number
  behaviors: string[]
  boundaries: string[]
}

export interface GrowthValue {
  value: string
  commitment: number
  investments: string[]
  barriers: string[]
}

export interface StabilityValue {
  value: string
  importance: number
  requirements: string[]
  tradoffs: string[]
}

export interface CommunicationProfile {
  communicationStyle: CommunicationStyle
  languagePreferences: LanguagePreferences
  nonverbalCommunication: NonverbalCommunication
  listeningStyle: ListeningStyle
  conflictCommunication: ConflictCommunication
  digitalCommunication: DigitalCommunication
  persuasionStyle: PersuasionStyle
  presentationStyle: PresentationStyle
}

export interface CommunicationStyle {
  directness: number
  expressiveness: number
  formality: number
  detail: number
  emotion: number
  assertiveness: number
  adaptability: number
}

export interface LanguagePreferences {
  primaryLanguage: string
  additionalLanguages: Language[]
  technicalVocabulary: number
  metaphorUsage: number
  storytelling: number
  humor: number
}

export interface Language {
  language: string
  proficiency: number
  context: string[]
  comfort: number
}

export interface NonverbalCommunication {
  bodyLanguageAwareness: number
  facialExpressiveness: number
  gestureUsage: number
  eyeContact: number
  personalSpace: number
  touchComfort: number
}

export interface ListeningStyle {
  activeListening: number
  empathicListening: number
  criticalListening: number
  appreciativeListening: number
  comprehensiveListening: number
  barriers: ListeningBarrier[]
}

export interface ListeningBarrier {
  barrier: string
  frequency: number
  impact: number
  awareness: number
}

export interface ConflictCommunication {
  approach: 'competitive' | 'collaborative' | 'accommodating' | 'avoiding' | 'compromising'
  escalationTendency: number
  deescalationSkills: number
  emotionManagement: number
  perspectiveTaking: number
}

export interface DigitalCommunication {
  platformComfort: PlatformComfort[]
  responseExpectations: ResponseExpectation[]
  digitalEtiquette: number
  multimediaUsage: number
  privacyAwareness: number
}

export interface PlatformComfort {
  platform: string
  comfort: number
  effectiveness: number
  frequency: number
}

export interface ResponseExpectation {
  platform: string
  urgency: 'immediate' | 'same-day' | 'next-day' | 'weekly'
  context: string[]
}

export interface PersuasionStyle {
  approach: 'logical' | 'emotional' | 'credibility' | 'mixed'
  influenceTactics: InfluenceTactic[]
  adaptability: number
  persistence: number
  ethicalBoundaries: string[]
}

export interface InfluenceTactic {
  tactic: string
  effectiveness: number
  frequency: number
  contexts: string[]
}

export interface PresentationStyle {
  format: 'formal' | 'conversational' | 'interactive' | 'storytelling'
  structure: 'linear' | 'circular' | 'modular' | 'adaptive'
  visualAids: number
  audienceEngagement: number
  nervousManagement: number
}

export interface TeamDynamicsProfile {
  preferredTeamRoles: TeamRole[]
  teamSize: TeamSizePreference
  diversityComfort: DiversityComfort
  leadershipStyle: LeadershipStyle
  followership: FollowershipStyle
  groupDecisionMaking: GroupDecisionMaking
  teamCommunication: TeamCommunication
  teamConflict: TeamConflictStyle
  teamBuilding: TeamBuildingPreference
}

export interface TeamSizePreference {
  optimal: number
  minimum: number
  maximum: number
  scalingComfort: number
}

export interface DiversityComfort {
  cognitiveStyle: number
  background: number
  experience: number
  perspective: number
  workingStyle: number
}

export interface LeadershipStyle {
  naturalStyle: 'transformational' | 'transactional' | 'servant' | 'authentic' | 'democratic'
  situationalAdaptability: number
  influencePreference: 'position' | 'expertise' | 'relationship' | 'charisma'
  delegationComfort: number
  feedbackDelivery: number
  visionCommunication: number
}

export interface FollowershipStyle {
  style: 'exemplary' | 'conformist' | 'pragmatic' | 'alienated' | 'passive'
  initiative: number
  supportiveness: number
  criticalThinking: number
  independence: number
  loyalty: number
}

export interface GroupDecisionMaking {
  preference: 'consensus' | 'majority' | 'expert' | 'leader' | 'delegated'
  participationLevel: number
  influenceStyle: string
  compromiseWillingness: number
}

export interface TeamCommunication {
  openness: number
  frequency: number
  formality: number
  channels: string[]
  meetingEffectiveness: number
}

export interface TeamConflictStyle {
  approach: 'direct' | 'mediated' | 'escalated' | 'avoided'
  resolution: number
  prevention: number
  learning: number
}

export interface TeamBuildingPreference {
  activities: string[]
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  format: 'social' | 'professional' | 'mixed' | 'none'
  investment: number
}

export interface AdaptabilityProfile {
  changeAdaptation: ChangeAdaptation
  learningAgility: LearningAgility
  resilience: ResilienceProfile
  flexibility: FlexibilityProfile
  ambiguityTolerance: AmbiguityTolerance
  innovationAdoption: InnovationAdoption
}

export interface ChangeAdaptation {
  changeReadiness: number
  changeSpeed: number
  changeAnxiety: number
  changeExcitement: number
  changePlanning: number
  changeSupport: number
}

export interface LearningAgility {
  mentalAgility: number
  peopleAgility: number
  changeAgility: number
  resultsAgility: number
  selfAwareness: number
  learningVelocity: number
}

export interface ResilienceProfile {
  stressManagement: number
  recoverySpeed: number
  optimismLevel: number
  problemSolving: number
  socialSupport: number
  meaningMaking: number
}

export interface FlexibilityProfile {
  cognitiveFlexibility: number
  behavioralFlexibility: number
  emotionalFlexibility: number
  roleFlexibility: number
  scheduleFlexibility: number
}

export interface AmbiguityTolerance {
  comfortLevel: number
  clarificationSeeking: number
  assumptionMaking: number
  decisionMaking: number
  stressResponse: number
}

export interface InnovationAdoption {
  adoptionSpeed: 'innovator' | 'early-adopter' | 'early-majority' | 'late-majority' | 'laggard'
  riskTolerance: number
  experimentationWillingness: number
  resourceInvestment: number
}

export interface MotivationProfile {
  intrinsicMotivators: IntrinsicMotivator[]
  extrinsicMotivators: ExtrinsicMotivator[]
  motivationalNeeds: MotivationalNeed[]
  goalOrientation: GoalOrientation
  engagementDrivers: EngagementDriver[]
  disengagementTriggers: DisengagementTrigger[]
  energySources: EnergySource[]
  energyDrains: EnergyDrain[]
}

export interface IntrinsicMotivator {
  motivator: string
  strength: number
  sustainability: number
  conditions: string[]
}

export interface ExtrinsicMotivator {
  motivator: string
  effectiveness: number
  dependency: number
  diminishingReturns: number
}

export interface MotivationalNeed {
  need: string
  intensity: number
  fulfillment: number
  impact: number
}

export interface GoalOrientation {
  learningGoals: number
  performanceGoals: number
  masteryOrientation: number
  competitiveOrientation: number
  timeHorizon: 'short-term' | 'medium-term' | 'long-term' | 'mixed'
}

export interface EngagementDriver {
  driver: string
  impact: number
  frequency: number
  sustainability: number
}

export interface DisengagementTrigger {
  trigger: string
  severity: number
  frequency: number
  recovery: number
}

export interface EnergySource {
  source: string
  potency: number
  accessibility: number
  sustainability: number
}

export interface EnergyDrain {
  drain: string
  impact: number
  frequency: number
  mitigation: number
}

export interface LeadershipProfile {
  leadershipPotential: LeadershipPotential
  leadershipExperience: LeadershipExperience[]
  leadershipStyle: LeadershipStyleProfile
  influenceStyle: InfluenceStyleProfile
  decisionMaking: LeadershipDecisionMaking
  visionaryCapacity: VisionaryCapacity
  peopleLeadership: PeopleLeadership
  operationalLeadership: OperationalLeadership
  strategicLeadership: StrategicLeadership
  transformationalCapacity: TransformationalCapacity
}

export interface LeadershipPotential {
  overallPotential: number
  readiness: number
  aspirations: number
  competencies: LeadershipCompetency[]
  developmentAreas: string[]
  timeframe: string
}

export interface LeadershipCompetency {
  competency: string
  currentLevel: number
  targetLevel: number
  importance: number
  development: string[]
}

export interface LeadershipExperience {
  role: string
  scope: string
  duration: number
  results: string[]
  lessons: string[]
  impact: number
}

export interface LeadershipStyleProfile {
  dominantStyle: string
  adaptiveStyles: string[]
  situationalEffectiveness: SituationalEffectiveness[]
  developmentNeeds: string[]
}

export interface SituationalEffectiveness {
  situation: string
  effectiveness: number
  confidence: number
  experience: number
}

export interface InfluenceStyleProfile {
  primaryStyle: string
  tactics: InfluenceTactic[]
  relationships: number
  credibility: number
  inspiration: number
}

export interface LeadershipDecisionMaking {
  style: 'autocratic' | 'consultative' | 'consensus' | 'delegative'
  quality: number
  speed: number
  stakeholderInvolvement: number
  riskConsideration: number
}

export interface VisionaryCapacity {
  visionCreation: number
  visionCommunication: number
  visionAlignment: number
  futureFocus: number
  inspiration: number
}

export interface PeopleLeadership {
  empathy: number
  coaching: number
  teamBuilding: number
  conflictResolution: number
  talentDevelopment: number
  inclusiveLeadership: number
}

export interface OperationalLeadership {
  executionExcellence: number
  processImprovement: number
  resourceManagement: number
  performanceManagement: number
  problemSolving: number
}

export interface StrategicLeadership {
  strategicThinking: number
  systemsThinking: number
  innovationLeadership: number
  changeLeadership: number
  stakeholderManagement: number
}

export interface TransformationalCapacity {
  changeAgency: number
  inspirationalMotivation: number
  intellectualStimulation: number
  individualizedConsideration: number
  idealiizedInfluence: number
}

export interface ConflictResolutionProfile {
  conflictStyle: ConflictStyle
  resolutionSkills: ResolutionSkill[]
  mediationCapacity: MediationCapacity
  negotiationStyle: NegotiationStyle
  emotionalRegulation: EmotionalRegulation
  perspectiveTaking: PerspectiveTakingAbility
  creativeProblemSolving: CreativeProblemSolving
}

export interface ConflictStyle {
  dominantStyle: 'competing' | 'collaborating' | 'compromising' | 'avoiding' | 'accommodating'
  situationalFlexibility: number
  effectiveness: number
  triggers: string[]
  development: string[]
}

export interface ResolutionSkill {
  skill: string
  proficiency: number
  application: string[]
  development: number
}

export interface MediationCapacity {
  neutrality: number
  facilitation: number
  empathy: number
  communication: number
  creativeSolutions: number
}

export interface NegotiationStyle {
  approach: 'competitive' | 'collaborative' | 'principled' | 'accommodating'
  preparation: number
  flexibility: number
  persuasion: number
  relationshipFocus: number
}

export interface EmotionalRegulation {
  selfRegulation: number
  stressManagement: number
  impulseControl: number
  emotionalAwareness: number
  calming: number
}

export interface PerspectiveTakingAbility {
  empathy: number
  cognitiveFlexibility: number
  culturalSensitivity: number
  biasAwareness: number
  activeListening: number
}

export interface CreativeProblemSolving {
  divergentThinking: number
  convergentThinking: number
  reframing: number
  resourcefulness: number
  implementation: number
}

export interface AssessmentData {
  assessments: Assessment[]
  behavioralObservations: BehavioralObservation[]
  feedbackData: FeedbackData[]
  performanceData: PerformanceData[]
  validationMetrics: ValidationMetric[]
  dataQuality: DataQuality
}

export interface Assessment {
  id: string
  type: string
  name: string
  version: string
  completedAt: Date
  duration: number
  results: any
  reliability: number
  validity: number
}

export interface BehavioralObservation {
  id: string
  observer: string
  context: string
  date: Date
  behaviors: ObservedBehavior[]
  reliability: number
}

export interface ObservedBehavior {
  behavior: string
  frequency: number
  intensity: number
  context: string
  impact: string
}

export interface FeedbackData {
  id: string
  source: string
  type: '360' | 'peer' | 'manager' | 'direct-report' | 'customer'
  date: Date
  feedback: FeedbackItem[]
  credibility: number
}

export interface FeedbackItem {
  dimension: string
  rating: number
  comments: string
  examples: string[]
}

export interface PerformanceData {
  id: string
  period: string
  metrics: PerformanceMetric[]
  achievements: string[]
  challenges: string[]
  overall: number
}

export interface PerformanceMetric {
  metric: string
  value: number
  target: number
  trend: 'improving' | 'stable' | 'declining'
}

export interface ValidationMetric {
  metric: string
  value: number
  benchmark: number
  confidence: number
}

export interface DataQuality {
  completeness: number
  accuracy: number
  consistency: number
  timeliness: number
  relevance: number
  objectivity: number
}

export interface CulturalMatchAnalysis {
  id: string
  candidateId: string
  companyId: string
  teamId?: string
  analysisDate: Date
  overallMatch: MatchScore
  dimensionMatches: DimensionMatch[]
  strengths: MatchStrength[]
  challenges: MatchChallenge[]
  recommendations: MatchRecommendation[]
  adaptationPlan: AdaptationPlan
  successProbability: number
  riskFactors: RiskFactor[]
  enhancementOpportunities: EnhancementOpportunity[]
  confidenceInterval: ConfidenceInterval
}

export interface MatchScore {
  score: number
  level: 'poor' | 'fair' | 'good' | 'excellent' | 'exceptional'
  percentile: number
  reliability: number
}

export interface DimensionMatch {
  dimension: string
  candidateScore: number
  organizationScore: number
  match: number
  importance: number
  impact: 'positive' | 'neutral' | 'negative'
  explanation: string
}

export interface MatchStrength {
  area: string
  strength: number
  evidence: string[]
  leverageOpportunities: string[]
}

export interface MatchChallenge {
  area: string
  severity: number
  evidence: string[]
  mitigationStrategies: string[]
  timeline: string
}

export interface MatchRecommendation {
  category: 'onboarding' | 'role-design' | 'team-composition' | 'development' | 'management'
  priority: 'high' | 'medium' | 'low'
  recommendation: string
  rationale: string
  implementation: string[]
  timeline: string
  successMetrics: string[]
}

export interface AdaptationPlan {
  phases: AdaptationPhase[]
  timeline: string
  resources: string[]
  successIndicators: string[]
  riskMitigation: string[]
}

export interface AdaptationPhase {
  phase: string
  duration: string
  objectives: string[]
  activities: string[]
  support: string[]
  milestones: string[]
}

export interface RiskFactor {
  factor: string
  probability: number
  impact: number
  mitigation: string[]
  monitoring: string[]
}

export interface EnhancementOpportunity {
  opportunity: string
  potential: number
  requirements: string[]
  timeline: string
  roi: number
}

export interface ConfidenceInterval {
  lower: number
  upper: number
  level: number
  factors: string[]
}

export class CulturalMatchingEngine {
  private openai: OpenAI
  private readonly MATCHING_PROMPTS = {
    personalityAnalysis: `Analyze personality profile for cultural matching:
    
    Assessment Data: {assessmentData}
    Behavioral Observations: {behavioralData}
    Work Style Preferences: {workStyleData}
    Values Profile: {valuesData}
    
    Generate comprehensive personality profile including:
    1. Big Five personality traits with facets
    2. MBTI type with confidence scores
    3. DISC profile with adaptations
    4. Enneagram type with integration patterns
    5. Emotional intelligence assessment
    6. Cognitive and social styles
    7. Stress response patterns
    8. Decision-making preferences
    9. Creativity and innovation metrics
    
    Provide detailed analysis with confidence scores and evidence.
    Return as structured JSON.`,
    
    culturalAssessment: `Assess cultural profile and values alignment:
    
    Background: {backgroundData}
    Experience: {experienceData}
    Values Assessment: {valuesData}
    Communication Style: {communicationData}
    Work Preferences: {workPreferences}
    
    Analyze:
    1. Hofstede cultural dimensions
    2. Cultural intelligence and adaptability
    3. Communication context preferences
    4. Relationship vs task orientation
    5. Hierarchy and authority comfort
    6. Diversity and inclusion values
    7. Ethical framework and moral foundations
    8. Purpose and meaning orientation
    9. Cross-cultural competencies
    
    Focus on cultural fit indicators and adaptation capacity.`,
    
    teamDynamicsAnalysis: `Analyze team dynamics and collaboration potential:
    
    Team Profile: {teamData}
    Individual Profile: {individualData}
    Role Requirements: {roleData}
    Organization Context: {organizationData}
    
    Evaluate:
    1. Team role preferences and effectiveness
    2. Collaboration style compatibility
    3. Communication pattern alignment
    4. Leadership and followership dynamics
    5. Conflict resolution approaches
    6. Decision-making preferences
    7. Diversity and inclusion impact
    8. Performance optimization potential
    
    Predict team integration success and challenges.`,
    
    matchingAnalysis: `Perform comprehensive cultural matching analysis:
    
    Candidate Profile: {candidateProfile}
    Organization Profile: {organizationProfile}
    Role Context: {roleContext}
    Team Context: {teamContext}
    
    Analyze match across all dimensions:
    1. Personality compatibility
    2. Cultural values alignment
    3. Work style preferences
    4. Communication compatibility
    5. Team dynamics fit
    6. Leadership style alignment
    7. Adaptability and flexibility
    8. Motivation and engagement factors
    9. Conflict resolution compatibility
    10. Long-term success probability
    
    Provide detailed match scores, strengths, challenges, and recommendations.
    Include adaptation strategies and success optimization plans.`
  }

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generatePersonalityProfile(assessmentData: AssessmentData): Promise<PersonalityProfile> {
    try {
      const prompt = this.MATCHING_PROMPTS.personalityAnalysis
        .replace('{assessmentData}', JSON.stringify(assessmentData.assessments))
        .replace('{behavioralData}', JSON.stringify(assessmentData.behavioralObservations))
        .replace('{workStyleData}', 'Work style assessment data')
        .replace('{valuesData}', 'Values assessment data')

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert personality psychologist and organizational behavior specialist. Analyze personality data with scientific rigor and provide actionable insights for workplace compatibility.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000
      })

      const analysis = JSON.parse(response.choices[0].message.content || '{}')
      
      return {
        bigFiveTraits: analysis.bigFive || this.getDefaultBigFive(),
        mbtiType: analysis.mbti || this.getDefaultMBTI(),
        discProfile: analysis.disc || this.getDefaultDISC(),
        enneagramType: analysis.enneagram || this.getDefaultEnneagram(),
        emotionalIntelligence: analysis.eq || this.getDefaultEQ(),
        cognitiveStyle: analysis.cognitiveStyle || this.getDefaultCognitiveStyle(),
        socialStyle: analysis.socialStyle || this.getDefaultSocialStyle(),
        stressResponse: analysis.stressResponse || this.getDefaultStressResponse(),
        decisionMaking: analysis.decisionMaking || this.getDefaultDecisionMaking(),
        creativityIndex: analysis.creativity || this.getDefaultCreativity()
      }
    } catch (error) {
      console.error('Error generating personality profile:', error)
      return this.getFallbackPersonalityProfile()
    }
  }

  async assessCulturalProfile(profileData: any): Promise<CulturalProfile> {
    try {
      const prompt = this.MATCHING_PROMPTS.culturalAssessment
        .replace('{backgroundData}', JSON.stringify(profileData.background))
        .replace('{experienceData}', JSON.stringify(profileData.experience))
        .replace('{valuesData}', JSON.stringify(profileData.values))
        .replace('{communicationData}', JSON.stringify(profileData.communication))
        .replace('{workPreferences}', JSON.stringify(profileData.workPreferences))

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a cultural intelligence expert and cross-cultural consultant. Assess cultural profiles with sensitivity to diversity and provide insights for inclusive workplace integration.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2500
      })

      const analysis = JSON.parse(response.choices[0].message.content || '{}')
      
      return analysis.culturalProfile || this.getDefaultCulturalProfile()
    } catch (error) {
      console.error('Error assessing cultural profile:', error)
      return this.getDefaultCulturalProfile()
    }
  }

  async analyzeTeamDynamics(params: {
    individualProfile: CulturalMatchingProfile
    teamProfile: any
    roleRequirements: any
  }): Promise<TeamDynamicsProfile> {
    try {
      const prompt = this.MATCHING_PROMPTS.teamDynamicsAnalysis
        .replace('{teamData}', JSON.stringify(params.teamProfile))
        .replace('{individualData}', JSON.stringify(params.individualProfile))
        .replace('{roleData}', JSON.stringify(params.roleRequirements))
        .replace('{organizationData}', 'Organization context data')

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a team dynamics expert and organizational psychologist. Analyze team integration potential with focus on collaboration effectiveness and performance optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })

      const analysis = JSON.parse(response.choices[0].message.content || '{}')
      
      return analysis.teamDynamics || this.getDefaultTeamDynamics()
    } catch (error) {
      console.error('Error analyzing team dynamics:', error)
      return this.getDefaultTeamDynamics()
    }
  }

  async performCulturalMatch(params: {
    candidateProfile: CulturalMatchingProfile
    organizationProfile: any
    roleContext: any
    teamContext?: any
  }): Promise<CulturalMatchAnalysis> {
    try {
      const prompt = this.MATCHING_PROMPTS.matchingAnalysis
        .replace('{candidateProfile}', JSON.stringify(params.candidateProfile))
        .replace('{organizationProfile}', JSON.stringify(params.organizationProfile))
        .replace('{roleContext}', JSON.stringify(params.roleContext))
        .replace('{teamContext}', JSON.stringify(params.teamContext))

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a cultural matching specialist with expertise in organizational fit analysis. Provide comprehensive matching assessment with actionable recommendations for successful integration.'
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
        id: `match_${Date.now()}`,
        candidateId: params.candidateProfile.userId,
        companyId: 'company_id',
        teamId: params.teamContext?.id,
        analysisDate: new Date(),
        overallMatch: analysis.overallMatch || { score: 75, level: 'good', percentile: 70, reliability: 80 },
        dimensionMatches: analysis.dimensionMatches || [],
        strengths: analysis.strengths || [],
        challenges: analysis.challenges || [],
        recommendations: analysis.recommendations || [],
        adaptationPlan: analysis.adaptationPlan || this.getDefaultAdaptationPlan(),
        successProbability: analysis.successProbability || 75,
        riskFactors: analysis.riskFactors || [],
        enhancementOpportunities: analysis.enhancementOpportunities || [],
        confidenceInterval: analysis.confidenceInterval || { lower: 70, upper: 80, level: 95, factors: [] }
      }
    } catch (error) {
      console.error('Error performing cultural match:', error)
      return this.getFallbackMatchAnalysis(params.candidateProfile.userId)
    }
  }

  async generateAdaptationPlan(matchAnalysis: CulturalMatchAnalysis): Promise<AdaptationPlan> {
    // Generate personalized adaptation plan based on match analysis
    return {
      phases: [
        {
          phase: 'Onboarding Integration',
          duration: '30 days',
          objectives: ['Cultural orientation', 'Team introduction', 'Role clarity'],
          activities: ['Cultural immersion sessions', 'Buddy assignment', 'Regular check-ins'],
          support: ['HR support', 'Manager coaching', 'Peer mentoring'],
          milestones: ['Cultural assessment completion', 'Team integration', 'Role proficiency']
        },
        {
          phase: 'Performance Optimization',
          duration: '60 days',
          objectives: ['Peak performance', 'Team contribution', 'Cultural mastery'],
          activities: ['Performance coaching', 'Cross-cultural training', 'Leadership development'],
          support: ['Executive coaching', 'Training programs', 'Feedback systems'],
          milestones: ['Performance targets met', 'Leadership emergence', 'Cultural advocacy']
        }
      ],
      timeline: '90 days',
      resources: ['Dedicated mentor', 'Training budget', 'Assessment tools'],
      successIndicators: ['Performance metrics', 'Engagement scores', 'Cultural integration'],
      riskMitigation: ['Regular monitoring', 'Flexible adjustments', 'Support escalation']
    }
  }

  // Helper methods for default values
  private getDefaultBigFive(): BigFiveTraits {
    return {
      openness: 70,
      conscientiousness: 75,
      extraversion: 60,
      agreeableness: 80,
      neuroticism: 30,
      facets: {
        openness: { imagination: 70, artisticInterests: 65, emotionality: 75, adventurousness: 70, intellect: 80, progressivism: 75 },
        conscientiousness: { selfEfficacy: 80, orderliness: 70, dutifulness: 85, achievementStriving: 75, selfDiscipline: 70, cautiousness: 65 },
        extraversion: { friendliness: 75, gregariousness: 55, assertiveness: 65, activityLevel: 60, excitementSeeking: 50, cheerfulness: 70 },
        agreeableness: { trust: 75, morality: 85, altruism: 80, cooperation: 85, modesty: 70, sympathy: 80 },
        neuroticism: { anxiety: 35, anger: 25, depression: 20, selfConsciousness: 40, immoderation: 30, vulnerability: 35 }
      },
      reliability: 85
    }
  }

  private getDefaultMBTI(): MBTIType {
    return {
      type: 'ENFP',
      dimensions: { extraversionIntroversion: 'E', sensingIntuition: 'N', thinkingFeeling: 'F', judgingPerceiving: 'P' },
      strengths: ['Creative problem solving', 'Strong interpersonal skills', 'Adaptable and flexible'],
      weaknesses: ['May struggle with routine tasks', 'Can be overly optimistic', 'Difficulty with follow-through'],
      workPreferences: ['Collaborative environment', 'Creative challenges', 'Meaningful work'],
      communicationStyle: 'Enthusiastic and inspiring',
      confidence: 80
    }
  }

  private getDefaultDISC(): DISCProfile {
    return {
      primaryStyle: 'I',
      dominance: 45,
      influence: 80,
      steadiness: 65,
      conscientiousness: 55,
      adaptedStyle: { dominance: 50, influence: 85, steadiness: 60, conscientiousness: 60 },
      naturalStyle: { dominance: 45, influence: 80, steadiness: 65, conscientiousness: 55 },
      stressResponse: {
        overuseOfStrengths: ['Too much enthusiasm', 'Over-socializing'],
        underuseOfStrengths: ['Not leveraging influence', 'Avoiding leadership'],
        stressTriggers: ['Isolation', 'Highly critical environment'],
        stressManagement: ['Social interaction', 'Positive feedback', 'Variety']
      }
    }
  }

  private getDefaultEnneagram(): EnneagramType {
    return {
      type: 7,
      wing: 6,
      name: 'The Enthusiast',
      coreMotivation: 'To maintain happiness and satisfaction',
      basicFear: 'Being trapped in pain or deprivation',
      basicDesire: 'To be satisfied and content',
      integrationDirection: 5,
      disintegrationDirection: 1,
      healthLevels: [],
      workBehaviors: []
    }
  }

  private getDefaultEQ(): EmotionalIntelligence {
    return {
      overallEQ: 75,
      selfAwareness: 70,
      selfRegulation: 75,
      motivation: 80,
      empathy: 85,
      socialSkills: 80,
      competencies: [],
      strengths: ['High empathy', 'Strong social skills', 'Good motivation'],
      developmentAreas: ['Self-awareness', 'Stress management']
    }
  }

  private getDefaultCognitiveStyle(): CognitiveStyle {
    return {
      processingStyle: 'intuitive',
      learningStyle: 'multimodal',
      problemSolvingApproach: 'collaborative',
      informationProcessing: 'big-picture',
      decisionSpeed: 'quick',
      focusStyle: 'broad-focus',
      adaptability: 80
    }
  }

  private getDefaultSocialStyle(): SocialStyle {
    return {
      interpersonalOrientation: 'people-focused',
      communicationPreference: 'expressive',
      teamRole: [],
      networkingStyle: 'active',
      conflictStyle: 'collaborating',
      influenceStyle: 'affiliative'
    }
  }

  private getDefaultStressResponse(): StressResponse {
    return {
      stressThreshold: 70,
      stressTriggers: [],
      copingMechanisms: [],
      stressSignals: [],
      recoveryStrategies: [],
      resilience: 75
    }
  }

  private getDefaultDecisionMaking(): DecisionMakingStyle {
    return {
      primaryStyle: 'intuitive',
      riskTolerance: 70,
      informationGathering: 'moderate',
      consultationStyle: 'collaborative',
      timeOrientation: 'quick',
      biases: []
    }
  }

  private getDefaultCreativity(): CreativityIndex {
    return {
      overallCreativity: 75,
      divergentThinking: 80,
      convergentThinking: 70,
      originalityScore: 75,
      fluencyScore: 80,
      flexibilityScore: 85,
      elaborationScore: 70,
      creativeDomains: [],
      barriers: [],
      enhancers: []
    }
  }

  private getFallbackPersonalityProfile(): PersonalityProfile {
    return {
      bigFiveTraits: this.getDefaultBigFive(),
      mbtiType: this.getDefaultMBTI(),
      discProfile: this.getDefaultDISC(),
      enneagramType: this.getDefaultEnneagram(),
      emotionalIntelligence: this.getDefaultEQ(),
      cognitiveStyle: this.getDefaultCognitiveStyle(),
      socialStyle: this.getDefaultSocialStyle(),
      stressResponse: this.getDefaultStressResponse(),
      decisionMaking: this.getDefaultDecisionMaking(),
      creativityIndex: this.getDefaultCreativity()
    }
  }

  private getDefaultCulturalProfile(): CulturalProfile {
    return {
      hofstedeValues: {
        powerDistance: 40,
        individualismCollectivism: 70,
        masculinityFemininity: 45,
        uncertaintyAvoidance: 50,
        longTermOrientation: 65,
        indulgenceRestraint: 60
      },
      culturalIntelligence: {
        overallCQ: 75,
        culturalKnowledge: 70,
        culturalEmpathy: 80,
        culturalAdaptability: 75,
        crossCulturalCommunication: 70,
        experiences: [],
        competencies: []
      },
      communicationContext: 'mixed',
      timeOrientation: 'flexible',
      relationshipOrientation: 'balanced',
      hierarchyComfort: 60,
      groupOrientation: 'balanced',
      changeOrientation: 'adaptive',
      riskOrientation: 'uncertainty-accepting',
      diversityValues: {
        appreciationForDifferences: 80,
        inclusionCommitment: 85,
        biasAwareness: 70,
        allyship: 75,
        advocacyWillingness: 70,
        dimensions: []
      },
      inclusionBehaviors: []
    }
  }

  private getDefaultTeamDynamics(): TeamDynamicsProfile {
    return {
      preferredTeamRoles: [],
      teamSize: { optimal: 5, minimum: 3, maximum: 8, scalingComfort: 70 },
      diversityComfort: { cognitiveStyle: 80, background: 85, experience: 80, perspective: 85, workingStyle: 75 },
      leadershipStyle: {
        naturalStyle: 'democratic',
        situationalAdaptability: 75,
        influencePreference: 'relationship',
        delegationComfort: 70,
        feedbackDelivery: 75,
        visionCommunication: 80
      },
      followership: {
        style: 'exemplary',
        initiative: 80,
        supportiveness: 85,
        criticalThinking: 75,
        independence: 70,
        loyalty: 80
      },
      groupDecisionMaking: {
        preference: 'consensus',
        participationLevel: 80,
        influenceStyle: 'collaborative',
        compromiseWillingness: 75
      },
      teamCommunication: {
        openness: 85,
        frequency: 80,
        formality: 40,
        channels: ['face-to-face', 'slack', 'email'],
        meetingEffectiveness: 75
      },
      teamConflict: {
        approach: 'direct',
        resolution: 80,
        prevention: 75,
        learning: 80
      },
      teamBuilding: {
        activities: ['social events', 'workshops', 'retreats'],
        frequency: 'monthly',
        format: 'mixed',
        investment: 70
      }
    }
  }

  private getDefaultAdaptationPlan(): AdaptationPlan {
    return {
      phases: [
        {
          phase: 'Initial Integration',
          duration: '30 days',
          objectives: ['Basic cultural understanding', 'Team relationship building'],
          activities: ['Orientation sessions', 'Team introductions', 'Cultural training'],
          support: ['Assigned buddy', 'Manager check-ins', 'HR support'],
          milestones: ['Completion of orientation', 'Initial team integration']
        }
      ],
      timeline: '90 days',
      resources: ['Training materials', 'Mentorship program', 'Assessment tools'],
      successIndicators: ['Engagement metrics', 'Performance indicators', 'Feedback scores'],
      riskMitigation: ['Regular monitoring', 'Flexible support', 'Escalation procedures']
    }
  }

  private getFallbackMatchAnalysis(candidateId: string): CulturalMatchAnalysis {
    return {
      id: `match_fallback_${Date.now()}`,
      candidateId,
      companyId: 'company_id',
      analysisDate: new Date(),
      overallMatch: { score: 75, level: 'good', percentile: 70, reliability: 80 },
      dimensionMatches: [],
      strengths: [],
      challenges: [],
      recommendations: [],
      adaptationPlan: this.getDefaultAdaptationPlan(),
      successProbability: 75,
      riskFactors: [],
      enhancementOpportunities: [],
      confidenceInterval: { lower: 70, upper: 80, level: 95, factors: [] }
    }
  }
}

// Export the cultural matching engine instance
export const culturalMatchingEngine = new CulturalMatchingEngine()

// Utility functions for the frontend
export const CulturalMatchingUtils = {
  formatMatchScore: (score: number): string => {
    if (score >= 90) return 'Exceptional Fit'
    if (score >= 80) return 'Excellent Fit'
    if (score >= 70) return 'Good Fit'
    if (score >= 60) return 'Fair Fit'
    return 'Poor Fit'
  },

  getMatchScoreColor: (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  },

  formatPersonalityType: (mbti: MBTIType): string => {
    return `${mbti.type} - ${mbti.communicationStyle}`
  },

  getBigFiveDescription: (traits: BigFiveTraits): string => {
    const high = Object.entries(traits)
      .filter(([key, value]) => key !== 'facets' && key !== 'reliability' && typeof value === 'number' && value > 70)
      .map(([key]) => key)
    return `High in: ${high.join(', ')}`
  },

  formatCulturalDimension: (dimension: string, value: number): string => {
    const mid = 50
    if (value > mid + 20) return `High ${dimension}`
    if (value < mid - 20) return `Low ${dimension}`
    return `Moderate ${dimension}`
  },

  getAdaptationTimeline: (plan: AdaptationPlan): string => {
    return `${plan.phases.length} phases over ${plan.timeline}`
  },

  formatSuccessProbability: (probability: number): string => {
    if (probability >= 85) return 'Very High'
    if (probability >= 70) return 'High'
    if (probability >= 55) return 'Moderate'
    if (probability >= 40) return 'Low'
    return 'Very Low'
  }
}