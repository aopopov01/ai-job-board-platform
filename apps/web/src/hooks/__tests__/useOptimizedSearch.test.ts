import { renderHook, act } from '@testing-library/react'
import { useOptimizedSearch } from '../useOptimizedSearch'
import { jobService } from '@job-board/database'

// Mock the cache module
jest.mock('../../app/performance/cache', () => ({
  debounce: (fn: any) => fn, // Return function immediately for testing
  globalCache: {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
  },
  performanceMonitor: {
    startTimer: jest.fn(() => jest.fn()),
  },
}))

jest.mock('@job-board/database')

const mockJobService = jobService as jest.Mocked<typeof jobService>

describe('useOptimizedSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useOptimizedSearch())
    
    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('')
  })

  it('performs search and updates results', async () => {
    const mockResults = [
      { id: '1', title: 'Software Engineer', company: 'Tech Corp' },
      { id: '2', title: 'Frontend Developer', company: 'Web Solutions' },
    ]
    
    mockJobService.search.mockResolvedValue({
      data: mockResults,
      error: null,
    })

    const { result } = renderHook(() => useOptimizedSearch())
    
    await act(async () => {
      await result.current.immediateSearch({ query: 'engineer' })
    })
    
    expect(result.current.results).toEqual(mockResults)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('')
  })

  it('handles search errors', async () => {
    const errorMessage = 'Search failed'
    mockJobService.search.mockResolvedValue({
      data: null,
      error: { message: errorMessage } as any,
    })

    const { result } = renderHook(() => useOptimizedSearch())
    
    await act(async () => {
      await result.current.immediateSearch({ query: 'test' })
    })
    
    expect(result.current.results).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  it('sets loading state during search', async () => {
    let resolveSearch: (value: any) => void
    const searchPromise = new Promise((resolve) => {
      resolveSearch = resolve
    })
    
    mockJobService.search.mockReturnValue(searchPromise)

    const { result } = renderHook(() => useOptimizedSearch())
    
    act(() => {
      result.current.immediateSearch({ query: 'test' })
    })
    
    expect(result.current.loading).toBe(true)
    
    await act(async () => {
      resolveSearch!({ data: [], error: null })
    })
    
    expect(result.current.loading).toBe(false)
  })

  it('searches with different filter types', async () => {
    mockJobService.search.mockResolvedValue({
      data: [],
      error: null,
    })

    const { result } = renderHook(() => useOptimizedSearch())
    
    const filters = {
      query: 'developer',
      location: 'New York',
      category: 'technology',
      workStyle: 'remote',
      experienceLevel: 'senior',
      salaryMin: 80000,
      salaryMax: 120000,
    }
    
    await act(async () => {
      await result.current.immediateSearch(filters)
    })
    
    expect(mockJobService.search).toHaveBeenCalledWith(filters)
  })

  it('provides cache invalidation', () => {
    const { globalCache } = require('../../app/performance/cache')
    const { result } = renderHook(() => useOptimizedSearch())
    
    act(() => {
      result.current.invalidateCache()
    })
    
    expect(globalCache.clear).toHaveBeenCalled()
  })
})