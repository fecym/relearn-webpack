import $ from 'jquery'
// 暴露给全局
// import $ from 'expose-loader?$!jquery'

console.log('hello cym')
require('./index.css')

require('@babel/polyfill')

let fn = () => {
  console.log('fn')
}
fn()

// @log
class Parent {
  constructor() {
    this.start()
  }
  start() {
    console.log('开始了')
  }
}

// function log(target) {
//   console.log(target)
// }

new Parent().start()

// class C {
//   @enumerable(false)
//   method() {}
// }

// function enumerable(value) {
//   return function(target, key, descriptor) {
//     descriptor.enumerable = value
//     return descriptor
//   }
// }

'aaa'.includes('a')

console.log($, '???', window.$)
