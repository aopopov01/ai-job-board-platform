import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Achievement {
  id: string
  title: string
  description: string
  category: 'application' | 'interview' | 'skill' | 'career' | 'engagement' | 'referral' | 'learning'
  type: 'badge' | 'milestone' | 'streak' | 'level' | 'certification'
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  points: number
  requirements: AchievementRequirement[]
  rewards: AchievementReward[]
  isActive: boolean
  isHidden: boolean // Hidden until unlocked
  createdAt: string
}

export interface AchievementRequirement {
  type: 'count' | 'percentage' | 'time' | 'quality' | 'consecutive'
  metric: string
  value: number
  description: string
}

export interface AchievementReward {
  type: 'points' | 'badge' | 'feature_access' | 'certification_discount' | 'priority_support'
  value: string | number
  description: string
  duration?: number // days, for temporary rewards
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: string
  progress: number // 0-100
  isCompleted: boolean
  notificationSent: boolean
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  title: string
  description: string
  icon: string
  category: string
  rarity: string
  earnedAt: string
  isDisplayed: boolean // Show on profile
}

export interface ExperiencePoints {
  userId: string
  totalPoints: number
  level: number
  currentLevelPoints: number
  nextLevelPoints: number
  pointsToNextLevel: number
  lastUpdated: string
}

export interface ProfessionalStreak {
  id: string
  userId: string
  type: 'daily_login' | 'application_submission' | 'skill_practice' | 'interview_prep'
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
  isActive: boolean
}

export interface RecognitionLevel {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  benefits: string[]
  icon: string
  color: string
}

export class AchievementSystem {
  private achievements: Map<string, Achievement> = new Map()
  private recognitionLevels: Map<number, RecognitionLevel> = new Map()

  constructor() {
    this.initializeAchievements()
    this.initializeRecognitionLevels()
  }

