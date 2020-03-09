const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    home: resolve('../src/index.js'),
    other: resolve('../src/other.js'),
  },
  output: {
    path: resolve('../love/'),
    filename: 'js/[name]-[hash:8].js',
  },
  devServer: {
    port: 3000,
    progress: true,
    open: true,
    contentBase: resolve('../love'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  plugins: [
    new webpack.BannerPlugin('make 2020 by chengyuming'),
    new HTMLWebpackPlugin({
      template: resolve('../src/index.html'),
      filename: 'index.html',
      title: '原始的基础配置',
    }),
  ],
}
