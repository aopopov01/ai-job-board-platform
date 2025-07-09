import { beforeAll, afterAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { createClient } from '@supabase/supabase-js'
import { server } from './mocks/server'

// Setup test environment
beforeAll(() => {
  // Start MSW server
  server.listen({
    onUnhandledRequest: 'error',
  })
})

afterEach(() => {
  // Cleanup React Testing Library
  cleanup()
  
  // Reset MSW handlers
  server.resetHandlers()
})

afterAll(() => {
  // Close MSW server
  server.close()
})

// Mock Supabase client
export const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ 
      data: { subscription: null }, 
      unsubscribe: vi.fn() 
    }))
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn().mockResolvedValue({ data: [], error: null })
  })),
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    unsubscribe: vi.fn()
  }))
}

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'
process.env.STRIPE_SECRET_KEY = 'sk_test_123'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
process.env.OPENAI_API_KEY = 'sk-test-123'
process.env.LINKEDIN_CLIENT_ID = 'test-linkedin-client-id'
process.env.LINKEDIN_CLIENT_SECRET = 'test-linkedin-client-secret'
process.env.GITHUB_CLIENT_ID = 'test-github-client-id'
process.env.GITHUB_CLIENT_SECRET = 'test-github-client-secret'

// Test utilities
export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  user_metadata: {
    first_name: 'Test',
    last_name: 'User'
  },
  created_at: '2023-01-01T00:00:00.000Z'
}

export const mockProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  user_type: 'individual',
  subscription_plan: 'individual_free',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

export const mockJob = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  title: 'Software Engineer',
  description: 'Join our amazing team as a Software Engineer',
  requirements: 'Bachelor\'s degree in Computer Science',
  location: 'San Francisco, CA',
  salary_min: 100000,
  salary_max: 150000,
  job_type: 'full_time',
  work_style: 'remote',
  experience_level: 'mid_level',
  status: 'active',
  company_id: '123e4567-e89b-12d3-a456-426614174002',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

export const mockApplication = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  job_id: '123e4567-e89b-12d3-a456-426614174001',
  candidate_id: '123e4567-e89b-12d3-a456-426614174000',
  status: 'applied',
  applied_at: '2023-01-01T00:00:00.000Z',
  ai_screening_score: 85,
  ai_screening_notes: 'Strong candidate with relevant experience',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

export const mockCompany = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  company_name: 'Test Company',
  company_size: '50-200',
  industry: 'Technology',
  company_website: 'https://testcompany.com',
  subscription_plan: 'company_free',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z'
}

// Test database setup
export const setupTestDatabase = async () => {
  // This would typically set up a test database
  // For now, we'll mock the responses
  return {
    cleanup: async () => {
      // Clean up test data
    }
  }
}

// Render utilities with providers
export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false }
        }
      })}>
        {children}
      </QueryClientProvider>
    )
  }

  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Mock API responses
export const mockApiResponse = (data: any, status: number = 200) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data)
  }
}

// Wait for async operations
export const waitForAsyncOperations = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// Mock fetch
global.fetch = vi.fn()

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock window.location
delete (window as any).location
window.location = {
  ...window.location,
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  href: 'http://localhost:3000'
}

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn()
    }
  })
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/'
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    toString: vi.fn()
  }),
  usePathname: () => '/'
}))

// Mock @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase
}))

// Mock @supabase/auth-helpers-nextjs
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: () => mockSupabase,
  createServerComponentClient: () => mockSupabase,
  createClientComponentClient: () => mockSupabase
}))

// Mock Stripe
vi.mock('stripe', () => ({
  default: class MockStripe {
    constructor() {
      this.checkout = {
        sessions: {
          create: vi.fn().mockResolvedValue({
            id: 'cs_test_123',
            url: 'https://checkout.stripe.com/pay/cs_test_123'
          })
        }
      }
      this.billingPortal = {
        sessions: {
          create: vi.fn().mockResolvedValue({
            url: 'https://billing.stripe.com/session/test'
          })
        }
      }
      this.subscriptions = {
        create: vi.fn(),
        retrieve: vi.fn(),
        update: vi.fn(),
        cancel: vi.fn()
      }
      this.webhooks = {
        constructEvent: vi.fn()
      }
    }
  }
}))

// Mock OpenAI
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
                  reasoning: 'Strong match based on skills and experience'
                })
              }
            }]
          })
        }
      }
    }
  }
}))

export * from '@testing-library/react'
export { vi } from 'vitest'