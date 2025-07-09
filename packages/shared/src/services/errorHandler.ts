import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ErrorLog {
  id: string
  error_type: string
  error_message: string
  error_stack?: string
  user_id?: string
  endpoint?: string
  timestamp: string
  metadata?: any
}

export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
  request_id?: string
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorCounts: Map<string, number> = new Map()
  private lastErrorTime: Map<string, number> = new Map()

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Log error to database
  async logError(error: Error, context?: {
    userId?: string
    endpoint?: string
    metadata?: any
  }): Promise<void> {
    try {
      const errorLog: Omit<ErrorLog, 'id'> = {
        error_type: error.name || 'UnknownError',
        error_message: error.message,
        error_stack: error.stack,
        user_id: context?.userId,
        endpoint: context?.endpoint,
        timestamp: new Date().toISOString(),
        metadata: context?.metadata
      }

      await supabase
        .from('error_logs')
        .insert(errorLog)

      // Track error frequency
      const errorKey = `${error.name}:${error.message}`
      this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1)
      this.lastErrorTime.set(errorKey, Date.now())

      // Alert if error frequency is high
      if (this.errorCounts.get(errorKey)! > 10) {
        this.alertHighErrorFrequency(errorKey)
      }
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
  }

  // Create standardized API error
  createApiError(
    code: string,
    message: string,
    details?: any,
    requestId?: string
  ): ApiError {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      request_id: requestId || this.generateRequestId()
    }
  }

  // Handle different error types
  handleError(error: unknown, context?: {
    userId?: string
    endpoint?: string
    metadata?: any
  }): ApiError {
    if (error instanceof Error) {
      this.logError(error, context)
      
      // Map common errors to user-friendly messages
      switch (error.name) {
        case 'ValidationError':
          return this.createApiError(
            'VALIDATION_ERROR',
            'Invalid input provided',
            { originalError: error.message }
          )
        
        case 'AuthenticationError':
          return this.createApiError(
            'AUTH_ERROR',
            'Authentication required',
            { originalError: error.message }
          )
        
        case 'AuthorizationError':
          return this.createApiError(
            'AUTHORIZATION_ERROR',
            'Insufficient permissions',
            { originalError: error.message }
          )
        
        case 'RateLimitError':
          return this.createApiError(
            'RATE_LIMIT_ERROR',
            'Too many requests. Please try again later.',
            { originalError: error.message }
          )
        
        case 'PaymentError':
          return this.createApiError(
            'PAYMENT_ERROR',
            'Payment processing failed',
            { originalError: error.message }
          )
        
        case 'ExternalServiceError':
          return this.createApiError(
            'EXTERNAL_SERVICE_ERROR',
            'External service temporarily unavailable',
            { originalError: error.message }
          )
        
        default:
          return this.createApiError(
            'INTERNAL_ERROR',
            'An unexpected error occurred',
            { originalError: error.message }
          )
      }
    } else {
      // Handle non-Error objects
      const unknownError = new Error(String(error))
      this.logError(unknownError, context)
      
      return this.createApiError(
        'UNKNOWN_ERROR',
        'An unknown error occurred',
        { originalError: String(error) }
      )
    }
  }

  // Database error handler
  handleDatabaseError(error: any): ApiError {
    const errorMessage = error.message || 'Database operation failed'
    
    if (errorMessage.includes('duplicate key')) {
      return this.createApiError(
        'DUPLICATE_ERROR',
        'A record with this information already exists',
        { constraint: error.constraint }
      )
    }
    
    if (errorMessage.includes('foreign key')) {
      return this.createApiError(
        'REFERENCE_ERROR',
        'Referenced record does not exist',
        { constraint: error.constraint }
      )
    }
    
    if (errorMessage.includes('not null')) {
      return this.createApiError(
        'REQUIRED_FIELD_ERROR',
        'Required field is missing',
        { column: error.column }
      )
    }
    
    return this.createApiError(
      'DATABASE_ERROR',
      'Database operation failed',
      { originalError: errorMessage }
    )
  }

  // API integration error handler
  handleApiIntegrationError(error: any, service: string): ApiError {
    const errorMessage = error.message || `${service} integration failed`
    
    if (error.response?.status === 401) {
      return this.createApiError(
        'INTEGRATION_AUTH_ERROR',
        `Authentication failed with ${service}`,
        { service, status: error.response.status }
      )
    }
    
    if (error.response?.status === 403) {
      return this.createApiError(
        'INTEGRATION_PERMISSION_ERROR',
        `Permission denied by ${service}`,
        { service, status: error.response.status }
      )
    }
    
    if (error.response?.status === 429) {
      return this.createApiError(
        'INTEGRATION_RATE_LIMIT_ERROR',
        `Rate limit exceeded for ${service}`,
        { service, status: error.response.status }
      )
    }
    
    if (error.response?.status >= 500) {
      return this.createApiError(
        'INTEGRATION_SERVER_ERROR',
        `${service} server error`,
        { service, status: error.response.status }
      )
    }
    
    return this.createApiError(
      'INTEGRATION_ERROR',
      `${service} integration failed`,
      { service, originalError: errorMessage }
    )
  }

  // Payment error handler
  handlePaymentError(error: any): ApiError {
    const errorMessage = error.message || 'Payment processing failed'
    
    if (error.type === 'StripeCardError') {
      return this.createApiError(
        'CARD_ERROR',
        'Card was declined',
        { decline_code: error.decline_code }
      )
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return this.createApiError(
        'INVALID_PAYMENT_REQUEST',
        'Invalid payment request',
        { param: error.param }
      )
    }
    
    if (error.type === 'StripeApiError') {
      return this.createApiError(
        'PAYMENT_API_ERROR',
        'Payment service temporarily unavailable',
        { originalError: errorMessage }
      )
    }
    
    return this.createApiError(
      'PAYMENT_ERROR',
      'Payment processing failed',
      { originalError: errorMessage }
    )
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Alert for high error frequency
  private alertHighErrorFrequency(errorKey: string): void {
    console.warn(`High error frequency detected: ${errorKey}`)
    // Here you would implement alerting logic (email, Slack, etc.)
  }

  // Get error statistics
  async getErrorStats(timeFrame: 'hour' | 'day' | 'week' = 'day'): Promise<{
    totalErrors: number
    errorsByType: Record<string, number>
    errorsByEndpoint: Record<string, number>
  }> {
    try {
      const timeFrameHours = timeFrame === 'hour' ? 1 : timeFrame === 'day' ? 24 : 168
      const cutoffTime = new Date(Date.now() - timeFrameHours * 60 * 60 * 1000)
      
      const { data: errors } = await supabase
        .from('error_logs')
        .select('error_type, endpoint')
        .gte('timestamp', cutoffTime.toISOString())
      
      const totalErrors = errors?.length || 0
      const errorsByType: Record<string, number> = {}
      const errorsByEndpoint: Record<string, number> = {}
      
      errors?.forEach(error => {
        errorsByType[error.error_type] = (errorsByType[error.error_type] || 0) + 1
        if (error.endpoint) {
          errorsByEndpoint[error.endpoint] = (errorsByEndpoint[error.endpoint] || 0) + 1
        }
      })
      
      return {
        totalErrors,
        errorsByType,
        errorsByEndpoint
      }
    } catch (error) {
      console.error('Failed to get error stats:', error)
      return {
        totalErrors: 0,
        errorsByType: {},
        errorsByEndpoint: {}
      }
    }
  }

  // Clean up old error logs
  async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
    try {
      const cutoffTime = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
      
      await supabase
        .from('error_logs')
        .delete()
        .lt('timestamp', cutoffTime.toISOString())
    } catch (error) {
      console.error('Failed to cleanup old error logs:', error)
    }
  }
}

// Custom error classes
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded') {
    super(message)
    this.name = 'RateLimitError'
  }
}

export class PaymentError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'PaymentError'
  }
}

export class ExternalServiceError extends Error {
  constructor(message: string, public service?: string) {
    super(message)
    this.name = 'ExternalServiceError'
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance()