/**
 * . -- 任意字符
 * + -- 一个或多个，即大于等于1
 * ? -- 如果前面是单个字符，则表示0或1个，即有有或没有
 *   -- 如果前面是连续匹配的多个字符，则表示匹配到的个数尽可能少
 */

//
export const pattern1 = /[?&]name=([^&]*)(&|$)/
// 匹配标签
export const regTag = /<text.+?<\/text>/
// 匹配标签内的内容
export const regContent = /(?<=>).+?(?=<)/

// 匹配两个字符之间的内容
// 因为match带分组的话，会匹配出每个分组的内容
export const reg1 = /a(\S*)b/
// const s = 'aasdfsdafsdfb'
// const result = s.match(reg1)
// if (result) {
//   result[1]
// }

// 匹配所有字符。 .* 不包括 \n
export const regAllCharacter = /---([\s\S]*)---$/m
