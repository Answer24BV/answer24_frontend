import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "next-pwa";
const nextConfig: NextConfig = {
  output: "export",
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(
  withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  })
);
