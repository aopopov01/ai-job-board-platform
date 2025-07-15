import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  email: string
  user_type: 'individual' | 'company' | 'admin'
  first_name?: string
  last_name?: string
  profile_picture_url?: string
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  isInitialized: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  signOut: () => void
  reset: () => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false
}

const createAuthStore = () => {
  const store = (set: any, get: any) => ({
    ...initialState,

    setUser: (user: User | null) => set({ user }),
    
    setSession: (session: Session | null) => set({ session }),
    
    setProfile: (profile: UserProfile | null) => set({ profile }),
    
    setLoading: (isLoading: boolean) => set({ isLoading }),
    
    setInitialized: (isInitialized: boolean) => set({ isInitialized }),
    
    signOut: () => set({
      user: null,
      session: null,
      profile: null,
      isLoading: false
    }),
    
    reset: () => set(initialState)
  })

  return store
}

export const useAuthStore = create<AuthStore>()(createAuthStore())

// Selectors for easier component usage
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  session: state.session,
  profile: state.profile,
  isLoading: state.isLoading,
  isInitialized: state.isInitialized,
  isAuthenticated: !!state.user,
  isIndividual: state.profile?.user_type === 'individual',
  isCompany: state.profile?.user_type === 'company',
  isAdmin: state.profile?.user_type === 'admin'
}))

export const useAuthActions = () => useAuthStore((state) => ({
  setUser: state.setUser,
  setSession: state.setSession,
  setProfile: state.setProfile,
  setLoading: state.setLoading,
  setInitialized: state.setInitialized,
  signOut: state.signOut,
  reset: state.reset
}))

export type { UserProfile }