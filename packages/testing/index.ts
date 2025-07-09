// Export everything from setup
export * from './setup'

// Export testing utilities
export * from './utils/test-utils'

// Export mock server
export { server, handlers } from './mocks/server'

// Export test data
export {
  mockUser,
  mockProfile,
  mockJob,
  mockApplication,
  mockCompany,
  mockSupabase,
  mockApiResponse,
  waitForAsyncOperations,
  setupTestDatabase,
  renderWithProviders
} from './setup'

// Export common testing library functions
export {
  render,
  screen,
  fireEvent,
  waitFor,
  userEvent,
  vi,
  TestUtils,
  generateTestData,
  assertions,
  customMatchers
} from './utils/test-utils'

// Re-export Vitest functions
export {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
  test,
  suite
} from 'vitest'