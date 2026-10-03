import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Cho phép hiển thị ảnh từ các nguồn URL ngoài khác
      },
    ],
  },
};

export default nextConfig;