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

export interface GlobalTalentProfile {
  id: string
  userId: string
  preferredCountries: string[]
  visaStatus: VisaStatus
  languageSkills: LanguageSkill[]
  culturalAdaptability: CulturalAssessment
  mobilityPreferences: MobilityPreferences
  relocationType: 'permanent' | 'temporary' | 'flexible' | 'remote_first'
  timeZonePreferences: TimeZonePreference[]
  salaryExpectations: SalaryExpectation[]
  benefits: BenefitPreferences
  familyConsiderations: FamilyConsiderations
  currentLocation: Location
  willingToRelocate: boolean
  relocateWithinDays: number
  legalCompliance: LegalCompliance
  taxOptimization: TaxOptimization
  createdAt: string
  updatedAt: string
}

export interface VisaStatus {
  currentCountry: string
  currentVisaType: string
  currentVisaExpiry?: string
  passportCountry: string
  passportExpiry: string
  hasWorkPermit: boolean
  workPermitCountries: string[]
  eligibleVisaTypes: VisaEligibility[]
  sponsorshipRequired: boolean
  sponsorshipHistory: SponsorshipRecord[]
  dualCitizenship?: string[]
  rightToWorkCountries: string[]
  immigration: ImmigrationStatus
}

export interface VisaEligibility {
  country: string
  visaType: string
  eligibilityScore: number
  requirements: string[]
  processingTime: string
  cost: number
  likelihood: 'high' | 'medium' | 'low'
  notes: string
}

export interface SponsorshipRecord {
  companyName: string
  country: string
  visaType: string
  startDate: string
  endDate?: string
  status: 'active' | 'completed' | 'cancelled'
  renewalCount: number
}

export interface ImmigrationStatus {
  prScore?: number // Points-based system score
  educationPoints?: number
  experiencePoints?: number
  languagePoints?: number
  agePoints?: number
  jobOfferPoints?: number
  adaptabilityPoints?: number
  eligiblePrograms: string[]
  applicationHistory: ImmigrationApplication[]
}

export interface ImmigrationApplication {
  program: string
  country: string
  submittedAt: string
  status: 'submitted' | 'in_progress' | 'approved' | 'rejected' | 'withdrawn'
  decisionDate?: string
  notes?: string
}

export interface LanguageSkill {
  language: string
  proficiency: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native'
  speakingLevel: number
  listeningLevel: number
  readingLevel: number
  writingLevel: number
  certifications: LanguageCertification[]
  businessProficiency: boolean
  technicalProficiency: boolean
  lastAssessed: string
}

export interface LanguageCertification {
  type: 'IELTS' | 'TOEFL' | 'CELPIP' | 'TEF' | 'TCF' | 'DELE' | 'DELF' | 'DALF' | 'Goethe' | 'other'
  score: string
  maxScore: string
  dateObtained: string
  expiryDate?: string
  certificateUrl?: string
}

export interface CulturalAssessment {
  culturalIntelligence: number // 0-100
  adaptabilityScore: number // 0-100
  communicationStyle: 'direct' | 'indirect' | 'mixed'
  workStylePreference: 'hierarchical' | 'collaborative' | 'independent' | 'flexible'
  timeOrientationPreference: 'monochronic' | 'polychronic' | 'flexible'
  culturalExperience: CulturalExperience[]
  personalityTraits: PersonalityTrait[]
  stressManagement: StressManagement
  learningAgility: LearningAgility
}

export interface CulturalExperience {
  country: string
  experienceType: 'lived' | 'worked' | 'studied' | 'visited'
  duration: string
  description: string
  challenges: string[]
  adaptations: string[]
  insights: string[]
}

export interface PersonalityTrait {
  trait: string
  score: number // 0-100
  description: string
  culturalRelevance: string[]
}

export interface StressManagement {
  copingStrategies: string[]
  resilienceScore: number // 0-100
  adaptationTimeframe: string
  supportNeeds: string[]
}

export interface LearningAgility {
  learningSpeed: number // 0-100
  opennessTtoChange: number // 0-100
  feedbackReceptiveness: number // 0-100
  selfAwareness: number // 0-100
}

export interface MobilityPreferences {
  preferredMobilityType: 'permanent' | 'temporary' | 'rotational' | 'project_based'
  maxAssignmentDuration: string
  minAssignmentDuration: string
  frequencyTolerance: 'low' | 'medium' | 'high'
  noticePerikod: number // days
  blackoutPeriods: DateRange[]
  preferredSeasons: string[]
  accommodationPreferences: AccommodationPreferences
  transportationNeeds: TransportationNeeds
  healthcareRequirements: HealthcareRequirements
}

export interface DateRange {
  startDate: string
  endDate: string
  reason: string
}

export interface AccommodationPreferences {
  type: 'hotel' | 'serviced_apartment' | 'rental' | 'corporate_housing' | 'flexible'
  budget: number
  currency: string
  location: 'city_center' | 'business_district' | 'suburban' | 'flexible'
  amenities: string[]
  accessibility: string[]
}

export interface TransportationNeeds {
  drivingLicense: boolean
  internationalLicense: boolean
  publicTransportPreference: boolean
  carAllowanceNeeded: boolean
  proximityToWork: 'walking' | 'cycling' | 'public_transport' | 'driving' | 'flexible'
}

export interface HealthcareRequirements {
  hasChronicConditions: boolean
  conditions?: string[]
  medications?: string[]
  specialistRequirements?: string[]
  insurancePreferences: InsurancePreference[]
  emergencyContacts: EmergencyContact[]
}

export interface InsurancePreference {
  type: 'global' | 'local' | 'hybrid'
  coverage: string[]
  budget: number
  currency: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email: string
  country: string
  isPrimary: boolean
}

export interface TimeZonePreference {
  timeZone: string
  preference: 'preferred' | 'acceptable' | 'avoid'
  workingHours: WorkingHours
  overlapRequirement: OverlapRequirement
}

export interface WorkingHours {
  start: string
  end: string
  flexible: boolean
  coreHours?: CoreHours
}

export interface CoreHours {
  start: string
  end: string
  timeZone: string
}

export interface OverlapRequirement {
  requiredOverlap: number // hours
  withRegions: string[]
  flexibility: 'strict' | 'moderate' | 'flexible'
}

export interface SalaryExpectation {
  country: string
  currency: string
  amount: number
  adjustmentFactor: number // for cost of living
  negotiable: boolean
  components: SalaryComponent[]
  benefits: BenefitExpectation[]
}

export interface SalaryComponent {
  type: 'base' | 'bonus' | 'commission' | 'equity' | 'allowance'
  amount: number
  frequency: 'monthly' | 'quarterly' | 'annually' | 'one_time'
  taxTreatment: 'taxable' | 'non_taxable' | 'partially_taxable'
}

export interface BenefitExpectation {
  type: string
  required: boolean
  description: string
  monetaryValue?: number
}

export interface BenefitPreferences {
  healthInsurance: boolean
  dentalInsurance: boolean
  visionInsurance: boolean
  lifeInsurance: boolean
  disabilityInsurance: boolean
  retirementPlan: boolean
  paidTimeOff: number // days
  sickLeave: number // days
  parentalLeave: boolean
  professionalDevelopment: boolean
  relocationAssistance: boolean
  languageTraining: boolean
  culturalTraining: boolean
  familySupport: boolean
  tuitionReimbursement: boolean
  flexibleWorkArrangements: boolean
  homeOfficeAllowance: boolean
  technologyAllowance: boolean
  gymMembership: boolean
  transportationAllowance: boolean
  mealAllowance: boolean
  childcareSupport: boolean
  elderCareSupport: boolean
  legalAssistance: boolean
  financialPlanning: boolean
  emergencyLeave: boolean
  sabbaticalLeave: boolean
  stockOptions: boolean
  profitSharing: boolean
  performanceBonuses: boolean
  signingBonus: boolean
  retentionBonus: boolean
  severancePackage: boolean
}

export interface FamilyConsiderations {
  hasFamily: boolean
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'common_law'
  dependents: Dependent[]
  spouseEmployment: SpouseEmployment
  childcare: ChildcareNeeds
  eldercare: EldercareNeeds
  petConsiderations: PetConsiderations
  housingNeeds: HousingNeeds
  educationNeeds: EducationNeeds
  healthcareNeeds: FamilyHealthcareNeeds
}

export interface Dependent {
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other'
  age: number
  specialNeeds: string[]
  citizenshipStatus: string
  visaStatus: string
  dependsOnVisa: boolean
}

export interface SpouseEmployment {
  isEmployed: boolean
  occupation?: string
  workAuthorization?: string
  salaryRange?: number
  canWorkRemotely?: boolean
  jobSearchSupport?: boolean
  careerTransitionSupport?: boolean
}

export interface ChildcareNeeds {
  hasChildren: boolean
  childrenAges?: number[]
  schoolingNeeds?: SchoolingNeed[]
  daycareNeeds?: DaycareNeed[]
  specialNeeds?: SpecialNeed[]
}

export interface SchoolingNeed {
  childAge: number
  schoolLevel: 'preschool' | 'elementary' | 'middle' | 'high' | 'university'
  schoolType: 'public' | 'private' | 'international' | 'homeschool'
  language: string
  curriculum: string
  specialPrograms: string[]
  budget: number
  currency: string
}

export interface DaycareNeed {
  childAge: number
  hoursPerDay: number
  daysPerWeek: number
  specialRequirements: string[]
  budget: number
  currency: string
}

export interface SpecialNeed {
  childAge: number
  needType: string
  description: string
  supportRequired: string[]
  budget: number
  currency: string
}

export interface EldercareNeeds {
  hasElderlyDependents: boolean
  dependents?: ElderlyDependent[]
  careType?: 'in_home' | 'day_care' | 'assisted_living' | 'nursing_home'
  budget?: number
  currency?: string
}

export interface ElderlyDependent {
  relationship: string
  age: number
  healthStatus: string
  careLevel: 'independent' | 'assisted' | 'skilled_nursing'
  specialNeeds: string[]
  citizenship: string
  visaStatus: string
}

export interface PetConsiderations {
  hasPets: boolean
  pets?: Pet[]
  quarantineRequirements?: QuarantineRequirement[]
  petInsurance?: boolean
  veterinaryCare?: boolean
  petFriendlyHousing?: boolean
}

export interface Pet {
  type: string
  breed: string
  age: number
  vaccinations: Vaccination[]
  microchipped: boolean
  healthCertificate: boolean
  specialNeeds: string[]
}

export interface Vaccination {
  type: string
  date: string
  expiryDate: string
  certificate: string
}

export interface QuarantineRequirement {
  country: string
  duration: number
  facilityType: 'government' | 'private' | 'home'
  cost: number
  currency: string
}

export interface HousingNeeds {
  propertyType: 'apartment' | 'house' | 'condo' | 'serviced_apartment' | 'flexible'
  bedrooms: number
  bathrooms: number
  minimumSize: number
  sizeUnit: 'sqft' | 'sqm'
  furnished: boolean
  amenities: string[]
  locationPreferences: LocationPreference[]
  budget: number
  currency: string
  leaseDuration: 'short_term' | 'medium_term' | 'long_term' | 'flexible'
}

export interface LocationPreference {
  type: 'neighborhood' | 'district' | 'proximity'
  value: string
  importance: 'required' | 'preferred' | 'nice_to_have'
  reason: string
}

