import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key-for-testing'
)

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    
    // CSP reports can come as JSON or form-encoded
    let reportData
    if (contentType?.includes('application/json')) {
      reportData = await request.json()
    } else if (contentType?.includes('application/csp-report')) {
      reportData = await request.json()
    } else {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    // Extract CSP violation details
    const cspReport = reportData['csp-report'] || reportData
    
    if (!cspReport) {
      return NextResponse.json({ error: 'Invalid CSP report format' }, { status: 400 })
    }

    // Store the violation in the database
    await supabase.from('csp_violations').insert({
      document_uri: cspReport['document-uri'] || '',
      blocked_uri: cspReport['blocked-uri'] || '',
      violated_directive: cspReport['violated-directive'] || '',
      original_policy: cspReport['original-policy'] || '',
      source_file: cspReport['source-file'] || '',
      line_number: cspReport['line-number'] || null,
      column_number: cspReport['column-number'] || null,
      status_code: cspReport['status-code'] || null,
      referrer: cspReport.referrer || '',
      user_agent: request.headers.get('user-agent') || '',
      ip_address: request.headers.get('x-forwarded-for') || request.ip || 'unknown'
    })

    // Check if this is a critical violation that needs an alert
    const criticalDirectives = ['script-src', 'object-src', 'base-uri']
    const violatedDirective = cspReport['violated-directive'] || ''
    
    if (criticalDirectives.some(directive => violatedDirective.includes(directive))) {
      // Create a security alert for critical CSP violations
      await supabase.from('security_alerts').insert({
        severity: 'medium',
        alert_type: 'csp_violation',
        message: `Critical CSP violation: ${violatedDirective} blocked ${cspReport['blocked-uri']}`,
        ip_address: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
        action_required: false,
        auto_resolved: false,
        metadata: {
          csp_report: cspReport,
          user_agent: request.headers.get('user-agent')
        }
      })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('CSP report API error:', error)
    // Don't return error details to prevent information leakage
    return NextResponse.json({ status: 'ok' })
  }
}