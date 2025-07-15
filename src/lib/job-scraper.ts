import { GitHubJobsIntegration, GitHubJobPosting } from './github-integration'

export interface JobScrapingConfig {
  github?: {
    token?: string
    organizations?: string[]
    repositories?: string[]
  }
  indeed?: {
    baseUrl?: string
    location?: string
    keywords?: string[]
  }
  linkedin?: {
    enabled: boolean
    // LinkedIn scraping requires special handling due to anti-bot measures
  }
}

export interface ScrapedJob {
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
  source: 'github' | 'indeed' | 'linkedin' | 'custom'
  source_url: string
  posted_at: string
  scraped_at: string
}

export class JobScraper {
  private config: JobScrapingConfig
  private githubIntegration?: GitHubJobsIntegration

  constructor(config: JobScrapingConfig = {}) {
    this.config = config
    
    if (config.github?.token) {
      this.githubIntegration = new GitHubJobsIntegration({ 
        token: config.github.token 
      })
    }
  }

  /**
   * Scrape jobs from all configured sources
   */
  async scrapeAllJobs(): Promise<ScrapedJob[]> {
    const allJobs: ScrapedJob[] = []

    try {
      // Scrape from GitHub
      if (this.githubIntegration) {
        const githubJobs = await this.scrapeGitHubJobs()
        allJobs.push(...githubJobs)
      }

      // Add other sources here (Indeed, LinkedIn, etc.)
      // Note: Many job sites have anti-scraping measures and require API access

      return allJobs
    } catch (error) {
      console.error('Error scraping jobs:', error)
      throw error
    }
  }

  /**
   * Scrape jobs from GitHub repositories and issues
   */
  async scrapeGitHubJobs(): Promise<ScrapedJob[]> {
    if (!this.githubIntegration) {
      throw new Error('GitHub integration not configured')
    }

    const jobs: ScrapedJob[] = []
    const scrapedAt = new Date().toISOString()

    try {
      // Search for developer jobs across GitHub
      const developerJobs = await this.githubIntegration.searchDeveloperJobs()
      jobs.push(...developerJobs.map(job => this.convertGitHubJob(job, scrapedAt)))

      // Search job issues
      const jobIssues = await this.githubIntegration.searchJobIssues()
      jobs.push(...jobIssues.map(job => this.convertGitHubJob(job, scrapedAt)))

      // Scrape from specific organizations if configured
      if (this.config.github?.organizations) {
        for (const org of this.config.github.organizations) {
          const orgJobs = await this.githubIntegration.searchJobIssues(org)
          jobs.push(...orgJobs.map(job => this.convertGitHubJob(job, scrapedAt)))
        }
      }

      // Scrape from specific repositories if configured
      if (this.config.github?.repositories) {
        for (const repoPath of this.config.github.repositories) {
          const [owner, repo] = repoPath.split('/')
          if (owner && repo) {
            const repoJobs = await this.githubIntegration.syncRepositoryJobs(owner, repo)
            jobs.push(...repoJobs.map(job => this.convertGitHubJob(job, scrapedAt)))
          }
        }
      }

      return this.deduplicateJobs(jobs)
    } catch (error) {
      console.error('Error scraping GitHub jobs:', error)
      throw error
    }
  }

  /**
   * Test scraping functionality (for development/testing)
   */
  async testScraping(): Promise<{
    success: boolean
    sources: string[]
    jobCount: number
    errors: string[]
  }> {
    const result = {
      success: true,
      sources: [] as string[],
      jobCount: 0,
      errors: [] as string[]
    }

    // Test GitHub integration
    if (this.githubIntegration) {
      try {
        const jobs = await this.scrapeGitHubJobs()
        result.sources.push('github')
        result.jobCount += jobs.length
      } catch (error) {
        result.success = false
        result.errors.push(`GitHub: ${error}`)
      }
    }

    // Add tests for other sources as they are implemented

    return result
  }

