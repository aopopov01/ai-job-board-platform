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

    if (!token) {
      return NextResponse.json(
        { error: 'MFA code required to disable' },
        { status: 400 }
      )
    }

    // Verify the token before disabling
    const isValid = await mfaService.verifyMFAToken(userId, token)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid MFA code' },
        { status: 400 }
      )
    }

    // Disable MFA
    await mfaService.disableMFA(userId)

    return NextResponse.json({
      success: true,
      message: 'MFA has been disabled'
    })
  } catch (error) {
    console.error('MFA disable API error:', error)
    return NextResponse.json(
      { error: 'Failed to disable MFA' },
      { status: 500 }
    )
  }
}