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

  async getByEmail(email: string, requestingUserId?: string) {
    const { data: user } = await supabase.auth.getUser()
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }
    
    // Authorization check - user can only access their own profile
    if (!user.user?.email || user.user.email !== email) {
      throw new Error('Unauthorized: You can only access your own profile')
    }
    
    // Additional security check with requesting user ID
    if (requestingUserId && user.user.id !== requestingUserId) {
      throw new Error('Unauthorized: User ID mismatch')
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
      // Sanitize query to prevent SQL injection
      const sanitizedQuery = filters.query.replace(/['"\\]/g, '').substring(0, 100)
      query = query.or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
    }

    if (filters.location) {
      // Sanitize location to prevent SQL injection
      const sanitizedLocation = filters.location.replace(/['"\\]/g, '').substring(0, 100)
      query = query.ilike('location', `%${sanitizedLocation}%`)
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

  async createWithScreening(data: TablesInsert<'applications'>, jobDetails: any, candidateProfile: any) {
    // Create application with AI screening
    const applicationData = {
      ...data,
      ai_screening_score: null,
      ai_screening_notes: null,
      status: 'applied'
    }
    
    const result = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single()
    
    // Run AI screening in background (would be implemented with job queue)
    // This is a placeholder for the actual AI screening implementation
    
    return result
  },

  async createWithFraudDetection(data: TablesInsert<'applications'>, fraudCheckData: any) {
    // Create application with fraud detection
    const applicationData = {
      ...data,
      status: 'applied',
      fraud_score: null,
      fraud_flags: null
    }
    
    const result = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single()
    
    // Run fraud detection in background
    // This would typically be implemented with a job queue
    
    return result
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
  },

  async getByStatus(status: string) {
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
            last_name
          ),
          current_job_title,
          years_of_experience
        )
      `)
      .eq('status', status)
      .order('applied_at', { ascending: false })
  },

  async bulkUpdateStatus(applicationIds: string[], status: string, notes?: string) {
    return await supabase
      .from('applications')
      .update({ 
        status, 
        recruiter_notes: notes || null,
        last_status_change: new Date().toISOString()
      })
      .in('id', applicationIds)
      .select()
  },

  async getApplicationStats(companyId: string) {
    // Get applications for all jobs posted by this company
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id')
      .eq('company_id', companyId)
    
    if (!jobs || jobs.length === 0) {
      return { total: 0, by_status: {}, recent: [] }
    }
    
    const jobIds = jobs.map(job => job.id)
    
    const { data: applications } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        applied_at,
        jobs (title),
        individual_profiles (
          user_profiles (
            first_name,
            last_name
          )
        )
      `)
      .in('job_id', jobIds)
      .order('applied_at', { ascending: false })
    
    const stats = {
      total: applications?.length || 0,
      by_status: {} as Record<string, number>,
      recent: applications?.slice(0, 10) || []
    }
    
    applications?.forEach(app => {
      stats.by_status[app.status] = (stats.by_status[app.status] || 0) + 1
    })
    
    return stats
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

// Message Operations
export const messageService = {
  async create(data: TablesInsert<'messages'>) {
    return await supabase
      .from('messages')
      .insert(data)
      .select(`
        *,
        sender:sender_id (
          first_name,
          last_name,
          profile_picture_url
        ),
        recipient:recipient_id (
          first_name,
          last_name,
          profile_picture_url
        )
      `)
      .single()
  },

  async getConversation(userId: string, otherUserId: string, applicationId?: string) {
    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          first_name,
          last_name,
          profile_picture_url
        ),
        recipient:recipient_id (
          first_name,
          last_name,
          profile_picture_url
        )
      `)
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: true })

    if (applicationId) {
      query = query.eq('application_id', applicationId)
    }

    return query
  },

  async getConversations(userId: string) {
    return await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          first_name,
          last_name,
          profile_picture_url
        ),
        recipient:recipient_id (
          first_name,
          last_name,
          profile_picture_url
        ),
        jobs (
          title
        ),
        applications (
          id,
          status
        )
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false })
  },

  async markAsRead(messageId: string) {
    return await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
  },

  async markConversationAsRead(userId: string, otherUserId: string) {
    return await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('recipient_id', userId)
  },

  async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false)
    
    if (error) throw error
    return count || 0
  },

  async subscribeToMessages(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  async getMessagesByApplication(applicationId: string) {
    return await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          first_name,
          last_name,
          profile_picture_url
        ),
        recipient:recipient_id (
          first_name,
          last_name,
          profile_picture_url
        )
      `)
      .eq('application_id', applicationId)
      .order('created_at', { ascending: true })
  }
}
