'use client'

import { useState, useEffect } from 'react'
import { Button } from '@job-board/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Badge } from '@job-board/ui'
import { Progress } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { 
  Brain, 
  Heart, 
  Users, 
  Target,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Lightbulb,
  Compass,
  Network,
  MessageCircle,
  Award,
  BookOpen,
  PieChart,
  BarChart3,
  Activity,
  Eye,
  Settings,
  Shuffle,
  Layers,
  Globe,
  Puzzle
} from 'lucide-react'
import {
  CulturalMatchingProfile,
  CulturalMatchAnalysis,
  PersonalityProfile,
  culturalMatchingEngine,
  CulturalMatchingUtils
} from '@job-board/ai/cultural-matching'

export default function CulturalMatchingPage() {
  // Main state
  const [activeTab, setActiveTab] = useState<'assessment' | 'profile' | 'matching' | 'analytics'>('assessment')
  const [userProfile, setUserProfile] = useState<CulturalMatchingProfile | null>(null)
  const [matchAnalyses, setMatchAnalyses] = useState<CulturalMatchAnalysis[]>([])
  const [selectedMatch, setSelectedMatch] = useState<CulturalMatchAnalysis | null>(null)
  
  // Assessment state
  const [currentAssessment, setCurrentAssessment] = useState<'personality' | 'culture' | 'workstyle' | 'values'>('personality')
  const [assessmentProgress, setAssessmentProgress] = useState(0)
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false)
  
  // Personality assessment responses
  const [personalityResponses, setPersonalityResponses] = useState<{[key: string]: any}>({})
  const [cultureResponses, setCultureResponses] = useState<{[key: string]: any}>({})
  const [workStyleResponses, setWorkStyleResponses] = useState<{[key: string]: any}>({})
  const [valuesResponses, setValuesResponses] = useState<{[key: string]: any}>({})

  // Matching state
  const [jobMatches, setJobMatches] = useState<any[]>([])
  const [teamMatches, setTeamMatches] = useState<any[]>([])
  const [isAnalyzingMatches, setIsAnalyzingMatches] = useState(false)

  // Sample personality questions
  const personalityQuestions = [
    {
      id: 'extraversion_1',
      text: 'I enjoy being the center of attention at social gatherings',
      category: 'extraversion',
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'openness_1', 
      text: 'I am always curious about learning new things',
      category: 'openness',
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'conscientiousness_1',
      text: 'I like to keep my workspace organized and tidy',
      category: 'conscientiousness', 
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'agreeableness_1',
      text: 'I go out of my way to help others',
      category: 'agreeableness',
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'neuroticism_1',
      text: 'I often worry about things that might go wrong',
      category: 'neuroticism',
      scale: 'strongly_disagree_to_strongly_agree'
    }
  ]

  // Sample culture questions
  const cultureQuestions = [
    {
      id: 'hierarchy_1',
      text: 'I am comfortable challenging authority when I disagree',
      category: 'power_distance',
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'individualism_1',
      text: 'I prefer to work independently rather than in groups',
      category: 'individualism',
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'uncertainty_1',
      text: 'I feel comfortable in ambiguous situations',
      category: 'uncertainty_avoidance',
      scale: 'strongly_disagree_to_strongly_agree'
    }
  ]

  // Sample work style questions
  const workStyleQuestions = [
    {
      id: 'pace_1',
      text: 'I prefer to work at a fast pace with tight deadlines',
      category: 'pace',
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'autonomy_1',
      text: 'I work best with minimal supervision',
      category: 'autonomy',
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'collaboration_1',
      text: 'I enjoy frequent collaboration and teamwork',
      category: 'collaboration',
      scale: 'strongly_disagree_to_strongly_agree'
    }
  ]

  // Sample values questions
  const valuesQuestions = [
    {
      id: 'achievement_1',
      text: 'Professional achievement is one of my top priorities',
      category: 'achievement',
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'meaning_1',
      text: 'It\'s important that my work has a positive impact on society',
      category: 'meaning',
      scale: 'strongly_disagree_to_strongly_agree'
    },
    {
      id: 'stability_1',
      text: 'Job security is more important to me than high salary',
      category: 'stability',
      scale: 'strongly_disagree_to_strongly_agree'
    }
  ]

  // Handle assessment response
  const handleAssessmentResponse = (questionId: string, value: number, category: string) => {
    const assessmentType = currentAssessment
    
    switch (assessmentType) {
      case 'personality':
        setPersonalityResponses(prev => ({
          ...prev,
          [questionId]: { value, category }
        }))
        break
      case 'culture':
        setCultureResponses(prev => ({
          ...prev,
          [questionId]: { value, category }
        }))
        break
      case 'workstyle':
        setWorkStyleResponses(prev => ({
          ...prev,
          [questionId]: { value, category }
        }))
        break
      case 'values':
        setValuesResponses(prev => ({
          ...prev,
          [questionId]: { value, category }
        }))
        break
    }
    
    // Update progress
    updateAssessmentProgress()
  }

  // Update assessment progress
  const updateAssessmentProgress = () => {
    const totalQuestions = personalityQuestions.length + cultureQuestions.length + workStyleQuestions.length + valuesQuestions.length
    const answeredQuestions = Object.keys(personalityResponses).length + 
                             Object.keys(cultureResponses).length + 
                             Object.keys(workStyleResponses).length + 
                             Object.keys(valuesResponses).length
    
    setAssessmentProgress(Math.round((answeredQuestions / totalQuestions) * 100))
  }

  // Generate cultural profile
  const generateProfile = async () => {
    setIsGeneratingProfile(true)
    try {
      // Create mock assessment data
      const assessmentData = {
        assessments: [
          {
            id: 'personality_assessment',
            type: 'big_five',
            name: 'Big Five Personality Assessment',
            version: '2.0',
            completedAt: new Date(),
            duration: 900,
            results: personalityResponses,
            reliability: 85,
            validity: 90
          }
        ],
        behavioralObservations: [],
        feedbackData: [],
        performanceData: [],
        validationMetrics: [],
        dataQuality: {
          completeness: 90,
          accuracy: 85,
          consistency: 88,
          timeliness: 95,
          relevance: 92,
          objectivity: 85
        }
      }

      // Generate personality profile
      const personalityProfile = await culturalMatchingEngine.generatePersonalityProfile(assessmentData)
      
      // Generate cultural profile
      const culturalProfile = await culturalMatchingEngine.assessCulturalProfile({
        background: cultureResponses,
        experience: {},
        values: valuesResponses,
        communication: {},
        workPreferences: workStyleResponses
      })

      // Create complete profile
      const profile: CulturalMatchingProfile = {
        id: `profile_${Date.now()}`,
        userId: 'current-user',
        userType: 'candidate',
        profileType: 'individual',
        personalityProfile,
        culturalProfile,
        workStyleProfile: {
          workPreferences: {
            pace: 'moderate',
            depth: 'mixed',
            variety: 'mixed',
            challenge: 'moderate-challenge',
            innovation: 'incremental',
            workload: 'moderate'
          },
          environmentPreferences: {
            physicalSpace: 'hybrid',
            noise: 'moderate',
            formality: 'business-casual',
            mobility: 'moderate-movement',
            lighting: 'natural',
            temperature: 'moderate'
          },
          schedulePreferences: {
            workingHours: 'standard',
            breakPatterns: 'frequent-short',
            meeting: 'distributed',
            deadlines: 'on-time',
            vacation: 'annual-long'
          },
          collaborationStyle: {
            teamSize: 'medium',
            interaction: 'regular',
            decisionMaking: 'consultative',
            meetingStyle: 'structured',
            conflictApproach: 'diplomatic',
            shareInformation: 'open'
          },
          feedbackStyle: {
            frequency: 'regular',
            format: 'mixed',
            direction: 'peer',
            delivery: 'constructive',
            receiving: 'open'
          },
          autonomyNeeds: {
            taskAutonomy: 70,
            methodAutonomy: 75,
            timeAutonomy: 60,
            teamAutonomy: 65,
            goalAutonomy: 55,
            supervisionStyle: 'collaborative'
          },
          structurePreferences: {
            processStructure: 65,
            goalClarity: 85,
            roleDefinition: 75,
            standardization: 60,
            flexibility: 80,
            improvisation: 70
          },
          technologyComfort: {
            adoptionSpeed: 'early-majority',
            complexity: 'moderate',
            integration: 'moderate-integration',
            learning: 'guided'
          }
        },
        valuesProfile: {
          coreValues: [
            {
              value: 'Growth',
              importance: 90,
              alignment: 85,
              behaviors: ['Continuous learning', 'Seeking challenges'],
              conflicts: ['Micromanagement', 'Routine work']
            }
          ],
          workValues: [],
          ethicalFramework: {
            primaryFramework: 'virtue-ethics',
            moralFoundations: [],
            ethicalDilemmaApproach: 'Consider multiple perspectives and long-term impact',
            integrityLevel: 90
          },
          purposeDriven: {
            purposeClarity: 80,
            meaningAtWork: 85,
            impactOrientation: 75,
            legacyFocus: 70,
            socialContribution: 80,
            causes: []
          },
          achievementOrientation: {
            competitiveness: 70,
            goalOrientation: 85,
            excellenceStandards: 80,
            recognitionNeeds: 60,
            growthMindset: 90,
            resilience: 75
          },
          relationshipValues: [],
          growthValues: [],
          stabilityValues: []
        },
        communicationProfile: {
          communicationStyle: {
            directness: 70,
            expressiveness: 75,
            formality: 50,
            detail: 65,
            emotion: 60,
            assertiveness: 65,
            adaptability: 80
          },
          languagePreferences: {
            primaryLanguage: 'English',
            additionalLanguages: [],
            technicalVocabulary: 75,
            metaphorUsage: 60,
            storytelling: 70,
            humor: 65
          },
          nonverbalCommunication: {
            bodyLanguageAwareness: 70,
            facialExpressiveness: 75,
            gestureUsage: 65,
            eyeContact: 80,
            personalSpace: 70,
            touchComfort: 40
          },
          listeningStyle: {
            activeListening: 85,
            empathicListening: 80,
            criticalListening: 75,
            appreciativeListening: 70,
            comprehensiveListening: 80,
            barriers: []
          },
          conflictCommunication: {
            approach: 'collaborative',
            escalationTendency: 30,
            deescalationSkills: 75,
            emotionManagement: 70,
            perspectiveTaking: 85
          },
          digitalCommunication: {
            platformComfort: [],
            responseExpectations: [],
            digitalEtiquette: 85,
            multimediaUsage: 70,
            privacyAwareness: 80
          },
          persuasionStyle: {
            approach: 'logical',
            influenceTactics: [],
            adaptability: 75,
            persistence: 70,
            ethicalBoundaries: ['No manipulation', 'Respect autonomy']
          },
          presentationStyle: {
            format: 'conversational',
            structure: 'linear',
            visualAids: 75,
            audienceEngagement: 80,
            nervousManagement: 65
          }
        },
        teamDynamicsProfile: {
          preferredTeamRoles: [],
          teamSize: { optimal: 5, minimum: 3, maximum: 8, scalingComfort: 70 },
          diversityComfort: {
            cognitiveStyle: 85,
            background: 90,
            experience: 80,
            perspective: 85,
            workingStyle: 75
          },
          leadershipStyle: {
            naturalStyle: 'democratic',
            situationalAdaptability: 75,
            influencePreference: 'expertise',
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
            activities: ['workshops', 'social events'],
            frequency: 'monthly',
            format: 'mixed',
            investment: 70
          }
        },
        adaptabilityProfile: {
          changeAdaptation: {
            changeReadiness: 80,
            changeSpeed: 75,
            changeAnxiety: 30,
            changeExcitement: 75,
            changePlanning: 70,
            changeSupport: 80
          },
          learningAgility: {
            mentalAgility: 85,
            peopleAgility: 80,
            changeAgility: 75,
            resultsAgility: 80,
            selfAwareness: 75,
            learningVelocity: 85
          },
          resilience: {
            stressManagement: 70,
            recoverySpeed: 75,
            optimismLevel: 80,
            problemSolving: 85,
            socialSupport: 75,
            meaningMaking: 80
          },
          flexibility: {
            cognitiveFlexibility: 85,
            behavioralFlexibility: 75,
            emotionalFlexibility: 70,
            roleFlexibility: 80,
            scheduleFlexibility: 75
          },
          ambiguityTolerance: {
            comfortLevel: 75,
            clarificationSeeking: 70,
            assumptionMaking: 40,
            decisionMaking: 75,
            stressResponse: 35
          },
          innovationAdoption: {
            adoptionSpeed: 'early-majority',
            riskTolerance: 70,
            experimentationWillingness: 75,
            resourceInvestment: 65
          }
        },
        motivationProfile: {
          intrinsicMotivators: [],
          extrinsicMotivators: [],
          motivationalNeeds: [],
          goalOrientation: {
            learningGoals: 85,
            performanceGoals: 70,
            masteryOrientation: 80,
            competitiveOrientation: 60,
            timeHorizon: 'mixed'
          },
          engagementDrivers: [],
          disengagementTriggers: [],
          energySources: [],
          energyDrains: []
        },
        leadershipProfile: {
          leadershipPotential: {
            overallPotential: 75,
            readiness: 70,
            aspirations: 80,
            competencies: [],
            developmentAreas: [],
            timeframe: '2-3 years'
          },
          leadershipExperience: [],
          leadershipStyle: {
            dominantStyle: 'democratic',
            adaptiveStyles: ['coaching', 'affiliative'],
            situationalEffectiveness: [],
            developmentNeeds: []
          },
          influenceStyle: {
            primaryStyle: 'collaborative',
            tactics: [],
            relationships: 80,
            credibility: 75,
            inspiration: 70
          },
          decisionMaking: {
            style: 'consultative',
            quality: 80,
            speed: 70,
            stakeholderInvolvement: 85,
            riskConsideration: 75
          },
          visionaryCapacity: {
            visionCreation: 70,
            visionCommunication: 75,
            visionAlignment: 80,
            futureFocus: 75,
            inspiration: 70
          },
          peopleLeadership: {
            empathy: 85,
            coaching: 75,
            teamBuilding: 80,
            conflictResolution: 75,
            talentDevelopment: 80,
            inclusiveLeadership: 85
          },
          operationalLeadership: {
            executionExcellence: 75,
            processImprovement: 70,
            resourceManagement: 70,
            performanceManagement: 75,
            problemSolving: 85
          },
          strategicLeadership: {
            strategicThinking: 75,
            systemsThinking: 80,
            innovationLeadership: 70,
            changeLeadership: 75,
            stakeholderManagement: 75
          },
          transformationalCapacity: {
            changeAgency: 75,
            inspirationalMotivation: 70,
            intellectualStimulation: 80,
            individualizedConsideration: 85,
            idealiizedInfluence: 70
          }
        },
        conflictResolutionProfile: {
          conflictStyle: {
            dominantStyle: 'collaborating',
            situationalFlexibility: 75,
            effectiveness: 80,
            triggers: [],
            development: []
          },
          resolutionSkills: [],
          mediationCapacity: {
            neutrality: 75,
            facilitation: 80,
            empathy: 85,
            communication: 80,
            creativeSolutions: 75
          },
          negotiationStyle: {
            approach: 'principled',
            preparation: 80,
            flexibility: 75,
            persuasion: 70,
            relationshipFocus: 85
          },
          emotionalRegulation: {
            selfRegulation: 75,
            stressManagement: 70,
            impulseControl: 80,
            emotionalAwareness: 85,
            calming: 75
          },
          perspectiveTaking: {
            empathy: 85,
            cognitiveFlexibility: 80,
            culturalSensitivity: 85,
            biasAwareness: 75,
            activeListening: 85
          },
          creativeProblemSolving: {
            divergentThinking: 80,
            convergentThinking: 75,
            reframing: 85,
            resourcefulness: 80,
            implementation: 75
          }
        },
        assessmentData,
        confidenceScore: 85,
        lastUpdated: new Date()
      }

      setUserProfile(profile)
      setActiveTab('profile')
      
    } catch (error) {
      console.error('Error generating profile:', error)
    } finally {
      setIsGeneratingProfile(false)
    }
  }

  // Analyze cultural matches
  const analyzeMatches = async () => {
    if (!userProfile) return
    
    setIsAnalyzingMatches(true)
    try {
      // Mock company profiles for matching
      const companies = [
        { id: '1', name: 'TechInnovate', culture: 'innovative', values: ['growth', 'innovation'] },
        { id: '2', name: 'StableCorpBank', culture: 'traditional', values: ['stability', 'reliability'] },
        { id: '3', name: 'CreativeStudio', culture: 'creative', values: ['creativity', 'flexibility'] }
      ]

      const matches = []
      
      for (const company of companies) {
        const matchAnalysis = await culturalMatchingEngine.performCulturalMatch({
          candidateProfile: userProfile,
          organizationProfile: company,
          roleContext: { type: 'software_engineer', level: 'senior' },
          teamContext: { size: 5, diversity: 'high' }
        })
        
        matches.push(matchAnalysis)
      }
      
      setMatchAnalyses(matches)
      setActiveTab('matching')
      
    } catch (error) {
      console.error('Error analyzing matches:', error)
    } finally {
      setIsAnalyzingMatches(false)
    }
  }

  // Get current questions based on assessment type
  const getCurrentQuestions = () => {
    switch (currentAssessment) {
      case 'personality': return personalityQuestions
      case 'culture': return cultureQuestions
      case 'workstyle': return workStyleQuestions
      case 'values': return valuesQuestions
      default: return []
    }
  }

  // Get current responses based on assessment type
  const getCurrentResponses = () => {
    switch (currentAssessment) {
      case 'personality': return personalityResponses
      case 'culture': return cultureResponses
      case 'workstyle': return workStyleResponses
      case 'values': return valuesResponses
      default: return {}
    }
  }

  // Check if assessment is complete
  const isAssessmentComplete = () => {
    return assessmentProgress >= 80 // Allow completion at 80% for demo
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deep Cultural + Personality Matching
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Go beyond skills - find perfect cultural and personality alignment with AI-powered matching
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid w-full grid-cols-4 gap-2">
            <Button 
              variant={activeTab === 'assessment' ? 'default' : 'outline'}
              onClick={() => setActiveTab('assessment')}
              className="flex items-center"
            >
              <Brain className="mr-2 h-4 w-4" />
              Assessment
            </Button>
            <Button 
              variant={activeTab === 'profile' ? 'default' : 'outline'}
              onClick={() => setActiveTab('profile')}
              className="flex items-center"
            >
              <Users className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button 
              variant={activeTab === 'matching' ? 'default' : 'outline'}
              onClick={() => setActiveTab('matching')}
              className="flex items-center"
            >
              <Target className="mr-2 h-4 w-4" />
              Matching
            </Button>
            <Button 
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analytics')}
              className="flex items-center"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Assessment Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Assessment Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{assessmentProgress}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                  
                  <Progress value={assessmentProgress} className="h-3" />
                  
                  <div className="space-y-2">
                    {[
                      { type: 'personality', label: 'Personality', completed: Object.keys(personalityResponses).length },
                      { type: 'culture', label: 'Cultural Values', completed: Object.keys(cultureResponses).length },
                      { type: 'workstyle', label: 'Work Style', completed: Object.keys(workStyleResponses).length },
                      { type: 'values', label: 'Core Values', completed: Object.keys(valuesResponses).length }
                    ].map((section) => (
                      <div 
                        key={section.type}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          currentAssessment === section.type ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setCurrentAssessment(section.type as any)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{section.label}</span>
                          <Badge variant={section.completed > 0 ? 'default' : 'secondary'}>
                            {section.completed}/{section.type === 'personality' ? 5 : 3}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isAssessmentComplete() && (
                    <Button
                      onClick={generateProfile}
                      disabled={isGeneratingProfile}
                      className="w-full py-3"
                      size="lg"
                    >
                      {isGeneratingProfile ? (
                        <>
                          <Brain className="mr-2 h-5 w-5 animate-pulse" />
                          Generating Profile...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Generate Cultural Profile
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Current Assessment */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {currentAssessment.charAt(0).toUpperCase() + currentAssessment.slice(1)} Assessment
                  </CardTitle>
                  <CardDescription>
                    Answer honestly for the most accurate cultural matching results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {getCurrentQuestions().map((question, index) => {
                    const responses = getCurrentResponses()
                    const hasResponse = responses[question.id]
                    
                    return (
                      <div key={question.id} className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-blue-600 font-medium">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-medium mb-4">{question.text}</p>
                            
                            <div className="grid grid-cols-5 gap-2">
                              {[
                                { value: 1, label: 'Strongly Disagree' },
                                { value: 2, label: 'Disagree' },
                                { value: 3, label: 'Neutral' },
                                { value: 4, label: 'Agree' },
                                { value: 5, label: 'Strongly Agree' }
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => handleAssessmentResponse(question.id, option.value, question.category)}
                                  className={`p-3 text-center border rounded-lg transition-colors ${
                                    hasResponse && responses[question.id].value === option.value
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'hover:bg-blue-50 border-gray-300'
                                  }`}
                                >
                                  <div className="font-medium">{option.value}</div>
                                  <div className="text-xs mt-1">{option.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {index < getCurrentQuestions().length - 1 && (
                          <div className="border-b border-gray-200 pb-6"></div>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
            {userProfile ? (
              <>
                {/* Profile Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        Cultural Profile Overview
                      </span>
                      <Badge variant="outline" className="text-sm">
                        Confidence: {userProfile.confidenceScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {userProfile.personalityProfile.mbtiType.type}
                        </div>
                        <div className="text-sm text-gray-500">MBTI Type</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {userProfile.personalityProfile.mbtiType.communicationStyle}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {userProfile.personalityProfile.discProfile.primaryStyle}
                        </div>
                        <div className="text-sm text-gray-500">DISC Style</div>
                        <div className="text-xs text-gray-400 mt-1">Primary behavioral style</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {userProfile.personalityProfile.emotionalIntelligence.overallEQ}
                        </div>
                        <div className="text-sm text-gray-500">EQ Score</div>
                        <div className="text-xs text-gray-400 mt-1">Emotional Intelligence</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {userProfile.culturalProfile.culturalIntelligence.overallCQ}
                        </div>
                        <div className="text-sm text-gray-500">CQ Score</div>
                        <div className="text-xs text-gray-400 mt-1">Cultural Intelligence</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personality Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="mr-2 h-5 w-5" />
                        Personality Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          { trait: 'Openness', score: userProfile.personalityProfile.bigFiveTraits.openness },
                          { trait: 'Conscientiousness', score: userProfile.personalityProfile.bigFiveTraits.conscientiousness },
                          { trait: 'Extraversion', score: userProfile.personalityProfile.bigFiveTraits.extraversion },
                          { trait: 'Agreeableness', score: userProfile.personalityProfile.bigFiveTraits.agreeableness },
                          { trait: 'Neuroticism', score: userProfile.personalityProfile.bigFiveTraits.neuroticism }
                        ].map((item) => (
                          <div key={item.trait} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{item.trait}</span>
                              <span className="text-sm font-bold">{item.score}/100</span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg mt-4">
                        <h4 className="font-medium text-blue-800 mb-2">Key Strengths</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {userProfile.personalityProfile.mbtiType.strengths.map((strength, index) => (
                            <li key={index}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cultural Values */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Globe className="mr-2 h-5 w-5" />
                        Cultural Values
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          { dimension: 'Power Distance', score: userProfile.culturalProfile.hofstedeValues.powerDistance },
                          { dimension: 'Individualism', score: userProfile.culturalProfile.hofstedeValues.individualismCollectivism },
                          { dimension: 'Uncertainty Avoidance', score: userProfile.culturalProfile.hofstedeValues.uncertaintyAvoidance },
                          { dimension: 'Long-term Orientation', score: userProfile.culturalProfile.hofstedeValues.longTermOrientation }
                        ].map((item) => (
                          <div key={item.dimension} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{item.dimension}</span>
                              <span className="text-sm font-bold">{item.score}/100</span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {userProfile.culturalProfile.diversityValues.inclusionCommitment}
                          </div>
                          <div className="text-xs text-green-700">Inclusion Score</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {userProfile.adaptabilityProfile.changeAdaptation.changeReadiness}
                          </div>
                          <div className="text-xs text-purple-700">Change Readiness</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Work Style Preferences */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        Work Style Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-700">Preferred Pace</div>
                          <div className="text-lg font-bold capitalize">
                            {userProfile.workStyleProfile.workPreferences.pace}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700">Team Size</div>
                          <div className="text-lg font-bold">
                            {userProfile.teamDynamicsProfile.teamSize.optimal} people
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700">Autonomy Need</div>
                          <div className="text-lg font-bold">
                            {userProfile.workStyleProfile.autonomyNeeds.taskAutonomy}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700">Feedback Style</div>
                          <div className="text-lg font-bold capitalize">
                            {userProfile.workStyleProfile.feedbackStyle.frequency}
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">Optimal Environment</h4>
                        <div className="text-sm text-yellow-700">
                          {userProfile.workStyleProfile.environmentPreferences.physicalSpace.replace('_', ' ')} workspace • {' '}
                          {userProfile.workStyleProfile.environmentPreferences.noise} noise level • {' '}
                          {userProfile.workStyleProfile.environmentPreferences.formality.replace('_', ' ')} dress code
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Dynamics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Network className="mr-2 h-5 w-5" />
                        Team Dynamics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Leadership Style</span>
                          <Badge variant="outline" className="capitalize">
                            {userProfile.teamDynamicsProfile.leadershipStyle.naturalStyle}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Followership Style</span>
                          <Badge variant="outline" className="capitalize">
                            {userProfile.teamDynamicsProfile.followership.style}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Conflict Resolution</span>
                          <Badge variant="outline" className="capitalize">
                            {userProfile.conflictResolutionProfile.conflictStyle.dominantStyle}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Diversity Comfort</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Background: {userProfile.teamDynamicsProfile.diversityComfort.background}%</div>
                          <div>Perspective: {userProfile.teamDynamicsProfile.diversityComfort.perspective}%</div>
                          <div>Cognitive: {userProfile.teamDynamicsProfile.diversityComfort.cognitiveStyle}%</div>
                          <div>Work Style: {userProfile.teamDynamicsProfile.diversityComfort.workingStyle}%</div>
                        </div>
                      </div>

                      <Button
                        onClick={analyzeMatches}
                        disabled={isAnalyzingMatches}
                        className="w-full"
                      >
                        {isAnalyzingMatches ? (
                          <>
                            <Brain className="mr-2 h-4 w-4 animate-pulse" />
                            Analyzing Matches...
                          </>
                        ) : (
                          <>
                            <Target className="mr-2 h-4 w-4" />
                            Find Cultural Matches
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Generated</h3>
                  <p className="text-gray-500 mb-4">
                    Complete the assessment to generate your cultural profile
                  </p>
                  <Button onClick={() => setActiveTab('assessment')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            )}
          )}

          {/* Matching Tab */}
          {activeTab === 'matching' && (
            <div className="space-y-6">
            {matchAnalyses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Match Results */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium">Cultural Match Results</h3>
                  {matchAnalyses.map((match, index) => {
                    const companyNames = ['TechInnovate', 'StableCorpBank', 'CreativeStudio']
                    const companyName = companyNames[index] || 'Unknown Company'
                    
                    return (
                      <Card 
                        key={match.id}
                        className={`cursor-pointer transition-shadow ${
                          selectedMatch?.id === match.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedMatch(match)}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-medium">{companyName}</h4>
                              <p className="text-sm text-gray-600">Software Engineer • Senior Level</p>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${CulturalMatchingUtils.getMatchScoreColor(match.overallMatch.score)}`}>
                                {match.overallMatch.score}%
                              </div>
                              <div className="text-sm text-gray-500">
                                {CulturalMatchingUtils.formatMatchScore(match.overallMatch.score)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <Progress value={match.overallMatch.score} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Cultural Match</span>
                              <span>Percentile: {match.overallMatch.percentile}th</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-green-600">{match.strengths.length}</div>
                              <div className="text-xs text-gray-500">Strengths</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-orange-600">{match.challenges.length}</div>
                              <div className="text-xs text-gray-500">Challenges</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-blue-600">{match.successProbability}%</div>
                              <div className="text-xs text-gray-500">Success Rate</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Match Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="mr-2 h-5 w-5" />
                      Match Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedMatch ? (
                      <div className="space-y-6">
                        {/* Success Probability */}
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {selectedMatch.successProbability}%
                          </div>
                          <div className="text-sm text-gray-500">Success Probability</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {CulturalMatchingUtils.formatSuccessProbability(selectedMatch.successProbability)}
                          </div>
                        </div>

                        {/* Strengths */}
                        {selectedMatch.strengths.length > 0 && (
                          <div>
                            <h4 className="font-medium text-green-600 mb-3">Cultural Strengths</h4>
                            <ul className="space-y-2">
                              {selectedMatch.strengths.slice(0, 3).map((strength, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{strength.area}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Challenges */}
                        {selectedMatch.challenges.length > 0 && (
                          <div>
                            <h4 className="font-medium text-orange-600 mb-3">Potential Challenges</h4>
                            <ul className="space-y-2">
                              {selectedMatch.challenges.slice(0, 3).map((challenge, index) => (
                                <li key={index} className="flex items-start">
                                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{challenge.area}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Recommendations */}
                        {selectedMatch.recommendations.length > 0 && (
                          <div>
                            <h4 className="font-medium text-blue-600 mb-3">Recommendations</h4>
                            <ul className="space-y-2">
                              {selectedMatch.recommendations.slice(0, 2).map((rec, index) => (
                                <li key={index} className="flex items-start">
                                  <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{rec.recommendation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Adaptation Plan */}
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-800 mb-2">Adaptation Timeline</h4>
                          <div className="text-sm text-purple-700">
                            {CulturalMatchingUtils.getAdaptationTimeline(selectedMatch.adaptationPlan)}
                          </div>
                          <div className="text-xs text-purple-600 mt-1">
                            Success indicators and milestones included
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">Select a match to view details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Puzzle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Analyzed</h3>
                  <p className="text-gray-500 mb-4">
                    Generate your cultural profile and analyze matches with companies
                  </p>
                  <Button onClick={() => setActiveTab('profile')}>
                    <Users className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Cultural Fit Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { category: 'Tech Startups', compatibility: 85, trend: 'up' },
                      { category: 'Large Corporations', compatibility: 65, trend: 'stable' },
                      { category: 'Creative Agencies', compatibility: 90, trend: 'up' },
                      { category: 'Financial Services', compatibility: 55, trend: 'down' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                          <span className="text-sm font-medium">{item.category}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">{item.compatibility}%</span>
                          {item.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {item.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Personality Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Personality Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">ENFP</div>
                      <div className="text-sm text-gray-500">Primary Type</div>
                      <div className="text-xs text-gray-400 mt-1">The Campaigner - 3% of population</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Trait Distribution</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>Extraversion</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Intuition</span>
                          <span className="font-medium">80%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Feeling</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Perceiving</span>
                          <span className="font-medium">70%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-800">Career Compatibility</div>
                      <div className="text-xs text-green-700 mt-1">
                        Strong match for creative, people-focused roles in collaborative environments
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Dynamics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Network className="mr-2 h-5 w-5" />
                    Team Compatibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">92%</div>
                        <div className="text-sm text-gray-500">Team Harmony</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">5-7</div>
                        <div className="text-sm text-gray-500">Optimal Team Size</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Role Preferences</div>
                      <div className="flex flex-wrap gap-2">
                        {['Collaborator', 'Innovator', 'Motivator', 'Facilitator'].map((role, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Communication Style</div>
                      <div className="text-xs text-gray-600">
                        Expressive, collaborative, and relationship-focused with high emotional awareness
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cultural Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Cultural Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">85</div>
                        <div className="text-sm text-gray-500">Cultural IQ</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">High</div>
                        <div className="text-sm text-gray-500">Adaptability</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Value Alignment</div>
                      <div className="space-y-1">
                        {[
                          { value: 'Innovation', alignment: 90 },
                          { value: 'Collaboration', alignment: 85 },
                          { value: 'Growth', alignment: 80 }
                        ].map((item, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span>{item.value}</span>
                            <span className="font-medium">{item.alignment}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Best Fit Cultures</div>
                      <div className="text-xs text-blue-700 mt-1">
                        Progressive, inclusive, innovation-driven organizations with strong team collaboration
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}