import { describe, it, expect, beforeEach, vi } from 'vitest'
import { matchCandidateToJob, getJobRecommendations } from '../matching'

describe('AI Matching Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock OpenAI responses
    vi.mock('openai', () => ({
      default: class MockOpenAI {
        chat: any
        constructor() {
          this.chat = {
            completions: {
              create: vi.fn().mockResolvedValue({
                choices: [{
                  message: {
                    content: JSON.stringify({
                      matchScore: 85,
                      fit_analysis: 'Good match for this position',
                      strengths: ['Strong technical skills', 'Good communication'],
                      weaknesses: ['Limited experience in specific framework'],
                      recommendations: ['Consider for interview']
                    })
                  }
                }]
              })
            }
          }
        }
      }
    }))
  })

  describe('matchCandidateToJob', () => {
    it('should return match analysis', async () => {
      const request = {
        candidateProfile: {
          id: 'candidate-1',
          skills: ['JavaScript', 'React', 'Node.js'],
          experience: '3 years',
          education: 'Bachelor in Computer Science'
        },
        jobDescription: {
          id: 'job-1',
          title: 'Frontend Developer',
          requirements: ['React', 'JavaScript', 'CSS'],
          description: 'Looking for a skilled frontend developer'
        }
      }

      const result = await matchCandidateToJob(request)
      
      expect(result).toHaveProperty('matchScore')
      expect(result).toHaveProperty('fit_analysis')
      expect(result).toHaveProperty('strengths')
      expect(result).toHaveProperty('weaknesses')
      expect(result).toHaveProperty('recommendations')
    })
  })

  describe('getJobRecommendations', () => {
    it('should return job recommendations', async () => {
      const request = {
        candidateId: 'candidate-1',
        preferences: {
          jobType: 'full_time',
          location: 'remote',
          salaryRange: { min: 60000, max: 100000 }
        },
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '3 years'
      }

      const result = await getJobRecommendations(request)
      
      expect(Array.isArray(result)).toBe(true)
    })
  })
})