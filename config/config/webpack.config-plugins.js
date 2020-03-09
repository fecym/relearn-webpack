const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const HTMLWebpackPlugin = require('html-webpack-plugin')

// cleanWebpackPlugin
// copyWebpackPlugin
// bannerPlugin
// const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webapc = require('webpack')
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
      title: 'plugins',
    }),
    // new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: resolve('../doc'),
        to: resolve('../love/doc'),
      },
    ]),
    new webapc.BannerPlugin('make 2020 by chengyuming')
  ],
}
