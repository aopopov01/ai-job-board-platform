import { NextRequest, NextResponse } from 'next/server'
import { jobService, individualProfileService, userSkillService } from '../../../lib/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's profile and skills
    const [profileResponse, skillsResponse] = await Promise.all([
      individualProfileService.getById(userId),
      userSkillService.getByUser(userId)
    ])

    if (profileResponse.error || skillsResponse.error) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    const profile = profileResponse.data
    const skills = skillsResponse.data || []

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Build search filters based on user preferences
    const filters = {
      remote_preference: profile.remote_preference,
      salary_min: profile.salary_expectation_min,
      limit: limit * 2 // Get more results to filter from
    }

    // Get jobs that match user preferences
    const { data: jobs, error } = await jobService.search(filters)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Simple AI-like scoring based on skills match
    const scoredJobs = (jobs || []).map(job => {
      let score = 0
      const skillsRequired = job.skills_required || []
      const skillsNiceToHave = job.skills_nice_to_have || []
      
      // Calculate skill match score
      const userSkillNames = skills.map(s => s.skill_name?.toLowerCase())
      
      skillsRequired.forEach(skill => {
        if (userSkillNames.includes(skill.toLowerCase())) {
          score += 10 // Required skill match
        }
      })
      
      skillsNiceToHave.forEach(skill => {
        if (userSkillNames.includes(skill.toLowerCase())) {
          score += 5 // Nice to have skill match
        }
      })
      
      // Salary match bonus
      if (job.salary_min && profile.salary_expectation_min) {
        if (job.salary_min >= profile.salary_expectation_min) {
          score += 15
        }
      }
      
      // Experience level match
      const userExperience = profile.years_of_experience || 0
      const jobExperience = job.experience_level
      
      if (jobExperience === 'entry' && userExperience <= 2) score += 8
      else if (jobExperience === 'mid' && userExperience >= 2 && userExperience <= 6) score += 8
      else if (jobExperience === 'senior' && userExperience >= 5) score += 8
      
      // Remote preference match
      if (profile.remote_preference === 'remote_only' && job.work_style === 'remote') score += 10
      else if (profile.remote_preference === 'hybrid' && job.work_style === 'hybrid') score += 10
      else if (profile.remote_preference === 'onsite' && job.work_style === 'onsite') score += 10
      else if (profile.remote_preference === 'flexible') score += 5
      
      return {
        ...job,
        match_score: score,
        match_percentage: Math.min(Math.round((score / 50) * 100), 100),
        matched_skills: skillsRequired.filter(skill => 
          userSkillNames.includes(skill.toLowerCase())
        )
      }
    })

    // Sort by score and return top recommendations
    const recommendations = scoredJobs
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit)

    return NextResponse.json({ 
      recommendations,
      totalScored: scoredJobs.length,
      userProfile: {
        skills: skills.length,
        experience: profile.years_of_experience,
        remote_preference: profile.remote_preference
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, jobId, action } = body // action: 'like', 'dislike', 'apply', 'save'
    
    if (!userId || !jobId || !action) {
      return NextResponse.json({ 
        error: 'User ID, job ID, and action are required' 
      }, { status: 400 })
    }

    // Here you would typically save the user's interaction to improve future recommendations
    // For now, we'll just return a success response
    
    return NextResponse.json({ 
      message: 'Recommendation feedback recorded',
      action: action,
      jobId: jobId
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to record recommendation feedback' },
      { status: 500 }
    )
  }
}