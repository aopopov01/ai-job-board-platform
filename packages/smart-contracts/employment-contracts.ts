import { createClient } from '@supabase/supabase-js'
import { ethers } from 'ethers'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SmartEmploymentContract {
  id: string
  contractAddress: string
  employeeId: string
  employerId: string
  jobId: string
  contractType: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship' | 'temporary'
  terms: EmploymentTerms
  compensation: CompensationStructure
  milestones: ContractMilestone[]
  performance: PerformanceMetrics
  escrow: EscrowDetails
  status: 'draft' | 'pending_signatures' | 'active' | 'completed' | 'terminated' | 'disputed'
  signatures: ContractSignature[]
  amendments: ContractAmendment[]
  payments: PaymentRecord[]
  disputeResolution: DisputeResolution
  blockchainData: BlockchainContractData
  legalCompliance: LegalComplianceData
  automaticClauses: AutomaticClause[]
  confidentialityTerms: ConfidentialityClause[]
  intellectualPropertyTerms: IPClause[]
  createdAt: string
  activatedAt?: string
  completedAt?: string
  terminatedAt?: string
}

export interface EmploymentTerms {
  startDate: string
  endDate?: string
  duration?: string
  workLocation: 'remote' | 'onsite' | 'hybrid'
  workingHours: {
    hoursPerWeek: number
    flexibleSchedule: boolean
    coreHours?: string
    timeZone: string
  }
  probationPeriod?: number // days
  noticePeriod: number // days
  renewalTerms?: {
    automaticRenewal: boolean
    renewalPeriod?: string
    renewalConditions?: string[]
  }
  terminationConditions: string[]
  benefitsEligibility: string[]
  legalJurisdiction: string
  governingLaw: string
}

export interface CompensationStructure {
  baseSalary: {
    amount: number
    currency: string
    paymentFrequency: 'hourly' | 'weekly' | 'biweekly' | 'monthly' | 'annually'
  }
  bonuses: BonusStructure[]
  equity?: EquityCompensation
  benefits: BenefitPackage[]
  expenses: ExpensePolicy
  totalCompensationValue: number
  paymentSchedule: PaymentSchedule[]
  escrowPercentage: number // Percentage held in escrow
  performanceMultipliers: PerformanceMultiplier[]
}

export interface BonusStructure {
  type: 'performance' | 'signing' | 'retention' | 'project_completion' | 'milestone'
  description: string
  amount: number | string // Fixed amount or percentage
  criteria: string[]
  paymentConditions: string[]
  taxImplications: string
}

export interface EquityCompensation {
  type: 'stock_options' | 'restricted_stock' | 'equity_grant'
  shares: number
  vestingSchedule: VestingSchedule
  exercisePrice?: number
  valuationDate: string
  dilutionProtection: boolean
}

export interface VestingSchedule {
  totalVestingPeriod: number // months
  cliffPeriod: number // months
  vestingFrequency: 'monthly' | 'quarterly' | 'annually'
  accelerationClauses: string[]
}

export interface BenefitPackage {
  type: 'health_insurance' | 'dental' | 'vision' | 'retirement' | 'vacation' | 'sick_leave' | 'parental_leave' | 'professional_development'
  description: string
  value: number
  provider?: string
  eligibilityDate: string
  coverage?: string
}

export interface ExpensePolicy {
  workFromHomeAllowance?: number
  travelExpenses: boolean
  professionalDevelopment: number // annual budget
  equipmentProvided: string[]
  reimbursementProcess: string
}

export interface PaymentSchedule {
  paymentDate: string
  amount: number
  type: 'salary' | 'bonus' | 'expense_reimbursement' | 'equity_exercise'
  description: string
  autoPayment: boolean
  escrowRelease?: boolean
}

export interface PerformanceMultiplier {
  metric: string
  threshold: number
  multiplier: number
  maxMultiplier: number
}

export interface ContractMilestone {
  id: string
  title: string
  description: string
  deliverables: Deliverable[]
  dueDate: string
  completionCriteria: string[]
  paymentTrigger: boolean
  paymentAmount?: number
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled'
  submittedAt?: string
  approvedAt?: string
  approvedBy?: string
  feedback?: string
  revisionRequests?: RevisionRequest[]
}

export interface Deliverable {
  id: string
  name: string
  description: string
  format: string
  qualityStandards: string[]
  acceptanceCriteria: string[]
  submissionMethod: string
  ipOwnership: 'employee' | 'employer' | 'shared'
}

export interface RevisionRequest {
  id: string
  requestedBy: string
  requestDate: string
  description: string
  deadline: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'approved' | 'rejected' | 'completed'
}

