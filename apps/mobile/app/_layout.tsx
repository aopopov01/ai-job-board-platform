import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useAuthListener } from '@job-board/shared'

export default function RootLayout() {
  // Initialize auth listener
  useAuthListener()

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="auth/setup" />
      <Stack.Screen name="dashboard/index" />
      <Stack.Screen name="jobs/index" />
    </Stack>
  )
}
