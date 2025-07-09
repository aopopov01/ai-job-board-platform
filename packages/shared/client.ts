// Export hooks (client-side only)
export * from './hooks/useAuth'

// Export stores (client-side only)
export * from './stores/auth'

// Re-export shared constants and utilities for client use
export * from './utils/validation'
export * from './utils/helpers'
export {
  APP_NAME,
  APP_DESCRIPTION,
  USER_TYPES,
  JOB_TYPES,
  WORK_STYLES,
  EXPERIENCE_LEVELS,
  APPLICATION_STATUSES,
  JOB_SEARCH_STATUSES,
  SUBSCRIPTION_PLANS,
  CURRENCIES,
  LANGUAGES
} from './index'