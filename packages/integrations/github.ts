import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface GitHubProfile {
  id: number
  login: string
  name: string
  company: string
  location: string
  email: string
  bio: string
  avatar_url: string
  html_url: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  clone_url: string
  language: string
  size: number
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  license: {
    key: string
    name: string
  }
  is_private: boolean
  fork: boolean
  archived: boolean
}

export interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  html_url: string
}

export interface GitHubLanguageStats {
  [language: string]: number
}

export interface GitHubContribution {
  total_commits: number
  total_additions: number
  total_deletions: number
  languages: GitHubLanguageStats
  top_repositories: GitHubRepository[]
  recent_commits: GitHubCommit[]
  contribution_streak: number
  activity_score: number
}

export class GitHubIntegration {
  private clientId: string
  private clientSecret: string
  private redirectUri: string

  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID!
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET!
    this.redirectUri = process.env.GITHUB_REDIRECT_URI!
  }

  // Generate GitHub OAuth URL
  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
      scope: 'read:user user:email repo read:org'
    })

    return `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<string> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: this.redirectUri
      })
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(`GitHub token exchange failed: ${data.error_description || data.error}`)
    }

    return data.access_token
  }

  // Get GitHub profile
  async getProfile(accessToken: string): Promise<GitHubProfile> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'job-board-platform'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`GitHub profile fetch failed: ${data.message}`)
    }

    return data
  }

  // Get user's repositories
  async getRepositories(accessToken: string, username: string): Promise<GitHubRepository[]> {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'job-board-platform'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`GitHub repositories fetch failed: ${data.message}`)
    }

    return data
  }

  // Get repository languages
  async getRepositoryLanguages(accessToken: string, fullName: string): Promise<GitHubLanguageStats> {
    const response = await fetch(`https://api.github.com/repos/${fullName}/languages`, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'job-board-platform'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.warn(`GitHub languages fetch failed for ${fullName}:`, data.message)
      return {}
    }

    return data
  }

  // Get recent commits for a repository
  async getRecentCommits(accessToken: string, fullName: string, limit: number = 10): Promise<GitHubCommit[]> {
    const response = await fetch(`https://api.github.com/repos/${fullName}/commits?per_page=${limit}`, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'job-board-platform'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.warn(`GitHub commits fetch failed for ${fullName}:`, data.message)
      return []
    }

    return data
  }

  // Analyze developer contribution and skills
  async analyzeContributions(accessToken: string, username: string): Promise<GitHubContribution> {
    try {
      const [profile, repositories] = await Promise.all([
        this.getProfile(accessToken),
        this.getRepositories(accessToken, username)
      ])

      // Filter out forks and focus on original repositories
      const originalRepos = repositories.filter(repo => !repo.fork && !repo.archived)
      const topRepos = originalRepos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)

      // Analyze languages across all repositories
      const languageStats: GitHubLanguageStats = {}
      for (const repo of originalRepos.slice(0, 20)) {
        const languages = await this.getRepositoryLanguages(accessToken, repo.full_name)
        for (const [lang, bytes] of Object.entries(languages)) {
          languageStats[lang] = (languageStats[lang] || 0) + bytes
        }
      }

      // Get recent commits from top repositories
      const recentCommits: GitHubCommit[] = []
      for (const repo of topRepos.slice(0, 5)) {
        const commits = await this.getRecentCommits(accessToken, repo.full_name, 5)
        recentCommits.push(...commits)
      }

      // Calculate contribution metrics
      const totalCommits = originalRepos.reduce((sum, repo) => sum + (repo.size || 0), 0)
      const totalStars = originalRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
      const totalForks = originalRepos.reduce((sum, repo) => sum + repo.forks_count, 0)
      
      // Calculate activity score based on various factors
      const activityScore = Math.min(100, Math.round(
        (totalCommits * 0.1) + 
        (totalStars * 2) + 
        (totalForks * 1.5) + 
        (originalRepos.length * 5) +
        (profile.followers * 0.5)
      ))

      // Estimate contribution streak (simplified)
      const contributionStreak = Math.min(365, Math.round(originalRepos.length * 7))

      return {
        total_commits: totalCommits,
        total_additions: 0, // Would need commit details API
        total_deletions: 0, // Would need commit details API
        languages: languageStats,
        top_repositories: topRepos,
        recent_commits: recentCommits.slice(0, 10),
        contribution_streak: contributionStreak,
        activity_score: activityScore
      }

    } catch (error) {
      console.error('GitHub contribution analysis failed:', error)
      throw error
    }
  }

  // Import GitHub profile to job board
  async importProfile(userId: string, accessToken: string): Promise<void> {
    try {
      const profile = await this.getProfile(accessToken)
      const contributions = await this.analyzeContributions(accessToken, profile.login)

      // Update user profile
      await supabase
        .from('user_profiles')
        .update({
          first_name: profile.name?.split(' ')[0] || profile.login,
          last_name: profile.name?.split(' ').slice(1).join(' ') || '',
          profile_picture_url: profile.avatar_url,
          github_url: profile.html_url,
          location: profile.location
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
            bio: profile.bio || '',
            github_username: profile.login,
            portfolio_url: profile.html_url,
            github_stats: {
              public_repos: profile.public_repos,
              followers: profile.followers,
              following: profile.following,
              activity_score: contributions.activity_score,
              contribution_streak: contributions.contribution_streak,
              total_commits: contributions.total_commits,
              languages: contributions.languages,
              top_repositories: contributions.top_repositories.map(repo => ({
                name: repo.name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url
              }))
            }
          })
          .eq('id', userId)

        // Import programming languages as skills
        const languageSkills = Object.keys(contributions.languages)
          .sort((a, b) => contributions.languages[b] - contributions.languages[a])
          .slice(0, 10)

        for (const language of languageSkills) {
          // Check if skill exists, create if not
          let { data: skill } = await supabase
            .from('skills')
            .select('id')
            .eq('name', language)
            .single()

          if (!skill) {
            const { data: newSkill } = await supabase
              .from('skills')
              .insert({ name: language, category: 'technical' })
              .select('id')
              .single()
            
            skill = newSkill
          }

          if (skill) {
            // Calculate proficiency based on usage
            const totalBytes = Object.values(contributions.languages).reduce((sum, bytes) => sum + bytes, 0)
            const languagePercentage = (contributions.languages[language] / totalBytes) * 100
            
            let proficiency = 'beginner'
            if (languagePercentage > 30) proficiency = 'expert'
            else if (languagePercentage > 15) proficiency = 'advanced'
            else if (languagePercentage > 5) proficiency = 'intermediate'

            // Add skill to user
            await supabase
              .from('user_skills')
              .upsert({
                user_id: userId,
                skill_id: skill.id,
                proficiency_level: proficiency,
                years_of_experience: Math.min(10, Math.round(contributions.contribution_streak / 100))
              })
          }
        }
      }

      // Store GitHub integration data
      await supabase
        .from('user_integrations')
        .upsert({
          user_id: userId,
          integration_type: 'github',
          integration_data: {
            username: profile.login,
            profile_id: profile.id,
            last_sync: new Date().toISOString(),
            profile_url: profile.html_url,
            stats: {
              public_repos: profile.public_repos,
              followers: profile.followers,
              activity_score: contributions.activity_score
            }
          },
          is_active: true
        })

    } catch (error) {
      console.error('GitHub profile import failed:', error)
      throw error
    }
  }

  // Search GitHub users by skills and location
  async searchDevelopers(accessToken: string, query: {
    language?: string
    location?: string
    followers?: string
    repos?: string
    created?: string
  }): Promise<any[]> {
    const searchTerms = []
    
    if (query.language) searchTerms.push(`language:${query.language}`)
    if (query.location) searchTerms.push(`location:${query.location}`)
    if (query.followers) searchTerms.push(`followers:${query.followers}`)
    if (query.repos) searchTerms.push(`repos:${query.repos}`)
    if (query.created) searchTerms.push(`created:${query.created}`)

    const searchQuery = searchTerms.join(' ')
    
    const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(searchQuery)}&per_page=30`, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'job-board-platform'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`GitHub developer search failed: ${data.message}`)
    }

    return data.items || []
  }

  // Get repository contributors
  async getRepositoryContributors(accessToken: string, fullName: string): Promise<any[]> {
    const response = await fetch(`https://api.github.com/repos/${fullName}/contributors?per_page=50`, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'job-board-platform'
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`GitHub contributors fetch failed: ${data.message}`)
    }

    return data
  }

  // Sync GitHub profile data
  async syncProfile(userId: string, accessToken: string): Promise<void> {
    try {
      // Get current integration data
      const { data: integration } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('integration_type', 'github')
        .single()

      if (!integration) {
        throw new Error('GitHub integration not found')
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
        .eq('integration_type', 'github')

    } catch (error) {
      console.error('GitHub profile sync failed:', error)
      throw error
    }
  }

  // Validate GitHub webhook signature
  validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payload)
    const digest = `sha256=${hmac.digest('hex')}`
    return digest === signature
  }

  // Handle GitHub webhook events
  async handleWebhook(event: string, payload: any): Promise<void> {
    try {
      switch (event) {
        case 'push':
          await this.handlePushEvent(payload)
          break
        case 'create':
          await this.handleCreateEvent(payload)
          break
        case 'star':
          await this.handleStarEvent(payload)
          break
        case 'fork':
          await this.handleForkEvent(payload)
          break
        default:
          console.log(`Unhandled GitHub webhook event: ${event}`)
      }
    } catch (error) {
      console.error('GitHub webhook handling failed:', error)
      throw error
    }
  }

  // Handle push event
  private async handlePushEvent(payload: any): Promise<void> {
    const { repository, sender, commits } = payload
    
    // Find user by GitHub username
    const { data: integration } = await supabase
      .from('user_integrations')
      .select('user_id')
      .eq('integration_type', 'github')
      .eq('integration_data->>username', sender.login)
      .single()

    if (integration) {
      // Update activity metrics
      await supabase
        .from('user_integrations')
        .update({
          integration_data: {
            ...payload.integration_data,
            last_activity: new Date().toISOString(),
            recent_commits: commits.slice(0, 5)
          }
        })
        .eq('user_id', integration.user_id)
        .eq('integration_type', 'github')
    }
  }

  // Handle repository creation event
  private async handleCreateEvent(payload: any): Promise<void> {
    const { repository, sender } = payload
    
    // Update repository count and activity
    const { data: integration } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('integration_type', 'github')
      .eq('integration_data->>username', sender.login)
      .single()

    if (integration) {
      const stats = integration.integration_data.stats || {}
      stats.public_repos = (stats.public_repos || 0) + 1
      
      await supabase
        .from('user_integrations')
        .update({
          integration_data: {
            ...integration.integration_data,
            stats,
            last_activity: new Date().toISOString()
          }
        })
        .eq('user_id', integration.user_id)
        .eq('integration_type', 'github')
    }
  }

  // Handle star event
  private async handleStarEvent(payload: any): Promise<void> {
    // Update repository star count
    console.log('GitHub star event received:', payload.action, payload.repository.full_name)
  }

  // Handle fork event
  private async handleForkEvent(payload: any): Promise<void> {
    // Update repository fork count
    console.log('GitHub fork event received:', payload.repository.full_name)
  }
}

export const gitHubIntegration = new GitHubIntegration()