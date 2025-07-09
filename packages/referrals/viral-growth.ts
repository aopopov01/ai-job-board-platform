import { createClient } from '@supabase/supabase-js'
import { referralEngine } from './index'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ViralCampaign {
  id: string
  name: string
  type: 'social_share' | 'milestone_bonus' | 'contest' | 'limited_time' | 'achievement_unlock'
  description: string
  triggers: ViralTrigger[]
  rewards: ViralReward[]
  rules: ViralRule[]
  startDate: string
  endDate?: string
  isActive: boolean
  targetMetrics: {
    totalParticipants?: number
    totalShares?: number
    newSignups?: number
    conversionRate?: number
  }
  currentMetrics: {
    participants: number
    shares: number
    signups: number
    conversionRate: number
  }
}

export interface ViralTrigger {
  action: 'share_job' | 'invite_friend' | 'achieve_milestone' | 'complete_profile' | 'successful_hire'
  platform?: 'linkedin' | 'twitter' | 'facebook' | 'email' | 'whatsapp'
  threshold?: number
  description: string
}

export interface ViralReward {
  type: 'points' | 'badge' | 'feature_unlock' | 'credit' | 'leaderboard_position'
  value: number | string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface ViralRule {
  type: 'max_rewards_per_user' | 'cooldown_period' | 'unique_participants_only' | 'min_engagement'
  value: number
  description: string
}

export interface SocialShareContent {
  platform: string
  title: string
  description: string
  image?: string
  url: string
  hashtags?: string[]
  customMessage?: string
}

export interface GamificationElement {
  type: 'badge' | 'achievement' | 'leaderboard' | 'streak' | 'level'
  id: string
  title: string
  description: string
  icon: string
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockConditions: {
    type: string
    value: number
    description: string
  }[]
}

export class ViralGrowthEngine {
  private campaigns: Map<string, ViralCampaign> = new Map()
  private gamificationElements: Map<string, GamificationElement> = new Map()

  constructor() {
    this.initializeDefaultCampaigns()
    this.initializeGamificationElements()
  }

