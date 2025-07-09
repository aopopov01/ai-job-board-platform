import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { mockUser, mockProfile, mockJob, mockApplication, mockCompany } from '../setup'

export const handlers = [
  // Authentication endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        user: mockUser,
        session: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token'
        }
      })
    )
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.json({
        user: mockUser,
        session: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token'
        }
      })
    )
  }),

  rest.post('/api/auth/signout', (req, res, ctx) => {
    return res(ctx.json({ success: true }))
  }),

  // Job endpoints
  rest.get('/api/jobs', (req, res, ctx) => {
    return res(
      ctx.json({
        jobs: [mockJob],
        totalCount: 1
      })
    )
  }),

  rest.get('/api/jobs/:id', (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.json({
        job: { ...mockJob, id }
      })
    )
  }),

  rest.post('/api/jobs', (req, res, ctx) => {
    return res(
      ctx.json({
        job: mockJob
      })
    )
  }),

  rest.put('/api/jobs/:id', (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.json({
        job: { ...mockJob, id }
      })
    )
  }),

  rest.delete('/api/jobs/:id', (req, res, ctx) => {
    return res(ctx.json({ success: true }))
  }),

  // Application endpoints
  rest.get('/api/applications', (req, res, ctx) => {
    return res(
      ctx.json({
        applications: [mockApplication]
      })
    )
  }),

  rest.post('/api/applications', (req, res, ctx) => {
    return res(
      ctx.json({
        application: mockApplication
      })
    )
  }),

  rest.put('/api/applications/:id', (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.json({
        application: { ...mockApplication, id }
      })
    )
  }),

  // Profile endpoints
  rest.get('/api/profile', (req, res, ctx) => {
    return res(
      ctx.json({
        profile: mockProfile
      })
    )
  }),

  rest.put('/api/profile', (req, res, ctx) => {
    return res(
      ctx.json({
        profile: mockProfile
      })
    )
  }),

  // Company endpoints
  rest.get('/api/companies/:id', (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.json({
        company: { ...mockCompany, id }
      })
    )
  }),

  // Payment endpoints
  rest.post('/api/payments/create-checkout-session', (req, res, ctx) => {
    return res(
      ctx.json({
        sessionId: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123'
      })
    )
  }),

  rest.post('/api/payments/create-portal-session', (req, res, ctx) => {
    return res(
      ctx.json({
        url: 'https://billing.stripe.com/session/test'
      })
    )
  }),

  rest.get('/api/payments/subscription', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'sub_test_123',
        status: 'active',
        plan_id: 'individual_premium',
        current_period_start: '2023-01-01T00:00:00.000Z',
        current_period_end: '2023-02-01T00:00:00.000Z'
      })
    )
  }),

  rest.get('/api/payments/usage-stats', (req, res, ctx) => {
    return res(
      ctx.json({
        current_usage: {
          applications: 5,
          ai_screenings: 3
        },
        limits: {
          applications: 100,
          ai_screenings: 50
        },
        usage_percentage: {
          applications: 5,
          ai_screenings: 6
        }
      })
    )
  }),

  // Integration endpoints
  rest.get('/api/integrations/sync', (req, res, ctx) => {
    return res(
      ctx.json({
        integrations: [
          { type: 'linkedin', connected: false },
          { type: 'github', connected: false },
          { type: 'ats', connected: false }
        ]
      })
    )
  }),

  rest.post('/api/integrations/sync', (req, res, ctx) => {
    return res(ctx.json({ success: true }))
  }),

  rest.post('/api/integrations/connect', (req, res, ctx) => {
    return res(
      ctx.json({
        oauthUrl: 'https://oauth.provider.com/auth?client_id=test'
      })
    )
  }),

  rest.delete('/api/integrations/connect', (req, res, ctx) => {
    return res(ctx.json({ success: true }))
  }),

  // AI endpoints
  rest.post('/api/ai/match', (req, res, ctx) => {
    return res(
      ctx.json({
        match_score: 85,
        reasoning: 'Strong match based on skills and experience',
        recommendations: ['Focus on React skills', 'Highlight leadership experience']
      })
    )
  }),

  rest.post('/api/ai/screen', (req, res, ctx) => {
    return res(
      ctx.json({
        screening_score: 78,
        skills_match: 85,
        experience_match: 72,
        notes: 'Candidate shows strong technical skills',
        recommendations: ['Interview for technical depth', 'Assess cultural fit']
      })
    )
  }),

  // Analytics endpoints
  rest.get('/api/analytics/applications', (req, res, ctx) => {
    return res(
      ctx.json({
        total_applications: 150,
        status_distribution: {
          applied: 50,
          screening: 30,
          interview: 20,
          offer: 10,
          hired: 5,
          rejected: 35
        },
        conversion_rates: {
          screening: 60,
          interview: 67,
          offer: 50,
          hired: 50
        }
      })
    )
  }),

  rest.get('/api/analytics/jobs', (req, res, ctx) => {
    return res(
      ctx.json({
        total_jobs: 25,
        active_jobs: 20,
        total_views: 1250,
        total_applications: 150,
        average_applications_per_job: 6
      })
    )
  }),

  // Messages endpoints
  rest.get('/api/messages', (req, res, ctx) => {
    return res(
      ctx.json({
        conversations: [
          {
            id: 'conv_123',
            participants: [mockUser.id, 'user_456'],
            last_message: {
              id: 'msg_123',
              content: 'Hello, I\'m interested in the position',
              sender_id: 'user_456',
              created_at: '2023-01-01T12:00:00.000Z'
            },
            unread_count: 1
          }
        ]
      })
    )
  }),

  rest.post('/api/messages', (req, res, ctx) => {
    return res(
      ctx.json({
        message: {
          id: 'msg_new',
          content: 'Test message',
          sender_id: mockUser.id,
          created_at: new Date().toISOString()
        }
      })
    )
  }),

  // Search endpoints
  rest.get('/api/search/jobs', (req, res, ctx) => {
    return res(
      ctx.json({
        jobs: [mockJob],
        totalCount: 1,
        facets: {
          locations: ['San Francisco, CA'],
          job_types: ['full_time'],
          experience_levels: ['mid_level']
        }
      })
    )
  }),

  rest.get('/api/search/candidates', (req, res, ctx) => {
    return res(
      ctx.json({
        candidates: [
          {
            id: mockUser.id,
            name: `${mockProfile.first_name} ${mockProfile.last_name}`,
            current_job_title: 'Software Engineer',
            skills: ['React', 'Node.js', 'TypeScript'],
            experience_years: 3,
            location: 'San Francisco, CA'
          }
        ],
        totalCount: 1
      })
    )
  }),

  // External API mocks
  rest.get('https://api.linkedin.com/v2/people/~', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'linkedin_user_123',
        firstName: { localized: { en_US: 'John' } },
        lastName: { localized: { en_US: 'Doe' } },
        headline: { localized: { en_US: 'Software Engineer' } },
        summary: { localized: { en_US: 'Experienced software developer' } }
      })
    )
  }),

  rest.get('https://api.github.com/user', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 12345,
        login: 'johndoe',
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Software developer',
        avatar_url: 'https://github.com/johndoe.png',
        html_url: 'https://github.com/johndoe',
        public_repos: 25,
        followers: 50,
        following: 30
      })
    )
  }),

  rest.get('https://api.github.com/users/:username/repos', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          name: 'awesome-project',
          full_name: 'johndoe/awesome-project',
          description: 'An awesome project',
          html_url: 'https://github.com/johndoe/awesome-project',
          language: 'JavaScript',
          stargazers_count: 15,
          forks_count: 3,
          created_at: '2023-01-01T00:00:00Z'
        }
      ])
    )
  }),

  // Stripe webhook
  rest.post('/api/payments/webhooks', (req, res, ctx) => {
    return res(ctx.json({ received: true }))
  }),

  // Default catch-all
  rest.get('*', (req, res, ctx) => {
    console.warn(`Unhandled request: ${req.method} ${req.url}`)
    return res(ctx.status(404), ctx.json({ error: 'Not found' }))
  })
]

export const server = setupServer(...handlers)