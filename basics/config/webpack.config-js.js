const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const webpack = require('webpack')
const resolveFile = filename => {
  return path.resolve(__dirname, filename)
}
module.exports = {
  mode: 'development',
  entry: {
    app: resolveFile('../src/index.js'),
  },
  output: {
    path: resolveFile('../love'),
    filename: 'js/[name].[hash:8].js',
  },
  module: {
    rules: [
      // {
      //   test: require.resolve('jquery'),
      //   // 同 import $ from 'expose-loader?$!jquery' 写法
      //   use: 'expose-loader?$'
      // },
      {
        test: /\.css$/,
        use: [
          // 转成 link 标签引入 css
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('autoprefixer')],
            },
          },
        ],
      },
      {
        // loader 是从下到上从左到右的执行
        test: /\.js$/,
        // 使用 enforce 可以改变 loader 的执行顺序，让监测代码保持最早先执行
        enforce: 'pre', // previous   post
        use: ['eslint-loader'],
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        // 减少代码查找体积
        include: resolveFile('../'),
        // 排除编译代码的路径
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    // cdn 引入了，但是我又 import $ from 'jquery'，这样会把 jQuery 有打包进去
    // 这么配置可以解决这个问题
    jquery: 'jQuery',
  },
  devServer: {
    port: 3000,
    progress: true,
    open: true,
    contentBase: resolveFile('../love'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
    }),
    new HtmlWebpackPlugin({
      template: resolveFile('../src/index.html'),
      filename: 'index.html',
    }),
    // // 全局注入
    // new webpack.ProvidePlugin({
    //   // 在每个模块中都注入 $
    //   '$': 'jquery'
    // })
  ],
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({}),
      new UglifyJsPlugin({
        cache: true,
        // 使用多线程压缩，并发数量默认为 os.cpus().length - 1
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
}
