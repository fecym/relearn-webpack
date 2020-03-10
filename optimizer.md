## noParse

- 当我们引入一个依赖，知道他里面没有其他的依赖，我们可以告诉 webpack 让他不去解析这个包的依赖关系，从而加速构建或者打包的速度

```js
module: {
  rules: [],
  // noParse: /jquery/,
  noParse: content => {
    return /jquery/.test(content);
  }
}
```

## exclude 和 include

- 可以设置 loader 解析文件要排除的哪些目录，比如说 node_modules
- 有排除就有包含，也可以设置让 loader 解析的时候只找某一个目录，比如说 src 目录
- 两个加一个就可以

## IgnorePlugin

- 这是 webpack 自带的一款插件，可以忽略掉 模块内部的引用，
- 比如说格式化时间的插件 moment，该插件假如我们只用他格式化了一下时间，但是打包后看到项目明显变大了好多
- 可以他到该插件的内部是默认引入所有的语言包，此时我们可以配置一下忽略掉让引入的语言包

```js
plugins: [new webpack.IgnorePlugin(/\.\/locale/, /moment/)]
```

- 此时我们会发现，之前设置 moment 的语言包实效了，此时我们就需要手动引入以下我们用到的语言包

```js
import moment from 'moment'
// 手动引入中文语言包
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const current = moment()
  .endOf('day')
  .fromNow()
```

## 动态链接库 DLLPlugin

- 有些第三方库比较大，每次打包都打包他们比较耗时，此时我们可以把第三方包先打包一下
- 这样做呢，每次打包的时候就会先去看看有没有打过包，如果打过了就直接走链接库，不需要给那些提取出来的包在打包了，打包一次可以一直使用，只要包的版本没变就可以一直使用
- 每次打包出来的模块，如果有暴露出来东西，我们可以把暴露出来的东西执行一个值，此时我们可以在 output 里面配置 library 给一个变量来接受
- 默认是用 var 声明了我们传递过去的变量，我们用默认就可以了
- 实现动态链接库需要以下几步：

  - 我们单独穿件一个 webpack 配置文件，作为动态链接库的配置，然后在 entry 中配置要做链接的库的名字或者路径
  - output 中配置打包后的名字和存放位置，定义 library 接受
  - 在 plugins 中配置 manifest.json 的映射地址，附上一个完整配置

  ```js
  const path = require('path')
  const resolve = dir => path.resolve(__dirname, dir)
  const webpack = require('webpack')
  module.exports = {
    entry: {
      react: ['react', 'react-dom'],
    },
    output: {
      filename: '[name].dll.js',
      path: resolve('../public/dll'),
      // 定义一个接受的变量
      library: '_dll_[name]',
      // libraryTarget: 'var', // var、this、umd、commonjs
    },
    plugins: [
      new webpack.DllPlugin({
        // name 要和 library 一样
        name: '_dll_[name]',
        // 映射路径
        path: resolve('../public/dll/[name].manifest.json'),
      }),
    ],
  }
  ```

  - 然后去主 webpack 配置中，新增动态链接库引用的插件，配置如下

  ```js
  // 主 webpack 配置
  plugins: [
    // 引用 dll 插件
    new webpack.DllReferencePlugin({
      // 打包的时候先去找这么一个清单，如果找不到了在去打包
      manifest: require('../public/dll/react.manifest.json'),
    }),
  ]
  ```

  - 最后需要在 HTML 中引入打包的这个动态链接库的 js 文件
  - 不可能每次修改都去引，所以我们可以使用一个插件（add-asset-html-webpack-plugin）动态的注入的 HTML 里面

  ```js
  plugins: [
    new AddAssetHtmlPlugin([
      {
        // 要添加到编译中的文件的绝对路径，以及生成的HTML文件。支持 globby 字符串
        filepath: require.resolve(
          path.resolve(__dirname, '../public/dll/react.dll.js')
        ),
        // 文件输出目录
        outputPath: 'dll',
        // 脚本或链接标记的公共路径
        publicPath: 'dll',
      },
    ]),
  ]
  ```

