/**
 * Metro configuration for the AUSTA SuperApp
 * https://facebook.github.io/metro/docs/configuration
 *
 * This configuration defines how JavaScript code is bundled for the AUSTA SuperApp,
 * optimizing for the three core user journeys: My Health, Care Now, and My Plan & Benefits.
 * 
 * It includes path aliases for journey-specific modules, asset handling,
 * and performance optimizations for a smooth cross-platform experience.
 *
 * @format
 */

const path = require('path');
// We import getDefaultConfig for potential future extension of the default configuration
const { getDefaultConfig } = require('metro-config'); // ^0.76.7

// Custom Metro configuration for the AUSTA SuperApp
module.exports = {
  // Configure how JavaScript is transformed during bundling
  transformer: {
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    assetPlugins: ['react-native-asset-plugin'],
    getTransformOptions: {
      inlineRequires: {
        // Include node_modules in inline requires for better startup performance
        includeNodeModules: true
      }
    }
  },
  
  // Configure module resolution and file extensions
  resolver: {
    // Path aliases for cleaner imports across the application
    extraNodeModules: {
      // Core application paths
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@design-system': path.resolve(__dirname, 'design-system'),
      
      // Feature-specific paths
      '@components': path.resolve(__dirname, 'src/components'),
      '@screens': path.resolve(__dirname, 'src/screens'),
      '@navigation': path.resolve(__dirname, 'src/navigation'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@i18n': path.resolve(__dirname, 'src/i18n')
    },
    
    // Define file extensions to be treated as assets
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'ttf', 'otf', 'mp4', 'mp3', 'json', 'webp'],
    
    // Define file extensions to be treated as source code
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json']
  },
  
  // Additional folders to watch for changes
  watchFolders: [
    path.resolve(__dirname, 'shared'),
    path.resolve(__dirname, 'design-system'),
    path.resolve(__dirname, '../node_modules')
  ],
  
  // Limit the number of worker processes for better performance
  maxWorkers: 4,
  
  // Version for the Metro cache to invalidate when configuration changes
  cacheVersion: '1.0.0'
};