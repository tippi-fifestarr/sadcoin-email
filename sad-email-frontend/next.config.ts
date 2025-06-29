import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Optimize for production
  experimental: {
    optimizePackageImports: ['@radix-ui/react-slot', 'lucide-react']
  }
};

export default nextConfig;
