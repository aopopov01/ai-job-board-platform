import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ReferralProgram {
  id: string
  name: string
  description: string
  type: 'candidate' | 'recruiter' | 'both'
  rewards: ReferralReward[]
  conditions: ReferralCondition[]
  isActive: boolean
  validFrom: string
  validTo?: string
  maxRedemptions?: number
  currentRedemptions: number
}

export interface ReferralReward {
  trigger: 'signup' | 'first_application' | 'first_hire' | 'subscription' | 'first_job_post'
  rewardType: 'credit' | 'cash' | 'subscription_discount' | 'feature_unlock'
  amount: number
  currency?: string
  description: string
}

export interface ReferralCondition {
  type: 'min_applications' | 'min_hires' | 'time_limit' | 'user_type' | 'subscription_tier'
  value: any
  description: string
}

export interface Referral {
  id: string
  referrerId: string
  refereeId?: string
  code: string
  programId: string
  status: 'pending' | 'completed' | 'expired' | 'cancelled'
  rewardsGiven: ReferralReward[]
  createdAt: string
  completedAt?: string
  metadata?: any
}

export interface ReferralStats {
  totalReferrals: number
  completedReferrals: number
  pendingReferrals: number
  totalRewards: number
  conversionRate: number
  topReferrers: Array<{
    userId: string
    name: string
    referralCount: number
    rewardsEarned: number
  }>
}

export class ReferralEngine {
  private programs: Map<string, ReferralProgram> = new Map()
  private activeCodes: Map<string, Referral> = new Map()

  constructor() {
    this.initializeDefaultPrograms()
    this.loadExistingReferrals()
  }

  private async initializeDefaultPrograms() {
    const defaultPrograms: Omit<ReferralProgram, 'id' | 'currentRedemptions'>[] = [
      {
        name: 'Candidate Referral Program',
        description: 'Refer talented candidates and earn rewards',
        type: 'candidate',
        rewards: [
          {
            trigger: 'signup',
            rewardType: 'credit',
            amount: 10,
            currency: 'USD',
            description: '$10 credit when referred candidate signs up'
          },
          {
            trigger: 'first_hire',
            rewardType: 'cash',
            amount: 100,
            currency: 'USD',
            description: '$100 bonus when referred candidate gets hired'
          }
        ],
        conditions: [
          {
            type: 'time_limit',
            value: 30, // days
            description: 'Referred candidate must sign up within 30 days'
          }
        ],
        isActive: true,
        validFrom: new Date().toISOString(),
        maxRedemptions: 1000
      },
      {
        name: 'Recruiter Referral Program',
        description: 'Invite recruiters and grow the platform',
        type: 'recruiter',
        rewards: [
          {
            trigger: 'signup',
            rewardType: 'credit',
            amount: 25,
            currency: 'USD',
            description: '$25 credit when referred recruiter signs up'
          },
          {
            trigger: 'subscription',
            rewardType: 'cash',
            amount: 50,
            currency: 'USD',
            description: '$50 when referred recruiter subscribes to paid plan'
          },
          {
            trigger: 'first_job_post',
            rewardType: 'subscription_discount',
            amount: 20,
            description: '20% discount on next subscription renewal'
          }
        ],
        conditions: [
          {
            type: 'min_hires',
            value: 1,
            description: 'Referred recruiter must make at least 1 hire'
          }
        ],
        isActive: true,
        validFrom: new Date().toISOString(),
        maxRedemptions: 500
      },
      {
        name: 'VIP Referral Program',
        description: 'Exclusive program for top performers',
        type: 'both',
        rewards: [
          {
            trigger: 'signup',
            rewardType: 'credit',
            amount: 50,
            currency: 'USD',
            description: '$50 credit for VIP referrals'
          },
          {
            trigger: 'first_hire',
            rewardType: 'cash',
            amount: 200,
            currency: 'USD',
            description: '$200 bonus for successful hires'
          },
          {
            trigger: 'subscription',
            rewardType: 'feature_unlock',
            amount: 1,
            description: 'Unlock premium features for 3 months'
          }
        ],
        conditions: [
          {
            type: 'user_type',
            value: 'vip',
            description: 'Only available to VIP users'
          },
          {
            type: 'min_hires',
            value: 5,
            description: 'Referrer must have made at least 5 successful hires'
          }
        ],
        isActive: true,
        validFrom: new Date().toISOString(),
        maxRedemptions: 100
      }
    ]

    for (const program of defaultPrograms) {
      await this.createProgram(program)
    }
  }

