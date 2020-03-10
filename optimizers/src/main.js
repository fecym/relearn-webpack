// const btn = document.createElement('button')
// btn.addEventListener('click', () => {
//   console.log('点击了')
//   import('./source.js').then(res => {
//     console.log(res.default)
//   })
// })
// btn.innerHTML = 'hello'
// document.body.append(btn)

import str from './source';
console.log(str, module.hot)
if (module.hot) {
  module.hot.accept('./source.js', () => {
    // console.log('文件更新了')
    // 可以在模块更新做某些事
    const s = require('./source.js')
    console.log(s, '重新')
  })
}