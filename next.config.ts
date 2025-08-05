// next.config.js
import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';

// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This should allow all domains, but let's be explicit
      },
      {
        protocol: 'https',
        hostname: '*.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'staging.answer24.nl',
      },
    ],
    // Add domains array for backward compatibility
    domains: [
      'via.placeholder.com',
      'staging.answer24.nl'
    ],
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
