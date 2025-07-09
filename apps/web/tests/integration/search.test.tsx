import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JobsPage from '../../src/app/jobs/page'
import { jobService, jobCategoryService } from '@job-board/database'

// Mock the job service
jest.mock('@job-board/database')
const mockJobService = jobService as jest.Mocked<typeof jobService>
const mockJobCategoryService = jobCategoryService as jest.Mocked<typeof jobCategoryService>

// Mock auth store
const mockUseAuthStore = jest.fn()
jest.mock('@job-board/shared', () => ({
  useAuthStore: () => mockUseAuthStore(),
}))

describe('Jobs Search Integration', () => {
  const mockJobs = [
    {
      id: '1',
      title: 'Senior React Developer',
      description: 'Build amazing React applications',
      company_profiles: {
        company_name: 'Tech Corp',
        industry: 'Technology',
      },
      location: 'New York, NY',
      work_style: 'remote',
      job_type: 'full_time',
      experience_level: 'senior',
      salary_min: 90000,
      salary_max: 120000,
      salary_currency: 'USD',
      created_at: '2024-01-01',
      job_categories: { name: 'Engineering' },
    },
    {
      id: '2',
      title: 'Frontend Developer',
      description: 'Create beautiful user interfaces',
      company_profiles: {
        company_name: 'Design Studio',
        industry: 'Design',
      },
      location: 'San Francisco, CA',
      work_style: 'hybrid',
      job_type: 'full_time',
      experience_level: 'mid',
      salary_min: 70000,
      salary_max: 95000,
      salary_currency: 'USD',
      created_at: '2024-01-02',
      job_categories: { name: 'Engineering' },
    },
  ]

  const mockCategories = [
    { id: '1', name: 'Engineering' },
    { id: '2', name: 'Design' },
    { id: '3', name: 'Marketing' },
  ]

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Mock auth store to return no user (public access)
    mockUseAuthStore.mockReturnValue({
      user: null,
      profile: null,
      loading: false,
    })

    // Mock successful API responses
    mockJobService.search.mockResolvedValue({
      data: mockJobs,
      error: null,
    })

    // Mock categories API
    mockJobCategoryService.getAll.mockResolvedValue({
      data: mockCategories,
      error: null,
    })
  })

  it('renders jobs list on initial load', async () => {
    render(<JobsPage />)
    
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.getByText('Tech Corp')).toBeInTheDocument()
    expect(screen.getByText('Design Studio')).toBeInTheDocument()
  })

  it('filters jobs by search query', async () => {
    const user = userEvent.setup()
    render(<JobsPage />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument()
    })
    
    // Find and interact with search input
    const searchInput = screen.getByPlaceholderText(/job title, company, or keywords/i)
    await user.type(searchInput, 'React')
    
    // Mock filtered results
    mockJobService.search.mockResolvedValue({
      data: [mockJobs[0]], // Only React job
      error: null,
    })
    
    // Click search button to trigger search
    const searchButton = screen.getByRole('button', { name: /search jobs/i })
    await user.click(searchButton)
    
    await waitFor(() => {
      expect(mockJobService.search).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'React',
        })
      )
    })
  })

  it('filters jobs by location', async () => {
    const user = userEvent.setup()
    render(<JobsPage />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument()
    })
    
    // Find location filter
    const locationInput = screen.getByPlaceholderText(/city, state, or remote/i)
    await user.type(locationInput, 'New York')
    
    // Click search button to trigger search
    const searchButton = screen.getByRole('button', { name: /search jobs/i })
    await user.click(searchButton)
    
    await waitFor(() => {
      expect(mockJobService.search).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'New York',
        })
      )
    })
  })

  it('filters jobs by work style', async () => {
    const user = userEvent.setup()
    render(<JobsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument()
    })
    
    // Find work style filter by finding select near the "Work Style" label  
    const workStyleSelect = screen.getAllByRole('combobox')[2] // Third select (category, job type, work style)
    await user.selectOptions(workStyleSelect, 'remote')
    
    // Click search button to trigger search
    const searchButton = screen.getByRole('button', { name: /search jobs/i })
    await user.click(searchButton)
    
    await waitFor(() => {
      expect(mockJobService.search).toHaveBeenCalledWith(
        expect.objectContaining({
          work_style: 'remote',
        })
      )
    })
  })

  it('displays error message when search fails', async () => {
    // Mock API error
    mockJobService.search.mockResolvedValue({
      data: null,
      error: { message: 'Search failed' } as any,
    })
    
    render(<JobsPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/search failed/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during search', async () => {
    // Mock delayed response
    let resolveSearch: (value: any) => void
    const searchPromise = new Promise((resolve) => {
      resolveSearch = resolve
    })
    mockJobService.search.mockReturnValue(searchPromise)
    
    render(<JobsPage />)
    
    // Should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    // Resolve the promise
    await waitFor(() => {
      resolveSearch!({ data: mockJobs, error: null })
    })
    
    // Loading should be gone
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })

  it('resets filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<JobsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument()
    })
    
    // Apply some filters
    const searchInput = screen.getByPlaceholderText(/job title, company, or keywords/i)
    await user.type(searchInput, 'React')
    
    // Clear mock call history
    mockJobService.search.mockClear()
    
    // Find and click clear/reset button
    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)
    
    // Should call search with empty filters after clearing
    await waitFor(() => {
      expect(mockJobService.search).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20
        })
      )
    }, { timeout: 3000 })
  })

  it('displays job details correctly', async () => {
    render(<JobsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument()
    })
    
    // Check basic job details are displayed
    expect(screen.getByText('Tech Corp')).toBeInTheDocument()
    expect(screen.getByText('New York, NY')).toBeInTheDocument()
    // Just verify the job is displayed with basic info
    expect(screen.getByText('Build amazing React applications')).toBeInTheDocument()
  })
})