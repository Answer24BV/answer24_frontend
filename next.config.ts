import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dt5lofhwv/image/upload/v1754478315/answer24_blogs/**',
      },
    ],
  },
  // Vercel handles this automatically - no need for static export
};

const withNextIntl = createNextIntlPlugin();
const config = withNextIntl(nextConfig);

export default config;
