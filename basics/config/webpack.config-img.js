const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HTMLWebpakcPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    app: resolve('../src/img.js'),
  },
  output: {
    path: resolve('../love/'),
    filename: 'js/[name]-[hash:8].js',
    // cdn 配置引用静态资源路径
    publicPath: '.',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: resolve('../src/'),
        exclude: /node_modules/,
      },
      {
        test: /\.(le|c|sc|sa)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '..',
            },
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader',
      },
      // 处理图片
      // {
      //   test: /\.(png|gif|jpg|bmp)$/,
      //   use: [{loader: 'file-loader', options: {esModule: false}}],
      //   // use: [{loader: 'file-loader', options: {}}],
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // limit: 200 * 1024,
              limit: 200,
              esModule: false,
              name: 'img/[name].[hash:8].[ext]',
              // 只有图片需要配置 cdn
              // publicPath: '.'
            },
          },
        ],
      },
    ],
  },
  devServer: {
    port: 3000,
    progress: true,
    open: true,
    contentBase: resolve('../love'),
  },
  externals: {
    jquery: 'jQuery',
  },
  plugins: [
    new HTMLWebpakcPlugin({
      template: resolve('../src/index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
    }),
  ],
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({}),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
}
