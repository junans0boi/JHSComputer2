import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['192.168.0.101'],
};

export default nextConfig;
