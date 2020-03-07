// webpack 是 node 写出来的 所以需要 node的写法
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const resolveFile = filename => {
  return path.resolve(__dirname, filename)
}
module.exports = {
  // 模式
  mode: 'development',
  // 入口
  entry: {
    app: resolveFile('./src/index.js'),
    a: resolveFile('./src/a'),
  },
  output: {
    // 打包后的文件名
    filename: '[name]-[hash:8].js',
    // 必须绝对路径
    path: resolveFile('love'),
  },
  devServer: {
    port: 3000,
    progress: true,
    open: true,
    contentBase: resolveFile('love'),
  },
  module: {
    // 里面匹配规则，所以是 rules
    rules: [
      {
        test: /\.css$/,
        // loader 执行顺序，从右往左，从下到上
        // style-loader 是让样式写入 style 标签里面
        // css-loader 解析 @import 这种语法的
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'body'
            },
          },
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      // 模板放的位置
      template: resolveFile('./src/index.html'),
      // 打包后的名字
      filename: 'index.html',
      minify: {
        // 删除属性的双引号
        removeAttributeQuotes: true,
        // 折叠空行
        collapseWhitespace: true,
      },
      hash: true,
    }),
  ],
}
