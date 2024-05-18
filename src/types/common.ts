export type ExportTypes = 'image' | 'pdf' | 'psd' | 'json' | 'svg' | ''
export type PoolType = 'editor' | 'template' | 'material' | 'text' | 'image' | 'illustration' | 'layer' | 'code' | 'toolkit' | 'help' | 'chatgpt'
export type SystemFont = {
  label: string
  value: string
}

export interface PathPoint {
  X: number
  Y: number
}

export interface EffectItem {
  id: string
  type: number
  isFill: boolean
  isStroke: boolean
  isSkew: boolean
  visible?: boolean
  stroke: string
  strokeWidth: number
  strokeLineJoin: "bevel" | "miter" | "round"
}