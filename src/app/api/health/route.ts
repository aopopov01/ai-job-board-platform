import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health checks
    const checks = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      memory: process.memoryUsage(),
      status: 'healthy'
    }

    // Additional checks can be added here:
    // - Database connectivity
    // - External service health
    // - Cache availability

    return NextResponse.json(checks, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 503 }
    )
  }
}