import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ATSJob {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  department: string
  employment_type: string
  experience_level: string
  salary_range?: {
    min: number
    max: number
    currency: string
  }
  posted_date: string
  closing_date?: string
  application_url: string
  company_name: string
  company_logo?: string
  skills: string[]
  benefits?: string[]
  remote_ok: boolean
  status: 'active' | 'paused' | 'closed'
}

export interface ATSCandidate {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  resume_url?: string
  cover_letter?: string
  application_date: string
  status: string
  rating?: number
  notes?: string
  skills: string[]
  experience: any[]
  education: any[]
  source: string
}

export interface ATSIntegrationConfig {
  system_type: 'greenhouse' | 'workday' | 'lever' | 'bamboohr' | 'smartrecruiters' | 'jobvite' | 'custom'
  api_endpoint: string
  api_key: string
  username?: string
  password?: string
  additional_config?: Record<string, any>
}

export class ATSIntegration {
  private config: ATSIntegrationConfig

  constructor(config: ATSIntegrationConfig) {
    this.config = config
  }

  // Generic ATS authentication
  async authenticate(): Promise<string> {
    switch (this.config.system_type) {
      case 'greenhouse':
        return await this.authenticateGreenhouse()
      case 'workday':
        return await this.authenticateWorkday()
      case 'lever':
        return await this.authenticateLever()
      case 'bamboohr':
        return await this.authenticateBambooHR()
      case 'smartrecruiters':
        return await this.authenticateSmartRecruiters()
      case 'jobvite':
        return await this.authenticateJobvite()
      default:
        return this.config.api_key
    }
  }

  // Greenhouse authentication
  private async authenticateGreenhouse(): Promise<string> {
    // Greenhouse uses API key authentication
    return this.config.api_key
  }

