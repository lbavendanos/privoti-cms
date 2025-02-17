import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
