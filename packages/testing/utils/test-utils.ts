import { vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@job-board/shared'
import { mockUser, mockProfile, mockApiResponse } from '../setup'

// Test utilities for common testing patterns
export class TestUtils {
  // Setup user event
  static setupUser() {
    return userEvent.setup()
  }

  // Create test query client
  static createTestQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    })
  }

  // Render component with all providers
  static renderWithProviders(
    ui: React.ReactElement,
    {
      initialUser = mockUser,
      initialProfile = mockProfile,
      queryClient = TestUtils.createTestQueryClient(),
      ...renderOptions
    } = {}
  ) {
    const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialUser={initialUser} initialProfile={initialProfile}>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    )

    return render(ui, { wrapper: AllTheProviders, ...renderOptions })
  }

  // Wait for loading to complete
  static async waitForLoadingToFinish() {
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  }

  // Wait for error to appear
  static async waitForError() {
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  }

  // Fill form fields
  static async fillForm(fields: Record<string, string>) {
    const user = TestUtils.setupUser()
    
    for (const [fieldName, value] of Object.entries(fields)) {
      const field = screen.getByLabelText(new RegExp(fieldName, 'i'))
      await user.clear(field)
      await user.type(field, value)
    }
  }

  // Submit form
  static async submitForm(buttonText: string = 'submit') {
    const user = TestUtils.setupUser()
    const submitButton = screen.getByRole('button', { name: new RegExp(buttonText, 'i') })
    await user.click(submitButton)
  }

  // Mock API call
  static mockApiCall(url: string, response: any, status: number = 200) {
    const mockFetch = vi.fn().mockResolvedValue(mockApiResponse(response, status))
    global.fetch = mockFetch
    return mockFetch
  }

  // Mock API error
  static mockApiError(url: string, errorMessage: string, status: number = 500) {
    const mockFetch = vi.fn().mockRejectedValue(new Error(errorMessage))
    global.fetch = mockFetch
    return mockFetch
  }

  // Wait for API call
  static async waitForApiCall(mockFetch: ReturnType<typeof vi.fn>) {
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  }

  // Assert API call was made
  static expectApiCall(mockFetch: ReturnType<typeof vi.fn>, url: string, options?: any) {
    expect(mockFetch).toHaveBeenCalledWith(url, options)
  }

  // Mock file upload
  static createMockFile(name: string, content: string, type: string = 'text/plain') {
    const file = new File([content], name, { type })
    Object.defineProperty(file, 'size', { value: content.length })
    return file
  }

  // Simulate file upload
  static async uploadFile(inputElement: HTMLInputElement, file: File) {
    const user = TestUtils.setupUser()
    await user.upload(inputElement, file)
  }

  // Mock localStorage
  static mockLocalStorage() {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
    return localStorageMock
  }

  // Mock sessionStorage
  static mockSessionStorage() {
    const sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    })
    return sessionStorageMock
  }

  // Mock window.location
  static mockLocation(href: string = 'http://localhost:3000') {
    const locationMock = {
      href,
      origin: 'http://localhost:3000',
      pathname: '/',
      search: '',
      hash: '',
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
    }
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
    })
    return locationMock
  }

  // Mock console methods
  static mockConsole() {
    const consoleMock = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
    }
    Object.defineProperty(console, 'log', { value: consoleMock.log })
    Object.defineProperty(console, 'error', { value: consoleMock.error })
    Object.defineProperty(console, 'warn', { value: consoleMock.warn })
    Object.defineProperty(console, 'info', { value: consoleMock.info })
    Object.defineProperty(console, 'debug', { value: consoleMock.debug })
    return consoleMock
  }

  // Generate random test data
  static generateTestData = {
    email: () => `test-${Math.random().toString(36).substr(2, 9)}@example.com`,
    id: () => `${Math.random().toString(36).substr(2, 9)}`,
    uuid: () => '123e4567-e89b-12d3-a456-' + Math.random().toString(36).substr(2, 12),
    name: () => `Test User ${Math.random().toString(36).substr(2, 5)}`,
    company: () => `Test Company ${Math.random().toString(36).substr(2, 5)}`,
    jobTitle: () => `Test Job ${Math.random().toString(36).substr(2, 5)}`,
    description: () => `Test description ${Math.random().toString(36).substr(2, 20)}`,
    number: (min: number = 1, max: number = 100) => Math.floor(Math.random() * (max - min + 1)) + min,
    boolean: () => Math.random() > 0.5,
    date: () => new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    array: <T>(generator: () => T, length: number = 5) => Array.from({ length }, generator),
  }

  // Wait for element to appear
  static async waitForElement(text: string | RegExp, options?: any) {
    return await screen.findByText(text, options)
  }

  // Wait for element to disappear
  static async waitForElementToBeRemoved(text: string | RegExp) {
    await waitFor(() => {
      expect(screen.queryByText(text)).not.toBeInTheDocument()
    })
  }

  // Check if element exists
  static elementExists(text: string | RegExp) {
    return screen.queryByText(text) !== null
  }

  // Get element by test id
  static getByTestId(testId: string) {
    return screen.getByTestId(testId)
  }

  // Query element by test id
  static queryByTestId(testId: string) {
    return screen.queryByTestId(testId)
  }

  // Mock timers
  static mockTimers() {
    vi.useFakeTimers()
    return {
      advanceTimersByTime: vi.advanceTimersByTime,
      runAllTimers: vi.runAllTimers,
      runOnlyPendingTimers: vi.runOnlyPendingTimers,
      restore: vi.useRealTimers,
    }
  }

  // Mock date
  static mockDate(date: string | Date) {
    const mockDate = new Date(date)
    vi.setSystemTime(mockDate)
    return mockDate
  }

  // Create mock component
  static createMockComponent(name: string, props: any = {}) {
    return vi.fn().mockImplementation((componentProps) => {
      return <div data-testid={`mock-${name.toLowerCase()}`} {...componentProps} />
    })
  }

  // Mock React hook
  static mockHook<T>(hookName: string, returnValue: T) {
    return vi.fn().mockReturnValue(returnValue)
  }

  // Assert accessibility
  static async assertAccessibility(container: HTMLElement) {
    const { axe } = await import('axe-core')
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  }

  // Mock intersection observer
  static mockIntersectionObserver() {
    const mockIntersectionObserver = vi.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })
    window.IntersectionObserver = mockIntersectionObserver
    return mockIntersectionObserver
  }

  // Mock resize observer
  static mockResizeObserver() {
    const mockResizeObserver = vi.fn()
    mockResizeObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })
    window.ResizeObserver = mockResizeObserver
    return mockResizeObserver
  }

  // Mock window.matchMedia
  static mockMatchMedia(matches: boolean = false) {
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    window.matchMedia = mockMatchMedia
    return mockMatchMedia
  }

  // Mock clipboard
  static mockClipboard() {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    }
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    })
    return mockClipboard
  }

  // Mock geolocation
  static mockGeolocation() {
    const mockGeolocation = {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    }
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    })
    return mockGeolocation
  }

  // Mock notifications
  static mockNotifications() {
    const mockNotification = vi.fn()
    mockNotification.requestPermission = vi.fn().mockResolvedValue('granted')
    mockNotification.permission = 'granted'
    window.Notification = mockNotification
    return mockNotification
  }

  // Performance testing utilities
  static measurePerformance(fn: () => Promise<void> | void) {
    const start = performance.now()
    const result = fn()
    
    if (result instanceof Promise) {
      return result.then(() => {
        const end = performance.now()
        return end - start
      })
    } else {
      const end = performance.now()
      return end - start
    }
  }

  // Create test suite
  static createTestSuite(name: string, tests: Array<{ name: string; test: () => void | Promise<void> }>) {
    describe(name, () => {
      tests.forEach(({ name: testName, test }) => {
        it(testName, test)
      })
    })
  }

  // Create parameterized test
  static createParameterizedTest<T>(
    name: string,
    testCases: Array<{ name: string; data: T }>,
    testFn: (data: T) => void | Promise<void>
  ) {
    describe(name, () => {
      testCases.forEach(({ name: caseName, data }) => {
        it(caseName, () => testFn(data))
      })
    })
  }
}

// Export commonly used testing utilities
export {
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent,
  vi,
}

// Export test data generators
export const { generateTestData } = TestUtils

// Export assertion helpers
export const assertions = {
  toBeInTheDocument: expect.extend({
    toBeInTheDocument(received) {
      const pass = received !== null && received !== undefined
      return {
        message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
        pass,
      }
    },
  }),
}

// Export custom matchers
export const customMatchers = {
  toHaveClass: (element: HTMLElement, className: string) => {
    return element.classList.contains(className)
  },
  toHaveValue: (element: HTMLInputElement, value: string) => {
    return element.value === value
  },
  toBeDisabled: (element: HTMLElement) => {
    return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true'
  },
  toBeVisible: (element: HTMLElement) => {
    return element.offsetParent !== null
  },
}