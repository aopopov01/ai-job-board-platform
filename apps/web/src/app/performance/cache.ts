// Performance optimization utilities
import { logger } from '@/lib/logger'
export class PerformanceCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  set(key: string, data: any, ttlSeconds: number = 300) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }
  
  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  invalidate(key: string) {
    this.cache.delete(key)
  }
  
  clear() {
    this.cache.clear()
  }
  
  // Auto-cleanup expired entries
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
export const globalCache = new PerformanceCache()

// Auto-cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => globalCache.cleanup(), 5 * 60 * 1000)
}

// Debounce utility for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: { [key: string]: number[] } = {}
  
  startTimer(label: string): () => void {
    const start = performance.now()
    
    return () => {
      const duration = performance.now() - start
      if (!this.metrics[label]) {
        this.metrics[label] = []
      }
      this.metrics[label].push(duration)
      
      // Keep only last 100 measurements
      if (this.metrics[label].length > 100) {
        this.metrics[label] = this.metrics[label].slice(-100)
      }
      
      logger.debug('Performance measurement', { label, duration: `${duration.toFixed(2)}ms` })
    }
  }
  
  getAverageTime(label: string): number {
    const times = this.metrics[label]
    if (!times || times.length === 0) return 0
    return times.reduce((sum, time) => sum + time, 0) / times.length
  }
  
  getAllMetrics() {
    const result: { [key: string]: { average: number; count: number } } = {}
    for (const [label, times] of Object.entries(this.metrics)) {
      result[label] = {
        average: this.getAverageTime(label),
        count: times.length
      }
    }
    return result
  }
}

export const performanceMonitor = new PerformanceMonitor()