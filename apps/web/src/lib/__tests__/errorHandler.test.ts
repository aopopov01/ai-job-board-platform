import {
  AppError,
  ErrorType,
  ErrorLogger,
  handleError,
  handleAsyncError,
} from '../errorHandler'

describe('AppError', () => {
  it('creates error with default values', () => {
    const error = new AppError('Test message')
    
    expect(error.message).toBe('Test message')
    expect(error.type).toBe(ErrorType.UNKNOWN)
    expect(error.statusCode).toBe(500)
    expect(error.isOperational).toBe(true)
    expect(error.context.timestamp).toBeDefined()
  })

  it('creates error with custom values', () => {
    const context = { userId: 'user123', action: 'test' }
    const error = new AppError(
      'Custom error',
      ErrorType.VALIDATION,
      400,
      context,
      false
    )
    
    expect(error.message).toBe('Custom error')
    expect(error.type).toBe(ErrorType.VALIDATION)
    expect(error.statusCode).toBe(400)
    expect(error.isOperational).toBe(false)
    expect(error.context.userId).toBe('user123')
    expect(error.context.action).toBe('test')
  })
})

describe('ErrorLogger', () => {
  let logger: ErrorLogger

  beforeEach(() => {
    logger = ErrorLogger.getInstance()
    logger.clearLogs()
  })

  it('is a singleton', () => {
    const logger1 = ErrorLogger.getInstance()
    const logger2 = ErrorLogger.getInstance()
    
    expect(logger1).toBe(logger2)
  })

  it('logs errors', () => {
    const error = new AppError('Test error', ErrorType.VALIDATION)
    logger.log(error)
    
    const logs = logger.getLogs()
    expect(logs).toHaveLength(1)
    expect(logs[0]).toBe(error)
  })

  it('filters logs by type', () => {
    const validationError = new AppError('Validation error', ErrorType.VALIDATION)
    const authError = new AppError('Auth error', ErrorType.AUTHENTICATION)
    
    logger.log(validationError)
    logger.log(authError)
    
    const validationLogs = logger.getLogsByType(ErrorType.VALIDATION)
    const authLogs = logger.getLogsByType(ErrorType.AUTHENTICATION)
    
    expect(validationLogs).toHaveLength(1)
    expect(authLogs).toHaveLength(1)
    expect(validationLogs[0]).toBe(validationError)
    expect(authLogs[0]).toBe(authError)
  })

  it('provides error statistics', () => {
    logger.log(new AppError('Error 1', ErrorType.VALIDATION))
    logger.log(new AppError('Error 2', ErrorType.VALIDATION))
    logger.log(new AppError('Error 3', ErrorType.AUTHENTICATION))
    
    const stats = logger.getErrorStats()
    
    expect(stats[ErrorType.VALIDATION]).toBe(2)
    expect(stats[ErrorType.AUTHENTICATION]).toBe(1)
    expect(stats[ErrorType.DATABASE]).toBe(0)
  })

  it('clears logs', () => {
    logger.log(new AppError('Test error'))
    expect(logger.getLogs()).toHaveLength(1)
    
    logger.clearLogs()
    expect(logger.getLogs()).toHaveLength(0)
  })
})

describe('handleError', () => {
  beforeEach(() => {
    // Clear logs before each test
    ErrorLogger.getInstance().clearLogs()
  })

  it('handles AppError instances', () => {
    const originalError = new AppError('Original error', ErrorType.VALIDATION)
    const result = handleError(originalError)
    
    expect(result).toBe(originalError)
  })

  it('converts validation errors', () => {
    const validationError = { name: 'ValidationError', message: 'Invalid input' }
    const result = handleError(validationError)
    
    expect(result.type).toBe(ErrorType.VALIDATION)
    expect(result.statusCode).toBe(400)
    expect(result.message).toBe('Invalid input')
  })

  it('converts authentication errors', () => {
    const authError = { status: 401, message: 'Unauthorized' }
    const result = handleError(authError)
    
    expect(result.type).toBe(ErrorType.AUTHENTICATION)
    expect(result.statusCode).toBe(401)
  })

  it('converts database errors', () => {
    const dbError = { message: 'PGRST001: connection failed' }
    const result = handleError(dbError)
    
    expect(result.type).toBe(ErrorType.DATABASE)
    expect(result.statusCode).toBe(500)
  })

  it('handles unknown errors', () => {
    const unknownError = { message: 'Something went wrong' }
    const result = handleError(unknownError)
    
    expect(result.type).toBe(ErrorType.UNKNOWN)
    expect(result.statusCode).toBe(500)
  })

  it('includes context in error', () => {
    const context = { userId: 'user123', component: 'TestComponent' }
    const result = handleError(new Error('Test'), context)
    
    expect(result.context.userId).toBe('user123')
    expect(result.context.component).toBe('TestComponent')
  })
})

describe('handleAsyncError', () => {
  it('returns result when promise resolves', async () => {
    const promise = Promise.resolve('success')
    const [result, error] = await handleAsyncError(promise)
    
    expect(result).toBe('success')
    expect(error).toBeNull()
  })

  it('returns error when promise rejects', async () => {
    const promise = Promise.reject(new Error('Failed'))
    const [result, error] = await handleAsyncError(promise)
    
    expect(result).toBeNull()
    expect(error).toBeInstanceOf(AppError)
    expect(error?.message).toBe('Failed')
  })

  it('includes context in async error', async () => {
    const promise = Promise.reject(new Error('Failed'))
    const context = { action: 'api_call' }
    const [result, error] = await handleAsyncError(promise, context)
    
    expect(error?.context.action).toBe('api_call')
  })
})