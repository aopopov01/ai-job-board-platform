import { Octokit } from '@octokit/rest'

export interface GitHubJobPosting {
  id: string
  title: string
  company: string
  description: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'freelance'
  experience_level: 'entry' | 'mid' | 'senior' | 'lead'
  skills: string[]
  salary_range?: {
    min: number
    max: number
    currency: string
  }
  remote_friendly: boolean
  repository_url?: string
  contact_email?: string
  posted_at: string
  expires_at?: string
}

export interface GitHubIntegrationConfig {
  token?: string
  organization?: string
  repository?: string
  label?: string
}

export class GitHubJobsIntegration {
  private octokit: Octokit | null = null
  private config: GitHubIntegrationConfig

  constructor(config: GitHubIntegrationConfig = {}) {
    this.config = config
    
    if (config.token) {
      this.octokit = new Octokit({
        auth: config.token,
      })
    }
  }

  /**
   * Search for developer job postings across GitHub repositories
   */
  async searchDeveloperJobs(query: string = 'hiring developers'): Promise<GitHubJobPosting[]> {
    if (!this.octokit) {
      throw new Error('GitHub token not configured')
    }

    try {
      // Search for repositories with job postings
      const searchResults = await this.octokit.rest.search.repos({
        q: `${query} job career hiring`,
        sort: 'updated',
        order: 'desc',
        per_page: 30
      })

      const jobs: GitHubJobPosting[] = []

      for (const repo of searchResults.data.items) {
        try {
          // Look for README files that might contain job postings
          const readme = await this.getRepositoryReadme(repo.owner.login, repo.name)
          if (readme && this.containsJobPosting(readme)) {
            const jobPosting = this.parseJobFromReadme(readme, repo)
            if (jobPosting) {
              jobs.push(jobPosting)
            }
          }

          // Look for issues labeled with job-related tags
          const issues = await this.getJobIssues(repo.owner.login, repo.name)
          jobs.push(...issues)
        } catch (error) {
          // Continue with other repositories if one fails
          console.warn(`Failed to process repository ${repo.full_name}:`, error)
        }
      }

      return jobs
    } catch (error) {
      console.error('Error searching GitHub for developer jobs:', error)
      throw error
    }
  }

  /**
   * Get job postings from GitHub issues
   */
  async searchJobIssues(org?: string): Promise<GitHubJobPosting[]> {
    if (!this.octokit) {
      throw new Error('GitHub token not configured')
    }

    const searchQuery = org 
      ? `org:${org} is:issue is:open label:job,hiring,career,work`
      : 'is:issue is:open label:job,hiring,career,work'

    try {
      const issues = await this.octokit.rest.search.issues({
        q: searchQuery,
        sort: 'updated',
        order: 'desc',
        per_page: 50
      })

      return issues.data.items.map(issue => this.parseJobFromIssue(issue))
    } catch (error) {
      console.error('Error searching GitHub issues for jobs:', error)
      throw error
    }
  }

  /**
   * Post a job to GitHub as an issue
   */
  async postJobIssue(job: Partial<GitHubJobPosting>, owner: string, repo: string): Promise<string> {
    if (!this.octokit) {
      throw new Error('GitHub token not configured')
    }

    const issueBody = this.formatJobAsIssue(job)
    
    try {
      const issue = await this.octokit.rest.issues.create({
        owner,
        repo,
        title: `[JOB] ${job.title} - ${job.company}`,
        body: issueBody,
        labels: ['job', 'hiring', job.type || 'full-time', job.experience_level || 'mid']
      })

      return issue.data.html_url
    } catch (error) {
      console.error('Error posting job to GitHub:', error)
      throw error
    }
  }

  /**
   * Sync jobs from a specific repository
   */
  async syncRepositoryJobs(owner: string, repo: string): Promise<GitHubJobPosting[]> {
    if (!this.octokit) {
      throw new Error('GitHub token not configured')
    }

    const jobs: GitHubJobPosting[] = []

    try {
      // Get job issues
      const issues = await this.getJobIssues(owner, repo)
      jobs.push(...issues)

      // Check README for job postings
      const readme = await this.getRepositoryReadme(owner, repo)
      if (readme && this.containsJobPosting(readme)) {
        const jobPosting = this.parseJobFromReadme(readme, { owner: { login: owner }, name: repo })
        if (jobPosting) {
          jobs.push(jobPosting)
        }
      }

      return jobs
    } catch (error) {
      console.error(`Error syncing jobs from ${owner}/${repo}:`, error)
      throw error
    }
  }

  private async getRepositoryReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const readme = await this.octokit!.rest.repos.getReadme({
        owner,
        repo
      })
      
