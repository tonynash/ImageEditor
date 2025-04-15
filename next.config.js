// The PWA configuration needs to be aware of the base path when running on GitHub Pages
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/ImageEditor' : '';

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // Enable in all environments for testing
  buildExcludes: [/middleware-manifest\.json$/],
  // These paths need to include the base path for GitHub Pages
  scope: isProd ? '/ImageEditor/' : '/',
  sw: isProd ? '/ImageEditor/sw.js' : '/sw.js',
  publicExcludes: ['!**/*.svg'],
  // Make sure fallbacks have the correct path
  fallbacks: {
    document: isProd ? '/ImageEditor/_offline' : '/_offline'
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  basePath: basePath,
  assetPrefix: isProd ? '/ImageEditor/' : '',
  // Ensure trailing slash for GitHub Pages compatibility
  trailingSlash: true,
  // Configure PWA icons and manifest
  experimental: {
    // Only include necessary experimental features
    webVitalsAttribution: ['CLS', 'LCP']
  }
};

module.exports = withPWA(nextConfig); 