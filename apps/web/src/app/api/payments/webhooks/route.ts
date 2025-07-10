import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { logger, toError } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock-stripe-key', {
  apiVersion: '2024-06-20'
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key-for-testing'
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'mock-webhook-secret-for-testing'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
      logger.error('Webhook signature verification failed', { error: err.message })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      default:
        logger.info('Unhandled webhook event type', { eventType: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook error', {}, toError(error))
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { user_id, plan_id, billing_cycle } = session.metadata || {}
  
  if (!user_id || !plan_id || !billing_cycle) {
    logger.error('Missing metadata in checkout session', { metadata: session.metadata })
    return
  }

  // Get the subscription from Stripe
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
  
  // Create subscription record in database
  await supabase.from('subscriptions').insert({
    user_id,
    plan_id,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    billing_cycle,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string
  })

  // Update user profile with subscription plan
  await supabase
    .from('user_profiles')
    .update({ subscription_plan: plan_id })
    .eq('id', user_id)

  // If it's a company profile, update the company-specific limits
  if (plan_id.startsWith('company_')) {
    await supabase
      .from('company_profiles')
      .update({ subscription_plan: plan_id })
      .eq('id', user_id)
  } else {
    await supabase
      .from('individual_profiles')
      .update({ subscription_plan: plan_id })
      .eq('id', user_id)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  
  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({ status: 'active' })
    .eq('stripe_subscription_id', subscriptionId)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  
  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Update subscription details
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Get the subscription record
  const { data: subscriptionRecord } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (subscriptionRecord) {
    // Update subscription status
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id)

    // Revert user to free plan
    await supabase
      .from('user_profiles')
      .update({ subscription_plan: 'free' })
      .eq('id', subscriptionRecord.user_id)

    // Check if it's a company or individual profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('id', subscriptionRecord.user_id)
      .single()

    if (profile?.user_type === 'company') {
      await supabase
        .from('company_profiles')
        .update({ subscription_plan: 'company_free' })
        .eq('id', subscriptionRecord.user_id)
    } else {
      await supabase
        .from('individual_profiles')
        .update({ subscription_plan: 'individual_free' })
        .eq('id', subscriptionRecord.user_id)
    }
  }
}