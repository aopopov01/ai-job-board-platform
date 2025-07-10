import { useState, useCallback } from 'react'

interface SearchFilters {
  query?: string
  location?: string
  category?: string
  workStyle?: string
  experienceLevel?: string
  salaryMin?: number
  salaryMax?: number
}

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null
  return ((...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}

export function useOptimizedSearch() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const performSearch = useCallback(async (filters: SearchFilters) => {
    try {
      setLoading(true)
      setError('')
      
      // Simulate API call - replace with actual job service
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock search results
      const mockResults = [
        { id: 1, title: 'Software Engineer', company: 'Tech Corp', location: 'Remote' },
        { id: 2, title: 'Product Manager', company: 'Startup Inc', location: 'San Francisco' },
        { id: 3, title: 'Designer', company: 'Design Studio', location: 'New York' }
      ].filter(job => 
        !filters.query || job.title.toLowerCase().includes(filters.query.toLowerCase())
      )
      
      setResults(mockResults)
    } catch (err: any) {
      setError(err.message || 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Debounced search function (500ms delay)
  const debouncedSearch = useCallback(
    debounce((filters: SearchFilters) => performSearch(filters), 500),
    [performSearch]
  )
  
  // Immediate search (for filters, buttons)
  const immediateSearch = useCallback(
    (filters: SearchFilters) => performSearch(filters),
    [performSearch]
  )
  
  return {
    results,
    loading,
    error,
    search: debouncedSearch,
    immediateSearch
  }
}