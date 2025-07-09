import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
  headline: string
  summary: string
  location: string
  profilePicture: string
  experience: LinkedInExperience[]
  education: LinkedInEducation[]
  skills: string[]
  certifications: LinkedInCertification[]
  languages: LinkedInLanguage[]
  connections: number
  publicProfileUrl: string
}

export interface LinkedInExperience {
  title: string
  company: string
  companyLogo?: string
  location: string
  startDate: string
  endDate?: string
  description: string
  skills: string[]
}

export interface LinkedInEducation {
  school: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  description?: string
}

export interface LinkedInCertification {
  name: string
  organization: string
  issueDate: string
  expirationDate?: string
  credentialId?: string
  credentialUrl?: string
}

export interface LinkedInLanguage {
  name: string
  proficiency: 'elementary' | 'limited_working' | 'professional_working' | 'full_professional' | 'native'
}

export interface LinkedInJobPost {
  title: string
  description: string
  company: string
  location: string
  employmentType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary'
  workplaceType: 'remote' | 'on_site' | 'hybrid'
  industry: string
  experienceLevel: 'entry_level' | 'associate' | 'mid_senior' | 'director' | 'executive'
  function: string
  skills: string[]
  salaryRange?: {
    min: number
    max: number
    currency: string
  }
  benefits?: string[]
  applicationUrl?: string
  companyLogo?: string
  companySize?: string
  companyWebsite?: string
}

export class LinkedInIntegration {
  private clientId: string
  private clientSecret: string
  private redirectUri: string
  private scope = 'r_liteprofile r_emailaddress w_member_social rw_organization_admin r_organization_social'

  constructor() {
    this.clientId = process.env.LINKEDIN_CLIENT_ID!
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET!
    this.redirectUri = process.env.LINKEDIN_REDIRECT_URI!
  }

