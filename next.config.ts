import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  // images config stays as-is
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

  // keep original outputFileTracingRoot
  outputFileTracingRoot: path.resolve(__dirname, '../../'),

  // typescript & eslint tolerant during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Explicitly disable experimental turbo to avoid routes-manifest ENOENT issues on Vercel
  experimental: {
    turbo: false,
  },

  // Optional: ensure default .next dist dir is used (safe fallback)
  distDir: ".next",

  // keep your custom turbopack rules (they will be ignored if turbo disabled)
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER]
      }
    }
  }
};

export default nextConfig;
