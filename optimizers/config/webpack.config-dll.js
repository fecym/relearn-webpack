const {smart} = require('webpack-merge')

const baseConf = require('./webpack.base')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

const HTMLWebpackPlugin = require('html-webpack-plugin')

const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

const webpack = require('webpack')

module.exports = smart(baseConf, {
  module: {
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
      title: '动态链接库',
      filename: 'index.html',
    }),
    // 引用 dll 插件
    new webpack.DllReferencePlugin({
      // 打包的时候先去找这么一个清单，如果找不到了在去打包
      manifest: require('../public/dll/react.manifest.json'),
    }),
    new AddAssetHtmlPlugin([
      {
        // 要添加到编译中的文件的绝对路径，以及生成的HTML文件。支持 globby 字符串
        filepath: require.resolve(
          path.resolve(__dirname, '../public/dll/react.dll.js')
        ),
        // 文件输出目录
        outputPath: 'dll',
        // 脚本或链接标记的公共路径
        publicPath: 'dll',
      },
    ]),
    // 忽略 moment 中的语言包
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
  ],
})
