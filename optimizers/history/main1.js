import './index.css'
// import jquery from 'jquery'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const current = moment().endOf('day').fromNow()
console.log(current)
document.write('主页')
// document.write(jquery)


