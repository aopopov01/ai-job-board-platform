import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key-for-testing'
)

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alertId = params.id

    // TODO: Add authentication check here
    // const userId = await getUserFromSession(request)
    
    // Update the alert to mark it as resolved
    const { data, error } = await supabase
      .from('security_alerts')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: 'user-id-placeholder' // Replace with actual user ID
      })
      .eq('id', alertId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to resolve alert' },
        { status: 500 }
      )
    }

    // Log the resolution action
    await supabase.from('admin_actions_log').insert({
      admin_user_id: 'user-id-placeholder', // Replace with actual user ID
      action_type: 'resolve_security_alert',
      target_resource: `security_alert:${alertId}`,
      action_details: {
        alert_id: alertId,
        alert_type: data.alert_type,
        severity: data.severity
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown'
    })

    return NextResponse.json({ success: true, alert: data })
  } catch (error) {
    console.error('Resolve alert API error:', error)
    return NextResponse.json(
      { error: 'Failed to resolve alert' },
      { status: 500 }
    )
  }
}