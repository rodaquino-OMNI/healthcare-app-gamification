/**
 * Metro configuration for the AUSTA SuperApp mobile application
 * 
 * This configuration file defines how the JavaScript code is bundled for the 
 * AUSTA SuperApp mobile application, including module resolution, asset handling,
 * optimization settings, and shared code inclusion.
 *
 * @format
 */

const path = require('path'); // path module from Node.js (builtin)
const { getDefaultConfig } = require('metro-config'); // metro-config ^0.76.7

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  
  return {
    // Transformer configuration for code processing
    transformer: {
      // Use the React Native Babel transformer
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
      
      // Asset plugins for optimizing assets like images
      assetPlugins: ['react-native-asset-plugin'],
      
      // Options for transform behavior
      getTransformOptions: async () => ({
        transform: {
          // Enable inline requires for better performance
          inlineRequires: {
            includeNodeModules: true,
          },
        },
      }),
    },
    
    // Resolver configuration for module resolution and import handling
    resolver: {
      // Path aliases for easier and more maintainable imports
      extraNodeModules: {
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
      },
      
      // Asset extensions that Metro will process
      assetExts: [
        ...assetExts,
        'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ttf', 'otf', 'mp4', 'mp3', 'json', 'webp'
      ],
      
      // Source extensions that Metro will process
      sourceExts: [...sourceExts, 'js', 'jsx', 'ts', 'tsx', 'json'],
    },
    
    // Additional folders to watch for changes
    // This allows for code sharing between the mobile app and other parts of the application
    watchFolders: [
      path.resolve(__dirname, '../shared'),      // Shared code between web and mobile
      path.resolve(__dirname, '../design-system'), // Shared design system
      path.resolve(__dirname, '../../node_modules'), // Node modules
    ],
    
    // Maximum number of worker processes to use for transforming files
    // This improves build performance, especially on CI/CD systems
    maxWorkers: 4,
    
    // Cache version for invalidating the Metro cache when needed
    cacheVersion: '1.0.0',
  };
})();