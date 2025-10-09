import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://res.cloudinary.com/dt5lofhwv/image/upload/v1754478315/answer24_blogs/**"
      ),
    ],
    unoptimized: true, // Required for static export
  },
  // Only enable static export in production builds
  ...(process.env.NODE_ENV === 'production' && { output: "export" }),
  trailingSlash: true,
  distDir: "out",
};

const withNextIntl = createNextIntlPlugin();
const config = withNextIntl(nextConfig);

export default config;
