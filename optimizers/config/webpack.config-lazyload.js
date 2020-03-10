const {smart} = require('webpack-merge')
const baseConf = require('./webpack.base')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = smart(baseConf, {
  entry: {
    app: resolve('../src/main.js'),
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
      title: '懒加载',
      filename: 'index.html',
    }),
    // 查看那个模块更新了
    new webpack.NamedModulesPlugin(),
    // webpack 的热更新插件
    new webpack.HotModuleReplacementPlugin()
  ],
})
