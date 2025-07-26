'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Brain,
  Zap as Lightning,
  Shield,
  CheckCircle
} from 'lucide-react'

// Login Form Component
function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-md border-2 border-white/20 rounded-3xl p-8 shadow-2xl bg-black/80">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl shadow-blue-500/30">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black mb-2 text-white">Welcome back</h2>
          <p className="font-medium text-white/70">Sign in to ignite your career</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-white">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-14 pl-12 pr-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-white">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full h-14 pl-12 pr-12 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all font-medium"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="sr-only" />
              <div className="w-5 h-5 bg-black/40 border-2 border-white/30 rounded flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-400 opacity-0 transition-opacity" />
              </div>
              <span className="text-sm text-white/80 font-medium">Remember me</span>
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3"
          >
            Sign In
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black/80 text-white/60 font-medium">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Social Login Options */}
        <div className="space-y-3">
          <button className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Continue with LinkedIn
          </button>

          <button className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/80 font-medium">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Login Benefits Section
function LoginBenefits() {
  const benefits = [
    {
      icon: Lightning,
      title: "Lightning-Fast Matching",
      description: "Get matched with perfect opportunities in seconds"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Receive personalized career recommendations"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with bank-grade security"
    }
  ]

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-black text-white mb-4">Why TalentAIze?</h3>
        <p className="text-white/80 font-medium">Join thousands who've electrified their careers</p>
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
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Neuronic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"></div>
      
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
                <Link href="/jobs" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Jobs
                </Link>
                <Link href="/companies" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Companies
                </Link>
              </nav>
              
              <div className="flex items-center gap-4">
                <Link href="/auth/signup">
                  <button className="h-12 px-8 bg-white text-black rounded-xl font-black text-[16px] hover:bg-gray-100 transition-all shadow-lg">
                    Get started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center min-h-screen pt-24 pb-12 relative z-10">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Left Column - Benefits */}
              <div className="order-2 lg:order-1">
                <LoginBenefits />
              </div>
              
              {/* Right Column - Login Form */}
              <div className="order-1 lg:order-2 flex justify-center">
                <LoginForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}