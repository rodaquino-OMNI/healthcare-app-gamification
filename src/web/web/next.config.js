/**
 * Next.js configuration for the AUSTA SuperApp web application
 *
 * @package next-compose-plugins v2.2.1
 * @package @next/bundle-analyzer v13.4.12
 */

const { withPlugins } = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Import i18n configuration
// Note: In a production setup, ensure TypeScript files are properly transpiled
// or configuration is provided in .js format
const { supportedLocales, defaultLocale } = require('../shared/config/i18nConfig');

/**
 * Next.js configuration for AUSTA SuperApp
 * 
 * This configuration file sets up:
 * - Internationalization with Brazilian Portuguese as primary language
 * - Image optimization for performance
 * - Styled-components for consistent UI
 * - Environment variables
 * - Security headers
 * - Build optimizations
 */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Use SWC minifier for faster builds
  swcMinify: true,
  
  // Enable styled-components
  compiler: {
    styledComponents: true,
  },
  
  // Image optimization configuration
  images: {
    domains: ['storage.googleapis.com', 'cdn.austa.com.br'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Internationalization configuration
  i18n: {
    locales: supportedLocales,
    defaultLocale: defaultLocale,
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
  },
  
  // Experimental features
  experimental: {
    outputStandalone: true,
    esmExternals: true,
  },
  
  // Custom webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Enable source maps in production
    if (!dev) {
      config.devtool = 'source-map';
    }
    
    return config;
  },
  
  // Custom headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
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
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; 
                   script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.austa.com.br; 
                   style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
                   font-src 'self' https://fonts.gstatic.com; 
                   img-src 'self' data: https://storage.googleapis.com https://cdn.austa.com.br; 
                   connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.austa.com.br'} 
                               wss://${(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.austa.com.br').replace('https://', '')};`,
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects for legacy routes and journey-based URLs
  async redirects() {
    return [
      {
        source: '/health',
        destination: '/minha-saude',
        permanent: true,
      },
      {
        source: '/care',
        destination: '/cuidar-me-agora',
        permanent: true,
      },
      {
        source: '/plan',
        destination: '/meu-plano-beneficios',
        permanent: true,
      },
    ];
  },
  
  // Disable X-Powered-By header for security
  poweredByHeader: false,
};

// Export the configuration with plugins
module.exports = withPlugins([
  [withBundleAnalyzer],
], nextConfig);