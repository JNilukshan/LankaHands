import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // continue build even if TS errors exist
  },
  eslint: {
    ignoreDuringBuilds: true, // continue build even if ESLint errors exist
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache
//    unoptimized: process.env.NODE_ENV === 'ci' || process.env.CI === 'true', 
    // disables image optimization during CI to avoid sharp build failures
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
