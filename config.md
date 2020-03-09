## 配置多页

- 首先我们需要在 entry 中配置改为一个对象，然后不同页面的逻辑以不同的名字来命令
- 然后修改 output.filename 的配置不使用死的名字，改为 \[name\].js
- 最后需要在 HTMLWebpackPlugin 插件中配置，打包后对应的 HTML 文件名字，有多个就多实例化一次 HTMLWebpackPlugin，然后在 配置项里面配置 chunks 配置需要引用的 js 文件

```js
// entry 配置
entry: {
  home: resolve('../src/index.js'),
  other: resolve('../src/other.js'),
},
// output 配置
output: {
  path: resolve('../love/'),
  filename: 'js/[name]-[hash:8].js',
},
// plugins 的配置
plugins: [
  new HTMLWebpackPlugin({
    template: resolve('../src/index.html'),
    filename: 'home.html',
    title: '多页面配置 - home',
    // 注意这个，引入哪个文件配置哪个 chunkname
    chunks: ['home']
  }),
  new HTMLWebpackPlugin({
    template: resolve('../src/index.html'),
    filename: 'other.html',
    title: '多页面配置 - other',
    chunks: ['other']
  })
]
```

## sourceMap

- 当我们代码编译之后出错了，然后查看错误信息，结果都是压缩后的代码，然后我们定位不到问题出在哪里，此时我们可以配置 devtool
- devtool 增加映射，可以帮助我们调试远程代码，他有几个选项
  - source-map：会单独生成一个 sourcemap 文件，出错了会标识当前报错的列和行
  - eval-source-map：不会生产单独的 sourcemap 文件，但是可以显示报错的行和列，集成在打包后的文件中
  - cheap-module-source-map：不会产生行和列，但是是一个单独的映射文件
  - cheap-module-eval-source-map：不会产生行和列，也不会产生文件，集成在打包后的文件中

## watch

- webpack 可以实时去监控我们打包的文件
- 我们只需要在配置中增加 watch: true，便可以，当然也是可以配置一些配置的，需要在 watchOptions 中配置

```js
// 实时去监控我们打包的文件
watch: true,
watchOptions: {
  // 每秒问多少次
  poll: 1000,
  // 防抖，500 ms 后在打包
  aggregateTimeout: 500,
  // 不需要监控那个文件
  ignored: /node_modules/
},
```

## 常用的小插件

- CleanWebpackPlugin
- copyWebpackPlugin
- bannerPlugin

### CleanWebpackPlugin

- 这个插件是一个可以用来删除文件一个插件
- 使用时候需要解构出来，以前版本不需要，目前版本都需要解构出来，配置是一个对象，可以不传递，默认值够用了
- 我还是喜欢使用 `rm -rf file` 来删除文件更加暴力一点

### copyWebpackPlugin

- 该插件可以把项目一些其他的文件原封不动的复制到打包后的目录下面，比如说项目中写了一些文档，我们就可以用这个插件处理一下

```js
// 参数是一个数组
new CopyWebpackPlugin([
  {
    from: resolve('../doc'),
    to: resolve('../love/doc'),
  },
]),
```

### bannerPlugin

- 这个插件是做版权的一个插件，可以让编译后的代码假如作者信息，说明是作者是谁 `/*! make 2020 by chengyuming */`

- 该插件是 webpack 内置的插件

```js
new webapc.BannerPlugin('make 2020 by chengyuming')
```

## 解决跨越

### http-proxy

- 在 node 中有 http-proxy 插件可以做代理，集成到了 webpack 中，可以直接拿来用
- 可以在 devServer 中配置 proxy，把我们的请求地址修改为服务器地址，同时也可以重写地址

```js
  // 后端 api 地址：http:localhost:3000/api/v2/user，
  devServer: {
    port: 8080,
    progress: true,
    open: true,
    contentBase: resolve('../love'),
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {
          // 重写地址
          '/api': '/api/v2/'
        }
      }
    }
  },
```

### mock 数据

- 如果只是想单纯的模拟数据，我们可以直接在 sevServer 中提供的钩子函数(before)中进行模拟，因为 webpack 也是 express 框架做的，所以我们可以直接模拟数据
- 在 before 中接受一个参数 app，就是我们的服务器

```js
devServer: {
  port: 8080,
  progress: true,
  open: true,
  contentBase: resolve('../love'),
  // 模拟数据
  before(app) {
    app.get('/api/user', (req, res) => {
      res.json({
        name: 'cym'
      })
    })
  }
},
```

### 使用 node 端跑 webpack