  /**
   * Scrape job details from a specific URL (for custom implementations)
   */
  async scrapeJobFromUrl(url: string): Promise<ScrapedJob | null> {
    // This would require puppeteer or similar browser automation
    // For now, return null to indicate not implemented
    console.warn('Direct URL scraping not implemented yet')
    return null
  }

  /**
   * Validate scraped job data
   */
  validateJob(job: Partial<ScrapedJob>): job is ScrapedJob {
    return !!(
      job.id &&
      job.title &&
      job.company &&
      job.description &&
      job.location &&
      job.type &&
      job.source &&
      job.source_url &&
      job.posted_at
    )
  }

  private convertGitHubJob(githubJob: GitHubJobPosting, scrapedAt: string): ScrapedJob {
    return {
      id: githubJob.id,
      title: githubJob.title,
      company: githubJob.company,
      description: githubJob.description,
      location: githubJob.location,
      type: githubJob.type,
      experience_level: githubJob.experience_level,
      skills: githubJob.skills,
      salary_range: githubJob.salary_range,
      remote_friendly: githubJob.remote_friendly,
      source: 'github',
      source_url: githubJob.repository_url || `https://github.com/${githubJob.company}`,
      posted_at: githubJob.posted_at,
      scraped_at: scrapedAt
    }
  }

  private deduplicateJobs(jobs: ScrapedJob[]): ScrapedJob[] {
    const seen = new Set<string>()
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}-${job.location}`.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
}

/**
 * Utility function to create a job scraper instance
 */
export function createJobScraper(config?: JobScrapingConfig): JobScraper {
  return new JobScraper(config)
}

/**
 * Simple function to test job scraping capabilities
 */
export async function testJobScraping(githubToken?: string): Promise<ScrapedJob[]> {
  const scraper = new JobScraper({
    github: {
      token: githubToken
    }
  })

  return scraper.scrapeAllJobs()
}

/**
 * Configuration for common job scraping scenarios
 */
export const SCRAPING_PRESETS = {
  DEVELOPER_FOCUSED: {
    github: {
      organizations: ['microsoft', 'google', 'facebook', 'netflix', 'uber', 'airbnb'],
      repositories: ['microsoft/vscode', 'facebook/react', 'vercel/next.js']
    }
  },
  STARTUP_FOCUSED: {
    github: {
      organizations: ['stripe', 'linear', 'vercel', 'supabase', 'planetscale']
    }
  },
  OPEN_SOURCE: {
    github: {
      repositories: [
        'nodejs/node',
        'facebook/react',
        'microsoft/vscode',
        'vercel/next.js',
        'supabase/supabase'
      ]
    }
  }
} as const

/**
 * Browser automation testing utilities
 * Note: These functions would typically use Puppeteer for actual browser automation
 */
export class BrowserTestingUtilities {
  /**
   * Test job application workflow
   */
  static async testJobApplicationFlow(jobUrl: string): Promise<{
    canAccess: boolean
    hasApplicationForm: boolean
    requiredFields: string[]
    errors: string[]
  }> {
    // Mock implementation - would use actual browser automation
    return {
      canAccess: true,
      hasApplicationForm: true,
      requiredFields: ['name', 'email', 'resume'],
      errors: []
    }
  }

  /**
   * Test job search functionality
   */
  static async testJobSearch(searchTerm: string): Promise<{
    resultsFound: boolean
    resultCount: number
    loadTime: number
    errors: string[]
  }> {
    // Mock implementation - would use actual browser automation
    return {
      resultsFound: true,
      resultCount: 25,
      loadTime: 1200,
      errors: []
    }
  }

  /**
   * Test responsive design across different viewport sizes
   */
  static async testResponsiveDesign(url: string): Promise<{
    mobile: boolean
    tablet: boolean
    desktop: boolean
    errors: string[]
  }> {
    // Mock implementation - would use actual browser automation
    return {
      mobile: true,
      tablet: true,
      desktop: true,
      errors: []
    }
  }
}