import { NextRequest, NextResponse } from 'next/server'
import { applicationService } from '@job-board/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const candidateId = searchParams.get('candidate_id')
    const jobId = searchParams.get('job_id')
    
    if (candidateId) {
      const { data, error } = await applicationService.getByCandidate(candidateId)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ applications: data || [] })
    }

    if (jobId) {
      const { data, error } = await applicationService.getByJob(jobId)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ applications: data || [] })
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await applicationService.create(body)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ application: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}