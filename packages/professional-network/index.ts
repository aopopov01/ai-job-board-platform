import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export interface ProfessionalConnection {
  id: string
  fromUserId: string
  toUserId: string
  status: 'pending' | 'accepted' | 'declined' | 'blocked'
  connectionType: 'colleague' | 'mentor' | 'mentee' | 'industry_peer' | 'recruiter' | 'client'
  requestMessage?: string
  connectedAt?: string
  mutualConnections: number
  interactionScore: number // 0-100 based on messaging, endorsements, etc.
  lastInteraction?: string
  tags: string[]
  createdAt: string
}

export interface NetworkInsight {
  id: string
  userId: string
  type: 'connection_opportunity' | 'industry_trend' | 'career_advice' | 'skill_recommendation' | 'event_suggestion'
  title: string
  description: string
  actionItems: string[]
  relevanceScore: number // 0-100
  priority: 'low' | 'medium' | 'high' | 'urgent'
  expiresAt?: string
  metadata: any
  isRead: boolean
  createdAt: string
}

export interface SkillEndorsement {
  id: string
  fromUserId: string
  toUserId: string
  skillName: string
  message?: string
  strength: 'basic' | 'intermediate' | 'advanced' | 'expert'
  workContext?: string // How they know this skill
  isVerified: boolean
  verificationSource?: string
  endorsedAt: string
}

export interface ProfessionalRecommendation {
  id: string
  fromUserId: string
  toUserId: string
  type: 'general' | 'skill_specific' | 'leadership' | 'character' | 'work_quality'
  title: string
  content: string
  skills: string[]
  relationship: string // How they worked together
  workPeriod: {
    start: string
    end?: string
  }
  isPublic: boolean
  isLinkedInSynced: boolean
  createdAt: string
}

export interface IndustryExpert {
  id: string
  userId: string
  expertise: string[]
  industries: string[]
  yearsExperience: number
  credibilityScore: number // 0-100 based on endorsements, content, etc.
  responseRate: number // 0-100 percentage of messages they respond to
  avgResponseTime: number // hours
  languages: string[]
  timeZone: string
  consultingRate?: number
  mentorshipAvailable: boolean
  availableForCalls: boolean
  isVerified: boolean
  verificationBadges: string[]
}

export interface NetworkingEvent {
  id: string
  title: string
  description: string
  type: 'virtual' | 'in_person' | 'hybrid'
  category: 'conference' | 'workshop' | 'meetup' | 'webinar' | 'panel' | 'networking'
  industry: string[]
  targetAudience: string[]
  skillTopics: string[]
  organizer: string
  speakerIds: string[]
  startDate: string
  endDate: string
  timeZone: string
  location?: {
    venue?: string
    address?: string
    city: string
    country: string
    coordinates?: { lat: number; lng: number }
  }
  virtualPlatform?: {
    platform: string
    meetingId: string
    accessLink: string
  }
  maxAttendees?: number
  currentAttendees: number
  registrationFee: number
  currency: string
  registrationDeadline: string
  tags: string[]
  isApprovalRequired: boolean
  status: 'upcoming' | 'live' | 'completed' | 'cancelled'
}

export interface EventRegistration {
  id: string
  userId: string
  eventId: string
  registeredAt: string
  attendanceStatus: 'registered' | 'attended' | 'no_show' | 'cancelled'
  networkingGoals?: string[]
  interestedTopics?: string[]
  lookingToConnect?: string[]
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  feedback?: EventFeedback
}

export interface EventFeedback {
  rating: number // 1-5
  content: string
  wouldRecommend: boolean
  networkingQuality: number // 1-5
  contentQuality: number // 1-5
  organizationQuality: number // 1-5
  suggestions: string
}

export interface MentorshipProgram {
  id: string
  title: string
  description: string
  category: 'career_development' | 'skill_building' | 'leadership' | 'entrepreneurship' | 'industry_transition'
  targetAudience: string[]
  duration: number // weeks
  timeCommitment: string // e.g., "2 hours per week"
  maxMentees: number
  currentMentees: number
  mentorRequirements: string[]
  applicationRequired: boolean
  isActive: boolean
  tags: string[]
  createdBy: string
  createdAt: string
}

