const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    // Output UMD bundle to dist/umd/
    filename = isProd ? 'umd/tac.min.js' : 'umd/tac.umd.js';
  } else if (format === 'esm') {
    // Output ESM bundle to dist/esm/
    filename = 'esm/tac.esm.js';
  } else if (format === 'cjs') {
    // Output CJS bundle to dist/cjs/
    filename = 'cjs/tac.cjs.js';
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
        // Force sass-loader and any consumers to use Embedded Sass implementation
        'sass': require.resolve('sass-embedded'),
      },
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass-embedded'),
                api: 'modern',
              },
            },
          ],
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
      // Keep CSS and images at top-level dist/tac/...
      // so all formats share the same assets path.
      new MiniCssExtractPlugin({ filename: 'tac/css/tac.css' }),
      // Note: CleanWebpackPlugin was removed to prevent sequential builds (umd/esm/cjs)
      // from cleaning the dist folder and deleting previously generated artifacts.
      // This ensures all formats can coexist in dist.
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