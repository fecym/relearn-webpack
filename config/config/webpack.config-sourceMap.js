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
  },
  devServer: {
    port: 3000,
    progress: true,
    open: true,
    contentBase: resolve('../love'),
  },
  // 增加映射，会单独生成一个 sourcemap 文件，可以帮助我们调试源代码
  // devtool: 'source-map',
  // 不会生产单独的 sourcemap 文件，但是可以显示报错的行和列
  // devtool: 'eval-source-map',
  // 不会产生列，但是是一个单独的映射文件
  // devtool: 'cheap-module-source-map',
  // 不会产生列，不会产生文件，集成在打包后的文件中
  devtool: 'cheap-module-eval-source-map',
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
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve('../src/index.html'),
      filename: 'index.html',
      title: 'sourceMap',
    }),
  ],
}
