/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig