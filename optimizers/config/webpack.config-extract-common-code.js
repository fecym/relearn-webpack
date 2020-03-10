const {smart} = require('webpack-merge')
const baseConf = require('./webpack.base')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const HTMLWebpackPlugin = require('html-webpack-plugin')


module.exports = smart(baseConf, {
  entry: {
    index: resolve('../src/main.js'),
    other: resolve('../src/other.js'),
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
      title: '提取公共代码',
      filename: 'index.html',
    }),
  ],
  optimization: {
    // 分割代码块
    splitChunks: {
      // 缓存组
      cacheGroups: {
        // 公共的模块
        common: {
          // 从哪开始找
          chunks: 'initial',
          minSize: 0,
          // 使用多少次抽离
          minChunks: 2,
        },
        // 第三方模块的抽离
        vender: {
          // 设置权重
          priority: 1,
          test: /node_modules/,
          // 从哪开始找
          chunks: 'initial',
          minSize: 0,
          // 使用多少次抽离
          minChunks: 2,
        }
      }
    }
  }
})
