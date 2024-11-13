/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'support.sdnthailand.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'sdnthailand.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
