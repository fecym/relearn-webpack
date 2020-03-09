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
  watch: true,
  watchOptions: {
    // 每秒问多少次
    poll: 1000,
    // 防抖，500 ms 后在打包
    aggregateTimeout: 500,
    // 不需要监控那个文件
    ignored: /node_modules/
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
      title: 'watch',
    }),
  ],
}
