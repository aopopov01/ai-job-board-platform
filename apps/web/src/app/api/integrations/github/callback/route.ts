import { NextRequest, NextResponse } from 'next/server'
import { IntegrationUtils } from '@/integrations/index'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard/integrations?error=${encodeURIComponent(error)}`, req.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=missing_parameters', req.url)
      )
    }

    // Handle OAuth callback
    await IntegrationUtils.handleOAuthCallback('github', code, state)

    return NextResponse.redirect(
      new URL('/dashboard/integrations?success=github_connected', req.url)
    )
  } catch (error) {
    console.error('GitHub OAuth callback failed:', error)
    return NextResponse.redirect(
      new URL(`/dashboard/integrations?error=${encodeURIComponent('connection_failed')}`, req.url)
    )
  }
}