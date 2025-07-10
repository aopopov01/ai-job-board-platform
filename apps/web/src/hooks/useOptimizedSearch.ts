import { useState, useEffect, useCallback } from 'react'
import { debounce, globalCache, performanceMonitor } from '../app/performance/cache'
import { jobService } from '@job-board/database'
import { logger } from '@/lib/logger'

interface SearchFilters {
  query?: string
  location?: string
  category?: string
  workStyle?: string
  experienceLevel?: string
  salaryMin?: number
  salaryMax?: number
}

export function useOptimizedSearch() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const performSearch = useCallback(async (filters: SearchFilters) => {
    const endTimer = performanceMonitor.startTimer('job-search')
    
    try {
      setLoading(true)
      setError('')
      
      // Create cache key from filters
      const cacheKey = `search-${JSON.stringify(filters)}`
      
      // Check cache first
      const cached = globalCache.get(cacheKey)
      if (cached) {
        setResults(cached)
        setLoading(false)
        logger.debug('Search results served from cache', { cacheKey, resultCount: cached.length })
        return
      }
      
      // Perform search
      const { data, error } = await jobService.search(filters)
      
      if (error) throw new Error(error.message || 'Search failed')
      
      const searchResults = data || []
      
      // Cache results for 5 minutes
      globalCache.set(cacheKey, searchResults, 300)
      
      setResults(searchResults)
    } catch (err: any) {
      setError(err.message || 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
      endTimer()
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
  
  // Clear cache when component unmounts or results change significantly
  const invalidateCache = useCallback(() => {
    // Clear search-related cache entries
    globalCache.clear()
  }, [])
  
  return {
    results,
    loading,
    error,
    search: debouncedSearch,
    immediateSearch,
    invalidateCache
  }
}