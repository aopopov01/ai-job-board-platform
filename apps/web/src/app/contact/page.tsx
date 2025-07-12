'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  HelpCircle,
  Users,
  Building2,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Zap,
  Shield,
  Heart,
  Star
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

interface ContactForm {
  name: string
  email: string
  company: string
  subject: string
  message: string
  category: string
}

const contactCategories = [
  { id: 'general', label: 'General Inquiry', icon: MessageSquare },
  { id: 'support', label: 'Technical Support', icon: HelpCircle },
  { id: 'sales', label: 'Sales & Partnerships', icon: Building2 },
  { id: 'careers', label: 'Careers at TalentAIze', icon: Users },
  { id: 'press', label: 'Press & Media', icon: Globe },
  { id: 'feedback', label: 'Product Feedback', icon: Star }
]

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help via email within 24 hours',
    contact: 'support@talentaize.com',
    availability: '24/7',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our support team',
    contact: '+1 (555) 123-4567',
    availability: 'Mon-Fri, 9AM-6PM PST',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Instant help through our chat widget',
    contact: 'Available on our website',
    availability: 'Mon-Fri, 9AM-6PM PST',
    color: 'from-purple-500 to-violet-600'
  },
  {
    icon: HelpCircle,
    title: 'Help Center',
    description: 'Self-service resources and guides',
    contact: 'help.talentaize.com',
    availability: '24/7',
    color: 'from-orange-500 to-red-600'
  }
]

const officeLocations = [
  {
    city: 'San Francisco',
    address: '123 Market Street, Suite 500\nSan Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    email: 'sf@talentaize.com',
    timezone: 'PST'
  },
  {
    city: 'New York',
    address: '456 Broadway, Floor 12\nNew York, NY 10013',
    phone: '+1 (555) 234-5678',
    email: 'ny@talentaize.com',
    timezone: 'EST'
  },
  {
    city: 'London',
    address: '789 Shoreditch High Street\nLondon, E1 6JQ, UK',
    phone: '+44 20 7123 4567',
    email: 'london@talentaize.com',
    timezone: 'GMT'
  }
]

