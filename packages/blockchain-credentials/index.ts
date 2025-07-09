import { createClient } from '@supabase/supabase-js'
import { ethers } from 'ethers'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface BlockchainCredential {
  id: string
  userId: string
  credentialType: 'degree' | 'certification' | 'skill_verification' | 'work_experience' | 'achievement' | 'project_portfolio'
  title: string
  description: string
  issuer: string
  issuerVerified: boolean
  issuerAddress: string
  metadata: CredentialMetadata
  blockchainData: BlockchainData
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired'
  issuedAt: string
  expiresAt?: string
  revokedAt?: string
  verificationProofs: VerificationProof[]
  visibility: 'public' | 'private' | 'connections_only'
  shareableUrl: string
  qrCode: string
  createdAt: string
  updatedAt: string
}

export interface CredentialMetadata {
  institution?: string
  degree?: string
  major?: string
  graduationDate?: string
  gpa?: number
  honors?: string[]
  coursework?: string[]
  skills?: SkillVerification[]
  projects?: ProjectVerification[]
  certificationLevel?: string
  certificationNumber?: string
  examScore?: number
  workRole?: string
  workDuration?: {
    start: string
    end?: string
  }
  responsibilities?: string[]
  achievements?: string[]
  technologies?: string[]
  companySize?: string
  reportingStructure?: string
}

export interface SkillVerification {
  skill: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  assessmentScore?: number
  assessmentDate?: string
  assessmentProvider?: string
  projectEvidence?: string[]
  peerEndorsements?: PeerEndorsement[]
}

export interface ProjectVerification {
  projectName: string
  description: string
  role: string
  technologies: string[]
  duration: string
  outcome: string
  githubUrl?: string
  liveUrl?: string
  documentation?: string[]
  teamSize?: number
  impact?: string
}

export interface PeerEndorsement {
  endorserId: string
  endorserName: string
  relationship: string
  endorsementText: string
  endorsedAt: string
  verificationLevel: 'basic' | 'verified' | 'blockchain_verified'
}

export interface BlockchainData {
  transactionHash: string
  blockNumber: number
  contractAddress: string
  tokenId?: string
  ipfsHash: string
  merkleRoot: string
  networkId: number
  gasUsed: number
  confirmations: number
  timestamp: string
}

export interface VerificationProof {
  id: string
  proofType: 'document_scan' | 'institution_api' | 'third_party_verification' | 'blockchain_witness' | 'biometric_verification'
  proofData: any
  verifierAddress?: string
  verifierSignature?: string
  verificationScore: number // 0-100
  verifiedAt: string
  expiresAt?: string
}

export interface CredentialTemplate {
  id: string
  type: string
  name: string
  description: string
  requiredFields: TemplateField[]
  optionalFields: TemplateField[]
  verificationRequirements: VerificationRequirement[]
  issuingAuthorities: string[]
  smartContractTemplate: string
  metadataSchema: any
  displayTemplate: string
  isActive: boolean
}

export interface TemplateField {
  fieldName: string
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'file' | 'array'
  displayName: string
  description: string
  required: boolean
  validation: FieldValidation
}

export interface FieldValidation {
  pattern?: string
  minLength?: number
  maxLength?: number
  minValue?: number
  maxValue?: number
  allowedValues?: string[]
  fileTypes?: string[]
  maxFileSize?: number
}

export interface VerificationRequirement {
  type: string
  description: string
  minimumScore: number
  requiredProofs: string[]
  automaticVerification: boolean
  manualReviewRequired: boolean
}

export interface SmartContract {
  id: string
  contractAddress: string
  networkId: number
  contractType: 'credential_registry' | 'verification_oracle' | 'reputation_system' | 'employment_agreement'
  abi: any[]
  bytecode: string
  deployedAt: string
  deployerAddress: string
  gasLimit: number
  isActive: boolean
}

export interface VerificationOracle {
  id: string
  name: string
  description: string
  oracleAddress: string
  supportedCredentialTypes: string[]
  verificationMethods: string[]
  trustScore: number // 0-100
  apiEndpoint?: string
  apiKey?: string
  costPerVerification: number
  averageResponseTime: number // seconds
  successRate: number // 0-100
  isActive: boolean
}

