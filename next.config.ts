import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lingo.dev"],
  // Disable webpack cache in WebContainer environment to avoid file system issues
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

// Temporarily disable Lingo.dev compiler integration to fix WebContainer compatibility
// The app will use static translations from the dictionary files instead
export default nextConfig;