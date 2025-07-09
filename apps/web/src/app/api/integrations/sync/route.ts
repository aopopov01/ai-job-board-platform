import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { IntegrationUtils } from '@/integrations/index'

export async function POST(req: NextRequest) {
  try {
    const { integrationType } = await req.json()
    
    // Get the authenticated user
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sync the integration
    await IntegrationUtils.syncIntegration(user.id, integrationType)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Integration sync failed:', error)
    return NextResponse.json(
      { error: 'Sync failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get integration status
    const status = await IntegrationUtils.getIntegrationStatus(user.id)

    return NextResponse.json({ integrations: status })
  } catch (error) {
    console.error('Integration status fetch failed:', error)
    return NextResponse.json(
      { error: 'Status fetch failed' },
      { status: 500 }
    )
  }
}