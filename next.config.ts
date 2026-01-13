import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.mzstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'furusato.jal.co.jp',
      },
    ],
  },
};

export default nextConfig;
