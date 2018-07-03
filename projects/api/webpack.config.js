const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require("start-server-webpack-plugin");

const config = {
  entry: ['./src/index.ts'],
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BUILD_TIME': JSON.stringify(new Date().toLocaleString('nl-NL', {timeZone: 'Europe/Amsterdam'})),
    }),
  ],
  devtool: 'source-map'
};

module.exports = (env, {mode}) => {
  
  if(mode === 'development') {
    config.watch = true;
    config.entry.unshift('webpack/hot/poll?1000');
    config.plugins.push(...[
      new webpack.HotModuleReplacementPlugin(),
      new StartServerPlugin({
          name: 'server.js',
          nodeArgs: ['--inspect'],
          keyboard: true,
        }),
    ]);
  }
  else {
  }
  
  return config;
}