import { setupServer } from 'msw/node'
import { http } from 'msw'
import { mockUser, mockProfile, mockJob, mockApplication, mockCompany } from '../setup'

export const handlers = [
  // Authentication endpoints
  http.post('/api/auth/login', () => {
    return Response.json({
      user: mockUser,
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      }
    })
  }),

  http.post('/api/auth/register', () => {
    return Response.json({
      user: mockUser,
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      }
    })
  }),

  http.post('/api/auth/signout', () => {
    return Response.json({ success: true })
  }),

  // Job endpoints
  http.get('/api/jobs', () => {
    return Response.json({
      jobs: [mockJob],
      totalCount: 1
    })
  }),

  http.get('/api/jobs/:id', ({ params }) => {
    const { id } = params
    return Response.json({
      job: { ...mockJob, id }
    })
  }),

  http.post('/api/jobs', () => {
    return Response.json({
      job: mockJob
    })
  }),

  http.put('/api/jobs/:id', ({ params }) => {
    const { id } = params
    return Response.json({
      job: { ...mockJob, id }
    })
  }),

  http.delete('/api/jobs/:id', () => {
    return Response.json({ success: true })
  }),

  // Application endpoints
  http.get('/api/applications', () => {
    return Response.json({
      applications: [mockApplication]
    })
  }),

  http.post('/api/applications', () => {
    return Response.json({
      application: mockApplication
    })
  }),

  http.put('/api/applications/:id', ({ params }) => {
    const { id } = params
    return Response.json({
      application: { ...mockApplication, id }
    })
  }),

  // Profile endpoints
  http.get('/api/profile', () => {
    return Response.json({
      profile: mockProfile
    })
  }),

  http.put('/api/profile', () => {
    return Response.json({
      profile: mockProfile
    })
  }),

  // Company endpoints
  http.get('/api/companies/:id', ({ params }) => {
    const { id } = params
    return Response.json({
      company: { ...mockCompany, id }
    })
  }),

  // Payment endpoints
  http.post('/api/payments/create-checkout-session', () => {
    return Response.json({
      sessionId: 'cs_test_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123'
    })
  }),

  http.post('/api/payments/create-portal-session', () => {
    return Response.json({
      url: 'https://billing.stripe.com/session/test'
    })
  }),

  http.get('/api/payments/subscription', () => {
    return Response.json({
      id: 'sub_test_123',
      status: 'active',
      plan_id: 'individual_premium',
      current_period_start: '2023-01-01T00:00:00.000Z',
      current_period_end: '2023-02-01T00:00:00.000Z'
    })
  }),

  http.get('/api/payments/usage-stats', () => {
    return Response.json({
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
  }),

  // Integration endpoints
  http.get('/api/integrations/sync', () => {
    return Response.json({
      integrations: [
        { type: 'linkedin', connected: false },
        { type: 'github', connected: false },
        { type: 'ats', connected: false }
      ]
    })
  }),

  http.post('/api/integrations/sync', () => {
    return Response.json({ success: true })
  }),

  http.post('/api/integrations/connect', () => {
    return Response.json({
      oauthUrl: 'https://oauth.provider.com/auth?client_id=test'
    })
  }),

  http.delete('/api/integrations/connect', () => {
    return Response.json({ success: true })
  }),

  // AI endpoints
  http.post('/api/ai/match', () => {
    return Response.json({
      match_score: 85,
      reasoning: 'Strong match based on skills and experience',
      recommendations: ['Focus on React skills', 'Highlight leadership experience']
    })
  }),

  http.post('/api/ai/screen', () => {
    return Response.json({
      screening_score: 78,
      skills_match: 85,
      experience_match: 72,
      notes: 'Candidate shows strong technical skills',
      recommendations: ['Interview for technical depth', 'Assess cultural fit']
    })
  }),

  // Analytics endpoints
  http.get('/api/analytics/applications', () => {
    return Response.json({
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
  }),

  http.get('/api/analytics/jobs', () => {
    return Response.json({
      total_jobs: 25,
      active_jobs: 20,
      total_views: 1250,
      total_applications: 150,
      average_applications_per_job: 6
    })
  }),

  // Messages endpoints
  http.get('/api/messages', () => {
    return Response.json({
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
  }),

  http.post('/api/messages', () => {
    return Response.json({
      message: {
        id: 'msg_new',
        content: 'Test message',
        sender_id: mockUser.id,
        created_at: new Date().toISOString()
      }
    })
  }),

  // Search endpoints
  http.get('/api/search/jobs', () => {
    return Response.json({
      jobs: [mockJob],
      totalCount: 1,
      facets: {
        locations: ['San Francisco, CA'],
        job_types: ['full_time'],
        experience_levels: ['mid_level']
      }
    })
  }),

  http.get('/api/search/candidates', () => {
    return Response.json({
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
  }),

  // External API mocks
  http.get('https://api.linkedin.com/v2/people/~', () => {
    return Response.json({
      id: 'linkedin_user_123',
      firstName: { localized: { en_US: 'John' } },
      lastName: { localized: { en_US: 'Doe' } },
      headline: { localized: { en_US: 'Software Engineer' } },
      summary: { localized: { en_US: 'Experienced software developer' } }
    })
  }),

  http.get('https://api.github.com/user', () => {
    return Response.json({
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
  }),

  http.get('https://api.github.com/users/:username/repos', () => {
    return Response.json([
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
  }),

  // Stripe webhook
  http.post('/api/payments/webhooks', () => {
    return Response.json({ received: true })
  }),

  // Default catch-all
  http.get('*', ({ request }) => {
    console.warn(`Unhandled request: ${request.method} ${request.url}`)
    return new Response('Not found', { status: 404 })
  })
]

export const server = setupServer(...handlers)