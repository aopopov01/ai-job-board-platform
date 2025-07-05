'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@job-board/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { userProfileService, individualProfileService, companyProfileService } from '@job-board/database'
import { userProfileSchema, individualProfileSchema, companyProfileSchema } from '@job-board/shared'

export default function ProfilePage() {
  const { profile, user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const [specificProfile, setSpecificProfile] = useState<any>(null)

  useEffect(() => {
    const loadProfileData = async () => {
      if (!profile) return

      // Load basic user profile data
      setUserProfile({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: '',
        linkedin_url: '',
        github_url: '',
        language_preference: 'en'
      })

      // Load specific profile data
      try {
        if (profile.user_type === 'individual') {
          const { data } = await individualProfileService.getById(profile.id)
          if (data) {
            setSpecificProfile(data)
            setIndividualProfile({
              job_search_status: (data.job_search_status as any) || 'not_looking',
              years_of_experience: data.years_of_experience || 0,
              current_job_title: data.current_job_title || '',
              current_company: '',
              salary_expectation_min: data.salary_expectation_min || 0,
              salary_expectation_max: data.salary_expectation_max || 0,
              salary_currency: data.salary_currency || 'EUR',
              remote_preference: (data.remote_preference as any) || 'flexible'
            })
          }
        } else if (profile.user_type === 'company') {
          const { data } = await companyProfileService.getById(profile.id)
          if (data) {
            setSpecificProfile(data)
            setCompanyProfile({
              company_name: data.company_name || '',
              company_size: (data.company_size as any) || '1-10',
              industry: data.industry || '',
              founded_year: new Date().getFullYear(),
              company_description: data.description || '',
              company_website: data.website || ''
            })
          }
        }
      } catch (error) {
        console.error('Error loading specific profile:', error)
      }
    }

    loadProfileData()
  }, [profile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Update basic user profile
      const validatedUserData = userProfileSchema.parse({
        ...userProfile,
        user_type: profile.user_type
      })

      await userProfileService.update(profile.id, validatedUserData)

      // Update specific profile
      if (profile.user_type === 'individual') {
        const validatedIndividualData = individualProfileSchema.parse(individualProfile)
        if (specificProfile) {
          await individualProfileService.update(profile.id, validatedIndividualData)
        } else {
          await individualProfileService.create({
            id: profile.id,
            ...validatedIndividualData
          })
        }
      } else if (profile.user_type === 'company') {
        const validatedCompanyData = companyProfileSchema.parse(companyProfile)
        if (specificProfile) {
          await companyProfileService.update(profile.id, validatedCompanyData)
        } else {
          await companyProfileService.create({
            id: profile.id,
            company_name: validatedCompanyData.company_name,
            industry: validatedCompanyData.industry || '',
            company_size: validatedCompanyData.company_size || null,
            website: validatedCompanyData.company_website || null,
            description: validatedCompanyData.company_description || null
          })
        }
      }

      setSuccess('Profile updated successfully!')
    } catch (error: any) {
      if (error.errors) {
        setError(error.errors.map((e: any) => e.message).join(', '))
      } else {
        setError(error.message || 'Failed to update profile')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    )
  }

  const isIndividual = profile.user_type === 'individual'
  const isCompany = profile.user_type === 'company'

  return (
    <div className="px-4 py-6 sm:px-0 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your {isCompany ? 'company' : 'personal'} information and preferences
        </p>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-8">
        {/* Basic Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Your basic profile information visible to others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={userProfile.bio}
                onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder={isCompany ? "Tell us about your company..." : "Tell us about yourself..."}
                maxLength={500}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">{userProfile.bio.length}/500 characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language Preference
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={userProfile.language_preference}
                onChange={(e) => setUserProfile(prev => ({ ...prev, language_preference: e.target.value as any }))}
                disabled={loading}
              >
                <option value="en">English</option>
                <option value="el">Greek</option>
                <option value="ru">Russian</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Individual-specific Profile */}
        {isIndividual && (
          <Card>
            <CardHeader>
              <CardTitle>Job Search Preferences</CardTitle>
              <CardDescription>
                Help employers find you with the right opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Salary Expectations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Salary
                    </label>
                    <Input
                      type="number"
                      value={individualProfile.salary_expectation_min}
                      onChange={(e) => setIndividualProfile(prev => ({ ...prev, salary_expectation_min: Number(e.target.value) }))}
                      placeholder="50000"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Salary
                    </label>
                    <Input
                      type="number"
                      value={individualProfile.salary_expectation_max}
                      onChange={(e) => setIndividualProfile(prev => ({ ...prev, salary_expectation_max: Number(e.target.value) }))}
                      placeholder="80000"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={individualProfile.salary_currency}
                      onChange={(e) => setIndividualProfile(prev => ({ ...prev, salary_currency: e.target.value }))}
                      disabled={loading}
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="CHF">CHF</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company-specific Profile */}
        {isCompany && (
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Information about your company for job seekers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Description
                </label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={companyProfile.company_description}
                  onChange={(e) => setCompanyProfile(prev => ({ ...prev, company_description: e.target.value }))}
                  placeholder="Tell job seekers about your company, culture, and mission..."
                  maxLength={1000}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">{companyProfile.company_description.length}/1000 characters</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          {success && (
            <div className="flex-1 text-green-600 text-sm flex items-center">
              ✅ {success}
            </div>
          )}
          {error && (
            <div className="flex-1 text-red-600 text-sm flex items-center">
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}