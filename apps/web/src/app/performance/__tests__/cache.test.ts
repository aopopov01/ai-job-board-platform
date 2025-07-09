import {
  PerformanceCache,
  PerformanceMonitor,
  debounce,
  throttle,
} from '../cache'

describe('PerformanceCache', () => {
  let cache: PerformanceCache

  beforeEach(() => {
    cache = new PerformanceCache()
  })

  it('stores and retrieves data', () => {
    cache.set('key1', 'value1', 300)
    
    expect(cache.get('key1')).toBe('value1')
  })

  it('returns null for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeNull()
  })

  it('expires data after TTL', () => {
    jest.useFakeTimers()
    
    cache.set('key1', 'value1', 1) // 1 second TTL
    expect(cache.get('key1')).toBe('value1')
    
    // Advance time by 2 seconds
    jest.advanceTimersByTime(2000)
    expect(cache.get('key1')).toBeNull()
    
    jest.useRealTimers()
  })

  it('invalidates specific keys', () => {
    cache.set('key1', 'value1', 300)
    cache.set('key2', 'value2', 300)
    
    cache.invalidate('key1')
    
    expect(cache.get('key1')).toBeNull()
    expect(cache.get('key2')).toBe('value2')
  })

  it('clears all data', () => {
    cache.set('key1', 'value1', 300)
    cache.set('key2', 'value2', 300)
    
    cache.clear()
    
    expect(cache.get('key1')).toBeNull()
    expect(cache.get('key2')).toBeNull()
  })

  it('cleans up expired entries', () => {
    jest.useFakeTimers()
    
    cache.set('key1', 'value1', 1) // 1 second TTL
    cache.set('key2', 'value2', 300) // 5 minute TTL
    
    // Advance time by 2 seconds
    jest.advanceTimersByTime(2000)
    
    cache.cleanup()
    
    expect(cache.get('key1')).toBeNull()
    expect(cache.get('key2')).toBe('value2')
    
    jest.useRealTimers()
  })
})

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    monitor = new PerformanceMonitor()
    // Mock console.log to avoid test output noise
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('measures execution time', () => {
    const endTimer = monitor.startTimer('test-operation')
    
    // Simulate some work
    const start = performance.now()
    while (performance.now() - start < 10) {
      // Wait at least 10ms
    }
    
    endTimer()
    
    const average = monitor.getAverageTime('test-operation')
    expect(average).toBeGreaterThan(0)
  })

  it('calculates average time correctly', () => {
    // Manually add some measurements
    monitor.startTimer('test')()
    monitor.startTimer('test')()
    monitor.startTimer('test')()
    
    const metrics = monitor.getAllMetrics()
    expect(metrics['test']).toBeDefined()
    expect(metrics['test'].count).toBe(3)
    expect(metrics['test'].average).toBeGreaterThan(0)
  })

  it('limits stored measurements', () => {
    // Add more than 100 measurements
    for (let i = 0; i < 150; i++) {
      monitor.startTimer('test')()
    }
    
    const metrics = monitor.getAllMetrics()
    expect(metrics['test'].count).toBe(100) // Should be limited to 100
  })

  it('returns zero for non-existent measurements', () => {
    expect(monitor.getAverageTime('nonexistent')).toBe(0)
  })
})

describe('debounce', () => {
  it('delays function execution', () => {
    jest.useFakeTimers()
    
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)
    
    debouncedFn('arg1')
    debouncedFn('arg2')
    debouncedFn('arg3')
    
    // Function should not be called immediately
    expect(mockFn).not.toHaveBeenCalled()
    
    // Fast forward time
    jest.advanceTimersByTime(100)
    
    // Function should be called once with the last arguments
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('arg3')
    
    jest.useRealTimers()
  })

  it('cancels previous calls', () => {
    jest.useFakeTimers()
    
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)
    
    debouncedFn('arg1')
    jest.advanceTimersByTime(50)
    
    debouncedFn('arg2')
    jest.advanceTimersByTime(50)
    
    // First call should be cancelled
    expect(mockFn).not.toHaveBeenCalled()
    
    jest.advanceTimersByTime(50)
    
    // Only second call should execute
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('arg2')
    
    jest.useRealTimers()
  })
})

describe('throttle', () => {
  it('limits function execution rate', () => {
    jest.useFakeTimers()
    
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 100)
    
    throttledFn('arg1')
    throttledFn('arg2')
    throttledFn('arg3')
    
    // Function should be called immediately for first call
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('arg1')
    
    // Subsequent calls should be ignored
    jest.advanceTimersByTime(50)
    throttledFn('arg4')
    expect(mockFn).toHaveBeenCalledTimes(1)
    
    // After throttle period, function can be called again
    jest.advanceTimersByTime(100)
    throttledFn('arg5')
    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn).toHaveBeenLastCalledWith('arg5')
    
    jest.useRealTimers()
  })
})