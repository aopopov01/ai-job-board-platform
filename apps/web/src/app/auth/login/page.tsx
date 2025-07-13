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
import NeuronicLayout from '../../../components/layout/NeuronicLayout'

// Login Form Component
function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="w-full max-w-md">
      <div className="bg-black/70 backdrop-blur-md border-2 border-white/30 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl shadow-blue-500/30">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
          <p className="text-white/80 font-medium">Sign in to ignite your career</p>
        </div>

        <form className="space-y-6">
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
                placeholder="Enter your password"
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
        <main className="flex-1 flex items-center justify-center min-h-screen pt-24 pb-12">
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
    </NeuronicLayout>
  )
}