export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billing_cycle: 'monthly' | 'yearly'
  features: string[]
  limits: {
    job_posts: number // -1 for unlimited
    applications: number // -1 for unlimited
    ai_screenings: number // -1 for unlimited
    candidate_searches: number // -1 for unlimited
    team_members: number // -1 for unlimited
    priority_support: boolean
    custom_branding: boolean
    analytics_dashboard: boolean
    api_access: boolean
  }
  popular?: boolean
  user_type: 'individual' | 'company'
}

export const subscriptionPlans: SubscriptionPlan[] = [
  // Individual Plans
  {
    id: 'individual_free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'EUR',
    billing_cycle: 'monthly',
    user_type: 'individual',
    features: [
      'Basic job search',
      'Apply to 10 jobs per month',
      'Basic profile creation',
      'Email notifications'
    ],
    limits: {
      job_posts: 0,
      applications: 10,
      ai_screenings: 3,
      candidate_searches: 0,
      team_members: 0,
      priority_support: false,
      custom_branding: false,
      analytics_dashboard: false,
      api_access: false
    }
  },
  {
    id: 'individual_basic',
    name: 'Basic',
    description: 'For active job seekers',
    price: 9.99,
    currency: 'EUR',
    billing_cycle: 'monthly',
    user_type: 'individual',
    features: [
      'Advanced job search',
      'Apply to 50 jobs per month',
      'AI-powered resume optimization',
      'Priority in search results',
      'Interview preparation tools'
    ],
    limits: {
      job_posts: 0,
      applications: 50,
      ai_screenings: 20,
      candidate_searches: 0,
      team_members: 0,
      priority_support: false,
      custom_branding: false,
      analytics_dashboard: true,
      api_access: false
    }
  },
  {
    id: 'individual_premium',
    name: 'Premium',
    description: 'For serious professionals',
    price: 19.99,
    currency: 'EUR',
    billing_cycle: 'monthly',
    user_type: 'individual',
    popular: true,
    features: [
      'Unlimited job applications',
      'Advanced AI matching',
      'Personal career coach',
      'Salary insights',
      'Company insights',
      'Priority support'
    ],
    limits: {
      job_posts: 0,
      applications: -1,
      ai_screenings: -1,
      candidate_searches: 0,
      team_members: 0,
      priority_support: true,
      custom_branding: false,
      analytics_dashboard: true,
      api_access: true
    }
  },
  {
    id: 'individual_pro',
    name: 'Pro',
    description: 'For executive job seekers',
    price: 39.99,
    currency: 'EUR',
    billing_cycle: 'monthly',
    user_type: 'individual',
    features: [
      'Everything in Premium',
      'Executive search access',
      'Headhunter network',
      'Personal branding tools',
      'Interview coaching',
      'White-glove service'
    ],
    limits: {
      job_posts: 0,
      applications: -1,
      ai_screenings: -1,
      candidate_searches: 0,
      team_members: 0,
      priority_support: true,
      custom_branding: true,
      analytics_dashboard: true,
      api_access: true
    }
  },
  // Company Plans
  {
    id: 'company_free',
    name: 'Free',
    description: 'Perfect for small startups',
    price: 0,
    currency: 'EUR',
    billing_cycle: 'monthly',
    user_type: 'company',
    features: [
      'Post 1 job per month',
      'Basic applicant tracking',
      'Email notifications',
      'Basic analytics'
    ],
    limits: {
      job_posts: 1,
      applications: 50,
      ai_screenings: 10,
      candidate_searches: 5,
      team_members: 1,
      priority_support: false,
      custom_branding: false,
      analytics_dashboard: false,
      api_access: false
    }
  },
  {
    id: 'company_basic',
    name: 'Basic',
    description: 'For growing companies',
    price: 99,
    currency: 'EUR',
    billing_cycle: 'monthly',
    user_type: 'company',
    features: [
      'Post 10 jobs per month',
      'Advanced applicant tracking',
      'AI-powered candidate screening',
      'Team collaboration tools',
      'Custom application forms'
    ],
    limits: {
      job_posts: 10,
      applications: 200,
      ai_screenings: 100,
      candidate_searches: 50,
      team_members: 5,
      priority_support: false,
      custom_branding: false,
      analytics_dashboard: true,
      api_access: false
    }
  },
  {
    id: 'company_premium',
    name: 'Premium',
    description: 'For scaling businesses',
    price: 199,
    currency: 'EUR',
    billing_cycle: 'monthly',
    user_type: 'company',
    popular: true,
    features: [
      'Unlimited job posts',
      'Advanced AI matching',
      'Candidate search & sourcing',
      'Priority job placement',
      'Custom branding',
      'Analytics dashboard',
      'API access'
    ],
    limits: {
      job_posts: -1,
      applications: -1,
      ai_screenings: 500,
      candidate_searches: 200,
      team_members: 15,
      priority_support: true,
      custom_branding: true,
      analytics_dashboard: true,
      api_access: true
    }
  },
  {
    id: 'company_enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 499,
    currency: 'EUR',
    billing_cycle: 'monthly',
    user_type: 'company',
    features: [
      'Everything in Premium',
      'Unlimited AI screenings',
      'Advanced candidate sourcing',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantees'
    ],
    limits: {
      job_posts: -1,
      applications: -1,
      ai_screenings: -1,
      candidate_searches: -1,
      team_members: -1,
      priority_support: true,
      custom_branding: true,
      analytics_dashboard: true,
      api_access: true
    }
  }
]

export const getSubscriptionPlan = (planId: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === planId)
}

export const getSubscriptionPlansByUserType = (userType: 'individual' | 'company'): SubscriptionPlan[] => {
  return subscriptionPlans.filter(plan => plan.user_type === userType)
}