import { NextRequest, NextResponse } from 'next/server'
import { userSkillService } from '../../../../lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, skillId, proficiency_level, years_of_experience } = body
    
    if (!userId || !skillId || !proficiency_level) {
      return NextResponse.json({ 
        error: 'User ID, skill ID, and proficiency level are required' 
      }, { status: 400 })
    }

    const { data, error } = await userSkillService.create({
      user_id: userId,
      skill_id: skillId,
      proficiency_level,
      years_of_experience: years_of_experience || null,
      is_verified: false,
      source: 'manual'
    })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ userSkill: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to add skill to user' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, proficiency_level, years_of_experience, is_verified } = body
    
    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 })
    }

    const { data, error } = await userSkillService.update(id, {
      proficiency_level,
      years_of_experience,
      is_verified
    })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ userSkill: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update user skill' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 })
    }

    const { error } = await userSkillService.delete(id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Skill removed successfully' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to remove skill' },
      { status: 500 }
    )
  }
}