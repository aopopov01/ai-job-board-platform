import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

// Environment validation
const validateEnvironment = () => {
  const required = ['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']
  const missing = required.filter(env => !process.env[env])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

validateEnvironment()

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export interface SubscriptionPlan {
  id: string
  name: string
  price_monthly: number
  price_yearly: number
  currency: string
  features: string[]
  limits: {
    job_posts?: number
    applications?: number
    candidate_searches?: number
    ai_screenings?: number
    team_members?: number
    priority_support?: boolean
    custom_branding?: boolean
    api_access?: boolean
  }
  popular?: boolean
  user_type: 'individual' | 'company'
}

export const subscriptionPlans: SubscriptionPlan[] = [
  // Individual Plans
  {
    id: 'individual_free',
    name: 'Job Seeker Free',
    price_monthly: 0,
    price_yearly: 0,
    currency: 'USD',
    features: [
      'Basic job search',
      'Apply to unlimited jobs',
      'Basic profile',
      'Email notifications'
    ],
    limits: {
      applications: 10,
      ai_screenings: 5
    },
    user_type: 'individual'
  },
  {
    id: 'individual_premium',
    name: 'Job Seeker Premium',
    price_monthly: 29,
    price_yearly: 290,
    currency: 'USD',
    features: [
      'Advanced job search',
      'AI job recommendations',
      'Priority application status',
      'Advanced profile analytics',
      'Resume optimization',
      'Interview preparation tools'
    ],
    limits: {
      applications: 100,
      ai_screenings: 50
    },
    popular: true,
    user_type: 'individual'
  },
  {
    id: 'individual_pro',
    name: 'Job Seeker Pro',
    price_monthly: 59,
    price_yearly: 590,
    currency: 'USD',
    features: [
      'Everything in Premium',
      'Personal career coach',
      'Salary negotiation tools',
      'Industry insights',
      'Direct recruiter connections',
      'Priority customer support'
    ],
    limits: {
      applications: -1, // unlimited
      ai_screenings: -1,
      priority_support: true
    },
    user_type: 'individual'
  },
  // Company Plans
  {
    id: 'company_free',
    name: 'Company Free',
    price_monthly: 0,
    price_yearly: 0,
    currency: 'USD',
    features: [
      'Post 1 job',
      'Basic candidate search',
      'Standard support'
    ],
    limits: {
      job_posts: 1,
      candidate_searches: 10,
      ai_screenings: 5,
      team_members: 1
    },
    user_type: 'company'
  },
  {
    id: 'company_starter',
    name: 'Company Starter',
    price_monthly: 99,
    price_yearly: 990,
    currency: 'USD',
    features: [
      'Post 10 jobs',
      'Advanced candidate search',
      'Basic analytics',
      'Team collaboration',
      'Email support'
    ],
    limits: {
      job_posts: 10,
      candidate_searches: 100,
      ai_screenings: 50,
      team_members: 3
    },
    user_type: 'company'
  },
  {
    id: 'company_professional',
    name: 'Company Professional',
    price_monthly: 299,
    price_yearly: 2990,
    currency: 'USD',
    features: [
      'Post 50 jobs',
      'AI-powered candidate matching',
      'Advanced analytics',
      'Team management',
      'Custom branding',
      'Priority support'
    ],
    limits: {
      job_posts: 50,
      candidate_searches: 500,
      ai_screenings: 200,
      team_members: 10,
      custom_branding: true,
      priority_support: true
    },
    popular: true,
    user_type: 'company'
  },
  {
    id: 'company_enterprise',
    name: 'Company Enterprise',
    price_monthly: 999,
    price_yearly: 9990,
    currency: 'USD',
    features: [
      'Unlimited job posts',
      'Advanced AI matching',
      'Custom integrations',
      'Dedicated account manager',
      'API access',
      'White-label solution',
      'Advanced security',
      'SLA guarantee'
    ],
    limits: {
      job_posts: -1,
      candidate_searches: -1,
      ai_screenings: -1,
      team_members: -1,
      custom_branding: true,
      priority_support: true,
      api_access: true
    },
    user_type: 'company'
  }
]

export interface PaymentSession {
  sessionId: string
  url: string
  planId: string
  billing_cycle: 'monthly' | 'yearly'
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  current_period_start: string
  current_period_end: string
  billing_cycle: 'monthly' | 'yearly'
  stripe_subscription_id: string
  created_at: string
  updated_at: string
}

export class PaymentService {
  private apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'

  async createCheckoutSession(planId: string, billing_cycle: 'monthly' | 'yearly'): Promise<PaymentSession> {
    const response = await fetch(`${this.apiBaseUrl}/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        billing_cycle
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    return response.json()
  }

  async createPortalSession(): Promise<{ url: string }> {
    const response = await fetch(`${this.apiBaseUrl}/payments/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to create portal session')
    }

    return response.json()
  }

  async getCurrentSubscription(): Promise<Subscription | null> {
    const response = await fetch(`${this.apiBaseUrl}/payments/subscription`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to get subscription')
    }

    return response.json()
  }

  async cancelSubscription(): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/payments/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }
  }

  async getUsageStats(): Promise<{
    current_usage: Record<string, number>
    limits: Record<string, number>
    usage_percentage: Record<string, number>
  }> {
    const response = await fetch(`${this.apiBaseUrl}/payments/usage-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get usage stats')
    }

    return response.json()
  }

  getPlanById(planId: string): SubscriptionPlan | undefined {
    return subscriptionPlans.find(plan => plan.id === planId)
  }

  getPlansForUserType(userType: 'individual' | 'company'): SubscriptionPlan[] {
    return subscriptionPlans.filter(plan => plan.user_type === userType)
  }

  calculateYearlySavings(plan: SubscriptionPlan): number {
    const monthlyTotal = plan.price_monthly * 12
    const yearlySavings = monthlyTotal - plan.price_yearly
    return yearlySavings
  }

  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe not loaded')
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}

export const paymentService = new PaymentService()

// Hook for subscription management
export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSubscription = async () => {
    try {
      setLoading(true)
      const sub = await paymentService.getCurrentSubscription()
      setSubscription(sub)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async () => {
    try {
      await paymentService.cancelSubscription()
      await loadSubscription() // Refresh subscription data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const openPortal = async () => {
    try {
      const { url } = await paymentService.createPortalSession()
      window.location.href = url
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    subscription,
    loading,
    error,
    loadSubscription,
    cancelSubscription,
    openPortal
  }
}