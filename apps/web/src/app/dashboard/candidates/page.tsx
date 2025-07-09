'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { individualProfileService, userSkillService, skillService } from '@job-board/database'
import { matchCandidateToJob } from '@job-board/ai'
import MessageCandidateButton from '../../../components/MessageCandidateButton'

interface CandidateProfile {
  id: string
  user_profiles: {
    first_name: string
    last_name: string
    profile_picture_url?: string
    location?: string
    linkedin_url?: string
    github_url?: string
  }
  current_job_title?: string
  years_of_experience?: number
  job_search_status: string
  salary_expectation_min?: number
  salary_expectation_max?: number
  salary_currency?: string
  remote_preference?: string
  skills: Array<{
    name: string
    proficiency_level: string
    years_of_experience?: number
  }>
  match_score?: number
  match_reasons?: string[]
}

interface SearchFilters {
  query: string
  location: string
  skills: string[]
  experience_min: number
  experience_max: number
  remote_preference: string
  job_search_status: string
}

export default function CandidatesPage() {
  const { profile, user } = useAuthStore()
  const [candidates, setCandidates] = useState<CandidateProfile[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateProfile[]>([])
  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    skills: [],
    experience_min: 0,
    experience_max: 20,
    remote_preference: '',
    job_search_status: 'actively_looking'
  })

  useEffect(() => {
    const loadCandidates = async () => {
      if (!user || !profile || profile.user_type !== 'company') return

      try {
        setLoading(true)
        
        // Load all available skills
        const { data: skillsData } = await skillService.getAll()
        setAvailableSkills(skillsData?.map(skill => skill.name) || [])

        // Load candidates who are actively looking
        const { data: candidatesData, error: candidatesError } = await individualProfileService.getByJobSearchStatus('actively_looking')
        
        if (candidatesError) throw candidatesError

        // Get skills for each candidate
        const candidatesWithSkills = await Promise.all(
          (candidatesData || []).map(async (candidate: any) => {
            const { data: skillsData } = await userSkillService.getByUser(candidate.id)
            return {
              ...candidate,
              skills: skillsData?.map((userSkill: any) => ({
                name: userSkill.skills?.name || 'Unknown',
                proficiency_level: userSkill.proficiency_level,
                years_of_experience: userSkill.years_of_experience
              })) || []
            }
          })
        )

        setCandidates(candidatesWithSkills)
        setFilteredCandidates(candidatesWithSkills)
      } catch (error: any) {
        setError(error.message || 'Failed to load candidates')
      } finally {
        setLoading(false)
      }
    }

    loadCandidates()
  }, [user, profile])

  const applyFilters = () => {
    let filtered = candidates.filter(candidate => {
      // Text search
      if (filters.query) {
        const searchText = `${candidate.user_profiles.first_name} ${candidate.user_profiles.last_name} ${candidate.current_job_title || ''}`
        if (!searchText.toLowerCase().includes(filters.query.toLowerCase())) {
          return false
        }
      }

      // Location filter
      if (filters.location && candidate.user_profiles.location) {
        if (!candidate.user_profiles.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false
        }
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const candidateSkills = candidate.skills.map(skill => skill.name.toLowerCase())
        const hasRequiredSkills = filters.skills.some(skill => 
          candidateSkills.includes(skill.toLowerCase())
        )
        if (!hasRequiredSkills) {
          return false
        }
      }

      // Experience filter
      if (candidate.years_of_experience !== undefined) {
        if (candidate.years_of_experience < filters.experience_min || 
            candidate.years_of_experience > filters.experience_max) {
          return false
        }
      }

      // Remote preference filter
      if (filters.remote_preference && candidate.remote_preference !== filters.remote_preference) {
        return false
      }

      // Job search status filter
      if (filters.job_search_status && candidate.job_search_status !== filters.job_search_status) {
        return false
      }

      return true
    })

    setFilteredCandidates(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, candidates])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actively_looking': return 'bg-green-100 text-green-800'
      case 'open_to_opportunities': return 'bg-blue-100 text-blue-800'
      case 'not_looking': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-100 text-purple-800'
      case 'advanced': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'beginner': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (profile?.user_type !== 'company') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Candidate search is only available for company accounts.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Find Candidates</h1>
        <p className="mt-1 text-sm text-gray-600">
          Search and discover talented candidates for your job openings
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
          <CardDescription>
            Use filters to find candidates that match your requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name or Title
              </label>
              <Input
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                placeholder="e.g., John Doe, Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., New York, London"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Range
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={filters.experience_min}
                  onChange={(e) => setFilters(prev => ({ ...prev, experience_min: parseInt(e.target.value) || 0 }))}
                  placeholder="Min"
                />
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={filters.experience_max}
                  onChange={(e) => setFilters(prev => ({ ...prev, experience_max: parseInt(e.target.value) || 20 }))}
                  placeholder="Max"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remote Preference
              </label>
              <select
                value={filters.remote_preference}
                onChange={(e) => setFilters(prev => ({ ...prev, remote_preference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="remote_only">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Search Status
              </label>
              <select
                value={filters.job_search_status}
                onChange={(e) => setFilters(prev => ({ ...prev, job_search_status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="actively_looking">Actively Looking</option>
                <option value="open_to_opportunities">Open to Opportunities</option>
                <option value="not_looking">Not Looking</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredCandidates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search filters or check back later for new candidates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {candidate.user_profiles.profile_picture_url ? (
                        <img
                          src={candidate.user_profiles.profile_picture_url}
                          alt={`${candidate.user_profiles.first_name} ${candidate.user_profiles.last_name}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xl font-medium">
                            {candidate.user_profiles.first_name?.[0]}{candidate.user_profiles.last_name?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {candidate.user_profiles.first_name} {candidate.user_profiles.last_name}
                      </CardTitle>
                      <CardDescription className="text-lg mt-1">
                        {candidate.current_job_title || 'Professional'}
                      </CardDescription>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        {candidate.user_profiles.location && (
                          <span>📍 {candidate.user_profiles.location}</span>
                        )}
                        {candidate.years_of_experience && (
                          <span>⏰ {candidate.years_of_experience} years experience</span>
                        )}
                        {candidate.remote_preference && (
                          <span>💼 {candidate.remote_preference.replace('_', ' ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.job_search_status)}`}>
                      {candidate.job_search_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Skills */}
                  {candidate.skills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency_level)}`}
                          >
                            {skill.name}
                            {skill.proficiency_level && (
                              <span className="ml-1 text-xs opacity-75">
                                ({skill.proficiency_level})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Salary Expectations */}
                  {candidate.salary_expectation_min && candidate.salary_expectation_max && (
                    <div className="bg-green-50 p-3 rounded-md">
                      <h4 className="font-medium text-green-900 mb-1">Salary Expectations</h4>
                      <p className="text-green-800">
                        {candidate.salary_currency || 'USD'} {candidate.salary_expectation_min.toLocaleString()} - {candidate.salary_expectation_max.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* External Links */}
                  <div className="flex space-x-4">
                    {candidate.user_profiles.linkedin_url && (
                      <a
                        href={candidate.user_profiles.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        LinkedIn Profile →
                      </a>
                    )}
                    {candidate.user_profiles.github_url && (
                      <a
                        href={candidate.user_profiles.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-700 text-sm"
                      >
                        GitHub Profile →
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-4 border-t">
                    <MessageCandidateButton
                      candidateId={candidate.id}
                      candidateName={`${candidate.user_profiles.first_name} ${candidate.user_profiles.last_name}`}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" className="flex-1">
                      View Full Profile
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Save Candidate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}