  private async loadExistingReferrals() {
    try {
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('status', 'pending')

      referrals?.forEach(referral => {
        this.activeCodes.set(referral.code, referral)
      })
    } catch (error) {
      console.error('Failed to load existing referrals:', error)
    }
  }

  async createProgram(programData: Omit<ReferralProgram, 'id' | 'currentRedemptions'>): Promise<ReferralProgram> {
    const program: ReferralProgram = {
      ...programData,
      id: this.generateId(),
      currentRedemptions: 0
    }

    try {
      await supabase
        .from('referral_programs')
        .insert({
          id: program.id,
          name: program.name,
          description: program.description,
          type: program.type,
          rewards: program.rewards,
          conditions: program.conditions,
          is_active: program.isActive,
          valid_from: program.validFrom,
          valid_to: program.validTo,
          max_redemptions: program.maxRedemptions,
          current_redemptions: program.currentRedemptions
        })

      this.programs.set(program.id, program)
      return program
    } catch (error) {
      console.error('Failed to create referral program:', error)
      throw error
    }
  }

  async generateReferralCode(referrerId: string, programId?: string): Promise<string> {
    // Get user info to determine appropriate program
    const { data: user } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', referrerId)
      .single()

    if (!user) {
      throw new Error('User not found')
    }

    // Select program based on user type and performance if not specified
    const selectedProgramId = programId || await this.selectProgramForUser(user)
    const program = this.programs.get(selectedProgramId)

    if (!program || !program.isActive) {
      throw new Error('Invalid or inactive referral program')
    }

    // Check if user meets program conditions
    const meetsConditions = await this.checkUserMeetsConditions(user, program.conditions)
    if (!meetsConditions) {
      throw new Error('User does not meet program requirements')
    }

    // Generate unique referral code
    let code: string
    let attempts = 0
    do {
      code = this.generateUniqueCode(user.first_name, user.last_name)
      attempts++
    } while (this.activeCodes.has(code) && attempts < 10)

    if (attempts >= 10) {
      throw new Error('Unable to generate unique referral code')
    }

    // Create referral record
    const referral: Referral = {
      id: this.generateId(),
      referrerId,
      code,
      programId: selectedProgramId,
      status: 'pending',
      rewardsGiven: [],
      createdAt: new Date().toISOString(),
      metadata: {
        userType: user.role,
        generatedBy: 'system'
      }
    }

    try {
      await supabase
        .from('referrals')
        .insert({
          id: referral.id,
          referrer_id: referral.referrerId,
          code: referral.code,
          program_id: referral.programId,
          status: referral.status,
          rewards_given: referral.rewardsGiven,
          created_at: referral.createdAt,
          metadata: referral.metadata
        })

      this.activeCodes.set(code, referral)
      return code
    } catch (error) {
      console.error('Failed to create referral:', error)
      throw error
    }
  }

