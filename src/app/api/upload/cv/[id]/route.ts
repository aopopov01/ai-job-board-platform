import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@job-board/database'
import { cvDocumentService } from '@job-board/database'

export async function DELETE(
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

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([cv.file_url.split('/').pop() || ''])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error: deleteError } = await cvDocumentService.delete(params.id)
    
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'CV deleted successfully' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await cvDocumentService.getById(params.id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    return NextResponse.json({ cv: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CV' },
      { status: 500 }
    )
  }
}