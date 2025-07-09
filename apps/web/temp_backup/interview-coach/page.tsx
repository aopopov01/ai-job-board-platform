'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@job-board/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Badge } from '@job-board/ui'
import { Progress } from '@job-board/ui'
import { Mic, MicOff, Video, VideoOff, Play, Pause, RotateCcw, Award, TrendingUp, MessageCircle } from 'lucide-react'
import { 
  InterviewCoachingSession, 
  PersonalizedQuestion, 
  RealTimeCoaching, 
  VoiceMetrics,
  interviewCoach,
  InterviewCoachUtils 
} from '@job-board/ai/interview-coach'

interface InterviewCoachPageProps {
  jobId?: string
}

export default function InterviewCoachPage({ jobId }: InterviewCoachPageProps) {
  // Session state
  const [session, setSession] = useState<Partial<InterviewCoachingSession> | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<PersonalizedQuestion | null>(null)
  const [questions, setQuestions] = useState<PersonalizedQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  
  // Real-time feedback
  const [realTimeCoaching, setRealTimeCoaching] = useState<RealTimeCoaching[]>([])
  const [voiceMetrics, setVoiceMetrics] = useState<VoiceMetrics | null>(null)
  const [confidenceScore, setConfidenceScore] = useState(75)
  
  // Session setup
  const [sessionType, setSessionType] = useState<'practice' | 'mock' | 'real_prep'>('practice')
  const [industry, setIndustry] = useState('technology')
  const [role, setRole] = useState('software-engineer')
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'mid' | 'senior' | 'executive'>('mid')
  
  // Refs for media
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Initialize interview session
  const startInterviewSession = async () => {
    try {
      // Generate personalized questions
      const generatedQuestions = await interviewCoach.generatePersonalizedQuestions({
        industry,
        role,
        experienceLevel,
        companyCulture: 'collaborative and innovative'
      })
      
      setQuestions(generatedQuestions)
      setCurrentQuestion(generatedQuestions[0])
      
      // Create new session
      const newSession: Partial<InterviewCoachingSession> = {
        id: `session_${Date.now()}`,
        userId: 'current-user', // Get from auth
        jobId,
        sessionType,
        industry,
        role,
        experienceLevel,
        duration: 0,
        startedAt: new Date(),
        overallScore: 0,
        feedback: {
          confidenceScore: 0,
          clarityScore: 0,
          technicalAccuracy: 0,
          communicationSkills: 0,
          bodyLanguageScore: 0,
          voiceAnalysis: {
            pace: 0,
            clarity: 0,
            confidence: 0,
            energy: 0,
            fillerWords: 0,
            pauseAnalysis: {
              appropriatePauses: 0,
              awkwardSilences: 0,
              averagePauseLength: 0,
              pauseConfidence: 0
            },
            emotionDetection: {
              nervousness: 0,
              excitement: 0,
              confidence: 0,
              stress: 0,
              engagement: 0
            }
          },
          responseQuality: [],
          strengths: [],
          weaknesses: [],
          recommendations: []
        },
        improvements: [],
        nextSteps: []
      }
      
      setSession(newSession)
      
      // Setup media recording
      await setupMediaRecording()
      
    } catch (error) {
      console.error('Error starting interview session:', error)
    }
  }

  const setupMediaRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      // Setup MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Process audio data for voice analysis
          analyzeVoiceData(event.data)
        }
      }
      
    } catch (error) {
      console.error('Error setting up media recording:', error)
    }
  }

  const analyzeVoiceData = async (audioBlob: Blob) => {
    try {
      // Convert blob to ArrayBuffer for analysis
      const arrayBuffer = await audioBlob.arrayBuffer()
      
      // Analyze voice metrics
      const metrics = interviewCoach.analyzeVoiceMetrics(arrayBuffer)
      setVoiceMetrics(metrics)
      
      // Generate real-time coaching if needed
      if (metrics.pace < 120 || metrics.clarity < 70 || metrics.fillerWords > 3) {
        const coaching = await interviewCoach.generateRealTimeCoaching({
          pace: metrics.pace,
          clarity: metrics.clarity,
          energy: metrics.energy,
          fillerWords: metrics.fillerWords,
          responseTime: 30, // Mock response time
          currentQuestion: currentQuestion?.question
        })
        
        setRealTimeCoaching(prev => [...prev.slice(-4), coaching]) // Keep last 5 coaching messages
      }
      
      // Update confidence score based on voice metrics
      const newConfidenceScore = Math.round(
        (metrics.confidence + metrics.clarity + metrics.energy) / 3
      )
      setConfidenceScore(newConfidenceScore)
      
    } catch (error) {
      console.error('Error analyzing voice data:', error)
    }
  }

  const startRecording = () => {
    if (mediaRecorderRef.current && streamRef.current) {
      mediaRecorderRef.current.start(1000) // Record in 1-second chunks
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1)
      setCurrentQuestion(questions[questionIndex + 1])
    } else {
      // End session and show results
      endSession()
    }
  }

  const endSession = async () => {
    if (session) {
      const completedSession = {
        ...session,
        completedAt: new Date(),
        duration: Math.round((Date.now() - (session.startedAt?.getTime() || Date.now())) / 1000 / 60)
      }
      
      // Generate overall feedback
      const feedback = await interviewCoach.generateOverallFeedback(completedSession)
      
      setSession({
        ...completedSession,
        feedback,
        overallScore: Math.round(
          (feedback.confidenceScore + feedback.clarityScore + feedback.technicalAccuracy + 
           feedback.communicationSkills + feedback.bodyLanguageScore) / 5
        )
      })
    }
    
    // Clean up media
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const resetSession = () => {
    setSession(null)
    setCurrentQuestion(null)
    setQuestions([])
    setQuestionIndex(0)
    setRealTimeCoaching([])
    setVoiceMetrics(null)
    setConfidenceScore(75)
    setIsRecording(false)
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Interview Coach
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get real-time coaching and personalized feedback to ace your next interview
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Setup Your Practice Session</CardTitle>
              <CardDescription>
                Customize your interview practice based on the role you're applying for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type
                </label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="practice">General Practice</option>
                  <option value="mock">Mock Interview</option>
                  <option value="real_prep">Real Interview Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="marketing">Marketing</option>
                  <option value="consulting">Consulting</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-7 years)</option>
                  <option value="senior">Senior Level (8-15 years)</option>
                  <option value="executive">Executive Level (15+ years)</option>
                </select>
              </div>

              <Button
                onClick={startInterviewSession}
                className="w-full py-3 text-lg"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Interview Practice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (session.completedAt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Interview Results
            </h1>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-6xl font-bold text-blue-600">
                {session.overallScore}
              </div>
              <div>
                <div className="text-lg font-medium text-gray-600">Overall Score</div>
                <div className="text-sm text-gray-500">
                  {InterviewCoachUtils.formatFeedbackScore(session.overallScore || 0)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Performance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Confidence', score: session.feedback?.confidenceScore || 0 },
                  { label: 'Clarity', score: session.feedback?.clarityScore || 0 },
                  { label: 'Technical Accuracy', score: session.feedback?.technicalAccuracy || 0 },
                  { label: 'Communication', score: session.feedback?.communicationSkills || 0 },
                  { label: 'Body Language', score: session.feedback?.bodyLanguageScore || 0 }
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className={`text-sm font-medium ${InterviewCoachUtils.getScoreColor(item.score)}`}>
                        {item.score}/100
                      </span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Voice Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="mr-2 h-5 w-5" />
                  Voice Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {voiceMetrics && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {voiceMetrics.pace}
                        </div>
                        <div className="text-sm text-gray-500">Words/min</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {voiceMetrics.clarity}%
                        </div>
                        <div className="text-sm text-gray-500">Clarity</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confidence</span>
                        <span>{voiceMetrics.confidence}%</span>
                      </div>
                      <Progress value={voiceMetrics.confidence} className="h-1" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Energy</span>
                        <span>{voiceMetrics.energy}%</span>
                      </div>
                      <Progress value={voiceMetrics.energy} className="h-1" />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Filler words detected: {voiceMetrics.fillerWords}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feedback Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Award className="mr-2 h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {session.feedback?.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {session.feedback?.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {session.feedback?.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-x-4">
            <Button onClick={resetSession} variant="outline" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Practice Again
            </Button>
            <Button size="lg">
              Save Results
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Practice</h1>
            <p className="text-gray-600">
              Question {questionIndex + 1} of {questions.length} • {sessionType} session
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              Confidence: {confidenceScore}%
            </Badge>
            <Button onClick={endSession} variant="outline">
              End Session
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Interview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Feed */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                  />
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant={isAudioEnabled ? "default" : "outline"}
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    >
                      {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant={isVideoEnabled ? "default" : "outline"}
                      onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    >
                      {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                  </div>
                  {isRecording && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Recording</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Question */}
            {currentQuestion && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Interview Question
                    <Badge variant="outline">
                      {currentQuestion.category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-4">{currentQuestion.question}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant={isRecording ? "destructive" : "default"}
                      >
                        {isRecording ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                      </Button>
                      <Button onClick={nextQuestion} variant="outline">
                        Next Question
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Expected answer: {Math.round(currentQuestion.expectedAnswerLength / 60)} min
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Real-time Coaching */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-time Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {realTimeCoaching.map((coaching, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-sm ${
                        coaching.severity === 'critical' ? 'bg-red-50 border border-red-200' :
                        coaching.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <p className={`font-medium ${InterviewCoachUtils.getCoachingSeverityColor(coaching.severity)}`}>
                        {coaching.message}
                      </p>
                      <p className="text-gray-600 mt-1">{coaching.suggestion}</p>
                    </div>
                  ))}
                  {realTimeCoaching.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Start recording to receive real-time coaching
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Voice Metrics */}
            {voiceMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Voice Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Speaking Pace</span>
                    <span>{voiceMetrics.pace} WPM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Clarity</span>
                    <span>{voiceMetrics.clarity}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Energy</span>
                    <span>{voiceMetrics.energy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Filler Words</span>
                    <span>{voiceMetrics.fillerWords}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Question Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={(questionIndex / questions.length) * 100} className="mb-2" />
                <p className="text-sm text-gray-600">
                  {questionIndex} of {questions.length} questions completed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}