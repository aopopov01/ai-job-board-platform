import { NextRequest, NextResponse } from 'next/server'
import { mfaService } from '../../../../../packages/auth/mfa'

export async function POST(request: NextRequest) {
  try {
    // TODO: Get user ID from session/authentication
    const userId = 'user-id-placeholder' // Replace with actual user ID extraction
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if MFA is already enabled
    const isEnabled = await mfaService.isMFAEnabled(userId)
    if (isEnabled) {
      return NextResponse.json(
        { error: 'MFA is already enabled for this account' },
        { status: 400 }
      )
    }

    // Enable MFA and get setup details
    const setup = await mfaService.enableMFA(userId)

    return NextResponse.json({
      userId: setup.userId,
      secret: setup.secret,
      qrCodeUrl: setup.qrCodeUrl,
      backupCodes: setup.backupCodes,
      isEnabled: false // Will be enabled after verification
    })
  } catch (error) {
    console.error('MFA setup API error:', error)
    return NextResponse.json(
      { error: 'Failed to setup MFA' },
      { status: 500 }
    )
  }
}