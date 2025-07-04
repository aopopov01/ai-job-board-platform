import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@job-board/shared'

export default function App() {
  const { user, profile, initialized, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (initialized && !loading) {
      if (user && profile) {
        router.replace('/dashboard')
      }
    }
  }, [user, profile, initialized, loading])

  if (loading || !initialized) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <View className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></View>
        <Text className="mt-4 text-gray-600">Loading...</Text>
        <StatusBar style="auto" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-white">
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo/Icon */}
        <View className="mb-8">
          <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">JB</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 text-center">
            Job Board Platform
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            AI-powered job matching for the modern workforce
          </Text>
        </View>

        {/* Features */}
        <View className="mb-12 space-y-4">
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-blue-600 rounded-full mr-3"></View>
            <Text className="text-gray-700">Find jobs with AI-powered matching</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-blue-600 rounded-full mr-3"></View>
            <Text className="text-gray-700">Connect with top employers</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-blue-600 rounded-full mr-3"></View>
            <Text className="text-gray-700">Track your applications</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          <TouchableOpacity
            className="w-full bg-blue-600 py-4 rounded-lg"
            onPress={() => router.push('/auth/register')}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full border border-blue-600 py-4 rounded-lg"
            onPress={() => router.push('/auth/login')}
          >
            <Text className="text-blue-600 text-center font-semibold text-lg">
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full py-4"
            onPress={() => router.push('/jobs')}
          >
            <Text className="text-gray-600 text-center">
              Browse jobs without account
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 px-8">
        <Text className="text-center text-xs text-gray-500">
          By using this app, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
      
      <StatusBar style="auto" />
    </View>
  )
}
