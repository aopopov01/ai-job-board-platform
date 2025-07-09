import { NextRequest, NextResponse } from 'next/server'
import { mfaService } from '../../../../../packages/auth/mfa'

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
        { error: 'MFA code required to regenerate backup codes' },
        { status: 400 }
      )
    }

    // Verify the token before regenerating codes
    const isValid = await mfaService.verifyMFAToken(userId, token)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid MFA code' },
        { status: 400 }
      )
    }

    // Regenerate backup codes
    const newBackupCodes = await mfaService.regenerateBackupCodes(userId)

    return NextResponse.json({
      success: true,
      backupCodes: newBackupCodes,
      message: 'New backup codes generated successfully'
    })
  } catch (error) {
    console.error('Regenerate backup codes API error:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate backup codes' },
      { status: 500 }
    )
  }
}