import '@testing-library/jest-dom'
import React from 'react'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  useParams() {
    return {}
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return React.createElement('a', { href }, children)
  }
})

// Mock Supabase
jest.mock('@job-board/database', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
  jobService: {
    search: jest.fn(() => Promise.resolve({ data: [], error: null })),
    getById: jest.fn(() => Promise.resolve({ data: null, error: null })),
    create: jest.fn(() => Promise.resolve({ data: null, error: null })),
    update: jest.fn(() => Promise.resolve({ data: null, error: null })),
    delete: jest.fn(() => Promise.resolve({ data: null, error: null })),
  },
  userProfileService: {
    getById: jest.fn(() => Promise.resolve({ data: null, error: null })),
    create: jest.fn(() => Promise.resolve({ data: null, error: null })),
    update: jest.fn(() => Promise.resolve({ data: null, error: null })),
  },
  applicationService: {
    create: jest.fn(() => Promise.resolve({ data: null, error: null })),
    getByUser: jest.fn(() => Promise.resolve({ data: [], error: null })),
    getByJob: jest.fn(() => Promise.resolve({ data: [], error: null })),
  },
  jobCategoryService: {
    getAll: jest.fn(() => Promise.resolve({ data: [], error: null })),
    getById: jest.fn(() => Promise.resolve({ data: null, error: null })),
    create: jest.fn(() => Promise.resolve({ data: null, error: null })),
  },
}))

// Mock auth store
jest.mock('@job-board/shared', () => ({
  useAuthStore: jest.fn(() => ({
    user: null,
    profile: null,
    loading: false,
  })),
  useSignIn: jest.fn(() => ({
    signInWithEmail: jest.fn(),
    signInWithGoogle: jest.fn(),
    signInWithLinkedIn: jest.fn(),
    signInWithGitHub: jest.fn(),
  })),
  useSignOut: jest.fn(() => jest.fn()),
}))

// Mock intersection observer
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
})

// Suppress console warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})