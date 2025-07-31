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
  webpack: (config) => {
    config.externals.push('pg', 'pg-native');
    return config;
  },
}

export default nextConfig
