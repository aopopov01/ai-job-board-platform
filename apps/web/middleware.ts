import { NextRequest } from 'next/server'
import { withSecurity } from '../../packages/shared/src/middleware/security-middleware'

// Configure security middleware
export default withSecurity({
  enableMFA: true,
  enableRateLimit: true,
  enableSecurityHeaders: true,
  enableSessionValidation: true,
  enableInputValidation: true,
  enableAuditLogging: true,
  skipPaths: [
    '/api/health',
    '/api/metrics',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/api/auth/login',
    '/api/auth/register'
  ],
  adminPaths: [
    '/admin',
    '/api/admin',
    '/dashboard/admin',
    '/api/security'
  ],
  publicPaths: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/reset-password',
    '/api/jobs/public',
    '/api/companies/public',
    '/',
    '/about',
    '/contact'
  ]
})

// Matcher configuration for Next.js middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}