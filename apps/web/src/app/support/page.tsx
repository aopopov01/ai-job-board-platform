'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  HelpCircle, 
  Search, 
  Book, 
  Video, 
  MessageSquare, 
  Mail,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Building2,
  Users,
  Zap,
  Shield,
  Star,
  ChevronDown,
  ChevronRight,
  FileText,
  Play,
  Download,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Flag,
  ArrowLeft
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

interface SupportArticle {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  helpful: number
  updated: string
  content?: string
}

interface SupportCategory {
  id: string
  name: string
  description: string
  icon: any
  articleCount: number
  color: string
}

const supportCategories: SupportCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of using TalentAIze',
    icon: Zap,
    articleCount: 12,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'job-posting',
    name: 'Job Posting',
    description: 'How to create and manage job listings',
    icon: Building2,
    articleCount: 18,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'candidate-matching',
    name: 'AI Matching',
    description: 'Understanding our AI-powered matching system',
    icon: Users,
    articleCount: 8,
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'billing',
    name: 'Billing & Plans',
    description: 'Manage your subscription and payments',
    icon: Star,
    articleCount: 10,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'Connect with third-party tools and services',
    icon: Shield,
    articleCount: 15,
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'Solve common technical issues',
    icon: HelpCircle,
    articleCount: 22,
    color: 'from-gray-500 to-slate-600'
  }
]

const popularArticles: SupportArticle[] = [
  {
    id: '1',
    title: 'How to post your first job',
    description: 'Step-by-step guide to creating effective job listings that attract top talent.',
    category: 'getting-started',
    readTime: '5 min',
    helpful: 234,
    updated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Understanding AI matching scores',
    description: 'Learn how our AI calculates candidate compatibility and what the scores mean.',
    category: 'candidate-matching',
    readTime: '8 min',
    helpful: 189,
    updated: '2024-01-12'
  },
  {
    id: '3',
    title: 'Setting up your company profile',
    description: 'Complete your company profile to attract better candidates and improve matching.',
    category: 'getting-started',
    readTime: '10 min',
    helpful: 156,
    updated: '2024-01-10'
  },
  {
    id: '4',
    title: 'Managing your subscription',
    description: 'How to upgrade, downgrade, or cancel your TalentAIze subscription.',
    category: 'billing',
    readTime: '6 min',
    helpful: 142,
    updated: '2024-01-08'
  },
  {
    id: '5',
    title: 'Integrating with your ATS',
    description: 'Connect TalentAIze with popular ATS platforms like Greenhouse and Lever.',
    category: 'integrations',
    readTime: '12 min',
    helpful: 98,
    updated: '2024-01-05'
  }
]

const videoTutorials = [
  {
    id: 'v1',
    title: 'TalentAIze Platform Overview',
    description: 'Get a complete tour of the TalentAIze platform in under 10 minutes.',
    duration: '9:32',
    views: '12.5K',
    thumbnail: '/video-thumb-1.jpg'
  },
  {
    id: 'v2',
    title: 'Creating Your First Job Post',
    description: 'Watch as we walk through creating an effective job posting from start to finish.',
    duration: '6:18',
    views: '8.3K',
    thumbnail: '/video-thumb-2.jpg'
  },
  {
    id: 'v3',
    title: 'Maximizing AI Matching Results',
    description: 'Tips and tricks to get the best candidate matches using our AI system.',
    duration: '11:45',
    views: '6.7K',
    thumbnail: '/video-thumb-3.jpg'
  }
]

