import { performance } from 'perf_hooks'

export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count' | 'percentage'
  timestamp: number
  metadata?: Record<string, any>
}

export interface PerformanceThreshold {
  name: string
  warning: number
  critical: number
  unit: 'ms' | 'bytes' | 'count' | 'percentage'
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private thresholds: Map<string, PerformanceThreshold> = new Map()
  private observers: Map<string, ((metric: PerformanceMetric) => void)[]> = new Map()

  constructor() {
    this.setupDefaultThresholds()
  }

  private setupDefaultThresholds() {
    const defaultThresholds: PerformanceThreshold[] = [
      { name: 'api_response_time', warning: 500, critical: 1000, unit: 'ms' },
      { name: 'database_query_time', warning: 100, critical: 500, unit: 'ms' },
      { name: 'page_load_time', warning: 2000, critical: 5000, unit: 'ms' },
      { name: 'bundle_size', warning: 250000, critical: 500000, unit: 'bytes' },
      { name: 'memory_usage', warning: 80, critical: 95, unit: 'percentage' },
      { name: 'cpu_usage', warning: 70, critical: 90, unit: 'percentage' },
      { name: 'error_rate', warning: 1, critical: 5, unit: 'percentage' }
    ]

    defaultThresholds.forEach(threshold => {
      this.thresholds.set(threshold.name, threshold)
    })
  }

  // Record a performance metric
  recordMetric(name: string, value: number, unit: PerformanceMetric['unit'], metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      metadata
    }

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const metrics = this.metrics.get(name)!
    metrics.push(metric)

    // Keep only last 1000 metrics per type
    if (metrics.length > 1000) {
      metrics.shift()
    }

