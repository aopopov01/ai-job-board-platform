import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile } from '@job-board/database'

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

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      
      setSession: (session) => set({ session }),
      
      setProfile: (profile) => set({ profile }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setInitialized: (isInitialized) => set({ isInitialized }),
      
      signOut: () => set({
        user: null,
        session: null,
        profile: null,
        isLoading: false
      }),
      
      reset: () => set(initialState)
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile
      })
    }
  )
)

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
