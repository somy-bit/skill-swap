import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    {
      protocol:'https',
      hostname:'img.clerk.com',
      pathname :'/'
    },
    {
      protocol:'https',
      hostname:'img.clerk.com',
      pathname:"/",
    }
    ],
  },

};

export default nextConfig;
