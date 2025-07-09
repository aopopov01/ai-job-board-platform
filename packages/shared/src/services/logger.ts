import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogEntry {
  id?: string
  level: LogLevel
  message: string
  timestamp: string
  user_id?: string
  endpoint?: string
  method?: string
  status_code?: number
  response_time?: number
  ip_address?: string
  user_agent?: string
  metadata?: any
  stack_trace?: string
  request_id?: string
}

export interface LogQuery {
  level?: LogLevel
  startTime?: Date
  endTime?: Date
  userId?: string
  endpoint?: string
  limit?: number
  offset?: number
}

export class Logger {
  private static instance: Logger
  private logBuffer: LogEntry[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private bufferSize = 100
  private flushIntervalMs = 5000 // 5 seconds

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
      Logger.instance.startBufferFlush()
    }
    return Logger.instance
  }

  private constructor() {}

  // Core logging methods
  debug(message: string, metadata?: any, context?: Partial<LogEntry>): void {
    this.log(LogLevel.DEBUG, message, metadata, context)
  }

  info(message: string, metadata?: any, context?: Partial<LogEntry>): void {
    this.log(LogLevel.INFO, message, metadata, context)
  }

  warn(message: string, metadata?: any, context?: Partial<LogEntry>): void {
    this.log(LogLevel.WARN, message, metadata, context)
  }

  error(message: string, error?: Error, metadata?: any, context?: Partial<LogEntry>): void {
    this.log(LogLevel.ERROR, message, metadata, {
      ...context,
      stack_trace: error?.stack,
      metadata: {
        ...metadata,
        error_name: error?.name,
        error_message: error?.message
      }
    })
  }

  // Main logging method
  private log(level: LogLevel, message: string, metadata?: any, context?: Partial<LogEntry>): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      user_id: context?.user_id,
      endpoint: context?.endpoint,
      method: context?.method,
      status_code: context?.status_code,
      response_time: context?.response_time,
      ip_address: context?.ip_address,
      user_agent: context?.user_agent,
      metadata: metadata || context?.metadata,
      stack_trace: context?.stack_trace,
      request_id: context?.request_id || this.generateRequestId()
    }

    // Add to buffer
    this.logBuffer.push(logEntry)

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      this.consoleLog(logEntry)
    }

    // Flush buffer if full
    if (this.logBuffer.length >= this.bufferSize) {
      this.flushLogs()
    }
  }

  // HTTP request logging
  logRequest(req: any, res: any, responseTime: number): void {
    const logEntry: LogEntry = {
      level: LogLevel.INFO,
      message: `${req.method} ${req.url}`,
      timestamp: new Date().toISOString(),
      endpoint: req.url,
      method: req.method,
      status_code: res.statusCode,
      response_time: responseTime,
      ip_address: req.ip || req.connection?.remoteAddress,
      user_agent: req.headers['user-agent'],
      request_id: req.headers['x-request-id'] || this.generateRequestId()
    }

    this.logBuffer.push(logEntry)
  }

  // Authentication logging
  logAuth(event: 'login' | 'logout' | 'register' | 'password_change' | 'failed_login', userId?: string, metadata?: any): void {
    this.log(LogLevel.INFO, `Authentication event: ${event}`, metadata, {
      user_id: userId,
      endpoint: '/auth',
      metadata: {
        event,
        ...metadata
      }
    })
  }

  // Security logging
  logSecurity(event: 'rate_limit_exceeded' | 'invalid_token' | 'permission_denied' | 'suspicious_activity', details: any): void {
    this.log(LogLevel.WARN, `Security event: ${event}`, details, {
      endpoint: '/security',
      metadata: {
        event,
        ...details
      }
    })
  }

  // Business logic logging
  logBusinessEvent(event: string, details: any, userId?: string): void {
    this.log(LogLevel.INFO, `Business event: ${event}`, details, {
      user_id: userId,
      metadata: {
        event,
        ...details
      }
    })
  }

  // Performance logging
  logPerformance(operation: string, duration: number, metadata?: any): void {
    const level = duration > 5000 ? LogLevel.WARN : LogLevel.INFO
    this.log(level, `Performance: ${operation} took ${duration}ms`, metadata, {
      response_time: duration,
      metadata: {
        operation,
        duration,
        ...metadata
      }
    })
  }

  // Flush logs to database
  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return

    try {
      const logsToFlush = [...this.logBuffer]
      this.logBuffer = []

      // Insert logs into database
      await supabase
        .from('system_logs')
        .insert(logsToFlush)

      console.log(`Flushed ${logsToFlush.length} logs to database`)
    } catch (error) {
      console.error('Failed to flush logs:', error)
      
      // Put logs back in buffer if flush failed
      this.logBuffer.unshift(...this.logBuffer)
    }
  }

  // Start automatic buffer flush
  private startBufferFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flushLogs()
    }, this.flushIntervalMs)
  }

  // Stop automatic buffer flush
  stopBufferFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
  }

  // Console logging for development
  private consoleLog(logEntry: LogEntry): void {
    const color = this.getLogColor(logEntry.level)
    const timestamp = new Date(logEntry.timestamp).toLocaleTimeString()
    
    console.log(
      `${color}[${timestamp}] ${logEntry.level.toUpperCase()}: ${logEntry.message}\x1b[0m`
    )
    
    if (logEntry.metadata) {
      console.log('  Metadata:', logEntry.metadata)
    }
    
    if (logEntry.stack_trace) {
      console.log('  Stack:', logEntry.stack_trace)
    }
  }

  private getLogColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return '\x1b[36m' // Cyan
      case LogLevel.INFO: return '\x1b[32m'  // Green
      case LogLevel.WARN: return '\x1b[33m'  // Yellow
      case LogLevel.ERROR: return '\x1b[31m' // Red
      default: return '\x1b[0m'              // Reset
    }
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Query logs from database
  async queryLogs(query: LogQuery = {}): Promise<LogEntry[]> {
    try {
      let dbQuery = supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false })

      if (query.level) {
        dbQuery = dbQuery.eq('level', query.level)
      }

      if (query.startTime) {
        dbQuery = dbQuery.gte('timestamp', query.startTime.toISOString())
      }

      if (query.endTime) {
        dbQuery = dbQuery.lte('timestamp', query.endTime.toISOString())
      }

      if (query.userId) {
        dbQuery = dbQuery.eq('user_id', query.userId)
      }

      if (query.endpoint) {
        dbQuery = dbQuery.ilike('endpoint', `%${query.endpoint}%`)
      }

      if (query.limit) {
        dbQuery = dbQuery.limit(query.limit)
      }

      if (query.offset) {
        dbQuery = dbQuery.range(query.offset, query.offset + (query.limit || 100) - 1)
      }

      const { data, error } = await dbQuery

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Failed to query logs:', error)
      return []
    }
  }

  // Get log statistics
  async getLogStats(timeFrame: 'hour' | 'day' | 'week' = 'day'): Promise<{
    totalLogs: number
    logsByLevel: Record<LogLevel, number>
    logsByEndpoint: Record<string, number>
    errorRate: number
  }> {
    try {
      const timeFrameHours = timeFrame === 'hour' ? 1 : timeFrame === 'day' ? 24 : 168
      const startTime = new Date(Date.now() - timeFrameHours * 60 * 60 * 1000)

      const { data: logs } = await supabase
        .from('system_logs')
        .select('level, endpoint')
        .gte('timestamp', startTime.toISOString())

      const totalLogs = logs?.length || 0
      const logsByLevel: Record<LogLevel, number> = {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 0,
        [LogLevel.WARN]: 0,
        [LogLevel.ERROR]: 0
      }
      const logsByEndpoint: Record<string, number> = {}

      logs?.forEach(log => {
        logsByLevel[log.level as LogLevel]++
        if (log.endpoint) {
          logsByEndpoint[log.endpoint] = (logsByEndpoint[log.endpoint] || 0) + 1
        }
      })

      const errorRate = totalLogs > 0 ? (logsByLevel[LogLevel.ERROR] / totalLogs) * 100 : 0

      return {
        totalLogs,
        logsByLevel,
        logsByEndpoint,
        errorRate
      }
    } catch (error) {
      console.error('Failed to get log stats:', error)
      return {
        totalLogs: 0,
        logsByLevel: {
          [LogLevel.DEBUG]: 0,
          [LogLevel.INFO]: 0,
          [LogLevel.WARN]: 0,
          [LogLevel.ERROR]: 0
        },
        logsByEndpoint: {},
        errorRate: 0
      }
    }
  }

  // Clean up old logs
  async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
    try {
      const cutoffTime = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
      
      await supabase
        .from('system_logs')
        .delete()
        .lt('timestamp', cutoffTime.toISOString())
    } catch (error) {
      console.error('Failed to cleanup old logs:', error)
    }
  }

  // Force flush all buffered logs
  async forceFlush(): Promise<void> {
    await this.flushLogs()
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Middleware for automatic request logging
export function withLogging(handler: (req: any, res: any) => Promise<any>) {
  return async (req: any, res: any) => {
    const startTime = Date.now()
    
    try {
      const result = await handler(req, res)
      const responseTime = Date.now() - startTime
      
      logger.logRequest(req, res, responseTime)
      
      return result
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      logger.error('Request handler error', error, {
        endpoint: req.url,
        method: req.method,
        response_time: responseTime
      })
      
      throw error
    }
  }
}