/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pg'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('pg', 'pg-native');
    }
    
    // Resolver alias para @ paths
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };
    
    return config;
  },
}

export default nextConfig
