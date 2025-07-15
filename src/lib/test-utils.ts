// Simple test utilities to replace @job-board/testing imports

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: { name: 'Test User' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  email_confirmed_at: '2023-01-01T00:00:00.000Z',
  last_sign_in_at: '2023-01-01T00:00:00.000Z',
  role: 'authenticated',
  confirmation_sent_at: '2023-01-01T00:00:00.000Z',
  phone: '',
  confirmed_at: '2023-01-01T00:00:00.000Z',
  email_change_sent_at: '2023-01-01T00:00:00.000Z',
  new_email: '',
  invited_at: '2023-01-01T00:00:00.000Z',
  action_link: '',
  email_change: '',
  email_change_confirm_status: 0,
  banned_until: '',
  new_phone: '',
  phone_change: '',
  phone_change_sent_at: '',
  phone_change_token: '',
  phone_confirmed_at: '',
  phone_change_confirm_status: 0,
  recovery_sent_at: '',
  new_password: '',
  identities: [],
  is_anonymous: false,
  factors: []
}

export const mockProfile = {
  id: 'test-profile-id',
  email: 'test@example.com',
  user_type: 'individual' as const,
  first_name: 'Test',
  last_name: 'User',
  profile_picture_url: null,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

export const mockJob = {
  id: 'test-job-id',
  title: 'Test Job',
  description: 'Test job description',
  company_id: 'test-company-id',
  location: 'Test Location',
  salary_min: 50000,
  salary_max: 80000,
  job_type: 'full-time',
  status: 'active',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

export const mockApplication = {
  id: 'test-application-id',
  job_id: 'test-job-id',
  candidate_id: 'test-candidate-id',
  status: 'applied',
  applied_at: '2023-01-01T00:00:00.000Z',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

export const mockCompany = {
  id: 'test-company-id',
  company_name: 'Test Company',
  industry: 'Technology',
  company_size: '1-10',
  company_website: 'https://test.com',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

// Simple TestUtils object with basic methods
export const TestUtils = {
  render: (component: any) => component,
  screen: {
    getByText: (text: string) => ({ textContent: text }),
    getByRole: (role: string) => ({ role }),
    queryByText: (text: string) => ({ textContent: text })
  },
  fireEvent: {
    click: (element: any) => element,
    change: (element: any, event: any) => element
  },
  waitFor: async (callback: Function) => callback(),
  userEvent: {
    click: async (element: any) => element,
    type: async (element: any, text: string) => element
  }
}

// Mock function for test assertions
export const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => ({ data: mockUser, error: null })
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => ({ data: mockUser, error: null })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => ({ data: mockUser, error: null })
        })
      })
    })
  })
}

export const mockApiResponse = {
  ok: true,
  status: 200,
  json: async () => ({ data: mockUser })
}

export const waitForAsyncOperations = async () => {
  await new Promise(resolve => setTimeout(resolve, 0))
}

export const setupTestDatabase = () => {
  return mockSupabase
}

export const renderWithProviders = (component: any) => {
  return TestUtils.render(component)
}