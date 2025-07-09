import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { subscriptionPlans } from '@job-board/shared'

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to determine plan
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_plan, user_type')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const currentPlan = subscriptionPlans.find(plan => plan.id === profile.subscription_plan)
    if (!currentPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Calculate usage based on user type
    let currentUsage: Record<string, number> = {}
    let limits: Record<string, number> = {}

    if (profile.user_type === 'company') {
      // Get company usage stats
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('company_id', user.id)

      const { data: applications } = await supabase
        .from('applications')
        .select('id, jobs!inner(company_id)')
        .eq('jobs.company_id', user.id)

      const { data: aiScreenings } = await supabase
        .from('applications')
        .select('id')
        .eq('jobs.company_id', user.id)
        .not('ai_screening_score', 'is', null)

      const { data: candidateSearches } = await supabase
        .from('candidate_searches')
        .select('id')
        .eq('company_id', user.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      currentUsage = {
        job_posts: jobs?.length || 0,
        applications: applications?.length || 0,
        ai_screenings: aiScreenings?.length || 0,
        candidate_searches: candidateSearches?.length || 0
      }

      limits = {
        job_posts: currentPlan.limits.job_posts || 0,
        applications: currentPlan.limits.applications || 0,
        ai_screenings: currentPlan.limits.ai_screenings || 0,
        candidate_searches: currentPlan.limits.candidate_searches || 0
      }
    } else {
      // Get individual usage stats
      const { data: applications } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', user.id)

      const { data: aiScreenings } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', user.id)
        .not('ai_screening_score', 'is', null)

      currentUsage = {
        applications: applications?.length || 0,
        ai_screenings: aiScreenings?.length || 0
      }

      limits = {
        applications: currentPlan.limits.applications || 0,
        ai_screenings: currentPlan.limits.ai_screenings || 0
      }
    }

    // Calculate usage percentages
    const usagePercentage: Record<string, number> = {}
    Object.keys(currentUsage).forEach(key => {
      const limit = limits[key]
      if (limit === -1) {
        usagePercentage[key] = 0 // Unlimited
      } else if (limit > 0) {
        usagePercentage[key] = Math.round((currentUsage[key] / limit) * 100)
      } else {
        usagePercentage[key] = 0
      }
    })

    return NextResponse.json({
      current_usage: currentUsage,
      limits,
      usage_percentage: usagePercentage
    })
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    )
  }
}