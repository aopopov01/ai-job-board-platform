import { NextRequest, NextResponse } from 'next/server'

// Simplified middleware for now to debug SSR issue
export default function middleware(request: NextRequest) {
  // Skip processing for static files and API routes during build
  if (request.nextUrl.pathname.startsWith('/_next/') || 
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // For now, just pass through to avoid SSR issues
  return NextResponse.next()
}

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