## webpack 基础配置篇

> 快速过一遍

## 安装

- 安装本地 webpack
- webpack webpack-cli -D

## webpack 可以进行 0 配置

- 打包工具 -> 输出后的结果 (js 模块)
- 打包（支持 js 模块化）

## 手动配置 webpack

- 默认配置文件是 webpack.config.js
- 但是如果你不想使用这个文件也是可以的，可以使用 `--config webpack.other.js` 来让 webpack 使用其他的配置文件

## 传参

- 如果想在命令行后面传参的，需要多个一个 `--`

```sh
npm run build -- --config ./basics/webpack.config.js
```

## 配置 HTML

- 配置 HTML 需要用到 html-webpack-plugin 插件
- 基本用法如下：

```js
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
```

## 配置 css

- 配置 css 需要配置 module，需要给 module 配置各种规则，所以需要在 rules 中配置
- loader 执行顺序，从右往左，从下到上
- style-loader 是让样式写入 style 标签里面
- css-loader 解析 @import 这种语法的
- 如果不想让 css 写入到 style 标签里面，我么需要抽离 css ，插件是 mini-css-extract-plugin，然后替换 style-loader，并且配置 plugins

```js
new MiniCssExtractPlugin({
  // 抽离出来的文件名字
  filename: 'css/[name].[hash:8].css',
}),
```

- 自动添加浏览器前缀需要用到 autoprefixer 和 postcss-loader 两个插件
- 处理浏览器前缀，需要在解析 css 之前加上前缀，所以 post-loader 的顺序要写在 css-loader 后面
- 并且需要配置一个 postcss.config.js 配置文件（使用 post-loader 就会调用这个文件），当然也可以直接在 loader 的 options 里面配置

```js
{
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: [require('autoprefixer')],
  },
},
```

- 想要压缩 css 需要使用插件 optimize-css-assets-webpack-plugin，[mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin) 官网推荐的，这个需要配置在 optimization 里面，但是使用了它之后 js 就不会压缩了，还需要使用另外一个插件 uglifyjs-webpack-plugin 来压缩 js

```js
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
```

## 编译 js

- 编译 js 需要用到 babel-loader，然后需要 babel 的核心模块 @babel/core，需要一个转换 es5 的模块 @babel/preset-env，所以需要执行下面的命令

```sh
npm i babel-loader @babel/core @babel/preset-env -D
```

- @babel/preset-env 是需要放在 presets 里面的
- @babel/plugin-proposal-decorators [类的装饰器](https://babeljs.io/docs/en/babel-plugin-proposal-decorators#simple-class-decorator)

```js
plugins: [
  [
    '@babel/plugin-proposal-decorators',
    {legacy: false, decoratorsBeforeExport: true},
  ],
  // ['@babel/plugin-proposal-class-properties', {loose: true}],
],
```

- @babel/plugin-transform-runtime 这个包用来节省代码大小，可以把公共代码抽离出来
- @babel/runtime 生产时需要依赖这个包

```sh
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```

- 默认 babel 不会编译 es6 以上的语法，此时需要加入 @babel/polyfill 模块来编译

```sh
npm install --save @babel/polyfill
```

### eslint

- 安装 eslint，然后在官网上找到 demo 进去可以自己根据情况配置一份 eslint 的配置，然后下载下来，放到根目录下面 .eslintrc.json

- loader 是从下到上从左到右的执行，eslint 也是校验 js 的，所以有 eslint-loader，但是校验语法我们要保证在最前面执行，所以可以增加配置项 enforce

```js
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
```

### 三方模块的处理

- loader 有几种类型，pre 在前面执行的 loader、normal 普通的 loader、内联 loader、后置 loader（postloader）
- 内联 loader ，比如说 jQuery 模块，我们想把 & 暴露到全局，比如说 window 对象上面，此时我们可以使用 expose-loader

```js
// import $ from 'jquery'
// 暴露给全局
import $ from 'expose-loader?$!jquery'
```

- 也可以直接在 webpack 中配置

```js
{
  test: require.resolve('jquery'),
  // 同 import $ from 'expose-loader?$!jquery' 写法
  use: 'expose-loader?$'
},
```

- 但是我们可能想把 \$ 注入到所有的文件中，不需要每个文件都单独引一次了
- 那就需要在 plugins 中配置一个 webpack 自带的插件 ProvidePlugin

```js
// 全局注入
new webpack.ProvidePlugin({
  // 在每个模块中都注入 $
  $: 'jquery',
})
```

- 假如 cdn 引入了 jQuery，在项目中我又写了 import \$ from 'jquery'。此时会把 jQuery 在打包到项目中，配置 externals 可以解决这个问题

```js
externals: {
  // cdn 引入了，但是我又 import $ from 'jquery'，这样会把 jQuery 有打包进去
  // 这么配置可以解决这个问题
  jquery: 'jQuery'
},
```

### 引入一个模块三种方法

1. expose-loader 暴露给 window
2. ProvidePlugin 注入到所有文件
3. externals 引入不打包

## 打包图片

### 引入图片

- 使用图片有三种情况

  - 在 js 中创建图片引入
  - 在 css 的 background 中使用
  - `<img src="" alt="">` 直接引入

### file-loader

- 处理图片我们可以用 file-loader 来处理文件
- file-loader 会在内部生成一张图片到 打包后的 目录下，并保持原来的名字

- 如果在 HTML 中引入图片，但是打包完图片之后原 HTML 中的图片是找不到的，此时我们可以用 html-withimg-loader 来编译

  - 在这里可能会出一个问题 file-laoder 4.2 的时候是没有这个问题的，但是 file-loader 5.0 以上会出现，图片地址返回了一个对象
  - `<img src={"default":"3e5e5663e90681a73033ca3e3ac17655.png"} alt="">`
  - 此时我们需要在 file-laoder 中配置 options: {esModule: false} 便可以[解决这个问题](https://blog.csdn.net/qq_38702877/article/details/103384626)

  ```js
  {
    test: /\.(png|gif|jpg|bmp)$/,
    use: [{loader: 'file-loader', options: {esModule: false}}],
  }
  ```

### url-laoder

- 一般情况下图片处理不会使用 file-loader，我们一般使用 url-loader
- url-loader 可以做一个限制，当图片小于多少 k 的时候我们可以减少 http 请求，只用使用 base64 来转换图片，可用通过 name 来控制图片打包完后放到哪

```js
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
```

### 静态资源分离后图片地址对不上

- 当我们把 css、js、图片都分开打包放到不同的目录下面之后，发现了一个问题

  - css 中引入的背景图最后找图片去 css/ 目录下找 img 目录了所以图片找不到了
  - 此时我们可以在 MiniCssExtractPlugin.loader 中配置，publicPath 便可以[解决这个问题](https://blog.csdn.net/a806488840/article/details/80920291)

  ```js
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
  ```

### cdn 配置

- 假如项目中静态资源使用了 cdn，我们需要让项目中静态资源自动加上 cdn 的前缀，我们可以在 output.publicPath 中配置
- 如果只有图片配置了 cdn 我们可以在 url-loader 的 options 中单独配置 publicPath 字段