  private async initializeDefaultCampaigns() {
    const defaultCampaigns: Omit<ViralCampaign, 'id' | 'currentMetrics'>[] = [
      {
        name: 'Job Share Challenge',
        type: 'social_share',
        description: 'Share job posts and earn points for each successful hire from your share',
        triggers: [
          {
            action: 'share_job',
            platform: 'linkedin',
            description: 'Share a job post on LinkedIn'
          },
          {
            action: 'share_job',
            platform: 'twitter',
            description: 'Share a job post on Twitter'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 10,
            description: '10 points per job share',
            rarity: 'common'
          },
          {
            type: 'credit',
            value: 5,
            description: '$5 credit when someone applies through your share',
            rarity: 'rare'
          },
          {
            type: 'credit',
            value: 50,
            description: '$50 bonus when someone gets hired through your share',
            rarity: 'epic'
          }
        ],
        rules: [
          {
            type: 'max_rewards_per_user',
            value: 100,
            description: 'Maximum 100 share rewards per user per month'
          },
          {
            type: 'cooldown_period',
            value: 3600, // 1 hour in seconds
            description: '1 hour cooldown between shares of the same job'
          }
        ],
        startDate: new Date().toISOString(),
        isActive: true,
        targetMetrics: {
          totalShares: 1000,
          newSignups: 200,
          conversionRate: 20
        }
      },
      {
        name: 'Referral Milestone Bonuses',
        type: 'milestone_bonus',
        description: 'Earn escalating bonuses as you refer more successful candidates',
        triggers: [
          {
            action: 'successful_hire',
            threshold: 5,
            description: 'Achieve 5 successful referral hires'
          },
          {
            action: 'successful_hire',
            threshold: 10,
            description: 'Achieve 10 successful referral hires'
          },
          {
            action: 'successful_hire',
            threshold: 25,
            description: 'Achieve 25 successful referral hires'
          }
        ],
        rewards: [
          {
            type: 'credit',
            value: 100,
            description: '$100 bonus for 5 successful hires',
            rarity: 'rare'
          },
          {
            type: 'credit',
            value: 300,
            description: '$300 bonus for 10 successful hires',
            rarity: 'epic'
          },
          {
            type: 'credit',
            value: 1000,
            description: '$1000 bonus for 25 successful hires',
            rarity: 'legendary'
          },
          {
            type: 'badge',
            value: 'super_referrer',
            description: 'Super Referrer Badge',
            rarity: 'legendary'
          }
        ],
        rules: [
          {
            type: 'unique_participants_only',
            value: 1,
            description: 'Each milestone can only be achieved once per user'
          }
        ],
        startDate: new Date().toISOString(),
        isActive: true,
        targetMetrics: {
          totalParticipants: 500,
          conversionRate: 15
        }
      },
      {
        name: 'Monthly Referral Contest',
        type: 'contest',
        description: 'Compete with other users for the most successful referrals each month',
        triggers: [
          {
            action: 'successful_hire',
            description: 'Each successful hire counts toward monthly contest'
          }
        ],
        rewards: [
          {
            type: 'credit',
            value: 500,
            description: '$500 for 1st place',
            rarity: 'legendary'
          },
          {
            type: 'credit',
            value: 300,
            description: '$300 for 2nd place',
            rarity: 'epic'
          },
          {
            type: 'credit',
            value: 200,
            description: '$200 for 3rd place',
            rarity: 'epic'
          },
          {
            type: 'leaderboard_position',
            value: 'top_10',
            description: 'Top 10 leaderboard position badge',
            rarity: 'rare'
          }
        ],
        rules: [
          {
            type: 'min_engagement',
            value: 3,
            description: 'Minimum 3 successful hires to qualify for prizes'
          }
        ],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        isActive: true,
        targetMetrics: {
          totalParticipants: 200,
          newSignups: 1000
        }
      },
      {
        name: 'Profile Completion Boost',
        type: 'achievement_unlock',
        description: 'Complete your profile and unlock viral sharing features',
        triggers: [
          {
            action: 'complete_profile',
            threshold: 100,
            description: 'Complete 100% of your profile'
          }
        ],
        rewards: [
          {
            type: 'feature_unlock',
            value: 'advanced_sharing',
            description: 'Unlock advanced sharing tools and analytics',
            rarity: 'rare'
          },
          {
            type: 'badge',
            value: 'profile_master',
            description: 'Profile Master Badge',
            rarity: 'rare'
          }
        ],
        rules: [
          {
            type: 'unique_participants_only',
            value: 1,
            description: 'One-time achievement per user'
          }
        ],
        startDate: new Date().toISOString(),
        isActive: true,
        targetMetrics: {
          totalParticipants: 1000,
          conversionRate: 50
        }
      }
    ]

    for (const campaign of defaultCampaigns) {
      await this.createCampaign(campaign)
    }
  }

  private async initializeGamificationElements() {
    const elements: Omit<GamificationElement, 'id'>[] = [
      {
        type: 'badge',
        title: 'First Share',
        description: 'Shared your first job posting',
        icon: '🎯',
        points: 10,
        rarity: 'common',
        unlockConditions: [
          {
            type: 'job_shares',
            value: 1,
            description: 'Share 1 job posting'
          }
        ]
      },
      {
        type: 'badge',
        title: 'Social Butterfly',
        description: 'Shared jobs on multiple platforms',
        icon: '🦋',
        points: 50,
        rarity: 'rare',
        unlockConditions: [
          {
            type: 'platforms_used',
            value: 3,
            description: 'Share on 3 different platforms'
          }
        ]
      },
      {
        type: 'badge',
        title: 'Talent Magnet',
        description: 'Your shares resulted in 10 successful applications',
        icon: '🧲',
        points: 100,
        rarity: 'epic',
        unlockConditions: [
          {
            type: 'applications_from_shares',
            value: 10,
            description: 'Generate 10 applications from your shares'
          }
        ]
      },
      {
        type: 'achievement',
        title: 'Viral Master',
        description: 'Achieved viral status with 1000+ shares',
        icon: '🚀',
        points: 500,
        rarity: 'legendary',
        unlockConditions: [
          {
            type: 'total_shares',
            value: 1000,
            description: 'Accumulate 1000 total shares'
          }
        ]
      },
      {
        type: 'streak',
        title: '7-Day Sharing Streak',
        description: 'Shared content for 7 consecutive days',
        icon: '🔥',
        points: 70,
        rarity: 'rare',
        unlockConditions: [
          {
            type: 'consecutive_days',
            value: 7,
            description: 'Share content for 7 days in a row'
          }
        ]
      }
    ]

    for (const element of elements) {
      const id = this.generateId()
      this.gamificationElements.set(id, { ...element, id })
      
      await supabase
        .from('gamification_elements')
        .insert({
          id,
          type: element.type,
          title: element.title,
          description: element.description,
          icon: element.icon,
          points: element.points,
          rarity: element.rarity,
          unlock_conditions: element.unlockConditions
        })
    }
  }