  private async initializeAchievements() {
    const defaultAchievements: Omit<Achievement, 'id' | 'createdAt'>[] = [
      // Application Achievements
      {
        title: 'First Steps',
        description: 'Submit your first job application',
        category: 'application',
        type: 'badge',
        icon: '🚀',
        rarity: 'common',
        points: 10,
        requirements: [
          {
            type: 'count',
            metric: 'applications_submitted',
            value: 1,
            description: 'Submit 1 application'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 10,
            description: '10 experience points'
          },
          {
            type: 'badge',
            value: 'first_application',
            description: 'First Application badge'
          }
        ],
        isActive: true,
        isHidden: false
      },
      {
        title: 'Application Pro',
        description: 'Submit 10 high-quality job applications',
        category: 'application',
        type: 'badge',
        icon: '📝',
        rarity: 'uncommon',
        points: 50,
        requirements: [
          {
            type: 'count',
            metric: 'applications_submitted',
            value: 10,
            description: 'Submit 10 applications'
          },
          {
            type: 'quality',
            metric: 'application_completeness',
            value: 80,
            description: 'Average 80% application completeness'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 50,
            description: '50 experience points'
          },
          {
            type: 'feature_access',
            value: 'application_analytics',
            description: 'Access to application analytics dashboard'
          }
        ],
        isActive: true,
        isHidden: false
      },
      {
        title: 'Interview Ready',
        description: 'Complete 5 mock interviews with good scores',
        category: 'interview',
        type: 'badge',
        icon: '🎯',
        rarity: 'rare',
        points: 75,
        requirements: [
          {
            type: 'count',
            metric: 'mock_interviews_completed',
            value: 5,
            description: 'Complete 5 mock interviews'
          },
          {
            type: 'quality',
            metric: 'interview_score',
            value: 75,
            description: 'Average score of 75% or higher'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 75,
            description: '75 experience points'
          },
          {
            type: 'certification_discount',
            value: 20,
            description: '20% discount on interview coaching sessions'
          }
        ],
        isActive: true,
        isHidden: false
      },
      
      // Skill Development Achievements
      {
        title: 'Skill Explorer',
        description: 'Complete skill assessments in 3 different areas',
        category: 'skill',
        type: 'badge',
        icon: '🧭',
        rarity: 'common',
        points: 25,
        requirements: [
          {
            type: 'count',
            metric: 'skill_assessments_completed',
            value: 3,
            description: 'Complete 3 skill assessments'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 25,
            description: '25 experience points'
          },
          {
            type: 'feature_access',
            value: 'skill_recommendations',
            description: 'Personalized skill development recommendations'
          }
        ],
        isActive: true,
        isHidden: false
      },
      {
        title: 'Learning Machine',
        description: 'Complete 10 learning modules in a month',
        category: 'learning',
        type: 'streak',
        icon: '📚',
        rarity: 'uncommon',
        points: 100,
        requirements: [
          {
            type: 'count',
            metric: 'learning_modules_completed',
            value: 10,
            description: 'Complete 10 learning modules'
          },
          {
            type: 'time',
            metric: 'completion_timeframe',
            value: 30,
            description: 'Within 30 days'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 100,
            description: '100 experience points'
          },
          {
            type: 'certification_discount',
            value: 50,
            description: '50% discount on next certification course'
          }
        ],
        isActive: true,
        isHidden: false
      },

      // Career Achievements
      {
        title: 'Career Climber',
        description: 'Receive your first job offer through the platform',
        category: 'career',
        type: 'milestone',
        icon: '🏆',
        rarity: 'epic',
        points: 200,
        requirements: [
          {
            type: 'count',
            metric: 'job_offers_received',
            value: 1,
            description: 'Receive 1 job offer'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 200,
            description: '200 experience points'
          },
          {
            type: 'badge',
            value: 'career_success',
            description: 'Career Success badge'
          },
          {
            type: 'priority_support',
            value: '90_days',
            description: '90 days of priority customer support'
          }
        ],
        isActive: true,
        isHidden: false
      },
      {
        title: 'Dream Job Achiever',
        description: 'Land your dream job with salary increase of 20%+',
        category: 'career',
        type: 'milestone',
        icon: '⭐',
        rarity: 'legendary',
        points: 500,
        requirements: [
          {
            type: 'percentage',
            metric: 'salary_increase',
            value: 20,
            description: '20% or higher salary increase'
          },
          {
            type: 'quality',
            metric: 'job_satisfaction_rating',
            value: 90,
            description: '90% job satisfaction rating after 3 months'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 500,
            description: '500 experience points'
          },
          {
            type: 'badge',
            value: 'dream_job_achiever',
            description: 'Dream Job Achiever legendary badge'
          },
          {
            type: 'feature_access',
            value: 'vip_career_coaching',
            description: 'Lifetime access to VIP career coaching'
          }
        ],
        isActive: true,
        isHidden: true
      },

      // Engagement Achievements
      {
        title: 'Consistent Contributor',
        description: 'Log in daily for 7 consecutive days',
        category: 'engagement',
        type: 'streak',
        icon: '🔥',
        rarity: 'common',
        points: 35,
        requirements: [
          {
            type: 'consecutive',
            metric: 'daily_logins',
            value: 7,
            description: '7 consecutive daily logins'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 35,
            description: '35 experience points'
          },
          {
            type: 'badge',
            value: 'consistent_user',
            description: 'Consistent User badge'
          }
        ],
        isActive: true,
        isHidden: false
      },
      {
        title: 'Platform Champion',
        description: 'Log in daily for 30 consecutive days',
        category: 'engagement',
        type: 'streak',
        icon: '👑',
        rarity: 'rare',
        points: 150,
        requirements: [
          {
            type: 'consecutive',
            metric: 'daily_logins',
            value: 30,
            description: '30 consecutive daily logins'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 150,
            description: '150 experience points'
          },
          {
            type: 'feature_access',
            value: 'premium_features',
            description: '30 days of premium features access',
            duration: 30
          }
        ],
        isActive: true,
        isHidden: false
      },

      // Referral Achievements
      {
        title: 'Talent Scout',
        description: 'Successfully refer 3 candidates who get hired',
        category: 'referral',
        type: 'badge',
        icon: '🔍',
        rarity: 'rare',
        points: 125,
        requirements: [
          {
            type: 'count',
            metric: 'successful_referrals',
            value: 3,
            description: 'Refer 3 candidates who get hired'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 125,
            description: '125 experience points'
          },
          {
            type: 'badge',
            value: 'talent_scout',
            description: 'Talent Scout badge'
          },
          {
            type: 'feature_access',
            value: 'referral_analytics',
            description: 'Advanced referral tracking and analytics'
          }
        ],
        isActive: true,
        isHidden: false
      },
      {
        title: 'Network Builder',
        description: 'Invite 10 professionals to join the platform',
        category: 'referral',
        type: 'badge',
        icon: '🌐',
        rarity: 'uncommon',
        points: 60,
        requirements: [
          {
            type: 'count',
            metric: 'platform_invitations_sent',
            value: 10,
            description: 'Invite 10 professionals'
          },
          {
            type: 'count',
            metric: 'successful_registrations',
            value: 5,
            description: '5 successful registrations from invites'
          }
        ],
        rewards: [
          {
            type: 'points',
            value: 60,
            description: '60 experience points'
          },
          {
            type: 'badge',
            value: 'network_builder',
            description: 'Network Builder badge'
          }
        ],
        isActive: true,
        isHidden: false
      }
    ]

    for (const achievement of defaultAchievements) {
      const id = this.generateId()
      this.achievements.set(id, {
        ...achievement,
        id,
        createdAt: new Date().toISOString()
      })

      // Store in database
      await supabase
        .from('achievements')
        .insert({
          id,
          title: achievement.title,
          description: achievement.description,
          category: achievement.category,
          type: achievement.type,
          icon: achievement.icon,
          rarity: achievement.rarity,
          points: achievement.points,
          requirements: achievement.requirements,
          rewards: achievement.rewards,
          is_active: achievement.isActive,
          is_hidden: achievement.isHidden,
          created_at: new Date().toISOString()
        })
    }
  }

