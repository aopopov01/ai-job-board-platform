import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSignUp, USER_TYPES } from '@job-board/shared'

export default function RegisterScreen() {
  const [userType, setUserType] = useState<'individual' | 'company'>('individual')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signUpWithEmail } = useSignUp()

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await signUpWithEmail(email, password, {
        user_type: userType,
        setup_completed: false
      })
      router.replace('/auth/setup')
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center px-6 py-12">
        <View className="bg-white rounded-lg shadow-lg p-6">
          <Text className="text-2xl font-bold text-center text-gray-900 mb-2">
            Create your account
          </Text>
          <Text className="text-center text-gray-600 mb-8">
            Join our platform and discover amazing opportunities
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                I am a
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className={`flex-1 p-3 border rounded-md ${
                    userType === 'individual'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => setUserType('individual')}
                  disabled={loading}
                >
                  <Text
                    className={`text-center text-sm font-medium ${
                      userType === 'individual' ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    Job Seeker
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-3 border rounded-md ${
                    userType === 'company'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => setUserType('company')}
                  disabled={loading}
                >
                  <Text
                    className={`text-center text-sm font-medium ${
                      userType === 'company' ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    Employer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

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
                placeholder="Password (min 8 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base"
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              className={`w-full py-3 rounded-md ${
                loading ? 'bg-gray-400' : 'bg-blue-600'
              }`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-center font-medium text-base">
                {loading ? 'Creating account...' : 'Create account'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Text className="text-blue-600 font-medium">Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-gray-500 text-center mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}