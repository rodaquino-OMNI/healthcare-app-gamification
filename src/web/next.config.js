/**
 * Next.js Configuration for AUSTA SuperApp
 * 
 * This configuration file defines settings for the AUSTA SuperApp web application,
 * including internationalization, performance optimizations, image settings,
 * and build configurations.
 */

const path = require('path');
const withPlugins = require('next-compose-plugins'); // next-compose-plugins v2.2.1
const withBundleAnalyzer = require('@next/bundle-analyzer')({ // @next/bundle-analyzer v13.4.12
  enabled: process.env.ANALYZE === 'true',
});

// Import i18n configuration
const { supportedLocales, defaultLocale } = require('./shared/config/i18nConfig');

/**
 * Next.js configuration object
 */
const nextConfig = {
  // Enable React Strict Mode for identifying potential problems
  reactStrictMode: true,
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Configure styled-components for server-side rendering
  compiler: {
    styledComponents: true,
  },
  
  // Configure image optimization
  images: {
    domains: ['storage.googleapis.com', 'cdn.austa.com.br'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Configure internationalization
  i18n: {
    locales: supportedLocales,
    defaultLocale: defaultLocale,
  },
  
  // Provide environment variables to the client
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
  },
  
  // Experimental features
  experimental: {
    outputStandalone: true,
    esmExternals: true,
  },
  
  // Disable X-Powered-By header for security
  poweredByHeader: false,
  
  // Custom webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Enable source maps in production for error tracking
    if (!dev) {
      config.devtool = 'source-map';
    }
    
    // Add journey-specific aliases for easier imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@health': path.resolve(__dirname, 'src/journeys/health'),
      '@care': path.resolve(__dirname, 'src/journeys/care'),
      '@plan': path.resolve(__dirname, 'src/journeys/plan'),
      '@gamification': path.resolve(__dirname, 'src/journeys/gamification'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    };
    
    return config;
  },
  
  // Custom HTTP headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' https://cdn.austa.com.br 'unsafe-inline' 'unsafe-eval';
              style-src 'self' https://cdn.austa.com.br 'unsafe-inline';
              img-src 'self' https://storage.googleapis.com https://cdn.austa.com.br data:;
              font-src 'self' https://cdn.austa.com.br;
              connect-src 'self' https://*.austa.com.br ${process.env.NEXT_PUBLIC_API_BASE_URL};
              media-src 'self' https://cdn.austa.com.br;
              object-src 'none';
              frame-ancestors 'none';
            `.replace(/\s+/g, ' ').trim(),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
        ],
      },
      {
        // Cache static assets for better performance
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Custom redirects
  async redirects() {
    return [
      // Localized journey routes
      {
        source: '/health',
        destination: '/saude',
        permanent: true,
      },
      {
        source: '/care',
        destination: '/cuidados',
        permanent: true,
      },
      {
        source: '/plan',
        destination: '/plano',
        permanent: true,
      },
    ];
  },
};

// Export the configuration with plugins
module.exports = withPlugins([
  withBundleAnalyzer,
], nextConfig);