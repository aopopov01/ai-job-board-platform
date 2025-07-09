'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@job-board/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Badge } from '@job-board/ui'
import { Progress } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@job-board/ui'
import { 
  Video, 
  Camera, 
  Mic, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Download,
  Share2,
  Eye,
  TrendingUp,
  Zap,
  Globe,
  Headphones,
  Monitor,
  Brain,
  Target,
  Award,
  Users,
  Clock,
  BarChart3,
  Lightbulb,
  Sparkles
} from 'lucide-react'
import {
  VideoProfile,
  AIVideoRequest,
  VROfficeExperience,
  AdvancedInterviewAnalysis,
  videoFirstPlatform,
  VideoFirstUtils
} from '@job-board/ai/video-platform'

export default function VideoFirstPlatformPage() {
  // Main state
  const [activeTab, setActiveTab] = useState<'ai-videos' | 'vr-tours' | 'interview-analysis' | 'video-profiles'>('ai-videos')
  const [isRecording, setIsRecording] = useState(false)
  const [videoProfiles, setVideoProfiles] = useState<VideoProfile[]>([])
  
  // AI Video Generation state
  const [videoRequest, setVideoRequest] = useState<Partial<AIVideoRequest>>({
    type: 'candidate_introduction',
    content: {
      keyMessages: [],
      tone: 'professional',
      targetAudience: 'hiring managers'
    },
    duration: 60,
    language: 'en'
  })
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<any>(null)

  // VR Experience state
  const [vrExperiences, setVrExperiences] = useState<VROfficeExperience[]>([])
  const [creatingVR, setCreatingVR] = useState(false)
  const [vrForm, setVrForm] = useState({
    companyName: '',
    industry: 'technology',
    culture: 'innovative and collaborative',
    officeType: 'modern_open_plan',
    targetAudience: 'software_engineers'
  })

  // Interview Analysis state
  const [interviewAnalyses, setInterviewAnalyses] = useState<AdvancedInterviewAnalysis[]>([])
  const [analyzingInterview, setAnalyzingInterview] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState<AdvancedInterviewAnalysis | null>(null)

  // Recording state
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize media for video recording
  const setupRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 },
        audio: true
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })
      
    } catch (error) {
      console.error('Error setting up recording:', error)
    }
  }

  const startRecording = () => {
    if (mediaRecorderRef.current && streamRef.current) {
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Generate AI Video
  const generateAIVideo = async () => {
    setGeneratingVideo(true)
    try {
      const result = await videoFirstPlatform.generateAIVideo(videoRequest as AIVideoRequest)
      setGeneratedVideo(result)
    } catch (error) {
      console.error('Error generating AI video:', error)
    } finally {
      setGeneratingVideo(false)
    }
  }

  // Create VR Experience
  const createVRExperience = async () => {
    setCreatingVR(true)
    try {
      const experience = await videoFirstPlatform.createVROfficeExperience({
        companyId: 'current-company',
        ...vrForm
      })
      setVrExperiences(prev => [...prev, experience])
    } catch (error) {
      console.error('Error creating VR experience:', error)
    } finally {
      setCreatingVR(false)
    }
  }

  // Analyze interview video
  const analyzeInterview = async () => {
    setAnalyzingInterview(true)
    try {
      const analysis = await videoFirstPlatform.analyzeInterviewVideo({
        sessionId: `session_${Date.now()}`,
        participantId: 'current-user',
        videoData: { quality: 'HD', stability: 95 },
        audioData: { clarity: 90, pace: 150 },
        interviewType: 'one_way',
        duration: 300,
        questions: ['Tell me about yourself', 'Why do you want this role?']
      })
      setInterviewAnalyses(prev => [...prev, analysis])
      setSelectedAnalysis(analysis)
    } catch (error) {
      console.error('Error analyzing interview:', error)
    } finally {
      setAnalyzingInterview(false)
    }
  }

  useEffect(() => {
    setupRecording()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Video-First Experience Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Revolutionary video-centric job platform with AI generation, VR tours, and advanced analytics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab as any} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-videos" className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Videos
            </TabsTrigger>
            <TabsTrigger value="vr-tours" className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              VR Tours
            </TabsTrigger>
            <TabsTrigger value="interview-analysis" className="flex items-center">
              <Brain className="mr-2 h-4 w-4" />
              Interview AI
            </TabsTrigger>
            <TabsTrigger value="video-profiles" className="flex items-center">
              <Video className="mr-2 h-4 w-4" />
              Video Profiles
            </TabsTrigger>
          </TabsList>

          {/* AI Video Generation */}
          <TabsContent value="ai-videos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    AI Video Generator
                  </CardTitle>
                  <CardDescription>
                    Create professional videos instantly with AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Type
                    </label>
                    <select
                      value={videoRequest.type}
                      onChange={(e) => setVideoRequest(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="candidate_introduction">Candidate Introduction</option>
                      <option value="company_overview">Company Overview</option>
                      <option value="job_description">Job Description</option>
                      <option value="culture_showcase">Culture Showcase</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Messages
                    </label>
                    <textarea
                      value={videoRequest.content?.keyMessages?.join('\n') || ''}
                      onChange={(e) => setVideoRequest(prev => ({
                        ...prev,
                        content: {
                          ...prev.content!,
                          keyMessages: e.target.value.split('\n').filter(m => m.trim())
                        }
                      }))}
                      rows={4}
                      placeholder="Enter key messages (one per line)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tone
                      </label>
                      <select
                        value={videoRequest.content?.tone}
                        onChange={(e) => setVideoRequest(prev => ({
                          ...prev,
                          content: { ...prev.content!, tone: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="enthusiastic">Enthusiastic</option>
                        <option value="authoritative">Authoritative</option>
                        <option value="friendly">Friendly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (seconds)
                      </label>
                      <Input
                        type="number"
                        value={videoRequest.duration}
                        onChange={(e) => setVideoRequest(prev => ({ ...prev, duration: Number(e.target.value) }))}
                        min={30}
                        max={300}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <Input
                      value={videoRequest.content?.targetAudience}
                      onChange={(e) => setVideoRequest(prev => ({
                        ...prev,
                        content: { ...prev.content!, targetAudience: e.target.value }
                      }))}
                      placeholder="e.g., hiring managers, candidates, executives"
                    />
                  </div>

                  <Button
                    onClick={generateAIVideo}
                    disabled={generatingVideo}
                    className="w-full py-3"
                    size="lg"
                  >
                    {generatingVideo ? (
                      <>
                        <Brain className="mr-2 h-5 w-5 animate-pulse" />
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate AI Video
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Video Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="mr-2 h-5 w-5" />
                    Generated Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedVideo ? (
                    <div className="space-y-4">
                      <div className="bg-gray-900 rounded-lg p-8 text-center">
                        <Play className="mx-auto h-16 w-16 text-white mb-4" />
                        <p className="text-white mb-2">AI Generated Video Ready</p>
                        <p className="text-gray-300 text-sm">{VideoFirstUtils.formatDuration(videoRequest.duration || 60)}</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">${generatedVideo.estimatedCost}</div>
                          <div className="text-sm text-gray-500">Production Cost</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{generatedVideo.timeline}</div>
                          <div className="text-sm text-gray-500">Delivery Time</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">HD</div>
                          <div className="text-sm text-gray-500">Quality</div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Generated Script Preview:</h4>
                        <p className="text-sm text-blue-700">{generatedVideo.script.substring(0, 200)}...</p>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Video className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-500">Generate your first AI video to see preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* VR Office Tours */}
          <TabsContent value="vr-tours" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* VR Experience Creator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    VR Office Experience Creator
                  </CardTitle>
                  <CardDescription>
                    Create immersive virtual office tours for candidates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Input
                      value={vrForm.companyName}
                      onChange={(e) => setVrForm(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <select
                        value={vrForm.industry}
                        onChange={(e) => setVrForm(prev => ({ ...prev, industry: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="technology">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="consulting">Consulting</option>
                        <option value="marketing">Marketing</option>
                        <option value="education">Education</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Office Type
                      </label>
                      <select
                        value={vrForm.officeType}
                        onChange={(e) => setVrForm(prev => ({ ...prev, officeType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="modern_open_plan">Modern Open Plan</option>
                        <option value="traditional_cubicles">Traditional Cubicles</option>
                        <option value="creative_studio">Creative Studio</option>
                        <option value="coworking_space">Coworking Space</option>
                        <option value="remote_first">Remote First</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Culture
                    </label>
                    <textarea
                      value={vrForm.culture}
                      onChange={(e) => setVrForm(prev => ({ ...prev, culture: e.target.value }))}
                      rows={3}
                      placeholder="Describe your company culture..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={vrForm.targetAudience}
                      onChange={(e) => setVrForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="software_engineers">Software Engineers</option>
                      <option value="designers">Designers</option>
                      <option value="sales_professionals">Sales Professionals</option>
                      <option value="executives">Executives</option>
                      <option value="general_candidates">General Candidates</option>
                    </select>
                  </div>

                  <Button
                    onClick={createVRExperience}
                    disabled={creatingVR || !vrForm.companyName}
                    className="w-full py-3"
                    size="lg"
                  >
                    {creatingVR ? (
                      <>
                        <Brain className="mr-2 h-5 w-5 animate-pulse" />
                        Creating VR Experience...
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-5 w-5" />
                        Create VR Experience
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* VR Experiences List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="mr-2 h-5 w-5" />
                    VR Experiences ({vrExperiences.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vrExperiences.length > 0 ? (
                    <div className="space-y-4">
                      {vrExperiences.map((experience) => (
                        <div key={experience.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{experience.title}</h4>
                              <p className="text-sm text-gray-600">{experience.description}</p>
                            </div>
                            <Badge variant="outline">
                              {experience.environments.length} environments
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                            <div>
                              <div className="text-lg font-bold text-blue-600">
                                {experience.analytics.totalVisitors}
                              </div>
                              <div className="text-xs text-gray-500">Visitors</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600">
                                {Math.round(experience.analytics.averageSessionTime)}s
                              </div>
                              <div className="text-xs text-gray-500">Avg. Time</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-purple-600">
                                {Math.round(experience.analytics.completionRate)}%
                              </div>
                              <div className="text-xs text-gray-500">Completion</div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Globe className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-500">Create your first VR experience</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interview Analysis */}
          <TabsContent value="interview-analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video Recording & Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5" />
                    AI Interview Analyzer
                  </CardTitle>
                  <CardDescription>
                    Record and analyze interview performance with advanced AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Video Preview */}
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                    />
                    {isRecording && (
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Recording</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recording Controls */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                    >
                      {isRecording ? (
                        <>
                          <Square className="mr-2 h-5 w-5" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-5 w-5" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Analysis Button */}
                  <Button
                    onClick={analyzeInterview}
                    disabled={analyzingInterview}
                    className="w-full py-3"
                    size="lg"
                  >
                    {analyzingInterview ? (
                      <>
                        <Brain className="mr-2 h-5 w-5 animate-pulse" />
                        Analyzing Interview...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-5 w-5" />
                        Analyze Interview Performance
                      </>
                    )}
                  </Button>

                  {/* Quick Tips */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      <Lightbulb className="inline mr-2 h-4 w-4" />
                      Interview Tips
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Maintain good eye contact with the camera</li>
                      <li>• Speak clearly and at a moderate pace</li>
                      <li>• Use specific examples in your answers</li>
                      <li>• Show enthusiasm and confidence</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAnalysis ? (
                    <div className="space-y-6">
                      {/* Overall Score */}
                      <div className="text-center">
                        <div className="text-6xl font-bold text-blue-600 mb-2">
                          {selectedAnalysis.analysis.overall.totalScore}
                        </div>
                        <div className="text-lg font-medium text-gray-600">Overall Score</div>
                        <div className="text-sm text-gray-500">
                          {selectedAnalysis.analysis.overall.hireProbability}% hire probability
                        </div>
                      </div>

                      {/* Performance Breakdown */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Performance Breakdown</h4>
                        {[
                          { label: 'Communication', score: selectedAnalysis.analysis.soft_skills.communication },
                          { label: 'Technical Skills', score: 85 },
                          { label: 'Body Language', score: selectedAnalysis.analysis.nonVerbal.bodyLanguage.confidence },
                          { label: 'Voice Quality', score: selectedAnalysis.analysis.verbal.speechPattern.pace > 120 ? 80 : 60 }
                        ].map((item) => (
                          <div key={item.label} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{item.label}</span>
                              <span className={`text-sm font-medium ${VideoFirstUtils.getEngagementColor(item.score)}`}>
                                {item.score}/100
                              </span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                          </div>
                        ))}
                      </div>

                      {/* Key Insights */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-green-600">Strengths</h4>
                        <ul className="space-y-1">
                          {selectedAnalysis.analysis.overall.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-orange-600">Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {selectedAnalysis.analysis.overall.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-sm">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Predictive Insights */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-800 mb-2">Predictive Insights</h4>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {selectedAnalysis.predictiveInsights.retentionProbability}%
                            </div>
                            <div className="text-xs text-purple-700">Retention Rate</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {selectedAnalysis.predictiveInsights.growthPotential}%
                            </div>
                            <div className="text-xs text-purple-700">Growth Potential</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-500">Record and analyze an interview to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Video Profiles */}
          <TabsContent value="video-profiles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Profile Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Profile Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">24</div>
                      <div className="text-sm text-gray-500">Total Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">18</div>
                      <div className="text-sm text-gray-500">Unique Viewers</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement Score</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600">Top viewer locations:</div>
                    <div className="text-xs text-gray-500 mt-1">
                      San Francisco, London, Berlin
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Profile Gallery */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Video className="mr-2 h-5 w-5" />
                      Video Profiles
                    </span>
                    <Button size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Create New
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sample Video Profiles */}
                    {[
                      { title: 'Professional Introduction', duration: 60, views: 24, type: 'candidate' },
                      { title: 'Company Culture Video', duration: 120, views: 45, type: 'company' },
                      { title: 'Technical Skills Demo', duration: 180, views: 18, type: 'candidate' },
                      { title: 'Team Overview', duration: 90, views: 32, type: 'company' }
                    ].map((profile, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="relative mb-3">
                          <div className="w-full h-24 bg-gray-900 rounded flex items-center justify-center">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {VideoFirstUtils.formatDuration(profile.duration)}
                          </div>
                        </div>
                        
                        <h4 className="font-medium mb-2">{profile.title}</h4>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">{profile.views} views</span>
                          <Badge variant={profile.type === 'candidate' ? 'default' : 'secondary'}>
                            {profile.type}
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Share2 className="mr-1 h-3 w-3" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
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