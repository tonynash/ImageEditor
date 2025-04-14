const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development"
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === 'production' ? '/ImageEditor' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ImageEditor/' : '',
  // Ensure trailing slash for GitHub Pages compatibility
  trailingSlash: true,
  // Disable server-side features since we're doing static export
  experimental: {
    appDir: true,
  }
};

module.exports = withPWA(nextConfig); 