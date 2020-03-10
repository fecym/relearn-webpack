import calc from './test-own'

// console.log(calc)
// console.log(calc.sum(1, 2))

// 作用域提升

let a = 1
let b = 2
let c = 3
let d = a + b + c
// 在 webpack 中会自动省略，可以简化代码
console.log(d, '-----------')
