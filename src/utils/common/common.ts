import { padStart } from 'lodash'
/**
 * 1. 随机颜色
 * 2. 图片转成 Base64
 */

export function randomColor() {
  return `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0')}`
}
/** 图片转成base64 */
export function imgTransformBase64(imgUrl: string) {
  return new Promise((resolve) => {
    window.URL = window.URL || window.webkitURL
    const xhr = new XMLHttpRequest()
    xhr.open('get', imgUrl, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status === 200) {
        // 得到一个blob对象
        const blob = this.response
        // 至关重要
        const oFileReader = new FileReader()
        oFileReader.readAsDataURL(blob)
        oFileReader.onloadend = function (e) {
          // 此处拿到的已经是base64的图片了,可以赋值做相应的处理
          if (e.target)
            resolve(e.target.result)
        }
      }
    }
    xhr.send()
  })
}


/**
 * 补足数字位数
 * @param digit 数字
 * @param len 位数
 */
export const fillDigit = (digit: number, len: number) => {
  return padStart('' + digit, len, '0')
}

/**
 * 判断设备
 */
export const isPC = () => {
  return !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Mobile|BlackBerry|Symbian|Windows Phone)/i)
}