- 有一个要注意的地方，记得把 AddAssetHtmlPlugin 的配置写在 HTMLWebpackPlugin 插件的后面，不然可能不会把资源注入进去

## happypack

- happypack 可以实现多线程打包
- 之前在匹配的 js 的时候我们用 babel-loader 处理，现在改成 'happypack/loader?id=js' 后面加一个 id
- 然后在 plugins 中配置 happypack 的插件，然后把之前在 loader 中写配置写在 plugins 中，对应好想引的 id 就行
- 如果有多个 loader 需要开启多线程，那就多 new 几个 happypack 的实例即可，如果项目比较小的话，不推荐使用，因为在开启多线程也是需要时间的

```js
module: {
  rules: [
    {
      test: /\.js$/,
      // use: [
      //   {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-env', '@babel/preset-react'],
      //       plugins: ['@babel/plugin-transform-runtime'],
      //     },
      //   },
      // ],
      // 改用happypack
      use: 'Happypack/loader?id=js',
      include: resolve('../src/'),
    },
  ],
},
plugins: [
  new Happypack({
    // id 对应好
    id: 'js',
    // 把 js 写好的放到这里
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-transform-runtime'],
        },
      },
    ],
  }),
],
```

## webpack 自带的优化

- webpack 自身帮我们做了两个优化，都是在生产环境才做的优化
- import 在生产环境下，会自动去除没有删除没用的代码（tree-shaking），require 是不可以的
  - 比如说引用了一个代码，但是没有使用，webpack 打包后自动帮我们删除掉那份代码
- scope hosting 作用域提升，webpack 会帮我优化代码，比如说

```js
// 代码这么写
let a = 1
let b = 2
let c = 3
let d = a + b + c
// 在 webpack 中会自动省略，可以简化代码
console.log(d, '-----------')
// 编译之后的代码
... 省略其他的
})([
  function(e, t, r) {
    'use strict'
    r.r(t)
    console.log(6, '-----------')
  },
])
```

## 分割代码块

- 代码中不同文件出现相同的代码，我们可以把他们抽离出来，在 optimization.splitChunk 中可以配置代码抽离逻辑
- 在以前的配置中叫 commonChunkPlugins，在 webpack4 中改名字了

```js
optimization: {
  // 分割代码块
  splitChunks: {
    // 缓存组
    cacheGroups: {
      // 公共的模块
      common: {
        // 从哪开始找
        chunks: 'initial',
        minSize: 0,
        // 使用多少次抽离
        minChunks: 2,
      },
  }
}
```

- 也可以专门配置第三方模块，而且可以设置权重

```js
// 第三方模块的抽离
vender: {
  // 设置权重
  priority: 1,
  test: /node_modules/,
  // 从哪开始找
  chunks: 'initial',
  minSize: 0,
  // 使用多少次抽离
  minChunks: 2,
}
```

## 懒加载

- webpack 提供了懒加载语法，在 Es 新版本中该语法也成为了规范 `import('./moduel.js').then(res => {})`

```js
const btn = document.createElement('button')
btn.addEventListener('click', () => {
  import('./source.js').then(res => {
    console.log(res.default)
  })
})
btn.innerHTML = 'hello'
document.body.append(btn)
```

## 热更新

- 首先可以在 devServer 中配置 hot 为 true 开启热更新，然后在 plugins 里面配置 NamedModulesPlugin 和 HotModuleReplacementPlugin

```js
plugins: [
  // 查看那个模块更新了
  new webpack.NamedModulesPlugin(),
  // webpack 的热更新插件
  new webpack.HotModuleReplacementPlugin()
],
```

```log
# 可以看到 ./optimizers/src/source.js 模块更新了
[HMR] Updated modules:
app-63bb3ae5.js:1 [HMR]  - ./optimizers/src/source.js
```
