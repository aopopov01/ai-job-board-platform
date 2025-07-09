import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { TestUtils, mockUser, mockProfile } from '@job-board/testing'
import { useAuthStore } from '../authStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      profile: null,
      session: null,
      loading: false,
      error: null
    })
    
    vi.clearAllMocks()
  })

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useAuthStore())
    
    expect(result.current.user).toBeNull()
    expect(result.current.profile).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets user and profile correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setUser(mockUser)
      result.current.setProfile(mockProfile)
    })
    
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.profile).toEqual(mockProfile)
  })

  it('handles loading state correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setLoading(true)
    })
    
    expect(result.current.loading).toBe(true)
    
    act(() => {
      result.current.setLoading(false)
    })
    
    expect(result.current.loading).toBe(false)
  })

  it('handles error state correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    const errorMessage = 'Authentication failed'
    
    act(() => {
      result.current.setError(errorMessage)
    })
    
    expect(result.current.error).toBe(errorMessage)
    
    act(() => {
      result.current.clearError()
    })
    
    expect(result.current.error).toBeNull()
  })

  it('clears all data on logout', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Set some data first
    act(() => {
      result.current.setUser(mockUser)
      result.current.setProfile(mockProfile)
      result.current.setSession({ access_token: 'token', refresh_token: 'refresh' })
    })
    
    // Verify data is set
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.session).toBeTruthy()
    
    // Clear all data
    act(() => {
      result.current.clearAuth()
    })
    
    // Verify data is cleared
    expect(result.current.user).toBeNull()
    expect(result.current.profile).toBeNull()
    expect(result.current.session).toBeNull()
  })

  it('checks authentication status correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Initially not authenticated
    expect(result.current.isAuthenticated).toBe(false)
    
    // Set user
    act(() => {
      result.current.setUser(mockUser)
    })
    
    // Now authenticated
    expect(result.current.isAuthenticated).toBe(true)
    
    // Clear user
    act(() => {
      result.current.setUser(null)
    })
    
    // Not authenticated again
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('determines user type correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // No user type initially
    expect(result.current.userType).toBeNull()
    
    // Set individual profile
    act(() => {
      result.current.setProfile({ ...mockProfile, user_type: 'individual' })
    })
    
    expect(result.current.userType).toBe('individual')
    
    // Set company profile
    act(() => {
      result.current.setProfile({ ...mockProfile, user_type: 'company' })
    })
    
    expect(result.current.userType).toBe('company')
  })

  it('handles session updates correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    const session = { access_token: 'token', refresh_token: 'refresh' }
    
    act(() => {
      result.current.setSession(session)
    })
    
    expect(result.current.session).toEqual(session)
  })

  it('persists state across re-renders', () => {
    const { result, rerender } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setUser(mockUser)
      result.current.setProfile(mockProfile)
    })
    
    rerender()
    
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.profile).toEqual(mockProfile)
  })

  it('handles concurrent state updates correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setUser(mockUser)
      result.current.setProfile(mockProfile)
      result.current.setLoading(true)
      result.current.setError('Test error')
    })
    
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe('Test error')
  })

  it('handles subscription plan correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setProfile({
        ...mockProfile,
        subscription_plan: 'individual_premium'
      })
    })
    
    expect(result.current.profile?.subscription_plan).toBe('individual_premium')
  })

  it('handles profile updates correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Set initial profile
    act(() => {
      result.current.setProfile(mockProfile)
    })
    
    // Update profile
    const updatedProfile = {
      ...mockProfile,
      first_name: 'Updated',
      last_name: 'Name'
    }
    
    act(() => {
      result.current.setProfile(updatedProfile)
    })
    
    expect(result.current.profile?.first_name).toBe('Updated')
    expect(result.current.profile?.last_name).toBe('Name')
  })

  it('handles multiple subscribers correctly', () => {
    const { result: result1 } = renderHook(() => useAuthStore())
    const { result: result2 } = renderHook(() => useAuthStore())
    
    // Update from first subscriber
    act(() => {
      result1.current.setUser(mockUser)
    })
    
    // Both subscribers should have the same state
    expect(result1.current.user).toEqual(mockUser)
    expect(result2.current.user).toEqual(mockUser)
    
    // Update from second subscriber
    act(() => {
      result2.current.setProfile(mockProfile)
    })
    
    // Both subscribers should have the updated state
    expect(result1.current.profile).toEqual(mockProfile)
    expect(result2.current.profile).toEqual(mockProfile)
  })

  it('handles error clearing correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Set error
    act(() => {
      result.current.setError('Test error')
    })
    
    expect(result.current.error).toBe('Test error')
    
    // Clear error
    act(() => {
      result.current.clearError()
    })
    
    expect(result.current.error).toBeNull()
  })

  it('handles null user correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Set user first
    act(() => {
      result.current.setUser(mockUser)
    })
    
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
    
    // Set user to null
    act(() => {
      result.current.setUser(null)
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})

describe('useAuthStore Performance', () => {
  it('updates state efficiently', () => {
    const { result } = renderHook(() => useAuthStore())
    
    const updateTime = TestUtils.measurePerformance(() => {
      act(() => {
        result.current.setUser(mockUser)
        result.current.setProfile(mockProfile)
        result.current.setLoading(true)
        result.current.setError('Test error')
      })
    })
    
    // Should update within 10ms
    expect(updateTime).toBeLessThan(10)
  })

  it('handles many subscribers efficiently', () => {
    const subscribers = Array.from({ length: 100 }, () => renderHook(() => useAuthStore()))
    
    const updateTime = TestUtils.measurePerformance(() => {
      act(() => {
        subscribers[0].result.current.setUser(mockUser)
      })
    })
    
    // Should update all subscribers within 50ms
    expect(updateTime).toBeLessThan(50)
    
    // All subscribers should have the same state
    subscribers.forEach(({ result }) => {
      expect(result.current.user).toEqual(mockUser)
    })
  })
})

describe('useAuthStore Edge Cases', () => {
  it('handles undefined values gracefully', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.setUser(undefined as any)
      result.current.setProfile(undefined as any)
    })
    
    expect(result.current.user).toBeUndefined()
    expect(result.current.profile).toBeUndefined()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('handles invalid user objects gracefully', () => {
    const { result } = renderHook(() => useAuthStore())
    const invalidUser = { invalid: 'user' } as any
    
    act(() => {
      result.current.setUser(invalidUser)
    })
    
    expect(result.current.user).toEqual(invalidUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('handles rapid state changes', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Perform rapid state changes
    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.setLoading(i % 2 === 0)
        result.current.setError(i % 3 === 0 ? `Error ${i}` : null)
      }
    })
    
    // Should end up with final state
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Error 99')
  })

  it('handles store reset correctly', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Set all possible state
    act(() => {
      result.current.setUser(mockUser)
      result.current.setProfile(mockProfile)
      result.current.setSession({ access_token: 'token', refresh_token: 'refresh' })
      result.current.setLoading(true)
      result.current.setError('Test error')
    })
    
    // Reset store
    act(() => {
      useAuthStore.setState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        error: null
      })
    })
    
    // Verify reset
    expect(result.current.user).toBeNull()
    expect(result.current.profile).toBeNull()
    expect(result.current.session).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})