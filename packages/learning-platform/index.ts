import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export interface LearningCourse {
  id: string
  title: string
  description: string
  category: 'technical' | 'soft_skills' | 'industry_specific' | 'certification' | 'leadership'
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  duration: number // hours
  modules: CourseModule[]
  prerequisites: string[]
  learningObjectives: string[]
  skills: string[]
  certificationType: 'completion' | 'assessment' | 'project' | 'industry_recognized'
  provider: string
  instructorId?: string
  price: number
  currency: string
  rating: number
  reviewCount: number
  enrollmentCount: number
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CourseModule {
  id: string
  title: string
  description: string
  type: 'video' | 'article' | 'interactive' | 'quiz' | 'assignment' | 'live_session'
  content: ModuleContent
  estimatedDuration: number // minutes
  order: number
  isRequired: boolean
  unlockConditions?: UnlockCondition[]
}

export interface ModuleContent {
  text?: string
  videoUrl?: string
  audioUrl?: string
  slides?: string[]
  documents?: string[]
  interactiveElements?: InteractiveElement[]
  quizQuestions?: QuizQuestion[]
  assignments?: Assignment[]
}

export interface InteractiveElement {
  id: string
  type: 'code_editor' | 'simulation' | 'drag_drop' | 'click_through' | 'virtual_lab'
  configuration: any
  expectedOutput?: any
  feedback: string
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay' | 'code'
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  points: number
}

export interface Assignment {
  id: string
  title: string
  description: string
  type: 'project' | 'essay' | 'code_submission' | 'presentation' | 'peer_review'
  instructions: string
  rubric: AssignmentRubric[]
  submissionFormat: string[]
  dueDate?: string
  maxAttempts: number
  passingScore: number
}

export interface AssignmentRubric {
  criteria: string
  description: string
  maxPoints: number
  levels: RubricLevel[]
}

export interface RubricLevel {
  name: string
  description: string
  points: number
}

export interface UnlockCondition {
  type: 'module_completion' | 'quiz_score' | 'assignment_submission' | 'time_spent'
  targetId?: string
  requiredValue: number
}

export interface UserEnrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  completedAt?: string
  currentModuleId?: string
  progress: number // 0-100
  totalTimeSpent: number // minutes
  certificateIssued: boolean
  certificateId?: string
  finalGrade?: number
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped' | 'paused'
}

export interface UserModuleProgress {
  id: string
  userId: string
  moduleId: string
  courseId: string
  startedAt: string
  completedAt?: string
  timeSpent: number // minutes
  attempts: number
  bestScore?: number
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
}

export interface LiveWorkshop {
  id: string
  title: string
  description: string
  instructorId: string
  category: string
  level: string
  scheduledDate: string
  duration: number // minutes
  maxParticipants: number
  currentParticipants: number
  price: number
  currency: string
  zoomMeetingId?: string
  recordingUrl?: string
  materials: string[]
  prerequisites: string[]
  learningObjectives: string[]
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  tags: string[]
}

export interface WorkshopRegistration {
  id: string
  userId: string
  workshopId: string
  registeredAt: string
  attended: boolean
  certificateIssued: boolean
  feedback?: WorkshopFeedback
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
}

export interface WorkshopFeedback {
  rating: number // 1-5
  content: string
  instructorRating: number
  recommendToOthers: boolean
  suggestions: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  targetRole: string
  estimatedDuration: number // weeks
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  courses: LearningPathStep[]
  skills: string[]
  prerequisites: string[]
  outcomeDescription: string
  successRate: number // percentage
  price: number
  currency: string
  createdBy: string
  isActive: boolean
  createdAt: string
}

export interface LearningPathStep {
  courseId: string
  order: number
  isRequired: boolean
  estimatedWeeks: number
  description: string
}

export interface UserLearningPath {
  id: string
  userId: string
  pathId: string
  startedAt: string
  estimatedCompletionDate: string
  actualCompletionDate?: string
  currentStepIndex: number
  progress: number // 0-100
  status: 'active' | 'completed' | 'paused' | 'abandoned'
}

export interface Certification {
  id: string
  name: string
  description: string
  issuingOrganization: string
  type: 'internal' | 'industry_recognized' | 'university' | 'government'
  validityPeriod?: number // months, null for lifetime
  requirements: CertificationRequirement[]
  badgeImageUrl: string
  verificationUrl: string
  skills: string[]
  industryRecognition: string[]
  marketValue: string
  preparationTime: number // hours
  examFee?: number
  currency?: string
}