export interface CredentialRevocation {
  id: string
  credentialId: string
  reason: 'expired' | 'invalid' | 'fraud' | 'institution_request' | 'user_request' | 'technical_error'
  revokedBy: string
  revokedAt: string
  blockchainTransactionHash: string
  evidence?: any
  appealable: boolean
  appealDeadline?: string
}

export interface BlockchainWallet {
  id: string
  userId: string
  walletAddress: string
  privateKeyEncrypted: string
  walletType: 'generated' | 'imported' | 'hardware'
  networkSupport: number[]
  balance: { [networkId: number]: string }
  isActive: boolean
  createdAt: string
  lastUsed?: string
}

export interface CredentialNFT {
  id: string
  credentialId: string
  tokenId: string
  contractAddress: string
  networkId: number
  ownerAddress: string
  metadataURI: string
  imageURI: string
  attributes: NFTAttribute[]
  transferable: boolean
  tradeable: boolean
  mintedAt: string
  lastTransferred?: string
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: 'number' | 'date' | 'boost_percentage' | 'boost_number'
  max_value?: number
}

export interface VerificationBadge {
  id: string
  userId: string
  badgeType: 'institution_verified' | 'skill_verified' | 'experience_verified' | 'project_verified' | 'peer_endorsed'
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  credentialIds: string[]
  verificationScore: number
  earnedAt: string
  isVisible: boolean
  shareableUrl: string
}

export class BlockchainCredentialSystem {
  private provider: ethers.providers.Provider
  private signer: ethers.Signer
  private contracts: Map<string, ethers.Contract> = new Map()