  // Workday authentication
  private async authenticateWorkday(): Promise<string> {
    const response = await fetch(`${this.config.api_endpoint}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.config.username,
        password: this.config.password
      })
    })

    if (!response.ok) {
      throw new Error('Workday authentication failed')
    }

    const data = await response.json()
    return data.access_token
  }

  // Lever authentication
  private async authenticateLever(): Promise<string> {
    // Lever uses API key authentication
    return this.config.api_key
  }

  // BambooHR authentication
  private async authenticateBambooHR(): Promise<string> {
    // BambooHR uses API key authentication
    return this.config.api_key
  }

  // SmartRecruiters authentication
  private async authenticateSmartRecruiters(): Promise<string> {
    const response = await fetch(`${this.config.api_endpoint}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.config.username!,
        client_secret: this.config.password!
      })
    })

    if (!response.ok) {
      throw new Error('SmartRecruiters authentication failed')
    }

    const data = await response.json()
    return data.access_token
  }

  // Jobvite authentication
  private async authenticateJobvite(): Promise<string> {
    // Jobvite uses API key authentication
    return this.config.api_key
  }

  // Get jobs from ATS
  async getJobs(): Promise<ATSJob[]> {
    const token = await this.authenticate()
    
    switch (this.config.system_type) {
      case 'greenhouse':
        return await this.getGreenhouseJobs(token)
      case 'workday':
        return await this.getWorkdayJobs(token)
      case 'lever':
        return await this.getLeverJobs(token)
      case 'bamboohr':
        return await this.getBambooHRJobs(token)
      case 'smartrecruiters':
        return await this.getSmartRecruitersJobs(token)
      case 'jobvite':
        return await this.getJobviteJobs(token)
      default:
        return []
    }
  }

  // Get candidates from ATS
  async getCandidates(jobId?: string): Promise<ATSCandidate[]> {
    const token = await this.authenticate()
    
    switch (this.config.system_type) {
      case 'greenhouse':
        return await this.getGreenhouseCandidates(token, jobId)
      case 'workday':
        return await this.getWorkdayCandidates(token, jobId)
      case 'lever':
        return await this.getLeverCandidates(token, jobId)
      case 'bamboohr':
        return await this.getBambooHRCandidates(token, jobId)
      case 'smartrecruiters':
        return await this.getSmartRecruitersApplicants(token, jobId)
      case 'jobvite':
        return await this.getJobviteCandidates(token, jobId)
      default:
        return []
    }
  }

  // Greenhouse implementation
  private async getGreenhouseJobs(token: string): Promise<ATSJob[]> {
    const response = await fetch(`${this.config.api_endpoint}/v1/jobs`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(token + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Greenhouse jobs')
    }

    const data = await response.json()
    return data.map((job: any) => ({
      id: job.id.toString(),
      title: job.name,
      description: job.notes || '',
      requirements: job.requisition_id || '',
      location: job.offices?.[0]?.name || '',
      department: job.departments?.[0]?.name || '',
      employment_type: job.custom_fields?.employment_type || 'full_time',
      experience_level: job.custom_fields?.experience_level || 'mid_level',
      posted_date: job.created_at,
      closing_date: job.closed_at,
      application_url: job.absolute_url,
      company_name: 'Company', // Would need to fetch from company API
      skills: [],
      remote_ok: job.custom_fields?.remote_ok || false,
      status: job.status === 'open' ? 'active' : 'closed'
    }))
  }

  private async getGreenhouseCandidates(token: string, jobId?: string): Promise<ATSCandidate[]> {
    let url = `${this.config.api_endpoint}/v1/candidates`
    if (jobId) {
      url += `?job_id=${jobId}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(token + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Greenhouse candidates')
    }

    const data = await response.json()
    return data.map((candidate: any) => ({
      id: candidate.id.toString(),
      first_name: candidate.first_name,
      last_name: candidate.last_name,
      email: candidate.email_addresses?.[0]?.value || '',
      phone: candidate.phone_numbers?.[0]?.value || '',
      resume_url: candidate.attachments?.find((a: any) => a.type === 'resume')?.url,
      application_date: candidate.created_at,
      status: candidate.last_activity?.status || 'applied',
      skills: candidate.custom_fields?.skills || [],
      experience: [],
      education: [],
      source: 'greenhouse'
    }))
  }

  // Workday implementation
  private async getWorkdayJobs(token: string): Promise<ATSJob[]> {
    const response = await fetch(`${this.config.api_endpoint}/jobs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Workday jobs')
    }

    const data = await response.json()
    return data.jobs?.map((job: any) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      requirements: job.qualifications || '',
      location: job.location,
      department: job.department,
      employment_type: job.employmentType || 'full_time',
      experience_level: job.experienceLevel || 'mid_level',
      posted_date: job.postedDate,
      closing_date: job.closingDate,
      application_url: job.applicationUrl,
      company_name: job.company,
      skills: job.skills || [],
      remote_ok: job.remoteWork || false,
      status: job.status === 'open' ? 'active' : 'closed'
    })) || []
  }

  private async getWorkdayCandidates(token: string, jobId?: string): Promise<ATSCandidate[]> {
    let url = `${this.config.api_endpoint}/candidates`
    if (jobId) {
      url += `?jobId=${jobId}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Workday candidates')
    }

    const data = await response.json()
    return data.candidates?.map((candidate: any) => ({
      id: candidate.id,
      first_name: candidate.firstName,
      last_name: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      resume_url: candidate.resumeUrl,
      application_date: candidate.applicationDate,
      status: candidate.status,
      skills: candidate.skills || [],
      experience: candidate.experience || [],
      education: candidate.education || [],
      source: 'workday'
    })) || []
  }

  // Lever implementation
  private async getLeverJobs(token: string): Promise<ATSJob[]> {
    const response = await fetch(`${this.config.api_endpoint}/v1/postings`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(token + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Lever jobs')
    }

    const data = await response.json()
    return data.data?.map((job: any) => ({
      id: job.id,
      title: job.text,
      description: job.content.description || '',
      requirements: job.content.requirements || '',
      location: job.categories.location || '',
      department: job.categories.department || '',
      employment_type: job.categories.commitment || 'full_time',
      experience_level: job.categories.level || 'mid_level',
      posted_date: job.createdAt,
      closing_date: job.closingDate,
      application_url: job.applyUrl,
      company_name: 'Company',
      skills: [],
      remote_ok: job.workplaceType === 'remote',
      status: job.state === 'published' ? 'active' : 'closed'
    })) || []
  }

  private async getLeverCandidates(token: string, jobId?: string): Promise<ATSCandidate[]> {
    let url = `${this.config.api_endpoint}/v1/opportunities`
    if (jobId) {
      url += `?posting_id=${jobId}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(token + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Lever candidates')
    }

    const data = await response.json()
    return data.data?.map((opportunity: any) => ({
      id: opportunity.id,
      first_name: opportunity.contact?.name?.split(' ')[0] || '',
      last_name: opportunity.contact?.name?.split(' ').slice(1).join(' ') || '',
      email: opportunity.contact?.email || '',
      phone: opportunity.contact?.phone || '',
      resume_url: opportunity.resume?.url,
      application_date: opportunity.createdAt,
      status: opportunity.stage,
      skills: [],
      experience: [],
      education: [],
      source: 'lever'
    })) || []
  }

  // BambooHR implementation
  private async getBambooHRJobs(token: string): Promise<ATSJob[]> {
    const response = await fetch(`${this.config.api_endpoint}/v1/applicant_tracking/jobs`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(token + ':x').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch BambooHR jobs')
    }

    const data = await response.json()
    return data.jobs?.map((job: any) => ({
      id: job.id.toString(),
      title: job.jobTitle,
      description: job.description || '',
      requirements: job.requirements || '',
      location: job.location,
      department: job.department,
      employment_type: job.employmentType || 'full_time',
      experience_level: job.experienceLevel || 'mid_level',
      posted_date: job.dateCreated,
      closing_date: job.closingDate,
      application_url: job.applicationUrl,
      company_name: 'Company',
      skills: [],
      remote_ok: job.remote || false,
      status: job.status === 'active' ? 'active' : 'closed'
    })) || []
  }

  private async getBambooHRCandidates(token: string, jobId?: string): Promise<ATSCandidate[]> {
    let url = `${this.config.api_endpoint}/v1/applicant_tracking/applications`
    if (jobId) {
      url += `?jobId=${jobId}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(token + ':x').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch BambooHR candidates')
    }

    const data = await response.json()
    return data.applications?.map((app: any) => ({
      id: app.id.toString(),
      first_name: app.firstName,
      last_name: app.lastName,
      email: app.email,
      phone: app.phone,
      resume_url: app.resumeUrl,
      application_date: app.dateCreated,
      status: app.status,
      skills: [],
      experience: [],
      education: [],
      source: 'bamboohr'
    })) || []
  }

  // SmartRecruiters implementation
  private async getSmartRecruitersJobs(token: string): Promise<ATSJob[]> {
    const response = await fetch(`${this.config.api_endpoint}/v1/jobs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch SmartRecruiters jobs')
    }

    const data = await response.json()
    return data.content?.map((job: any) => ({
      id: job.id,
      title: job.name,
      description: job.jobDescription || '',
      requirements: job.qualifications || '',
      location: job.location?.city || '',
      department: job.department?.label || '',
      employment_type: job.typeOfEmployment?.label || 'full_time',
      experience_level: job.experienceLevel?.label || 'mid_level',
      posted_date: job.releasedDate,
      closing_date: job.closingDate,
      application_url: job.applyUrl,
      company_name: job.company?.name || 'Company',
      skills: job.skills?.map((s: any) => s.name) || [],
      remote_ok: job.remote || false,
      status: job.jobStatus?.label === 'PUBLISHED' ? 'active' : 'closed'
    })) || []
  }

  private async getSmartRecruitersApplicants(token: string, jobId?: string): Promise<ATSCandidate[]> {
    if (!jobId) {
      return []
    }

    const response = await fetch(`${this.config.api_endpoint}/v1/jobs/${jobId}/candidates`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch SmartRecruiters candidates')
    }

    const data = await response.json()
    return data.content?.map((candidate: any) => ({
      id: candidate.id,
      first_name: candidate.firstName,
      last_name: candidate.lastName,
      email: candidate.email,
      phone: candidate.phoneNumber,
      resume_url: candidate.resumeUrl,
      application_date: candidate.createdOn,
      status: candidate.status?.label || 'applied',
      skills: candidate.skills?.map((s: any) => s.name) || [],
      experience: candidate.experience || [],
      education: candidate.education || [],
      source: 'smartrecruiters'
    })) || []
  }

  // Jobvite implementation
  private async getJobviteJobs(token: string): Promise<ATSJob[]> {
    const response = await fetch(`${this.config.api_endpoint}/v2/job`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Jobvite jobs')
    }

    const data = await response.json()
    return data.jobs?.map((job: any) => ({
      id: job.eId,
      title: job.title,
      description: job.description || '',
      requirements: job.requirements || '',
      location: job.location,
      department: job.department,
      employment_type: job.employmentType || 'full_time',
      experience_level: job.experienceLevel || 'mid_level',
      posted_date: job.datePosted,
      closing_date: job.closingDate,
      application_url: job.applyUrl,
      company_name: 'Company',
      skills: [],
      remote_ok: job.remote || false,
      status: job.status === 'Open' ? 'active' : 'closed'
    })) || []
  }

  private async getJobviteCandidates(token: string, jobId?: string): Promise<ATSCandidate[]> {
    let url = `${this.config.api_endpoint}/v2/application`
    if (jobId) {
      url += `?jobId=${jobId}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Jobvite candidates')
    }

    const data = await response.json()
    return data.applications?.map((app: any) => ({
      id: app.eId,
      first_name: app.candidate?.firstName || '',
      last_name: app.candidate?.lastName || '',
      email: app.candidate?.email || '',
      phone: app.candidate?.phone || '',
      resume_url: app.candidate?.resumeUrl,
      application_date: app.dateApplied,
      status: app.status,
      skills: [],
      experience: [],
      education: [],
      source: 'jobvite'
    })) || []
  }

  // Sync jobs from ATS to job board
  async syncJobs(companyId: string): Promise<void> {
    try {
      const atsJobs = await this.getJobs()
      
      for (const atsJob of atsJobs) {
        // Check if job already exists
        const { data: existingJob } = await supabase
          .from('jobs')
          .select('id')
          .eq('company_id', companyId)
          .eq('ats_job_id', atsJob.id)
          .single()

        if (existingJob) {
          // Update existing job
          await supabase
            .from('jobs')
            .update({
              title: atsJob.title,
              description: atsJob.description,
              requirements: atsJob.requirements,
              location: atsJob.location,
              job_type: atsJob.employment_type,
              experience_level: atsJob.experience_level,
              status: atsJob.status,
              application_deadline: atsJob.closing_date,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingJob.id)
        } else {
          // Create new job
          await supabase
            .from('jobs')
            .insert({
              company_id: companyId,
              title: atsJob.title,
              description: atsJob.description,
              requirements: atsJob.requirements,
              location: atsJob.location,
              job_type: atsJob.employment_type,
              experience_level: atsJob.experience_level,
              status: atsJob.status,
              application_deadline: atsJob.closing_date,
              ats_job_id: atsJob.id,
              ats_source: this.config.system_type,
              created_at: new Date().toISOString()
            })
        }
      }

      // Update integration sync time
      await supabase
        .from('ats_integrations')
        .update({
          last_sync: new Date().toISOString(),
          sync_status: 'completed'
        })
        .eq('company_id', companyId)
        .eq('ats_type', this.config.system_type)

    } catch (error) {
      console.error('ATS job sync failed:', error)
      
      // Update integration sync status
      await supabase
        .from('ats_integrations')
        .update({
          sync_status: 'failed',
          last_error: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('company_id', companyId)
        .eq('ats_type', this.config.system_type)
      
      throw error
    }
  }

  // Sync candidates from ATS to job board
  async syncCandidates(companyId: string, jobId?: string): Promise<void> {
    try {
      const atsCandidates = await this.getCandidates(jobId)
      
      for (const atsCandidate of atsCandidates) {
        // Check if candidate already exists
        const { data: existingCandidate } = await supabase
          .from('applications')
          .select('id')
          .eq('ats_candidate_id', atsCandidate.id)
          .single()

        if (existingCandidate) {
          // Update existing candidate
          await supabase
            .from('applications')
            .update({
              status: atsCandidate.status,
              recruiter_notes: atsCandidate.notes,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingCandidate.id)
        } else {
          // Create new application record
          if (jobId) {
            await supabase
              .from('applications')
              .insert({
                job_id: jobId,
                candidate_id: atsCandidate.id, // This would need to be mapped to internal user ID
                status: atsCandidate.status,
                applied_at: atsCandidate.application_date,
                ats_candidate_id: atsCandidate.id,
                ats_source: this.config.system_type,
                created_at: new Date().toISOString()
              })
          }
        }
      }

    } catch (error) {
      console.error('ATS candidate sync failed:', error)
      throw error
    }
  }
}

// ATS Integration Manager
export class ATSIntegrationManager {
  // Create ATS integration
  static async createIntegration(companyId: string, config: ATSIntegrationConfig): Promise<void> {
    try {
      // Test connection
      const atsIntegration = new ATSIntegration(config)
      await atsIntegration.authenticate()

      // Store integration config
      await supabase
        .from('ats_integrations')
        .insert({
          company_id: companyId,
          ats_type: config.system_type,
          api_endpoint: config.api_endpoint,
          encrypted_credentials: JSON.stringify({
            api_key: config.api_key,
            username: config.username,
            password: config.password
          }),
          additional_config: config.additional_config,
          is_active: true,
          created_at: new Date().toISOString()
        })

    } catch (error) {
      console.error('ATS integration creation failed:', error)
      throw error
    }
  }

  // Get ATS integration for company
  static async getIntegration(companyId: string, atsType: string): Promise<ATSIntegration | null> {
    try {
      const { data: integration } = await supabase
        .from('ats_integrations')
        .select('*')
        .eq('company_id', companyId)
        .eq('ats_type', atsType)
        .eq('is_active', true)
        .single()

      if (!integration) return null

      const credentials = JSON.parse(integration.encrypted_credentials)
      const config: ATSIntegrationConfig = {
        system_type: integration.ats_type as any,
        api_endpoint: integration.api_endpoint,
        api_key: credentials.api_key,
        username: credentials.username,
        password: credentials.password,
        additional_config: integration.additional_config
      }

      return new ATSIntegration(config)

    } catch (error) {
      console.error('ATS integration fetch failed:', error)
      return null
    }
  }

  // Sync all integrations for company
  static async syncAll(companyId: string): Promise<void> {
    try {
      const { data: integrations } = await supabase
        .from('ats_integrations')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)

      for (const integration of integrations || []) {
        const atsIntegration = await this.getIntegration(companyId, integration.ats_type)
        if (atsIntegration) {
          await atsIntegration.syncJobs(companyId)
        }
      }

    } catch (error) {
      console.error('ATS sync all failed:', error)
      throw error
    }
  }
}

export { ATSIntegrationManager as atsIntegrationManager }