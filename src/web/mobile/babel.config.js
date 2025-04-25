module.exports = {
  presets: ['metro-react-native-babel-preset'],
  plugins: [
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
    test: {
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
};