      return Buffer.from(readme.data.content, 'base64').toString('utf8')
    } catch (error) {
      return null
    }
  }

  private async getJobIssues(owner: string, repo: string): Promise<GitHubJobPosting[]> {
    try {
      const issues = await this.octokit!.rest.issues.listForRepo({
        owner,
        repo,
        labels: 'job,hiring,career,work',
        state: 'open',
        per_page: 20
      })

      return issues.data.map(issue => this.parseJobFromIssue(issue))
    } catch (error) {
      return []
    }
  }

  private containsJobPosting(readme: string): boolean {
    const jobKeywords = [
      'hiring', 'job', 'career', 'position', 'opening',
      'developer', 'engineer', 'programmer', 'architect',
      'full-time', 'part-time', 'contract', 'freelance',
      'remote', 'work from home', 'apply now'
    ]

    const lowerReadme = readme.toLowerCase()
    return jobKeywords.some(keyword => lowerReadme.includes(keyword))
  }

  private parseJobFromReadme(readme: string, repo: any): GitHubJobPosting | null {
    // Extract job information from README using regex patterns
    const titleMatch = readme.match(/(?:hiring|job|position)[:.\s]+([^\n]+)/i)
    const locationMatch = readme.match(/(?:location|based in|office)[:.\s]+([^\n]+)/i)
    const emailMatch = readme.match(/(?:contact|email|apply)[:.\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)

    return {
      id: `github-readme-${repo.owner.login}-${repo.name}`,
      title: titleMatch?.[1]?.trim() || 'Developer Position',
      company: repo.owner.login,
      description: readme.substring(0, 500) + '...',
      location: locationMatch?.[1]?.trim() || 'Remote',
      type: this.extractJobType(readme),
      experience_level: this.extractExperienceLevel(readme),
      skills: this.extractSkills(readme),
      remote_friendly: this.isRemoteFriendly(readme),
      repository_url: `https://github.com/${repo.owner.login}/${repo.name}`,
      contact_email: emailMatch?.[1],
      posted_at: new Date().toISOString()
    }
  }

  private parseJobFromIssue(issue: any): GitHubJobPosting {
    return {
      id: `github-issue-${issue.id}`,
      title: issue.title.replace(/^\[JOB\]\s*/, ''),
      company: issue.repository_url?.split('/')[4] || 'Unknown',
      description: issue.body || '',
      location: this.extractLocation(issue.body || ''),
      type: this.extractJobType(issue.body || ''),
      experience_level: this.extractExperienceLevel(issue.body || ''),
      skills: this.extractSkills(issue.body || ''),
      remote_friendly: this.isRemoteFriendly(issue.body || ''),
      repository_url: issue.repository_url,
      posted_at: issue.created_at,
      expires_at: issue.milestone?.due_on
    }
  }

  private extractJobType(text: string): 'full-time' | 'part-time' | 'contract' | 'freelance' {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('contract') || lowerText.includes('contractor')) return 'contract'
    if (lowerText.includes('freelance') || lowerText.includes('freelancer')) return 'freelance'
    if (lowerText.includes('part-time') || lowerText.includes('part time')) return 'part-time'
    return 'full-time'
  }

  private extractExperienceLevel(text: string): 'entry' | 'mid' | 'senior' | 'lead' {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('senior') || lowerText.includes('sr.')) return 'senior'
    if (lowerText.includes('lead') || lowerText.includes('principal')) return 'lead'
    if (lowerText.includes('entry') || lowerText.includes('junior') || lowerText.includes('jr.')) return 'entry'
    return 'mid'
  }

  private extractSkills(text: string): string[] {
    const skillKeywords = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'python',
      'java', 'go', 'rust', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin',
      'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'mongodb', 'postgresql',
      'mysql', 'redis', 'graphql', 'rest api', 'microservices', 'devops'
    ]

    const lowerText = text.toLowerCase()
    return skillKeywords.filter(skill => lowerText.includes(skill))
  }

  private extractLocation(text: string): string {
    const locationMatch = text.match(/(?:location|based in|office)[:.\s]+([^\n]+)/i)
    return locationMatch?.[1]?.trim() || (this.isRemoteFriendly(text) ? 'Remote' : 'Not specified')
  }

  private isRemoteFriendly(text: string): boolean {
    const remoteKeywords = ['remote', 'work from home', 'distributed', 'anywhere', 'wfh']
    const lowerText = text.toLowerCase()
    return remoteKeywords.some(keyword => lowerText.includes(keyword))
  }

  private formatJobAsIssue(job: Partial<GitHubJobPosting>): string {
    return `
## Position: ${job.title}
**Company:** ${job.company}
**Location:** ${job.location}
**Type:** ${job.type}
**Experience Level:** ${job.experience_level}
**Remote Friendly:** ${job.remote_friendly ? 'Yes' : 'No'}

### Description
${job.description}

### Required Skills
${job.skills?.join(', ') || 'Not specified'}

${job.salary_range ? `### Salary Range
$${job.salary_range.min.toLocaleString()} - $${job.salary_range.max.toLocaleString()} ${job.salary_range.currency}` : ''}

### Contact
${job.contact_email ? `Email: ${job.contact_email}` : 'Please see repository for contact information'}

---
*This job posting was created via TalentAIze GitHub Integration*
    `.trim()
  }
}

// Export utility functions
export function createGitHubIntegration(config?: GitHubIntegrationConfig): GitHubJobsIntegration {
  return new GitHubJobsIntegration(config)
}

export async function searchGitHubJobs(token: string, query?: string): Promise<GitHubJobPosting[]> {
  const integration = new GitHubJobsIntegration({ token })
  return integration.searchDeveloperJobs(query)
}