const {smart} = require('webpack-merge')
const baseConf = require('./webpack.base')
const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const Happypack = require('happypack')

module.exports = smart(baseConf, {
  module: {
    rules: [
      {
        test: /\.js$/,
        // use: [
        //   {
        //     loader: 'babel-loader',
        //     options: {
        //       presets: ['@babel/preset-env', '@babel/preset-react'],
        //       plugins: ['@babel/plugin-transform-runtime'],
        //     },
        //   },
        // ],
        // 改用happypack
        use: 'Happypack/loader?id=js',
        include: resolve('../src/'),
      },
      {
        test: /\.css$/,
        use: 'Happypack/loader?id=css'
      }
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve('../public/index.html'),
      title: 'Happypack',
      filename: 'index.html',
    }),
    new Happypack({
      // 把 js 写好的放到这里
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      ],
    }),
    new Happypack({
      id: 'css',
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          // 解决背景图问题
          publicPath: '..'
        }
      }, 'css-loader', 'postcss-loader'],
    })
  ],
})
