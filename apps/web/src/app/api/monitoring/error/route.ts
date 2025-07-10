import { NextRequest, NextResponse } from 'next/server'
import { logger, toError } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    
    // Log error using proper logging
    logger.error('Client Error Report', { errorData })
    
    // In production, you would send this to your monitoring service
    // Examples:
    // - Sentry: Sentry.captureException(errorData)
    // - LogRocket: LogRocket.captureException(errorData)
    // - Custom logging service
    
    // For now, just acknowledge receipt
    return NextResponse.json({ 
      status: 'received', 
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    logger.error('Error handling error report', {}, toError(error))
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}