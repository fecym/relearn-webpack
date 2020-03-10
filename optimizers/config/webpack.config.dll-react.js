const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const webpack = require('webpack')
module.exports = {
  entry: {
    react: ['react', 'react-dom'],
  },
  output: {
    filename: '[name].dll.js',
    path: resolve('../public/dll'),
    // 定义一个接受的变量
    library: '_dll_[name]',
    // libraryTarget: 'var', // var、this、umd、commonjs
  },
  plugins: [
    new webpack.DllPlugin({
      // name 要和 library 一样
      name: '_dll_[name]',
      // 映射路径
      path: resolve('../public/dll/[name].manifest.json')
    })
  ]
}
