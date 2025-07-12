'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Brain, 
  MessageCircle, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  Send,
  Sparkles,
  Lightbulb,
  Trophy,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  BarChart3,
  FileText,
  User,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Filter,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

// Mock conversation data
const mockConversation = [
  {
    id: 1,
    type: 'user',
    message: 'I want to transition from marketing to product management. How should I approach this?',
    timestamp: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    type: 'ai',
    message: 'Great question! Transitioning from marketing to product management is a natural career progression. Here\'s my personalized roadmap for you:\n\n**1. Leverage Your Marketing Background**\n- Your customer insights experience is invaluable for PM roles\n- Highlight your market research and user behavior analysis skills\n- Emphasize your cross-functional collaboration experience\n\n**2. Build Core PM Skills**\n- Learn product analytics tools (Mixpanel, Amplitude)\n- Study user experience design principles\n- Practice writing product requirements documents (PRDs)\n\n**3. Networking Strategy**\n- Connect with current PMs in your network\n- Attend product management meetups and conferences\n- Join PM communities on Slack and Discord\n\n**4. Portfolio Development**\n- Create case studies of marketing campaigns with product impact\n- Build a product roadmap for a hypothetical product\n- Document user research projects you\'ve led\n\nBased on your profile, I\'ve identified 23 product management roles that would be perfect for your background. Would you like me to show them?',
    timestamp: '2024-01-15T10:31:00Z',
    suggestions: [
      'Show me the PM roles',
      'Help me build a portfolio',
      'Connect me with PM mentors',
      'Create a learning plan'
    ]
  },
  {
    id: 3,
    type: 'user',
    message: 'Yes, please show me the PM roles!',
    timestamp: '2024-01-15T10:32:00Z'
  }
]

const mockInsights = [
  {
    title: 'Career Trajectory Analysis',
    description: 'Your marketing background positions you well for PM roles. 78% of successful PMs have marketing experience.',
    icon: TrendingUp,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Skill Gap Analysis',
    description: 'You\'re missing 3 key skills: SQL, wireframing, and agile methodologies. I can create a learning plan.',
    icon: Target,
    color: 'from-purple-500 to-violet-600'
  },
  {
    title: 'Market Intelligence',
    description: 'PM roles in your area have increased 45% this year. Average salary range: $120K-$180K.',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Network Optimization',
    description: 'I found 12 people in your network who can refer you to PM positions. Want introductions?',
    icon: Users,
    color: 'from-orange-500 to-red-600'
  }
]

const mockRecommendations = [
  {
    id: 1,
    type: 'skill',
    title: 'Learn SQL for Product Analytics',
    description: 'Complete a SQL course focused on product analytics. This skill appears in 87% of PM job descriptions.',
    priority: 'high',
    estimatedTime: '2-3 weeks',
    resources: ['Codecademy SQL', 'Mode Analytics SQL Tutorial', 'SQLBolt']
  },
  {
    id: 2,
    type: 'network',
    title: 'Connect with Sarah Chen at TechCorp',
    description: 'Sarah is a Senior PM who transitioned from marketing. She\'s in your 2nd degree network.',
    priority: 'medium',
    estimatedTime: '1 week',
    resources: ['LinkedIn Introduction', 'Coffee Chat Template']
  },
  {
    id: 3,
    type: 'application',
    title: 'Apply to Associate PM at InnovateTech',
    description: 'This role explicitly welcomes marketing backgrounds. 94% match with your profile.',
    priority: 'high',
    estimatedTime: '2 hours',
    resources: ['Application Template', 'Company Research']
  }
]

export default function AIAdvisorPage() {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')

  const sendMessage = () => {
    if (message.trim()) {
      setIsTyping(true)
      // Simulate AI response
      setTimeout(() => {
        setIsTyping(false)
        setMessage('')
      }, 2000)
    }
  }

  return (
    <NeuronicLayout variant="default">
      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-white/20 backdrop-blur-md bg-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-white" />
                <span className="text-xl font-bold text-white">AI Career Advisor</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'chat' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  AI Chat
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'insights' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Career Insights
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'recommendations' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Action Plan
                </button>
              </nav>

              <div className="flex items-center gap-4">
                <Link href="/jobs" className="text-white/80 hover:text-white">Browse Jobs</Link>
                <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* AI Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Career Guidance
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
                    Your Personal AI Career Advisor
                  </span>
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Get personalized career guidance, skill recommendations, and job matching powered by advanced AI that understands your unique background and goals.
                </p>
              </div>

              {/* Chat Interface */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Chat Messages */}
                <div className="lg:col-span-2">
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-6 border-b border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">AI Career Advisor</h3>
                          <p className="text-sm text-white/70">Always here to help with your career</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-6 h-96 overflow-y-auto space-y-4">
                      {mockConversation.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md ${
                            msg.type === 'user' 
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' 
                              : 'bg-white/20 text-white border border-white/20'
                          } rounded-lg p-4`}>
                            <p className="text-sm whitespace-pre-line">{msg.message}</p>
                            {msg.suggestions && (
                              <div className="mt-4 space-y-2">
                                {msg.suggestions.map((suggestion, index) => (
                                  <button
                                    key={index}
                                    className="block w-full text-left p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
                                    onClick={() => setMessage(suggestion)}
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white/20 text-white border border-white/20 rounded-lg p-4 max-w-xs">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-white/70">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-6 border-t border-white/10">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Ask me about your career goals, skills, or job search..."
                          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={sendMessage}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm">Career Path Analysis</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm">Resume Review</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
                        <Search className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm">Job Recommendations</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left">
                        <Users className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-sm">Network Analysis</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Stats */}
                  <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">AI Insights</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Profile Completeness</span>
                        <span className="text-white font-semibold">87%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Job Match Score</span>
                        <span className="text-white font-semibold">94%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Career Readiness</span>
                        <span className="text-white font-semibold">76%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Career Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
                    AI-Powered Career Insights
                  </span>
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto">
                  Deep analysis of your career trajectory, market trends, and personalized recommendations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockInsights.map((insight, index) => (
                  <div key={index} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center mb-4`}>
                      <insight.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{insight.title}</h3>
                    <p className="text-white/80 leading-relaxed">{insight.description}</p>
                  </div>
                ))}
              </div>

              {/* Market Trends */}
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Market Trends in Your Field</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">45%</div>
                    <div className="text-sm text-white/80">Job Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">$150K</div>
                    <div className="text-sm text-white/80">Avg. Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">2.3x</div>
                    <div className="text-sm text-white/80">Demand Growth</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
                    Your Personalized Action Plan
                  </span>
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto">
                  AI-curated recommendations to accelerate your career growth and achieve your goals.
                </p>
              </div>

              <div className="space-y-6">
                {mockRecommendations.map((rec, index) => (
                  <div key={rec.id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          rec.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                          <p className="text-sm text-white/70">{rec.estimatedTime}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </div>
                    </div>
                    
                    <p className="text-white/80 mb-4">{rec.description}</p>
                    
                    <div className="flex items-center gap-4">
                      <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
                        Start Now
                      </button>
                      <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                        View Resources
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </NeuronicLayout>
  )
}