  async createCampaign(campaignData: Omit<ViralCampaign, 'id' | 'currentMetrics'>): Promise<ViralCampaign> {
    const campaign: ViralCampaign = {
      ...campaignData,
      id: this.generateId(),
      currentMetrics: {
        participants: 0,
        shares: 0,
        signups: 0,
        conversionRate: 0
      }
    }

    try {
      await supabase
        .from('viral_campaigns')
        .insert({
          id: campaign.id,
          name: campaign.name,
          type: campaign.type,
          description: campaign.description,
          triggers: campaign.triggers,
          rewards: campaign.rewards,
          rules: campaign.rules,
          start_date: campaign.startDate,
          end_date: campaign.endDate,
          is_active: campaign.isActive,
          target_metrics: campaign.targetMetrics,
          current_metrics: campaign.currentMetrics
        })

      this.campaigns.set(campaign.id, campaign)
      return campaign
    } catch (error) {
      console.error('Failed to create viral campaign:', error)
      throw error
    }
  }

  async generateSocialShareContent(jobId: string, userId: string, platform: string): Promise<SocialShareContent> {
    // Get job details
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (!job) {
      throw new Error('Job not found')
    }

    // Get user info for personalization
    const { data: user } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Generate tracking URL
    const trackingCode = await this.generateTrackingCode(userId, jobId, platform)
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${jobId}?ref=${trackingCode}`

    const content: SocialShareContent = {
      platform,
      title: this.generateShareTitle(job, platform),
      description: this.generateShareDescription(job, user, platform),
      url: shareUrl,
      hashtags: this.generateHashtags(job, platform),
      customMessage: this.generateCustomMessage(job, user, platform)
    }

    // Track share generation
    await this.trackViralAction(userId, 'generate_share_content', {
      jobId,
      platform,
      trackingCode
    })

    return content
  }

  async trackViralAction(userId: string, action: string, metadata: any = {}) {
    try {
      // Record the action
      await supabase
        .from('viral_actions')
        .insert({
          user_id: userId,
          action,
          metadata,
          created_at: new Date().toISOString()
        })

      // Process rewards for active campaigns
      const activeCampaigns = Array.from(this.campaigns.values()).filter(c => 
        c.isActive && 
        (!c.endDate || new Date(c.endDate) > new Date())
      )

      for (const campaign of activeCampaigns) {
        await this.processViralRewards(userId, action, campaign, metadata)
      }

      // Check for gamification achievements
      await this.checkAchievements(userId, action, metadata)

    } catch (error) {
      console.error('Failed to track viral action:', error)
    }
  }

  private async processViralRewards(userId: string, action: string, campaign: ViralCampaign, metadata: any) {
    const matchingTriggers = campaign.triggers.filter(trigger => {
      if (action === 'share_job' && trigger.action === 'share_job') {
        return !trigger.platform || trigger.platform === metadata.platform
      }
      return action === trigger.action
    })

    if (matchingTriggers.length === 0) return

    // Check campaign rules
    const canReceiveReward = await this.checkCampaignRules(userId, campaign, action, metadata)
    if (!canReceiveReward) return

    // Give rewards
    for (const reward of campaign.rewards) {
      await this.giveViralReward(userId, reward, campaign.id, metadata)
    }

    // Update campaign metrics
    await this.updateCampaignMetrics(campaign.id, action, metadata)
  }

  private async checkCampaignRules(userId: string, campaign: ViralCampaign, action: string, metadata: any): Promise<boolean> {
    for (const rule of campaign.rules) {
      switch (rule.type) {
        case 'max_rewards_per_user':
          const { data: userRewards } = await supabase
            .from('viral_rewards_given')
            .select('id')
            .eq('user_id', userId)
            .eq('campaign_id', campaign.id)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

          if ((userRewards?.length || 0) >= rule.value) {
            return false
          }
          break

        case 'cooldown_period':
          const { data: recentActions } = await supabase
            .from('viral_actions')
            .select('created_at')
            .eq('user_id', userId)
            .eq('action', action)
            .gte('created_at', new Date(Date.now() - rule.value * 1000).toISOString())

          if (recentActions && recentActions.length > 0) {
            return false
          }
          break

        case 'min_engagement':
          // Check if user meets minimum engagement requirements
          const { data: engagementStats } = await supabase
            .from('user_engagement_stats')
            .select('*')
            .eq('user_id', userId)
            .single()

          if (!engagementStats || engagementStats.total_engagements < rule.value) {
            return false
          }
          break
      }
    }

    return true
  }

  private async giveViralReward(userId: string, reward: ViralReward, campaignId: string, context: any) {
    try {
      switch (reward.type) {
        case 'points':
          await this.addUserPoints(userId, reward.value as number)
          break
        case 'credit':
          await this.addUserCredit(userId, reward.value as number)
          break
        case 'badge':
          await this.awardBadge(userId, reward.value as string)
          break
        case 'feature_unlock':
          await this.unlockFeature(userId, reward.value as string)
          break
      }

      // Record reward
      await supabase
        .from('viral_rewards_given')
        .insert({
          user_id: userId,
          campaign_id: campaignId,
          reward_type: reward.type,
          reward_value: reward.value,
          description: reward.description,
          rarity: reward.rarity,
          context,
          created_at: new Date().toISOString()
        })

      // Send notification
      await this.sendViralNotification(userId, reward)

    } catch (error) {
      console.error('Failed to give viral reward:', error)
    }
  }

  private async addUserPoints(userId: string, points: number) {
    await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        points: points,
        source: 'viral_campaign',
        updated_at: new Date().toISOString()
      })
  }

  private async addUserCredit(userId: string, amount: number) {
    await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        amount,
        currency: 'USD',
        type: 'viral_reward',
        description: `Viral campaign reward: $${amount}`,
        created_at: new Date().toISOString()
      })
  }

  private async awardBadge(userId: string, badgeId: string) {
    await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
        awarded_at: new Date().toISOString()
      })
  }

  private async unlockFeature(userId: string, feature: string) {
    await supabase
      .from('feature_unlocks')
      .insert({
        user_id: userId,
        features: [feature],
        valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        source: 'viral_campaign',
        created_at: new Date().toISOString()
      })
  }

  private async checkAchievements(userId: string, action: string, metadata: any) {
    // Get user's current stats
    const { data: userStats } = await supabase
      .from('user_viral_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!userStats) return

    // Check each gamification element
    for (const [id, element] of this.gamificationElements.entries()) {
      const hasAchievement = await this.checkUserHasAchievement(userId, id)
      if (hasAchievement) continue

      const meetsConditions = element.unlockConditions.every(condition => {
        switch (condition.type) {
          case 'job_shares':
            return userStats.total_shares >= condition.value
          case 'platforms_used':
            return userStats.platforms_used >= condition.value
          case 'applications_from_shares':
            return userStats.applications_generated >= condition.value
          case 'total_shares':
            return userStats.total_shares >= condition.value
          case 'consecutive_days':
            return userStats.max_streak >= condition.value
          default:
            return false
        }
      })

      if (meetsConditions) {
        await this.awardAchievement(userId, element)
      }
    }
  }

  private async checkUserHasAchievement(userId: string, achievementId: string): Promise<boolean> {
    const { data } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .single()

    return !!data
  }

  private async awardAchievement(userId: string, element: GamificationElement) {
    try {
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: element.id,
          title: element.title,
          description: element.description,
          icon: element.icon,
          points: element.points,
          rarity: element.rarity,
          unlocked_at: new Date().toISOString()
        })

      // Add points to user's total
      await this.addUserPoints(userId, element.points)

      // Send notification
      await this.sendAchievementNotification(userId, element)

    } catch (error) {
      console.error('Failed to award achievement:', error)
    }
  }

  private generateShareTitle(job: any, platform: string): string {
    const titles = {
      linkedin: `${job.title} opportunity at ${job.company_name} - Apply now!`,
      twitter: `🚀 ${job.title} at ${job.company_name}`,
      facebook: `Great opportunity: ${job.title} at ${job.company_name}`,
      email: `Job Opportunity: ${job.title}`,
      whatsapp: `Check out this ${job.title} role!`
    }

    return titles[platform as keyof typeof titles] || titles.linkedin
  }

  private generateShareDescription(job: any, user: any, platform: string): string {
    const baseDescription = `${job.description?.slice(0, 150)}...`
    
    switch (platform) {
      case 'linkedin':
        return `${user?.first_name} recommends this ${job.title} position. ${baseDescription} #hiring #jobs #${job.title.replace(/\s+/g, '')}`
      case 'twitter':
        return `${baseDescription} Apply here 👇`
      case 'facebook':
        return `${user?.first_name} found an interesting job opportunity. ${baseDescription}`
      default:
        return baseDescription
    }
  }

