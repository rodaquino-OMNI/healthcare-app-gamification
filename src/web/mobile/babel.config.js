const isTest = process.env.NODE_ENV === 'test';

// Only include optional production Babel plugins when they are installed.
function tryResolve(name) {
    try {
        require.resolve(name);
        return true;
    } catch {
        return false;
    }
}

const productionPlugins = [
    tryResolve('babel-plugin-transform-remove-console') && 'transform-remove-console',
    tryResolve('babel-plugin-transform-react-remove-prop-types') && [
        'transform-react-remove-prop-types',
        { removeImport: true },
    ],
].filter(Boolean);

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
        : ['babel-preset-expo'],
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
              // NOTE: module-resolver is intentionally omitted for Metro bundling.
              // Metro handles path aliases via resolver.extraNodeModules in metro.config.js.
              // babel-plugin-module-resolver is incompatible with glob@13 (forced by
              // monorepo resolutions) and is only needed for Jest (test env).
              'react-native-reanimated/plugin',
          ],
    env: {
        production: {
            plugins: productionPlugins,
        },
        development: {
            plugins: [],
        },
    },
};
