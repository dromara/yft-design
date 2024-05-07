export const THEME_TYPE = [
  {
    id: 0,
    theme: '',
  },
]

/**
* 范围随机整数
* @param min 最小数
* @param max 最大数
*/
export function ranInt(min: number, max: number) {
 return Math.floor(Math.random() * (max - min) + min);
}

/**
* 随机生成中文
* @param min 
* @param max 
*/
export function randomText(min: number, max: number) {
 const len = parseInt((Math.random() * max).toString()) + min;
 const base = 20000;
 const range = 1000;
 let str = '';
 let i = 0;
 while (i < len) {
   i++;
   const lower = parseInt((Math.random() * range).toString());
   str += String.fromCharCode(base + lower);
 }
 return str;
}