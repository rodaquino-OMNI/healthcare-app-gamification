/**
 * Metro configuration for the AUSTA SuperApp mobile application
 *
 * Uses the Expo-provided metro config (expo/metro-config) which bundles a
 * version-matched metro internally, avoiding version mismatches between
 * metro and metro-config in the monorepo.
 *
 * @format
 */

const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// DEMO_MODE — Force project root to mobile directory (Yarn workspaces hoists expo to parent)
config.projectRoot = __dirname;

// Path aliases for easier imports (must match tsconfig paths)
config.resolver.extraNodeModules = {
    '@': path.resolve(__dirname, 'src'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@screens': path.resolve(__dirname, 'src/screens'),
    '@navigation': path.resolve(__dirname, 'src/navigation'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@api': path.resolve(__dirname, 'src/api'),
    '@context': path.resolve(__dirname, 'src/context'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@constants': path.resolve(__dirname, 'src/constants'),
    '@i18n': path.resolve(__dirname, 'src/i18n'),
    '@shared': path.resolve(__dirname, '../shared'),
    '@design-system': path.resolve(__dirname, '../design-system/src'),
};

// Watch shared workspaces for monorepo code sharing
config.watchFolders = [
    path.resolve(__dirname, '../shared'),
    path.resolve(__dirname, '../design-system'),
    path.resolve(__dirname, '../node_modules'),
    path.resolve(__dirname, '../../../node_modules'),
];

// Enable inline requires for better startup performance
config.transformer.getTransformOptions = async () => ({
    transform: {
        inlineRequires: true,
    },
});

// DEMO_MODE — Mock native modules not available in Expo Go
// Uses resolveRequest to override node_modules resolution (extraNodeModules is fallback-only)
const DEMO_MOCKS = {
    'react-native-device-info': path.resolve(__dirname, 'src/mocks/device-info-mock.js'),
    'react-native-mmkv': path.resolve(__dirname, 'src/mocks/mmkv-mock.js'),
};
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (DEMO_MOCKS[moduleName]) {
        return { type: 'sourceFile', filePath: DEMO_MOCKS[moduleName] };
    }
    if (originalResolveRequest) {
        return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
};

// Performance: limit workers
config.maxWorkers = 4;
config.cacheVersion = '1.0.0';

module.exports = config;
