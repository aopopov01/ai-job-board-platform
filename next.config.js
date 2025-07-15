/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simple configuration for root-level deployment
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Images configuration
  images: {
    domains: ['localhost', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Disable static generation to avoid SSR issues
  trailingSlash: false,
  
  // Output configuration
  output: 'standalone',
  
  // Optimize for Vercel
  experimental: {
    missingSuspenseWithCSRBailout: true,
  },
}

module.exports = nextConfig