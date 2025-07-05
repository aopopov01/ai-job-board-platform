'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { jobService, jobCategoryService } from '@job-board/database'
import { useAuthStore } from '@job-board/shared'

interface Job {
  id: string
  title: string
  description: string
  job_type: string
  work_style: string
  location: string
  salary_min: number
  salary_max: number
  salary_currency: string
  created_at: string
  company_profiles: {
    company_name: string
    company_size: string
    industry: string
  }
  job_categories?: { name: string }
}

export default function JobsPage() {
  const { profile } = useAuthStore()
  const [jobs, setJobs] = useState<any[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    query: '',
    location: '',
    job_type: '',
    work_style: '',
    experience_level: '',
    category_id: '',
    salary_min: '',
    salary_max: ''
  })

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [jobsResponse, categoriesResponse] = await Promise.all([
          jobService.search({ limit: 20 }),
          jobCategoryService.getAll()
        ])

        if (jobsResponse.error) throw jobsResponse.error
        if (categoriesResponse.error) throw categoriesResponse.error

        setJobs(jobsResponse.data || [])
        setCategories(categoriesResponse.data || [])
      } catch (error: any) {
        setError(error.message || 'Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleSearch = async () => {
    setSearchLoading(true)
    setError('')

    try {
      const searchFilters = {
        ...filters,
        salary_min: filters.salary_min ? Number(filters.salary_min) : undefined,
        salary_max: filters.salary_max ? Number(filters.salary_max) : undefined,
        limit: 20
      }

      const { data, error } = await jobService.search(searchFilters)
      if (error) throw error

      setJobs(data || [])
    } catch (error: any) {
      setError(error.message || 'Failed to search jobs')
    } finally {
      setSearchLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      job_type: '',
      work_style: '',
      experience_level: '',
      category_id: '',
      salary_min: '',
      salary_max: ''
    })
    // Re-run initial search
    handleSearch()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Your Dream Job</h1>
              <p className="mt-1 text-sm text-gray-600">
                Discover {jobs.length} amazing opportunities
              </p>
            </div>
            {profile && (
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <Input
                    value={filters.query}
                    onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                    placeholder="Job title, company, or keywords"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, state, or remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.category_id}
                    onChange={(e) => setFilters(prev => ({ ...prev, category_id: e.target.value }))}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.job_type}
                    onChange={(e) => setFilters(prev => ({ ...prev, job_type: e.target.value }))}
                  >
                    <option value="">All Types</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Style
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.work_style}
                    onChange={(e) => setFilters(prev => ({ ...prev, work_style: e.target.value }))}
                  >
                    <option value="">All Styles</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.experience_level}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience_level: e.target.value }))}
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={filters.salary_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, salary_min: e.target.value }))}
                      placeholder="Min"
                    />
                    <Input
                      type="number"
                      value={filters.salary_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, salary_max: e.target.value }))}
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="w-full"
                  >
                    {searchLoading ? 'Searching...' : 'Search Jobs'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {jobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search criteria or check back later.
                  </p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl hover:text-blue-600">
                            <Link href={`/jobs/${job.id}`}>
                              {job.title}
                            </Link>
                          </CardTitle>
                          <CardDescription>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="font-medium text-gray-900">
                                {job.company_profiles.company_name}
                              </span>
                              <span>•</span>
                              <span>{job.location || 'Remote'}</span>
                              <span>•</span>
                              <span>{job.work_style.replace('_', ' ')}</span>
                            </div>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {new Date(job.created_at).toLocaleDateString()}
                          </div>
                          {job.salary_min && job.salary_max && (
                            <div className="text-sm font-medium text-green-600">
                              {job.salary_currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.job_type.replace('_', ' ')}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.work_style.replace('_', ' ')}
                        </span>
                        {job.job_categories && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {job.job_categories.name}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {job.company_profiles.company_size} employees
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {job.company_profiles.industry}
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/jobs/${job.id}`}>
                            <Button size="sm">View Details</Button>
                          </Link>
                          {profile?.user_type === 'individual' && (
                            <Button size="sm" variant="outline">
                              Apply Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Load More Button */}
                <div className="text-center py-6">
                  <Button variant="outline" onClick={handleSearch}>
                    Load More Jobs
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}