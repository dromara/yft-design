import { CanvasElement } from '@/types/canvas'
import { Point } from 'fabric/fabric-impl'
import { customAlphabet } from 'nanoid'
import NP from 'number-precision'
NP.enableBoundaryChecking(false); // default param is true

export const getRandomNum = (min: number, max: number) => {
  return Math.random() * (max - min)
}

export const nonid = (num: number) => {
  return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')(num)
}

export const checkPointsEquals = (value1: Point[], value2: Point[]) => {
  if (!value1) return false
  if (value1.length !== value2.length) return false

  for (let i = 0; i < value1.length; i++) {
    if (value1[i].x !== value2[i].x || value1[i].y !== value2[i].y) return false
  }
  return true
}

// 是否https 等开头
export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const clamp = (value: number, minValue: number, maxValue: number) => {
  if (minValue > maxValue) {
    [minValue, maxValue] = [maxValue, minValue];
  }
  return Math.max(minValue, Math.min(value, maxValue));
}

// 校验是否移动端
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export const PiBy180 = Math.PI / 180
export const halfPI = Math.PI / 2



/**
 * Clamps the given 'angle' between '-180' and '180'
 * @param angle
 * @returns The clamped angle
 */
export const clampAngle = (angle: number): number => {
  const normalizedAngle = ((angle % 360) + 360) % 360
  const clampedAngle = normalizedAngle > 180 ? normalizedAngle - 360 : normalizedAngle
  return clampedAngle
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param {number} v - The number to round.
 * @param {number} [digits=2] - The number of decimal places to round to. Default is 2.
 * @returns {number} - The rounded number.
 */
export const toFixed = (v: number, digits = 2): number => NP.round(v, digits)


export const isBase64 = (str: string): boolean => {
  return /^data:image/.test(str);
}

/**
 * 从base64编码的图片中获取扩展名
 * @param {String} base64 
 * @returns 
 */
export const getBase64Type = (base64: string) => {
  const re = new RegExp('data:image/(?<ext>.*?);base64,.*')
  const res = re.exec(base64)
  if (res) {
    return res.groups?.ext
  }
  return ''
}

export const getLinkType = (url: string) => {
  const link = new URL(url)
  const path = link.pathname
  const extension = path.split('.')[-1];
  const jpgExtensions = ['jpg', 'jpeg'];
  const pngExtensions = ['png'];
 
  if (jpgExtensions.includes(extension)) {
    return 'jpg';
  }
 
  if (pngExtensions.includes(extension)) {
    return 'png';
  }

  return null;
}
