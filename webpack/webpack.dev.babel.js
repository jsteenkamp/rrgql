const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Add hot reloading in development (react-hmre specified in package.json)
module.exports = require('./webpack.base.babel')({
  // Emit a source map for easier debugging
  devtool: 'eval-source-map', // 'inline-source-map'

  // The "entry points" to our application
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    require.resolve('./polyfills'),
    require.resolve('react-virtualized/styles.css'),
    path.join(process.cwd(), 'src/styles/base.css'),
    path.join(process.cwd(), 'src/index.js'),
  ],

  // No hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  // Note: we do not need HMR rules using webpack-hot-middleware
  module: {
    rules: [],
  },

  // must inject into head since we load external scripts last
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'head',
    }),
  ],

});