export interface PerformanceMetrics {
  kpis: KPI[]
  reviewPeriods: PerformanceReview[]
  overallRating?: number // 0-100
  improvementPlan?: ImprovementPlan
  performanceHistory: PerformanceDataPoint[]
}

export interface KPI {
  id: string
  name: string
  description: string
  targetValue: number
  actualValue?: number
  unit: string
  weight: number // importance percentage
  evaluationMethod: 'automated' | 'manual' | 'peer_review' | 'client_feedback'
  dataSource?: string
}

export interface PerformanceReview {
  id: string
  reviewDate: string
  reviewPeriod: {
    start: string
    end: string
  }
  reviewerId: string
  overallScore: number
  kpiScores: { [kpiId: string]: number }
  feedback: string
  strengths: string[]
  improvementAreas: string[]
  goals: string[]
  compensationAdjustment?: number
  promotionRecommendation: boolean
}

export interface ImprovementPlan {
  id: string
  createdDate: string
  targetAreas: string[]
  specificGoals: string[]
  actionItems: ActionItem[]
  timeline: string
  supportProvided: string[]
  reviewSchedule: string[]
  successMetrics: string[]
}

export interface ActionItem {
  id: string
  description: string
  deadline: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  assignedTo: string
  resources: string[]
}

export interface PerformanceDataPoint {
  date: string
  metric: string
  value: number
  context?: string
  verified: boolean
}

export interface EscrowDetails {
  totalAmount: number
  currency: string
  releaseConditions: ReleaseCondition[]
  disputes: EscrowDispute[]
  releaseSchedule: EscrowRelease[]
  arbiterAddress?: string
  emergencyReleaseConditions: string[]
}

export interface ReleaseCondition {
  id: string
  description: string
  type: 'milestone_completion' | 'time_based' | 'performance_target' | 'mutual_agreement' | 'dispute_resolution'
  criteria: any
  percentage: number // Percentage of escrow to release
  automatedRelease: boolean
}

export interface EscrowDispute {
  id: string
  disputeType: 'payment' | 'deliverable' | 'performance' | 'termination'
  initiatedBy: string
  description: string
  amount: number
  evidence: Evidence[]
  status: 'open' | 'under_review' | 'resolved' | 'escalated'
  resolution?: string
  decidedBy?: string
  decidedAt?: string
}

export interface Evidence {
  id: string
  type: 'document' | 'communication' | 'deliverable' | 'witness_statement' | 'performance_data'
  description: string
  fileUrl?: string
  submittedBy: string
  submittedAt: string
  verified: boolean
}

export interface EscrowRelease {
  id: string
  amount: number
  releaseDate: string
  reason: string
  conditionId: string
  transactionHash?: string
  recipient: string
  approved: boolean
  approvedBy?: string
}

export interface ContractSignature {
  signerId: string
  signerRole: 'employee' | 'employer' | 'witness' | 'legal_representative'
  signatureHash: string
  signedAt: string
  ipAddress: string
  deviceInfo: string
  blockchainTxHash?: string
  legallyBinding: boolean
  witnessSignatures?: WitnessSignature[]
}

export interface WitnessSignature {
  witnessId: string
  witnessName: string
  relationship: string
  signatureHash: string
  signedAt: string
  notarized: boolean
}

export interface ContractAmendment {
  id: string
  amendmentNumber: number
  proposedBy: string
  proposedAt: string
  description: string
  changedClauses: ClauseChange[]
  reasonForChange: string
  status: 'proposed' | 'under_review' | 'approved' | 'rejected' | 'implemented'
  reviewedBy?: string
  reviewedAt?: string
  implementedAt?: string
  blockchainTxHash?: string
  legalReview: boolean
}

export interface ClauseChange {
  clauseId: string
  originalText: string
  newText: string
  changeType: 'addition' | 'modification' | 'removal'
  impact: 'minor' | 'major' | 'substantial'
}

export interface PaymentRecord {
  id: string
  amount: number
  currency: string
  paymentType: 'salary' | 'bonus' | 'expense' | 'equity' | 'escrow_release'
  paymentDate: string
  dueDate: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'disputed'
  transactionHash?: string
  milestoneId?: string
  description: string
  taxWithholdings: TaxWithholding[]
  paymentMethod: 'crypto' | 'bank_transfer' | 'check' | 'digital_wallet'
  automaticPayment: boolean
}

export interface TaxWithholding {
  type: 'federal_income' | 'state_income' | 'social_security' | 'medicare' | 'unemployment' | 'other'
  percentage: number
  amount: number
  jurisdiction: string
}

export interface DisputeResolution {
  mechanism: 'mediation' | 'arbitration' | 'litigation' | 'smart_contract_oracle'
  arbiter?: string
  disputeHistory: DisputeCase[]
  resolutionTimeframe: string
  appealProcess: string
  enforcementMechanism: string
}