  private generateHashtags(job: any, platform: string): string[] {
    const baseHashtags = ['hiring', 'jobs', 'career']
    const jobHashtags = [
      job.title?.replace(/\s+/g, '').toLowerCase(),
      job.department?.toLowerCase(),
      job.location?.replace(/\s+/g, '').toLowerCase()
    ].filter(Boolean)

    return [...baseHashtags, ...jobHashtags].slice(0, 5)
  }

  private generateCustomMessage(job: any, user: any, platform: string): string {
    const messages = {
      linkedin: `I came across this exciting ${job.title} opportunity and thought it might interest my network. ${job.company_name} is looking for talented individuals!`,
      twitter: `Found an amazing ${job.title} role! 🎯`,
      facebook: `Sharing a great job opportunity for anyone interested in ${job.title} roles.`,
      email: `Hi! I found this interesting ${job.title} position that might be perfect for you.`,
      whatsapp: `Hey! Check out this ${job.title} job at ${job.company_name} 👍`
    }

    return messages[platform as keyof typeof messages] || messages.linkedin
  }

  private async generateTrackingCode(userId: string, jobId: string, platform: string): Promise<string> {
    const code = `${userId.slice(0, 6)}_${jobId.slice(0, 6)}_${platform}_${Date.now().toString(36)}`
    
    await supabase
      .from('share_tracking_codes')
      .insert({
        code,
        user_id: userId,
        job_id: jobId,
        platform,
        created_at: new Date().toISOString()
      })

    return code
  }

