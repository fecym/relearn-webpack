const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const {smart} = require('webpack-merge')
const baseConf = require('./webpack.base.config')
module.exports = smart(baseConf, {
  devServer: {
    // 做代理
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     pathRewrite: {
    //       '/api': '/api/v2/'
    //     }
    //   }
    // }
    // 模拟数据
    // before(app) {
    //   console.log(path.resolve('node_modules'), "path.resolve('node_modules')")
    //   app.get('/api/user', (req, res) => {
    //     res.json({
    //       name: 'cym',
    //     })
    //   })
    // },
  },
  resolve: {
    // modules: [path.resolve('node_modules'), resolve('../src/utils')],
    alias: {
      bootstrap: 'bootstrap/dist/css/bootstrap.css',
      '@': resolve('../src/'),
    },
    // mainFields: ['style', 'main'],
    extensions: ['.js', '.json', '.ts', '.jsx', '.css', '.scss', '.vue'],
  },
  module: {
    rules: [],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve('../src/index.html'),
      filename: 'index.html',
      title: '环境变量',
    }),
    // 定义变量
    new webpack.DefinePlugin({
      // 引号里面放入的其实是一个js的变量
      // DEV: 'dev' // console.log(dev)
      // DEV: '"dev"'
      DEV: JSON.stringify('env'),
      FLAG: 'true',
      EXPORESSION: '1+1', // 2
      EXPORESSION2: JSON.stringify('1+1'), // '1+1'
    }),
  ],
})
