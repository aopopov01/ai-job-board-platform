import { NextRequest, NextResponse } from 'next/server'
import { cvDocumentService } from '@job-board/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: cv, error: fetchError } = await cvDocumentService.getById(params.id)
    
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    // Set this CV as primary and unset others
    const { error: clearError } = await cvDocumentService.clearPrimary(cv.user_id)
    
    if (clearError) {
      return NextResponse.json({ error: clearError.message }, { status: 500 })
    }

    const { data, error } = await cvDocumentService.update(params.id, { is_primary: true })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ cv: data, message: 'CV set as primary successfully' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to set CV as primary' },
      { status: 500 }
    )
  }
}