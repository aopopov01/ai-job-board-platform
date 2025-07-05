// Comprehensive error handling and logging system
import React from 'react'

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  API = 'API',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorContext {
  userId?: string
  action?: string
  component?: string
  timestamp: string
  userAgent?: string
  url?: string
  additionalData?: Record<string, any>
}

export class AppError extends Error {
  public type: ErrorType
  public statusCode: number
  public context: ErrorContext
  public isOperational: boolean

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode: number = 500,
    context: Partial<ErrorContext> = {},
    isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      ...context
    }

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

// Error logger
export class ErrorLogger {
  private static instance: ErrorLogger
  private logs: AppError[] = []
  private maxLogs = 1000

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  log(error: AppError): void {
    // Add to memory log
    this.logs.push(error)
    
    // Keep only latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console logging with different levels
    switch (error.type) {
      case ErrorType.VALIDATION:
        console.warn('Validation Error:', error.message, error.context)
        break
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
        console.error('Auth Error:', error.message, error.context)
        break
      case ErrorType.DATABASE:
      case ErrorType.API:
        console.error('System Error:', error.message, error.context)
        break
      default:
        console.error('Unknown Error:', error.message, error.context)
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error)
    }
  }

  private async sendToMonitoring(error: AppError): Promise<void> {
    try {
      // Send to external monitoring service (e.g., Sentry, LogRocket)
      // Example implementation:
      await fetch('/api/monitoring/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          type: error.type,
          statusCode: error.statusCode,
          context: error.context,
          stack: error.stack
        })
      })
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError)
    }
  }

  getLogs(): AppError[] {
    return [...this.logs]
  }

  getLogsByType(type: ErrorType): AppError[] {
    return this.logs.filter(log => log.type === type)
  }

  clearLogs(): void {
    this.logs = []
  }

  getErrorStats(): Record<ErrorType, number> {
    const stats: Record<ErrorType, number> = {} as Record<ErrorType, number>
    
    Object.values(ErrorType).forEach(type => {
      stats[type] = 0
    })

    this.logs.forEach(log => {
      stats[log.type]++
    })

    return stats
  }
}

// Global error handler
export function handleError(error: any, context: Partial<ErrorContext> = {}): AppError {
  const logger = ErrorLogger.getInstance()
  
  let appError: AppError

  if (error instanceof AppError) {
    appError = error
  } else if (error.name === 'ValidationError') {
    appError = new AppError(error.message, ErrorType.VALIDATION, 400, context)
  } else if (error.message?.includes('auth') || error.status === 401) {
    appError = new AppError(error.message || 'Authentication failed', ErrorType.AUTHENTICATION, 401, context)
  } else if (error.status === 403) {
    appError = new AppError(error.message || 'Access denied', ErrorType.AUTHORIZATION, 403, context)
  } else if (error.message?.includes('database') || error.message?.includes('PGRST')) {
    appError = new AppError(error.message || 'Database error', ErrorType.DATABASE, 500, context)
  } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
    appError = new AppError(error.message || 'Network error', ErrorType.NETWORK, 503, context)
  } else {
    appError = new AppError(
      error.message || 'An unexpected error occurred',
      ErrorType.UNKNOWN,
      500,
      context
    )
  }

  logger.log(appError)
  return appError
}

// React error boundary helper
export function createErrorBoundary(fallbackComponent: React.ComponentType<{ error: AppError }>) {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: AppError | null }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props)
      this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: any): { hasError: boolean; error: AppError } {
      const appError = handleError(error, { component: 'ErrorBoundary' })
      return { hasError: true, error: appError }
    }

    componentDidCatch(error: any, errorInfo: any) {
      handleError(error, {
        component: 'ErrorBoundary',
        additionalData: errorInfo
      })
    }

    render() {
      if (this.state.hasError && this.state.error) {
        return React.createElement(fallbackComponent, { error: this.state.error })
      }

      return this.props.children
    }
  }
}

// Async error handler for promises
export async function handleAsyncError<T>(
  promise: Promise<T>,
  context: Partial<ErrorContext> = {}
): Promise<[T | null, AppError | null]> {
  try {
    const result = await promise
    return [result, null]
  } catch (error) {
    const appError = handleError(error, context)
    return [null, appError]
  }
}

// Network request error handler
export function createApiErrorHandler(baseContext: Partial<ErrorContext> = {}) {
  return (error: any) => {
    const context = {
      ...baseContext,
      action: 'api_request'
    }
    
    if (error.response) {
      // Server responded with error status
      throw new AppError(
        error.response.data?.message || `Request failed with status ${error.response.status}`,
        ErrorType.API,
        error.response.status,
        context
      )
    } else if (error.request) {
      // Request was made but no response received
      throw new AppError(
        'No response from server',
        ErrorType.NETWORK,
        503,
        context
      )
    } else {
      // Error in request setup
      throw new AppError(
        error.message || 'Request setup failed',
        ErrorType.UNKNOWN,
        500,
        context
      )
    }
  }
}