  async applyReferralCode(code: string, newUserId: string): Promise<boolean> {
    const referral = this.activeCodes.get(code)
    if (!referral) {
      return false
    }

    const program = this.programs.get(referral.programId)
    if (!program || !program.isActive) {
      return false
    }

    // Check if referral is still valid
    if (referral.status !== 'pending') {
      return false
    }

    // Check time limits
    const createdAt = new Date(referral.createdAt)
    const now = new Date()
    const timeLimit = program.conditions.find(c => c.type === 'time_limit')?.value
    
    if (timeLimit && (now.getTime() - createdAt.getTime()) > (timeLimit * 24 * 60 * 60 * 1000)) {
      await this.expireReferral(referral.id)
      return false
    }

    // Update referral with referee
    try {
      await supabase
        .from('referrals')
        .update({
          referee_id: newUserId,
          updated_at: new Date().toISOString()
        })
        .eq('id', referral.id)

      // Process signup reward
      await this.processReward(referral, 'signup', { newUserId })

      referral.refereeId = newUserId
      this.activeCodes.set(code, referral)

      return true
    } catch (error) {
      console.error('Failed to apply referral code:', error)
      return false
    }
  }

  async processReward(referral: Referral, trigger: ReferralReward['trigger'], context: any = {}) {
    const program = this.programs.get(referral.programId)
    if (!program) return

    const eligibleRewards = program.rewards.filter(r => r.trigger === trigger)
    
    for (const reward of eligibleRewards) {
      // Check if reward was already given
      if (referral.rewardsGiven.some(r => r.trigger === reward.trigger && r.rewardType === reward.rewardType)) {
        continue
      }

      // Process the reward
      await this.giveReward(referral.referrerId, reward, context)
      
      // Record the reward
      referral.rewardsGiven.push(reward)
      
      await supabase
        .from('referrals')
        .update({
          rewards_given: referral.rewardsGiven,
          updated_at: new Date().toISOString()
        })
        .eq('id', referral.id)

      // Log reward transaction
      await this.logRewardTransaction(referral, reward, context)
    }

    // Check if referral is complete
    if (trigger === 'first_hire' || trigger === 'subscription') {
      await this.completeReferral(referral.id)
    }
  }

  private async giveReward(userId: string, reward: ReferralReward, context: any) {
    switch (reward.rewardType) {
      case 'credit':
        await this.addUserCredit(userId, reward.amount, reward.currency || 'USD')
        break
      case 'cash':
        await this.processPayment(userId, reward.amount, reward.currency || 'USD')
        break
      case 'subscription_discount':
        await this.addSubscriptionDiscount(userId, reward.amount)
        break
      case 'feature_unlock':
        await this.unlockFeatures(userId, 90) // 3 months
        break
    }

    // Send notification
    await this.sendRewardNotification(userId, reward)
  }

