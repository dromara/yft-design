import { LinePoint } from '@/types/elements'
import { XY } from 'fabric'


export interface LinePoolItem {
  path: string
  style: 'solid' | 'dashed'
  points: [LinePoint, LinePoint]
  data: XY[]
  isBroken?: boolean
  isCurve?: boolean
  isCubic?: boolean
}

interface PresetLine {
  type: string
  children: LinePoolItem[]
}

export const PathLineLibs: PresetLine[] = [
  {
    type: '直线',
    children: [
      { path: 'M 0 0 L 20 20', style: 'solid', points: ['', ''], data: [{x: 0, y: 0}, {x: 200, y: 0}] },
      { path: 'M 0 0 L 20 20', style: 'dashed', points: ['', ''], data: [{x: 0, y: 0}, {x: 200, y: 0}] },
      { path: 'M 0 0 L 20 20', style: 'solid', points: ['', 'arrow'], data: [{x: 0, y: 0}, {x: 200, y: 0}] },
      { path: 'M 0 0 L 20 20', style: 'dashed', points: ['', 'arrow'], data: [{x: 0, y: 0}, {x: 200, y: 0}] },
      { path: 'M 0 0 L 20 20', style: 'solid', points: ['', 'dot'], data: [{x: 0, y: 0}, {x: 200, y: 0}] },
    ],
  },
  {
    type: '折线、曲线',
    children: [
      { path: 'M 0 0 L 0 20 L 20 20', style: 'solid', points: ['', 'arrow'], isBroken: true, data: [{x: 0, y: 0}, {x: 0, y: 100}, {x: 200, y: 100}] },
      { path: 'M 0 0 Q 0 20 20 20', style: 'solid', points: ['', 'arrow'], isCurve: true, data: [{x: 0, y: 0}, {x: 200, y: 0}] },
      { path: 'M 0 0 C 20 0 0 20 20 20', style: 'solid', points: ['', 'arrow'], isCubic: true, data: [{x: 0, y: 0}, {x: 200, y: 0}] },
    ],
  },
]