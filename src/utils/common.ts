import { CanvasElement } from '@/types/canvas'
import { Point } from 'fabric/fabric-impl'
import { customAlphabet } from 'nanoid'

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

// 校验元素坐标
export const checkElementCoords = (element: CanvasElement) => {
  return typeof element.left === 'number' && typeof element.top === 'number'
}

// 
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