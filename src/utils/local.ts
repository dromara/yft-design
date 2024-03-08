/*
 * @Author: June 1601745371@qq.com
 * @Date: 2024-03-08 10:48:02
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-03-08 10:48:19
 * @FilePath: \github\yft-design\src\utils\local.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * get localStorage 获取本地存储
 * @param { String } key
 */
export function getLocal(key: string) {
    if (!key) throw new Error('key is empty');
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}
  
/**
 * set localStorage 设置本地存储
 * @param { String } key
 * @param value
 */
export function setLocal(key: string, value: unknown) {
    if (!key) throw new Error('key is empty');
    if (!value) return;
    return localStorage.setItem(key, JSON.stringify(value));
}

/**
 * remove localStorage 移除某个本地存储
 * @param { String } key
 */
export function removeLocal(key: string) {
    if (!key) throw new Error('key is empty');
    return localStorage.removeItem(key);
}

/**
 * clear localStorage 清除本地存储
 */
export function clearLocal() {
    return localStorage.clear();
}
  