  private async updateCampaignMetrics(campaignId: string, action: string, metadata: any) {
    const campaign = this.campaigns.get(campaignId)
    if (!campaign) return

    switch (action) {
      case 'share_job':
        campaign.currentMetrics.shares++
        break
      case 'signup_from_share':
        campaign.currentMetrics.signups++
        break
    }

    // Update conversion rate
    if (campaign.currentMetrics.shares > 0) {
      campaign.currentMetrics.conversionRate = (campaign.currentMetrics.signups / campaign.currentMetrics.shares) * 100
    }

    await supabase
      .from('viral_campaigns')
      .update({ current_metrics: campaign.currentMetrics })
      .eq('id', campaignId)
  }

  private async sendViralNotification(userId: string, reward: ViralReward) {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'viral_reward',
        title: 'Viral Reward Earned! 🎉',
        message: reward.description,
        data: { reward },
        created_at: new Date().toISOString()
      })
  }

  private async sendAchievementNotification(userId: string, achievement: GamificationElement) {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'achievement',
        title: `Achievement Unlocked! ${achievement.icon}`,
        message: `${achievement.title}: ${achievement.description}`,
        data: { achievement },
        created_at: new Date().toISOString()
      })
  }

  private generateId(): string {
    return 'viral_' + Math.random().toString(36).substring(2, 15)
  }

  // Public API methods
  async getUserViralStats(userId: string) {
    const { data } = await supabase
      .from('user_viral_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    return data
  }

  async getLeaderboard(type: 'shares' | 'referrals' | 'points', limit: number = 10) {
    const { data } = await supabase
      .from('viral_leaderboard')
      .select('*')
      .eq('metric_type', type)
      .order('value', { ascending: false })
      .limit(limit)

    return data || []
  }

  async getActiveCampaigns() {
    return Array.from(this.campaigns.values()).filter(c => 
      c.isActive && 
      (!c.endDate || new Date(c.endDate) > new Date())
    )
  }
}

export const viralGrowthEngine = new ViralGrowthEngine()