// Production-ready logging utility that replaces console statements
// This logger provides structured logging with proper error handling

// Utility function to safely convert unknown error to Error
export function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  
  if (typeof error === 'string') {
    return new Error(error)
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return new Error(String(error.message))
  }
  
  return new Error('Unknown error occurred')
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
  userId?: string
  traceId?: string
}

export class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isDevelopment = process.env.NODE_ENV === 'development'

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      traceId: this.generateTraceId(),
      userId: this.getCurrentUserId()
    }
  }

  private generateTraceId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  private getCurrentUserId(): string | undefined {
    // This would typically come from your auth context
    // For now, returning undefined as we don't have access to auth in this utility
    return undefined
  }

  private addToMemory(entry: LogEntry): void {
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  private async sendToMonitoring(entry: LogEntry): Promise<void> {
    // Only send error and warn logs to monitoring in production
    if (process.env.NODE_ENV === 'production' && 
        (entry.level === LogLevel.ERROR || entry.level === LogLevel.WARN)) {
      try {
        await fetch('/api/monitoring/error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        })
      } catch (monitoringError) {
        // Fallback to console only in development for monitoring errors
        if (this.isDevelopment) {
          console.error('Failed to send log to monitoring:', monitoringError)
        }
      }
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    const entry = this.createLogEntry(level, message, context, error)
    this.addToMemory(entry)
    
    // In development, output to console for debugging
    if (this.isDevelopment) {
      switch (level) {
        case LogLevel.ERROR:
          console.error(`[${entry.timestamp}] ERROR: ${message}`, context, error)
          break
        case LogLevel.WARN:
          console.warn(`[${entry.timestamp}] WARN: ${message}`, context)
          break
        case LogLevel.INFO:
          console.info(`[${entry.timestamp}] INFO: ${message}`, context)
          break
        case LogLevel.DEBUG:
          console.log(`[${entry.timestamp}] DEBUG: ${message}`, context)
          break
      }
    }

    // Send to monitoring service in production
    this.sendToMonitoring(entry)
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  // Convenience method for handling unknown errors from catch blocks
  errorUnknown(message: string, unknownError: unknown, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, toError(unknownError))
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  clearLogs(): void {
    this.logs = []
  }

  getLogStats(): Record<LogLevel, number> {
    const stats: Record<LogLevel, number> = {} as Record<LogLevel, number>
    
    Object.values(LogLevel).forEach(level => {
      stats[level] = 0
    })

    this.logs.forEach(log => {
      stats[log.level]++
    })

    return stats
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Convenience functions for common logging patterns
export const logError = (message: string, error?: Error, context?: Record<string, any>) => {
  logger.error(message, context, error)
}

export const logWarn = (message: string, context?: Record<string, any>) => {
  logger.warn(message, context)
}

export const logInfo = (message: string, context?: Record<string, any>) => {
  logger.info(message, context)
}

export const logDebug = (message: string, context?: Record<string, any>) => {
  logger.debug(message, context)
}

// API specific logging helpers
export const logApiError = (
  operation: string,
  error: Error,
  context?: Record<string, any>
) => {
  logger.error(`API Error: ${operation}`, {
    operation,
    ...context
  }, error)
}

export const logApiInfo = (
  operation: string,
  context?: Record<string, any>
) => {
  logger.info(`API: ${operation}`, {
    operation,
    ...context
  })
}

// Component specific logging helpers
export const logComponentError = (
  component: string,
  error: Error,
  context?: Record<string, any>
) => {
  logger.error(`Component Error: ${component}`, {
    component,
    ...context
  }, error)
}

export const logComponentWarn = (
  component: string,
  message: string,
  context?: Record<string, any>
) => {
  logger.warn(`Component Warning: ${component} - ${message}`, {
    component,
    ...context
  })
}