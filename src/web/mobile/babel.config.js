const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  presets: isTest
    ? [
        // Use preset-react and preset-typescript only (avoids @babel/preset-env
        // which triggers helper version mismatches with the pinned @babel/traverse).
        // These lightweight presets handle JSX + TS stripping without the
        // incompatible async/generator transforms from @babel/preset-env.
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ]
    : ['module:metro-react-native-babel-preset'],
  plugins: isTest
    ? [
        [
          'module-resolver',
          {
            root: ['./src'],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
            alias: {
              '@': './src',
              '@components': './src/components',
              '@screens': './src/screens',
              '@navigation': './src/navigation',
              '@hooks': './src/hooks',
              '@utils': './src/utils',
              '@api': './src/api',
              '@context': './src/context',
              '@assets': './src/assets',
              '@constants': './src/constants',
              '@i18n': './src/i18n',
            },
          },
        ],
        '@babel/plugin-transform-modules-commonjs',
      ]
    : [
        [
          'module-resolver',
          {
            root: ['./src'],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
            alias: {
              '@': './src',
              '@components': './src/components',
              '@screens': './src/screens',
              '@navigation': './src/navigation',
              '@hooks': './src/hooks',
              '@utils': './src/utils',
              '@api': './src/api',
              '@context': './src/context',
              '@assets': './src/assets',
              '@constants': './src/constants',
              '@i18n': './src/i18n',
            },
          },
        ],
        'react-native-reanimated/plugin',
      ],
  env: {
    production: {
      plugins: [
        'transform-remove-console',
        ['transform-react-remove-prop-types', { removeImport: true }],
      ],
    },
    development: {
      plugins: [],
    },
  },
};