- 有些时候呢，我们有服务端，但是不想用代理来处理跨域，在服务端中启动 webpack，端口用服务端的端口
- 此时我们可以在服务器引入 webpack 把 webpack 以中间件的形式处理，此时需要一个插件 webpack-dev-middleware
- 然后我们把 webpack 处理成中间件然后交给 node 来处理，此时 node 服务跑起来后，webpack 也跑起来了，端口号同 node 服务的端口，此时就不会存在跨越问题了

```js
// node 端代码
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
```

## resolve

### 查看路径

- 我么可以在 webpack 中配置查的第三方包的路径，比如说我们 require 的时候默认找到的 node_modules 下面的文件，也可以让他找其他目录下的文件
- 此时我们就需要在 resolve.modules 中配置，它是一个数组，可以配置多个
- 比如说我们配置了工具函数的文件夹 utils，utils 下面有个 a 方法，我们引用的时候就可以直接引入便可

```js
// webpack
resolve: {
  modules: [path.resolve('node_modules'), resolve('../src/utils')],
}
// 其他文件
import a from 'a'
```

### 别名

- 别名是我们经常用的，比如说 src 目录我们会配置成 @，此时都是在 webpack 下面配置的

```js
alias: {
  bootstrap: 'bootstrap/dist/css/bootstrap.css',
  '@': resolve('../src/')
}
```

### 控制模块查找的先后顺序

- 默认情况下，webpack 查找模块，会找模块下面的 package.json 中的 main 字段，main 字段指向哪个地址那就是哪个地址，这个查看顺序其实也是可以更改的，比如说 bootstrap 他会默认找 `dist/js/bootstrap`，但是我们只想用他的样式，我们就需要把它改成默认查找 style 属性 `dist/css/bootstrap.css`

![bootstrap]('./images/webpack-resolve.png')

- 此时我们可以通过 mainFileds 字段来控制查找的先后顺序

```js
resolve: {
  modules: [path.resolve('node_modules'), resolve('../src/utils')],
  alias: {
    // bootstrap: 'bootstrap/dist/css/bootstrap.css',
    '@': resolve('../src/')
  },
  // 控制查找的先后顺序
  mainFields: ['style', 'main']
},
```

- 也可以修改 mainFiles，修改入口文件

### 省略拓展名

- 在开发中，我们可能有时候不想写后缀名，但是也能找到我们想要的那个文件，此时我们可以配置 extensions 字段，来让 webpack 查找的时候自动配置对应的拓展名

```js
resolve: {
  alias: {
    '@': resolve('../src/')
  },
  // 记得加点哦
  extensions: ['.js', '.json', '.ts', '.jsx', '.css', '.scss', '.vue'],
},
```

## 环境变量

- 工作中我们经常会根据一些环境变量来区分是开发环境还是生产环境还是其他环境
- 比如说我们请求的接口地址，不同环境可能地址是不一样的，我们就可以根据环境变量来判断
- webpack 内置了一个插件可以帮我们实现这个功能 DefinePlugin 来定义一些常用的环境变量

```js
plugins: [
  new webpack.DefinePlugin({
    // 引号里面放入的其实是一个js的变量
    // DEV: 'dev' // console.log(dev)
    // DEV: '"dev"'
    DEV: JSON.stringify('dev'), // 'dev'
    FLAG: 'true',   // true
    EXPORESSION: '1+1', // 2
    EXPORESSION2: JSON.stringify('1+1'), // '1+1'
  }),
],
```

## 区分环境配置

- 有个 webpack-merge 插件可以帮我们合并配置，此时我们就可以区分环境来做不同的配置文件
- 然后根据传递的参数来启动相应的 webpack 配置文件
- 一般我们会有三个配置文件，开发环境、生产环境以及一个最基本的配置
- 在开发和生产环境的配置中直接把基础配置合并过来就可以了

```js
// 使用 webpack-merge 插件
const {smart} = require('webpack-merge')
const baseConf = require('./webpack.base.config')
module.exports = smart(baseConf, {
  // merge 了最基础的配置然后根据不同环境做不同的配置
})
```

- 然后使用的使用只需要在 package.json 文件中执行 webpack 的时候增加 config 参数来改变 webpack 要执行的配置文件

```json
{
  "scripts": {
    "start": "webpack-dev-server --config ./config/webpack.config-dev.js --mode development",
    "build": "rm -rf ./dist && webpack --config ./config/webpack.config-prod.js --mode production",
    "build:dev": "rm -rf ./dist && webpack --config ./config/webpack.config-prod.js --mode development"
  }
}
```