  constructor(privateKey?: string) {
    // Initialize blockchain connection
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'https://polygon-rpc.com'
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider)
    }
    
    this.initializeContracts()
  }

  private async initializeContracts(): Promise<void> {
    try {
      // Load deployed smart contracts
      const { data: contracts } = await supabase
        .from('smart_contracts')
        .select('*')
        .eq('is_active', true)

      contracts?.forEach(contract => {
        const ethersContract = new ethers.Contract(
          contract.contract_address,
          contract.abi,
          this.provider
        )
        this.contracts.set(contract.contract_type, ethersContract)
      })
    } catch (error) {
      console.error('Failed to initialize contracts:', error)
    }
  }

  // Credential Creation & Issuance
  async createCredential(
    userId: string,
    credentialData: Omit<BlockchainCredential, 'id' | 'blockchainData' | 'verificationStatus' | 'shareableUrl' | 'qrCode' | 'createdAt' | 'updatedAt'>
  ): Promise<BlockchainCredential> {
    try {
      // Generate credential ID
      const credentialId = this.generateCredentialId()

      // Prepare metadata for IPFS storage
      const metadata = {
        ...credentialData,
        id: credentialId,
        version: '1.0',
        standard: 'W3C Verifiable Credentials',
        proof: {
          type: 'BlockchainSignature2025',
          created: new Date().toISOString(),
          proofPurpose: 'assertionMethod'
        }
      }

      // Store metadata on IPFS
      const ipfsHash = await this.storeOnIPFS(metadata)

      // Create blockchain transaction
      const blockchainData = await this.mintCredentialNFT(credentialId, ipfsHash, credentialData.issuerAddress)

      // Generate shareable URL and QR code
      const shareableUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${credentialId}`
      const qrCode = await this.generateQRCode(shareableUrl)

      const credential: BlockchainCredential = {
        ...credentialData,
        id: credentialId,
        blockchainData,
        verificationStatus: 'pending',
        shareableUrl,
        qrCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Store in database
      await supabase
        .from('blockchain_credentials')
        .insert({
          id: credential.id,
          user_id: credential.userId,
          credential_type: credential.credentialType,
          title: credential.title,
          description: credential.description,
          issuer: credential.issuer,
          issuer_verified: credential.issuerVerified,
          issuer_address: credential.issuerAddress,
          metadata: credential.metadata,
          blockchain_data: credential.blockchainData,
          verification_status: credential.verificationStatus,
          issued_at: credential.issuedAt,
          expires_at: credential.expiresAt,
          verification_proofs: credential.verificationProofs,
          visibility: credential.visibility,
          shareable_url: credential.shareableUrl,
          qr_code: credential.qrCode,
          created_at: credential.createdAt,
          updated_at: credential.updatedAt
        })

      // Initiate verification process
      await this.initiateVerification(credentialId)

      return credential
    } catch (error) {
      console.error('Failed to create credential:', error)
      throw error
    }
  }

  private async mintCredentialNFT(credentialId: string, ipfsHash: string, issuerAddress: string): Promise<BlockchainData> {
    try {
      const credentialContract = this.contracts.get('credential_registry')
      if (!credentialContract || !this.signer) {
        throw new Error('Contract or signer not available')
      }

      // Mint NFT with credential data
      const tx = await credentialContract.connect(this.signer).mintCredential(
        issuerAddress,
        credentialId,
        ipfsHash,
        { gasLimit: 500000 }
      )

      const receipt = await tx.wait()

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        contractAddress: credentialContract.address,
        tokenId: receipt.events?.find((e: any) => e.event === 'CredentialMinted')?.args?.tokenId?.toString(),
        ipfsHash,
        merkleRoot: receipt.events?.find((e: any) => e.event === 'CredentialMinted')?.args?.merkleRoot || '',
        networkId: await this.provider.getNetwork().then(n => n.chainId),
        gasUsed: receipt.gasUsed.toNumber(),
        confirmations: receipt.confirmations,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to mint credential NFT:', error)
      throw error
    }
  }

  private async storeOnIPFS(data: any): Promise<string> {
    try {
      // In production, this would use a service like Pinata or IPFS directly
      // For demo purposes, we'll simulate IPFS storage
      const dataString = JSON.stringify(data)
      const hash = crypto.createHash('sha256').update(dataString).digest('hex')
      
      // Store data reference in our system (simulating IPFS)
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
      console.error('Failed to store on IPFS:', error)
      throw error
    }
  }

  // Verification System
  async verifyCredential(credentialId: string): Promise<{
    isValid: boolean
    verificationScore: number
    verificationDetails: any
    trustScore: number
  }> {
    try {
      // Get credential from database
      const { data: credential } = await supabase
        .from('blockchain_credentials')
        .select('*')
        .eq('id', credentialId)
        .single()

      if (!credential) {
        throw new Error('Credential not found')
      }

      // Verify blockchain transaction
      const blockchainValid = await this.verifyBlockchainTransaction(credential.blockchain_data)

      // Verify IPFS data integrity
      const ipfsValid = await this.verifyIPFSData(credential.blockchain_data.ipfs_hash, credential)

      // Verify issuer signature
      const issuerValid = await this.verifyIssuerSignature(credential)

      // Check for revocation
      const isRevoked = await this.checkRevocationStatus(credentialId)

      // Calculate verification score
      const verificationScore = this.calculateVerificationScore({
        blockchainValid,
        ipfsValid,
        issuerValid,
        isRevoked,
        proofCount: credential.verification_proofs?.length || 0
      })

      // Calculate trust score based on issuer reputation
      const trustScore = await this.calculateTrustScore(credential.issuer_address)

      const verificationDetails = {
        blockchainVerification: blockchainValid,
        dataIntegrity: ipfsValid,
        issuerVerification: issuerValid,
        revocationStatus: !isRevoked,
        proofCount: credential.verification_proofs?.length || 0,
        verifiedAt: new Date().toISOString()
      }

      return {
        isValid: blockchainValid && ipfsValid && issuerValid && !isRevoked,
        verificationScore,
        verificationDetails,
        trustScore
      }
    } catch (error) {
      console.error('Failed to verify credential:', error)
      return {
        isValid: false,
        verificationScore: 0,
        verificationDetails: { error: error.message },
        trustScore: 0
      }
    }
  }

  private async verifyBlockchainTransaction(blockchainData: any): Promise<boolean> {
    try {
      const transaction = await this.provider.getTransaction(blockchainData.transaction_hash)
      return transaction !== null && transaction.blockNumber === blockchainData.block_number
    } catch (error) {
      console.error('Blockchain verification failed:', error)
      return false
    }
  }

  private async verifyIPFSData(ipfsHash: string, credentialData: any): Promise<boolean> {
    try {
      // Retrieve data from IPFS and compare with stored credential
      const { data: ipfsData } = await supabase
        .from('ipfs_storage')
        .select('data')
        .eq('hash', ipfsHash)
        .single()

      if (!ipfsData) return false

      // Compare critical fields
      const storedData = ipfsData.data
      return (
        storedData.id === credentialData.id &&
        storedData.issuer === credentialData.issuer &&
        storedData.title === credentialData.title
      )
    } catch (error) {
      console.error('IPFS verification failed:', error)
      return false
    }
  }

  private async verifyIssuerSignature(credential: any): Promise<boolean> {
    try {
      // Verify the issuer's digital signature
      const credentialContract = this.contracts.get('credential_registry')
      if (!credentialContract) return false

      const isVerifiedIssuer = await credentialContract.isVerifiedIssuer(credential.issuer_address)
      return isVerifiedIssuer && credential.issuer_verified
    } catch (error) {
      console.error('Issuer verification failed:', error)
      return false
    }
  }

  private async checkRevocationStatus(credentialId: string): Promise<boolean> {
    try {
      const { data: revocation } = await supabase
        .from('credential_revocations')
        .select('*')
        .eq('credential_id', credentialId)
        .single()

      return revocation !== null
    } catch (error) {
      return false // Not revoked if no revocation record found
    }
  }

  private calculateVerificationScore(factors: {
    blockchainValid: boolean
    ipfsValid: boolean
    issuerValid: boolean
    isRevoked: boolean
    proofCount: number
  }): number {
    let score = 0

    if (factors.blockchainValid) score += 30
    if (factors.ipfsValid) score += 25
    if (factors.issuerValid) score += 25
    if (!factors.isRevoked) score += 10
    
    // Bonus points for additional verification proofs
    score += Math.min(factors.proofCount * 2, 10)

    return Math.min(score, 100)
  }

  private async calculateTrustScore(issuerAddress: string): Promise<number> {
    try {
      // Get issuer's historical verification success rate
      const { data: issuerStats } = await supabase
        .from('issuer_statistics')
        .select('*')
        .eq('issuer_address', issuerAddress)
        .single()

      if (!issuerStats) return 50 // Default trust score for new issuers

      return Math.min(
        (issuerStats.successful_verifications / issuerStats.total_issued) * 100,
        100
      )
    } catch (error) {
      return 50
    }
  }

  // Credential Management
  async getUserCredentials(userId: string, includePrivate: boolean = false): Promise<BlockchainCredential[]> {
    try {
      let query = supabase
        .from('blockchain_credentials')
        .select('*')
        .eq('user_id', userId)

      if (!includePrivate) {
        query = query.neq('visibility', 'private')
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to get user credentials:', error)
      throw error
    }
  }

  async shareCredential(credentialId: string, shareWith: string[]): Promise<string> {
    try {
      // Create a temporary share link with access controls
      const shareToken = this.generateShareToken()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await supabase
        .from('credential_shares')
        .insert({
          credential_id: credentialId,
          share_token: shareToken,
          shared_with: shareWith,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        })

      return `${process.env.NEXT_PUBLIC_APP_URL}/verify/shared/${shareToken}`
    } catch (error) {
      console.error('Failed to share credential:', error)
      throw error
    }
  }

  async revokeCredential(
    credentialId: string,
    reason: CredentialRevocation['reason'],
    revokedBy: string,
    evidence?: any
  ): Promise<void> {
    try {
      // Create blockchain revocation transaction
      const credentialContract = this.contracts.get('credential_registry')
      if (credentialContract && this.signer) {
        const tx = await credentialContract.connect(this.signer).revokeCredential(credentialId)
        const receipt = await tx.wait()

        // Record revocation
        await supabase
          .from('credential_revocations')
          .insert({
            id: this.generateId(),
            credential_id: credentialId,
            reason,
            revoked_by: revokedBy,
            revoked_at: new Date().toISOString(),
            blockchain_transaction_hash: receipt.transactionHash,
            evidence,
            appealable: reason !== 'fraud',
            appeal_deadline: reason !== 'fraud' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
          })

        // Update credential status
        await supabase
          .from('blockchain_credentials')
          .update({
            verification_status: 'rejected',
            revoked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', credentialId)
      }
    } catch (error) {
      console.error('Failed to revoke credential:', error)
      throw error
    }
  }

  // Verification Oracles & Third-party Integration
  async initiateVerification(credentialId: string): Promise<void> {
    try {
      const { data: credential } = await supabase
        .from('blockchain_credentials')
        .select('*')
        .eq('id', credentialId)
        .single()

      if (!credential) throw new Error('Credential not found')

      // Get appropriate verification oracles for this credential type
      const { data: oracles } = await supabase
        .from('verification_oracles')
        .select('*')
        .contains('supported_credential_types', [credential.credential_type])
        .eq('is_active', true)
        .order('trust_score', { ascending: false })

      // Initiate verification with multiple oracles for redundancy
      for (const oracle of oracles?.slice(0, 3) || []) {
        await this.requestOracleVerification(credentialId, oracle.id)
      }
    } catch (error) {
      console.error('Failed to initiate verification:', error)
    }
  }

  private async requestOracleVerification(credentialId: string, oracleId: string): Promise<void> {
    try {
      // This would integrate with external verification services
      // For demo purposes, we'll simulate the verification process
      
      await supabase
        .from('verification_requests')
        .insert({
          id: this.generateId(),
          credential_id: credentialId,
          oracle_id: oracleId,
          status: 'pending',
          requested_at: new Date().toISOString()
        })

      // Simulate async verification result (in production, this would be a webhook)
      setTimeout(async () => {
        await this.processVerificationResult(credentialId, oracleId, {
          verified: Math.random() > 0.1, // 90% success rate
          score: Math.floor(Math.random() * 30) + 70, // 70-100 score
          details: 'Automated verification completed'
        })
      }, Math.random() * 5000 + 1000) // 1-6 seconds delay
    } catch (error) {
      console.error('Failed to request oracle verification:', error)
    }
  }

  private async processVerificationResult(
    credentialId: string,
    oracleId: string,
    result: { verified: boolean; score: number; details: string }
  ): Promise<void> {
    try {
      // Record verification proof
      const proof: VerificationProof = {
        id: this.generateId(),
        proofType: 'third_party_verification',
        proofData: result,
        verificationScore: result.score,
        verifiedAt: new Date().toISOString()
      }

      // Update credential with verification proof
      const { data: credential } = await supabase
        .from('blockchain_credentials')
        .select('verification_proofs')
        .eq('id', credentialId)
        .single()

      const updatedProofs = [...(credential?.verification_proofs || []), proof]

      await supabase
        .from('blockchain_credentials')
        .update({
          verification_proofs: updatedProofs,
          verification_status: result.verified ? 'verified' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', credentialId)

      // Update verification request status
      await supabase
        .from('verification_requests')
        .update({
          status: 'completed',
          result: result,
          completed_at: new Date().toISOString()
        })
        .eq('credential_id', credentialId)
        .eq('oracle_id', oracleId)
    } catch (error) {
      console.error('Failed to process verification result:', error)
    }
  }

  // Portfolio & Achievement System
  async generateVerifiedPortfolio(userId: string): Promise<{
    portfolioUrl: string
    verificationScore: number
    credentialSummary: any
    trustBadges: VerificationBadge[]
  }> {
    try {
      const credentials = await this.getUserCredentials(userId, false)
      const verifiedCredentials = credentials.filter(c => c.verificationStatus === 'verified')

      // Calculate overall verification score
      const totalScore = verifiedCredentials.reduce((sum, cred) => {
        const credScore = cred.verificationProofs.reduce((pSum, proof) => pSum + proof.verificationScore, 0) / Math.max(cred.verificationProofs.length, 1)
        return sum + credScore
      }, 0)
      const averageScore = Math.round(totalScore / Math.max(verifiedCredentials.length, 1))

      // Generate credential summary
      const credentialSummary = {
        totalCredentials: verifiedCredentials.length,
        byType: this.groupCredentialsByType(verifiedCredentials),
        latestCredentials: verifiedCredentials.slice(0, 5),
        topSkills: this.extractTopSkills(verifiedCredentials),
        careerProgression: this.analyzeCareerProgression(verifiedCredentials)
      }

      // Generate trust badges
      const trustBadges = await this.generateTrustBadges(userId, verifiedCredentials)

      // Create portfolio URL
      const portfolioToken = this.generateShareToken()
      await supabase
        .from('verified_portfolios')
        .insert({
          user_id: userId,
          portfolio_token: portfolioToken,
          verification_score: averageScore,
          credential_summary: credentialSummary,
          trust_badges: trustBadges,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      return {
        portfolioUrl: `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${portfolioToken}`,
        verificationScore: averageScore,
        credentialSummary,
        trustBadges
      }
    } catch (error) {
      console.error('Failed to generate verified portfolio:', error)
      throw error
    }
  }

  private groupCredentialsByType(credentials: BlockchainCredential[]): { [type: string]: number } {
    return credentials.reduce((acc, cred) => {
      acc[cred.credentialType] = (acc[cred.credentialType] || 0) + 1
      return acc
    }, {} as { [type: string]: number })
  }

  private extractTopSkills(credentials: BlockchainCredential[]): string[] {
    const skillCount = new Map<string, number>()
    
    credentials.forEach(cred => {
      cred.metadata.skills?.forEach(skill => {
        skillCount.set(skill.skill, (skillCount.get(skill.skill) || 0) + 1)
      })
    })

    return Array.from(skillCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill]) => skill)
  }

  private analyzeCareerProgression(credentials: BlockchainCredential[]): any {
    const workExperience = credentials
      .filter(c => c.credentialType === 'work_experience')
      .sort((a, b) => new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime())

    return {
      totalExperience: workExperience.length,
      careerPath: workExperience.map(exp => ({
        role: exp.metadata.workRole,
        company: exp.issuer,
        duration: exp.metadata.workDuration,
        technologies: exp.metadata.technologies
      })),
      growthTrend: this.calculateGrowthTrend(workExperience)
    }
  }

  private calculateGrowthTrend(experiences: BlockchainCredential[]): 'ascending' | 'lateral' | 'declining' {
    // Simplified growth trend calculation
    if (experiences.length < 2) return 'ascending'
    
    // In a real implementation, this would analyze role seniority, salary progression, etc.
    return 'ascending'
  }

  private async generateTrustBadges(userId: string, credentials: BlockchainCredential[]): Promise<VerificationBadge[]> {
    const badges: VerificationBadge[] = []

    // Institution verified badge
    const institutionCredentials = credentials.filter(c => 
      c.credentialType === 'degree' && c.issuerVerified
    )
    if (institutionCredentials.length > 0) {
      badges.push({
        id: this.generateId(),
        userId,
        badgeType: 'institution_verified',
        level: institutionCredentials.length >= 3 ? 'gold' : institutionCredentials.length >= 2 ? 'silver' : 'bronze',
        credentialIds: institutionCredentials.map(c => c.id),
        verificationScore: 95,
        earnedAt: new Date().toISOString(),
        isVisible: true,
        shareableUrl: `${process.env.NEXT_PUBLIC_APP_URL}/badge/${this.generateShareToken()}`
      })
    }

    // Skill verified badge
    const skillCredentials = credentials.filter(c => 
      c.credentialType === 'skill_verification' && c.verificationStatus === 'verified'
    )
    if (skillCredentials.length >= 5) {
      badges.push({
        id: this.generateId(),
        userId,
        badgeType: 'skill_verified',
        level: skillCredentials.length >= 15 ? 'platinum' : skillCredentials.length >= 10 ? 'gold' : 'silver',
        credentialIds: skillCredentials.map(c => c.id),
        verificationScore: 90,
        earnedAt: new Date().toISOString(),
        isVisible: true,
        shareableUrl: `${process.env.NEXT_PUBLIC_APP_URL}/badge/${this.generateShareToken()}`
      })
    }

    return badges
  }

  // Helper Methods
  private generateCredentialId(): string {
    return 'cred_' + crypto.randomBytes(16).toString('hex')
  }

  private generateId(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  private generateShareToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  private async generateQRCode(url: string): Promise<string> {
    // In production, this would use a QR code library
    // For demo purposes, return a placeholder
    return `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" font-size="10">QR: ${url}</text></svg>`).toString('base64')}`
  }

  // Public API Methods
  async getPublicCredential(credentialId: string): Promise<BlockchainCredential | null> {
    try {
      const { data, error } = await supabase
        .from('blockchain_credentials')
        .select('*')
        .eq('id', credentialId)
        .neq('visibility', 'private')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to get public credential:', error)
      return null
    }
  }

  async searchVerifiedCredentials(filters: {
    credentialType?: string
    issuer?: string
    skills?: string[]
    location?: string
    dateRange?: { start: string; end: string }
  }): Promise<BlockchainCredential[]> {
    try {
      let query = supabase
        .from('blockchain_credentials')
        .select('*')
        .eq('verification_status', 'verified')
        .eq('visibility', 'public')

      if (filters.credentialType) {
        query = query.eq('credential_type', filters.credentialType)
      }

      if (filters.issuer) {
        query = query.ilike('issuer', `%${filters.issuer}%`)
      }

      if (filters.dateRange) {
        query = query.gte('issued_at', filters.dateRange.start)
                    .lte('issued_at', filters.dateRange.end)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to search verified credentials:', error)
      return []
    }
  }

  async getVerificationStatistics(): Promise<{
    totalCredentials: number
    verifiedCredentials: number
    verificationRate: number
    topIssuers: Array<{ issuer: string; count: number }>
    popularCredentialTypes: Array<{ type: string; count: number }>
  }> {
    try {
      const [totalCount, verifiedCount, issuerStats, typeStats] = await Promise.all([
        supabase.from('blockchain_credentials').select('count'),
        supabase.from('blockchain_credentials').select('count').eq('verification_status', 'verified'),
        supabase.from('blockchain_credentials').select('issuer').eq('verification_status', 'verified'),
        supabase.from('blockchain_credentials').select('credential_type').eq('verification_status', 'verified')
      ])

      const total = totalCount.data?.[0]?.count || 0
      const verified = verifiedCount.data?.[0]?.count || 0
      const verificationRate = total > 0 ? (verified / total) * 100 : 0

      // Calculate top issuers
      const issuerMap = new Map<string, number>()
      issuerStats.data?.forEach(item => {
        issuerMap.set(item.issuer, (issuerMap.get(item.issuer) || 0) + 1)
      })
      const topIssuers = Array.from(issuerMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([issuer, count]) => ({ issuer, count }))

      // Calculate popular credential types
      const typeMap = new Map<string, number>()
      typeStats.data?.forEach(item => {
        typeMap.set(item.credential_type, (typeMap.get(item.credential_type) || 0) + 1)
      })
      const popularCredentialTypes = Array.from(typeMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([type, count]) => ({ type, count }))

      return {
        totalCredentials: total,
        verifiedCredentials: verified,
        verificationRate,
        topIssuers,
        popularCredentialTypes
      }
    } catch (error) {
      console.error('Failed to get verification statistics:', error)
      return {
        totalCredentials: 0,
        verifiedCredentials: 0,
        verificationRate: 0,
        topIssuers: [],
        popularCredentialTypes: []
      }
    }
  }
}

export default BlockchainCredentialSystem