import { createClient } from 'redis'

export interface CacheConfig {
  redis?: {
    host: string
    port: number
    password?: string
    db?: number
  }
  defaultTTL?: number
  maxMemoryUsage?: number
  compression?: boolean
}

export interface CacheEntry<T> {
  value: T
  timestamp: number
  ttl: number
  hits: number
  size: number
}

export class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private maxMemoryUsage: number
  private currentMemoryUsage: number = 0
  private defaultTTL: number
  private compression: boolean

  constructor(config: CacheConfig = {}) {
    this.maxMemoryUsage = config.maxMemoryUsage || 100 * 1024 * 1024 // 100MB
    this.defaultTTL = config.defaultTTL || 5 * 60 * 1000 // 5 minutes
    this.compression = config.compression || false
    
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }
    
    // Check if expired
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.delete(key)
      return null
    }
    
    // Update hit count
    entry.hits++
    
    return entry.value as T
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const actualTTL = ttl || this.defaultTTL
    const size = this.calculateSize(value)
    
    // Remove existing entry if it exists
    if (this.cache.has(key)) {
      this.delete(key)
    }
    
    // Check memory usage
    if (this.currentMemoryUsage + size > this.maxMemoryUsage) {
      await this.evictLRU(size)
    }
    
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: actualTTL,
      hits: 0,
      size
    }
    
    this.cache.set(key, entry)
    this.currentMemoryUsage += size
  }

  async delete(key: string): Promise<boolean> {
    const entry = this.cache.get(key)
    if (entry) {
      this.currentMemoryUsage -= entry.size
      this.cache.delete(key)
      return true
    }
    return false
  }

  async clear(): Promise<void> {
    this.cache.clear()
    this.currentMemoryUsage = 0
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    // Check if expired
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.delete(key)
      return false
    }
    
    return true
  }

  async keys(): Promise<string[]> {
    const validKeys: string[] = []
    const now = Date.now()
    
    for (const [key, entry] of this.cache) {
      if (now <= entry.timestamp + entry.ttl) {
        validKeys.push(key)
      }
    }
    
    return validKeys
  }

  private calculateSize(value: any): number {
    // Simple size calculation - in production, use more sophisticated method
    return JSON.stringify(value).length * 2 // Approximate UTF-16 size
  }

  private async evictLRU(neededSize: number): Promise<void> {
    // Sort by last access time (hits) and timestamp
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].hits - b[1].hits || a[1].timestamp - b[1].timestamp)
    
    let freedSize = 0
    
    for (const [key, entry] of entries) {
      if (freedSize >= neededSize) break
      
      this.cache.delete(key)
      this.currentMemoryUsage -= entry.size
      freedSize += entry.size
    }
  }

  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    for (const [key, entry] of this.cache) {
      if (now > entry.timestamp + entry.ttl) {
        keysToDelete.push(key)
      }
    }
    
    for (const key of keysToDelete) {
      this.delete(key)
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      memoryUsage: this.currentMemoryUsage,
      maxMemoryUsage: this.maxMemoryUsage,
      memoryUtilization: (this.currentMemoryUsage / this.maxMemoryUsage) * 100
    }
  }
}

export class RedisCache {
  private client: ReturnType<typeof createClient>
  private defaultTTL: number
  private connected: boolean = false

  constructor(config: CacheConfig = {}) {
    this.defaultTTL = config.defaultTTL || 5 * 60 // 5 minutes in seconds
    
    if (config.redis) {
      this.client = createClient({
        socket: {
          host: config.redis.host,
          port: config.redis.port
        },
        password: config.redis.password,
        database: config.redis.db || 0
      })
      
      this.client.on('error', (err) => {
        console.error('Redis client error:', err)
        this.connected = false
      })
      
      this.client.on('connect', () => {
        this.connected = true
      })
      
      this.connect()
    } else {
      throw new Error('Redis configuration required')
    }
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect()
      this.connected = true
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      this.connected = false
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.connected) return null
    
    try {
      const value = await this.client.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.connected) return
    
    try {
      const actualTTL = ttl || this.defaultTTL
      await this.client.setEx(key, actualTTL, JSON.stringify(value))
    } catch (error) {
      console.error('Redis set error:', error)
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.connected) return false
    