  private initializeRecognitionLevels() {
    const levels: RecognitionLevel[] = [
      {
        level: 1,
        title: 'Career Starter',
        minPoints: 0,
        maxPoints: 99,
        benefits: ['Basic platform access', 'Standard support'],
        icon: '🌱',
        color: '#22c55e'
      },
      {
        level: 2,
        title: 'Job Seeker',
        minPoints: 100,
        maxPoints: 249,
        benefits: ['Enhanced profile features', 'Application tracking'],
        icon: '🎯',
        color: '#3b82f6'
      },
      {
        level: 3,
        title: 'Career Builder',
        minPoints: 250,
        maxPoints: 499,
        benefits: ['Priority application review', 'Career coaching access'],
        icon: '🏗️',
        color: '#8b5cf6'
      },
      {
        level: 4,
        title: 'Professional',
        minPoints: 500,
        maxPoints: 999,
        benefits: ['Premium features', 'Advanced analytics', 'Networking events'],
        icon: '💼',
        color: '#f59e0b'
      },
      {
        level: 5,
        title: 'Career Expert',
        minPoints: 1000,
        maxPoints: 1999,
        benefits: ['VIP support', 'Industry insights', 'Mentorship opportunities'],
        icon: '🎓',
        color: '#ef4444'
      },
      {
        level: 6,
        title: 'Industry Leader',
        minPoints: 2000,
        maxPoints: 4999,
        benefits: ['Executive coaching', 'Speaking opportunities', 'Advisory roles'],
        icon: '👑',
        color: '#dc2626'
      },
      {
        level: 7,
        title: 'Career Legend',
        minPoints: 5000,
        maxPoints: 999999,
        benefits: ['Lifetime premium access', 'Personal career consultant', 'Platform influence'],
        icon: '⭐',
        color: '#fbbf24'
      }
    ]

    levels.forEach(level => {
      this.recognitionLevels.set(level.level, level)
    })
  }

  // Core Achievement Methods
  async checkUserAchievements(userId: string, activity: UserActivity): Promise<UserAchievement[]> {
    const newAchievements: UserAchievement[] = []

    try {
      // Get user's current achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId)
        .eq('is_completed', true)

      const completedAchievementIds = new Set(
        userAchievements?.map(ua => ua.achievement_id) || []
      )

      // Check each achievement
      for (const [achievementId, achievement] of this.achievements) {
        if (!achievement.isActive || completedAchievementIds.has(achievementId)) {
          continue
        }

        const meetsRequirements = await this.checkAchievementRequirements(
          userId,
          achievement,
          activity
        )

        if (meetsRequirements) {
          const userAchievement = await this.unlockAchievement(userId, achievementId)
          newAchievements.push(userAchievement)
        }
      }

      return newAchievements
    } catch (error) {
      console.error('Failed to check user achievements:', error)
      return []
    }
  }

