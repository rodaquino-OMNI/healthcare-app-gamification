/**
 * Babel configuration for AUSTA SuperApp web applications
 * Configures JavaScript/TypeScript transpilation for both Next.js web and React Native mobile environments
 * Supports the three core user journeys (Health, Care, Plan) through proper module resolution
 * 
 * @babel/preset-env ^7.22.5
 * @babel/preset-react ^7.22.5
 * @babel/preset-typescript ^7.22.5
 * babel-plugin-module-resolver ^5.0.0
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', 'not dead', 'not ie <= 11']
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@': './',
          '@shared': './shared',
          '@design-system': './design-system',
          '@web': './web',
          '@mobile': './mobile',
          '@components': './web/src/components',
          '@hooks': './web/src/hooks',
          '@utils': './web/src/utils',
          '@api': './web/src/api',
          '@context': './web/src/context',
          '@layouts': './web/src/layouts',
          '@pages': './web/src/pages',
          '@styles': './web/src/styles',
          '@i18n': './web/src/i18n'
        }
      }
    ],
    'styled-components'
  ],
  env: {
    production: {
      plugins: [
        'transform-remove-console',
        ['transform-react-remove-prop-types', { removeImport: true }]
      ]
    },
    development: {
      plugins: []
    },
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }]
      ],
      plugins: ['@babel/plugin-transform-runtime']
    }
  }
};