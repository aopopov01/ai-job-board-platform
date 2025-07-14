import { NextRequest, NextResponse } from 'next/server'
import { jobService } from '@job-board/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters = {
      query: searchParams.get('query') || undefined,
      location: searchParams.get('location') || undefined,
      job_type: searchParams.get('job_type') || undefined,
      work_style: searchParams.get('work_style') || undefined,
      experience_level: searchParams.get('experience_level') || undefined,
      category_id: searchParams.get('category_id') || undefined,
      salary_min: searchParams.get('salary_min') ? Number(searchParams.get('salary_min')) : undefined,
      salary_max: searchParams.get('salary_max') ? Number(searchParams.get('salary_max')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      offset: searchParams.get('offset') ? Number(searchParams.get('offset')) : 0
    }

    const { data, error } = await jobService.search(filters)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      jobs: data || [],
      count: data?.length || 0,
      filters: filters
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await jobService.create(body)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ job: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}