  private async checkAchievementRequirements(
    userId: string,
    achievement: Achievement,
    activity: UserActivity
  ): Promise<boolean> {
    try {
      // Get user statistics
      const userStats = await this.getUserStats(userId)

      for (const requirement of achievement.requirements) {
        const currentValue = this.getStatValue(userStats, requirement.metric)
        
        switch (requirement.type) {
          case 'count':
            if (currentValue < requirement.value) return false
            break
          case 'percentage':
            if (currentValue < requirement.value) return false
            break
          case 'quality':
            if (currentValue < requirement.value) return false
            break
          case 'consecutive':
            if (currentValue < requirement.value) return false
            break
          case 'time':
            // Time-based requirements need special handling
            const timeRequirementMet = await this.checkTimeRequirement(
              userId,
              requirement.metric,
              requirement.value
            )
            if (!timeRequirementMet) return false
            break
        }
      }

      return true
    } catch (error) {
      console.error('Failed to check achievement requirements:', error)
      return false
    }
  }

  private async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const achievement = this.achievements.get(achievementId)!
    
    const userAchievement: UserAchievement = {
      id: this.generateId(),
      userId,
      achievementId,
      unlockedAt: new Date().toISOString(),
      progress: 100,
      isCompleted: true,
      notificationSent: false
    }