    this.checkThresholds(metric)
    this.notifyObservers(metric)
  }

  // Time execution of a function
  async timeExecution<T>(name: string, fn: () => Promise<T> | T, metadata?: Record<string, any>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.recordMetric(name, duration, 'ms', metadata)
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.recordMetric(name, duration, 'ms', { ...metadata, error: true })
      throw error
    }
  }

  // Measure memory usage
  measureMemoryUsage(name: string = 'memory_usage') {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage()
      this.recordMetric(`${name}_heap_used`, usage.heapUsed, 'bytes')
      this.recordMetric(`${name}_heap_total`, usage.heapTotal, 'bytes')
      this.recordMetric(`${name}_rss`, usage.rss, 'bytes')
      this.recordMetric(`${name}_external`, usage.external, 'bytes')
    }
  }

  // Monitor API response times
  createAPIMonitor() {
    return {
      before: (req: any) => {
        req.startTime = performance.now()
      },
      after: (req: any, res: any) => {
        if (req.startTime) {
          const duration = performance.now() - req.startTime
          this.recordMetric('api_response_time', duration, 'ms', {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            user_agent: req.headers['user-agent']
          })
        }
      }
    }
  }

  // Monitor database queries
  createDatabaseMonitor() {
    return {
      query: async (originalQuery: Function, queryText: string, params?: any[]) => {
        const start = performance.now()
        try {
          const result = await originalQuery(queryText, params)
          const duration = performance.now() - start
          this.recordMetric('database_query_time', duration, 'ms', {
            query: queryText.slice(0, 100),
            params_count: params?.length || 0,
            success: true
          })
          return result
        } catch (error) {
          const duration = performance.now() - start
          this.recordMetric('database_query_time', duration, 'ms', {
            query: queryText.slice(0, 100),
            params_count: params?.length || 0,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          throw error
        }
      }
    }
  }

  // Monitor frontend performance
  monitorFrontendPerformance() {
    if (typeof window !== 'undefined' && window.performance) {
      // Monitor page load time
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
      this.recordMetric('page_load_time', loadTime, 'ms')

      // Monitor DOM content loaded
      const domContentLoaded = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart
      this.recordMetric('dom_content_loaded', domContentLoaded, 'ms')

      // Monitor first contentful paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('first_contentful_paint', entry.startTime, 'ms')
          }
          if (entry.name === 'largest-contentful-paint') {
            this.recordMetric('largest_contentful_paint', entry.startTime, 'ms')
          }
        }
      })

      observer.observe({ type: 'paint', buffered: true })
      observer.observe({ type: 'largest-contentful-paint', buffered: true })
    }
  }

  // Get metrics for a specific name
  getMetrics(name: string, limit: number = 100): PerformanceMetric[] {
    const metrics = this.metrics.get(name) || []
    return metrics.slice(-limit)
  }

  // Get average value for a metric
  getAverageMetric(name: string, timeWindow: number = 5 * 60 * 1000): number {
    const metrics = this.getMetrics(name)
    const now = Date.now()
    const recentMetrics = metrics.filter(m => now - m.timestamp <= timeWindow)
    
    if (recentMetrics.length === 0) return 0
    
    const sum = recentMetrics.reduce((acc, m) => acc + m.value, 0)
    return sum / recentMetrics.length
  }

  // Get percentile for a metric
  getPercentile(name: string, percentile: number, timeWindow: number = 5 * 60 * 1000): number {
    const metrics = this.getMetrics(name)
    const now = Date.now()
    const recentMetrics = metrics.filter(m => now - m.timestamp <= timeWindow)
    
    if (recentMetrics.length === 0) return 0
    
    const sorted = recentMetrics.map(m => m.value).sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[index] || 0
  }

  // Set threshold for a metric
  setThreshold(name: string, warning: number, critical: number, unit: PerformanceMetric['unit']) {
    this.thresholds.set(name, { name, warning, critical, unit })
  }

  // Check if metric exceeds thresholds
  private checkThresholds(metric: PerformanceMetric) {
    const threshold = this.thresholds.get(metric.name)
    if (!threshold) return

    if (metric.value >= threshold.critical) {
      this.notifyThresholdViolation(metric, 'critical')
    } else if (metric.value >= threshold.warning) {
      this.notifyThresholdViolation(metric, 'warning')
    }
  }

  // Notify threshold violation
  private notifyThresholdViolation(metric: PerformanceMetric, level: 'warning' | 'critical') {
    console.warn(`Performance ${level}: ${metric.name} = ${metric.value}${metric.unit}`)
    
    // Send to monitoring service
    this.sendToMonitoringService({
      type: 'threshold_violation',
      level,
      metric,
      timestamp: Date.now()
    })
  }

  // Add observer for metric updates
  addObserver(metricName: string, callback: (metric: PerformanceMetric) => void) {
    if (!this.observers.has(metricName)) {
      this.observers.set(metricName, [])
    }
    this.observers.get(metricName)!.push(callback)
  }

  // Remove observer
  removeObserver(metricName: string, callback: (metric: PerformanceMetric) => void) {
    const observers = this.observers.get(metricName)
    if (observers) {
      const index = observers.indexOf(callback)
      if (index > -1) {
        observers.splice(index, 1)
      }
    }
  }

  // Notify observers
  private notifyObservers(metric: PerformanceMetric) {
    const observers = this.observers.get(metric.name)
    if (observers) {
      observers.forEach(callback => callback(metric))
    }
  }

  // Send data to external monitoring service
  private sendToMonitoringService(data: any) {
    // Implementation would send to services like DataDog, New Relic, etc.
    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Monitoring:', data)
    }
  }

  // Get performance summary
  getPerformanceSummary(timeWindow: number = 5 * 60 * 1000) {
    const summary: Record<string, any> = {}
    
    for (const [name] of this.metrics) {
      summary[name] = {
        average: this.getAverageMetric(name, timeWindow),
        p50: this.getPercentile(name, 50, timeWindow),
        p90: this.getPercentile(name, 90, timeWindow),
        p99: this.getPercentile(name, 99, timeWindow),
        count: this.getMetrics(name).filter(m => Date.now() - m.timestamp <= timeWindow).length
      }
    }
    
    return summary
  }

  // Export metrics for analysis
  exportMetrics(format: 'json' | 'csv' = 'json') {
    const allMetrics: PerformanceMetric[] = []
    
    for (const [name, metrics] of this.metrics) {
      allMetrics.push(...metrics)
    }
    
    if (format === 'json') {
      return JSON.stringify(allMetrics, null, 2)
    } else {
      // CSV format
      const headers = ['name', 'value', 'unit', 'timestamp', 'metadata']
      const rows = allMetrics.map(m => [
        m.name,
        m.value,
        m.unit,
        m.timestamp,
        JSON.stringify(m.metadata || {})
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
  }

  // Clear old metrics
  clearOldMetrics(olderThan: number = 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - olderThan
    
    for (const [name, metrics] of this.metrics) {
      const filteredMetrics = metrics.filter(m => m.timestamp > cutoff)
      this.metrics.set(name, filteredMetrics)
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions
export const measureAsync = <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  return performanceMonitor.timeExecution(name, fn)
}

export const measureSync = <T>(name: string, fn: () => T): T => {
  return performanceMonitor.timeExecution(name, fn) as T
}

export const recordMetric = (name: string, value: number, unit: PerformanceMetric['unit'], metadata?: Record<string, any>) => {
  performanceMonitor.recordMetric(name, value, unit, metadata)
}

// Performance decorators
export const performanceDecorator = (metricName: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    
    descriptor.value = async function(...args: any[]) {
      const start = performance.now()
      try {
        const result = await originalMethod.apply(this, args)
        const duration = performance.now() - start
        performanceMonitor.recordMetric(metricName, duration, 'ms', {
          method: propertyKey,
          class: target.constructor.name,
          args_count: args.length
        })
        return result
      } catch (error) {
        const duration = performance.now() - start
        performanceMonitor.recordMetric(metricName, duration, 'ms', {
          method: propertyKey,
          class: target.constructor.name,
          args_count: args.length,
          error: true
        })
        throw error
      }
    }
    
    return descriptor
  }
}

// React performance hooks
export const usePerformanceMonitor = () => {
  const recordMetric = (name: string, value: number, unit: PerformanceMetric['unit'], metadata?: Record<string, any>) => {
    performanceMonitor.recordMetric(name, value, unit, metadata)
  }

  const measureRender = (componentName: string) => {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      performanceMonitor.recordMetric('component_render_time', duration, 'ms', {
        component: componentName
      })
    }
  }

  return {
    recordMetric,
    measureRender,
    getMetrics: (name: string) => performanceMonitor.getMetrics(name),
    getAverage: (name: string) => performanceMonitor.getAverageMetric(name),
    getPercentile: (name: string, percentile: number) => performanceMonitor.getPercentile(name, percentile)
  }
}