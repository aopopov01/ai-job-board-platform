import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { cvDocumentService } from '../../../../lib/database'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const title = formData.get('title') as string
    const isPrimary = formData.get('isPrimary') === 'true'
    
    if (!file || !userId) {
      return NextResponse.json({ error: 'File and user ID are required' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF and Word documents are allowed' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${userId}_${Date.now()}.${fileExtension}`
    const filePath = `cvs/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    // If this is set as primary, update other CVs to not be primary
    if (isPrimary) {
      await cvDocumentService.clearPrimary(userId)
    }

    // Create CV document record
    const { data, error } = await cvDocumentService.create({
      user_id: userId,
      title: title || file.name,
      file_url: publicUrl,
      file_name: file.name,
      is_primary: isPrimary,
      is_active: true,
      version_number: 1
    })

    if (error) {
      // Clean up uploaded file if database operation fails
      await supabase.storage
        .from('documents')
        .remove([filePath])
        
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      cv: data,
      message: 'CV uploaded successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to upload CV' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data, error } = await cvDocumentService.getByUser(userId)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ cvs: data || [] })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CVs' },
      { status: 500 }
    )
  }
}