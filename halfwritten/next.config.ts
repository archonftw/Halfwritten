import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],  },
  allowedDevOrigins:['192.168.1.10','192.168.1.4']
};

export default nextConfig;
