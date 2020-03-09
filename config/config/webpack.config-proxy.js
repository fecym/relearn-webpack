const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
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
    port: 8080,
    progress: true,
    open: true,
    contentBase: resolve('../love'),
    // 做代理
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     pathRewrite: {
    //       '/api': '/api/v2/'
    //     }
    //   }
    // }
    // 模拟数据
    before(app) {
      console.log(path.resolve('node_modules'), "path.resolve('node_modules')")
      app.get('/api/user', (req, res) => {
        res.json({
          name: 'cym'
        })
      })
    }
  },
  resolve: {
    modules: [path.resolve('node_modules'), resolve('../src/utils')],
    alias: {
      // bootstrap: 'bootstrap/dist/css/bootstrap.css',
      '@': resolve('../src/')
    },
    mainFields: ['style', 'main'],
    extensions: ['js', 'json', 'ts', 'jsx', 'css', 'scss', '.vue']
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve('../src/index.html'),
      filename: 'index.html',
      title: '跨域呀',
    }),
    new webpack.BannerPlugin('make 2020 by chengyuming')
  ],
}
