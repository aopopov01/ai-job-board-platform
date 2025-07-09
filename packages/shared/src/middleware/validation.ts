import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { securityService } from '../services/securityService'
import { errorHandler, ValidationError } from '../services/errorHandler'

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Invalid email format').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  name: z.string().min(1, 'Name is required').max(100),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  url: z.string().url('Invalid URL format').optional(),
  uuid: z.string().uuid('Invalid UUID format'),
  positiveInteger: z.number().int().positive(),
  nonNegativeInteger: z.number().int().min(0),
  stringArray: z.array(z.string()),
  dateString: z.string().datetime('Invalid date format'),
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10)
  })
}

// Job-related schemas
export const jobSchemas = {
  createJob: z.object({
    title: z.string().min(1, 'Job title is required').max(200),
    description: z.string().min(50, 'Description must be at least 50 characters').max(10000),
    company_id: commonSchemas.uuid,
    department: z.string().max(100).optional(),
    location: z.string().max(200),
    job_type: z.enum(['full_time', 'part_time', 'contract', 'temporary', 'internship']),
    remote_option: z.enum(['on_site', 'remote', 'hybrid']),
    experience_level: z.enum(['entry', 'mid', 'senior', 'executive']),
    salary_min: commonSchemas.nonNegativeInteger.optional(),
    salary_max: commonSchemas.nonNegativeInteger.optional(),
    currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
    benefits: commonSchemas.stringArray.optional(),
    requirements: commonSchemas.stringArray,
    skills: commonSchemas.stringArray,
    application_deadline: commonSchemas.dateString.optional(),
    tags: commonSchemas.stringArray.optional()
  }),
  
  updateJob: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(50).max(10000).optional(),
    department: z.string().max(100).optional(),
    location: z.string().max(200).optional(),
    job_type: z.enum(['full_time', 'part_time', 'contract', 'temporary', 'internship']).optional(),
    remote_option: z.enum(['on_site', 'remote', 'hybrid']).optional(),
    experience_level: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
    salary_min: commonSchemas.nonNegativeInteger.optional(),
    salary_max: commonSchemas.nonNegativeInteger.optional(),
    benefits: commonSchemas.stringArray.optional(),
    requirements: commonSchemas.stringArray.optional(),
    skills: commonSchemas.stringArray.optional(),
    application_deadline: commonSchemas.dateString.optional(),
    tags: commonSchemas.stringArray.optional()
  }),
  
  searchJobs: z.object({
    query: z.string().max(500).optional(),
    location: z.string().max(200).optional(),
    job_type: z.enum(['full_time', 'part_time', 'contract', 'temporary', 'internship']).optional(),
    remote_option: z.enum(['on_site', 'remote', 'hybrid']).optional(),
    experience_level: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
    salary_min: commonSchemas.nonNegativeInteger.optional(),
    salary_max: commonSchemas.nonNegativeInteger.optional(),
    skills: commonSchemas.stringArray.optional(),
    company_id: commonSchemas.uuid.optional(),
    ...commonSchemas.pagination.shape
  })
}

// User-related schemas
export const userSchemas = {
  register: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    first_name: commonSchemas.name,
    last_name: commonSchemas.name,
    user_type: z.enum(['job_seeker', 'employer', 'admin']),
    phone: commonSchemas.phone,
    company_name: z.string().max(200).optional(),
    terms_accepted: z.boolean().refine(val => val === true, 'Terms must be accepted')
  }),
  
  updateProfile: z.object({
    first_name: commonSchemas.name.optional(),
    last_name: commonSchemas.name.optional(),
    phone: commonSchemas.phone,
    bio: z.string().max(2000).optional(),
    location: z.string().max(200).optional(),
    website: commonSchemas.url,
    linkedin_url: commonSchemas.url,
    github_url: commonSchemas.url,
    skills: commonSchemas.stringArray.optional(),
    experience_years: commonSchemas.nonNegativeInteger.optional(),
    education_level: z.enum(['high_school', 'associate', 'bachelor', 'master', 'phd']).optional(),
    resume_url: commonSchemas.url,
    portfolio_url: commonSchemas.url
  }),
  
  changePassword: z.object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: commonSchemas.password,
    confirm_password: z.string()
  }).refine(data => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password']
  })
}