    try {
      const result = await this.client.del(key)
      return result === 1
    } catch (error) {
      console.error('Redis delete error:', error)
      return false
    }
  }

  async clear(): Promise<void> {
    if (!this.connected) return
    
    try {
      await this.client.flushDb()
    } catch (error) {
      console.error('Redis clear error:', error)
    }
  }

  async has(key: string): Promise<boolean> {
    if (!this.connected) return false
    
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      console.error('Redis exists error:', error)
      return false
    }
  }

  async keys(pattern: string = '*'): Promise<string[]> {
    if (!this.connected) return []
    
    try {
      return await this.client.keys(pattern)
    } catch (error) {
      console.error('Redis keys error:', error)
      return []
    }
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.connected) return keys.map(() => null)
    
    try {
      const values = await this.client.mGet(keys)
      return values.map(value => value ? JSON.parse(value) : null)
    } catch (error) {
      console.error('Redis mget error:', error)
      return keys.map(() => null)
    }
  }

  async mset<T>(entries: Array<[string, T]>, ttl?: number): Promise<void> {
    if (!this.connected) return
    
    try {
      const actualTTL = ttl || this.defaultTTL
      
      for (const [key, value] of entries) {
        await this.client.setEx(key, actualTTL, JSON.stringify(value))
      }
    } catch (error) {
      console.error('Redis mset error:', error)
    }
  }

  async increment(key: string, amount: number = 1): Promise<number> {
    if (!this.connected) return 0
    
    try {
      return await this.client.incrBy(key, amount)
    } catch (error) {
      console.error('Redis increment error:', error)
      return 0
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    if (!this.connected) return false
    
    try {
      const result = await this.client.expire(key, ttl)
      return result === 1
    } catch (error) {
      console.error('Redis expire error:', error)
      return false
    }
  }

  async ttl(key: string): Promise<number> {
    if (!this.connected) return -1
    
    try {
      return await this.client.ttl(key)
    } catch (error) {
      console.error('Redis ttl error:', error)
      return -1
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.disconnect()
      this.connected = false
    }
  }
}

export class MultiLevelCache {
  private l1Cache: MemoryCache
  private l2Cache: RedisCache | null = null

  constructor(config: CacheConfig = {}) {
    this.l1Cache = new MemoryCache(config)
    
    if (config.redis) {
      this.l2Cache = new RedisCache(config)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Try L1 cache first
    let value = await this.l1Cache.get<T>(key)
    if (value !== null) {
      return value
    }
    
    // Try L2 cache if available
    if (this.l2Cache) {
      value = await this.l2Cache.get<T>(key)
      if (value !== null) {
        // Populate L1 cache
        await this.l1Cache.set(key, value)
        return value
      }
    }
    
    return null
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Set in both caches
    await this.l1Cache.set(key, value, ttl)
    
    if (this.l2Cache) {
      await this.l2Cache.set(key, value, ttl ? Math.floor(ttl / 1000) : undefined)
    }
  }

  async delete(key: string): Promise<boolean> {
    const l1Result = await this.l1Cache.delete(key)
    const l2Result = this.l2Cache ? await this.l2Cache.delete(key) : false
    
    return l1Result || l2Result
  }

  async clear(): Promise<void> {
    await this.l1Cache.clear()
    
    if (this.l2Cache) {
      await this.l2Cache.clear()
    }
  }

  async has(key: string): Promise<boolean> {
    const l1Has = await this.l1Cache.has(key)
    if (l1Has) return true
    
    if (this.l2Cache) {
      return await this.l2Cache.has(key)
    }
    
    return false
  }
}

// Cache decorators
export const cacheResult = (key: string, ttl?: number) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    
    descriptor.value = async function(...args: any[]) {
      const cacheKey = `${key}:${JSON.stringify(args)}`
      
      // Try to get from cache
      const cachedResult = await cache.get(cacheKey)
      if (cachedResult !== null) {
        return cachedResult
      }
      
      // Execute method and cache result
      const result = await originalMethod.apply(this, args)
      await cache.set(cacheKey, result, ttl)
      
      return result
    }
    
    return descriptor
  }
}

// Default cache instance
export const cache = new MultiLevelCache({
  redis: process.env.REDIS_URL ? {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  } : undefined,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  compression: false
})

// Cache middleware for API routes
export const cacheMiddleware = (ttl: number = 5 * 60 * 1000) => {
  return async (req: any, res: any, next: any) => {
    const cacheKey = `api:${req.method}:${req.path}:${JSON.stringify(req.query)}`
    
    const cachedResponse = await cache.get(cacheKey)
    if (cachedResponse) {
      res.json(cachedResponse)
      return
    }
    
    // Override res.json to cache the response
    const originalJson = res.json
    res.json = function(data: any) {
      cache.set(cacheKey, data, ttl)
      return originalJson.call(this, data)
    }
    
    next()
  }
}

// React cache hook
export const useCache = () => {
  const get = async <T>(key: string): Promise<T | null> => {
    return await cache.get<T>(key)
  }
  
  const set = async <T>(key: string, value: T, ttl?: number): Promise<void> => {
    await cache.set(key, value, ttl)
  }
  
  const del = async (key: string): Promise<boolean> => {
    return await cache.delete(key)
  }
  
  const clear = async (): Promise<void> => {
    await cache.clear()
  }
  
  return { get, set, del, clear }
}

// Query cache for database results
export class QueryCache {
  private cache = new MemoryCache()
  
  async query<T>(sql: string, params: any[], executor: (sql: string, params: any[]) => Promise<T>): Promise<T> {
    const cacheKey = `query:${sql}:${JSON.stringify(params)}`
    
    const cachedResult = await this.cache.get<T>(cacheKey)
    if (cachedResult !== null) {
      return cachedResult
    }
    
    const result = await executor(sql, params)
    await this.cache.set(cacheKey, result, 2 * 60 * 1000) // 2 minutes
    
    return result
  }
  
  async invalidate(pattern: string): Promise<void> {
    const keys = await this.cache.keys()
    const keysToDelete = keys.filter(key => key.includes(pattern))
    
    for (const key of keysToDelete) {
      await this.cache.delete(key)
    }
  }
}

export const queryCache = new QueryCache()