'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Brain,
  Zap as Lightning,
  Shield,
  CheckCircle,
  Briefcase,
  Users
} from 'lucide-react'
import NeuronicLayout from '../../../components/layout/NeuronicLayout'

// Signup Form Component
function SignupForm() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [userType, setUserType] = React.useState('candidate')

  return (
    <div className="w-full max-w-md">
      <div 
        className="backdrop-blur-md border-2 rounded-3xl p-8 shadow-2xl"
        style={{
          background: 'rgba(26, 26, 26, 0.85)', /* Claude interface charcoal */
          borderColor: 'rgba(64, 64, 64, 0.6)',  /* Enhanced contrast border */
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl shadow-blue-500/30">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black mb-2" style={{ color: '#e5e5e5' }}>Join TalentAIze</h2>
          <p className="font-medium" style={{ color: '#a0a0a0' }}>Start your lightning-powered journey</p>
        </div>

        <form className="space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-bold text-white mb-3">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('candidate')}
                className={`h-12 px-4 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                  userType === 'candidate'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-black/40 text-white/80 border-white/30 hover:border-white/50'
                }`}
              >
                <User className="w-4 h-4" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setUserType('recruiter')}
                className={`h-12 px-4 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                  userType === 'recruiter'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-black/40 text-white/80 border-white/30 hover:border-white/50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Recruiter
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full h-14 pl-12 pr-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-14 pl-12 pr-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="w-full h-14 pl-12 pr-12 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full h-14 pl-12 pr-12 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-black/40 border-2 border-white/30 rounded flex items-center justify-center mt-0.5 flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-blue-400 opacity-0 transition-opacity" />
            </div>
            <p className="text-sm text-white/80 font-medium">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className={`w-full h-14 rounded-xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
              userType === 'candidate'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            Create Account
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/80 font-medium">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}// Signup Benefits Section
function SignupBenefits() {
  const benefits = [
    {
      icon: Lightning,
      title: "Instant AI Matching",
      description: "Get matched with opportunities the moment you sign up"
    },
    {
      icon: Brain,
      title: "Smart Profile Analysis",
      description: "AI analyzes your skills and suggests improvements"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays secure and private, always"
    },
    {
      icon: Users,
      title: "Global Network",
      description: "Connect with top talent and companies worldwide"
    }
  ]

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-white mb-4">Start for free</h3>
        <p className="text-white/80 font-medium">Join thousands who've transformed their careers</p>
      </div>

      {benefits.map((benefit, idx) => (
        <div key={idx} className="flex items-start gap-4 p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
            <benefit.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">{benefit.title}</h4>
            <p className="text-white/70 font-medium text-sm">{benefit.description}</p>
          </div>
        </div>
      ))}

      <div className="text-center p-6 bg-black/40 backdrop-blur-md border-2 border-green-400/40 rounded-2xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-300 font-bold">Free Forever</span>
        </div>
        <p className="text-white/70 text-sm font-medium">No credit card required • Cancel anytime</p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <NeuronicLayout variant="subtle" className="overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/50 border-b-2 border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              <Link href="/" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white tracking-tight">TalentAIze</span>
              </Link>
              
              <nav className="hidden lg:flex items-center gap-16">
                <Link href="/platform" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Platform
                </Link>
                <Link href="/solutions" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Solutions
                </Link>
                <Link href="/pricing" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Pricing
                </Link>
              </nav>
              
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="h-12 px-6 flex items-center text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center min-h-screen pt-24 pb-12">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Left Column - Benefits */}
              <div className="order-2 lg:order-1">
                <SignupBenefits />
              </div>
              
              {/* Right Column - Signup Form */}
              <div className="order-1 lg:order-2 flex justify-center">
                <SignupForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </NeuronicLayout>
  )
}