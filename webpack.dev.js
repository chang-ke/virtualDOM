const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const webpackConfigDev = {
  devtool: 'source-map',
  entry: {
    main: path.join(__dirname, './index.js')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, './index.html')
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, './'),
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    inline: true,
    port: 8080 //, //端口你可以自定义
  }
};

module.exports = webpackConfigDev;
