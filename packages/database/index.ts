// Export all database-related functionality
export { supabase } from './client'
export type { SupabaseClient } from './client'

export * from './types/database.types'
export { 
  userProfileService, 
  individualProfileService, 
  companyProfileService,
  jobService,
  applicationService,
  jobCategoryService,
  cvDocumentService,
  skillService,
  userSkillService,
  messageService
} from './services'

// Export type guards and utilities
export const isUserProfile = (data: any): data is import('./types/database.types').UserProfile => {
  return data && typeof data.id === 'string' && typeof data.user_type === 'string'
}

export const isIndividualProfile = (data: any): data is import('./types/database.types').IndividualProfile => {
  return data && typeof data.id === 'string'
}

export const isCompanyProfile = (data: any): data is import('./types/database.types').CompanyProfile => {
  return data && typeof data.id === 'string' && typeof data.company_name === 'string'
}

// Common database helpers
export const handleDatabaseError = (error: any) => {
  console.error('Database error:', error)
  
  if (error?.code === 'PGRST301') {
    return new Error('Resource not found')
  }
  
  if (error?.code === '23505') {
    return new Error('Resource already exists')
  }
  
  if (error?.code === '42501') {
    return new Error('Insufficient permissions')
  }
  
  return new Error('Database operation failed')
}

export const formatDatabaseResponse = <T>(response: { data: T | null, error: any }) => {
  if (response.error) {
    throw handleDatabaseError(response.error)
  }
  
  return response.data
}
