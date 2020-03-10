const {smart} = require('webpack-merge')

const baseConf = require('./webpack.base')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

const HTMLWebpackPlugin = require('html-webpack-plugin')

const webpack = require('webpack')

module.exports = smart(baseConf, {
  module: {
    // 不去解析 jQuery 中的依赖关系
    noParse: /jquery/,
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
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
      title: '优化',
      filename: 'index.html',
    }),
    // 忽略 moment 中的语言包
    new webpack.IgnorePlugin(/\.\/locale/, /moment/)
  ],
})