export interface EducationNeeds {
  hasEducationNeeds: boolean
  needs?: EducationNeed[]
  budget?: number
  currency?: string
}

export interface EducationNeed {
  studentAge: number
  educationType: 'primary' | 'secondary' | 'higher' | 'vocational' | 'language'
  schoolType: 'public' | 'private' | 'international'
  curriculum: string
  language: string
  specialPrograms: string[]
  budget: number
  currency: string
}

export interface FamilyHealthcareNeeds {
  hasSpecialNeeds: boolean
  needs?: FamilyHealthNeed[]
  insurancePreferences?: FamilyInsurancePreference[]
}

export interface FamilyHealthNeed {
  familyMember: string
  needType: string
  description: string
  frequency: string
  specialist: string
  budget: number
  currency: string
}

export interface FamilyInsurancePreference {
  coverageType: 'individual' | 'family' | 'selective'
  provider: 'global' | 'local' | 'hybrid'
  budget: number
  currency: string
  deductible: number
  copayPreference: number
}

export interface Location {
  country: string
  city: string
  region: string
  postalCode: string
  coordinates: Coordinates
  timeZone: string
  currency: string
  costOfLiving: number
  qualityOfLife: number
  safetyIndex: number
  climateType: string
  languagesSpoken: string[]
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface LegalCompliance {
  backgroundCheckConsent: boolean
  drugTestingConsent: boolean
  rightToWorkVerification: boolean
  taxObligations: TaxObligation[]
  legalRestrictions: LegalRestriction[]
  criminalHistory: CriminalHistory
  professionalLicenses: ProfessionalLicense[]
  intellectualPropertyAgreements: IPAgreement[]
  nonCompeteAgreements: NonCompeteAgreement[]
  confidentialityAgreements: ConfidentialityAgreement[]
}

export interface TaxObligation {
  country: string
  taxResidency: boolean
  taxId: string
  filingRequirement: boolean
  treatyBenefits: string[]
  estimatedLiability: number
  currency: string
}

export interface LegalRestriction {
  type: string
  country: string
  description: string
  startDate: string
  endDate?: string
  appealable: boolean
}

export interface CriminalHistory {
  hasRecord: boolean
  records?: CriminalRecord[]
  consent: boolean
  jurisdictions: string[]
}

export interface CriminalRecord {
  jurisdiction: string
  offense: string
  date: string
  disposition: string
  sentence?: string
  expunged: boolean
  sealed: boolean
}

export interface ProfessionalLicense {
  type: string
  issuingAuthority: string
  licenseNumber: string
  issueDate: string
  expiryDate: string
  status: 'active' | 'expired' | 'suspended' | 'revoked'
  recognizedCountries: string[]
  renewalRequired: boolean
}

export interface IPAgreement {
  type: 'patent' | 'trademark' | 'copyright' | 'trade_secret'
  description: string
  jurisdiction: string
  startDate: string
  endDate?: string
  restrictions: string[]
  transferable: boolean
}

export interface NonCompeteAgreement {
  employer: string
  startDate: string
  endDate: string
  jurisdiction: string
  restrictions: string[]
  geographicScope: string
  industryScope: string[]
  enforceable: boolean
}

export interface ConfidentialityAgreement {
  party: string
  startDate: string
  endDate?: string
  jurisdiction: string
  scope: string[]
  restrictions: string[]
  survivability: boolean
}

export interface TaxOptimization {
  currentTaxResidency: string[]
  desiredTaxResidency?: string[]
  taxStrategy: 'minimize' | 'balance' | 'compliant'
  internationalTreaties: TreatyBenefit[]
  taxAdvisors: TaxAdvisor[]
  structuringOptions: StructuringOption[]
  estimatedSavings: number
  currency: string
  riskTolerance: 'low' | 'medium' | 'high'
}

export interface TreatyBenefit {
  fromCountry: string
  toCountry: string
  benefitType: string
  taxReduction: number
  conditions: string[]
  applicable: boolean
}

export interface TaxAdvisor {
  name: string
  country: string
  specialization: string[]
  contact: string
  relationship: 'current' | 'former' | 'recommended'
}

export interface StructuringOption {
  type: string
  description: string
  benefits: string[]
  risks: string[]
  cost: number
  currency: string
  complexity: 'low' | 'medium' | 'high'
  timeline: string
}

export interface GlobalOpportunity {
  id: string
  jobId: string
  companyId: string
  title: string
  description: string
  location: Location
  workModel: 'onsite' | 'remote' | 'hybrid'
  mobilityType: 'permanent' | 'temporary' | 'project_based' | 'rotational'
  duration?: string
  startDate: string
  endDate?: string
  urgency: 'low' | 'medium' | 'high' | 'urgent'
  requirements: OpportunityRequirement[]
  compensation: CompensationPackage
  benefits: BenefitPackage
  culturalFit: CulturalFitRequirement[]
  visaSponsorship: VisaSponsorship
  relocationSupport: RelocationSupport
  languageRequirements: LanguageRequirement[]
  timeZoneRequirements: TimeZoneRequirement[]
  travelRequirements: TravelRequirement[]
  complianceRequirements: ComplianceRequirement[]
  matchingCriteria: MatchingCriteria
  applicationDeadline: string
  interviewProcess: InterviewProcess
  onboardingProcess: OnboardingProcess
  successMetrics: SuccessMetric[]
  createdAt: string
  updatedAt: string
}

export interface OpportunityRequirement {
  type: 'skill' | 'experience' | 'certification' | 'language' | 'legal' | 'cultural'
  description: string
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
  validationCriteria: string[]
}

export interface CompensationPackage {
  baseSalary: number
  currency: string
  adjustmentFactor: number
  components: CompensationComponent[]
  performanceIncentives: PerformanceIncentive[]
  equityOptions: EquityOption
  bonusStructure: BonusStructure
  totalCompensation: number
  payFrequency: 'monthly' | 'bi_weekly' | 'weekly'
  paymentMethod: 'local' | 'home_country' | 'split'
  taxTreatment: TaxTreatment
}

export interface CompensationComponent {
  type: string
  amount: number
  frequency: string
  taxable: boolean
  description: string
}

export interface PerformanceIncentive {
  type: string
  criteria: string[]
  amount: number
  frequency: string
  cap?: number
}

export interface EquityOption {
  hasEquity: boolean
  type?: 'stock_options' | 'rsu' | 'espp'
  amount?: number
  vestingSchedule?: VestingSchedule
  strikePrice?: number
  exerciseWindow?: string
}

export interface VestingSchedule {
  totalPeriod: number
  cliffPeriod: number
  vestingFrequency: 'monthly' | 'quarterly' | 'annually'
  accelerationClauses: string[]
}

export interface BonusStructure {
  signingBonus: number
  annualBonus: number
  performanceBonus: number
  retentionBonus: number
  projectCompletionBonus: number
  relocationBonus: number
  repatriationBonus: number
}

export interface TaxTreatment {
  approach: 'tax_equalization' | 'tax_protection' | 'laissez_faire'
  grossUp: boolean
  taxableInHome: boolean
  taxableInHost: boolean
  treatyBenefits: string[]
  estimatedRate: number
}

export interface BenefitPackage {
  healthInsurance: HealthInsurance
  retirement: RetirementBenefit
  timeOff: TimeOffBenefit
  relocation: RelocationBenefit
  family: FamilyBenefit
  professional: ProfessionalBenefit
  lifestyle: LifestyleBenefit
  emergency: EmergencyBenefit
  totalValue: number
  currency: string
}

export interface HealthInsurance {
  coverage: string
  provider: string
  global: boolean
  deductible: number
  copay: number
  familyCoverage: boolean
  emergencyEvacuation: boolean
  mentalHealth: boolean
  dental: boolean
  vision: boolean
  prescription: boolean
  preventive: boolean
  maternity: boolean
  preExisting: boolean
}

export interface RetirementBenefit {
  type: 'pension' | '401k' | 'provident_fund' | 'none'
  employerContribution: number
  employeeContribution: number
  vesting: VestingSchedule
  portability: boolean
  internationalTransfer: boolean
}

export interface TimeOffBenefit {
  annualLeave: number
  sickLeave: number
  personalLeave: number
  parentalLeave: number
  bereavementLeave: number
  studyLeave: number
  sabbaticalLeave: number
  emergencyLeave: number
  publicHolidays: number
  homeCountryVisit: number
  carryOverPolicy: string
}

export interface RelocationBenefit {
  temporaryLiving: TemporaryLiving
  shipment: ShipmentBenefit
  travel: TravelBenefit
  homeFinding: HomeFinding
  schoolSearch: SchoolSearch
  spouseSupport: SpouseSupport
  languageTraining: LanguageTraining
  culturalTraining: CulturalTraining
  immigration: ImmigrationSupport
  repatriation: RepatriationBenefit
}

export interface TemporaryLiving {
  duration: number
  type: 'hotel' | 'serviced_apartment' | 'corporate_housing'
  budget: number
  currency: string
  familyIncluded: boolean
  utilities: boolean
  meals: boolean
  cleaning: boolean
  internet: boolean
  transportation: boolean
}

export interface ShipmentBenefit {
  airShipment: number
  seaShipment: number
  unit: 'kg' | 'lbs' | 'cubic_meters' | 'cubic_feet'
  storage: number
  insurance: boolean
  customsClearance: boolean
  unpackingService: boolean
  temporaryItems: boolean
  excessWeight: number
  excessWeightRate: number
}

export interface TravelBenefit {
  class: 'economy' | 'premium_economy' | 'business' | 'first'
  familyIncluded: boolean
  petTransport: boolean
  luggageAllowance: number
  stopoverAllowance: number
  flexibleBooking: boolean
  travelInsurance: boolean
  visaFees: boolean
  medicalExam: boolean
  vaccinations: boolean
}

export interface HomeFinding {
  duration: number
  trips: number
  accommodation: boolean
  transportation: boolean
  agent: boolean
  legal: boolean
  deposits: boolean
  utilities: boolean
  internet: boolean
  securityDeposit: number
  brokerFees: number
}

export interface SchoolSearch {
  duration: number
  consultant: boolean
  applicationFees: boolean
  interviews: boolean
  testing: boolean
  tuition: boolean
  enrollment: boolean
  uniforms: boolean
  books: boolean
  transportation: boolean
  activities: boolean
  meals: boolean
}

export interface SpouseSupport {
  jobSearchSupport: boolean
  workPermitSupport: boolean
  careerCoaching: boolean
  networking: boolean
  skillsAssessment: boolean
  certification: boolean
  languageTraining: boolean
  culturalOrientation: boolean
  mentoring: boolean
  allowance: number
  duration: number
}

export interface LanguageTraining {
  preAssignment: boolean
  onAssignment: boolean
  family: boolean
  intensity: 'basic' | 'intermediate' | 'advanced' | 'immersion'
  duration: number
  method: 'online' | 'classroom' | 'private' | 'hybrid'
  certification: boolean
  businessFocus: boolean
  culturalContent: boolean
  assessment: boolean
  budget: number
  currency: string
}

export interface CulturalTraining {
  preAssignment: boolean
  onAssignment: boolean
  family: boolean
  duration: number
  method: 'online' | 'classroom' | 'experiential' | 'hybrid'
  topics: string[]
  mentor: boolean
  networking: boolean
  assessment: boolean
  budget: number
  currency: string
}

export interface ImmigrationSupport {
  visaProcessing: boolean
  workPermit: boolean
  residencePermit: boolean
  familyVisas: boolean
  legalFees: boolean
  documentation: boolean
  translation: boolean
  notarization: boolean
  medicalExams: boolean
  background: boolean
  renewals: boolean
  permanentResidence: boolean
  citizenship: boolean
}

export interface RepatriationBenefit {
  shipment: ShipmentBenefit
  travel: TravelBenefit
  temporaryLiving: TemporaryLiving
  homeFinding: HomeFinding
  schoolSearch: SchoolSearch
  careerTransition: boolean
  taxSupport: boolean
  readjustment: boolean
  allowance: number
  duration: number
}

export interface FamilyBenefit {
  childcare: ChildcareBenefit
  eldercare: EldercareBenefit
  education: EducationBenefit
  healthcare: FamilyHealthcareBenefit
  family: FamilySpecificBenefit
}

export interface ChildcareBenefit {
  daycare: boolean
  nanny: boolean
  babysitting: boolean
  afterSchool: boolean
  holiday: boolean
  emergency: boolean
  budget: number
  currency: string
  ageLimit: number
  hoursLimit: number
}

export interface EldercareBenefit {
  homecare: boolean
  daycare: boolean
  respite: boolean
  emergency: boolean
  budget: number
  currency: string
  duration: number
}

export interface EducationBenefit {
  tuition: boolean
  books: boolean
  uniforms: boolean
  transportation: boolean
  meals: boolean
  activities: boolean
  tutoring: boolean
  specialNeeds: boolean
  university: boolean
  budget: number
  currency: string
  ageLimit: number
}

export interface FamilyHealthcareBenefit {
  medical: boolean
  dental: boolean
  vision: boolean
  mental: boolean
  prescription: boolean
  preventive: boolean
  maternity: boolean
  pediatric: boolean
  geriatric: boolean
  emergency: boolean
  evacuation: boolean
  budget: number
  currency: string
}

export interface FamilySpecificBenefit {
  reunion: boolean
  visits: boolean
  communication: boolean
  activities: boolean
  celebration: boolean
  budget: number
  currency: string
  frequency: string
}

export interface ProfessionalBenefit {
  training: boolean
  certification: boolean
  conference: boolean
  membership: boolean
  subscription: boolean
  networking: boolean
  mentoring: boolean
  coaching: boolean
  assessment: boolean
  planning: boolean
  budget: number
  currency: string
}

export interface LifestyleBenefit {
  gym: boolean
  sports: boolean
  dining: boolean
  entertainment: boolean
  transportation: boolean
  communication: boolean
  utilities: boolean
  housing: boolean
  maintenance: boolean
  security: boolean
  budget: number
  currency: string
}

export interface EmergencyBenefit {
  evacuation: boolean
  repatriation: boolean
  medical: boolean
  family: boolean
  communication: boolean
  transportation: boolean
  accommodation: boolean
  documentation: boolean
  legal: boolean
  financial: boolean
  budget: number
  currency: string
}

export interface CulturalFitRequirement {
  dimension: string
  importance: 'low' | 'medium' | 'high'
  description: string
  assessmentMethod: string
  weight: number
}

export interface VisaSponsorship {
  available: boolean
  types: string[]
  timeline: string
  requirements: string[]
  cost: number
  currency: string
  success: number
  process: string[]
  legal: boolean
  renewal: boolean
  family: boolean
  permanent: boolean
}

export interface RelocationSupport {
  available: boolean
  budget: number
  currency: string
  services: string[]
  timeline: string
  family: boolean
  pets: boolean
  storage: boolean
  insurance: boolean
  tax: boolean
  legal: boolean
  cultural: boolean
  language: boolean
}

export interface LanguageRequirement {
  language: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native'
  importance: 'required' | 'preferred' | 'nice_to_have'
  usage: 'daily' | 'frequent' | 'occasional' | 'rare'
  context: string[]
  assessment: boolean
  training: boolean
  weight: number
}

export interface TimeZoneRequirement {
  timeZone: string
  overlap: number
  flexibility: 'none' | 'low' | 'medium' | 'high'
  core: CoreHours
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface TravelRequirement {
  frequency: 'none' | 'rare' | 'occasional' | 'frequent' | 'constant'
  destinations: string[]
  duration: string
  purpose: string[]
  class: 'economy' | 'premium_economy' | 'business' | 'first'
  accommodation: string
  reimbursement: boolean
  family: boolean
  visa: boolean
  health: boolean
  safety: boolean
  weight: number
}

export interface ComplianceRequirement {
  type: string
  description: string
  mandatory: boolean
  deadline: string
  authority: string
  consequence: string
  support: boolean
  cost: number
  currency: string
  weight: number
}

export interface MatchingCriteria {
  skills: SkillCriteria[]
  experience: ExperienceCriteria[]
  education: EducationCriteria[]
  location: LocationCriteria[]
  visa: VisaCriteria[]
  language: LanguageCriteria[]
  cultural: CulturalCriteria[]
  availability: AvailabilityCriteria[]
  compensation: CompensationCriteria[]
  benefits: BenefitCriteria[]
  family: FamilyCriteria[]
  total: number
  threshold: number
}

export interface SkillCriteria {
  skill: string
  level: number
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
  assessment: boolean
}

export interface ExperienceCriteria {
  type: string
  years: number
  industry: string[]
  role: string[]
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface EducationCriteria {
  level: string
  field: string[]
  institution: string[]
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface LocationCriteria {
  countries: string[]
  cities: string[]
  regions: string[]
  remote: boolean
  relocation: boolean
  travel: boolean
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface VisaCriteria {
  types: string[]
  sponsorship: boolean
  timeline: string
  success: number
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface LanguageCriteria {
  languages: string[]
  levels: string[]
  usage: string[]
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface CulturalCriteria {
  dimensions: string[]
  scores: number[]
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface AvailabilityCriteria {
  startDate: string
  endDate?: string
  notice: number
  flexibility: 'none' | 'low' | 'medium' | 'high'
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface CompensationCriteria {
  minimum: number
  maximum: number
  currency: string
  components: string[]
  negotiable: boolean
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface BenefitCriteria {
  benefits: string[]
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface FamilyCriteria {
  support: string[]
  importance: 'required' | 'preferred' | 'nice_to_have'
  weight: number
}

export interface InterviewProcess {
  stages: InterviewStage[]
  totalDuration: string
  remote: boolean
  timezone: string
  language: string
  cultural: boolean
  assessment: boolean
  reference: boolean
  background: boolean
  medical: boolean
  security: boolean
}

export interface InterviewStage {
  stage: number
  type: 'phone' | 'video' | 'in_person' | 'assessment' | 'presentation'
  duration: string
  participants: string[]
  focus: string[]
  language: string
  preparation: string[]
  deliverables: string[]
}

export interface OnboardingProcess {
  duration: string
  remote: boolean
  components: OnboardingComponent[]
  timeline: OnboardingTimeline[]
  support: OnboardingSupport[]
  assessment: OnboardingAssessment[]
  integration: OnboardingIntegration[]
}

export interface OnboardingComponent {
  type: string
  description: string
  duration: string
  mandatory: boolean
  remote: boolean
  language: string
  materials: string[]
  assessment: boolean
}

export interface OnboardingTimeline {
  week: number
  focus: string
  activities: string[]
  deliverables: string[]
  assessment: boolean
}

export interface OnboardingSupport {
  type: string
  provider: string
  duration: string
  contact: string
  availability: string
  language: string
}

export interface OnboardingAssessment {
  type: string
  timing: string
  criteria: string[]
  feedback: boolean
  improvement: boolean
}

export interface OnboardingIntegration {
  type: string
  activities: string[]
  participants: string[]
  frequency: string
  duration: string
}

export interface SuccessMetric {
  metric: string
  target: number
  timeframe: string
  measurement: string
  frequency: string
  responsibility: string
  consequence: string
}

export interface TalentMatchResult {
  id: string
  talentId: string
  opportunityId: string
  overallScore: number
  detailedScores: DetailedScore[]
  recommendations: Recommendation[]
  gaps: Gap[]
  strengths: Strength[]
  risks: Risk[]
  timeline: MatchTimeline
  confidence: number
  reasoning: string
  nextSteps: NextStep[]
  createdAt: string
  updatedAt: string
}

export interface DetailedScore {
  category: string
  score: number
  weight: number
  contribution: number
  details: ScoreDetail[]
}

export interface ScoreDetail {
  factor: string
  score: number
  weight: number
  reasoning: string
  evidence: string[]
}

export interface Recommendation {
  type: 'improvement' | 'preparation' | 'negotiation' | 'support'
  priority: 'high' | 'medium' | 'low'
  description: string
  actionItems: string[]
  resources: string[]
  timeline: string
  owner: string
  impact: string
}

export interface Gap {
  category: string
  description: string
  severity: 'critical' | 'major' | 'minor'
  bridgeable: boolean
  solutions: string[]
  timeline: string
  cost: number
  currency: string
  impact: string
}

export interface Strength {
  category: string
  description: string
  advantage: string
  leverage: string[]
  differentiator: boolean
  value: string
}

export interface Risk {
  category: string
  description: string
  probability: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  mitigation: string[]
  monitoring: string[]
  contingency: string[]
  owner: string
}

export interface MatchTimeline {
  phases: MatchPhase[]
  totalDuration: string
  criticalPath: string[]
  dependencies: string[]
  milestones: Milestone[]
}

export interface MatchPhase {
  phase: string
  description: string
  duration: string
  activities: string[]
  deliverables: string[]
  dependencies: string[]
  risks: string[]
  owner: string
}

export interface Milestone {
  milestone: string
  description: string
  date: string
  criteria: string[]
  deliverables: string[]
  approval: boolean
  owner: string
}

export interface NextStep {
  step: string
  description: string
  priority: 'high' | 'medium' | 'low'
  owner: string
  dueDate: string
  dependencies: string[]
  deliverables: string[]
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
}

export interface MobilityAssessment {
  id: string
  userId: string
  assessmentType: 'initial' | 'periodic' | 'opportunity_specific' | 'post_assignment'
  scope: 'full' | 'partial' | 'update'
  components: AssessmentComponent[]
  results: AssessmentResult[]
  recommendations: AssessmentRecommendation[]
  score: number
  readiness: 'ready' | 'partially_ready' | 'not_ready'
  timeline: string
  nextAssessment: string
  createdAt: string
  completedAt?: string
  validUntil: string
}

export interface AssessmentComponent {
  component: string
  weight: number
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  score?: number
  notes?: string
  assessor?: string
  completedAt?: string
}

export interface AssessmentResult {
  component: string
  score: number
  maxScore: number
  percentile: number
  level: 'excellent' | 'good' | 'fair' | 'poor'
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  evidence: string[]
  benchmarks: Benchmark[]
}

export interface Benchmark {
  type: string
  value: number
  source: string
  date: string
  context: string
}

export interface AssessmentRecommendation {
  type: 'development' | 'preparation' | 'support' | 'opportunity'
  priority: 'high' | 'medium' | 'low'
  description: string
  rationale: string
  actions: string[]
  resources: string[]
  timeline: string
  cost: number
  currency: string
  impact: string
  success: string[]
}

export interface MobilityPlan {
  id: string
  userId: string
  planType: 'career' | 'assignment' | 'opportunity' | 'development'
  objectives: PlanObjective[]
  timeline: PlanTimeline
  milestones: PlanMilestone[]
  resources: PlanResource[]
  budget: PlanBudget
  risks: PlanRisk[]
  success: PlanSuccess[]
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  progress: number
  createdAt: string
  updatedAt: string
  reviewDate: string
  completionDate?: string
}

export interface PlanObjective {
  objective: string
  description: string
  priority: 'high' | 'medium' | 'low'
  measurable: boolean
  metrics: string[]
  targets: string[]
  deadline: string
  dependencies: string[]
  owner: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
}

export interface PlanTimeline {
  phases: PlanPhase[]
  totalDuration: string
  startDate: string
  endDate: string
  buffer: string
  flexibility: 'none' | 'low' | 'medium' | 'high'
}

export interface PlanPhase {
  phase: string
  description: string
  startDate: string
  endDate: string
  activities: string[]
  deliverables: string[]
  dependencies: string[]
  resources: string[]
  budget: number
  currency: string
  risks: string[]
  owner: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
}

export interface PlanMilestone {
  milestone: string
  description: string
  date: string
  criteria: string[]
  deliverables: string[]
  approval: boolean
  approver: string
  dependencies: string[]
  risks: string[]
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
}

export interface PlanResource {
  type: 'human' | 'financial' | 'material' | 'information' | 'technology'
  description: string
  quantity: number
  unit: string
  availability: string
  cost: number
  currency: string
  source: string
  alternatives: string[]
  risks: string[]
}

export interface PlanBudget {
  totalBudget: number
  currency: string
  categories: BudgetCategory[]
  contingency: number
  approval: boolean
  approver: string
  tracking: boolean
  reporting: string
}

export interface BudgetCategory {
  category: string
  budget: number
  spent: number
  remaining: number
  forecast: number
  variance: number
  risks: string[]
  optimization: string[]
}

export interface PlanRisk {
  risk: string
  description: string
  probability: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  category: string
  triggers: string[]
  mitigation: string[]
  contingency: string[]
  monitoring: string[]
  owner: string
  status: 'active' | 'mitigated' | 'realized' | 'retired'
}

export interface PlanSuccess {
  metric: string
  target: number
  current: number
  unit: string
  measurement: string
  frequency: string
  responsibility: string
  trend: 'improving' | 'stable' | 'declining'
  forecast: number
  variance: number
  actions: string[]
}

export class GlobalTalentMobilitySystem {
  private openai: OpenAI
  private supabase: any

  constructor() {
    this.openai = openai
    this.supabase = supabase
  }

  // Profile Management
  async createTalentProfile(
    userId: string,
    profileData: Omit<GlobalTalentProfile, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<GlobalTalentProfile> {
    try {
      const profileId = this.generateId()
      const now = new Date().toISOString()

      const profile: GlobalTalentProfile = {
        ...profileData,
        id: profileId,
        userId,
        createdAt: now,
        updatedAt: now
      }

      await this.supabase
        .from('global_talent_profiles')
        .insert({
          id: profile.id,
          user_id: profile.userId,
          preferred_countries: profile.preferredCountries,
          visa_status: profile.visaStatus,
          language_skills: profile.languageSkills,
          cultural_adaptability: profile.culturalAdaptability,
          mobility_preferences: profile.mobilityPreferences,
          relocation_type: profile.relocationType,
          timezone_preferences: profile.timeZonePreferences,
          salary_expectations: profile.salaryExpectations,
          benefits: profile.benefits,
          family_considerations: profile.familyConsiderations,
          current_location: profile.currentLocation,
          willing_to_relocate: profile.willingToRelocate,
          relocate_within_days: profile.relocateWithinDays,
          legal_compliance: profile.legalCompliance,
          tax_optimization: profile.taxOptimization,
          created_at: profile.createdAt,
          updated_at: profile.updatedAt
        })

      return profile
    } catch (error) {
      console.error('Failed to create talent profile:', error)
      throw error
    }
  }

  async updateTalentProfile(
    profileId: string,
    updates: Partial<GlobalTalentProfile>
  ): Promise<GlobalTalentProfile> {
    try {
      const now = new Date().toISOString()

      const { data, error } = await this.supabase
        .from('global_talent_profiles')
        .update({
          ...updates,
          updated_at: now
        })
        .eq('id', profileId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to update talent profile:', error)
      throw error
    }
  }

  async getTalentProfile(profileId: string): Promise<GlobalTalentProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('global_talent_profiles')
        .select('*')
        .eq('id', profileId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get talent profile:', error)
      return null
    }
  }

  // Opportunity Management
  async createGlobalOpportunity(
    opportunityData: Omit<GlobalOpportunity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<GlobalOpportunity> {
    try {
      const opportunityId = this.generateId()
      const now = new Date().toISOString()

      const opportunity: GlobalOpportunity = {
        ...opportunityData,
        id: opportunityId,
        createdAt: now,
        updatedAt: now
      }

      await this.supabase
        .from('global_opportunities')
        .insert({
          id: opportunity.id,
          job_id: opportunity.jobId,
          company_id: opportunity.companyId,
          title: opportunity.title,
          description: opportunity.description,
          location: opportunity.location,
          work_model: opportunity.workModel,
          mobility_type: opportunity.mobilityType,
          duration: opportunity.duration,
          start_date: opportunity.startDate,
          end_date: opportunity.endDate,
          urgency: opportunity.urgency,
          requirements: opportunity.requirements,
          compensation: opportunity.compensation,
          benefits: opportunity.benefits,
          cultural_fit: opportunity.culturalFit,
          visa_sponsorship: opportunity.visaSponsorship,
          relocation_support: opportunity.relocationSupport,
          language_requirements: opportunity.languageRequirements,
          timezone_requirements: opportunity.timeZoneRequirements,
          travel_requirements: opportunity.travelRequirements,
          compliance_requirements: opportunity.complianceRequirements,
          matching_criteria: opportunity.matchingCriteria,
          application_deadline: opportunity.applicationDeadline,
          interview_process: opportunity.interviewProcess,
          onboarding_process: opportunity.onboardingProcess,
          success_metrics: opportunity.successMetrics,
          created_at: opportunity.createdAt,
          updated_at: opportunity.updatedAt
        })

      return opportunity
    } catch (error) {
      console.error('Failed to create global opportunity:', error)
      throw error
    }
  }

  // Talent Matching
  async matchTalentToOpportunity(
    talentId: string,
    opportunityId: string
  ): Promise<TalentMatchResult> {
    try {
      const [talent, opportunity] = await Promise.all([
        this.getTalentProfile(talentId),
        this.getGlobalOpportunity(opportunityId)
      ])

      if (!talent || !opportunity) {
        throw new Error('Talent profile or opportunity not found')
      }

      const matchResult = await this.calculateMatch(talent, opportunity)
      
      // Store match result
      await this.supabase
        .from('talent_matches')
        .insert({
          id: matchResult.id,
          talent_id: matchResult.talentId,
          opportunity_id: matchResult.opportunityId,
          overall_score: matchResult.overallScore,
          detailed_scores: matchResult.detailedScores,
          recommendations: matchResult.recommendations,
          gaps: matchResult.gaps,
          strengths: matchResult.strengths,
          risks: matchResult.risks,
          timeline: matchResult.timeline,
          confidence: matchResult.confidence,
          reasoning: matchResult.reasoning,
          next_steps: matchResult.nextSteps,
          created_at: matchResult.createdAt,
          updated_at: matchResult.updatedAt
        })

      return matchResult
    } catch (error) {
      console.error('Failed to match talent to opportunity:', error)
      throw error
    }
  }

  private async calculateMatch(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity
  ): Promise<TalentMatchResult> {
    const matchId = this.generateId()
    const now = new Date().toISOString()

    // Calculate detailed scores for each matching criterion
    const detailedScores: DetailedScore[] = []

    // Skills matching
    const skillsScore = await this.calculateSkillsMatch(talent, opportunity)
    detailedScores.push({
      category: 'skills',
      score: skillsScore.score,
      weight: skillsScore.weight,
      contribution: skillsScore.score * skillsScore.weight,
      details: skillsScore.details
    })

    // Location/mobility matching
    const locationScore = await this.calculateLocationMatch(talent, opportunity)
    detailedScores.push({
      category: 'location',
      score: locationScore.score,
      weight: locationScore.weight,
      contribution: locationScore.score * locationScore.weight,
      details: locationScore.details
    })

    // Visa/legal matching
    const visaScore = await this.calculateVisaMatch(talent, opportunity)
    detailedScores.push({
      category: 'visa',
      score: visaScore.score,
      weight: visaScore.weight,
      contribution: visaScore.score * visaScore.weight,
      details: visaScore.details
    })

    // Language matching
    const languageScore = await this.calculateLanguageMatch(talent, opportunity)
    detailedScores.push({
      category: 'language',
      score: languageScore.score,
      weight: languageScore.weight,
      contribution: languageScore.score * languageScore.weight,
      details: languageScore.details
    })

    // Cultural fit matching
    const culturalScore = await this.calculateCulturalMatch(talent, opportunity)
    detailedScores.push({
      category: 'cultural',
      score: culturalScore.score,
      weight: culturalScore.weight,
      contribution: culturalScore.score * culturalScore.weight,
      details: culturalScore.details
    })

    // Compensation matching
    const compensationScore = await this.calculateCompensationMatch(talent, opportunity)
    detailedScores.push({
      category: 'compensation',
      score: compensationScore.score,
      weight: compensationScore.weight,
      contribution: compensationScore.score * compensationScore.weight,
      details: compensationScore.details
    })

    // Family considerations matching
    const familyScore = await this.calculateFamilyMatch(talent, opportunity)
    detailedScores.push({
      category: 'family',
      score: familyScore.score,
      weight: familyScore.weight,
      contribution: familyScore.score * familyScore.weight,
      details: familyScore.details
    })

    // Calculate overall score
    const totalWeight = detailedScores.reduce((sum, score) => sum + score.weight, 0)
    const overallScore = detailedScores.reduce((sum, score) => sum + score.contribution, 0) / totalWeight

    // Generate recommendations, gaps, strengths, and risks
    const recommendations = await this.generateRecommendations(talent, opportunity, detailedScores)
    const gaps = await this.identifyGaps(talent, opportunity, detailedScores)
    const strengths = await this.identifyStrengths(talent, opportunity, detailedScores)
    const risks = await this.identifyRisks(talent, opportunity, detailedScores)

    // Generate timeline
    const timeline = await this.generateMatchTimeline(talent, opportunity, gaps)

    // Calculate confidence
    const confidence = this.calculateConfidence(detailedScores, gaps, risks)

    // Generate AI reasoning
    const reasoning = await this.generateMatchReasoning(talent, opportunity, detailedScores, overallScore)

    // Generate next steps
    const nextSteps = await this.generateNextSteps(talent, opportunity, recommendations, gaps)

    return {
      id: matchId,
      talentId: talent.id,
      opportunityId: opportunity.id,
      overallScore: Math.round(overallScore * 100) / 100,
      detailedScores,
      recommendations,
      gaps,
      strengths,
      risks,
      timeline,
      confidence: Math.round(confidence * 100) / 100,
      reasoning,
      nextSteps,
      createdAt: now,
      updatedAt: now
    }
  }

  private async calculateSkillsMatch(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity
  ): Promise<{ score: number; weight: number; details: ScoreDetail[] }> {
    // Implementation would analyze skill requirements vs talent skills
    // For now, return a placeholder
    return {
      score: 0.85,
      weight: 0.25,
      details: [
        {
          factor: 'Technical skills alignment',
          score: 0.9,
          weight: 0.6,
          reasoning: 'Strong match for required technical skills',
          evidence: ['React expertise', 'Node.js experience', 'Cloud platforms']
        },
        {
          factor: 'Experience level',
          score: 0.8,
          weight: 0.4,
          reasoning: 'Good experience match with some growth potential',
          evidence: ['5 years relevant experience', 'Leadership experience']
        }
      ]
    }
  }

  private async calculateLocationMatch(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity
  ): Promise<{ score: number; weight: number; details: ScoreDetail[] }> {
    const locationScore = talent.preferredCountries.includes(opportunity.location.country) ? 1.0 : 0.5
    const mobilityScore = talent.willingToRelocate ? 1.0 : 0.3
    const timezoneScore = this.calculateTimezoneCompatibility(talent, opportunity)
    
    const overallScore = (locationScore * 0.4) + (mobilityScore * 0.4) + (timezoneScore * 0.2)

    return {
      score: overallScore,
      weight: 0.2,
      details: [
        {
          factor: 'Location preference',
          score: locationScore,
          weight: 0.4,
          reasoning: talent.preferredCountries.includes(opportunity.location.country) ? 
            'Matches preferred countries' : 'Not in preferred countries but manageable',
          evidence: [`Preferred countries: ${talent.preferredCountries.join(', ')}`, `Opportunity location: ${opportunity.location.country}`]
        },
        {
          factor: 'Relocation willingness',
          score: mobilityScore,
          weight: 0.4,
          reasoning: talent.willingToRelocate ? 'Willing to relocate' : 'Limited relocation willingness',
          evidence: [`Willing to relocate: ${talent.willingToRelocate}`, `Notice period: ${talent.relocateWithinDays} days`]
        },
        {
          factor: 'Timezone compatibility',
          score: timezoneScore,
          weight: 0.2,
          reasoning: 'Timezone alignment for collaboration',
          evidence: [`Current timezone: ${talent.currentLocation.timeZone}`, `Opportunity timezone: ${opportunity.location.timeZone}`]
        }
      ]
    }
  }

  private calculateTimezoneCompatibility(talent: GlobalTalentProfile, opportunity: GlobalOpportunity): number {
    // Simplified timezone compatibility calculation
    const talentTZ = talent.currentLocation.timeZone
    const opportunityTZ = opportunity.location.timeZone
    
    // This would be more sophisticated in a real implementation
    if (talentTZ === opportunityTZ) return 1.0
    
    // Calculate time difference and overlap potential
    const timeDiff = Math.abs(this.getTimezoneOffset(talentTZ) - this.getTimezoneOffset(opportunityTZ))
    if (timeDiff <= 3) return 0.9
    if (timeDiff <= 6) return 0.7
    if (timeDiff <= 9) return 0.5
    return 0.3
  }

  private getTimezoneOffset(timezone: string): number {
    // Simplified timezone offset calculation
    const offsets: { [key: string]: number } = {
      'America/New_York': -5,
      'America/Los_Angeles': -8,
      'Europe/London': 0,
      'Europe/Berlin': 1,
      'Asia/Tokyo': 9,
      'Asia/Shanghai': 8,
      'Australia/Sydney': 10
    }
    return offsets[timezone] || 0
  }

  private async calculateVisaMatch(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity
  ): Promise<{ score: number; weight: number; details: ScoreDetail[] }> {
    const hasRightToWork = talent.visaStatus.rightToWorkCountries.includes(opportunity.location.country)
    const sponsorshipAvailable = opportunity.visaSponsorship.available
    const sponsorshipNeeded = talent.visaStatus.sponsorshipRequired
    
    let visaScore = 0
    if (hasRightToWork) {
      visaScore = 1.0
    } else if (sponsorshipAvailable && sponsorshipNeeded) {
      visaScore = 0.7
    } else if (sponsorshipAvailable) {
      visaScore = 0.8
    } else {
      visaScore = 0.2
    }

    return {
      score: visaScore,
      weight: 0.15,
      details: [
        {
          factor: 'Right to work',
          score: hasRightToWork ? 1.0 : 0.0,
          weight: 0.6,
          reasoning: hasRightToWork ? 'Has right to work in target country' : 'No right to work, requires visa',
          evidence: [`Right to work countries: ${talent.visaStatus.rightToWorkCountries.join(', ')}`, `Opportunity country: ${opportunity.location.country}`]
        },
        {
          factor: 'Visa sponsorship',
          score: sponsorshipAvailable ? 1.0 : 0.0,
          weight: 0.4,
          reasoning: sponsorshipAvailable ? 'Employer offers visa sponsorship' : 'No visa sponsorship available',
          evidence: [`Sponsorship available: ${sponsorshipAvailable}`, `Sponsorship types: ${opportunity.visaSponsorship.types?.join(', ') || 'None'}`]
        }
      ]
    }
  }

  private async calculateLanguageMatch(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity
  ): Promise<{ score: number; weight: number; details: ScoreDetail[] }> {
    const requiredLanguages = opportunity.languageRequirements
    const talentLanguages = talent.languageSkills

    let totalScore = 0
    let totalWeight = 0
    const details: ScoreDetail[] = []

    for (const requirement of requiredLanguages) {
      const talentSkill = talentLanguages.find(skill => skill.language === requirement.language)
      const weight = requirement.importance === 'required' ? 1.0 : requirement.importance === 'preferred' ? 0.7 : 0.3
      
      let score = 0
      if (talentSkill) {
        const levelScore = this.compareLevels(talentSkill.proficiency, requirement.level)
        score = levelScore
      }

      totalScore += score * weight
      totalWeight += weight

      details.push({
        factor: `${requirement.language} proficiency`,
        score,
        weight,
        reasoning: talentSkill ? 
          `${talentSkill.proficiency} level vs required ${requirement.level}` : 
          `Language not found in talent profile`,
        evidence: talentSkill ? 
          [`Current level: ${talentSkill.proficiency}`, `Required level: ${requirement.level}`] : 
          [`Required: ${requirement.language} (${requirement.level})`, 'Not in talent profile']
      })
    }

    return {
      score: totalWeight > 0 ? totalScore / totalWeight : 0,
      weight: 0.1,
      details
    }
  }

  private compareLevels(talentLevel: string, requiredLevel: string): number {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native']
    const talentIndex = levels.indexOf(talentLevel)
    const requiredIndex = levels.indexOf(requiredLevel)
    
    if (talentIndex >= requiredIndex) return 1.0
    if (talentIndex === requiredIndex - 1) return 0.8
    if (talentIndex === requiredIndex - 2) return 0.6
    return 0.3
  }

  private async calculateCulturalMatch(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity
  ): Promise<{ score: number; weight: number; details: ScoreDetail[] }> {
    const culturalFit = opportunity.culturalFit
    const talentCulture = talent.culturalAdaptability

    let totalScore = 0
    let totalWeight = 0
    const details: ScoreDetail[] = []

    for (const requirement of culturalFit) {
      const weight = requirement.importance === 'high' ? 1.0 : requirement.importance === 'medium' ? 0.7 : 0.3
      
      // Simplified cultural scoring - would be more sophisticated in production
      const score = talentCulture.culturalIntelligence / 100
      
      totalScore += score * weight
      totalWeight += weight

      details.push({
        factor: requirement.dimension,
        score,
        weight,
        reasoning: `Cultural intelligence score: ${talentCulture.culturalIntelligence}/100`,
        evidence: [`Cultural adaptability: ${talentCulture.adaptabilityScore}/100`, `Work style: ${talentCulture.workStylePreference}`]
      })
    }

    return {
      score: totalWeight > 0 ? totalScore / totalWeight : 0.8,
      weight: 0.1,
      details
    }
  }

  private async calculateCompensationMatch(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity
  ): Promise<{ score: number; weight: number; details: ScoreDetail[] }> {
    const opportunityCountry = opportunity.location.country
    const talentExpectation = talent.salaryExpectations.find(exp => exp.country === opportunityCountry)
    
    if (!talentExpectation) {
      return {
        score: 0.5,
        weight: 0.15,
        details: [
          {
            factor: 'Salary expectation',
            score: 0.5,
            weight: 1.0,
            reasoning: 'No salary expectation set for this country',
            evidence: [`Available expectations: ${talent.salaryExpectations.map(exp => exp.country).join(', ')}`, `Opportunity country: ${opportunityCountry}`]
          }
        ]
      }
    }

    const offered = opportunity.compensation.baseSalary
    const expected = talentExpectation.amount
    const ratio = offered / expected

    let score = 0
    if (ratio >= 1.1) score = 1.0
    else if (ratio >= 1.0) score = 0.9
    else if (ratio >= 0.9) score = 0.8
    else if (ratio >= 0.8) score = 0.6
    else if (ratio >= 0.7) score = 0.4
    else score = 0.2

    return {
      score,
      weight: 0.15,
      details: [
        {
          factor: 'Base salary alignment',
          score,
          weight: 1.0,
          reasoning: `Offered ${offered} ${opportunity.compensation.currency} vs expected ${expected} ${talentExpectation.currency}`,
          evidence: [`Offered: ${offered} ${opportunity.compensation.currency}`, `Expected: ${expected} ${talentExpectation.currency}`, `Ratio: ${ratio.toFixed(2)}`]
        }
      ]
    }
  }

  private async calculateFamilyMatch(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity
  ): Promise<{ score: number; weight: number; details: ScoreDetail[] }> {
    if (!talent.familyConsiderations.hasFamily) {
      return {
        score: 1.0,
        weight: 0.05,
        details: [
          {
            factor: 'Family considerations',
            score: 1.0,
            weight: 1.0,
            reasoning: 'No family considerations needed',
            evidence: ['Single candidate with no dependents']
          }
        ]
      }
    }

    const familySupport = opportunity.benefits.family
    const relocationSupport = opportunity.benefits.relocation
    
    let score = 0.5 // Base score for having family considerations
    
    if (familySupport && relocationSupport) {
      score = 0.9
    } else if (familySupport || relocationSupport) {
      score = 0.7
    }

    return {
      score,
      weight: 0.1,
      details: [
        {
          factor: 'Family support',
          score,
          weight: 1.0,
          reasoning: 'Family support and relocation benefits assessment',
          evidence: [`Family support available: ${!!familySupport}`, `Relocation support: ${!!relocationSupport}`]
        }
      ]
    }
  }

  private async generateRecommendations(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity,
    scores: DetailedScore[]
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []

    // Analyze low scores and generate recommendations
    for (const score of scores) {
      if (score.score < 0.7) {
        switch (score.category) {
          case 'language':
            recommendations.push({
              type: 'improvement',
              priority: 'high',
              description: 'Improve language skills before application',
              actionItems: [
                'Take language assessment test',
                'Enroll in business language course',
                'Practice with native speakers'
              ],
              resources: ['Language learning apps', 'Business language courses', 'Conversation partners'],
              timeline: '3-6 months',
              owner: 'talent',
              impact: 'Significantly improves matching score and job performance'
            })
            break
          case 'visa':
            recommendations.push({
              type: 'preparation',
              priority: 'high',
              description: 'Prepare visa application documentation',
              actionItems: [
                'Gather required documents',
                'Consult immigration lawyer',
                'Prepare for visa interview'
              ],
              resources: ['Immigration lawyer', 'Visa application guides', 'Document preparation services'],
              timeline: '2-4 months',
              owner: 'talent',
              impact: 'Essential for legal work authorization'
            })
            break
          case 'cultural':
            recommendations.push({
              type: 'preparation',
              priority: 'medium',
              description: 'Cultural preparation and adaptation training',
              actionItems: [
                'Complete cultural intelligence assessment',
                'Attend cultural orientation program',
                'Connect with expatriate community'
              ],
              resources: ['Cultural training programs', 'Expatriate networks', 'Cultural mentors'],
              timeline: '1-3 months',
              owner: 'talent',
              impact: 'Improves integration and job satisfaction'
            })
            break
        }
      }
    }

    return recommendations
  }

  private async identifyGaps(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity,
    scores: DetailedScore[]
  ): Promise<Gap[]> {
    const gaps: Gap[] = []

    for (const score of scores) {
      if (score.score < 0.5) {
        gaps.push({
          category: score.category,
          description: `Significant gap in ${score.category} requirements`,
          severity: 'critical',
          bridgeable: score.category !== 'visa' || opportunity.visaSponsorship.available,
          solutions: this.generateSolutions(score.category),
          timeline: this.getGapTimeline(score.category),
          cost: this.getGapCost(score.category),
          currency: 'USD',
          impact: 'May prevent successful placement without remediation'
        })
      } else if (score.score < 0.7) {
        gaps.push({
          category: score.category,
          description: `Moderate gap in ${score.category} requirements`,
          severity: 'major',
          bridgeable: true,
          solutions: this.generateSolutions(score.category),
          timeline: this.getGapTimeline(score.category),
          cost: this.getGapCost(score.category),
          currency: 'USD',
          impact: 'May affect job performance without improvement'
        })
      }
    }

    return gaps
  }

  private generateSolutions(category: string): string[] {
    const solutions: { [key: string]: string[] } = {
      skills: ['Upskilling programs', 'Online courses', 'Mentorship', 'Practice projects'],
      language: ['Language courses', 'Immersion programs', 'Conversation practice', 'Business language training'],
      cultural: ['Cultural training', 'Mentorship', 'Expatriate networks', 'Cultural immersion'],
      visa: ['Immigration consultation', 'Document preparation', 'Legal assistance', 'Employer sponsorship'],
      location: ['Relocation support', 'Remote work arrangement', 'Gradual transition', 'Location flexibility'],
      compensation: ['Salary negotiation', 'Benefits optimization', 'Performance incentives', 'Career progression'],
      family: ['Family support services', 'Relocation assistance', 'Spouse employment', 'Education support']
    }
    return solutions[category] || ['Professional consultation', 'Training programs', 'Expert guidance']
  }

  private getGapTimeline(category: string): string {
    const timelines: { [key: string]: string } = {
      skills: '3-6 months',
      language: '3-12 months',
      cultural: '1-3 months',
      visa: '2-6 months',
      location: '1-2 months',
      compensation: '1-2 weeks',
      family: '1-3 months'
    }
    return timelines[category] || '3-6 months'
  }

  private getGapCost(category: string): number {
    const costs: { [key: string]: number } = {
      skills: 5000,
      language: 3000,
      cultural: 2000,
      visa: 10000,
      location: 15000,
      compensation: 0,
      family: 8000
    }
    return costs[category] || 5000
  }

  private async identifyStrengths(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity,
    scores: DetailedScore[]
  ): Promise<Strength[]> {
    const strengths: Strength[] = []

    for (const score of scores) {
      if (score.score >= 0.8) {
        strengths.push({
          category: score.category,
          description: `Strong alignment in ${score.category}`,
          advantage: this.getAdvantage(score.category),
          leverage: this.getLeverage(score.category),
          differentiator: score.score >= 0.9,
          value: this.getValue(score.category)
        })
      }
    }

    return strengths
  }

  private getAdvantage(category: string): string {
    const advantages: { [key: string]: string } = {
      skills: 'Technical competency exceeds requirements',
      language: 'Excellent communication capabilities',
      cultural: 'Strong cultural adaptability',
      visa: 'Legal authorization ready',
      location: 'Preferred location alignment',
      compensation: 'Salary expectations aligned',
      family: 'Family situation supports mobility'
    }
    return advantages[category] || 'Strong performance indicator'
  }

  private getLeverage(category: string): string[] {
    const leverage: { [key: string]: string[] } = {
      skills: ['Mentor junior team members', 'Lead technical initiatives', 'Drive innovation'],
      language: ['Facilitate international communication', 'Support global teams', 'Cultural bridge'],
      cultural: ['Cultural ambassador', 'Change management', 'Team integration'],
      visa: ['Immediate availability', 'No legal barriers', 'Simplified onboarding'],
      location: ['Local market knowledge', 'Network connections', 'Cultural insights'],
      compensation: ['Cost-effective hiring', 'Budget alignment', 'Negotiation flexibility'],
      family: ['Long-term stability', 'Commitment indication', 'Support system']
    }
    return leverage[category] || ['Competitive advantage', 'Performance indicator']
  }

  private getValue(category: string): string {
    const values: { [key: string]: string } = {
      skills: 'High technical contribution potential',
      language: 'Enhanced global collaboration',
      cultural: 'Smooth integration and adaptation',
      visa: 'Immediate work authorization',
      location: 'Preferred placement alignment',
      compensation: 'Budget-friendly hiring',
      family: 'Stable long-term commitment'
    }
    return values[category] || 'Positive matching indicator'
  }

  private async identifyRisks(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity,
    scores: DetailedScore[]
  ): Promise<Risk[]> {
    const risks: Risk[] = []

    // Identify risks based on low scores
    for (const score of scores) {
      if (score.score < 0.6) {
        risks.push({
          category: score.category,
          description: `Risk of challenges in ${score.category}`,
          probability: score.score < 0.4 ? 'high' : 'medium',
          impact: this.getRiskImpact(score.category),
          mitigation: this.getMitigation(score.category),
          monitoring: this.getMonitoring(score.category),
          contingency: this.getContingency(score.category),
          owner: 'talent_manager'
        })
      }
    }

    // Add specific risks based on opportunity characteristics
    if (opportunity.mobilityType === 'temporary' && talent.familyConsiderations.hasFamily) {
      risks.push({
        category: 'family',
        description: 'Family separation challenges during temporary assignment',
        probability: 'medium',
        impact: 'high',
        mitigation: ['Regular family visits', 'Technology communication', 'Family support services'],
        monitoring: ['Family satisfaction surveys', 'Performance monitoring', 'Well-being check-ins'],
        contingency: ['Family relocation', 'Assignment modification', 'Early return'],
        owner: 'talent_manager'
      })
    }

    return risks
  }

  private getRiskImpact(category: string): 'high' | 'medium' | 'low' {
    const impacts: { [key: string]: 'high' | 'medium' | 'low' } = {
      skills: 'high',
      language: 'medium',
      cultural: 'medium',
      visa: 'high',
      location: 'low',
      compensation: 'medium',
      family: 'high'
    }
    return impacts[category] || 'medium'
  }

  private getMitigation(category: string): string[] {
    const mitigation: { [key: string]: string[] } = {
      skills: ['Training programs', 'Mentorship', 'Gradual skill development'],
      language: ['Language support', 'Translation services', 'Communication training'],
      cultural: ['Cultural training', 'Mentorship', 'Support networks'],
      visa: ['Legal assistance', 'Documentation support', 'Timeline management'],
      location: ['Relocation support', 'Flexibility arrangements', 'Remote work options'],
      compensation: ['Negotiation support', 'Benefit optimization', 'Performance incentives'],
      family: ['Family support services', 'Relocation assistance', 'Education support']
    }
    return mitigation[category] || ['Professional support', 'Regular monitoring', 'Contingency planning']
  }

  private getMonitoring(category: string): string[] {
    const monitoring: { [key: string]: string[] } = {
      skills: ['Performance reviews', 'Skill assessments', 'Progress tracking'],
      language: ['Communication effectiveness', 'Language proficiency tests', 'Feedback collection'],
      cultural: ['Adaptation surveys', 'Integration assessments', 'Cultural fit evaluation'],
      visa: ['Status tracking', 'Renewal monitoring', 'Compliance checks'],
      location: ['Satisfaction surveys', 'Performance monitoring', 'Retention tracking'],
      compensation: ['Salary benchmarking', 'Satisfaction surveys', 'Market analysis'],
      family: ['Family well-being checks', 'Satisfaction surveys', 'Support utilization']
    }
    return monitoring[category] || ['Regular check-ins', 'Performance monitoring', 'Feedback collection']
  }

  private getContingency(category: string): string[] {
    const contingency: { [key: string]: string[] } = {
      skills: ['Additional training', 'Role modification', 'Team support'],
      language: ['Interpreter services', 'Alternative communication', 'Language immersion'],
      cultural: ['Additional support', 'Cultural mediation', 'Team training'],
      visa: ['Alternative visa types', 'Legal escalation', 'Timeline extension'],
      location: ['Alternative arrangements', 'Remote work', 'Relocation support'],
      compensation: ['Salary adjustment', 'Benefit enhancement', 'Performance bonuses'],
      family: ['Family relocation', 'Support enhancement', 'Assignment modification']
    }
    return contingency[category] || ['Alternative solutions', 'Escalation procedures', 'Support enhancement']
  }

  private async generateMatchTimeline(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity,
    gaps: Gap[]
  ): Promise<MatchTimeline> {
    const phases: MatchPhase[] = []

    // Preparation phase
    phases.push({
      phase: 'preparation',
      description: 'Candidate preparation and gap closure',
      duration: '1-3 months',
      activities: [
        'Complete gap analysis',
        'Develop improvement plan',
        'Begin skill development',
        'Language training if needed',
        'Cultural preparation'
      ],
      deliverables: [
        'Gap closure plan',
        'Skill development progress',
        'Cultural readiness assessment'
      ],
      dependencies: [],
      risks: ['Timeline delays', 'Resource availability', 'Motivation factors'],
      owner: 'talent'
    })

    // Application phase
    phases.push({
      phase: 'application',
      description: 'Job application and initial screening',
      duration: '2-4 weeks',
      activities: [
        'Application submission',
        'Resume review',
        'Initial screening',
        'Skills assessment',
        'Reference checks'
      ],
      deliverables: [
        'Application package',
        'Assessment results',
        'Reference confirmations'
      ],
      dependencies: ['preparation'],
      risks: ['Application rejection', 'Skills gap identified', 'Reference issues'],
      owner: 'talent'
    })

    // Interview phase
    phases.push({
      phase: 'interview',
      description: 'Interview process and evaluation',
      duration: '3-6 weeks',
      activities: [
        'Interview scheduling',
        'Interview preparation',
        'Interview execution',
        'Cultural fit assessment',
        'Final evaluation'
      ],
      deliverables: [
        'Interview feedback',
        'Assessment results',
        'Hiring decision'
      ],
      dependencies: ['application'],
      risks: ['Interview performance', 'Cultural misalignment', 'Competing candidates'],
      owner: 'employer'
    })

    // Visa/Legal phase (if needed)
    if (talent.visaStatus.sponsorshipRequired) {
      phases.push({
        phase: 'visa_processing',
        description: 'Visa application and processing',
        duration: '2-6 months',
        activities: [
          'Visa application preparation',
          'Document submission',
          'Processing wait',
          'Interview if required',
          'Visa approval'
        ],
        deliverables: [
          'Visa application',
          'Supporting documents',
          'Work authorization'
        ],
        dependencies: ['interview'],
        risks: ['Visa denial', 'Processing delays', 'Document issues'],
        owner: 'talent'
      })
    }

    // Onboarding phase
    phases.push({
      phase: 'onboarding',
      description: 'Relocation and job start',
      duration: '1-2 months',
      activities: [
        'Relocation planning',
        'Travel arrangements',
        'Housing setup',
        'Job start',
        'Integration support'
      ],
      deliverables: [
        'Relocation completion',
        'Job start confirmation',
        'Integration assessment'
      ],
      dependencies: talent.visaStatus.sponsorshipRequired ? ['visa_processing'] : ['interview'],
      risks: ['Relocation challenges', 'Integration issues', 'Family adaptation'],
      owner: 'employer'
    })

    const totalDuration = this.calculateTotalDuration(phases)
    const criticalPath = this.identifyCriticalPath(phases)
    const dependencies = this.extractDependencies(phases)
    const milestones = this.generateMilestones(phases)

    return {
      phases,
      totalDuration,
      criticalPath,
      dependencies,
      milestones
    }
  }

  private calculateTotalDuration(phases: MatchPhase[]): string {
    // Simplified duration calculation
    const totalWeeks = phases.reduce((sum, phase) => {
      const weeks = this.parseDuration(phase.duration)
      return sum + weeks
    }, 0)

    if (totalWeeks <= 4) return `${totalWeeks} weeks`
    const months = Math.ceil(totalWeeks / 4)
    return `${months} months`
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/(\d+)-?(\d+)?\s*(weeks?|months?)/i)
    if (!match) return 4

    const min = parseInt(match[1])
    const max = match[2] ? parseInt(match[2]) : min
    const unit = match[3].toLowerCase()
    const average = (min + max) / 2

    return unit.includes('month') ? average * 4 : average
  }

  private identifyCriticalPath(phases: MatchPhase[]): string[] {
    // Simplified critical path identification
    return phases.map(phase => phase.phase)
  }

  private extractDependencies(phases: MatchPhase[]): string[] {
    const dependencies: string[] = []
    phases.forEach(phase => {
      dependencies.push(...phase.dependencies)
    })
    return [...new Set(dependencies)]
  }

  private generateMilestones(phases: MatchPhase[]): Milestone[] {
    const milestones: Milestone[] = []
    
    phases.forEach(phase => {
      milestones.push({
        milestone: `${phase.phase}_completion`,
        description: `Completion of ${phase.phase} phase`,
        date: this.estimateDate(phase.duration),
        criteria: phase.deliverables,
        deliverables: phase.deliverables,
        approval: phase.phase === 'interview' || phase.phase === 'visa_processing',
        owner: phase.owner
      })
    })

    return milestones
  }

  private estimateDate(duration: string): string {
    const weeks = this.parseDuration(duration)
    const date = new Date()
    date.setDate(date.getDate() + weeks * 7)
    return date.toISOString().split('T')[0]
  }

  private calculateConfidence(
    scores: DetailedScore[],
    gaps: Gap[],
    risks: Risk[]
  ): number {
    const avgScore = scores.reduce((sum, score) => sum + score.score, 0) / scores.length
    const criticalGaps = gaps.filter(gap => gap.severity === 'critical').length
    const highRisks = risks.filter(risk => risk.probability === 'high').length
    
    let confidence = avgScore
    confidence -= (criticalGaps * 0.2)
    confidence -= (highRisks * 0.15)
    confidence += (gaps.filter(gap => gap.bridgeable).length * 0.1)
    
    return Math.max(0, Math.min(1, confidence))
  }

  private async generateMatchReasoning(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity,
    scores: DetailedScore[],
    overallScore: number
  ): Promise<string> {
    const reasoning = `
Based on comprehensive analysis of talent profile and opportunity requirements:

**Overall Match Score: ${Math.round(overallScore * 100)}%**

**Key Strengths:**
${scores.filter(s => s.score >= 0.8).map(s => `• ${s.category}: ${Math.round(s.score * 100)}% - Strong alignment`).join('\n')}

**Areas for Improvement:**
${scores.filter(s => s.score < 0.7).map(s => `• ${s.category}: ${Math.round(s.score * 100)}% - Requires attention`).join('\n')}

**Mobility Factors:**
• Location: ${talent.preferredCountries.includes(opportunity.location.country) ? 'Preferred location' : 'Acceptable location'}
• Visa Status: ${talent.visaStatus.sponsorshipRequired ? 'Sponsorship required' : 'Work authorization ready'}
• Family Considerations: ${talent.familyConsiderations.hasFamily ? 'Family support needed' : 'No family constraints'}
• Timeline: ${talent.relocateWithinDays} days notice period

**Recommendation:** ${overallScore >= 0.8 ? 'Strong candidate - proceed with application' : 
  overallScore >= 0.6 ? 'Good candidate - address gaps before application' : 
  'Candidate needs significant preparation before application'}
`

    return reasoning.trim()
  }

  private async generateNextSteps(
    talent: GlobalTalentProfile,
    opportunity: GlobalOpportunity,
    recommendations: Recommendation[],
    gaps: Gap[]
  ): Promise<NextStep[]> {
    const nextSteps: NextStep[] = []

    // Immediate next steps
    nextSteps.push({
      step: 'Complete detailed skills assessment',
      description: 'Conduct comprehensive skills evaluation against opportunity requirements',
      priority: 'high',
      owner: 'talent',
      dueDate: this.addDays(new Date(), 7).toISOString().split('T')[0],
      dependencies: [],
      deliverables: ['Skills assessment report', 'Gap analysis', 'Development plan'],
      status: 'pending'
    })

    // Address critical gaps
    const criticalGaps = gaps.filter(gap => gap.severity === 'critical')
    if (criticalGaps.length > 0) {
      nextSteps.push({
        step: 'Address critical gaps',
        description: 'Implement solutions for critical gaps that could prevent placement',
        priority: 'high',
        owner: 'talent',
        dueDate: this.addDays(new Date(), 30).toISOString().split('T')[0],
        dependencies: ['Complete detailed skills assessment'],
        deliverables: ['Gap closure plan', 'Progress milestones', 'Evidence of improvement'],
        status: 'pending'
      })
    }

    // Visa preparation if needed
    if (talent.visaStatus.sponsorshipRequired) {
      nextSteps.push({
        step: 'Visa preparation',
        description: 'Prepare visa application documentation and requirements',
        priority: 'high',
        owner: 'talent',
        dueDate: this.addDays(new Date(), 14).toISOString().split('T')[0],
        dependencies: [],
        deliverables: ['Document checklist', 'Application forms', 'Supporting evidence'],
        status: 'pending'
      })
    }

    // Cultural preparation
    nextSteps.push({
      step: 'Cultural preparation',
      description: 'Complete cultural intelligence assessment and preparation',
      priority: 'medium',
      owner: 'talent',
      dueDate: this.addDays(new Date(), 21).toISOString().split('T')[0],
      dependencies: [],
      deliverables: ['Cultural assessment results', 'Adaptation plan', 'Network connections'],
      status: 'pending'
    })

    // Application submission
    nextSteps.push({
      step: 'Submit application',
      description: 'Submit complete application package to employer',
      priority: 'high',
      owner: 'talent',
      dueDate: this.addDays(new Date(), 45).toISOString().split('T')[0],
      dependencies: ['Complete detailed skills assessment', 'Address critical gaps'],
      deliverables: ['Application package', 'Supporting documents', 'Portfolio'],
      status: 'pending'
    })

    return nextSteps
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  async getGlobalOpportunity(opportunityId: string): Promise<GlobalOpportunity | null> {
    try {
      const { data, error } = await this.supabase
        .from('global_opportunities')
        .select('*')
        .eq('id', opportunityId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get global opportunity:', error)
      return null
    }
  }

  // Mobility Assessment
  async conductMobilityAssessment(
    userId: string,
    assessmentType: MobilityAssessment['assessmentType'],
    scope: MobilityAssessment['scope'] = 'full'
  ): Promise<MobilityAssessment> {
    try {
      const assessmentId = this.generateId()
      const now = new Date().toISOString()
      const validUntil = this.addDays(new Date(), 365).toISOString()

      const components: AssessmentComponent[] = [
        { component: 'skills_evaluation', weight: 0.25, status: 'pending' },
        { component: 'cultural_intelligence', weight: 0.2, status: 'pending' },
        { component: 'language_proficiency', weight: 0.15, status: 'pending' },
        { component: 'legal_compliance', weight: 0.15, status: 'pending' },
        { component: 'family_readiness', weight: 0.15, status: 'pending' },
        { component: 'financial_readiness', weight: 0.1, status: 'pending' }
      ]

      const assessment: MobilityAssessment = {
        id: assessmentId,
        userId,
        assessmentType,
        scope,
        components,
        results: [],
        recommendations: [],
        score: 0,
        readiness: 'not_ready',
        timeline: '',
        nextAssessment: this.addDays(new Date(), 180).toISOString(),
        createdAt: now,
        validUntil
      }

      await this.supabase
        .from('mobility_assessments')
        .insert({
          id: assessment.id,
          user_id: assessment.userId,
          assessment_type: assessment.assessmentType,
          scope: assessment.scope,
          components: assessment.components,
          results: assessment.results,
          recommendations: assessment.recommendations,
          score: assessment.score,
          readiness: assessment.readiness,
          timeline: assessment.timeline,
          next_assessment: assessment.nextAssessment,
          created_at: assessment.createdAt,
          valid_until: assessment.validUntil
        })

      return assessment
    } catch (error) {
      console.error('Failed to conduct mobility assessment:', error)
      throw error
    }
  }

  // Mobility Planning
  async createMobilityPlan(
    userId: string,
    planType: MobilityPlan['planType'],
    objectives: PlanObjective[]
  ): Promise<MobilityPlan> {
    try {
      const planId = this.generateId()
      const now = new Date().toISOString()
      const startDate = new Date().toISOString()
      const endDate = this.addDays(new Date(), 365).toISOString()

      const timeline: PlanTimeline = {
        phases: [],
        totalDuration: '12 months',
        startDate,
        endDate,
        buffer: '1 month',
        flexibility: 'medium'
      }

      const plan: MobilityPlan = {
        id: planId,
        userId,
        planType,
        objectives,
        timeline,
        milestones: [],
        resources: [],
        budget: {
          totalBudget: 0,
          currency: 'USD',
          categories: [],
          contingency: 0.15,
          approval: false,
          approver: '',
          tracking: true,
          reporting: 'monthly'
        },
        risks: [],
        success: [],
        status: 'draft',
        progress: 0,
        createdAt: now,
        updatedAt: now,
        reviewDate: this.addDays(new Date(), 30).toISOString()
      }

      await this.supabase
        .from('mobility_plans')
        .insert({
          id: plan.id,
          user_id: plan.userId,
          plan_type: plan.planType,
          objectives: plan.objectives,
          timeline: plan.timeline,
          milestones: plan.milestones,
          resources: plan.resources,
          budget: plan.budget,
          risks: plan.risks,
          success: plan.success,
          status: plan.status,
          progress: plan.progress,
          created_at: plan.createdAt,
          updated_at: plan.updatedAt,
          review_date: plan.reviewDate
        })

      return plan
    } catch (error) {
      console.error('Failed to create mobility plan:', error)
      throw error
    }
  }

  // Search and Discovery
  async searchGlobalOpportunities(
    filters: {
      countries?: string[]
      mobilityTypes?: string[]
      skillsRequired?: string[]
      salaryRange?: { min: number; max: number; currency: string }
      workModel?: string[]
      urgency?: string[]
      visaSponsorship?: boolean
      familySupport?: boolean
    },
    userId?: string
  ): Promise<GlobalOpportunity[]> {
    try {
      let query = this.supabase
        .from('global_opportunities')
        .select('*')

      if (filters.countries) {
        query = query.in('location.country', filters.countries)
      }

      if (filters.mobilityTypes) {
        query = query.in('mobility_type', filters.mobilityTypes)
      }

      if (filters.workModel) {
        query = query.in('work_model', filters.workModel)
      }

      if (filters.urgency) {
        query = query.in('urgency', filters.urgency)
      }

      if (filters.visaSponsorship !== undefined) {
        query = query.eq('visa_sponsorship.available', filters.visaSponsorship)
      }

      if (filters.salaryRange) {
        query = query
          .gte('compensation.base_salary', filters.salaryRange.min)
          .lte('compensation.base_salary', filters.salaryRange.max)
          .eq('compensation.currency', filters.salaryRange.currency)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      // If userId provided, calculate match scores for ranking
      if (userId) {
        const talentProfile = await this.getTalentProfile(userId)
        if (talentProfile) {
          const enrichedData = await Promise.all(
            data.map(async (opportunity) => {
              const match = await this.matchTalentToOpportunity(userId, opportunity.id)
              return {
                ...opportunity,
                matchScore: match.overallScore,
                matchConfidence: match.confidence
              }
            })
          )
          
          return enrichedData.sort((a, b) => b.matchScore - a.matchScore)
        }
      }

      return data || []
    } catch (error) {
      console.error('Failed to search global opportunities:', error)
      return []
    }
  }

  async getRecommendedOpportunities(userId: string, limit: number = 20): Promise<GlobalOpportunity[]> {
    try {
      const talentProfile = await this.getTalentProfile(userId)
      if (!talentProfile) return []

      // Get opportunities that match basic criteria
      const opportunities = await this.searchGlobalOpportunities({
        countries: talentProfile.preferredCountries,
        visaSponsorship: talentProfile.visaStatus.sponsorshipRequired,
        familySupport: talentProfile.familyConsiderations.hasFamily
      })

      // Calculate match scores and return top recommendations
      const scoredOpportunities = await Promise.all(
        opportunities.map(async (opportunity) => {
          const match = await this.matchTalentToOpportunity(userId, opportunity.id)
          return {
            ...opportunity,
            matchScore: match.overallScore,
            matchConfidence: match.confidence,
            matchReasoning: match.reasoning
          }
        })
      )

      return scoredOpportunities
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit)
    } catch (error) {
      console.error('Failed to get recommended opportunities:', error)
      return []
    }
  }

  // Analytics and Reporting
  async generateTalentAnalytics(userId: string): Promise<{
    profileCompleteness: number
    mobilityReadiness: number
    marketValue: number
    opportunityFit: number
    competitivePosition: number
    recommendations: string[]
    benchmarks: any[]
  }> {
    try {
      const talentProfile = await this.getTalentProfile(userId)
      if (!talentProfile) throw new Error('Talent profile not found')

      // Calculate profile completeness
      const profileCompleteness = this.calculateProfileCompleteness(talentProfile)

      // Get recent mobility assessment
      const { data: assessments } = await this.supabase
        .from('mobility_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)

      const mobilityReadiness = assessments?.[0]?.score || 0

      // Calculate market value based on skills and location
      const marketValue = await this.calculateMarketValue(talentProfile)

      // Calculate average opportunity fit
      const { data: matches } = await this.supabase
        .from('talent_matches')
        .select('overall_score')
        .eq('talent_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      const opportunityFit = matches?.length ? 
        matches.reduce((sum, match) => sum + match.overall_score, 0) / matches.length : 0

      // Calculate competitive position
      const competitivePosition = await this.calculateCompetitivePosition(talentProfile)

      // Generate recommendations
      const recommendations = await this.generateAnalyticsRecommendations(
        profileCompleteness,
        mobilityReadiness,
        marketValue,
        opportunityFit,
        competitivePosition
      )

      // Get benchmarks
      const benchmarks = await this.getBenchmarkData(talentProfile)

      return {
        profileCompleteness,
        mobilityReadiness,
        marketValue,
        opportunityFit,
        competitivePosition,
        recommendations,
        benchmarks
      }
    } catch (error) {
      console.error('Failed to generate talent analytics:', error)
      throw error
    }
  }

  private calculateProfileCompleteness(profile: GlobalTalentProfile): number {
    const sections = [
      { key: 'basicInfo', weight: 0.15, check: () => profile.userId && profile.currentLocation },
      { key: 'visaStatus', weight: 0.2, check: () => profile.visaStatus.passportCountry && profile.visaStatus.currentVisaType },
      { key: 'languageSkills', weight: 0.15, check: () => profile.languageSkills.length > 0 },
      { key: 'culturalAdaptability', weight: 0.1, check: () => profile.culturalAdaptability.culturalIntelligence > 0 },
      { key: 'mobilityPreferences', weight: 0.15, check: () => profile.mobilityPreferences.preferredMobilityType },
      { key: 'salaryExpectations', weight: 0.1, check: () => profile.salaryExpectations.length > 0 },
      { key: 'familyConsiderations', weight: 0.1, check: () => profile.familyConsiderations.maritalStatus },
      { key: 'legalCompliance', weight: 0.05, check: () => profile.legalCompliance.backgroundCheckConsent }
    ]

    const totalScore = sections.reduce((sum, section) => {
      return sum + (section.check() ? section.weight : 0)
    }, 0)

    return Math.round(totalScore * 100)
  }

  private async calculateMarketValue(profile: GlobalTalentProfile): Promise<number> {
    // Simplified market value calculation
    // In production, this would use comprehensive market data
    const baseValue = 70 // Base market value
    let adjustments = 0

    // Language skills bonus
    adjustments += profile.languageSkills.length * 5

    // Cultural adaptability bonus
    adjustments += profile.culturalAdaptability.culturalIntelligence * 0.2

    // Mobility willingness bonus
    if (profile.willingToRelocate) adjustments += 10

    // Preferred countries diversity
    adjustments += Math.min(profile.preferredCountries.length * 2, 10)

    return Math.min(baseValue + adjustments, 100)
  }

  private async calculateCompetitivePosition(profile: GlobalTalentProfile): Promise<number> {
    // Simplified competitive position calculation
    // Would use comparative analysis in production
    return Math.random() * 30 + 70 // 70-100 range
  }

  private async generateAnalyticsRecommendations(
    profileCompleteness: number,
    mobilityReadiness: number,
    marketValue: number,
    opportunityFit: number,
    competitivePosition: number
  ): Promise<string[]> {
    const recommendations: string[] = []

    if (profileCompleteness < 80) {
      recommendations.push('Complete your profile to improve visibility to employers')
    }

    if (mobilityReadiness < 70) {
      recommendations.push('Consider taking a mobility assessment to identify improvement areas')
    }

    if (marketValue < 75) {
      recommendations.push('Develop additional skills or certifications to increase market value')
    }

    if (opportunityFit < 70) {
      recommendations.push('Refine your preferences or expand your skill set to match more opportunities')
    }

    if (competitivePosition < 80) {
      recommendations.push('Consider additional training or certifications to strengthen your competitive position')
    }

    return recommendations
  }

  private async getBenchmarkData(profile: GlobalTalentProfile): Promise<any[]> {
    // Simplified benchmark data
    return [
      {
        metric: 'Average Match Score',
        value: 75,
        yourValue: 80,
        trend: 'above_average'
      },
      {
        metric: 'Profile Completeness',
        value: 85,
        yourValue: 90,
        trend: 'above_average'
      },
      {
        metric: 'Market Demand',
        value: 65,
        yourValue: 70,
        trend: 'above_average'
      }
    ]
  }

  // Utility Methods
  private generateId(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  async getSystemStatistics(): Promise<{
    totalTalentProfiles: number
    totalOpportunities: number
    successfulMatches: number
    averageMatchScore: number
    topDestinations: Array<{ country: string; count: number }>
    popularMobilityTypes: Array<{ type: string; count: number }>
  }> {
    try {
      const [
        { data: talentCount },
        { data: opportunityCount },
        { data: matchCount },
        { data: avgScore },
        { data: destinations },
        { data: mobilityTypes }
      ] = await Promise.all([
        this.supabase.from('global_talent_profiles').select('count'),
        this.supabase.from('global_opportunities').select('count'),
        this.supabase.from('talent_matches').select('count').gte('overall_score', 0.7),
        this.supabase.from('talent_matches').select('overall_score'),
        this.supabase.from('global_talent_profiles').select('preferred_countries'),
        this.supabase.from('global_opportunities').select('mobility_type')
      ])

      // Calculate statistics
      const totalTalentProfiles = talentCount?.[0]?.count || 0
      const totalOpportunities = opportunityCount?.[0]?.count || 0
      const successfulMatches = matchCount?.[0]?.count || 0
      const averageMatchScore = avgScore?.length ? 
        avgScore.reduce((sum, item) => sum + item.overall_score, 0) / avgScore.length : 0

      // Calculate top destinations
      const countryCount = new Map<string, number>()
      destinations?.forEach(profile => {
        profile.preferred_countries?.forEach((country: string) => {
          countryCount.set(country, (countryCount.get(country) || 0) + 1)
        })
      })
      const topDestinations = Array.from(countryCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([country, count]) => ({ country, count }))

      // Calculate popular mobility types
      const mobilityCount = new Map<string, number>()
      mobilityTypes?.forEach(opportunity => {
        const type = opportunity.mobility_type
        if (type) {
          mobilityCount.set(type, (mobilityCount.get(type) || 0) + 1)
        }
      })
      const popularMobilityTypes = Array.from(mobilityCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([type, count]) => ({ type, count }))

      return {
        totalTalentProfiles,
        totalOpportunities,
        successfulMatches,
        averageMatchScore: Math.round(averageMatchScore * 100) / 100,
        topDestinations,
        popularMobilityTypes
      }
    } catch (error) {
      console.error('Failed to get system statistics:', error)
      return {
        totalTalentProfiles: 0,
        totalOpportunities: 0,
        successfulMatches: 0,
        averageMatchScore: 0,
        topDestinations: [],
        popularMobilityTypes: []
      }
    }
  }
}

export default GlobalTalentMobilitySystem