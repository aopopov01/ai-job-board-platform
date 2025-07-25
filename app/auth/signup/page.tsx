import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import NeuronicBackground from '@/components/NeuronicBackground'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <NeuronicBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
            <p className="text-slate-400">Create your account</p>
          </div>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                required
              />
            </div>
            
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-white mb-2">
                I am a
              </label>
              <select
                id="userType"
                className="w-full h-10 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select user type</option>
                <option value="candidate">Job Seeker</option>
                <option value="company">Company/Recruiter</option>
              </select>
            </div>
            
            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}