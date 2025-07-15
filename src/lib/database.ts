import { supabase } from './supabase'

// Database services - simplified versions to replace @job-board/database imports
export const jobService = {
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

  async search(filters: any) {
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
      const sanitizedQuery = filters.query.replace(/['"\\]/g, '').substring(0, 100)
      query = query.or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1)

    return query
  }
}

export const applicationService = {
  async create(data: any) {
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

  async update(id: string, data: any) {
    return await supabase
      .from('applications')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  },

  async delete(id: string) {
    return await supabase
      .from('applications')
      .delete()
      .eq('id', id)
  },

  async getByJob(jobId: string) {
    return await supabase
      .from('applications')
      .select(`
        *,
        individual_profiles (
          user_profiles (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false })
  }
}

export const messageService = {
  async create(data: any) {
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

  async getConversation(userId: string, otherUserId: string) {
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
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: true })
  }
}

export const userProfileService = {
  async getById(id: string) {
    return await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single()
  },

  async update(id: string, data: any) {
    return await supabase
      .from('user_profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }
}

export const individualProfileService = {
  async getById(id: string) {
    return await supabase
      .from('individual_profiles')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('id', id)
      .single()
  }
}

export const companyProfileService = {
  async getById(id: string) {
    return await supabase
      .from('company_profiles')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('id', id)
      .single()
  }
}

export const skillService = {
  async getAll() {
    return await supabase
      .from('skills')
      .select('*')
      .order('name')
  }
}

export const userSkillService = {
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
  }
}

export const cvDocumentService = {
  async create(data: any) {
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

  async update(id: string, data: any) {
    return await supabase
      .from('cv_documents')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }
}