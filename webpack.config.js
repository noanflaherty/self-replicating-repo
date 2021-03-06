var webpack = require('webpack');

var path = require('path');
var APP_DIR = path.resolve(__dirname, 'client');
var BUILD_DIR = path.resolve(__dirname, 'server/static/javascript');

var config = {
  entry: APP_DIR + '/main.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include:  APP_DIR,
        loader: 'babel-loader',
        options: {
            babelrc: false,
            presets: ['env', 'react', 'stage-2'],
          },
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify(process.env.LOCATION),
      'GITHUB_CLIENT_ID': JSON.stringify(process.env.GITHUB_CLIENT_ID),
      'SERVER_NAME': JSON.stringify(process.env.SERVER_NAME),
    }),
  ],
};

module.exports = config;