export interface DisputeCase {
  id: string
  type: string
  description: string
  initiatedBy: string
  initiatedAt: string
  evidence: Evidence[]
  resolution?: string
  resolvedAt?: string
  resolvedBy?: string
  damages?: number
  enforcementAction?: string
}

export interface BlockchainContractData {
  contractAddress: string
  deploymentTxHash: string
  networkId: number
  gasUsed: number
  blockNumber: number
  ipfsHash: string
  merkleRoot: string
  lastUpdatedTxHash?: string
  confirmations: number
  immutableHash: string
}

export interface LegalComplianceData {
  jurisdiction: string
  applicableLaws: string[]
  complianceCheckpoints: ComplianceCheckpoint[]
  legalReviews: LegalReview[]
  regulatoryFilings: RegulatoryFiling[]
  licenseRequirements: string[]
  dataProtectionCompliance: string[]
}

export interface ComplianceCheckpoint {
  id: string
  checkpointType: string
  description: string
  status: 'compliant' | 'non_compliant' | 'under_review' | 'remediation_required'
  checkedAt: string
  checkedBy: string
  evidence?: string[]
  remediationPlan?: string
}

export interface LegalReview {
  id: string
  reviewerId: string
  reviewerCredentials: string
  reviewDate: string
  reviewScope: string[]
  findings: string[]
  recommendations: string[]
  riskAssessment: 'low' | 'medium' | 'high' | 'critical'
  approved: boolean
}

export interface RegulatoryFiling {
  id: string
  agency: string
  filingType: string
  filingDate: string
  confirmationNumber: string
  status: 'submitted' | 'under_review' | 'approved' | 'rejected'
  documentUrl: string
}

export interface AutomaticClause {
  id: string
  clauseType: 'payment_release' | 'milestone_check' | 'performance_evaluation' | 'contract_renewal' | 'termination_trigger'
  description: string
  trigger: ClauseTrigger
  action: ClauseAction
  isActive: boolean
  executionHistory: ClauseExecution[]
}

export interface ClauseTrigger {
  type: 'time_based' | 'milestone_completion' | 'performance_threshold' | 'external_event' | 'mutual_agreement'
  conditions: any
  frequency?: string
  grace_period?: number
}

export interface ClauseAction {
  type: 'payment' | 'notification' | 'milestone_creation' | 'contract_amendment' | 'dispute_initiation' | 'contract_termination'
  parameters: any
  requiresApproval: boolean
  reversible: boolean
}

export interface ClauseExecution {
  id: string
  executedAt: string
  triggerData: any
  actionTaken: string
  result: 'success' | 'failure' | 'partial'
  transactionHash?: string
  errorMessage?: string
}

export interface ConfidentialityClause {
  id: string
  scope: string[]
  duration: string
  exceptions: string[]
  penalties: PenaltyStructure[]
  returnOfMaterials: boolean
  survivingClauses: string[]
}

export interface IPClause {
  id: string
  ipType: 'patent' | 'trademark' | 'copyright' | 'trade_secret' | 'know_how'
  ownership: 'employee' | 'employer' | 'joint' | 'license'
  preExistingIP: string[]
  workForHireProvisions: string[]
  assignmentRequirements: string[]
  moralRights: string[]
  indemnificationTerms: string[]
}

export interface PenaltyStructure {
  violation: string
  penaltyType: 'monetary' | 'injunctive_relief' | 'termination' | 'withholding'
  amount?: number
  calculation: string
  escalation: boolean
}

export class SmartEmploymentContractSystem {
  private provider: ethers.providers.Provider
  private signer: ethers.Signer
  private contracts: Map<string, ethers.Contract> = new Map()