export interface CertificationRequirement {
  type: 'course_completion' | 'exam_pass' | 'project_submission' | 'work_experience'
  description: string
  minimumScore?: number
  requiredIds?: string[]
  alternatives?: CertificationRequirement[]
}

export interface UserCertification {
  id: string
  userId: string
  certificationId: string
  earnedAt: string
  expiresAt?: string
  verificationCode: string
  score?: number
  issuerSignature: string
  badgeUrl: string
  shareableUrl: string
  status: 'active' | 'expired' | 'revoked'
}

export interface SkillAssessment {
  id: string
  title: string
  description: string
  skill: string
  level: string
  questions: AssessmentQuestion[]
  timeLimit: number // minutes
  passingScore: number
  attempts: number
  validityPeriod: number // days
  industryStandard: boolean
  createdBy: string
  isActive: boolean
}

export interface AssessmentQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'coding' | 'scenario' | 'practical'
  options?: string[]
  correctAnswer: any
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  timeLimit?: number // seconds
}

export interface UserAssessment {
  id: string
  userId: string
  assessmentId: string
  startedAt: string
  completedAt?: string
  score: number
  passed: boolean
  answers: UserAnswer[]
  timeSpent: number // seconds
  certificateIssued: boolean
  retakeAvailable: boolean
  nextRetakeDate?: string
}

export interface UserAnswer {
  questionId: string
  userAnswer: any
  isCorrect: boolean
  pointsEarned: number
  timeSpent: number // seconds
}

export interface LearningCommunity {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  isPrivate: boolean
  rules: string[]
  moderators: string[]
  tags: string[]
  createdBy: string
  createdAt: string
}

export interface CommunityMember {
  id: string
  userId: string
  communityId: string
  joinedAt: string
  role: 'member' | 'moderator' | 'admin'
  reputationScore: number
  contributionCount: number
  lastActive: string
}

export interface StudyGroup {
  id: string
  name: string
  description: string
  courseId?: string
  skillTopic: string
  maxMembers: number
  currentMembers: number
  meetingSchedule: string
  timeZone: string
  language: string
  level: string
  createdBy: string
  createdAt: string
  status: 'open' | 'closed' | 'archived'
}

export interface MicrolearningModule {
  id: string
  title: string
  content: string
  type: 'tip' | 'fact' | 'exercise' | 'challenge' | 'reminder'
  skill: string
  estimatedTime: number // seconds
  difficultyLevel: number // 1-10
  tags: string[]
  mediaUrl?: string
  interactionRequired: boolean
  createdAt: string
}

export interface GamificationElement {
  id: string
  type: 'points' | 'badge' | 'streak' | 'level' | 'leaderboard'
  name: string
  description: string
  trigger: 'course_completion' | 'quiz_pass' | 'daily_login' | 'community_contribution'
  reward: number
  icon: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
}

