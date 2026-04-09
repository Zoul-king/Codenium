import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid flaky filesystem cache issues on Windows when .next is recreated during local runs.
      config.cache = {
        type: "memory"
      };
    }

    return config;
  }
};

export default nextConfig;
