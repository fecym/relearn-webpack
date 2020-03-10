const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: resolve('../src/main.js'),
  },
  output: {
    path: resolve('../love/'),
    filename: 'js/[name]-[hash:8].js',
  },
  module: {
    rules: [
      // {
      //   test: /\.(htm|html)$/i,
      //   loader: 'html-withimg-loader'
      // },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ],
        include: resolve('../src/'),
      },
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            // 解决背景图问题
            publicPath: '..'
          }
        }, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 10k 以下的图片转base64
              limit: 10240,
              name: 'img/[name].[hash:6].[ext]',
            }
          }
        ]
      }
    ],
  },
  devServer: {
    open: true,
    progress: true,
    // inline: true,
    hot: true,
    port: 8080,
    contentBase: resolve('../public')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name]-[hash:7].css'
    }),
    new HTMLWebpackPlugin({
      template: resolve('../public/index.html'),
      filename: 'index.html',
      title: '基础配置',
    })
  ]
}
