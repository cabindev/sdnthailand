/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['support.sdnthailand.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'sdnthailand.com',
          pathname: '/wp-content/uploads/**',
        },
      ],
    },
  };
  
  export default nextConfig;