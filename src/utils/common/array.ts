// 1. 给定范围内的随机数 getRandom(70, 80)
export const getRandom = (n: number, m: number) => Math.floor(Math.random() * (m - n + 1) + n)

// 生成 100 长度的数组
export function createArr(defaultParams = 'Tom') {
  const allItems = Array.from(Array(100).keys(), (item) => {
    return { defaultParams, idx: item }
  })
  // const fillArr = new Array(10).fill({ defaultParams })
  return allItems
}

// 获取数组的最深层级
export const getLevel = (list: any) => {
  let max = 0
  const stack = [list]
  while (stack.length > 0) {
    const data = stack.pop()
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (Array.isArray(item)) {
        (item as any).level = (data.level || 1) + 1
        max = Math.max((item as any).level, max)
        stack.push(item)
      }
    }
  }
  return max
}

// // 树形数组平铺
// export const treeToArr = (arr: any) => {
//   const result = []
//   let node: any[] = []
//   node = node.concat(arr)
//   while (node.length) {
//     const first = node.shift() // 每一次都取node的第一项出来
//     if (first.children) {
//       node = node.concat(first.children) // 如果第一项有children属性，那么就把这个children放到node的最后一项取
//       delete first.children // 然后再删除children属性，让第一项变成普通形式{name: xxx, id: xxx}
//     }
//     // result.push(first)
//   }
//   return result
// }
