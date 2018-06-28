const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require("start-server-webpack-plugin");

const config = {
  entry: ['./src/index.ts'],
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
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'server.js',
  },
};

module.exports = (env, {mode}) => {
  
  if(mode === 'development') {
    config.watch = true;
    config.entry.unshift('webpack/hot/poll?1000');
    config.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new StartServerPlugin({
          name: 'server.js',
          nodeArgs: ['--inspect'],
          keyboard: true,
        }),
    ];
  }
  else {
  }

  return config;
}