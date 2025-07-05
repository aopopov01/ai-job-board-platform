import { supabase } from './client'
import type { 
  UserProfile, 
  IndividualProfile, 
  CompanyProfile, 
  TablesInsert,
  TablesUpdate 
} from './types/database.types'

// User Profile Operations
export const userProfileService = {
  async create(data: TablesInsert<'user_profiles'>) {
    return await supabase
      .from('user_profiles')
      .insert(data)
      .select()
      .single()
  },

  async getById(id: string) {
    return await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()
  },

  async update(id: string, data: TablesUpdate<'user_profiles'>) {
    return await supabase
      .from('user_profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async getByEmail(email: string) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user?.email || user.user.email !== email) {
      throw new Error('Unauthorized')
    }
    
    return await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.user.id)
      .single()
  }
}

// Individual Profile Operations
export const individualProfileService = {
  async create(data: TablesInsert<'individual_profiles'>) {
    return await supabase
      .from('individual_profiles')
      .insert(data)
      .select()
      .single()
  },

  async getById(id: string) {
    return await supabase
      .from('individual_profiles')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('id', id)
      .single()
  },

  async update(id: string, data: TablesUpdate<'individual_profiles'>) {
    return await supabase
      .from('individual_profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async getByJobSearchStatus(status: string) {
    return await supabase
      .from('individual_profiles')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('job_search_status', status)
  }
}

// Company Profile Operations
export const companyProfileService = {
  async create(data: TablesInsert<'company_profiles'>) {
    return await supabase
      .from('company_profiles')
      .insert(data)
      .select()
      .single()
  },

  async getById(id: string) {
    return await supabase
      .from('company_profiles')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('id', id)
      .single()
  },

  async update(id: string, data: TablesUpdate<'company_profiles'>) {
    return await supabase
      .from('company_profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async getVerified() {
    return await supabase
      .from('company_profiles')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('verification_status', 'verified')
  }
}

// Job Operations
export const jobService = {
  async create(data: TablesInsert<'jobs'>) {
    return await supabase
      .from('jobs')
      .insert(data)
      .select(`
        *,
        company_profiles (
          company_name,
          company_size,
          industry
        ),
        job_categories (
          name
        )
      `)
      .single()
  },

  async getById(id: string) {
    return await supabase
      .from('jobs')
      .select(`
        *,
        company_profiles (
          company_name,
          company_size,
          industry,
          company_website,
          user_profiles (
            first_name,
            last_name,
            linkedin_url
          )
        ),
        job_categories (
          name
        ),
        applications (
          id,
          status,
          applied_at,
          individual_profiles (
            user_profiles (
              first_name,
              last_name
            )
          )
        )
      `)
      .eq('id', id)
      .single()
  },

  async update(id: string, data: TablesUpdate<'jobs'>) {
    return await supabase
      .from('jobs')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async delete(id: string) {
    return await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
  },

  async getByCompany(companyId: string) {
    return await supabase
      .from('jobs')
      .select(`
        *,
        job_categories (
          name
        ),
        applications (
          id,
          status
        )
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
  },

  async search(filters: {
    query?: string
    location?: string
    job_type?: string
    work_style?: string
    experience_level?: string
    category_id?: string
    salary_min?: number
    salary_max?: number
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        company_profiles (
          company_name,
          company_size,
          industry
        ),
        job_categories (
          name
        )
      `)
      .eq('status', 'active')

    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters.job_type) {
      query = query.eq('job_type', filters.job_type)
    }

    if (filters.work_style) {
      query = query.eq('work_style', filters.work_style)
    }

    if (filters.experience_level) {
      query = query.eq('experience_level', filters.experience_level)
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters.salary_min) {
      query = query.gte('salary_min', filters.salary_min)
    }

    if (filters.salary_max) {
      query = query.lte('salary_max', filters.salary_max)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1)

    return query
  },

  async getFeatured(limit: number = 6) {
    return await supabase
      .from('jobs')
      .select(`
        *,
        company_profiles (
          company_name,
          company_size,
          industry
        ),
        job_categories (
          name
        )
      `)
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)
  }
}

// Application Operations
export const applicationService = {
  async create(data: TablesInsert<'applications'>) {
    return await supabase
      .from('applications')
      .insert(data)
      .select()
      .single()
  },

  async getById(id: string) {
    return await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          company_profiles (
            company_name
          )
        ),
        individual_profiles (
          user_profiles (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('id', id)
      .single()
  },

  async update(id: string, data: TablesUpdate<'applications'>) {
    return await supabase
      .from('applications')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async getByCandidate(candidateId: string) {
    return await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          company_profiles (
            company_name
          )
        )
      `)
      .eq('candidate_id', candidateId)
      .order('applied_at', { ascending: false })
  },

  async getByJob(jobId: string) {
    return await supabase
      .from('applications')
      .select(`
        *,
        individual_profiles (
          user_profiles (
            first_name,
            last_name
          ),
          current_job_title,
          years_of_experience
        )
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false })
  }
}

// Job Categories Operations
export const jobCategoryService = {
  async getAll() {
    return await supabase
      .from('job_categories')
      .select('*')
      .order('name')
  },

  async getById(id: string) {
    return await supabase
      .from('job_categories')
      .select('*')
      .eq('id', id)
      .single()
  }
}

// CV Documents Operations
export const cvDocumentService = {
  async create(data: TablesInsert<'cv_documents'>) {
    return await supabase
      .from('cv_documents')
      .insert(data)
      .select()
      .single()
  },

  async getById(id: string) {
    return await supabase
      .from('cv_documents')
      .select('*')
      .eq('id', id)
      .single()
  },

  async update(id: string, data: TablesUpdate<'cv_documents'>) {
    return await supabase
      .from('cv_documents')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async delete(id: string) {
    return await supabase
      .from('cv_documents')
      .delete()
      .eq('id', id)
  },

  async getByUser(userId: string) {
    return await supabase
      .from('cv_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  async setAsPrimary(userId: string, cvId: string) {
    // First, unset all other CVs as primary
    await supabase
      .from('cv_documents')
      .update({ is_primary: false })
      .eq('user_id', userId)

    // Then set the selected CV as primary
    return await supabase
      .from('cv_documents')
      .update({ is_primary: true })
      .eq('id', cvId)
      .eq('user_id', userId)
  }
}

// Skills Operations
export const skillService = {
  async getAll() {
    return await supabase
      .from('skills')
      .select('*')
      .order('name')
  },

  async search(query: string) {
    return await supabase
      .from('skills')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(10)
  },

  async create(data: TablesInsert<'skills'>) {
    return await supabase
      .from('skills')
      .insert(data)
      .select()
      .single()
  }
}

// User Skills Operations
export const userSkillService = {
  async create(data: TablesInsert<'user_skills'>) {
    return await supabase
      .from('user_skills')
      .insert(data)
      .select()
      .single()
  },

  async getByUser(userId: string) {
    return await supabase
      .from('user_skills')
      .select(`
        *,
        skills (
          name,
          category
        )
      `)
      .eq('user_id', userId)
      .order('proficiency_level', { ascending: false })
  },

  async update(id: string, data: TablesUpdate<'user_skills'>) {
    return await supabase
      .from('user_skills')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async delete(id: string) {
    return await supabase
      .from('user_skills')
      .delete()
      .eq('id', id)
  }
}
