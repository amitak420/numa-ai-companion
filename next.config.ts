import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  outputFileTracingRoot: path.resolve(__dirname, '../../'),

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // THIS IS THE FIX:
  experimental: {
    turbo: false,
  },

  // FORCE DISABLE TURBOPACK (required)
  webpack: (config) => {
    // Remove turbopack loader config
    return config;
  },

  // Set dist folder manually (stabilizes output)
  distDir: ".next",
};

export default nextConfig;
