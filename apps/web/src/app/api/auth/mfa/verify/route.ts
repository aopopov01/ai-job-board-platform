import { NextRequest, NextResponse } from 'next/server'
import { mfaService } from '@/auth/mfa'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    // TODO: Get user ID from session/authentication
    const userId = 'user-id-placeholder' // Replace with actual user ID extraction
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!token || token.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid verification code format' },
        { status: 400 }
      )
    }

    // Verify the token and enable MFA
    const success = await mfaService.verifyAndEnableMFA(userId, token)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'MFA has been successfully enabled'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('MFA verification API error:', error)
    return NextResponse.json(
      { error: 'Failed to verify MFA code' },
      { status: 500 }
    )
  }
}