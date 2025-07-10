import { NextRequest, NextResponse } from 'next/server'
import { mfaService } from '@/auth/mfa'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key-for-testing'
)

export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from session/authentication
    const userId = 'user-id-placeholder' // Replace with actual user ID extraction
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if MFA is enabled for the user
    const enabled = await mfaService.isMFAEnabled(userId)
    
    // Get backup codes count
    const { data: backupCodes } = await supabase
      .from('mfa_recovery_codes')
      .select('id')
      .eq('user_id', userId)
      .eq('used', false)
    
    // Get last used date
    const { data: mfaSettings } = await supabase
      .from('user_mfa_settings')
      .select('last_used')
      .eq('user_id', userId)
      .single()

    const status = {
      enabled,
      backupCodesRemaining: backupCodes?.length || 0,
      lastUsed: mfaSettings?.last_used,
      canSetup: !enabled // Can setup if not already enabled
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('MFA status API error:', error)
    return NextResponse.json(
      { error: 'Failed to get MFA status' },
      { status: 500 }
    )
  }
}