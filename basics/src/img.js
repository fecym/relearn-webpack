const fn = () => {
  console.log('你好')
}

fn()

import './index.css'

// 这么引入是可以的，但是我们需要使用一个 file-loader 来处理文件，file-loader 会在内部生成一张图片到 build 目录下
// 并且把生成的名字保存下来
import Ionc1 from './img/icon1.png'

// 直接这么写是不会处理的，根本找不到图片
const img = new Image()
// img.src = './img/icon1.png'
// img.src = require('./img/icon1.png')
img.src = Ionc1
document.body.appendChild(img)
