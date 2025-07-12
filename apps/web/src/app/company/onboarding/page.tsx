'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Upload,
  User,
  Briefcase,
  Target,
  Settings,
  CreditCard,
  Shield,
  Zap
} from 'lucide-react'
import NeuronicLayout from '../../../components/layout/NeuronicLayout'

interface OnboardingData {
  // Company Information
  companyName: string
  companyDescription: string
  industry: string
  companySize: string
  website: string
  foundedYear: string
  location: string
  
  // Contact Information
  firstName: string
  lastName: string
  email: string
  phone: string
  jobTitle: string
  
  // Hiring Information
  hiringGoals: string[]
  avgHiresPerMonth: string
  currentChallenges: string[]
  
  // Account Setup
  plan: string
  billingPeriod: string
}

const steps = [
  { id: 1, title: 'Company Info', icon: Building2 },
  { id: 2, title: 'Contact Details', icon: User },
  { id: 3, title: 'Hiring Goals', icon: Target },
  { id: 4, title: 'Plan Selection', icon: CreditCard },
  { id: 5, title: 'Verification', icon: Shield }
]

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Consulting', 'Media', 'Real Estate', 'Transportation',
  'Government', 'Non-profit', 'Other'
]

const companySizes = [
  '1-10 employees', '11-50 employees', '51-200 employees', 
  '201-1000 employees', '1001-5000 employees', '5000+ employees'
]

const hiringGoalsOptions = [
  'Scale engineering team', 'Hire for new roles', 'Replace departing employees',
  'Seasonal hiring', 'Diversity hiring', 'Remote team expansion',
  'International expansion', 'Startup team building'
]

const challengesOptions = [
  'Finding qualified candidates', 'Long hiring process', 'High cost per hire',
  'Poor candidate experience', 'Lack of diversity', 'Remote hiring challenges',
  'Skill assessment difficulties', 'Time to fill positions'
]

const plans = [
  {
    name: 'Starter',
    price: '$99',
    period: 'per month',
    description: 'Perfect for small teams',
    features: ['Up to 10 job postings', 'Basic AI matching', 'Email support', 'Standard analytics'],
    popular: false
  },
  {
    name: 'Professional',
    price: '$299',
    period: 'per month',
    description: 'Ideal for growing companies',
    features: ['Up to 50 job postings', 'Advanced AI matching', 'Priority support', 'Advanced analytics', 'Team collaboration'],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large organizations',
    features: ['Unlimited job postings', 'Premium AI matching', 'Dedicated support', 'White-label solution'],
    popular: false
  }
]

export default function CompanyOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>({
    companyName: '',
    companyDescription: '',
    industry: '',
    companySize: '',
    website: '',
    foundedYear: '',
    location: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    hiringGoals: [],
    avgHiresPerMonth: '',
    currentChallenges: [],
    plan: '',
    billingPeriod: 'monthly'
  })

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: 'hiringGoals' | 'currentChallenges', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData)
    // Redirect to dashboard or success page
  }

  return (
    <NeuronicLayout variant="subtle">
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-gray-200 via-white to-emerald-200 bg-clip-text text-transparent">
                Welcome to TalentAIze
              </span>
            </h1>
            <p className="text-xl text-white/90">
              Let's set up your company profile and get you started with AI-powered hiring.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step.id <= currentStep 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-white/30 text-white/60'
                  }`}>
                    {step.id < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {step.id < steps.length && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      step.id < currentStep ? 'bg-emerald-600' : 'bg-white/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <span className="text-white/80">Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8 shadow-xl">
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tell us about your company</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Company Name *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Acme Corporation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Industry *</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry} className="bg-gray-800">{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Company Description *</label>
                  <textarea
                    value={formData.companyDescription}
                    onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your company, culture, and what makes you unique..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Company Size *</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select size</option>
                      {companySizes.map(size => (
                        <option key={size} value={size} className="bg-gray-800">{size}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Founded Year</label>
                    <input
                      type="number"
                      value={formData.foundedYear}
                      onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Your contact information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Head of Talent Acquisition"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Hiring Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Tell us about your hiring goals</h2>
                
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-4">What are your main hiring goals? (Select all that apply)</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {hiringGoalsOptions.map(goal => (
                      <label key={goal} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hiringGoals.includes(goal)}
                          onChange={() => handleArrayChange('hiringGoals', goal)}
                          className="w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500"
                        />
                        <span className="text-white/90">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">How many people do you typically hire per month?</label>
                  <select
                    value={formData.avgHiresPerMonth}
                    onChange={(e) => handleInputChange('avgHiresPerMonth', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select range</option>
                    <option value="1-3" className="bg-gray-800">1-3 people</option>
                    <option value="4-10" className="bg-gray-800">4-10 people</option>
                    <option value="11-25" className="bg-gray-800">11-25 people</option>
                    <option value="26-50" className="bg-gray-800">26-50 people</option>
                    <option value="50+" className="bg-gray-800">50+ people</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-4">What are your current hiring challenges? (Select all that apply)</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {challengesOptions.map(challenge => (
                      <label key={challenge} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.currentChallenges.includes(challenge)}
                          onChange={() => handleArrayChange('currentChallenges', challenge)}
                          className="w-4 h-4 text-blue-600 bg-white/10 border-white/30 rounded focus:ring-blue-500"
                        />
                        <span className="text-white/90">{challenge}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Plan Selection */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Choose your plan</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan, index) => (
                    <div key={index} className={`relative ${plan.popular ? 'transform scale-105' : ''}`}>
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            Most Popular
                          </div>
                        </div>
                      )}
                      
                      <div className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                        formData.plan === plan.name
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : 'border-white/30 bg-white/10 hover:border-white/50'
                      }`} onClick={() => handleInputChange('plan', plan.name)}>
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                          <div className="text-3xl font-bold text-white mb-2">
                            {plan.price}
                            <span className="text-sm font-normal text-white/80">/{plan.period}</span>
                          </div>
                          <p className="text-white/80">{plan.description}</p>
                        </div>

                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-white/90 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <label className="block text-white/90 text-sm font-medium mb-4">Billing Period</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="billingPeriod"
                        value="monthly"
                        checked={formData.billingPeriod === 'monthly'}
                        onChange={(e) => handleInputChange('billingPeriod', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-white/90">Monthly</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="billingPeriod"
                        value="annual"
                        checked={formData.billingPeriod === 'annual'}
                        onChange={(e) => handleInputChange('billingPeriod', e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-white/90">Annual (20% discount)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Verification */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to TalentAIze!</h2>
                
                <p className="text-white/90 mb-8">
                  Your account has been created successfully. We've sent a verification email to {formData.email}.
                  Please verify your email to complete the setup.
                </p>

                <div className="bg-white/10 rounded-lg p-6 text-left">
                  <h3 className="text-lg font-semibold text-white mb-4">What's next?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white/90">Verify your email address</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white/90">Set up your first job posting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white/90">Configure your hiring preferences</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white/90">Start receiving AI-matched candidates</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link href="/company/dashboard" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors">
                    <Briefcase className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                  <Link href="/company/support" className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                    <Mail className="w-4 h-4" />
                    Get Help
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex justify-between mt-8 pt-8 border-t border-white/20">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <button
                  onClick={currentStep === 4 ? handleSubmit : nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors"
                >
                  {currentStep === 4 ? 'Create Account' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </NeuronicLayout>
  )
}