const faqs = [
  {
    question: 'How does AI matching work?',
    answer: 'Our AI analyzes job requirements, candidate profiles, skills, and experience to create highly accurate matches. The system learns from successful placements to continuously improve matching quality.'
  },
  {
    question: 'What are the pricing plans?',
    answer: 'We offer three plans: Starter ($99/month), Professional ($299/month), and Enterprise (custom pricing). Each plan includes different features and job posting limits.'
  },
  {
    question: 'How do I post a job?',
    answer: 'Simply sign up for a company account, complete your profile, and use our job posting wizard. Jobs are typically live within 15 minutes of submission.'
  },
  {
    question: 'Can I integrate with my existing ATS?',
    answer: 'Yes, we offer integrations with popular ATS platforms including Greenhouse, Lever, Workday, and more. Contact our sales team for custom integrations.'
  },
  {
    question: 'What support do you provide?',
    answer: 'We provide email support, live chat, phone support, and a comprehensive help center. Enterprise customers get dedicated account management.'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState('contact')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <NeuronicLayout variant="subtle">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Message Sent!</h2>
            <p className="text-white/80 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
              >
                Send Another Message
              </button>
              <Link href="/" className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
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
                <Building2 className="w-8 h-8 text-white" />
                <span className="text-xl font-bold text-white">TalentAIze</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'contact' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Contact Us
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'support' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Support
                </button>
                <button
                  onClick={() => setActiveTab('locations')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'locations' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Locations
                </button>
              </nav>

              <div className="flex items-center gap-4">
                <Link href="/jobs" className="text-white/80 hover:text-white">Browse Jobs</Link>
                <Link href="/auth/login" className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
                <h1 className="text-4xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
                    Get in Touch
                  </span>
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Have questions about TalentAIze? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {contactMethods.map((method, index) => (
                  <div key={index} className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6 hover:bg-white/30 transition-colors">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mb-4`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                    <p className="text-white/80 text-sm mb-3">{method.description}</p>
                    <div className="text-emerald-400 font-medium text-sm mb-1">{method.contact}</div>
                    <div className="text-white/60 text-xs">{method.availability}</div>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Category Selection */}
                      <div>
                        <label className="block text-white/90 text-sm font-medium mb-3">What can we help you with?</label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {contactCategories.map(category => (
                            <label key={category.id} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 cursor-pointer">
                              <input
                                type="radio"
                                name="category"
                                value={category.id}
                                checked={formData.category === category.id}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-4 h-4 text-emerald-600"
                              />
                              <category.icon className="w-4 h-4 text-white/70" />
                              <span className="text-white/90 text-sm">{category.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white/90 text-sm font-medium mb-2">Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/90 text-sm font-medium mb-2">Email *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white/90 text-sm font-medium mb-2">Company</label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Your company name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/90 text-sm font-medium mb-2">Subject *</label>
                          <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Brief subject line"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/90 text-sm font-medium mb-2">Message *</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          required
                          rows={6}
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          placeholder="Tell us more about how we can help you..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Response Times */}
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Response Times</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white/90 text-sm">General inquiries: &lt; 24 hours</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-white/90 text-sm">Technical support: &lt; 4 hours</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-white/90 text-sm">Sales inquiries: &lt; 2 hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                    <div className="flex gap-3">
                      <a href="#" className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Twitter className="w-5 h-5 text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Facebook className="w-5 h-5 text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Instagram className="w-5 h-5 text-white" />
                      </a>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Why Choose Us</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span className="text-white/90 text-sm">SOC 2 Compliant</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <span className="text-white/90 text-sm">99.9% Uptime</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-400" />
                        <span className="text-white/90 text-sm">Customer-First Approach</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="space-y-12">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
                    Support Center
                  </span>
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Find answers to common questions or get help from our support team.
                </p>
              </div>

              {/* FAQ Section */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-white/20 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 transition-colors text-left"
                      >
                        <span className="font-medium text-white">{faq.question}</span>
                        <HelpCircle className={`w-5 h-5 text-white/60 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedFaq === index && (
                        <div className="p-4 bg-white/5">
                          <p className="text-white/80">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Resources */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6 hover:bg-white/30 transition-colors">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                    <HelpCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Help Center</h3>
                  <p className="text-white/80 text-sm mb-4">Browse our comprehensive knowledge base and tutorials.</p>
                  <a href="#" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                    Visit Help Center
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6 hover:bg-white/30 transition-colors">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
                  <p className="text-white/80 text-sm mb-4">Get instant help from our support team during business hours.</p>
                  <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                    Start Chat
                    <MessageSquare className="w-3 h-3" />
                  </button>
                </div>

                <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6 hover:bg-white/30 transition-colors">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
                  <p className="text-white/80 text-sm mb-4">Connect with other users and share best practices.</p>
                  <a href="#" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                    Join Community
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <div className="space-y-12">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
                    Our Locations
                  </span>
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Find us around the world. We have offices in major cities to serve you better.
                </p>
              </div>

              {/* Office Locations */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officeLocations.map((location, index) => (
                  <div key={index} className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{location.city}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-white/60 mt-1" />
                        <div>
                          <p className="text-white/90 text-sm whitespace-pre-line">{location.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-white/60" />
                        <span className="text-white/90 text-sm">{location.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-white/60" />
                        <span className="text-white/90 text-sm">{location.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-white/60" />
                        <span className="text-white/90 text-sm">Timezone: {location.timezone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Global Presence */}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-6">Global Presence</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">50+</div>
                    <div className="text-white/80 text-sm">Countries Served</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">1M+</div>
                    <div className="text-white/80 text-sm">Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">10K+</div>
                    <div className="text-white/80 text-sm">Partner Companies</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">24/7</div>
                    <div className="text-white/80 text-sm">Global Support</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </NeuronicLayout>
  )
}