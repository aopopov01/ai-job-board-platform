import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@job-board/database'
import { logger, toError } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  if (error) {
    logger.error('OAuth error', { error, errorDescription })
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    )
  }

  if (code) {
    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        logger.error('Error exchanging code for session', {}, exchangeError)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
        )
      }

      if (data?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') {
            logger.error('Error fetching profile', {}, profileError)
          }

          if (!profile) {
            return NextResponse.redirect(new URL('/auth/setup', request.url))
          }

          return NextResponse.redirect(new URL('/dashboard', request.url))
        } catch (profileError) {
          logger.error('Error checking profile', {}, toError(profileError))
          return NextResponse.redirect(new URL('/auth/setup', request.url))
        }
      }
    } catch (error) {
      logger.error('Unexpected error during OAuth callback', {}, toError(error))
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
      )
    }
  }

  return NextResponse.redirect(new URL('/auth/login', request.url))
}