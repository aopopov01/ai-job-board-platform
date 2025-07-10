import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase'
import { IntegrationUtils } from '@/integrations/index'

export async function POST(req: NextRequest) {
  try {
    const { integrationType } = await req.json()
    
    // Get the authenticated user
    const supabase = createSupabaseRouteHandlerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get OAuth URL
    const oauthUrl = await IntegrationUtils.getOAuthUrl(integrationType, user.id)

    return NextResponse.json({ oauthUrl })
  } catch (error) {
    console.error('Integration connect failed:', error)
    return NextResponse.json(
      { error: 'Connect failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const integrationType = searchParams.get('type')
    
    if (!integrationType) {
      return NextResponse.json({ error: 'Integration type required' }, { status: 400 })
    }

    // Get the authenticated user
    const supabase = createSupabaseRouteHandlerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Disconnect integration
    await IntegrationUtils.disconnectIntegration(user.id, integrationType as any)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Integration disconnect failed:', error)
    return NextResponse.json(
      { error: 'Disconnect failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}