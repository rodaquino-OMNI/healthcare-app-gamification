/**
 * Next.js configuration for the AUSTA SuperApp web application - Simplified for development
 */
const path = require('path');

// Default supported locales
const supportedLocales = ['pt-BR', 'en-US'];
const defaultLocale = 'pt-BR';

/**
 * Next.js configuration for AUSTA SuperApp
 */
const nextConfig = {
    // Enable React Strict Mode for better development experience
    reactStrictMode: true,

    // Enable styled-components
    compiler: {
        styledComponents: true,
    },

    // Image optimization configuration
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'storage.googleapis.com' },
            { protocol: 'https', hostname: 'cdn.austa.com.br' },
        ],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // NOTE: i18n is deprecated in Next.js App Router but still supported for Pages Router (Next.js 15)
    // Internationalization configuration
    i18n: {
        locales: supportedLocales,
        defaultLocale: defaultLocale,
    },

    // Environment variables
    env: {
        NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || 'development',
        NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
    },

    // Disable X-Powered-By header for security
    poweredByHeader: false,

    // Webpack configuration to resolve shared package
    webpack: (config, { isServer }) => {
        // Add shared package resolution
        config.resolve.alias = {
            ...config.resolve.alias,
            '@shared': path.resolve(__dirname, '../shared'),
        };

        return config;
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
};

// Export the configuration directly
module.exports = nextConfig;
