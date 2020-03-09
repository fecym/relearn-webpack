const express = require('express')
const app = express()

const webpack = require('webpack')
const middle = require('webpack-dev-middleware')
// 引入 webpack 配置
const config = require('../config/webpack.config-proxy')
// 取得 webpack 的编译结果
const compiler = webpack(config)
// 把 webpack 编译结果处理成中间件交给node来处理
app.use(middle(compiler))

app.get('/api/v2/user', (req, res) => {
  res.json({name: 'cym'})
})

app.listen(3000)
