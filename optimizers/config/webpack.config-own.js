const {smart} = require('webpack-merge')
const baseConf = require('./webpack.base')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const HTMLWebpackPlugin = require('html-webpack-plugin')


module.exports = smart(baseConf, {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ],
        include: resolve('../src/'),
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve('../public/index.html'),
      title: 'webpack 自带的优化',
      filename: 'index.html',
    }),
  ],
})