const contactOptions = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    availability: 'Mon-Fri, 9AM-6PM PST',
    icon: MessageSquare,
    action: 'Start Chat',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Email Support',
    description: 'Detailed help via email within 24 hours',
    availability: '24/7',
    icon: Mail,
    action: 'Send Email',
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Phone Support',
    description: 'Speak directly with our experts',
    availability: 'Mon-Fri, 9AM-6PM PST',
    icon: Phone,
    action: 'Call Now',
    color: 'from-purple-500 to-violet-600'
  }
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<SupportArticle | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['getting-started'])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const filteredArticles = popularArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (selectedArticle) {
    return (
      <NeuronicLayout variant="subtle">
        <div className="min-h-screen">
          {/* Article Header */}
          <header className="border-b border-white/20 backdrop-blur-md bg-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Support
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <main className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
              {/* Article Meta */}
              <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs">
                  {selectedCategory || selectedArticle.category}
                </span>
                <span>{selectedArticle.readTime} read</span>
                <span>Updated {selectedArticle.updated}</span>
                <span>{selectedArticle.helpful} helpful votes</span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-6">{selectedArticle.title}</h1>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/90 leading-relaxed mb-8">
                  {selectedArticle.description}
                </p>

                {/* Mock article content */}
                <div className="space-y-6 text-white/90">
                  <h2 className="text-xl font-semibold text-white">Getting Started</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                  
                  <h3 className="text-lg font-semibold text-white">Step 1: Create Your Account</h3>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                  
                  <div className="bg-emerald-600/20 border border-emerald-400/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-emerald-400 mb-1">Pro Tip</p>
                        <p className="text-white/90 text-sm">Make sure to complete your profile for better matching results.</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white">Step 2: Configure Settings</h3>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
                </div>
              </div>

              {/* Article Actions */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/20">
                <div className="flex items-center gap-4">
                  <span className="text-white/80 text-sm">Was this helpful?</span>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <ThumbsUp className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm">Yes</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                      <ThumbsDown className="w-4 h-4 text-red-400" />
                      <span className="text-white text-sm">No</span>
                    </button>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 text-white/70 hover:text-white">
                  <Flag className="w-4 h-4" />
                  <span className="text-sm">Report issue</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </NeuronicLayout>
    )
  }

  return (
    <NeuronicLayout variant="subtle">
      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-white/20 backdrop-blur-md bg-white/10 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <HelpCircle className="w-8 h-8 text-white" />
                <span className="text-xl font-bold text-white">Support Center</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <Link href="/contact" className="text-white/80 hover:text-white">Contact Us</Link>
                <Link href="/auth/login" className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
                How can we help you?
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Search our knowledge base or browse categories to find the answers you need.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles, tutorials, or FAQs..."
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
                />
              </div>
            </div>
          </div>

          {/* Quick Help */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactOptions.map((option, index) => (
              <div key={index} className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6 hover:bg-white/30 transition-colors">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-4`}>
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                <p className="text-white/80 text-sm mb-3">{option.description}</p>
                <div className="text-white/60 text-xs mb-4">{option.availability}</div>
                <button className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
                  {option.action}
                </button>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="space-y-6">
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
                <div className="space-y-2">
                  {supportCategories.map((category) => (
                    <div key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id)
                          toggleCategory(category.id)
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedCategory === category.id 
                            ? 'bg-emerald-600/20 text-emerald-400' 
                            : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <category.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{category.articleCount}</span>
                          {expandedCategories.includes(category.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                      
                      {expandedCategories.includes(category.id) && (
                        <div className="ml-6 mt-2 space-y-1">
                          {popularArticles
                            .filter(article => article.category === category.id)
                            .slice(0, 3)
                            .map(article => (
                              <button
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className="block w-full text-left p-2 text-white/70 hover:text-white hover:bg-white/10 rounded text-sm"
                              >
                                {article.title}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Tutorials */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Video Tutorials</h3>
                <div className="space-y-3">
                  {videoTutorials.slice(0, 2).map((video) => (
                    <div key={video.id} className="group cursor-pointer">
                      <div className="aspect-video bg-white/10 rounded-lg mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                      <h4 className="font-medium text-white text-sm mb-1">{video.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Popular Articles */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCategory ? 
                      supportCategories.find(cat => cat.id === selectedCategory)?.name + ' Articles' :
                      searchQuery ? 'Search Results' : 'Popular Articles'
                    }
                  </h2>
                  {selectedCategory && (
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="text-emerald-400 hover:text-emerald-300 text-sm"
                    >
                      View All Categories
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {filteredArticles
                    .filter(article => !selectedCategory || article.category === selectedCategory)
                    .map((article) => (
                      <div 
                        key={article.id} 
                        onClick={() => setSelectedArticle(article)}
                        className="flex items-start justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {article.title}
                            </h3>
                            <span className="px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs">
                              {supportCategories.find(cat => cat.id === article.category)?.name}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm mb-3">{article.description}</p>
                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <span>{article.readTime}</span>
                            <span>•</span>
                            <span>{article.helpful} helpful</span>
                            <span>•</span>
                            <span>Updated {article.updated}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-emerald-400 transition-colors" />
                      </div>
                    ))}
                </div>
              </div>

              {/* All Video Tutorials */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Video Tutorials</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {videoTutorials.map((video) => (
                    <div key={video.id} className="group cursor-pointer">
                      <div className="aspect-video bg-white/10 rounded-lg mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                          {video.duration}
                        </div>
                      </div>
                      <h3 className="font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-white/80 text-sm mb-2">{video.description}</p>
                      <div className="text-xs text-white/60">{video.views} views</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Still Need Help */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
                <p className="text-white/80 mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/contact" className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
                    Contact Support
                  </Link>
                  <button className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                    Request Feature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </NeuronicLayout>
  )
}