'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { useAuthStore } from '@job-board/shared/client'
import { userProfileService, individualProfileService, companyProfileService } from '@job-board/database'
import { userProfileSchema, individualProfileSchema, companyProfileSchema } from '@job-board/shared'

export default function SetupPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, profile } = useAuthStore()

  const [userType, setUserType] = useState<'individual' | 'company'>('individual')
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    language_preference: 'en' as const
  })

  const [individualProfile, setIndividualProfile] = useState({
    job_search_status: 'not_looking' as const,
    years_of_experience: 0,
    current_job_title: '',
    current_company: '',
    salary_expectation_min: 0,
    salary_expectation_max: 0,
    salary_currency: 'EUR',
    remote_preference: 'flexible' as const
  })

  const [companyProfile, setCompanyProfile] = useState({
    company_name: '',
    company_size: '1-10' as const,
    industry: '',
    founded_year: new Date().getFullYear(),
    company_description: '',
    company_website: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (profile) {
      router.push('/dashboard')
      return
    }

    const userMetadata = user.user_metadata
    if (userMetadata?.user_type) {
      setUserType(userMetadata.user_type)
    }

    if (user.email) {
      const nameParts = user.email.split('@')[0].split('.')
      if (nameParts.length >= 2) {
        setUserProfile(prev => ({
          ...prev,
          first_name: nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1),
          last_name: nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
        }))
      }
    }
  }, [user, profile, router])

  const handleUserProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const validatedData = userProfileSchema.parse({
        ...userProfile,
        user_type: userType
      })

      await userProfileService.create({
        id: user!.id,
        email: user!.email || '',
        first_name: validatedData.first_name || '',
        last_name: validatedData.last_name || '',
        user_type: validatedData.user_type,
        phone: validatedData.phone || null,
        location: validatedData.location || null
      })

      setStep(2)
    } catch (error: any) {
      setError(error.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSpecificProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (userType === 'individual') {
        const validatedData = individualProfileSchema.parse(individualProfile)
        await individualProfileService.create({
          id: user!.id,
          ...validatedData
        })
      } else {
        const validatedData = companyProfileSchema.parse(companyProfile)
        await companyProfileService.create({
          id: user!.id,
          company_name: validatedData.company_name,
          industry: validatedData.industry || '',
          company_size: validatedData.company_size || null,
          website: validatedData.company_website || null,
          description: validatedData.company_description || null
        })
      }

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message || 'Failed to complete setup')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Step {step} of 2 - Let's set up your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <form onSubmit={handleUserProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Input
                    value={userProfile.first_name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, first_name: e.target.value }))}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Input
                    value={userProfile.last_name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, last_name: e.target.value }))}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  value={userProfile.location}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., New York, NY"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <Input
                    type="url"
                    value={userProfile.linkedin_url}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub URL
                  </label>
                  <Input
                    type="url"
                    value={userProfile.github_url}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, github_url: e.target.value }))}
                    placeholder="https://github.com/..."
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </form>
          )}

          {step === 2 && userType === 'individual' && (
            <form onSubmit={handleSpecificProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Search Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={individualProfile.job_search_status}
                  onChange={(e) => setIndividualProfile(prev => ({ ...prev, job_search_status: e.target.value as any }))}
                  disabled={loading}
                >
                  <option value="not_looking">Not Looking</option>
                  <option value="open_to_opportunities">Open to Opportunities</option>
                  <option value="actively_looking">Actively Looking</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={individualProfile.years_of_experience}
                  onChange={(e) => setIndividualProfile(prev => ({ ...prev, years_of_experience: Number(e.target.value) }))}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Job Title
                  </label>
                  <Input
                    value={individualProfile.current_job_title}
                    onChange={(e) => setIndividualProfile(prev => ({ ...prev, current_job_title: e.target.value }))}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Company
                  </label>
                  <Input
                    value={individualProfile.current_company}
                    onChange={(e) => setIndividualProfile(prev => ({ ...prev, current_company: e.target.value }))}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remote Work Preference
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={individualProfile.remote_preference}
                  onChange={(e) => setIndividualProfile(prev => ({ ...prev, remote_preference: e.target.value as any }))}
                  disabled={loading}
                >
                  <option value="flexible">Flexible</option>
                  <option value="remote_only">Remote Only</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Completing Setup...' : 'Complete Setup'}
              </Button>
            </form>
          )}

          {step === 2 && userType === 'company' && (
            <form onSubmit={handleSpecificProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <Input
                  value={companyProfile.company_name}
                  onChange={(e) => setCompanyProfile(prev => ({ ...prev, company_name: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={companyProfile.company_size}
                    onChange={(e) => setCompanyProfile(prev => ({ ...prev, company_size: e.target.value as any }))}
                    disabled={loading}
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <Input
                    value={companyProfile.industry}
                    onChange={(e) => setCompanyProfile(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., Technology, Healthcare"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Founded Year
                </label>
                <Input
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={companyProfile.founded_year}
                  onChange={(e) => setCompanyProfile(prev => ({ ...prev, founded_year: Number(e.target.value) }))}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <Input
                  type="url"
                  value={companyProfile.company_website}
                  onChange={(e) => setCompanyProfile(prev => ({ ...prev, company_website: e.target.value }))}
                  placeholder="https://company.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Description
                </label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={companyProfile.company_description}
                  onChange={(e) => setCompanyProfile(prev => ({ ...prev, company_description: e.target.value }))}
                  placeholder="Tell us about your company..."
                  maxLength={1000}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Completing Setup...' : 'Complete Setup'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}