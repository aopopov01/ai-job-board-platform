'use client'

import { useState, useEffect } from 'react'
import { Button } from '@job-board/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Badge } from '@job-board/ui'
import { Progress } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@job-board/ui'
import { 
  Trophy, 
  Star, 
  Zap, 
  Users,
  Target,
  Award,
  TrendingUp,
  Crown,
  Medal,
  Flame,
  Calendar,
  Clock,
  CheckCircle,
  Play,
  Book,
  MessageCircle,
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  BarChart3,
  Gamepad2,
  Puzzle,
  Lightbulb,
  Network,
  BookOpen,
  UserCheck,
  Sparkles,
  Globe,
  ArrowUp,
  ChevronRight
} from 'lucide-react'
import {
  GamificationProfile,
  Challenge,
  Badge as GamificationBadge,
  Achievement,
  Community,
  MentorshipProgram,
  gamificationEngine,
  GamificationUtils
} from '@job-board/ai/gamification-community'

export default function GamificationPage() {
  // Main state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'challenges' | 'achievements' | 'community' | 'mentorship' | 'leaderboards'>('dashboard')
  const [userProfile, setUserProfile] = useState<GamificationProfile | null>(null)
  
  // Challenges state
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([])
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false)
  
  // Community state
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([])
  
  // Mentorship state
  const [mentorshipPrograms, setMentorshipPrograms] = useState<MentorshipProgram[]>([])
  const [isMentor, setIsMentor] = useState(false)
  const [isMentee, setIsMentee] = useState(true)
  
  // Leaderboards state
  const [leaderboards, setLeaderboards] = useState<any[]>([])
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('overall')

  // Initialize with mock data
  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Mock user profile
    const mockProfile: GamificationProfile = {
      id: 'user_123',
      userId: 'current_user',
      userType: 'candidate',
      level: 8,
      totalXP: 6400,
      currentXP: 400,
      xpToNextLevel: 500,
      badges: [
        {
          id: 'newcomer',
          name: 'Newcomer',
          description: 'Completed first activity',
          category: 'first_steps',
          rarity: 'common',
          iconUrl: '/badges/newcomer.png',
          earnedAt: new Date('2024-01-15'),
          requirements: [],
          rewards: []
        },
        {
          id: 'skill_builder',
          name: 'Skill Builder',
          description: 'Completed 5 skill assessments',
          category: 'skill_mastery',
          rarity: 'uncommon',
          iconUrl: '/badges/skill-builder.png',
          earnedAt: new Date('2024-02-20'),
          requirements: [],
          rewards: []
        },
        {
          id: 'community_champion',
          name: 'Community Champion',
          description: 'Helped 50 community members',
          category: 'community_contribution',
          rarity: 'rare',
          iconUrl: '/badges/community-champion.png',
          earnedAt: new Date('2024-03-10'),
          requirements: [],
          rewards: []
        }
      ],
      achievements: [],
      streaks: [
        {
          id: 'daily_login',
          type: 'daily_login',
          name: 'Daily Login Streak',
          description: 'Login daily to maintain streak',
          currentCount: 12,
          longestCount: 25,
          lastActivityAt: new Date(),
          isActive: true,
          rewards: [],
          milestones: []
        },
        {
          id: 'skill_practice',
          type: 'skill_practice',
          name: 'Skill Practice Streak',
          description: 'Practice skills daily',
          currentCount: 5,
          longestCount: 15,
          lastActivityAt: new Date(),
          isActive: true,
          rewards: [],
          milestones: []
        }
      ],
      challenges: [],
      leaderboardRankings: [
        {
          leaderboardId: 'overall',
          rank: 34,
          score: 6400,
          category: 'Overall XP',
          timeframe: 'all_time',
          lastUpdated: new Date()
        },
        {
          leaderboardId: 'monthly',
          rank: 12,
          score: 890,
          category: 'Monthly XP',
          timeframe: 'monthly',
          lastUpdated: new Date()
        }
      ],
      socialStats: {
        connectionsCount: 127,
        mentorsCount: 2,
        menteesCount: 1,
        endorsementsGiven: 45,
        endorsementsReceived: 38,
        postsCreated: 23,
        commentsCreated: 156,
        helpfulVotes: 89,
        knowledgeShared: 34,
        eventsAttended: 8,
        groupsJoined: 6,
        reputationScore: 834
      },
      preferences: {
        enableNotifications: true,
        enableLeaderboards: true,
        enableChallenges: true,
        visibilitySettings: {
          showProfile: true,
          showBadges: true,
          showAchievements: true,
          showLeaderboardRank: true,
          showProgress: true
        },
        preferredChallengeTypes: ['skill_development', 'networking'],
        motivationStyle: 'collaborative'
      },
      createdAt: new Date('2024-01-01'),
      lastActive: new Date()
    }
    setUserProfile(mockProfile)

    // Mock challenges
    const mockChallenges: Challenge[] = [
      {
        id: 'challenge_1',
        title: '30-Day JavaScript Mastery',
        description: 'Master JavaScript fundamentals through daily coding challenges and projects',
        category: 'skill_development',
        type: 'individual',
        difficulty: 'intermediate',
        duration: 30,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-31'),
        status: 'active',
        tasks: [],
        rewards: [],
        leaderboard: { entries: [], lastUpdated: new Date(), updateFrequency: 'daily' },
        participants: [],
        sponsors: ['TechCorp', 'CodeAcademy'],
        community: {
          discussionThreads: 45,
          activeMembers: 234,
          mentorsAvailable: 12,
          resourcesShared: 78
        }
      },
      {
        id: 'challenge_2',
        title: 'AI Interview Prep Challenge',
        description: 'Prepare for AI and machine learning interviews with hands-on projects',
        category: 'interview_prep',
        type: 'team',
        difficulty: 'advanced',
        duration: 14,
        startDate: new Date('2024-07-15'),
        endDate: new Date('2024-07-29'),
        status: 'upcoming',
        tasks: [],
        rewards: [],
        leaderboard: { entries: [], lastUpdated: new Date(), updateFrequency: 'daily' },
        participants: [],
        sponsors: ['AI Innovations'],
        community: {
          discussionThreads: 12,
          activeMembers: 89,
          mentorsAvailable: 8,
          resourcesShared: 23
        }
      },
      {
        id: 'challenge_3',
        title: 'Network Builder Challenge',
        description: 'Expand your professional network with strategic connections',
        category: 'networking',
        type: 'community',
        difficulty: 'beginner',
        duration: 7,
        startDate: new Date('2024-07-08'),
        endDate: new Date('2024-07-15'),
        status: 'active',
        tasks: [],
        rewards: [],
        leaderboard: { entries: [], lastUpdated: new Date(), updateFrequency: 'daily' },
        participants: [],
        sponsors: [],
        community: {
          discussionThreads: 28,
          activeMembers: 156,
          mentorsAvailable: 5,
          resourcesShared: 34
        }
      }
    ]
    setChallenges(mockChallenges)
    setJoinedChallenges(['challenge_1', 'challenge_3'])

    // Mock communities
    const mockCommunities: Community[] = [
      {
        id: 'tech_professionals',
        name: 'Tech Professionals Network',
        description: 'Connect with fellow technology professionals, share knowledge, and grow together',
        category: 'industry',
        type: 'public',
        memberCount: 2340,
        activeMembers: 456,
        createdAt: new Date('2023-01-01'),
        createdBy: 'admin',
        moderators: ['mod1', 'mod2'],
        tags: ['technology', 'software', 'career', 'networking'],
        rules: [],
        features: [
          { type: 'discussions', enabled: true, settings: {} },
          { type: 'mentorship', enabled: true, settings: {} },
          { type: 'events', enabled: true, settings: {} },
          { type: 'job_board', enabled: true, settings: {} }
        ],
        stats: {
          postsCount: 1234,
          commentsCount: 5678,
          eventsCount: 45,
          resourcesCount: 234,
          mentorshipConnections: 123,
          jobPostings: 67,
          averageEngagement: 78
        }
      },
      {
        id: 'ai_ml_enthusiasts',
        name: 'AI & ML Enthusiasts',
        description: 'Explore the world of artificial intelligence and machine learning',
        category: 'skill',
        type: 'public',
        memberCount: 1890,
        activeMembers: 345,
        createdAt: new Date('2023-03-15'),
        createdBy: 'ai_expert',
        moderators: ['ai_mod1', 'ml_mod2'],
        tags: ['ai', 'machine-learning', 'data-science', 'python'],
        rules: [],
        features: [
          { type: 'discussions', enabled: true, settings: {} },
          { type: 'resources', enabled: true, settings: {} },
          { type: 'study_groups', enabled: true, settings: {} }
        ],
        stats: {
          postsCount: 890,
          commentsCount: 3456,
          eventsCount: 23,
          resourcesCount: 167,
          mentorshipConnections: 89,
          jobPostings: 34,
          averageEngagement: 82
        }
      },
      {
        id: 'career_growth',
        name: 'Career Growth Hub',
        description: 'Strategies, tips, and support for accelerating your career',
        category: 'career_level',
        type: 'public',
        memberCount: 3456,
        activeMembers: 678,
        createdAt: new Date('2022-06-01'),
        createdBy: 'career_coach',
        moderators: ['coach1', 'coach2', 'coach3'],
        tags: ['career', 'growth', 'leadership', 'skills'],
        rules: [],
        features: [
          { type: 'discussions', enabled: true, settings: {} },
          { type: 'mentorship', enabled: true, settings: {} },
          { type: 'events', enabled: true, settings: {} },
          { type: 'resources', enabled: true, settings: {} }
        ],
        stats: {
          postsCount: 2345,
          commentsCount: 8901,
          eventsCount: 67,
          resourcesCount: 345,
          mentorshipConnections: 234,
          jobPostings: 89,
          averageEngagement: 75
        }
      }
    ]
    setCommunities(mockCommunities)
    setJoinedCommunities(['tech_professionals', 'career_growth'])

    // Mock leaderboards
    const mockLeaderboards = [
      {
        rank: 34,
        username: 'You',
        score: 6400,
        change: '+2',
        avatar: '/avatars/you.png',
        badges: ['skill_builder', 'community_champion']
      },
      {
        rank: 1,
        username: 'CodeMaster',
        score: 15420,
        change: '→',
        avatar: '/avatars/1.png',
        badges: ['legendary_coder', 'mentor_elite']
      },
      {
        rank: 2,
        username: 'AIExpert',
        score: 14890,
        change: '+1',
        avatar: '/avatars/2.png',
        badges: ['ai_specialist', 'thought_leader']
      },
      {
        rank: 3,
        username: 'NetworkKing',
        score: 13670,
        change: '-1',
        avatar: '/avatars/3.png',
        badges: ['super_connector', 'community_builder']
      }
    ]
    setLeaderboards(mockLeaderboards)
  }

  // Generate new challenge
  const createChallenge = async () => {
    setIsCreatingChallenge(true)
    try {
      const newChallenge = await gamificationEngine.generateChallenge({
        theme: 'Full-Stack Development',
        targetAudience: 'Intermediate developers',
        skillLevel: 'intermediate',
        duration: 21,
        objectives: ['Build a complete web application', 'Learn modern frameworks', 'Deploy to production']
      })
      
      setChallenges(prev => [newChallenge, ...prev])
    } catch (error) {
      console.error('Error creating challenge:', error)
    } finally {
      setIsCreatingChallenge(false)
    }
  }

  // Join challenge
  const joinChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => [...prev, challengeId])
  }

  // Leave challenge
  const leaveChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => prev.filter(id => id !== challengeId))
  }

  // Join community
  const joinCommunity = (communityId: string) => {
    setJoinedCommunities(prev => [...prev, communityId])
  }

  // Leave community
  const leaveCommunity = (communityId: string) => {
    setJoinedCommunities(prev => prev.filter(id => id !== communityId))
  }

  if (!userProfile) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gamification & Community Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Level up your career through challenges, achievements, and community collaboration
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab as any} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Trophy className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center">
              <Award className="mr-2 h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="flex items-center">
              <UserCheck className="mr-2 h-4 w-4" />
              Mentorship
            </TabsTrigger>
            <TabsTrigger value="leaderboards" className="flex items-center">
              <Crown className="mr-2 h-4 w-4" />
              Leaderboards
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Stats */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Trophy className="mr-2 h-5 w-5" />
                      Your Progress
                    </span>
                    <Badge variant="outline">Level {userProfile.level}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Level Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Level Progress</span>
                      <span className="text-sm text-gray-500">
                        {GamificationUtils.formatXP(userProfile.currentXP)} / {GamificationUtils.formatXP(userProfile.xpToNextLevel)}
                      </span>
                    </div>
                    <Progress value={(userProfile.currentXP / userProfile.xpToNextLevel) * 100} className="h-3" />
                    <div className="text-xs text-gray-500 mt-1">
                      {GamificationUtils.formatXP(userProfile.xpToNextLevel - userProfile.currentXP)} XP to Level {userProfile.level + 1}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{GamificationUtils.formatXP(userProfile.totalXP)}</div>
                      <div className="text-sm text-gray-500">Total XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{userProfile.badges.length}</div>
                      <div className="text-sm text-gray-500">Badges</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{userProfile.achievements.length}</div>
                      <div className="text-sm text-gray-500">Achievements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {userProfile.leaderboardRankings.find(r => r.leaderboardId === 'overall')?.rank || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">Rank</div>
                    </div>
                  </div>

                  {/* Active Streaks */}
                  <div>
                    <h4 className="font-medium mb-3">Active Streaks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {userProfile.streaks.filter(s => s.isActive).map((streak) => (
                        <div key={streak.id} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <Flame className="h-6 w-6 text-orange-500" />
                          <div className="flex-1">
                            <div className="font-medium text-orange-800">{streak.name}</div>
                            <div className="text-sm text-orange-600">
                              {GamificationUtils.formatStreakCount(streak.currentCount)} streak
                            </div>
                          </div>
                          <div className="text-lg font-bold text-orange-600">{streak.currentCount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => setActiveTab('challenges')}>
                    <Target className="mr-2 h-4 w-4" />
                    Browse Challenges
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('community')}>
                    <Users className="mr-2 h-4 w-4" />
                    Join Communities
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('mentorship')}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Find Mentor
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('leaderboards')}>
                    <Crown className="mr-2 h-4 w-4" />
                    View Rankings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userProfile.badges.slice(0, 3).map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${GamificationUtils.getBadgeRarityColor(badge.rarity)} bg-current bg-opacity-10`}>
                        <Medal className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-sm text-gray-600">{badge.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Earned {badge.earnedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Active Challenges</h2>
              <Button onClick={createChallenge} disabled={isCreatingChallenge}>
                {isCreatingChallenge ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Challenge
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {challenges.map((challenge) => {
                const isJoined = joinedChallenges.includes(challenge.id)
                const daysLeft = Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                
                return (
                  <Card key={challenge.id} className={`cursor-pointer transition-shadow ${selectedChallenge?.id === challenge.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                          {challenge.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-gray-500" />
                          {GamificationUtils.formatDuration(challenge.duration)}
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 text-gray-500" />
                          {challenge.community.activeMembers} active
                        </div>
                      </div>

                      {challenge.status === 'active' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Time remaining</span>
                            <span className="font-medium">{daysLeft} days</span>
                          </div>
                          <Progress value={(1 - daysLeft / challenge.duration) * 100} className="h-2" />
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {challenge.sponsors.map((sponsor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {sponsor}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        {isJoined ? (
                          <>
                            <Button size="sm" className="flex-1">
                              <Play className="mr-2 h-4 w-4" />
                              Continue
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => leaveChallenge(challenge.id)}
                            >
                              Leave
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => joinChallenge(challenge.id)}
                            disabled={challenge.status !== 'active'}
                          >
                            <Target className="mr-2 h-4 w-4" />
                            Join Challenge
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Achievement Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Achievement Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{userProfile.badges.length}</div>
                    <div className="text-sm text-gray-500">Total Badges</div>
                  </div>

                  <div className="space-y-2">
                    {['common', 'uncommon', 'rare', 'epic', 'legendary'].map((rarity) => {
                      const count = userProfile.badges.filter(b => b.rarity === rarity).length
                      return (
                        <div key={rarity} className="flex justify-between items-center">
                          <span className={`text-sm capitalize ${GamificationUtils.getBadgeRarityColor(rarity)}`}>
                            {rarity}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600">Next milestone:</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Complete 3 more challenges for "Challenge Master" badge
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badge Collection */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Medal className="mr-2 h-5 w-5" />
                    Badge Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userProfile.badges.map((badge) => (
                      <div key={badge.id} className="p-4 border rounded-lg text-center">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${GamificationUtils.getBadgeRarityColor(badge.rarity)} bg-current bg-opacity-10`}>
                          <Medal className="h-8 w-8" />
                        </div>
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-xs text-gray-600 mb-2">{badge.description}</div>
                        <Badge variant="outline" className={`text-xs ${GamificationUtils.getBadgeRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-2">
                          {badge.earnedAt.toLocaleDateString()}
                        </div>
                      </div>
                    ))}

                    {/* Locked badges */}
                    {Array.from({ length: 6 }, (_, i) => (
                      <div key={`locked_${i}`} className="p-4 border rounded-lg text-center opacity-50">
                        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 bg-gray-100">
                          <Medal className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="font-medium text-sm text-gray-400">Locked</div>
                        <div className="text-xs text-gray-400">Complete challenges to unlock</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Community */}
          <TabsContent value="community" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Communities</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {communities.map((community) => {
                const isJoined = joinedCommunities.includes(community.id)
                
                return (
                  <Card key={community.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="capitalize">
                          {community.category}
                        </Badge>
                        <Badge variant={community.type === 'public' ? 'default' : 'secondary'}>
                          {community.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{community.name}</CardTitle>
                      <CardDescription>{community.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{community.memberCount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Members</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{community.activeMembers}</div>
                          <div className="text-xs text-gray-500">Active</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{community.stats.averageEngagement}%</div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {community.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {community.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{community.tags.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <MessageCircle className="mr-2 h-4 w-4 text-gray-500" />
                          {community.stats.postsCount} posts
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                          {community.stats.eventsCount} events
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {isJoined ? (
                          <>
                            <Button size="sm" className="flex-1">
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Visit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => leaveCommunity(community.id)}
                            >
                              Leave
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => joinCommunity(community.id)}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Join Community
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Mentorship */}
          <TabsContent value="mentorship" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mentorship Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="mr-2 h-5 w-5" />
                    Your Mentorship
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userProfile.socialStats.mentorsCount}</div>
                    <div className="text-sm text-gray-500">Active Mentors</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userProfile.socialStats.menteesCount}</div>
                    <div className="text-sm text-gray-500">Mentees</div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" variant={isMentee ? "default" : "outline"}>
                      <Search className="mr-2 h-4 w-4" />
                      Find Mentor
                    </Button>
                    <Button className="w-full" variant={isMentor ? "default" : "outline"}>
                      <Heart className="mr-2 h-4 w-4" />
                      Become Mentor
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Next Session</div>
                    <div className="text-xs text-blue-700 mt-1">
                      Tomorrow, 2:00 PM with Sarah Chen
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mentorship Programs */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Available Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Career Acceleration Program',
                        description: 'Fast-track your career with expert guidance',
                        duration: '12 weeks',
                        mentors: 45,
                        category: 'Career Development'
                      },
                      {
                        title: 'Technical Leadership Track',
                        description: 'Develop leadership skills in technology',
                        duration: '16 weeks',
                        mentors: 32,
                        category: 'Leadership'
                      },
                      {
                        title: 'AI/ML Mentorship Circle',
                        description: 'Learn from industry experts in AI/ML',
                        duration: '8 weeks',
                        mentors: 28,
                        category: 'Technical Skills'
                      }
                    ].map((program, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{program.title}</h4>
                          <Badge variant="outline">{program.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span>{program.duration}</span>
                            <span>{program.mentors} mentors</span>
                          </div>
                          <Button size="sm">
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboards */}
          <TabsContent value="leaderboards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Leaderboards</h2>
              <select 
                value={selectedLeaderboard}
                onChange={(e) => setSelectedLeaderboard(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="overall">Overall XP</option>
                <option value="monthly">Monthly XP</option>
                <option value="challenges">Challenges</option>
                <option value="community">Community</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top 3 */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="mr-2 h-5 w-5" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboards.slice(0, 10).map((entry, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center space-x-4 p-3 rounded-lg ${entry.username === 'You' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex-shrink-0">
                          {entry.rank <= 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              entry.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                              entry.rank === 2 ? 'bg-gray-100 text-gray-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              <Crown className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                              {entry.rank}
                            </div>
                          )}
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{entry.username}</span>
                            {entry.username === 'You' && (
                              <Badge variant="default" className="text-xs">You</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {GamificationUtils.formatXP(entry.score)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {entry.badges?.slice(0, 2).map((badge, badgeIndex) => (
                              <div key={badgeIndex} className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                <Medal className="h-3 w-3 text-purple-600" />
                              </div>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entry.change === '+1' && <ArrowUp className="h-4 w-4 text-green-500" />}
                            {entry.change === '-1' && <ArrowUp className="h-4 w-4 text-red-500 transform rotate-180" />}
                            {entry.change === '→' && <div className="w-4 h-4"></div>}
                            {entry.change.startsWith('+') && entry.change !== '+1' && (
                              <span className="text-green-500 text-xs">{entry.change}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Your Ranking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Your Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">#{userProfile.leaderboardRankings[0]?.rank}</div>
                    <div className="text-sm text-gray-500">Overall Rank</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Top {Math.round((userProfile.leaderboardRankings[0]?.rank || 100) / 1000 * 100)}%
                    </div>
                  </div>

                  <div className="space-y-3">
                    {userProfile.leaderboardRankings.map((ranking) => (
                      <div key={ranking.leaderboardId} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{ranking.category}</span>
                        <div className="text-right">
                          <div className="font-medium">#{ranking.rank}</div>
                          <div className="text-xs text-gray-500">{GamificationUtils.formatXP(ranking.score)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-800">This Week</div>
                    <div className="text-xs text-green-700 mt-1">
                      +890 XP • Rank improved by 5 positions
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}