  constructor(privateKey?: string) {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'https://polygon-rpc.com'
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider)
    }
    
    this.initializeContracts()
  }

  private async initializeContracts(): Promise<void> {
    try {
      const { data: contracts } = await supabase
        .from('smart_contracts')
        .select('*')
        .eq('contract_type', 'employment_agreement')
        .eq('is_active', true)

      contracts?.forEach(contract => {
        const ethersContract = new ethers.Contract(
          contract.contract_address,
          contract.abi,
          this.provider
        )
        this.contracts.set(contract.id, ethersContract)
      })
    } catch (error) {
      console.error('Failed to initialize employment contracts:', error)
    }
  }

  // Contract Creation & Deployment
  async createEmploymentContract(
    contractData: Omit<SmartEmploymentContract, 'id' | 'contractAddress' | 'blockchainData' | 'status' | 'signatures' | 'amendments' | 'payments' | 'createdAt'>
  ): Promise<SmartEmploymentContract> {
    try {
      const contractId = this.generateContractId()

      // Prepare contract metadata for IPFS
      const contractMetadata = {
        ...contractData,
        id: contractId,
        version: '1.0',
        standard: 'Smart Employment Contract v1.0',
        created: new Date().toISOString()
      }

      // Store metadata on IPFS
      const ipfsHash = await this.storeContractOnIPFS(contractMetadata)

      // Deploy smart contract to blockchain
      const blockchainData = await this.deployEmploymentContract(contractId, ipfsHash, contractData)

      const contract: SmartEmploymentContract = {
        ...contractData,
        id: contractId,
        contractAddress: blockchainData.contractAddress,
        blockchainData,
        status: 'draft',
        signatures: [],
        amendments: [],
        payments: [],
        createdAt: new Date().toISOString()
      }

      // Store in database
      await supabase
        .from('smart_employment_contracts')
        .insert({
          id: contract.id,
          contract_address: contract.contractAddress,
          employee_id: contract.employeeId,
          employer_id: contract.employerId,
          job_id: contract.jobId,
          contract_type: contract.contractType,
          terms: contract.terms,
          compensation: contract.compensation,
          milestones: contract.milestones,
          performance: contract.performance,
          escrow: contract.escrow,
          status: contract.status,
          dispute_resolution: contract.disputeResolution,
          blockchain_data: contract.blockchainData,
          legal_compliance: contract.legalCompliance,
          automatic_clauses: contract.automaticClauses,
          confidentiality_terms: contract.confidentialityTerms,
          intellectual_property_terms: contract.intellectualPropertyTerms,
          created_at: contract.createdAt
        })

      // Initialize escrow if required
      if (contract.compensation.escrowPercentage > 0) {
        await this.initializeEscrow(contractId, contract.compensation)
      }

      // Set up automatic clauses
      await this.setupAutomaticClauses(contractId, contract.automaticClauses)

      return contract
    } catch (error) {
      console.error('Failed to create employment contract:', error)
      throw error
    }
  }

  private async deployEmploymentContract(
    contractId: string,
    ipfsHash: string,
    contractData: any
  ): Promise<BlockchainContractData> {
    try {
      if (!this.signer) {
        throw new Error('Signer not available for contract deployment')
      }

      // Get contract factory for employment contracts
      const contractFactory = new ethers.ContractFactory(
        this.getEmploymentContractABI(),
        this.getEmploymentContractBytecode(),
        this.signer
      )

      // Deploy contract with initialization parameters
      const deployedContract = await contractFactory.deploy(
        contractId,
        ipfsHash,
        contractData.employeeId,
        contractData.employerId,
        Math.floor(contractData.compensation.totalCompensationValue),
        { gasLimit: 3000000 }
      )

      await deployedContract.deployed()
      const receipt = await deployedContract.deployTransaction.wait()

      return {
        contractAddress: deployedContract.address,
        deploymentTxHash: receipt.transactionHash,
        networkId: await this.provider.getNetwork().then(n => n.chainId),
        gasUsed: receipt.gasUsed.toNumber(),
        blockNumber: receipt.blockNumber,
        ipfsHash,
        merkleRoot: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(contractData))),
        confirmations: receipt.confirmations,
        immutableHash: ethers.utils.keccak256(
          ethers.utils.solidityPack(['string', 'string'], [contractId, ipfsHash])
        )
      }
    } catch (error) {
      console.error('Failed to deploy employment contract:', error)
      throw error
    }
  }

  // Contract Signing & Activation
  async signContract(
    contractId: string,
    signerId: string,
    signerRole: ContractSignature['signerRole'],
    signatureData: string
  ): Promise<ContractSignature> {
    try {
      const signatureHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signatureData))
      
      // Create blockchain signature transaction
      const contract = this.contracts.get(contractId)
      if (contract && this.signer) {
        const tx = await contract.connect(this.signer).signContract(signerId, signatureHash)
        const receipt = await tx.wait()

        const signature: ContractSignature = {
          signerId,
          signerRole,
          signatureHash,
          signedAt: new Date().toISOString(),
          ipAddress: 'blockchain', // Would get actual IP in production
          deviceInfo: 'smart_contract',
          blockchainTxHash: receipt.transactionHash,
          legallyBinding: true
        }

        // Update contract signatures
        const { data: contractData } = await supabase
          .from('smart_employment_contracts')
          .select('signatures')
          .eq('id', contractId)
          .single()

        const updatedSignatures = [...(contractData?.signatures || []), signature]

        await supabase
          .from('smart_employment_contracts')
          .update({
            signatures: updatedSignatures,
            status: this.checkAllSignaturesComplete(updatedSignatures) ? 'active' : 'pending_signatures',
            activated_at: this.checkAllSignaturesComplete(updatedSignatures) ? new Date().toISOString() : null
          })
          .eq('id', contractId)

        // If all signatures are complete, activate the contract
        if (this.checkAllSignaturesComplete(updatedSignatures)) {
          await this.activateContract(contractId)
        }

        return signature
      }

      throw new Error('Contract not found or signer not available')
    } catch (error) {
      console.error('Failed to sign contract:', error)
      throw error
    }
  }

  private checkAllSignaturesComplete(signatures: ContractSignature[]): boolean {
    const requiredRoles = ['employee', 'employer']
    const signedRoles = new Set(signatures.map(s => s.signerRole))
    return requiredRoles.every(role => signedRoles.has(role as any))
  }

  private async activateContract(contractId: string): Promise<void> {
    try {
      // Activate blockchain contract
      const contract = this.contracts.get(contractId)
      if (contract && this.signer) {
        const tx = await contract.connect(this.signer).activateContract()
        await tx.wait()
      }

      // Start automatic clauses and monitoring
      await this.startContractMonitoring(contractId)
      
      // Send notifications
      await this.sendContractActivationNotifications(contractId)
    } catch (error) {
      console.error('Failed to activate contract:', error)
      throw error
    }
  }

  // Milestone Management
  async submitMilestone(
    contractId: string,
    milestoneId: string,
    deliverables: { [deliverableId: string]: string }, // deliverable ID -> submission URL/hash
    submittedBy: string
  ): Promise<void> {
    try {
      const { data: contract } = await supabase
        .from('smart_employment_contracts')
        .select('milestones')
        .eq('id', contractId)
        .single()

      if (!contract) throw new Error('Contract not found')

      const updatedMilestones = contract.milestones.map((milestone: ContractMilestone) => {
        if (milestone.id === milestoneId) {
          return {
            ...milestone,
            status: 'completed',
            submittedAt: new Date().toISOString(),
            deliverables: milestone.deliverables.map(deliverable => ({
              ...deliverable,
              submissionUrl: deliverables[deliverable.id] || ''
            }))
          }
        }
        return milestone
      })

      await supabase
        .from('smart_employment_contracts')
        .update({ milestones: updatedMilestones })
        .eq('id', contractId)

      // Trigger payment if milestone has payment trigger
      const completedMilestone = updatedMilestones.find((m: ContractMilestone) => m.id === milestoneId)
      if (completedMilestone?.paymentTrigger && completedMilestone.paymentAmount) {
        await this.triggerMilestonePayment(contractId, milestoneId, completedMilestone.paymentAmount)
      }

      // Record blockchain transaction
      await this.recordMilestoneCompletion(contractId, milestoneId)
    } catch (error) {
      console.error('Failed to submit milestone:', error)
      throw error
    }
  }

  private async triggerMilestonePayment(contractId: string, milestoneId: string, amount: number): Promise<void> {
    try {
      const contract = this.contracts.get(contractId)
      if (contract && this.signer) {
        const tx = await contract.connect(this.signer).releaseMilestonePayment(milestoneId, amount)
        const receipt = await tx.wait()

        // Record payment
        const payment: PaymentRecord = {
          id: this.generateId(),
          amount,
          currency: 'ETH', // Would be dynamic based on contract
          paymentType: 'salary',
          paymentDate: new Date().toISOString(),
          dueDate: new Date().toISOString(),
          status: 'completed',
          transactionHash: receipt.transactionHash,
          milestoneId,
          description: `Milestone payment for ${milestoneId}`,
          taxWithholdings: [],
          paymentMethod: 'crypto',
          automaticPayment: true
        }

        const { data: contractData } = await supabase
          .from('smart_employment_contracts')
          .select('payments')
          .eq('id', contractId)
          .single()

        const updatedPayments = [...(contractData?.payments || []), payment]

        await supabase
          .from('smart_employment_contracts')
          .update({ payments: updatedPayments })
          .eq('id', contractId)
      }
    } catch (error) {
      console.error('Failed to trigger milestone payment:', error)
      throw error
    }
  }

  // Performance Tracking
  async updatePerformanceMetrics(
    contractId: string,
    kpiId: string,
    actualValue: number,
    dataSource: string,
    verifier?: string
  ): Promise<void> {
    try {
      const { data: contract } = await supabase
        .from('smart_employment_contracts')
        .select('performance')
        .eq('id', contractId)
        .single()

      if (!contract) throw new Error('Contract not found')

      const updatedKPIs = contract.performance.kpis.map((kpi: KPI) => {
        if (kpi.id === kpiId) {
          return { ...kpi, actualValue }
        }
        return kpi
      })

      const performanceDataPoint: PerformanceDataPoint = {
        date: new Date().toISOString(),
        metric: kpiId,
        value: actualValue,
        context: dataSource,
        verified: !!verifier
      }

      const updatedPerformance = {
        ...contract.performance,
        kpis: updatedKPIs,
        performanceHistory: [...contract.performance.performanceHistory, performanceDataPoint]
      }

      await supabase
        .from('smart_employment_contracts')
        .update({ performance: updatedPerformance })
        .eq('id', contractId)

      // Check if performance triggers any automatic clauses
      await this.checkPerformanceTriggers(contractId, kpiId, actualValue)
    } catch (error) {
      console.error('Failed to update performance metrics:', error)
      throw error
    }
  }

  private async checkPerformanceTriggers(contractId: string, kpiId: string, value: number): Promise<void> {
    try {
      const { data: contract } = await supabase
        .from('smart_employment_contracts')
        .select('automatic_clauses')
        .eq('id', contractId)
        .single()

      const performanceClauses = contract?.automatic_clauses?.filter(
        (clause: AutomaticClause) => 
          clause.clauseType === 'performance_evaluation' && 
          clause.trigger.type === 'performance_threshold'
      ) || []

      for (const clause of performanceClauses) {
        if (clause.trigger.conditions.kpiId === kpiId) {
          const threshold = clause.trigger.conditions.threshold
          const operator = clause.trigger.conditions.operator || 'gte'

          let triggerMet = false
          switch (operator) {
            case 'gte':
              triggerMet = value >= threshold
              break
            case 'lte':
              triggerMet = value <= threshold
              break
            case 'eq':
              triggerMet = value === threshold
              break
          }

          if (triggerMet) {
            await this.executeAutomaticClause(contractId, clause.id, { kpiId, value, threshold })
          }
        }
      }
    } catch (error) {
      console.error('Failed to check performance triggers:', error)
    }
  }

  // Dispute Resolution
  async initiateDispute(
    contractId: string,
    disputeType: EscrowDispute['disputeType'],
    description: string,
    amount: number,
    evidence: Omit<Evidence, 'id' | 'submittedAt'>[]
  ): Promise<string> {
    try {
      const disputeId = this.generateId()
      
      const dispute: EscrowDispute = {
        id: disputeId,
        disputeType,
        initiatedBy: evidence[0]?.submittedBy || 'unknown',
        description,
        amount,
        evidence: evidence.map(e => ({
          ...e,
          id: this.generateId(),
          submittedAt: new Date().toISOString()
        })),
        status: 'open'
      }

      // Update contract with dispute
      const { data: contract } = await supabase
        .from('smart_employment_contracts')
        .select('escrow')
        .eq('id', contractId)
        .single()

      const updatedEscrow = {
        ...contract?.escrow,
        disputes: [...(contract?.escrow?.disputes || []), dispute]
      }

      await supabase
        .from('smart_employment_contracts')
        .update({ 
          escrow: updatedEscrow,
          status: 'disputed'
        })
        .eq('id', contractId)

      // Initiate blockchain dispute resolution
      await this.initiateBlockchainDispute(contractId, disputeId, amount)

      // Notify arbiter or dispute resolution service
      await this.notifyDisputeResolution(contractId, disputeId)

      return disputeId
    } catch (error) {
      console.error('Failed to initiate dispute:', error)
      throw error
    }
  }

  private async initiateBlockchainDispute(contractId: string, disputeId: string, amount: number): Promise<void> {
    try {
      const contract = this.contracts.get(contractId)
      if (contract && this.signer) {
        const tx = await contract.connect(this.signer).initiateDispute(disputeId, amount)
        await tx.wait()
      }
    } catch (error) {
      console.error('Failed to initiate blockchain dispute:', error)
    }
  }

  // Automatic Clause Execution
  private async setupAutomaticClauses(contractId: string, clauses: AutomaticClause[]): Promise<void> {
    try {
      for (const clause of clauses) {
        if (clause.isActive) {
          await this.scheduleClauseExecution(contractId, clause)
        }
      }
    } catch (error) {
      console.error('Failed to setup automatic clauses:', error)
    }
  }

  private async scheduleClauseExecution(contractId: string, clause: AutomaticClause): Promise<void> {
    // In production, this would integrate with a job scheduler like Cron or AWS Lambda
    // For demo purposes, we'll simulate immediate execution for time-based clauses
    
    if (clause.trigger.type === 'time_based') {
      setTimeout(async () => {
        await this.executeAutomaticClause(contractId, clause.id, { triggeredAt: new Date().toISOString() })
      }, 1000) // Simulate delayed execution
    }
  }

  private async executeAutomaticClause(contractId: string, clauseId: string, triggerData: any): Promise<void> {
    try {
      const { data: contract } = await supabase
        .from('smart_employment_contracts')
        .select('automatic_clauses')
        .eq('id', contractId)
        .single()

      const clause = contract?.automatic_clauses?.find((c: AutomaticClause) => c.id === clauseId)
      if (!clause) return

      let result: 'success' | 'failure' | 'partial' = 'success'
      let transactionHash: string | undefined
      let errorMessage: string | undefined

      try {
        switch (clause.action.type) {
          case 'payment':
            transactionHash = await this.executePaymentAction(contractId, clause.action.parameters)
            break
          case 'notification':
            await this.executeNotificationAction(contractId, clause.action.parameters)
            break
          case 'milestone_creation':
            await this.executeMilestoneCreationAction(contractId, clause.action.parameters)
            break
          case 'contract_amendment':
            await this.executeContractAmendmentAction(contractId, clause.action.parameters)
            break
          default:
            throw new Error(`Unknown action type: ${clause.action.type}`)
        }
      } catch (error) {
        result = 'failure'
        errorMessage = error.message
      }

      // Record execution
      const execution: ClauseExecution = {
        id: this.generateId(),
        executedAt: new Date().toISOString(),
        triggerData,
        actionTaken: clause.action.type,
        result,
        transactionHash,
        errorMessage
      }

      const updatedClauses = contract.automatic_clauses.map((c: AutomaticClause) => {
        if (c.id === clauseId) {
          return {
            ...c,
            executionHistory: [...c.executionHistory, execution]
          }
        }
        return c
      })

      await supabase
        .from('smart_employment_contracts')
        .update({ automatic_clauses: updatedClauses })
        .eq('id', contractId)
    } catch (error) {
      console.error('Failed to execute automatic clause:', error)
    }
  }

  private async executePaymentAction(contractId: string, parameters: any): Promise<string> {
    const contract = this.contracts.get(contractId)
    if (contract && this.signer) {
      const tx = await contract.connect(this.signer).executePayment(
        parameters.recipient,
        parameters.amount,
        parameters.reason
      )
      const receipt = await tx.wait()
      return receipt.transactionHash
    }
    throw new Error('Contract or signer not available')
  }

  private async executeNotificationAction(contractId: string, parameters: any): Promise<void> {
    await supabase
      .from('notifications')
      .insert({
        user_id: parameters.recipient,
        type: 'contract_notification',
        title: parameters.title,
        message: parameters.message,
        data: { contractId, automated: true },
        created_at: new Date().toISOString()
      })
  }

  private async executeMilestoneCreationAction(contractId: string, parameters: any): Promise<void> {
    // Create a new milestone based on the parameters
    const newMilestone: ContractMilestone = {
      id: this.generateId(),
      title: parameters.title,
      description: parameters.description,
      deliverables: parameters.deliverables || [],
      dueDate: parameters.dueDate,
      completionCriteria: parameters.completionCriteria || [],
      paymentTrigger: parameters.paymentTrigger || false,
      paymentAmount: parameters.paymentAmount,
      status: 'pending'
    }

    const { data: contract } = await supabase
      .from('smart_employment_contracts')
      .select('milestones')
      .eq('id', contractId)
      .single()

    const updatedMilestones = [...(contract?.milestones || []), newMilestone]

    await supabase
      .from('smart_employment_contracts')
      .update({ milestones: updatedMilestones })
      .eq('id', contractId)
  }

  private async executeContractAmendmentAction(contractId: string, parameters: any): Promise<void> {
    // Create a contract amendment based on the parameters
    const amendment: ContractAmendment = {
      id: this.generateId(),
      amendmentNumber: 1, // Would calculate based on existing amendments
      proposedBy: 'system',
      proposedAt: new Date().toISOString(),
      description: parameters.description,
      changedClauses: parameters.changedClauses || [],
      reasonForChange: parameters.reason || 'Automatic clause execution',
      status: 'proposed',
      legalReview: false
    }

    const { data: contract } = await supabase
      .from('smart_employment_contracts')
      .select('amendments')
      .eq('id', contractId)
      .single()

    const updatedAmendments = [...(contract?.amendments || []), amendment]

    await supabase
      .from('smart_employment_contracts')
      .update({ amendments: updatedAmendments })
      .eq('id', contractId)
  }

  // Helper Methods
  private async storeContractOnIPFS(data: any): Promise<string> {
    try {
      const dataString = JSON.stringify(data)
      const hash = crypto.createHash('sha256').update(dataString).digest('hex')
      
      await supabase
        .from('ipfs_storage')
        .insert({
          hash: `ipfs://${hash}`,
          data: data,
          size: dataString.length,
          uploaded_at: new Date().toISOString()
        })

      return `ipfs://${hash}`
    } catch (error) {
      console.error('Failed to store contract on IPFS:', error)
      throw error
    }
  }

  private async initializeEscrow(contractId: string, compensation: CompensationStructure): Promise<void> {
    try {
      const escrowAmount = Math.floor(compensation.totalCompensationValue * (compensation.escrowPercentage / 100))
      
      const contract = this.contracts.get(contractId)
      if (contract && this.signer) {
        const tx = await contract.connect(this.signer).initializeEscrow(escrowAmount, {
          value: ethers.utils.parseEther(escrowAmount.toString())
        })
        await tx.wait()
      }
    } catch (error) {
      console.error('Failed to initialize escrow:', error)
    }
  }

  private async startContractMonitoring(contractId: string): Promise<void> {
    // Start monitoring for automatic clause triggers, milestone deadlines, etc.
    // In production, this would set up event listeners and scheduled jobs
  }

  private async sendContractActivationNotifications(contractId: string): Promise<void> {
    const { data: contract } = await supabase
      .from('smart_employment_contracts')
      .select('employee_id, employer_id')
      .eq('id', contractId)
      .single()

    if (contract) {
      const notifications = [
        {
          user_id: contract.employee_id,
          type: 'contract_activated',
          title: 'Employment Contract Activated',
          message: 'Your smart employment contract is now active and in effect.',
          data: { contractId }
        },
        {
          user_id: contract.employer_id,
          type: 'contract_activated',
          title: 'Employment Contract Activated',
          message: 'The smart employment contract has been activated.',
          data: { contractId }
        }
      ]

      await supabase
        .from('notifications')
        .insert(notifications.map(n => ({
          ...n,
          created_at: new Date().toISOString()
        })))
    }
  }

  private async recordMilestoneCompletion(contractId: string, milestoneId: string): Promise<void> {
    try {
      const contract = this.contracts.get(contractId)
      if (contract && this.signer) {
        const tx = await contract.connect(this.signer).completeMilestone(milestoneId)
        await tx.wait()
      }
    } catch (error) {
      console.error('Failed to record milestone completion on blockchain:', error)
    }
  }

  private async notifyDisputeResolution(contractId: string, disputeId: string): Promise<void> {
    // Notify external dispute resolution service or arbiter
    // This would integrate with legal services or arbitration platforms
  }

  private getEmploymentContractABI(): any[] {
    // Return the ABI for the employment contract
    // This would be the actual smart contract ABI
    return []
  }

  private getEmploymentContractBytecode(): string {
    // Return the bytecode for the employment contract
    // This would be the actual compiled smart contract bytecode
    return '0x'
  }

  private generateContractId(): string {
    return 'emp_' + crypto.randomBytes(16).toString('hex')
  }

  private generateId(): string {
    return crypto.randomBytes(12).toString('hex')
  }

  // Public API Methods
  async getEmploymentContract(contractId: string): Promise<SmartEmploymentContract | null> {
    try {
      const { data, error } = await supabase
        .from('smart_employment_contracts')
        .select('*')
        .eq('id', contractId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get employment contract:', error)
      return null
    }
  }

  async getUserEmploymentContracts(userId: string, role: 'employee' | 'employer'): Promise<SmartEmploymentContract[]> {
    try {
      const field = role === 'employee' ? 'employee_id' : 'employer_id'
      
      const { data, error } = await supabase
        .from('smart_employment_contracts')
        .select('*')
        .eq(field, userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to get user employment contracts:', error)
      return []
    }
  }

  async getContractPerformanceMetrics(contractId: string): Promise<any> {
    try {
      const { data: contract } = await supabase
        .from('smart_employment_contracts')
        .select('performance')
        .eq('id', contractId)
        .single()

      if (!contract) return null

      return {
        kpis: contract.performance.kpis,
        overallRating: contract.performance.overallRating,
        performanceHistory: contract.performance.performanceHistory,
        recentReviews: contract.performance.reviewPeriods?.slice(-3) || []
      }
    } catch (error) {
      console.error('Failed to get contract performance metrics:', error)
      return null
    }
  }

  async getContractFinancials(contractId: string): Promise<any> {
    try {
      const { data: contract } = await supabase
        .from('smart_employment_contracts')
        .select('compensation, payments, escrow')
        .eq('id', contractId)
        .single()

      if (!contract) return null

      const totalPaid = contract.payments?.reduce((sum: number, payment: PaymentRecord) => {
        return payment.status === 'completed' ? sum + payment.amount : sum
      }, 0) || 0

      const escrowBalance = contract.escrow?.totalAmount || 0
      const pendingPayments = contract.payments?.filter((p: PaymentRecord) => p.status === 'pending').length || 0

      return {
        totalCompensation: contract.compensation.totalCompensationValue,
        totalPaid,
        escrowBalance,
        pendingPayments,
        paymentHistory: contract.payments || [],
        compensationStructure: contract.compensation
      }
    } catch (error) {
      console.error('Failed to get contract financials:', error)
      return null
    }
  }
}

export default SmartEmploymentContractSystem