export interface MentorshipMatch {
  id: string
  mentorId: string
  menteeId: string
  programId?: string
  status: 'pending' | 'active' | 'completed' | 'paused' | 'terminated'
  matchScore: number // 0-100 AI-calculated compatibility
  goals: string[]
  expectedDuration: number // weeks
  actualDuration?: number
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly' | 'as_needed'
  preferredMeetingType: 'video' | 'phone' | 'in_person' | 'chat' | 'mixed'
  progress: MentorshipProgress[]
  matchedAt: string
  startedAt?: string
  completedAt?: string
}

export interface MentorshipProgress {
  id: string
  sessionDate: string
  duration: number // minutes
  topics: string[]
  goals: string[]
  achievements: string[]
  challenges: string[]
  nextSteps: string[]
  mentorNotes?: string
  menteeNotes?: string
  satisfaction: number // 1-5
}

export interface ContentPost {
  id: string
  authorId: string
  type: 'article' | 'insight' | 'experience' | 'tip' | 'question' | 'poll' | 'announcement'
  title: string
  content: string
  tags: string[]
  industry: string[]
  skillTopics: string[]
  mediaUrls: string[]
  isPublic: boolean
  allowComments: boolean
  engagementScore: number
  views: number
  likes: number
  comments: number
  shares: number
  bookmarks: number
  createdAt: string
  updatedAt?: string
}

export interface ContentEngagement {
  id: string
  userId: string
  postId: string
  type: 'like' | 'comment' | 'share' | 'bookmark' | 'view'
  content?: string // For comments
  createdAt: string
}

export interface SmartIntroduction {
  id: string
  connectorId: string // Person making the introduction
  person1Id: string
  person2Id: string
  reason: string
  context: string
  suggestedMeetingType: 'coffee' | 'video_call' | 'phone' | 'lunch' | 'event'
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  followUpReminders: boolean
  createdAt: string
  acceptedAt?: string
  completedAt?: string
}

export interface NetworkAnalytics {
  userId: string
  totalConnections: number
  connectionGrowthRate: number // monthly percentage
  networkReach: number // 2nd degree connections
  industryBreakdown: { [industry: string]: number }
  roleBreakdown: { [role: string]: number }
  geographicDistribution: { [location: string]: number }
  engagementMetrics: {
    profileViews: number
    contentViews: number
    messagesSent: number
    messagesReceived: number
    endorsementsGiven: number
    endorsementsReceived: number
  }
  networkInfluence: number // 0-100 score
  lastUpdated: string
}

export interface NetworkingGoal {
  id: string
  userId: string
  type: 'expand_connections' | 'find_mentor' | 'become_mentor' | 'industry_transition' | 'skill_development' | 'thought_leadership'
  title: string
  description: string
  targetMetrics: {
    connections?: number
    industry?: string
    roles?: string[]
    companies?: string[]
    timeframe: number // weeks
  }
  currentProgress: number // 0-100
  milestones: NetworkingMilestone[]
  priority: 'low' | 'medium' | 'high'
  status: 'active' | 'paused' | 'completed' | 'abandoned'
  createdAt: string
  targetDate: string
}

export interface NetworkingMilestone {
  id: string
  title: string
  description: string
  targetDate: string
  isCompleted: boolean
  completedAt?: string
  metrics: any
}

export class ProfessionalNetworkAmplifier {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // Connection Management
  async suggestConnections(limit: number = 20): Promise<{ userId: string; reason: string; score: number; mutualConnections: string[] }[]> {
    try {
      // Get user's profile and current connections
      const [userProfile, currentConnections, userSkills, userExperience] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', this.userId).single(),
        supabase.from('professional_connections').select('to_user_id').eq('from_user_id', this.userId).eq('status', 'accepted'),
        supabase.from('user_skills').select('*').eq('user_id', this.userId),
        supabase.from('work_experience').select('*').eq('user_id', this.userId)
      ])

      const connectedUserIds = new Set(currentConnections.data?.map(c => c.to_user_id) || [])
      connectedUserIds.add(this.userId) // Exclude self

