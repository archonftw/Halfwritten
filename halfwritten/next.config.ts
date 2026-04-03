import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains:["img.clerk.com"]
  },
  allowedDevOrigins:['192.168.1.10','192.168.1.4']
};

export default nextConfig;
