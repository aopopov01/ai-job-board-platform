import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TestUtils, mockUser, mockProfile } from '../../../../lib/test-utils'
import LoginPage from '../page'

describe('LoginPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    TestUtils.renderWithProviders(<LoginPage />)
    
    expect(TestUtils.screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(TestUtils.screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(TestUtils.screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('displays validation errors for empty fields', async () => {
    TestUtils.renderWithProviders(<LoginPage />)
    
    // Try to submit form without filling fields
    await TestUtils.submitForm('sign in')
    
    expect(TestUtils.screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(TestUtils.screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('validates email format', async () => {
    TestUtils.renderWithProviders(<LoginPage />)
    
    await TestUtils.fillForm({
      email: 'invalid-email',
      password: 'password123'
    })
    
    await TestUtils.submitForm('sign in')
    
    expect(TestUtils.screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
  })

  it('submits login form successfully', async () => {
    const mockFetch = TestUtils.mockApiCall('/api/auth/login', {
      user: mockUser,
      session: { access_token: 'token', refresh_token: 'refresh' }
    })
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    await TestUtils.fillForm({
      email: 'test@example.com',
      password: 'password123'
    })
    
    await TestUtils.submitForm('sign in')
    
    await TestUtils.waitForApiCall(mockFetch)
    
    TestUtils.expectApiCall(mockFetch, '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('handles login error correctly', async () => {
    const mockFetch = TestUtils.mockApiError('/api/auth/login', 'Invalid credentials', 401)
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    await TestUtils.fillForm({
      email: 'test@example.com',
      password: 'wrongpassword'
    })
    
    await TestUtils.submitForm('sign in')
    
    await TestUtils.waitForError()
    
    expect(TestUtils.screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })

  it('displays loading state during login', async () => {
    // Mock a delayed response
    const mockFetch = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(TestUtils.mockApiResponse({
        user: mockUser,
        session: { access_token: 'token', refresh_token: 'refresh' }
      })), 100))
    )
    global.fetch = mockFetch
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    await TestUtils.fillForm({
      email: 'test@example.com',
      password: 'password123'
    })
    
    await TestUtils.submitForm('sign in')
    
    // Check for loading state
    expect(TestUtils.screen.getByText(/signing in/i)).toBeInTheDocument()
    expect(TestUtils.screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })

  it('navigates to dashboard after successful login', async () => {
    const mockPush = vi.fn()
    vi.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
      useSearchParams: () => ({ get: vi.fn() })
    }))
    
    TestUtils.mockApiCall('/api/auth/login', {
      user: mockUser,
      session: { access_token: 'token', refresh_token: 'refresh' }
    })
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    await TestUtils.fillForm({
      email: 'test@example.com',
      password: 'password123'
    })
    
    await TestUtils.submitForm('sign in')
    
    await TestUtils.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles OAuth login buttons', async () => {
    const mockLocation = TestUtils.mockLocation()
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    const googleButton = TestUtils.screen.getByRole('button', { name: /continue with google/i })
    const linkedinButton = TestUtils.screen.getByRole('button', { name: /continue with linkedin/i })
    const githubButton = TestUtils.screen.getByRole('button', { name: /continue with github/i })
    
    expect(googleButton).toBeInTheDocument()
    expect(linkedinButton).toBeInTheDocument()
    expect(githubButton).toBeInTheDocument()
    
    // Test Google OAuth
    await TestUtils.userEvent.click(googleButton)
    expect(mockLocation.assign).toHaveBeenCalledWith(expect.stringContaining('google'))
  })

  it('shows password visibility toggle', async () => {
    TestUtils.renderWithProviders(<LoginPage />)
    
    const passwordInput = TestUtils.screen.getByLabelText(/password/i)
    const toggleButton = TestUtils.screen.getByRole('button', { name: /show password/i })
    
    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click toggle to show password
    await TestUtils.userEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click toggle again to hide password
    await TestUtils.userEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('handles redirect parameter correctly', async () => {
    const mockPush = vi.fn()
    vi.mock('next/navigation', () => ({
      useRouter: () => ({ push: mockPush }),
      useSearchParams: () => ({ get: vi.fn().mockReturnValue('/jobs/123') })
    }))
    
    TestUtils.mockApiCall('/api/auth/login', {
      user: mockUser,
      session: { access_token: 'token', refresh_token: 'refresh' }
    })
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    await TestUtils.fillForm({
      email: 'test@example.com',
      password: 'password123'
    })
    
    await TestUtils.submitForm('sign in')
    
    await TestUtils.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/jobs/123')
    })
  })

  it('is accessible', async () => {
    const { container } = TestUtils.renderWithProviders(<LoginPage />)
    await TestUtils.assertAccessibility(container)
  })
})

describe('LoginPage Performance', () => {
  it('renders within performance budget', async () => {
    const renderTime = await TestUtils.measurePerformance(() => {
      TestUtils.renderWithProviders(<LoginPage />)
    })
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100)
  })
  
  it('handles form submission within performance budget', async () => {
    TestUtils.mockApiCall('/api/auth/login', {
      user: mockUser,
      session: { access_token: 'token', refresh_token: 'refresh' }
    })
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    const submissionTime = await TestUtils.measurePerformance(async () => {
      await TestUtils.fillForm({
        email: 'test@example.com',
        password: 'password123'
      })
      
      await TestUtils.submitForm('sign in')
    })
    
    // Should complete within 200ms
    expect(submissionTime).toBeLessThan(200)
  })
})

describe('LoginPage Edge Cases', () => {
  it('handles network errors gracefully', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    await TestUtils.fillForm({
      email: 'test@example.com',
      password: 'password123'
    })
    
    await TestUtils.submitForm('sign in')
    
    await TestUtils.waitForError()
    
    expect(TestUtils.screen.getByText(/network error/i)).toBeInTheDocument()
  })
  
  it('handles server errors gracefully', async () => {
    TestUtils.mockApiCall('/api/auth/login', { error: 'Internal server error' }, 500)
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    await TestUtils.fillForm({
      email: 'test@example.com',
      password: 'password123'
    })
    
    await TestUtils.submitForm('sign in')
    
    await TestUtils.waitForError()
    
    expect(TestUtils.screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })
  
  it('prevents double submission', async () => {
    const mockFetch = TestUtils.mockApiCall('/api/auth/login', {
      user: mockUser,
      session: { access_token: 'token', refresh_token: 'refresh' }
    })
    
    TestUtils.renderWithProviders(<LoginPage />)
    
    await TestUtils.fillForm({
      email: 'test@example.com',
      password: 'password123'
    })
    
    const submitButton = TestUtils.screen.getByRole('button', { name: /sign in/i })
    
    // Click submit twice quickly
    await TestUtils.userEvent.click(submitButton)
    await TestUtils.userEvent.click(submitButton)
    
    // Should only call API once
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})