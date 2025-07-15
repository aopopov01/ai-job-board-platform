import { NextRequest, NextResponse } from 'next/server'
import { skillService, userSkillService } from '../../../lib/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const category = searchParams.get('category')
    const userId = searchParams.get('userId')
    
    if (userId) {
      // Get user's skills
      const { data, error } = await userSkillService.getByUser(userId)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ skills: data || [] })
    }

    // Search skills
    const { data, error } = await skillService.search(query || '', category)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ skills: data || [] })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, skill_type } = body
    
    if (!name) {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 })
    }

    const { data, error } = await skillService.create({
      name,
      category: category || null,
      skill_type: skill_type || 'technical',
      is_active: true,
      usage_count: 0
    })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ skill: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}