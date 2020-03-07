const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const resolveFile = filename => path.resolve(__dirname, filename)
module.exports = {
  // 模式
  mode: 'development',
  // 入口
  entry: {
    app: resolveFile('../src/index.js'),
    a: resolveFile('../src/a'),
  },
  output: {
    filename: 'js/[name]-[hash:8].js',
    path: resolveFile('../love'),
  },
  devServer: {
    port: 3000,
    progress: true,
    open: true,
    contentBase: resolveFile('../love'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 不要放在 style 标签里了
          // {
          //   loader: 'style-loader',
          //   options: {
          //     insert: 'body',
          //   },
          // },
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 处理浏览器前缀，需要在解析css之前加上前缀
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('autoprefixer')],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 模板放的位置
      template: resolveFile('../src/index.html'),
      // 打包后的名字
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      // 抽离出来的文件名字
      filename: 'css/[name].[hash:8].css',
    }),
  ],
  optimization: {
    minimizer: [
      // 压缩 css 需要使用它
      new OptimizeCssAssetsPlugin({}),
      // 然后还要手动压缩一下 js
      new UglifyJsPlugin({
        cache: true,
        // 使用多线程压缩，并发数量默认为 os.cpus().length - 1
        parallel: true,
        sourceMap: true
      }),
    ],
  },
}
