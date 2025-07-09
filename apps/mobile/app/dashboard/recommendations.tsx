import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@job-board/shared'
import { jobService, applicationService, individualProfileService, userSkillService } from '@job-board/database'
import { getJobRecommendations, type JobRecommendation } from '@job-board/ai'

export default function RecommendationsScreen() {
  const { profile, user } = useAuthStore()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadRecommendations = async () => {
    if (!user || !profile || profile.user_type !== 'individual') return

    try {
      setLoading(true)
      setError('')
      
      // Load user's full profile data
      const [individualProfileData, userSkillsData, jobsData] = await Promise.all([
        individualProfileService.getById(user.id),
        userSkillService.getByUser(user.id),
        jobService.search({ limit: 50 })
      ])

      if (individualProfileData.error || jobsData.error) {
        throw new Error('Failed to load profile or jobs data')
      }

      const candidateProfile = {
        ...individualProfileData.data,
        user_profiles: profile
      }

      const userSkills = userSkillsData.data?.map(us => (us as any).skills?.name || 'Unknown') || []
      const availableJobs = jobsData.data || []

      // Get AI-powered recommendations
      const aiRecommendations = await getJobRecommendations({
        candidateProfile,
        availableJobs: availableJobs as any,
        userSkills,
        limit: 10
      })

      setRecommendations(aiRecommendations)
    } catch (error: any) {
      console.error('Error loading recommendations:', error)
      setError(error.message || 'Failed to load job recommendations')
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadRecommendations()
    setRefreshing(false)
  }

  const handleApply = async (jobId: string) => {
    if (!user || !profile) return

    try {
      await applicationService.create({
        job_id: jobId,
        candidate_id: profile.id,
        cover_letter: null,
        status: 'applied'
      })

      Alert.alert('Success', 'Application submitted successfully!')
      
      // Remove from recommendations after applying
      setRecommendations(prev => prev.filter(rec => rec.job.id !== jobId))
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit application')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [user, profile])

  if (profile?.user_type !== 'individual') {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Job recommendations are only available for job seekers.</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></View>
        <Text className="mt-4 text-gray-600">Analyzing jobs and generating recommendations...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">AI Job Recommendations</Text>
        <Text className="text-gray-600 mt-1">
          Personalized matches based on your skills and experience
        </Text>
      </View>

      {error && (
        <View className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <Text className="text-red-600">{error}</Text>
        </View>
      )}

      <ScrollView 
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {recommendations.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-6xl mb-4">🎯</Text>
            <Text className="text-lg font-medium text-gray-900 mb-2">No recommendations available</Text>
            <Text className="text-gray-500 text-center mb-6">
              {error 
                ? 'We couldn\'t generate recommendations at this time. Please try again later.'
                : 'Complete your profile and add skills to get personalized job recommendations.'
              }
            </Text>
            <TouchableOpacity
              className="bg-blue-600 px-6 py-3 rounded-lg"
              onPress={() => router.push('/dashboard/profile')}
            >
              <Text className="text-white font-medium">Complete Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            {/* Summary */}
            <View className="bg-white p-4 rounded-lg shadow-sm">
              <View className="flex-row items-center mb-3">
                <Text className="text-lg font-semibold text-gray-900">🤖 AI Analysis Summary</Text>
              </View>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-600">
                    {recommendations.filter(r => r.priority === 'high').length}
                  </Text>
                  <Text className="text-sm text-gray-600">High Priority</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-yellow-600">
                    {recommendations.filter(r => r.priority === 'medium').length}
                  </Text>
                  <Text className="text-sm text-gray-600">Medium Priority</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600">
                    {Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)}%
                  </Text>
                  <Text className="text-sm text-gray-600">Avg Match</Text>
                </View>
              </View>
            </View>

            {/* Recommendations */}
            {recommendations.map((recommendation, index) => (
              <View key={recommendation.job.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Match rank badge */}
                <View className="absolute top-3 left-3 z-10">
                  <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                    <Text className="text-white text-sm font-bold">#{index + 1}</Text>
                  </View>
                </View>

                <View className="p-4 pt-12">
                  {/* Header */}
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 pr-4">
                      <TouchableOpacity
                        onPress={() => router.push(`/jobs/${recommendation.job.id}`)}
                      >
                        <Text className="text-lg font-semibold text-blue-600 mb-1">
                          {recommendation.job.title}
                        </Text>
                      </TouchableOpacity>
                      <Text className="text-gray-700 font-medium">
                        {recommendation.job.company_profiles.company_name}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {recommendation.job.location || 'Remote'} • {recommendation.job.work_style.replace('_', ' ')}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-2xl font-bold text-blue-600">
                        {recommendation.matchScore}%
                      </Text>
                      <Text className="text-xs text-gray-500">match</Text>
                    </View>
                  </View>

                  {/* Priority Badge */}
                  <View className="mb-3">
                    <View className={`self-start px-3 py-1 rounded-full ${getPriorityColor(recommendation.priority)}`}>
                      <Text className="text-xs font-medium">{recommendation.priority} priority</Text>
                    </View>
                  </View>

                  {/* AI Analysis */}
                  <View className="mb-4">
                    <Text className="font-medium text-gray-900 mb-2">🧠 AI Analysis</Text>
                    <View className="bg-blue-50 p-3 rounded-lg">
                      <Text className="text-gray-700 text-sm">
                        {recommendation.reasoning}
                      </Text>
                    </View>
                  </View>

                  {/* Skills Match */}
                  <View className="mb-4">
                    <Text className="font-medium text-gray-900 mb-2">🛠️ Skills Analysis</Text>
                    {recommendation.skillsMatch.matching.length > 0 && (
                      <View className="mb-2">
                        <Text className="text-sm font-medium text-green-700 mb-1">
                          ✅ Matching Skills ({recommendation.skillsMatch.matching.length})
                        </Text>
                        <View className="flex-row flex-wrap">
                          {recommendation.skillsMatch.matching.slice(0, 3).map((skill, idx) => (
                            <View key={idx} className="bg-green-100 px-2 py-1 rounded text-xs mr-1 mb-1">
                              <Text className="text-green-800">{skill}</Text>
                            </View>
                          ))}
                          {recommendation.skillsMatch.matching.length > 3 && (
                            <View className="bg-gray-100 px-2 py-1 rounded text-xs">
                              <Text className="text-gray-800">+{recommendation.skillsMatch.matching.length - 3} more</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Job Details */}
                  <View className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-sm text-gray-600">Experience:</Text>
                      <Text className="text-sm font-medium text-gray-900">
                        {recommendation.job.experience_level.replace('_', ' ')}
                      </Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-sm text-gray-600">Type:</Text>
                      <Text className="text-sm font-medium text-gray-900">
                        {recommendation.job.job_type.replace('_', ' ')}
                      </Text>
                    </View>
                    {recommendation.job.salary_min && recommendation.job.salary_max && (
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-gray-600">Salary:</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {recommendation.job.salary_currency} {recommendation.job.salary_min.toLocaleString()}-{recommendation.job.salary_max.toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Actions */}
                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      onPress={() => router.push(`/jobs/${recommendation.job.id}`)}
                      className="flex-1 bg-white border border-gray-300 py-3 rounded-lg"
                    >
                      <Text className="text-gray-700 font-medium text-center">View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleApply(recommendation.job.id)}
                      className="flex-1 bg-blue-600 py-3 rounded-lg"
                    >
                      <Text className="text-white font-medium text-center">Apply Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}