    try {
      // Store in database
      await supabase
        .from('user_achievements')
        .insert({
          id: userAchievement.id,
          user_id: userAchievement.userId,
          achievement_id: userAchievement.achievementId,
          unlocked_at: userAchievement.unlockedAt,
          progress: userAchievement.progress,
          is_completed: userAchievement.isCompleted,
          notification_sent: userAchievement.notificationSent
        })

      // Award points and other rewards
      await this.awardAchievementRewards(userId, achievement)

      // Create badge if achievement includes one
      await this.createUserBadge(userId, achievement)

      // Send notification
      await this.sendAchievementNotification(userId, achievement)

      return userAchievement
    } catch (error) {
      console.error('Failed to unlock achievement:', error)
      throw error
    }
  }

  private async awardAchievementRewards(userId: string, achievement: Achievement): Promise<void> {
    for (const reward of achievement.rewards) {
      switch (reward.type) {
        case 'points':
          await this.addExperiencePoints(userId, reward.value as number)
          break
        case 'feature_access':
          await this.grantFeatureAccess(userId, reward.value as string, reward.duration)
          break
        case 'certification_discount':
          await this.grantCertificationDiscount(userId, reward.value as number)
          break
        case 'priority_support':
          await this.grantPrioritySupport(userId, reward.duration || 30)
          break
      }
    }
  }

  // Experience Points & Leveling
  async addExperiencePoints(userId: string, points: number): Promise<ExperiencePoints> {
    try {
      // Get current points
      const { data: currentXP } = await supabase
        .from('user_experience_points')
        .select('*')
        .eq('user_id', userId)
        .single()

      const newTotalPoints = (currentXP?.total_points || 0) + points
      const newLevel = this.calculateLevel(newTotalPoints)
      const levelInfo = this.recognitionLevels.get(newLevel)!
      
      const experiencePoints: ExperiencePoints = {
        userId,
        totalPoints: newTotalPoints,
        level: newLevel,
        currentLevelPoints: newTotalPoints - levelInfo.minPoints,
        nextLevelPoints: levelInfo.maxPoints - levelInfo.minPoints + 1,
        pointsToNextLevel: levelInfo.maxPoints - newTotalPoints + 1,
        lastUpdated: new Date().toISOString()
      }

      // Update or insert
      await supabase
        .from('user_experience_points')
        .upsert({
          user_id: userId,
          total_points: experiencePoints.totalPoints,
          level: experiencePoints.level,
          current_level_points: experiencePoints.currentLevelPoints,
          next_level_points: experiencePoints.nextLevelPoints,
          points_to_next_level: experiencePoints.pointsToNextLevel,
          last_updated: experiencePoints.lastUpdated
        })

      // Check for level up
      if (currentXP && newLevel > (currentXP.level || 1)) {
        await this.handleLevelUp(userId, newLevel)
      }

      return experiencePoints
    } catch (error) {
      console.error('Failed to add experience points:', error)
      throw error
    }
  }

  private calculateLevel(totalPoints: number): number {
    for (const [level, info] of this.recognitionLevels) {
      if (totalPoints >= info.minPoints && totalPoints <= info.maxPoints) {
        return level
      }
    }
    return 1 // Default to level 1
  }

  private async handleLevelUp(userId: string, newLevel: number): Promise<void> {
    const levelInfo = this.recognitionLevels.get(newLevel)!
    
    // Send level up notification
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'level_up',
        title: `Level Up! You're now a ${levelInfo.title}! 🎉`,
        message: `Congratulations! You've reached level ${newLevel} and unlocked new benefits.`,
        data: {
          newLevel,
          title: levelInfo.title,
          benefits: levelInfo.benefits
        },
        created_at: new Date().toISOString()
      })
  }

  // Helper Methods
  private async getUserStats(userId: string): Promise<any> {
    // This would aggregate user statistics from various tables
    const [applications, interviews, skills, referrals] = await Promise.all([
      supabase.from('applications').select('*').eq('candidate_id', userId),
      supabase.from('interview_sessions').select('*').eq('user_id', userId),
      supabase.from('user_skills').select('*').eq('user_id', userId),
      supabase.from('referrals').select('*').eq('referrer_id', userId)
    ])

    return {
      applications_submitted: applications.data?.length || 0,
      mock_interviews_completed: interviews.data?.filter(i => i.type === 'mock').length || 0,
      skill_assessments_completed: skills.data?.length || 0,
      successful_referrals: referrals.data?.filter(r => r.status === 'completed').length || 0,
      daily_logins: 0, // Would be calculated from login history
      // Add more stats as needed
    }
  }

  private getStatValue(userStats: any, metric: string): number {
    return userStats[metric] || 0
  }

  private async checkTimeRequirement(userId: string, metric: string, timeLimit: number): Promise<boolean> {
    // Implementation would depend on the specific metric
    // For now, return true as placeholder
    return true
  }

  private async createUserBadge(userId: string, achievement: Achievement): Promise<void> {
    const badgeReward = achievement.rewards.find(r => r.type === 'badge')
    if (!badgeReward) return

    const badge: UserBadge = {
      id: this.generateId(),
      userId,
      badgeId: badgeReward.value as string,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      category: achievement.category,
      rarity: achievement.rarity,
      earnedAt: new Date().toISOString(),
      isDisplayed: true
    }

    await supabase
      .from('user_badges')
      .insert({
        id: badge.id,
        user_id: badge.userId,
        badge_id: badge.badgeId,
        title: badge.title,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        rarity: badge.rarity,
        earned_at: badge.earnedAt,
        is_displayed: badge.isDisplayed
      })
  }

  private async sendAchievementNotification(userId: string, achievement: Achievement): Promise<void> {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'achievement_unlocked',
        title: `Achievement Unlocked! ${achievement.icon}`,
        message: `${achievement.title}: ${achievement.description}`,
        data: {
          achievementId: achievement.id,
          points: achievement.points,
          rarity: achievement.rarity
        },
        created_at: new Date().toISOString()
      })
  }

  private async grantFeatureAccess(userId: string, feature: string, duration?: number): Promise<void> {
    const expiresAt = duration ? 
      new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString() : 
      null

    await supabase
      .from('user_feature_access')
      .insert({
        user_id: userId,
        feature_name: feature,
        granted_at: new Date().toISOString(),
        expires_at: expiresAt,
        source: 'achievement_reward'
      })
  }

  private async grantCertificationDiscount(userId: string, percentage: number): Promise<void> {
    await supabase
      .from('user_discounts')
      .insert({
        user_id: userId,
        type: 'certification',
        percentage,
        valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        source: 'achievement',
        created_at: new Date().toISOString()
      })
  }

  private async grantPrioritySupport(userId: string, days: number): Promise<void> {
    await supabase
      .from('user_support_tiers')
      .upsert({
        user_id: userId,
        tier: 'priority',
        valid_until: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
        source: 'achievement',
        updated_at: new Date().toISOString()
      })
  }

  private generateId(): string {
    return 'ach_' + Math.random().toString(36).substring(2, 15)
  }

  // Public API Methods
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getUserExperiencePoints(userId: string): Promise<ExperiencePoints | null> {
    const { data, error } = await supabase
      .from('user_experience_points')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }

  async getAvailableAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(a => a.isActive && !a.isHidden)
  }

  async recordUserActivity(activity: UserActivity): Promise<void> {
    // Check for new achievements
    await this.checkUserAchievements(activity.userId, activity)
  }
}

export interface UserActivity {
  userId: string
  type: 'application_submitted' | 'interview_completed' | 'skill_assessed' | 'login' | 'referral_made'
  metadata?: any
  timestamp: string
}

export const achievementSystem = new AchievementSystem()