export class LearningPlatform {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // Course Management
  async getAllCourses(filters?: {
    category?: string
    level?: string
    skills?: string[]
    priceRange?: { min: number; max: number }
    duration?: { min: number; max: number }
    rating?: number
  }): Promise<LearningCourse[]> {
    try {
      let query = supabase
        .from('learning_courses')
        .select('*')
        .eq('is_active', true)

      if (filters) {
        if (filters.category) {
          query = query.eq('category', filters.category)
        }
        if (filters.level) {
          query = query.eq('level', filters.level)
        }
        if (filters.skills && filters.skills.length > 0) {
          query = query.overlaps('skills', filters.skills)
        }
        if (filters.priceRange) {
          query = query.gte('price', filters.priceRange.min).lte('price', filters.priceRange.max)
        }
        if (filters.duration) {
          query = query.gte('duration', filters.duration.min).lte('duration', filters.duration.max)
        }
        if (filters.rating) {
          query = query.gte('rating', filters.rating)
        }
      }

      const { data, error } = await query.order('rating', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      throw error
    }
  }

  async getPersonalizedCourseRecommendations(): Promise<LearningCourse[]> {
    try {
      // Get user's profile and current skills
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', this.userId)
        .single()

      const { data: userSkills } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', this.userId)

      // Get user's career goals
      const { data: careerGoals } = await supabase
        .from('career_goals')
        .select('*')
        .eq('user_id', this.userId)
        .eq('is_active', true)

      const prompt = `
        Recommend personalized learning courses for a professional with the following profile:
        
        Current Role: ${profile?.current_role || 'Not specified'}
        Industry: ${profile?.industry || 'Not specified'}
        Experience Level: ${profile?.years_experience || 0} years
        Current Skills: ${userSkills?.map(s => `${s.skill_name} (${s.proficiency_level}%)`).join(', ') || 'None specified'}
        Career Goals: ${careerGoals?.map(g => `${g.target_role} in ${g.timeframe}`).join(', ') || 'None specified'}
        
        Please recommend 10-15 courses that would help advance their career, focusing on:
        1. Skill gaps for their target role
        2. Industry-specific knowledge
        3. Emerging technologies and trends
        4. Leadership and soft skills
        5. Certifications that add value
        
        Provide course recommendations with reasoning for each suggestion.
        Format as JSON with course requirements and expected outcomes.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert learning advisor with deep knowledge of professional development and industry trends. Provide personalized course recommendations that align with career goals and skill development needs."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })

      const aiRecommendations = JSON.parse(completion.choices[0].message.content || '{}')
      
      // Match AI recommendations with actual available courses
      const allCourses = await this.getAllCourses()
      const recommendedCourses = allCourses.filter(course => {
        return aiRecommendations.recommendedSkills?.some((skill: string) => 
          course.skills.some(courseSkill => 
            courseSkill.toLowerCase().includes(skill.toLowerCase())
          )
        ) || aiRecommendations.recommendedCategories?.includes(course.category)
      })

      // Sort by relevance and rating
      return recommendedCourses
        .sort((a, b) => (b.rating * b.enrollmentCount) - (a.rating * a.enrollmentCount))
        .slice(0, 15)
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error)
      throw error
    }
  }

  async enrollInCourse(courseId: string): Promise<UserEnrollment> {
    try {
      // Check if user is already enrolled
      const { data: existingEnrollment } = await supabase
        .from('user_enrollments')
        .select('*')
        .eq('user_id', this.userId)
        .eq('course_id', courseId)
        .single()

      if (existingEnrollment) {
        throw new Error('User is already enrolled in this course')
      }

      // Get course details
      const { data: course } = await supabase
        .from('learning_courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (!course) {
        throw new Error('Course not found')
      }

      // Create enrollment
      const enrollment: UserEnrollment = {
        id: this.generateId(),
        userId: this.userId,
        courseId,
        enrolledAt: new Date().toISOString(),
        currentModuleId: course.modules[0]?.id,
        progress: 0,
        totalTimeSpent: 0,
        certificateIssued: false,
        status: 'enrolled'
      }

      await supabase
        .from('user_enrollments')
        .insert({
          id: enrollment.id,
          user_id: enrollment.userId,
          course_id: enrollment.courseId,
          enrolled_at: enrollment.enrolledAt,
          current_module_id: enrollment.currentModuleId,
          progress: enrollment.progress,
          total_time_spent: enrollment.totalTimeSpent,
          certificate_issued: enrollment.certificateIssued,
          status: enrollment.status
        })

      // Update course enrollment count
      await supabase
        .from('learning_courses')
        .update({ enrollment_count: course.enrollment_count + 1 })
        .eq('id', courseId)

      return enrollment
    } catch (error) {
      console.error('Failed to enroll in course:', error)
      throw error
    }
  }

  async updateModuleProgress(moduleId: string, courseId: string, timeSpent: number, completed: boolean = false, score?: number): Promise<UserModuleProgress> {
    try {
      // Get or create module progress
      let { data: progress } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', this.userId)
        .eq('module_id', moduleId)
        .single()

      if (!progress) {
        progress = {
          id: this.generateId(),
          user_id: this.userId,
          module_id: moduleId,
          course_id: courseId,
          started_at: new Date().toISOString(),
          time_spent: 0,
          attempts: 0,
          status: 'not_started'
        }
      }

      // Update progress
      const updatedProgress = {
        ...progress,
        time_spent: progress.time_spent + timeSpent,
        attempts: progress.attempts + 1,
        status: completed ? 'completed' : 'in_progress',
        completed_at: completed ? new Date().toISOString() : progress.completed_at,
        best_score: score !== undefined ? Math.max(progress.best_score || 0, score) : progress.best_score
      }

      await supabase
        .from('user_module_progress')
        .upsert(updatedProgress)

      // Update overall course progress if module completed
      if (completed) {
        await this.updateCourseProgress(courseId)
      }

      return updatedProgress as UserModuleProgress
    } catch (error) {
      console.error('Failed to update module progress:', error)
      throw error
    }
  }

  private async updateCourseProgress(courseId: string): Promise<void> {
    try {
      // Get course modules
      const { data: course } = await supabase
        .from('learning_courses')
        .select('modules')
        .eq('id', courseId)
        .single()

      if (!course) return

      // Get user's module progress
      const { data: moduleProgress } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', this.userId)
        .eq('course_id', courseId)

      const totalModules = course.modules.length
      const completedModules = moduleProgress?.filter(p => p.status === 'completed').length || 0
      const progress = Math.round((completedModules / totalModules) * 100)

      // Update enrollment progress
      const updateData: any = {
        progress,
        total_time_spent: moduleProgress?.reduce((sum, p) => sum + p.time_spent, 0) || 0,
        updated_at: new Date().toISOString()
      }

      if (progress === 100) {
        updateData.status = 'completed'
        updateData.completed_at = new Date().toISOString()
      } else if (progress > 0) {
        updateData.status = 'in_progress'
      }

      await supabase
        .from('user_enrollments')
        .update(updateData)
        .eq('user_id', this.userId)
        .eq('course_id', courseId)
    } catch (error) {
      console.error('Failed to update course progress:', error)
    }
  }

  // Workshop Management
  async getUpcomingWorkshops(filters?: {
    category?: string
    level?: string
    skills?: string[]
    dateRange?: { start: string; end: string }
  }): Promise<LiveWorkshop[]> {
    try {
      let query = supabase
        .from('live_workshops')
        .select('*')
        .eq('status', 'scheduled')
        .gte('scheduled_date', new Date().toISOString())

      if (filters) {
        if (filters.category) {
          query = query.eq('category', filters.category)
        }
        if (filters.level) {
          query = query.eq('level', filters.level)
        }
        if (filters.dateRange) {
          query = query.gte('scheduled_date', filters.dateRange.start)
                      .lte('scheduled_date', filters.dateRange.end)
        }
      }

      const { data, error } = await query.order('scheduled_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Failed to fetch workshops:', error)
      throw error
    }
  }

  async registerForWorkshop(workshopId: string): Promise<WorkshopRegistration> {
    try {
      // Check if workshop is available
      const { data: workshop } = await supabase
        .from('live_workshops')
        .select('*')
        .eq('id', workshopId)
        .single()

      if (!workshop) {
        throw new Error('Workshop not found')
      }

      if (workshop.current_participants >= workshop.max_participants) {
        throw new Error('Workshop is full')
      }

      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('workshop_registrations')
        .select('*')
        .eq('user_id', this.userId)
        .eq('workshop_id', workshopId)
        .single()

      if (existingRegistration) {
        throw new Error('User is already registered for this workshop')
      }

      // Create registration
      const registration: WorkshopRegistration = {
        id: this.generateId(),
        userId: this.userId,
        workshopId,
        registeredAt: new Date().toISOString(),
        attended: false,
        certificateIssued: false,
        paymentStatus: workshop.price > 0 ? 'pending' : 'completed'
      }

      await supabase
        .from('workshop_registrations')
        .insert({
          id: registration.id,
          user_id: registration.userId,
          workshop_id: registration.workshopId,
          registered_at: registration.registeredAt,
          attended: registration.attended,
          certificate_issued: registration.certificateIssued,
          payment_status: registration.paymentStatus
        })

      // Update workshop participant count
      await supabase
        .from('live_workshops')
        .update({ current_participants: workshop.current_participants + 1 })
        .eq('id', workshopId)

      return registration
    } catch (error) {
      console.error('Failed to register for workshop:', error)
      throw error
    }
  }

  // Skill Assessment
  async takeSkillAssessment(assessmentId: string): Promise<UserAssessment> {
    try {
      // Get assessment details
      const { data: assessment } = await supabase
        .from('skill_assessments')
        .select('*')
        .eq('id', assessmentId)
        .single()

      if (!assessment) {
        throw new Error('Assessment not found')
      }

      // Check if user can retake
      const { data: previousAttempts } = await supabase
        .from('user_assessments')
        .select('*')
        .eq('user_id', this.userId)
        .eq('assessment_id', assessmentId)
        .order('started_at', { ascending: false })

      if (previousAttempts && previousAttempts.length >= assessment.attempts) {
        throw new Error('Maximum attempts reached for this assessment')
      }

      // Create new assessment attempt
      const userAssessment: UserAssessment = {
        id: this.generateId(),
        userId: this.userId,
        assessmentId,
        startedAt: new Date().toISOString(),
        score: 0,
        passed: false,
        answers: [],
        timeSpent: 0,
        certificateIssued: false,
        retakeAvailable: false
      }

      await supabase
        .from('user_assessments')
        .insert({
          id: userAssessment.id,
          user_id: userAssessment.userId,
          assessment_id: userAssessment.assessmentId,
          started_at: userAssessment.startedAt,
          score: userAssessment.score,
          passed: userAssessment.passed,
          answers: userAssessment.answers,
          time_spent: userAssessment.timeSpent,
          certificate_issued: userAssessment.certificateIssued,
          retake_available: userAssessment.retakeAvailable
        })

      return userAssessment
    } catch (error) {
      console.error('Failed to start assessment:', error)
      throw error
    }
  }

  async submitAssessmentAnswer(assessmentId: string, questionId: string, answer: any): Promise<UserAnswer> {
    try {
      // Get the question and correct answer
      const { data: assessment } = await supabase
        .from('skill_assessments')
        .select('questions')
        .eq('id', assessmentId)
        .single()

      if (!assessment) {
        throw new Error('Assessment not found')
      }

      const question = assessment.questions.find((q: AssessmentQuestion) => q.id === questionId)
      if (!question) {
        throw new Error('Question not found')
      }

      // Evaluate answer
      const isCorrect = this.evaluateAnswer(question, answer)
      const pointsEarned = isCorrect ? question.points : 0

      const userAnswer: UserAnswer = {
        questionId,
        userAnswer: answer,
        isCorrect,
        pointsEarned,
        timeSpent: 0 // Would be tracked from frontend
      }

      // Update user assessment with this answer
      const { data: userAssessment } = await supabase
        .from('user_assessments')
        .select('answers')
        .eq('user_id', this.userId)
        .eq('assessment_id', assessmentId)
        .order('started_at', { ascending: false })
        .limit(1)
        .single()

      if (userAssessment) {
        const updatedAnswers = [...userAssessment.answers, userAnswer]
        await supabase
          .from('user_assessments')
          .update({ answers: updatedAnswers })
          .eq('user_id', this.userId)
          .eq('assessment_id', assessmentId)
      }

      return userAnswer
    } catch (error) {
      console.error('Failed to submit assessment answer:', error)
      throw error
    }
  }

  private evaluateAnswer(question: AssessmentQuestion, userAnswer: any): boolean {
    switch (question.type) {
      case 'multiple_choice':
        return userAnswer === question.correctAnswer
      case 'true_false':
        return userAnswer === question.correctAnswer
      case 'fill_blank':
        if (Array.isArray(question.correctAnswer)) {
          return question.correctAnswer.some(correct => 
            userAnswer.toLowerCase().trim() === correct.toLowerCase().trim()
          )
        }
        return userAnswer.toLowerCase().trim() === (question.correctAnswer as string).toLowerCase().trim()
      case 'essay':
        // Would require AI evaluation or manual review
        return false
      case 'code':
        // Would require code execution and validation
        return false
      default:
        return false
    }
  }

  // Learning Communities
  async joinLearningCommunity(communityId: string): Promise<CommunityMember> {
    try {
      // Check if community exists and user isn't already a member
      const { data: community } = await supabase
        .from('learning_communities')
        .select('*')
        .eq('id', communityId)
        .single()

      if (!community) {
        throw new Error('Community not found')
      }

      const { data: existingMember } = await supabase
        .from('community_members')
        .select('*')
        .eq('user_id', this.userId)
        .eq('community_id', communityId)
        .single()

      if (existingMember) {
        throw new Error('User is already a member of this community')
      }

      // Create membership
      const member: CommunityMember = {
        id: this.generateId(),
        userId: this.userId,
        communityId,
        joinedAt: new Date().toISOString(),
        role: 'member',
        reputationScore: 0,
        contributionCount: 0,
        lastActive: new Date().toISOString()
      }

      await supabase
        .from('community_members')
        .insert({
          id: member.id,
          user_id: member.userId,
          community_id: member.communityId,
          joined_at: member.joinedAt,
          role: member.role,
          reputation_score: member.reputationScore,
          contribution_count: member.contributionCount,
          last_active: member.lastActive
        })

      // Update community member count
      await supabase
        .from('learning_communities')
        .update({ member_count: community.member_count + 1 })
        .eq('id', communityId)

      return member
    } catch (error) {
      console.error('Failed to join learning community:', error)
      throw error
    }
  }

  // Microlearning
  async getDailyMicrolearning(skillFocus?: string): Promise<MicrolearningModule[]> {
    try {
      let query = supabase
        .from('microlearning_modules')
        .select('*')

      if (skillFocus) {
        query = query.eq('skill', skillFocus)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error

      // Personalize based on user's current skills and goals
      const personalizedModules = await this.personalizeContent(data || [])
      return personalizedModules
    } catch (error) {
      console.error('Failed to get daily microlearning:', error)
      throw error
    }
  }

  private async personalizeContent(modules: MicrolearningModule[]): Promise<MicrolearningModule[]> {
    // Get user's skills and learning preferences
    const { data: userSkills } = await supabase
      .from('user_skills')
      .select('skill_name, proficiency_level')
      .eq('user_id', this.userId)

    // Filter and sort modules based on user's skill level and interests
    return modules
      .filter(module => {
        const userSkill = userSkills?.find(s => s.skill_name.toLowerCase() === module.skill.toLowerCase())
        if (!userSkill) return true // Include if user hasn't assessed this skill yet
        
        // Match difficulty to user's skill level
        const skillLevel = userSkill.proficiency_level
        const appropriateDifficulty = skillLevel < 30 ? [1,2,3] : 
                                     skillLevel < 60 ? [3,4,5,6] : 
                                     skillLevel < 80 ? [6,7,8] : [8,9,10]
        
        return appropriateDifficulty.includes(module.difficultyLevel)
      })
      .sort((a, b) => b.difficultyLevel - a.difficultyLevel)
      .slice(0, 3)
  }

  // Helper Methods
  private generateId(): string {
    return 'learn_' + Math.random().toString(36).substring(2, 15)
  }

  // Public API Methods
  async getUserEnrollments(): Promise<UserEnrollment[]> {
    const { data, error } = await supabase
      .from('user_enrollments')
      .select(`
        *,
        learning_courses (*)
      `)
      .eq('user_id', this.userId)
      .order('enrolled_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getUserCertifications(): Promise<UserCertification[]> {
    const { data, error } = await supabase
      .from('user_certifications')
      .select(`
        *,
        certifications (*)
      `)
      .eq('user_id', this.userId)
      .order('earned_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getRecommendedLearningPaths(): Promise<LearningPath[]> {
    // Get user's career goals and skills to recommend appropriate learning paths
    const { data: careerGoals } = await supabase
      .from('career_goals')
      .select('target_role')
      .eq('user_id', this.userId)

    let query = supabase
      .from('learning_paths')
      .select('*')
      .eq('is_active', true)

    if (careerGoals && careerGoals.length > 0) {
      const targetRoles = careerGoals.map(g => g.target_role)
      query = query.in('target_role', targetRoles)
    }

    const { data, error } = await query
      .order('success_rate', { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  }

  async trackLearningActivity(activity: {
    type: 'course_start' | 'module_complete' | 'assessment_pass' | 'workshop_attend' | 'community_post'
    resourceId: string
    timeSpent?: number
    score?: number
    metadata?: any
  }): Promise<void> {
    try {
      await supabase
        .from('learning_activities')
        .insert({
          user_id: this.userId,
          activity_type: activity.type,
          resource_id: activity.resourceId,
          time_spent: activity.timeSpent || 0,
          score: activity.score,
          metadata: activity.metadata,
          created_at: new Date().toISOString()
        })

      // Update gamification elements
      await this.updateGamificationProgress(activity.type)
    } catch (error) {
      console.error('Failed to track learning activity:', error)
    }
  }

  private async updateGamificationProgress(activityType: string): Promise<void> {
    // This would integrate with the achievement system
    // Award points, update streaks, check for badge unlocks, etc.
    
    // Example: Award points for different activities
    const pointsMap = {
      'course_start': 5,
      'module_complete': 10,
      'assessment_pass': 25,
      'workshop_attend': 50,
      'community_post': 3
    }

    const points = pointsMap[activityType as keyof typeof pointsMap] || 0
    if (points > 0) {
      // Add to user's learning points (separate from main achievement points)
      await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: this.userId,
          total_points: supabase.raw(`COALESCE(total_points, 0) + ${points}`),
          last_activity: new Date().toISOString()
        })
    }
  }
}

export default LearningPlatform