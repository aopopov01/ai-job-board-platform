'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@job-board/shared'
import { Button } from '@job-board/ui'
import { useSignOut } from '@job-board/shared'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = useAuthStore()
  const router = useRouter()
  const signOut = useSignOut()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!profile) {
      router.push('/auth/setup')
      return
    }
  }, [user, profile, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const isCompany = profile.user_type === 'company'
  const isIndividual = profile.user_type === 'individual'

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    ...(isCompany ? [
      { name: 'My Jobs', href: '/dashboard/jobs', icon: '💼' },
      { name: 'Applications', href: '/dashboard/applications', icon: '📋' },
    ] : []),
    ...(isIndividual ? [
      { name: 'Job Search', href: '/jobs', icon: '🔍' },
      { name: 'Recommendations', href: '/dashboard/recommendations', icon: '🎯' },
      { name: 'My Applications', href: '/dashboard/applications', icon: '📋' },
      { name: 'CV Management', href: '/dashboard/cv', icon: '📄' },
    ] : []),
    { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                  JobBoard
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm inline-flex items-center"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                {profile.first_name} {profile.last_name}
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}