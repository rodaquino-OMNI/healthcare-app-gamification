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
    // Transpile design system package (resolves webpack parse failure)
    transpilePackages: ['@austa/design-system', 'apollo-upload-client'],

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

    // Security response headers (OWASP recommended for healthcare/PHI applications)
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline'",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' blob: data: https://storage.googleapis.com https://cdn.austa.com.br",
                            "font-src 'self'",
                            `connect-src 'self' https://*.austa.com.br https://*.sentry.io${process.env.NODE_ENV === 'development' ? ' http://localhost:* ws://localhost:*' : ''}`,
                            "frame-ancestors 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                        ].join('; '),
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                ],
            },
        ];
    },

    // Webpack configuration to resolve shared package and react-native
    webpack: (config, { isServer }) => {
        // Force a single React instance across all dependencies to prevent
        // "Cannot read properties of null (reading 'useContext')" during SSG.
        // Several packages (e.g. @apollo/client, react-i18next) ship nested
        // React 18 copies that conflict with the workspace React 19.
        const reactPath = path.resolve(__dirname, '../node_modules/react');
        const reactDomPath = path.resolve(__dirname, '../node_modules/react-dom');

        config.resolve.alias = {
            ...config.resolve.alias,
            react: reactPath,
            'react-dom': reactDomPath,
            '@shared': path.resolve(__dirname, '../shared'),
            'react-native$': 'react-native-web',
        };

        // On the server, Next.js externalizes react-native before the alias
        // resolves. Intercept the externals pipeline to redirect react-native
        // to react-native-web so Node.js never loads Flow-typed source.
        if (isServer) {
            const orig = config.externals;
            config.externals = [
                ({ request }, callback) => {
                    if (request === 'react-native' || /^react-native\//.test(request)) {
                        const mapped = request.replace(/^react-native(\/|$)/, 'react-native-web$1');
                        return callback(null, `commonjs ${mapped}`);
                    }
                    return callback();
                },
                ...(Array.isArray(orig) ? orig : [orig]),
            ];
        }

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
