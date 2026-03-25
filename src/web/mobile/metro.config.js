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
    path.resolve(__dirname, '../../../node_modules'), // pnpm root node_modules
    path.resolve(__dirname, '../../..'), // project root (workspace packages)
];

// Enable inline requires for better startup performance
config.transformer.getTransformOptions = async () => ({
    transform: {
        inlineRequires: true,
    },
});

// DEMO_MODE — Mock native modules not available in Expo Go
// Uses resolveRequest to override node_modules resolution (extraNodeModules is fallback-only)
// DEMO_MODE — Force local React 18 over hoisted React 19 (monorepo resolution fix)
const LOCAL_OVERRIDES = {
    react: path.resolve(__dirname, 'node_modules/react'),
    'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
    'react/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime'),
    'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
};

const DEMO_MOCKS = {
    'react-native-device-info': path.resolve(__dirname, 'src/mocks/device-info-mock.js'),
    'react-native-mmkv': path.resolve(__dirname, 'src/mocks/mmkv-mock.js'),
    '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/mocks/async-storage-mock.js'),
    '@react-native-community/netinfo': path.resolve(__dirname, 'src/mocks/netinfo-mock.js'),
    'react-native-biometrics': path.resolve(__dirname, 'src/mocks/biometrics-mock.js'),
    'react-native-ssl-pinning': path.resolve(__dirname, 'src/mocks/ssl-pinning-mock.js'),
    'react-native-vision-camera': path.resolve(__dirname, 'src/mocks/vision-camera-mock.js'),
    'expo-auth-session': path.resolve(__dirname, 'src/mocks/auth-session-mock.js'),
    'expo-web-browser': path.resolve(__dirname, 'src/mocks/web-browser-mock.js'),
    'apollo-upload-client/createUploadLink.mjs': path.resolve(__dirname, 'src/mocks/apollo-upload-mock.js'),
    '@react-native-community/datetimepicker': path.resolve(__dirname, 'src/mocks/datetimepicker-mock.js'),
    '@react-native-picker/picker': path.resolve(__dirname, 'src/mocks/picker-mock.js'),
    'expo-document-picker': path.resolve(__dirname, 'src/mocks/document-picker-mock.js'),
};
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Force local React 18 resolution (prevents hoisted React 19 from root node_modules)
    if (LOCAL_OVERRIDES[moduleName]) {
        return { type: 'sourceFile', filePath: require.resolve(moduleName, { paths: [__dirname] }) };
    }
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