// Application-related schemas
export const applicationSchemas = {
  createApplication: z.object({
    job_id: commonSchemas.uuid,
    cover_letter: z.string().min(50, 'Cover letter must be at least 50 characters').max(5000),
    resume_url: commonSchemas.url.optional(),
    portfolio_url: commonSchemas.url.optional(),
    additional_notes: z.string().max(1000).optional()
  }),
  
  updateApplicationStatus: z.object({
    status: z.enum(['pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'rejected', 'withdrawn']),
    notes: z.string().max(1000).optional()
  })
}

// Company-related schemas
export const companySchemas = {
  createCompany: z.object({
    name: z.string().min(1, 'Company name is required').max(200),
    description: z.string().max(5000).optional(),
    industry: z.string().max(100),
    company_size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
    location: z.string().max(200),
    website: commonSchemas.url.optional(),
    logo_url: commonSchemas.url.optional(),
    founded_year: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    benefits: commonSchemas.stringArray.optional(),
    culture_tags: commonSchemas.stringArray.optional()
  }),
  
  updateCompany: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    industry: z.string().max(100).optional(),
    company_size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
    location: z.string().max(200).optional(),
    website: commonSchemas.url.optional(),
    logo_url: commonSchemas.url.optional(),
    founded_year: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
    benefits: commonSchemas.stringArray.optional(),
    culture_tags: commonSchemas.stringArray.optional()
  })
}

// Payment-related schemas
export const paymentSchemas = {
  createSubscription: z.object({
    plan_id: z.string().min(1, 'Plan ID is required'),
    billing_cycle: z.enum(['monthly', 'yearly']),
    payment_method_id: z.string().min(1, 'Payment method is required')
  }),
  
  updateSubscription: z.object({
    plan_id: z.string().min(1, 'Plan ID is required').optional(),
    billing_cycle: z.enum(['monthly', 'yearly']).optional()
  })
}

// Validation middleware function
export function withValidation<T>(schema: z.ZodSchema<T>) {
  return async (
    req: NextRequest,
    handler: (req: NextRequest, validatedData: T) => Promise<NextResponse>
  ) => {
    try {
      let body: any
      
      // Parse request body
      if (req.method !== 'GET' && req.method !== 'DELETE') {
        try {
          body = await req.json()
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid JSON in request body' },
            { status: 400 }
          )
        }
      }
      
      // Parse query parameters for GET requests
      if (req.method === 'GET') {
        const url = new URL(req.url)
        const queryParams: any = {}
        
        for (const [key, value] of url.searchParams.entries()) {
          // Handle arrays (e.g., skills[]=javascript&skills[]=python)
          if (key.endsWith('[]')) {
            const arrayKey = key.slice(0, -2)
            if (!queryParams[arrayKey]) {
              queryParams[arrayKey] = []
            }
            queryParams[arrayKey].push(value)
          } else {
            // Handle numbers
            if (/^\d+$/.test(value)) {
              queryParams[key] = parseInt(value, 10)
            } else if (/^\d+\.\d+$/.test(value)) {
              queryParams[key] = parseFloat(value)
            } else if (value === 'true') {
              queryParams[key] = true
            } else if (value === 'false') {
              queryParams[key] = false
            } else {
              queryParams[key] = value
            }
          }
        }
        
        body = queryParams
      }
      
      // Validate data
      const validatedData = schema.parse(body)
      
      // Additional security validation
      if (typeof validatedData === 'object' && validatedData !== null) {
        for (const [key, value] of Object.entries(validatedData)) {
          if (typeof value === 'string') {
            const validation = securityService.validateAndSanitizeInput(value, 'text')
            if (!validation.isValid) {
              return NextResponse.json(
                { 
                  error: 'Invalid input',
                  field: key,
                  details: validation.errors 
                },
                { status: 400 }
              )
            }
          }
        }
      }
      
      return await handler(req, validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validationErrors
          },
          { status: 400 }
        )
      }
      
      console.error('Validation middleware error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// File upload validation
export const fileValidation = {
  validateFileSize: (file: File, maxSizeInMB: number): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    return file.size <= maxSizeInBytes
  },
  
  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type)
  },
  
  validateFileName: (fileName: string): boolean => {
    // Check for dangerous file names
    const dangerousPatterns = [
      /\.\./,  // Directory traversal
      /[<>:"|?*]/,  // Invalid characters
      /^\./,  // Hidden files
      /\.(php|jsp|asp|aspx|js|html|htm|exe|bat|cmd|sh|py|rb|jar)$/i  // Executable files
    ]
    
    return !dangerousPatterns.some(pattern => pattern.test(fileName))
  }
}

// Export validation schemas for use in API routes
export const validationSchemas = {
  common: commonSchemas,
  job: jobSchemas,
  user: userSchemas,
  application: applicationSchemas,
  company: companySchemas,
  payment: paymentSchemas
}