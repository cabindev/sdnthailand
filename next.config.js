/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.sdnthailand.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sdnthailand.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'civicspace.sdnthailand.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'civicblogs12.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sdnmapportal.sdnthailand.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig;