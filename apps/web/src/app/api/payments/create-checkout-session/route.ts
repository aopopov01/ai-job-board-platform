import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export async function POST(req: NextRequest) {
  try {
    const { planId, billing_cycle } = await req.json()
    
    // Get the authenticated user
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Define price mapping
    const priceMap: Record<string, { monthly: string; yearly: string }> = {
      'individual_premium': {
        monthly: 'price_individual_premium_monthly',
        yearly: 'price_individual_premium_yearly'
      },
      'individual_pro': {
        monthly: 'price_individual_pro_monthly',
        yearly: 'price_individual_pro_yearly'
      },
      'company_starter': {
        monthly: 'price_company_starter_monthly',
        yearly: 'price_company_starter_yearly'
      },
      'company_professional': {
        monthly: 'price_company_professional_monthly',
        yearly: 'price_company_professional_yearly'
      },
      'company_enterprise': {
        monthly: 'price_company_enterprise_monthly',
        yearly: 'price_company_enterprise_yearly'
      }
    }

    const priceId = priceMap[planId]?.[billing_cycle]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      billing_address_collection: 'required',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        billing_cycle: billing_cycle
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      planId,
      billing_cycle
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}