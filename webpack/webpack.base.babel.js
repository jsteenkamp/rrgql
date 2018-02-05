// common webpack config
const path = require('path');
const webpack = require('webpack');

// merge with env dependent settings (options)
module.exports = options => ({
  entry: options.entry,
  output: Object.assign(
    {
      path: path.resolve(process.cwd(), 'dist/build'),
    },
    options.output,
  ),
  module: {
    rules: options.module.rules.concat([
      {
        test: /\.js$/,
        include: [/src/],
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        include: [/src/, /node_modules/],
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(graphql|gql)$/,
        include: [/src/],
        use: 'graphql-tag/loader',
      },
    ]),
  },
  plugins: options.plugins.concat([
    // make fetch available
    new webpack.ProvidePlugin({
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Expose NODE_ENV to webpack to for any environment checks in your code
    // or use babel-plugin-transform-inline-environment-variables
    /*
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    */
    // or this with process.env.NODE_ENV and a default value if undefined
    /*
    new webpack.EnvironmentPlugin({'NODE_ENV' : 'development'}),
    */
    // get application version to inject into UI
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require('../package.json').version)
    }),
  ]),
  resolve: {
    modules: ['src', 'node_modules'],
    alias: {
      Components: path.resolve(__dirname, '../src/components/'),
      Containers: path.resolve(__dirname, '../src/containers/'),
      Store: path.resolve(__dirname, '../src/store/'),
      Utils: path.resolve(__dirname, '../src/utils/'),
      Views: path.resolve(__dirname, '../src/views/'),
      GraphQL: path.resolve(__dirname, '..src/graphql'),
    }
  },
  devtool: options.devtool,
  // make web variables accessible to webpack, e.g. window
  target: 'web',
  stats: true,
});