  private async addUserCredit(userId: string, amount: number, currency: string) {
    await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        amount,
        currency,
        type: 'referral_reward',
        description: `Referral reward: ${amount} ${currency}`,
        created_at: new Date().toISOString()
      })
  }

  private async processPayment(userId: string, amount: number, currency: string) {
    // Integration with payment processor (Stripe, PayPal, etc.)
    await supabase
      .from('pending_payments')
      .insert({
        user_id: userId,
        amount,
        currency,
        type: 'referral_bonus',
        status: 'pending',
        created_at: new Date().toISOString()
      })
  }

  private async addSubscriptionDiscount(userId: string, percentage: number) {
    await supabase
      .from('user_discounts')
      .insert({
        user_id: userId,
        type: 'subscription',
        percentage,
        valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        source: 'referral',
        created_at: new Date().toISOString()
      })
  }

  private async unlockFeatures(userId: string, days: number) {
    await supabase
      .from('feature_unlocks')
      .insert({
        user_id: userId,
        features: ['ai_screening', 'advanced_analytics', 'priority_support'],
        valid_until: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
        source: 'referral',
        created_at: new Date().toISOString()
      })
  }

  private async sendRewardNotification(userId: string, reward: ReferralReward) {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'referral_reward',
        title: 'Referral Reward Earned!',
        message: reward.description,
        data: { reward },
        created_at: new Date().toISOString()
      })
  }

  private async logRewardTransaction(referral: Referral, reward: ReferralReward, context: any) {
    await supabase
      .from('referral_transactions')
      .insert({
        referral_id: referral.id,
        referrer_id: referral.referrerId,
        referee_id: referral.refereeId,
        reward_type: reward.rewardType,
        reward_amount: reward.amount,
        trigger: reward.trigger,
        context,
        created_at: new Date().toISOString()
      })
  }

  async completeReferral(referralId: string) {
    await supabase
      .from('referrals')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', referralId)

    // Update program redemption count
    const referral = this.activeCodes.get(referralId)
    if (referral) {
      const program = this.programs.get(referral.programId)
      if (program) {
        program.currentRedemptions++
        await supabase
          .from('referral_programs')
          .update({ current_redemptions: program.currentRedemptions })
          .eq('id', program.id)
      }
    }
  }

  async expireReferral(referralId: string) {
    await supabase
      .from('referrals')
      .update({
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('id', referralId)

    // Remove from active codes
    for (const [code, referral] of this.activeCodes.entries()) {
      if (referral.id === referralId) {
        this.activeCodes.delete(code)
        break
      }
    }
  }

  async getReferralStats(userId?: string): Promise<ReferralStats> {
    const baseQuery = supabase.from('referrals').select('*')
    
    if (userId) {
      baseQuery.eq('referrer_id', userId)
    }

    const { data: referrals } = await baseQuery

    const totalReferrals = referrals?.length || 0
    const completedReferrals = referrals?.filter(r => r.status === 'completed').length || 0
    const pendingReferrals = referrals?.filter(r => r.status === 'pending').length || 0

    // Calculate total rewards
    let totalRewards = 0
    referrals?.forEach(referral => {
      referral.rewards_given?.forEach((reward: any) => {
        if (reward.rewardType === 'credit' || reward.rewardType === 'cash') {
          totalRewards += reward.amount || 0
        }
      })
    })

    const conversionRate = totalReferrals > 0 ? (completedReferrals / totalReferrals) * 100 : 0

    // Get top referrers
    const { data: topReferrersData } = await supabase
      .from('referral_stats_view')
      .select('*')
      .order('referral_count', { ascending: false })
      .limit(10)

    const topReferrers = topReferrersData || []

    return {
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      totalRewards,
      conversionRate,
      topReferrers
    }
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    const { data: referrals } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })

    return referrals || []
  }

  private async selectProgramForUser(user: any): Promise<string> {
    // Determine user's performance metrics
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // VIP program for high performers
    if (stats?.successful_hires >= 5 || stats?.total_revenue >= 10000) {
      const vipProgram = Array.from(this.programs.values()).find(p => p.name.includes('VIP'))
      if (vipProgram) return vipProgram.id
    }

    // Role-based program selection
    if (user.role === 'recruiter') {
      const recruiterProgram = Array.from(this.programs.values()).find(p => p.type === 'recruiter')
      if (recruiterProgram) return recruiterProgram.id
    } else {
      const candidateProgram = Array.from(this.programs.values()).find(p => p.type === 'candidate')
      if (candidateProgram) return candidateProgram.id
    }

    // Default to first available program
    return Array.from(this.programs.keys())[0]
  }

  private async checkUserMeetsConditions(user: any, conditions: ReferralCondition[]): Promise<boolean> {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'user_type':
          if (user.role !== condition.value && condition.value !== 'any') {
            return false
          }
          break
        case 'min_hires':
          const { data: stats } = await supabase
            .from('user_stats')
            .select('successful_hires')
            .eq('user_id', user.id)
            .single()
          if ((stats?.successful_hires || 0) < condition.value) {
            return false
          }
          break
        case 'subscription_tier':
          if (user.subscription_tier !== condition.value) {
            return false
          }
          break
      }
    }
    return true
  }

  private generateUniqueCode(firstName: string, lastName: string): string {
    const prefix = (firstName.slice(0, 2) + lastName.slice(0, 2)).toUpperCase()
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}${suffix}`
  }

  private generateId(): string {
    return 'ref_' + Math.random().toString(36).substring(2, 15)
  }
}

export const referralEngine = new ReferralEngine()