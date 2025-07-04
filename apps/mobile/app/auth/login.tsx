import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSignIn } from '@job-board/shared'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signInWithEmail, signInWithGoogle, signInWithLinkedIn, signInWithGitHub } = useSignIn()

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await signInWithEmail(email, password)
      router.replace('/dashboard')
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'linkedin' | 'github') => {
    setLoading(true)
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle()
          break
        case 'linkedin':
          await signInWithLinkedIn()
          break
        case 'github':
          await signInWithGitHub()
          break
      }
      router.replace('/dashboard')
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6 py-12">
        <View className="bg-white rounded-lg shadow-lg p-6">
          <Text className="text-2xl font-bold text-center text-gray-900 mb-2">
            Sign in to your account
          </Text>
          <Text className="text-center text-gray-600 mb-8">
            Enter your email and password to access your account
          </Text>

          <View className="space-y-4">
            <View>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              className={`w-full py-3 rounded-md ${
                loading ? 'bg-gray-400' : 'bg-blue-600'
              }`}
              onPress={handleEmailSignIn}
              disabled={loading}
            >
              <Text className="text-white text-center font-medium text-base">
                {loading ? 'Signing in...' : 'Sign in'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="my-6 flex-row items-center">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">Or continue with</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <View className="space-y-3">
            <TouchableOpacity
              className="w-full py-3 border border-gray-300 rounded-md flex-row items-center justify-center"
              onPress={() => handleSocialSignIn('google')}
              disabled={loading}
            >
              <Text className="text-gray-700 font-medium text-base ml-2">
                Sign in with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full py-3 border border-gray-300 rounded-md flex-row items-center justify-center"
              onPress={() => handleSocialSignIn('linkedin')}
              disabled={loading}
            >
              <Text className="text-gray-700 font-medium text-base ml-2">
                Sign in with LinkedIn
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full py-3 border border-gray-300 rounded-md flex-row items-center justify-center"
              onPress={() => handleSocialSignIn('github')}
              disabled={loading}
            >
              <Text className="text-gray-700 font-medium text-base ml-2">
                Sign in with GitHub
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Text className="text-blue-600 font-medium">Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}