      // AI-powered connection suggestions
      const prompt = `
        Suggest professional connections for a user with the following profile:
        
        Current Role: ${userProfile.data?.current_role || 'Not specified'}
        Industry: ${userProfile.data?.industry || 'Not specified'}
        Location: ${userProfile.data?.location || 'Not specified'}
        Skills: ${userSkills.data?.map(s => s.skill_name).join(', ') || 'None specified'}
        Previous Companies: ${userExperience.data?.map(e => e.company_name).join(', ') || 'None specified'}
        Career Level: ${userProfile.data?.years_experience || 0} years experience
        
        Provide connection criteria and reasoning for each type of valuable connection:
        1. Industry peers in similar roles
        2. Senior professionals for mentorship
        3. Recruiters in their industry
        4. Alumni from their companies/schools
        5. Experts in their skill areas
        6. People in target companies
        
        Format as JSON with specific search criteria.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional networking expert. Provide strategic connection recommendations based on career goals and current profile."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })

      const aiSuggestions = JSON.parse(completion.choices[0].message.content || '{}')

      // Find actual users matching the criteria
      let query = supabase
        .from('user_profiles')
        .select(`
          id,
          current_role,
          industry,
          location,
          years_experience,
          user_skills(skill_name),
          work_experience(company_name)
        `)
        .not('id', 'in', `(${Array.from(connectedUserIds).join(',')})`)

      // Apply AI-suggested filters
      if (userProfile.data?.industry) {
        query = query.or(`industry.eq.${userProfile.data.industry},industry.ilike.%${userProfile.data.industry}%`)
      }

      const { data: potentialConnections } = await query.limit(100)

      // Score and rank potential connections
      const scoredConnections = await Promise.all(
        (potentialConnections || []).map(async (user) => {
          const score = await this.calculateConnectionScore(user, userProfile.data, userSkills.data, userExperience.data)
          const mutualConnections = await this.findMutualConnections(user.id)
          const reason = this.generateConnectionReason(user, userProfile.data, score)
          
          return {
            userId: user.id,
            reason,
            score,
            mutualConnections
          }
        })
      )

      // Sort by score and return top suggestions
      return scoredConnections
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
    } catch (error) {
      console.error('Failed to suggest connections:', error)
      throw error
    }
  }

  private async calculateConnectionScore(
    potentialConnection: any,
    userProfile: any,
    userSkills: any[],
    userExperience: any[]
  ): Promise<number> {
    let score = 0

    // Industry match (25 points)
    if (potentialConnection.industry === userProfile?.industry) {
      score += 25
    }

    // Role similarity/progression (20 points)
    if (potentialConnection.current_role === userProfile?.current_role) {
      score += 15
    } else if (this.isCareerProgression(userProfile?.current_role, potentialConnection.current_role)) {
      score += 20
    }

    // Skills overlap (20 points)
    const userSkillNames = userSkills?.map(s => s.skill_name.toLowerCase()) || []
    const connectionSkillNames = potentialConnection.user_skills?.map((s: any) => s.skill_name.toLowerCase()) || []
    const skillOverlap = userSkillNames.filter(skill => connectionSkillNames.includes(skill)).length
    score += Math.min(skillOverlap * 3, 20)

    // Company overlap (15 points)
    const userCompanies = userExperience?.map(e => e.company_name.toLowerCase()) || []
    const connectionCompanies = potentialConnection.work_experience?.map((e: any) => e.company_name.toLowerCase()) || []
    const companyOverlap = userCompanies.filter(company => connectionCompanies.includes(company)).length
    score += Math.min(companyOverlap * 5, 15)

    // Experience level consideration (10 points)
    const experienceDiff = Math.abs((userProfile?.years_experience || 0) - (potentialConnection.years_experience || 0))
    if (experienceDiff <= 3) {
      score += 10
    } else if (experienceDiff <= 7) {
      score += 5
    }

    // Location proximity (10 points)
    if (potentialConnection.location === userProfile?.location) {
      score += 10
    }

    return Math.min(score, 100)
  }

  private isCareerProgression(currentRole: string, targetRole: string): boolean {
    // Simplified career progression logic
    const progressionMap: { [key: string]: string[] } = {
      'software engineer': ['senior software engineer', 'lead engineer', 'engineering manager'],
      'marketing specialist': ['marketing manager', 'senior marketing manager', 'marketing director'],
      'business analyst': ['senior business analyst', 'product manager', 'strategy manager'],
      // Add more progression paths
    }

    const progressions = progressionMap[currentRole?.toLowerCase()] || []
    return progressions.includes(targetRole?.toLowerCase())
  }

  private async findMutualConnections(userId: string): Promise<string[]> {
    // Find mutual connections between current user and potential connection
    const { data: mutuals } = await supabase
      .from('professional_connections')
      .select('to_user_id')
      .eq('from_user_id', this.userId)
      .eq('status', 'accepted')
      .in('to_user_id', 
        supabase
          .from('professional_connections')
          .select('to_user_id')
          .eq('from_user_id', userId)
          .eq('status', 'accepted')
      )

    return mutuals?.map(m => m.to_user_id) || []
  }

  private generateConnectionReason(potentialConnection: any, userProfile: any, score: number): string {
    const reasons = []

    if (potentialConnection.industry === userProfile?.industry) {
      reasons.push(`Works in ${potentialConnection.industry}`)
    }

    if (potentialConnection.current_role === userProfile?.current_role) {
      reasons.push(`Similar role: ${potentialConnection.current_role}`)
    }

    if (score > 70) {
      reasons.push('Highly compatible profile')
    } else if (score > 50) {
      reasons.push('Good networking opportunity')
    }

    return reasons.join(' • ') || 'Potential professional connection'
  }

  async sendConnectionRequest(
    toUserId: string,
    connectionType: ProfessionalConnection['connectionType'],
    message?: string
  ): Promise<ProfessionalConnection> {
    try {
      // Check if connection already exists
      const { data: existingConnection } = await supabase
        .from('professional_connections')
        .select('*')
        .or(`and(from_user_id.eq.${this.userId},to_user_id.eq.${toUserId}),and(from_user_id.eq.${toUserId},to_user_id.eq.${this.userId})`)
        .single()

      if (existingConnection) {
        throw new Error('Connection request already exists or users are already connected')
      }

      const mutualConnections = await this.findMutualConnections(toUserId)

      const connection: ProfessionalConnection = {
        id: this.generateId(),
        fromUserId: this.userId,
        toUserId,
        status: 'pending',
        connectionType,
        requestMessage: message,
        mutualConnections: mutualConnections.length,
        interactionScore: 0,
        tags: [],
        createdAt: new Date().toISOString()
      }

      await supabase
        .from('professional_connections')
        .insert({
          id: connection.id,
          from_user_id: connection.fromUserId,
          to_user_id: connection.toUserId,
          status: connection.status,
          connection_type: connection.connectionType,
          request_message: connection.requestMessage,
          mutual_connections: connection.mutualConnections,
          interaction_score: connection.interactionScore,
          tags: connection.tags,
          created_at: connection.createdAt
        })

      // Send notification to the recipient
      await this.sendConnectionNotification(toUserId, connection)

      return connection
    } catch (error) {
      console.error('Failed to send connection request:', error)
      throw error
    }
  }

  private async sendConnectionNotification(userId: string, connection: ProfessionalConnection): Promise<void> {
    const { data: senderProfile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name, current_role, profile_image_url')
      .eq('id', connection.fromUserId)
      .single()

    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'connection_request',
        title: 'New Connection Request',
        message: `${senderProfile?.first_name} ${senderProfile?.last_name} wants to connect with you`,
        data: {
          connectionId: connection.id,
          senderProfile,
          requestMessage: connection.requestMessage
        },
        created_at: new Date().toISOString()
      })
  }

  // Content & Thought Leadership
  async createContent(contentData: Omit<ContentPost, 'id' | 'authorId' | 'engagementScore' | 'views' | 'likes' | 'comments' | 'shares' | 'bookmarks' | 'createdAt'>): Promise<ContentPost> {
    try {
      const post: ContentPost = {
        id: this.generateId(),
        authorId: this.userId,
        ...contentData,
        engagementScore: 0,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0,
        createdAt: new Date().toISOString()
      }

      await supabase
        .from('content_posts')
        .insert({
          id: post.id,
          author_id: post.authorId,
          type: post.type,
          title: post.title,
          content: post.content,
          tags: post.tags,
          industry: post.industry,
          skill_topics: post.skillTopics,
          media_urls: post.mediaUrls,
          is_public: post.isPublic,
          allow_comments: post.allowComments,
          engagement_score: post.engagementScore,
          views: post.views,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          bookmarks: post.bookmarks,
          created_at: post.createdAt
        })

      // Generate content insights and distribute to relevant network
      await this.distributeContentToNetwork(post)

      return post
    } catch (error) {
      console.error('Failed to create content:', error)
      throw error
    }
  }

  private async distributeContentToNetwork(post: ContentPost): Promise<void> {
    // Get user's connections and followers
    const { data: connections } = await supabase
      .from('professional_connections')
      .select('to_user_id')
      .eq('from_user_id', this.userId)
      .eq('status', 'accepted')

    // Send content notifications to relevant connections
    const relevantConnections = await this.filterRelevantAudience(
      connections?.map(c => c.to_user_id) || [],
      post.industry,
      post.skillTopics
    )

    for (const userId of relevantConnections) {
      await supabase
        .from('content_feed')
        .insert({
          user_id: userId,
          post_id: post.id,
          relevance_score: Math.random() * 100, // Would be calculated based on interests
          created_at: new Date().toISOString()
        })
    }
  }

  private async filterRelevantAudience(userIds: string[], industries: string[], skillTopics: string[]): Promise<string[]> {
    // Filter connections based on industry and interests
    const { data: relevantUsers } = await supabase
      .from('user_profiles')
      .select('id')
      .in('id', userIds)
      .or(`industry.in.(${industries.join(',')}),interests.overlap.{${skillTopics.join(',')}}`)

    return relevantUsers?.map(u => u.id) || []
  }

  // Mentorship
  async findMentors(criteria: {
    industry?: string
    skills?: string[]
    experienceLevel?: number
    mentorshipType?: string
  }): Promise<IndustryExpert[]> {
    try {
      let query = supabase
        .from('industry_experts')
        .select(`
          *,
          user_profiles(*)
        `)
        .eq('mentorship_available', true)

      if (criteria.industry) {
        query = query.contains('industries', [criteria.industry])
      }

      if (criteria.skills && criteria.skills.length > 0) {
        query = query.overlaps('expertise', criteria.skills)
      }

      if (criteria.experienceLevel) {
        query = query.gte('years_experience', criteria.experienceLevel)
      }

      const { data, error } = await query
        .order('credibility_score', { ascending: false })
        .order('response_rate', { ascending: false })
        .limit(20)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to find mentors:', error)
      throw error
    }
  }

  async requestMentorship(
    mentorId: string,
    goals: string[],
    expectedDuration: number,
    message: string
  ): Promise<MentorshipMatch> {
    try {
      // Calculate compatibility score
      const matchScore = await this.calculateMentorshipCompatibility(mentorId, goals)

      const mentorshipMatch: MentorshipMatch = {
        id: this.generateId(),
        mentorId,
        menteeId: this.userId,
        status: 'pending',
        matchScore,
        goals,
        expectedDuration,
        meetingFrequency: 'biweekly',
        preferredMeetingType: 'video',
        progress: [],
        matchedAt: new Date().toISOString()
      }

      await supabase
        .from('mentorship_matches')
        .insert({
          id: mentorshipMatch.id,
          mentor_id: mentorshipMatch.mentorId,
          mentee_id: mentorshipMatch.menteeId,
          status: mentorshipMatch.status,
          match_score: mentorshipMatch.matchScore,
          goals: mentorshipMatch.goals,
          expected_duration: mentorshipMatch.expectedDuration,
          meeting_frequency: mentorshipMatch.meetingFrequency,
          preferred_meeting_type: mentorshipMatch.preferredMeetingType,
          progress: mentorshipMatch.progress,
          matched_at: mentorshipMatch.matchedAt
        })

      // Send mentorship request notification
      await supabase
        .from('notifications')
        .insert({
          user_id: mentorId,
          type: 'mentorship_request',
          title: 'New Mentorship Request',
          message: `You have a new mentorship request`,
          data: {
            matchId: mentorshipMatch.id,
            goals,
            message
          },
          created_at: new Date().toISOString()
        })

      return mentorshipMatch
    } catch (error) {
      console.error('Failed to request mentorship:', error)
      throw error
    }
  }

  private async calculateMentorshipCompatibility(mentorId: string, goals: string[]): Promise<number> {
    // Get mentor's expertise and mentee's profile
    const [mentorExpert, menteeProfile] = await Promise.all([
      supabase.from('industry_experts').select('*').eq('user_id', mentorId).single(),
      supabase.from('user_profiles').select('*').eq('id', this.userId).single()
    ])

    let score = 0

    // Industry match (30 points)
    if (mentorExpert.data?.industries.includes(menteeProfile.data?.industry)) {
      score += 30
    }

    // Expertise relevance to goals (40 points)
    const expertiseOverlap = goals.filter(goal => 
      mentorExpert.data?.expertise.some((exp: string) => 
        goal.toLowerCase().includes(exp.toLowerCase())
      )
    ).length
    score += Math.min((expertiseOverlap / goals.length) * 40, 40)

    // Mentor availability and quality (30 points)
    score += (mentorExpert.data?.credibility_score || 0) * 0.15
    score += (mentorExpert.data?.response_rate || 0) * 0.15

    return Math.min(score, 100)
  }

  // Networking Events
  async getRecommendedEvents(location?: string, interests?: string[]): Promise<NetworkingEvent[]> {
    try {
      // Get user's profile for better recommendations
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', this.userId)
        .single()

      let query = supabase
        .from('networking_events')
        .select('*')
        .eq('status', 'upcoming')
        .gte('start_date', new Date().toISOString())

      // Filter by location if provided
      if (location) {
        query = query.eq('location->city', location)
      }

      // Filter by user's industry
      if (userProfile?.industry) {
        query = query.contains('industry', [userProfile.industry])
      }

      // Filter by interests/skills
      if (interests && interests.length > 0) {
        query = query.overlaps('skill_topics', interests)
      }

      const { data, error } = await query
        .order('start_date', { ascending: true })
        .limit(20)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to get recommended events:', error)
      throw error
    }
  }

  async registerForEvent(
    eventId: string,
    networkingGoals?: string[],
    interestedTopics?: string[]
  ): Promise<EventRegistration> {
    try {
      // Check if event exists and has capacity
      const { data: event } = await supabase
        .from('networking_events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (!event) {
        throw new Error('Event not found')
      }

      if (event.max_attendees && event.current_attendees >= event.max_attendees) {
        throw new Error('Event is full')
      }

      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', this.userId)
        .eq('event_id', eventId)
        .single()

      if (existingRegistration) {
        throw new Error('User is already registered for this event')
      }

      const registration: EventRegistration = {
        id: this.generateId(),
        userId: this.userId,
        eventId,
        registeredAt: new Date().toISOString(),
        attendanceStatus: 'registered',
        networkingGoals,
        interestedTopics,
        paymentStatus: event.registration_fee > 0 ? 'pending' : 'completed'
      }

      await supabase
        .from('event_registrations')
        .insert({
          id: registration.id,
          user_id: registration.userId,
          event_id: registration.eventId,
          registered_at: registration.registeredAt,
          attendance_status: registration.attendanceStatus,
          networking_goals: registration.networkingGoals,
          interested_topics: registration.interestedTopics,
          payment_status: registration.paymentStatus
        })

      // Update event attendee count
      await supabase
        .from('networking_events')
        .update({ current_attendees: event.current_attendees + 1 })
        .eq('id', eventId)

      return registration
    } catch (error) {
      console.error('Failed to register for event:', error)
      throw error
    }
  }

  // Network Analytics & Insights
  async getNetworkAnalytics(): Promise<NetworkAnalytics> {
    try {
      // Get user's connections
      const { data: connections } = await supabase
        .from('professional_connections')
        .select(`
          *,
          user_profiles!professional_connections_to_user_id_fkey(
            industry, current_role, location
          )
        `)
        .eq('from_user_id', this.userId)
        .eq('status', 'accepted')

      // Calculate network metrics
      const totalConnections = connections?.length || 0
      
      // Industry breakdown
      const industryBreakdown: { [key: string]: number } = {}
      const roleBreakdown: { [key: string]: number } = {}
      const geographicDistribution: { [key: string]: number } = {}

      connections?.forEach(conn => {
        const profile = conn.user_profiles
        if (profile?.industry) {
          industryBreakdown[profile.industry] = (industryBreakdown[profile.industry] || 0) + 1
        }
        if (profile?.current_role) {
          roleBreakdown[profile.current_role] = (roleBreakdown[profile.current_role] || 0) + 1
        }
        if (profile?.location) {
          geographicDistribution[profile.location] = (geographicDistribution[profile.location] || 0) + 1
        }
      })

      // Get engagement metrics
      const engagementMetrics = await this.calculateEngagementMetrics()

      // Calculate network influence (simplified)
      const networkInfluence = Math.min(
        (totalConnections * 0.3) + 
        (engagementMetrics.contentViews * 0.001) + 
        (engagementMetrics.endorsementsReceived * 2), 
        100
      )

      const analytics: NetworkAnalytics = {
        userId: this.userId,
        totalConnections,
        connectionGrowthRate: await this.calculateConnectionGrowthRate(),
        networkReach: await this.calculateNetworkReach(),
        industryBreakdown,
        roleBreakdown,
        geographicDistribution,
        engagementMetrics,
        networkInfluence,
        lastUpdated: new Date().toISOString()
      }

      // Store analytics for historical tracking
      await supabase
        .from('network_analytics')
        .upsert({
          user_id: this.userId,
          total_connections: analytics.totalConnections,
          connection_growth_rate: analytics.connectionGrowthRate,
          network_reach: analytics.networkReach,
          industry_breakdown: analytics.industryBreakdown,
          role_breakdown: analytics.roleBreakdown,
          geographic_distribution: analytics.geographicDistribution,
          engagement_metrics: analytics.engagementMetrics,
          network_influence: analytics.networkInfluence,
          last_updated: analytics.lastUpdated
        })

      return analytics
    } catch (error) {
      console.error('Failed to get network analytics:', error)
      throw error
    }
  }

  private async calculateEngagementMetrics(): Promise<NetworkAnalytics['engagementMetrics']> {
    const [profileViews, contentViews, messages, endorsements] = await Promise.all([
      supabase.from('profile_views').select('count').eq('profile_user_id', this.userId),
      supabase.from('content_posts').select('views').eq('author_id', this.userId),
      supabase.from('messages').select('count').eq('sender_id', this.userId),
      supabase.from('skill_endorsements').select('count').eq('to_user_id', this.userId)
    ])

    return {
      profileViews: profileViews.data?.[0]?.count || 0,
      contentViews: contentViews.data?.reduce((sum, post) => sum + post.views, 0) || 0,
      messagesSent: messages.data?.[0]?.count || 0,
      messagesReceived: 0, // Would calculate from received messages
      endorsementsGiven: 0, // Would calculate from given endorsements
      endorsementsReceived: endorsements.data?.[0]?.count || 0
    }
  }

  private async calculateConnectionGrowthRate(): Promise<number> {
    // Calculate monthly connection growth rate
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const [totalConnections, recentConnections] = await Promise.all([
      supabase.from('professional_connections').select('count').eq('from_user_id', this.userId).eq('status', 'accepted'),
      supabase.from('professional_connections').select('count').eq('from_user_id', this.userId).eq('status', 'accepted').gte('connected_at', oneMonthAgo.toISOString())
    ])

    const total = totalConnections.data?.[0]?.count || 0
    const recent = recentConnections.data?.[0]?.count || 0

    return total > 0 ? (recent / (total - recent)) * 100 : 0
  }

  private async calculateNetworkReach(): Promise<number> {
    // Calculate 2nd degree connections (simplified)
    const { data: connections } = await supabase
      .from('professional_connections')
      .select('to_user_id')
      .eq('from_user_id', this.userId)
      .eq('status', 'accepted')

    const connectionIds = connections?.map(c => c.to_user_id) || []
    
    if (connectionIds.length === 0) return 0

    const { data: secondDegree } = await supabase
      .from('professional_connections')
      .select('to_user_id')
      .in('from_user_id', connectionIds)
      .eq('status', 'accepted')
      .not('to_user_id', 'eq', this.userId)

    return new Set(secondDegree?.map(c => c.to_user_id)).size
  }

  // Helper Methods
  private generateId(): string {
    return 'net_' + Math.random().toString(36).substring(2, 15)
  }

  // Public API Methods
  async getUserConnections(status?: ProfessionalConnection['status']): Promise<ProfessionalConnection[]> {
    let query = supabase
      .from('professional_connections')
      .select(`
        *,
        user_profiles!professional_connections_to_user_id_fkey(*)
      `)
      .eq('from_user_id', this.userId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getUserContent(): Promise<ContentPost[]> {
    const { data, error } = await supabase
      .from('content_posts')
      .select('*')
      .eq('author_id', this.userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getNetworkingGoals(): Promise<NetworkingGoal[]> {
    const { data, error } = await supabase
      .from('networking_goals')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async generateNetworkInsights(): Promise<NetworkInsight[]> {
    try {
      // Get network analytics and user profile
      const [analytics, userProfile, connections] = await Promise.all([
        this.getNetworkAnalytics(),
        supabase.from('user_profiles').select('*').eq('id', this.userId).single(),
        this.getUserConnections('accepted')
      ])

      const insights: NetworkInsight[] = []

      // Generate connection opportunity insights
      if (analytics.totalConnections < 50) {
        insights.push({
          id: this.generateId(),
          userId: this.userId,
          type: 'connection_opportunity',
          title: 'Expand Your Network',
          description: 'Growing your professional network can unlock new opportunities. Consider connecting with 5-10 new professionals this week.',
          actionItems: [
            'Browse suggested connections',
            'Attend a networking event',
            'Reach out to alumni from your school/company'
          ],
          relevanceScore: 85,
          priority: 'high',
          metadata: { currentConnections: analytics.totalConnections },
          isRead: false,
          createdAt: new Date().toISOString()
        })
      }

      // Industry diversification insight
      const topIndustry = Object.keys(analytics.industryBreakdown)[0]
      const topIndustryPercentage = analytics.industryBreakdown[topIndustry] / analytics.totalConnections * 100

      if (topIndustryPercentage > 70) {
        insights.push({
          id: this.generateId(),
          userId: this.userId,
          type: 'career_advice',
          title: 'Diversify Your Network',
          description: `${topIndustryPercentage.toFixed(0)}% of your connections are in ${topIndustry}. Consider connecting with professionals from other industries.`,
          actionItems: [
            'Attend cross-industry events',
            'Join professional associations in adjacent fields',
            'Engage with content from other industries'
          ],
          relevanceScore: 70,
          priority: 'medium',
          metadata: { dominantIndustry: topIndustry, percentage: topIndustryPercentage },
          isRead: false,
          createdAt: new Date().toISOString()
        })
      }

      // Content engagement insight
      if (analytics.engagementMetrics.contentViews < 100) {
        insights.push({
          id: this.generateId(),
          userId: this.userId,
          type: 'skill_recommendation',
          title: 'Boost Your Thought Leadership',
          description: 'Sharing insights and expertise can significantly increase your professional visibility.',
          actionItems: [
            'Write about recent industry trends',
            'Share lessons learned from projects',
            'Comment thoughtfully on others\' posts'
          ],
          relevanceScore: 75,
          priority: 'medium',
          metadata: { currentViews: analytics.engagementMetrics.contentViews },
          isRead: false,
          createdAt: new Date().toISOString()
        })
      }

      return insights.slice(0, 5) // Return top 5 insights
    } catch (error) {
      console.error('Failed to generate network insights:', error)
      return []
    }
  }
}

export default ProfessionalNetworkAmplifier