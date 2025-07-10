// Export utilities
export * from './utils/validation'
export * from './utils/helpers'

// Export configurations
export type { SubscriptionPlan } from './config/subscription-plans'
export { subscriptionPlans, getSubscriptionPlan, getSubscriptionPlansByUserType } from './config/subscription-plans'


// Client-side hooks and stores are exported separately in ./client.ts to avoid SSR issues

// Export constants
export const APP_NAME = 'Job Board Platform'
export const APP_DESCRIPTION = 'AI-powered job board with intelligent matching'

export const USER_TYPES = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  ADMIN: 'admin'
} as const

export const JOB_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  FREELANCE: 'freelance'
} as const

export const WORK_STYLES = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onsite'
} as const

export const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  EXECUTIVE: 'executive'
} as const

export const APPLICATION_STATUSES = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEWED: 'interviewed',
  OFFERED: 'offered',
  HIRED: 'hired',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
} as const

export const JOB_SEARCH_STATUSES = {
  ACTIVELY_LOOKING: 'actively_looking',
  OPEN_TO_OPPORTUNITIES: 'open_to_opportunities',
  NOT_LOOKING: 'not_looking',
  HIDDEN: 'hidden'
} as const

export const SUBSCRIPTION_PLANS = {
  INDIVIDUAL: {
    FREE: 'free',
    BASIC: 'basic',
    PREMIUM: 'premium',
    PRO: 'pro'
  },
  COMPANY: {
    FREE: 'free',
    BASIC: 'basic',
    PREMIUM: 'premium',
    ENTERPRISE: 'enterprise'
  }
} as const

export const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' }
] as const

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'el', name: 'Greek' },
  { code: 'ru', name: 'Russian' }
] as const
