'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { jobService, jobCategoryService } from '@job-board/database'
import { jobSchema, JOB_TYPES, WORK_STYLES, EXPERIENCE_LEVELS } from '@job-board/shared'

export default function NewJobPage() {
  const { profile } = useAuthStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    job_type: 'full_time',
    work_style: 'hybrid',
    experience_level: 'mid',
    location: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'EUR',
    category_id: '',
    skills_required: [] as string[],
    skills_nice_to_have: [] as string[],
    application_deadline: ''
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await jobCategoryService.getAll()
        setCategories(data || [])
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || profile.user_type !== 'company') return

    setLoading(true)
    setError('')

    try {
      const validatedData = jobSchema.parse({
        ...formData,
        salary_min: formData.salary_min ? Number(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? Number(formData.salary_max) : undefined,
        application_deadline: formData.application_deadline || undefined
      })

      const { data, error } = await jobService.create({
        title: validatedData.title,
        description: validatedData.description,
        company_id: profile.id,
        location: validatedData.location || null,
        work_style: validatedData.work_style,
        job_type: validatedData.job_type,
        experience_level: validatedData.experience_level,
        salary_min: validatedData.salary_min,
        salary_max: validatedData.salary_max,
        salary_currency: validatedData.salary_currency,
        skills_required: [],
        skills_nice_to_have: [],
        benefits: [],
        application_deadline: validatedData.application_deadline || null,
        status: 'active',
        category_id: null
      })

      if (error) throw error

      router.push('/dashboard/jobs')
    } catch (error: any) {
      if (error.errors) {
        setError(error.errors.map((e: any) => e.message).join(', '))
      } else {
        setError(error.message || 'Failed to create job')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSkillsChange = (field: 'skills_required' | 'skills_nice_to_have', value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s.length > 0)
    setFormData(prev => ({ ...prev, [field]: skills }))
  }

  if (profile?.user_type !== 'company') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">This page is only available for company accounts.</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Post New Job</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a compelling job posting to attract the best candidates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Senior React Developer"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.job_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, job_type: e.target.value }))}
                  disabled={loading}
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Style *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.work_style}
                  onChange={(e) => setFormData(prev => ({ ...prev, work_style: e.target.value }))}
                  disabled={loading}
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.experience_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value }))}
                  disabled={loading}
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., New York, NY or Remote"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Salary Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Salary
                  </label>
                  <Input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
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
                    value={formData.salary_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
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
                    value={formData.salary_currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_currency: e.target.value }))}
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

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, what the candidate will be doing, and what makes this opportunity exciting..."
                required
                disabled={loading}
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements
              </label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="List the required qualifications, experience, and skills..."
                disabled={loading}
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsibilities
              </label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.responsibilities}
                onChange={(e) => setFormData(prev => ({ ...prev, responsibilities: e.target.value }))}
                placeholder="Outline the key responsibilities and duties..."
                disabled={loading}
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefits
              </label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.benefits}
                onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                placeholder="Describe the benefits, perks, and compensation package..."
                disabled={loading}
              />
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills
                </label>
                <Input
                  value={formData.skills_required.join(', ')}
                  onChange={(e) => handleSkillsChange('skills_required', e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nice to Have Skills
                </label>
                <Input
                  value={formData.skills_nice_to_have.join(', ')}
                  onChange={(e) => handleSkillsChange('skills_nice_to_have', e.target.value)}
                  placeholder="GraphQL, AWS, Docker"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>
            </div>

            {/* Application Deadline */}
            <div className="md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline
              </label>
              <Input
                type="date"
                value={formData.application_deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}