const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Webpack 2 env vars --env.analyze to run bundle analyzer
module.exports = (env = {}) => {
  const config = require('./webpack.base.babel')({
    // Don't attempt to continue if there are any errors.
    bail: true,
    // add source maps with original code (big files) see other options at https://webpack.js.org/configuration/devtool/#devtool
    devtool: 'source-map',

    // The "entry points" to our application
    entry: {
      app: [
        require.resolve('./polyfills'),
        require.resolve('react-virtualized/styles.css'),
        path.join(process.cwd(), 'src/styles/base.css'),
        path.join(process.cwd(), 'src/index.js'),
      ],
      // babel-polyfill for old IE 11 promises (fetch)
      vendor: [
        'babel-polyfill',
        'react',
        'react-dom',
        'styled-components',
        'polished',
        'apollo-client',
        'whatwg-fetch',
      ],
    },

    // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
    output: {
      filename: 'app/[name].[chunkhash].js',
    },

    module: {
      rules: [],
    },

    plugins: [
      // Generate deployment package.json (cannot copy with copy-webpack-plugin)
      new CopyPkgJsonPlugin({
        remove: [
          'babel',
          'scripts',
          'eslintConfig',
          'devDependencies',
          'repository',
          'engines',
          'license',
          'author',
          'keywords',
          'prettier',
        ],
        replace: {
          babel: {
            compact: 'true',
            presets: [
              ['env', {
                targets: {
                  node: 'current'
                }
              }]
            ],
          },
          scripts: {
            start: 'NODE_ENV=production node --require babel-register server.js',
          },
        },
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
      }),
      // Inject bundle files must inject into head since we load external scripts last, minify/optimize index.html
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        inject: 'head',
      }),
      // use shx for cross platform shell commands
      new WebpackShellPlugin({
        onBuildStart: ['rimraf dist/build/*'],
        onBuildEnd: ['shx mv dist/build/package.json dist/package.json'],
      }),
    ],
  });

  // Display output code treemap http://localhost:8888
  // Run with command line option --env.analyze
  // Note: this will result in any postbuild scripts not being run
  if (env.analyze) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }
  return config;
};
