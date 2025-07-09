import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TestUtils, mockUser, mockJob, mockProfile } from '@job-board/testing'
import { performAdvancedMatching, performBatchMatching, analyzeCandidate } from '../matching'

describe('AI Matching Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock OpenAI responses
    vi.mock('openai', () => ({
      default: class MockOpenAI {
        constructor() {
          this.chat = {
            completions: {
              create: vi.fn().mockResolvedValue({
                choices: [{
                  message: {
                    content: JSON.stringify({
                      match_score: 85,
                      match_breakdown: {
                        technical_skills: { score: 90, reasoning: 'Strong technical skills' },
                        experience_fit: { score: 80, reasoning: 'Good experience match' },
                        cultural_fit: { score: 85, reasoning: 'Good cultural fit' },
                        growth_potential: { score: 88, reasoning: 'High growth potential' },
                        compensation_fit: { score: 82, reasoning: 'Fair compensation match' }
                      },
                      success_predictions: {
                        performance_prediction: 'High',
                        retention_likelihood: 'High',
                        promotion_timeline: '12-18 months'
                      },
                      risk_assessment: {
                        flight_risk: 'low',
                        performance_risk: 'low',
                        cultural_risk: 'low'
                      },
                      recommendations: {
                        hiring_decision: 'strong_hire',
                        interview_focus_areas: ['Technical depth', 'Team collaboration'],
                        onboarding_considerations: ['Mentorship program', 'Technical training'],
                        development_plan_suggestions: ['Leadership development', 'Advanced technical skills']
                      }
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

  describe('performAdvancedMatching', () => {
    const mockRequest = {
      candidateProfile: {
        id: 'candidate-1',
        skills: [
          { name: 'React', proficiency_level: 'advanced', years_of_experience: 3 },
          { name: 'Node.js', proficiency_level: 'intermediate', years_of_experience: 2 }
        ],
        experience: [
          {
            title: 'Frontend Developer',
            company: 'Tech Corp',
            duration: '2 years',
            description: 'Developed React applications'
          }
        ],
        education: [
          {
            degree: 'Computer Science',
            institution: 'University',
            year: '2020'
          }
        ],
        preferences: {
          salary_min: 80000,
          salary_max: 120000,
          remote_preference: 'remote',
          job_types: ['full_time']
        },
        personality_traits: ['collaborative', 'detail-oriented'],
        career_goals: 'Become a senior developer',
        work_style: 'collaborative'
      },
      jobRequirements: {
        title: 'Senior Frontend Developer',
        description: 'Looking for a senior frontend developer',
        requirements: 'React, Node.js, 3+ years experience',
        skills_required: ['React', 'Node.js'],
        skills_nice_to_have: ['TypeScript', 'GraphQL'],
        experience_level: 'senior',
        company_culture: 'collaborative',
        team_size: 5,
        reporting_structure: 'flat',
        growth_opportunities: 'excellent'
      },
      contextualFactors: {
        company_size: 'startup',
        industry: 'technology',
        company_age: 3,
        market_position: 'growing',
        recent_news: []
      }
    }

    it('performs advanced matching successfully', async () => {
      const result = await performAdvancedMatching(mockRequest)
      
      expect(result).toBeDefined()
      expect(result.overall_match_score).toBe(85)
      expect(result.match_breakdown).toBeDefined()
      expect(result.match_breakdown.technical_skills.score).toBe(90)
      expect(result.success_predictions).toBeDefined()
      expect(result.risk_assessment).toBeDefined()
      expect(result.recommendations).toBeDefined()
    })

    it('handles API errors gracefully', async () => {
      const mockOpenAI = vi.mocked(await import('openai'))
      mockOpenAI.default.prototype.chat.completions.create = vi.fn().mockRejectedValue(new Error('API Error'))
      
      await expect(performAdvancedMatching(mockRequest)).rejects.toThrow('API Error')
    })

    it('validates input parameters', async () => {
      const invalidRequest = {
        candidateProfile: null,
        jobRequirements: mockRequest.jobRequirements,
        contextualFactors: mockRequest.contextualFactors
      }
      
      await expect(performAdvancedMatching(invalidRequest as any)).rejects.toThrow()
    })

    it('handles malformed API response', async () => {
      const mockOpenAI = vi.mocked(await import('openai'))
      mockOpenAI.default.prototype.chat.completions.create = vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: 'invalid json'
          }
        }]
      })
      
      await expect(performAdvancedMatching(mockRequest)).rejects.toThrow()
    })

    it('calculates match scores correctly', async () => {
      const result = await performAdvancedMatching(mockRequest)
      
      expect(result.overall_match_score).toBeGreaterThan(0)
      expect(result.overall_match_score).toBeLessThanOrEqual(100)
      expect(result.match_breakdown.technical_skills.score).toBeGreaterThan(0)
      expect(result.match_breakdown.experience_fit.score).toBeGreaterThan(0)
      expect(result.match_breakdown.cultural_fit.score).toBeGreaterThan(0)
    })

    it('provides meaningful recommendations', async () => {
      const result = await performAdvancedMatching(mockRequest)
      
      expect(result.recommendations.hiring_decision).toMatch(/^(strong_hire|hire|maybe|no_hire)$/)
      expect(result.recommendations.interview_focus_areas).toBeInstanceOf(Array)
      expect(result.recommendations.onboarding_considerations).toBeInstanceOf(Array)
      expect(result.recommendations.development_plan_suggestions).toBeInstanceOf(Array)
    })

    it('assesses risks appropriately', async () => {
      const result = await performAdvancedMatching(mockRequest)
      
      expect(result.risk_assessment.flight_risk).toMatch(/^(low|medium|high)$/)
      expect(result.risk_assessment.performance_risk).toMatch(/^(low|medium|high)$/)
      expect(result.risk_assessment.cultural_risk).toMatch(/^(low|medium|high)$/)
    })
  })

  describe('performBatchMatching', () => {
    const mockBatchRequest = {
      candidates: [
        {
          id: 'candidate-1',
          profile: {
            id: 'candidate-1',
            skills: [{ name: 'React', proficiency_level: 'advanced', years_of_experience: 3 }],
            experience: [],
            education: [],
            preferences: {
              salary_min: 80000,
              salary_max: 120000,
              remote_preference: 'remote',
              job_types: ['full_time']
            },
            personality_traits: [],
            career_goals: '',
            work_style: ''
          }
        },
        {
          id: 'candidate-2',
          profile: {
            id: 'candidate-2',
            skills: [{ name: 'Vue.js', proficiency_level: 'intermediate', years_of_experience: 2 }],
            experience: [],
            education: [],
            preferences: {
              salary_min: 70000,
              salary_max: 100000,
              remote_preference: 'hybrid',
              job_types: ['full_time']
            },
            personality_traits: [],
            career_goals: '',
            work_style: ''
          }
        }
      ],
      jobRequirements: {
        title: 'Frontend Developer',
        description: 'Looking for a frontend developer',
        requirements: 'React, 2+ years experience',
        skills_required: ['React'],
        skills_nice_to_have: ['TypeScript'],
        experience_level: 'mid_level',
        company_culture: 'collaborative',
        team_size: 8,
        reporting_structure: 'flat',
        growth_opportunities: 'good'
      },
      contextualFactors: {
        company_size: 'mid-size',
        industry: 'technology',
        company_age: 5,
        market_position: 'established',
        recent_news: []
      },
      maxResults: 10
    }

    it('performs batch matching successfully', async () => {
      const mockOpenAI = vi.mocked(await import('openai'))
      mockOpenAI.default.prototype.chat.completions.create = vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              ranked_candidates: [
                {
                  candidate_id: 'candidate-1',
                  match_score: 85,
                  ranking_position: 1,
                  quick_summary: 'Strong React skills, good experience fit',
                  key_strengths: ['React expertise', 'Full-stack experience'],
                  key_concerns: ['Limited TypeScript experience']
                },
                {
                  candidate_id: 'candidate-2',
                  match_score: 65,
                  ranking_position: 2,
                  quick_summary: 'Good Vue.js skills, some transferable experience',
                  key_strengths: ['Frontend development', 'Quick learner'],
                  key_concerns: ['Different framework experience', 'Less experience overall']
                }
              ],
              comparison_insights: {
                strongest_candidates: ['candidate-1'],
                skill_gaps: ['TypeScript', 'Testing'],
                diversity_assessment: 'Good mix of experience levels',
                hiring_recommendations: ['Focus on candidate-1', 'Consider candidate-2 for junior role']
              }
            })
          }
        }]
      })
      
      const result = await performBatchMatching(mockBatchRequest)
      
      expect(result).toBeDefined()
      expect(result.ranked_candidates).toHaveLength(2)
      expect(result.ranked_candidates[0].ranking_position).toBe(1)
      expect(result.ranked_candidates[1].ranking_position).toBe(2)
      expect(result.comparison_insights).toBeDefined()
    })

    it('handles empty candidates array', async () => {
      const emptyRequest = {
        ...mockBatchRequest,
        candidates: []
      }
      
      const result = await performBatchMatching(emptyRequest)
      
      expect(result.ranked_candidates).toHaveLength(0)
    })

    it('respects maxResults parameter', async () => {
      const limitedRequest = {
        ...mockBatchRequest,
        maxResults: 1
      }
      
      const result = await performBatchMatching(limitedRequest)
      
      expect(result.ranked_candidates).toHaveLength(1)
    })

    it('ranks candidates correctly', async () => {
      const result = await performBatchMatching(mockBatchRequest)
      
      const scores = result.ranked_candidates.map(c => c.match_score)
      const sortedScores = [...scores].sort((a, b) => b - a)
      
      expect(scores).toEqual(sortedScores)
    })

    it('provides comparison insights', async () => {
      const result = await performBatchMatching(mockBatchRequest)
      
      expect(result.comparison_insights.strongest_candidates).toBeInstanceOf(Array)
      expect(result.comparison_insights.skill_gaps).toBeInstanceOf(Array)
      expect(result.comparison_insights.diversity_assessment).toBeDefined()
      expect(result.comparison_insights.hiring_recommendations).toBeInstanceOf(Array)
    })
  })

  describe('analyzeCandidate', () => {
    const mockCandidate = {
      id: 'candidate-1',
      profile: {
        skills: [
          { name: 'React', proficiency_level: 'advanced', years_of_experience: 3 },
          { name: 'Node.js', proficiency_level: 'intermediate', years_of_experience: 2 }
        ],
        experience: [
          {
            title: 'Frontend Developer',
            company: 'Tech Corp',
            duration: '2 years',
            description: 'Developed React applications'
          }
        ],
        education: [
          {
            degree: 'Computer Science',
            institution: 'University',
            year: '2020'
          }
        ]
      }
    }

    it('analyzes candidate successfully', async () => {
      const mockOpenAI = vi.mocked(await import('openai'))
      mockOpenAI.default.prototype.chat.completions.create = vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify({
              technical_assessment: {
                skill_level: 'advanced',
                technical_strengths: ['React', 'Frontend development'],
                technical_gaps: ['Backend experience', 'DevOps'],
                learning_ability: 'high'
              },
              experience_analysis: {
                years_of_experience: 3,
                career_progression: 'steady',
                industry_relevance: 'high',
                leadership_potential: 'medium'
              },
              personality_insights: {
                work_style: 'collaborative',
                communication_skills: 'good',
                problem_solving: 'strong',
                adaptability: 'high'
              },
              recommendations: {
                fit_assessment: 'good',
                development_areas: ['Backend skills', 'Leadership'],
                interview_questions: ['Technical depth', 'Problem solving'],
                onboarding_plan: ['Mentorship', 'Technical training']
              }
            })
          }
        }]
      })
      
      const result = await analyzeCandidate(mockCandidate)
      
      expect(result).toBeDefined()
      expect(result.technical_assessment).toBeDefined()
      expect(result.experience_analysis).toBeDefined()
      expect(result.personality_insights).toBeDefined()
      expect(result.recommendations).toBeDefined()
    })

    it('handles candidates with minimal information', async () => {
      const minimalCandidate = {
        id: 'candidate-minimal',
        profile: {
          skills: [],
          experience: [],
          education: []
        }
      }
      
      const result = await analyzeCandidate(minimalCandidate)
      
      expect(result).toBeDefined()
      expect(result.technical_assessment).toBeDefined()
    })

    it('provides comprehensive technical assessment', async () => {
      const result = await analyzeCandidate(mockCandidate)
      
      expect(result.technical_assessment.skill_level).toBeDefined()
      expect(result.technical_assessment.technical_strengths).toBeInstanceOf(Array)
      expect(result.technical_assessment.technical_gaps).toBeInstanceOf(Array)
      expect(result.technical_assessment.learning_ability).toBeDefined()
    })

    it('analyzes experience appropriately', async () => {
      const result = await analyzeCandidate(mockCandidate)
      
      expect(result.experience_analysis.years_of_experience).toBeGreaterThan(0)
      expect(result.experience_analysis.career_progression).toBeDefined()
      expect(result.experience_analysis.industry_relevance).toBeDefined()
    })

    it('provides actionable recommendations', async () => {
      const result = await analyzeCandidate(mockCandidate)
      
      expect(result.recommendations.fit_assessment).toBeDefined()
      expect(result.recommendations.development_areas).toBeInstanceOf(Array)
      expect(result.recommendations.interview_questions).toBeInstanceOf(Array)
      expect(result.recommendations.onboarding_plan).toBeInstanceOf(Array)
    })
  })

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      const mockOpenAI = vi.mocked(await import('openai'))
      mockOpenAI.default.prototype.chat.completions.create = vi.fn().mockRejectedValue(new Error('Network error'))
      
      const mockRequest = {
        candidateProfile: {
          id: 'candidate-1',
          skills: [],
          experience: [],
          education: [],
          preferences: {
            salary_min: 80000,
            salary_max: 120000,
            remote_preference: 'remote',
            job_types: ['full_time']
          },
          personality_traits: [],
          career_goals: '',
          work_style: ''
        },
        jobRequirements: {
          title: 'Developer',
          description: 'Developer role',
          requirements: 'Programming experience',
          skills_required: ['Programming'],
          skills_nice_to_have: [],
          experience_level: 'mid_level',
          company_culture: 'collaborative',
          team_size: 5,
          reporting_structure: 'flat',
          growth_opportunities: 'good'
        },
        contextualFactors: {
          company_size: 'startup',
          industry: 'technology',
          company_age: 3,
          market_position: 'growing',
          recent_news: []
        }
      }
      
      await expect(performAdvancedMatching(mockRequest)).rejects.toThrow('Network error')
    })

    it('handles API rate limiting', async () => {
      const mockOpenAI = vi.mocked(await import('openai'))
      mockOpenAI.default.prototype.chat.completions.create = vi.fn().mockRejectedValue(
        Object.assign(new Error('Rate limit exceeded'), { status: 429 })
      )
      
      const mockRequest = {
        candidateProfile: {
          id: 'candidate-1',
          skills: [],
          experience: [],
          education: [],
          preferences: {
            salary_min: 80000,
            salary_max: 120000,
            remote_preference: 'remote',
            job_types: ['full_time']
          },
          personality_traits: [],
          career_goals: '',
          work_style: ''
        },
        jobRequirements: {
          title: 'Developer',
          description: 'Developer role',
          requirements: 'Programming experience',
          skills_required: ['Programming'],
          skills_nice_to_have: [],
          experience_level: 'mid_level',
          company_culture: 'collaborative',
          team_size: 5,
          reporting_structure: 'flat',
          growth_opportunities: 'good'
        },
        contextualFactors: {
          company_size: 'startup',
          industry: 'technology',
          company_age: 3,
          market_position: 'growing',
          recent_news: []
        }
      }
      
      await expect(performAdvancedMatching(mockRequest)).rejects.toThrow('Rate limit exceeded')
    })

    it('handles invalid JSON responses', async () => {
      const mockOpenAI = vi.mocked(await import('openai'))
      mockOpenAI.default.prototype.chat.completions.create = vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: 'invalid json response'
          }
        }]
      })
      
      const mockRequest = {
        candidateProfile: {
          id: 'candidate-1',
          skills: [],
          experience: [],
          education: [],
          preferences: {
            salary_min: 80000,
            salary_max: 120000,
            remote_preference: 'remote',
            job_types: ['full_time']
          },
          personality_traits: [],
          career_goals: '',
          work_style: ''
        },
        jobRequirements: {
          title: 'Developer',
          description: 'Developer role',
          requirements: 'Programming experience',
          skills_required: ['Programming'],
          skills_nice_to_have: [],
          experience_level: 'mid_level',
          company_culture: 'collaborative',
          team_size: 5,
          reporting_structure: 'flat',
          growth_opportunities: 'good'
        },
        contextualFactors: {
          company_size: 'startup',
          industry: 'technology',
          company_age: 3,
          market_position: 'growing',
          recent_news: []
        }
      }
      
      await expect(performAdvancedMatching(mockRequest)).rejects.toThrow()
    })
  })

  describe('Performance', () => {
    it('completes advanced matching within time limit', async () => {
      const mockRequest = {
        candidateProfile: {
          id: 'candidate-1',
          skills: Array.from({ length: 50 }, (_, i) => ({
            name: `Skill ${i}`,
            proficiency_level: 'intermediate',
            years_of_experience: 2
          })),
          experience: Array.from({ length: 10 }, (_, i) => ({
            title: `Job ${i}`,
            company: `Company ${i}`,
            duration: '2 years',
            description: `Description ${i}`
          })),
          education: Array.from({ length: 5 }, (_, i) => ({
            degree: `Degree ${i}`,
            institution: `Institution ${i}`,
            year: '2020'
          })),
          preferences: {
            salary_min: 80000,
            salary_max: 120000,
            remote_preference: 'remote',
            job_types: ['full_time']
          },
          personality_traits: ['collaborative'],
          career_goals: 'Career goals',
          work_style: 'collaborative'
        },
        jobRequirements: {
          title: 'Developer',
          description: 'Developer role',
          requirements: 'Programming experience',
          skills_required: ['Programming'],
          skills_nice_to_have: [],
          experience_level: 'mid_level',
          company_culture: 'collaborative',
          team_size: 5,
          reporting_structure: 'flat',
          growth_opportunities: 'good'
        },
        contextualFactors: {
          company_size: 'startup',
          industry: 'technology',
          company_age: 3,
          market_position: 'growing',
          recent_news: []
        }
      }
      
      const executionTime = await TestUtils.measurePerformance(async () => {
        await performAdvancedMatching(mockRequest)
      })
      
      // Should complete within 5 seconds
      expect(executionTime).toBeLessThan(5000)
    })

    it('handles batch matching efficiently', async () => {
      const mockBatchRequest = {
        candidates: Array.from({ length: 50 }, (_, i) => ({
          id: `candidate-${i}`,
          profile: {
            id: `candidate-${i}`,
            skills: [{ name: 'React', proficiency_level: 'intermediate', years_of_experience: 2 }],
            experience: [],
            education: [],
            preferences: {
              salary_min: 80000,
              salary_max: 120000,
              remote_preference: 'remote',
              job_types: ['full_time']
            },
            personality_traits: [],
            career_goals: '',
            work_style: ''
          }
        })),
        jobRequirements: {
          title: 'Developer',
          description: 'Developer role',
          requirements: 'Programming experience',
          skills_required: ['Programming'],
          skills_nice_to_have: [],
          experience_level: 'mid_level',
          company_culture: 'collaborative',
          team_size: 5,
          reporting_structure: 'flat',
          growth_opportunities: 'good'
        },
        contextualFactors: {
          company_size: 'startup',
          industry: 'technology',
          company_age: 3,
          market_position: 'growing',
          recent_news: []
        },
        maxResults: 10
      }
      
      const executionTime = await TestUtils.measurePerformance(async () => {
        await performBatchMatching(mockBatchRequest)
      })
      
      // Should complete within 10 seconds
      expect(executionTime).toBeLessThan(10000)
    })
  })
})