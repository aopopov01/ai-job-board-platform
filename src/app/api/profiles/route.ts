import { NextRequest, NextResponse } from 'next/server'
import { userProfileService, individualProfileService, companyProfileService } from '@job-board/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data: userProfile, error: userError } = await userProfileService.getById(userId)
    
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    let specificProfile = null
    
    if (userProfile.user_type === 'individual') {
      const { data, error } = await individualProfileService.getById(userId)
      if (!error) specificProfile = data
    } else if (userProfile.user_type === 'company') {
      const { data, error } = await companyProfileService.getById(userId)
      if (!error) specificProfile = data
    }

    return NextResponse.json({ 
      profile: userProfile,
      specificProfile: specificProfile
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userProfile, specificProfile } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Update user profile
    const { data: updatedUserProfile, error: userError } = await userProfileService.update(userId, userProfile)
    
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    let updatedSpecificProfile = null
    
    if (specificProfile) {
      if (userProfile.user_type === 'individual') {
        const { data, error } = await individualProfileService.update(userId, specificProfile)
        if (!error) updatedSpecificProfile = data
      } else if (userProfile.user_type === 'company') {
        const { data, error } = await companyProfileService.update(userId, specificProfile)
        if (!error) updatedSpecificProfile = data
      }
    }

    return NextResponse.json({ 
      profile: updatedUserProfile,
      specificProfile: updatedSpecificProfile
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}