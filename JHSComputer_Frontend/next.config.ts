import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['192.168.0.101'],
  // Static assets are cached aggressively in production. A fresh build id
  // prevents browsers from reusing an older client bundle after deployment.
  generateBuildId: async () => process.env.JHS_RELEASE_ID ?? `jhs-${Date.now()}`,
};

export default nextConfig;
