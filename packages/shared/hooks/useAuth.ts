import { useEffect } from 'react'
import { supabase, userProfileService } from '@job-board/database'
import { useAuthStore, useAuthActions } from '../stores/auth'

export const useAuthListener = () => {
  const { setUser, setSession, setProfile, setLoading, setInitialized } = useAuthActions()

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)

          if (session?.user) {
            // Fetch user profile
            try {
              const { data: profile } = await userProfileService.getById(session.user.id)
              if (mounted && profile) {
                setProfile(profile)
              }
            } catch (profileError) {
              console.error('Error fetching profile:', profileError)
            }
          }

          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.id)

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch user profile when user signs in
          try {
            const { data: profile } = await userProfileService.getById(session.user.id)
            if (mounted && profile) {
              setProfile(profile)
            }
          } catch (profileError) {
            console.error('Error fetching profile after auth change:', profileError)
          }
        } else {
          // Clear profile when user signs out
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setUser, setSession, setProfile, setLoading, setInitialized])
}

export const useSignIn = () => {
  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  const signInWithLinkedIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  return {
    signInWithEmail,
    signInWithGoogle,
    signInWithLinkedIn,
    signInWithGitHub
  }
}

export const useSignUp = () => {
  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) throw error
    return data
  }

  return {
    signUpWithEmail
  }
}

export const useSignOut = () => {
  const { signOut: clearAuthState } = useAuthActions()

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    clearAuthState()
  }

  return signOut
}
