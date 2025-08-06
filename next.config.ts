// next.config.js
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';

// next.config.ts
const nextConfig = {
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'avatar.iran.liara.run',
    //     pathname: '/public/**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'images.tech.co',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'res.cloudinary.com',
    //   },
    // ],
    remotePatterns: [new URL('https://res.cloudinary.com/dt5lofhwv/image/upload/v1754478315/answer24_blogs/**')],
  },
  
  output: "export",
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(
  withPWA({
    ...nextConfig,
    dest: "public",
    register: true,
    skipWaiting: true,
  })
);
