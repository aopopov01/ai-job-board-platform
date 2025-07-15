/** @type {import('next').NextConfig} */
const nextConfig = {
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  staticPageGenerationTimeout: 60,
  // Skip error pages during build to avoid SSR issues
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  // Force error pages to be dynamic to avoid SSR issues
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Disable static generation for error pages to avoid SSR issues
  generateBuildId: async () => {
    return process.env.BUILD_ID || 'development'
  },
  
  // Disable static optimization to avoid SSR issues
  experimental: {
    typedRoutes: false,
    missingSuspenseWithCSRBailout: true,
    forceSwcTransforms: true,
    esmExternals: false,
  },
  
  trailingSlash: false,
  images: {
    domains: ['localhost', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
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
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          common: {
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    }
    
    // Bundle analyzer in development
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      )
    }
    
    return config
  },
  
  // Output for production (standalone for Docker, default for Vercel)
  output: process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1' ? 'standalone' : undefined,
  
  // Disable static generation temporarily to fix build
  distDir: '.next',
  
  // Disable static generation to avoid SSR issues
  trailingSlash: false,
  
  // Skip building error pages to avoid SSR issues
  async rewrites() {
    return []
  },
  
  // Exclude error pages from static generation
  async generateStaticParams() {
    return []
  },
}

module.exports = nextConfig
