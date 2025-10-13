const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * Library build config that outputs in different formats based on env.format
 * Supported: umd | esm | cjs
 */
module.exports = (env = {}, argv = {}) => {
  const format = env.format || 'umd';
  const isProd = argv.mode === 'production';

  // filename selection
  let filename = 'tac.js';
  if (format === 'umd') {
    filename = isProd ? 'tac.min.js' : 'tac.umd.js';
  } else if (format === 'esm') {
    filename = 'tac.esm.js';
  } else if (format === 'cjs') {
    filename = 'tac.cjs.js';
  }

  // library output options
  const output = {
    path: path.resolve(__dirname, './dist'),
    filename,
    globalObject: 'this',
  };

  const config = {
    entry: './src/index.js',
    output,
    mode: isProd ? 'production' : 'development',
    // Avoid bundling node builtins for browser usage
    target: ['web', 'es5'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          use: {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: '[name].[ext]',
              outputPath: 'tac/images',
            },
          },
          type: 'javascript/auto',
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: 'tac/css/tac.css' }),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: true },
            output: { comments: false },
          },
          extractComments: false,
        }),
      ],
    },
  };

  // library target by format
  if (format === 'esm') {
    config.experiments = { outputModule: true };
    config.output.library = { type: 'module' };
  } else if (format === 'cjs') {
    config.output.libraryTarget = 'commonjs2';
  }

  return config;
};