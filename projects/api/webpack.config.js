const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require("start-server-webpack-plugin");

module.exports = {
  entry: ['webpack/hot/poll?1000', './src/index.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new StartServerPlugin({
        name: 'server.js',
        nodeArgs: ['--inspect'],
      }),
  ],
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'server.js',
  },
};