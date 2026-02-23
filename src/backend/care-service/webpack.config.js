/** @type {import('webpack').Configuration} */
module.exports = function (options) {
  return {
    ...options,
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                configFile: 'care-service/tsconfig.json',
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    // Remove ForkTsCheckerWebpackPlugin to skip type checking during Docker builds
    plugins: (options.plugins || []).filter(
      (plugin) => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
    ),
  };
};
