import { z } from 'zod'

// Validation schemas
export const userProfileSchema = z.object({
  user_type: z.enum(['individual', 'company', 'admin']),
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  language_preference: z.enum(['en', 'el', 'ru']).default('en')
})

export const individualProfileSchema = z.object({
  job_search_status: z.enum(['actively_looking', 'open_to_opportunities', 'not_looking', 'hidden']).default('not_looking'),
  years_of_experience: z.number().min(0).max(50).optional(),
  current_job_title: z.string().optional(),
  current_company: z.string().optional(),
  salary_expectation_min: z.number().positive().optional(),
  salary_expectation_max: z.number().positive().optional(),
  salary_currency: z.string().default('EUR'),
  remote_preference: z.enum(['remote_only', 'hybrid', 'onsite', 'flexible']).default('flexible')
})

export const companyProfileSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  company_size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
  industry: z.string().optional(),
  founded_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  company_description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  company_website: z.string().url('Invalid website URL').optional().or(z.literal(''))
})

export const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  job_type: z.enum(['full_time', 'part_time', 'contract', 'internship', 'freelance']),
  work_style: z.enum(['remote', 'hybrid', 'onsite']),
  experience_level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  location: z.string().optional(),
  salary_min: z.number().positive().optional(),
  salary_max: z.number().positive().optional(),
  salary_currency: z.string().default('EUR'),
  skills_required: z.array(z.string()).default([]),
  skills_nice_to_have: z.array(z.string()).default([]),
  application_deadline: z.string().optional()
})

export const applicationSchema = z.object({
  cover_letter: z.string().max(1000, 'Cover letter must be less than 1000 characters').optional()
})

// Type inference from schemas
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type IndividualProfileInput = z.infer<typeof individualProfileSchema>
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>
export type JobInput = z.infer<typeof jobSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
