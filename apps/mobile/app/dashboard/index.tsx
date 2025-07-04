import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore, useSignOut } from '@job-board/shared'
import { jobService, applicationService } from '@job-board/database'

export default function DashboardScreen() {
  const { profile, user } = useAuthStore()
  const router = useRouter()
  const signOut = useSignOut()
  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    activeJobs: 0,
    pendingApplications: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login')
      return
    }

    if (!profile) {
      router.replace('/auth/setup')
      return
    }

    loadStats()
  }, [user, profile])

  const loadStats = async () => {
    if (!profile) return

    try {
      if (profile.user_type === 'company') {
        const { data: jobs } = await jobService.getByCompany(profile.id)
        const activeJobs = jobs?.filter(job => job.status === 'active').length || 0
        const totalApplications = jobs?.reduce((sum, job) => sum + (job.applications?.length || 0), 0) || 0
        const pendingApplications = jobs?.reduce((sum, job) => 
          sum + (job.applications?.filter(app => app.status === 'applied').length || 0), 0) || 0

        setStats({
          jobs: jobs?.length || 0,
          applications: totalApplications,
          activeJobs,
          pendingApplications
        })
      } else if (profile.user_type === 'individual') {
        const { data: applications } = await applicationService.getByCandidate(profile.id)
        const pendingApplications = applications?.filter(app => 
          ['applied', 'screening'].includes(app.status || '')).length || 0

        setStats({
          jobs: 0,
          applications: applications?.length || 0,
          activeJobs: 0,
          pendingApplications
        })
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut()
              router.replace('/')
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out')
            }
          }
        }
      ]
    )
  }

  if (!profile) return null

  const isCompany = profile.user_type === 'company'
  const isIndividual = profile.user_type === 'individual'

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-8 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Welcome back, {profile.first_name}!
            </Text>
            <Text className="text-gray-600 mt-1">
              {isCompany ? 'Manage your hiring process' : 'Track your job search'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-gray-100 px-4 py-2 rounded-md"
          >
            <Text className="text-gray-700 font-medium">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-6 py-6">
        {/* Stats Overview */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Overview</Text>
          <View className="flex-row flex-wrap">
            {isCompany && (
              <>
                <View className="w-1/2 pr-2 mb-4">
                  <View className="bg-white p-4 rounded-lg shadow-sm">
                    <Text className="text-2xl font-bold text-blue-600">
                      {loading ? '...' : stats.jobs}
                    </Text>
                    <Text className="text-gray-600 text-sm">Total Jobs</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {stats.activeJobs} active
                    </Text>
                  </View>
                </View>
                
                <View className="w-1/2 pl-2 mb-4">
                  <View className="bg-white p-4 rounded-lg shadow-sm">
                    <Text className="text-2xl font-bold text-green-600">
                      {loading ? '...' : stats.applications}
                    </Text>
                    <Text className="text-gray-600 text-sm">Applications</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {stats.pendingApplications} pending
                    </Text>
                  </View>
                </View>
              </>
            )}

            {isIndividual && (
              <>
                <View className="w-1/2 pr-2 mb-4">
                  <View className="bg-white p-4 rounded-lg shadow-sm">
                    <Text className="text-2xl font-bold text-blue-600">
                      {loading ? '...' : stats.applications}
                    </Text>
                    <Text className="text-gray-600 text-sm">Applications</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {stats.pendingApplications} pending
                    </Text>
                  </View>
                </View>

                <View className="w-1/2 pl-2 mb-4">
                  <View className="bg-white p-4 rounded-lg shadow-sm">
                    <Text className="text-2xl font-bold text-gray-400">--</Text>
                    <Text className="text-gray-600 text-sm">Profile Views</Text>
                    <Text className="text-xs text-gray-500 mt-1">Coming soon</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
          <View className="space-y-3">
            {isCompany && (
              <>
                <TouchableOpacity
                  className="bg-blue-600 p-4 rounded-lg flex-row items-center"
                  onPress={() => router.push('/dashboard/jobs/new')}
                >
                  <Text className="text-white font-medium text-base ml-2">
                    ➕ Post New Job
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="bg-white border border-gray-300 p-4 rounded-lg flex-row items-center"
                  onPress={() => router.push('/dashboard/jobs')}
                >
                  <Text className="text-gray-700 font-medium text-base ml-2">
                    💼 Manage Jobs
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="bg-white border border-gray-300 p-4 rounded-lg flex-row items-center"
                  onPress={() => router.push('/dashboard/applications')}
                >
                  <Text className="text-gray-700 font-medium text-base ml-2">
                    📋 Review Applications
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {isIndividual && (
              <>
                <TouchableOpacity
                  className="bg-blue-600 p-4 rounded-lg flex-row items-center"
                  onPress={() => router.push('/jobs')}
                >
                  <Text className="text-white font-medium text-base ml-2">
                    🔍 Search Jobs
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="bg-white border border-gray-300 p-4 rounded-lg flex-row items-center"
                  onPress={() => router.push('/dashboard/applications')}
                >
                  <Text className="text-gray-700 font-medium text-base ml-2">
                    📋 My Applications
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="bg-white border border-gray-300 p-4 rounded-lg flex-row items-center"
                  onPress={() => router.push('/dashboard/profile')}
                >
                  <Text className="text-gray-700 font-medium text-base ml-2">
                    👤 Update Profile
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Getting Started Guide */}
        <View className="bg-white p-6 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            {isCompany ? 'Get Started with Hiring' : 'Find Your Dream Job'}
          </Text>
          <View className="space-y-3">
            {isCompany ? (
              <>
                <View className="flex-row items-center space-x-3">
                  <View className="w-6 h-6 bg-blue-600 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">1</Text>
                  </View>
                  <Text className="text-gray-700">Complete your company profile</Text>
                </View>
                <View className="flex-row items-center space-x-3">
                  <View className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">2</Text>
                  </View>
                  <Text className="text-gray-700">Post your first job</Text>
                </View>
                <View className="flex-row items-center space-x-3">
                  <View className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">3</Text>
                  </View>
                  <Text className="text-gray-700">Review applications</Text>
                </View>
              </>
            ) : (
              <>
                <View className="flex-row items-center space-x-3">
                  <View className="w-6 h-6 bg-blue-600 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">1</Text>
                  </View>
                  <Text className="text-gray-700">Complete your profile</Text>
                </View>
                <View className="flex-row items-center space-x-3">
                  <View className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">2</Text>
                  </View>
                  <Text className="text-gray-700">Upload your CV</Text>
                </View>
                <View className="flex-row items-center space-x-3">
                  <View className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">3</Text>
                  </View>
                  <Text className="text-gray-700">Start applying to jobs</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}