  // Generate LinkedIn OAuth URL
  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
      scope: this.scope
    })

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`LinkedIn token exchange failed: ${data.error_description}`)
    }

    return data.access_token
  }

  // Get LinkedIn profile data
  async getProfile(accessToken: string): Promise<LinkedInProfile> {
    const [profileResponse, emailResponse] = await Promise.all([
      fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,summary,location,profilePicture(displayImage~:playableStreams))', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }),
      fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      })
    ])

    const [profileData, emailData] = await Promise.all([
      profileResponse.json(),
      emailResponse.json()
    ])

    if (!profileResponse.ok) {
      throw new Error(`LinkedIn profile fetch failed: ${profileData.message}`)
    }

    // Get additional profile information
    const [experienceResponse, educationResponse, skillsResponse] = await Promise.all([
      this.getExperience(accessToken),
      this.getEducation(accessToken),
      this.getSkills(accessToken)
    ])

    const email = emailData.elements?.[0]?.['handle~']?.emailAddress || ''
    const profilePicture = profileData.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier || ''

    return {
      id: profileData.id,
      firstName: profileData.firstName?.localized?.en_US || '',
      lastName: profileData.lastName?.localized?.en_US || '',
      headline: profileData.headline?.localized?.en_US || '',
      summary: profileData.summary?.localized?.en_US || '',
      location: profileData.location?.country?.localized?.en_US || '',
      profilePicture,
      experience: experienceResponse,
      education: educationResponse,
      skills: skillsResponse,
      certifications: [],
      languages: [],
      connections: 0,
      publicProfileUrl: `https://www.linkedin.com/in/${profileData.id}`
    }
  }

  // Get LinkedIn experience
  private async getExperience(accessToken: string): Promise<LinkedInExperience[]> {
    const response = await fetch('https://api.linkedin.com/v2/people/~/positions', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.warn('LinkedIn experience fetch failed:', data.message)
      return []
    }

    return data.elements?.map((position: any) => ({
      title: position.title?.localized?.en_US || '',
      company: position.companyName?.localized?.en_US || '',
      companyLogo: position.company?.logo?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier || '',
      location: position.location?.country?.localized?.en_US || '',
      startDate: this.formatLinkedInDate(position.timePeriod?.startDate),
      endDate: position.timePeriod?.endDate ? this.formatLinkedInDate(position.timePeriod.endDate) : undefined,
      description: position.description?.localized?.en_US || '',
      skills: []
    })) || []
  }

  // Get LinkedIn education
  private async getEducation(accessToken: string): Promise<LinkedInEducation[]> {
    const response = await fetch('https://api.linkedin.com/v2/people/~/educations', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.warn('LinkedIn education fetch failed:', data.message)
      return []
    }

    return data.elements?.map((education: any) => ({
      school: education.schoolName?.localized?.en_US || '',
      degree: education.degreeName?.localized?.en_US || '',
      field: education.fieldOfStudy?.localized?.en_US || '',
      startDate: this.formatLinkedInDate(education.timePeriod?.startDate),
      endDate: education.timePeriod?.endDate ? this.formatLinkedInDate(education.timePeriod.endDate) : undefined,
      description: education.description?.localized?.en_US || ''
    })) || []
  }

  // Get LinkedIn skills
  private async getSkills(accessToken: string): Promise<string[]> {
    const response = await fetch('https://api.linkedin.com/v2/people/~/skills', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.warn('LinkedIn skills fetch failed:', data.message)
      return []
    }

    return data.elements?.map((skill: any) => skill.name?.localized?.en_US || '').filter(Boolean) || []
  }

  // Format LinkedIn date
  private formatLinkedInDate(date: any): string {
    if (!date) return ''
    
    const year = date.year || new Date().getFullYear()
    const month = date.month || 1
    
    return `${year}-${String(month).padStart(2, '0')}-01`
  }

  // Import LinkedIn profile to job board
  async importProfile(userId: string, accessToken: string): Promise<void> {
    try {
      const linkedInProfile = await this.getProfile(accessToken)
      
      // Update user profile
      await supabase
        .from('user_profiles')
        .update({
          first_name: linkedInProfile.firstName,
          last_name: linkedInProfile.lastName,
          profile_picture_url: linkedInProfile.profilePicture,
          linkedin_url: linkedInProfile.publicProfileUrl
        })
        .eq('id', userId)

      // Update individual profile if exists
      const { data: individualProfile } = await supabase
        .from('individual_profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (individualProfile) {
        await supabase
          .from('individual_profiles')
          .update({
            bio: linkedInProfile.summary,
            current_job_title: linkedInProfile.headline,
            location: linkedInProfile.location,
            experience: linkedInProfile.experience.map(exp => ({
              title: exp.title,
              company: exp.company,
              location: exp.location,
              startDate: exp.startDate,
              endDate: exp.endDate,
              description: exp.description
            })),
            education: linkedInProfile.education.map(edu => ({
              degree: edu.degree,
              institution: edu.school,
              field: edu.field,
              startDate: edu.startDate,
              endDate: edu.endDate
            }))
          })
          .eq('id', userId)

        // Import skills
        for (const skillName of linkedInProfile.skills) {
          // Check if skill exists, create if not
          let { data: skill } = await supabase
            .from('skills')
            .select('id')
            .eq('name', skillName)
            .single()

          if (!skill) {
            const { data: newSkill } = await supabase
              .from('skills')
              .insert({ name: skillName, category: 'general' })
              .select('id')
              .single()
            
            skill = newSkill
          }

          if (skill) {
            // Add skill to user
            await supabase
              .from('user_skills')
              .upsert({
                user_id: userId,
                skill_id: skill.id,
                proficiency_level: 'intermediate',
                years_of_experience: 1
              })
          }
        }
      }

      // Store LinkedIn integration data
      await supabase
        .from('user_integrations')
        .upsert({
          user_id: userId,
          integration_type: 'linkedin',
          integration_data: {
            profile_id: linkedInProfile.id,
            last_sync: new Date().toISOString(),
            profile_url: linkedInProfile.publicProfileUrl
          },
          is_active: true
        })

    } catch (error) {
      console.error('LinkedIn profile import failed:', error)
      throw error
    }
  }

  // Post job to LinkedIn
  async postJobToLinkedIn(accessToken: string, jobData: LinkedInJobPost): Promise<string> {
    const shareContent = {
      author: `urn:li:person:${await this.getCurrentUserId(accessToken)}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: `🚀 New Job Opportunity: ${jobData.title}\n\n${jobData.description.slice(0, 200)}...\n\nApply now: ${jobData.applicationUrl}\n\n#hiring #jobs #careers`
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    }

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(shareContent)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`LinkedIn job posting failed: ${data.message}`)
    }

    return data.id
  }

  // Get current user ID
  private async getCurrentUserId(accessToken: string): Promise<string> {
    const response = await fetch('https://api.linkedin.com/v2/people/~:(id)', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`LinkedIn user ID fetch failed: ${data.message}`)
    }

    return data.id
  }

  // Search LinkedIn for candidates
  async searchCandidates(accessToken: string, query: {
    keywords?: string
    location?: string
    industry?: string
    experience?: string
    skills?: string[]
  }): Promise<any[]> {
    // Note: LinkedIn's People Search API requires special permissions
    // This is a simplified implementation for demonstration
    const searchParams = new URLSearchParams({
      keywords: query.keywords || '',
      location: query.location || '',
      count: '25',
      start: '0'
    })

    const response = await fetch(`https://api.linkedin.com/v2/people-search?${searchParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`LinkedIn candidate search failed: ${data.message}`)
    }

    return data.elements || []
  }

  // Sync LinkedIn profile data periodically
  async syncProfile(userId: string, accessToken: string): Promise<void> {
    try {
      // Get current integration data
      const { data: integration } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('integration_type', 'linkedin')
        .single()

      if (!integration) {
        throw new Error('LinkedIn integration not found')
      }

      // Re-import profile data
      await this.importProfile(userId, accessToken)

      // Update last sync time
      await supabase
        .from('user_integrations')
        .update({
          integration_data: {
            ...integration.integration_data,
            last_sync: new Date().toISOString()
          }
        })
        .eq('user_id', userId)
        .eq('integration_type', 'linkedin')

    } catch (error) {
      console.error('LinkedIn profile sync failed:', error)
      throw error
    }
  }
}

export const linkedInIntegration = new LinkedInIntegration()