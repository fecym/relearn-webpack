const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const HTMLWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    home: resolve('../src/index.js'),
    other: resolve('../src/other.js'),
  },
  output: {
    path: resolve('../love/'),
    filename: 'js/[name]-[hash:8].js',
    // cdn 配置引用静态资源路径
    publicPath: '.',
  },
  devServer: {
    port: 3000,
    progress: true,
    open: true,
    contentBase: resolve('../love'),
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve('../src/index.html'),
      filename: 'home.html',
      title: '多页面配置 - home',
      chunks: ['home']
    }),
    new HTMLWebpackPlugin({
      template: resolve('../src/index.html'),
      filename: 'other.html',
      title: '多页面配置 - other',
      chunks: ['other']
    })
  ]
}
