import { ImageHit } from "@/api/image/types"

export const enum ElementNames {
  TEXTBOX = 'textbox',
  TEXT = 'text',
  ITEXT = 'i-text',
  IMAGE = 'image',
  CROPIMAGE = 'cropimage',
  MASK = 'mask',
  PATH = 'path',
  RECT = 'rect',
  LINE = 'line',
  ARROW = 'arrow',
  POLYLINE = 'polyline',
  ELLIPSE = 'ellipse',
  QRCODE = 'qrcode',
  BARCODE = 'barcode',
  GROUP = 'group',
  ACTIVE = 'activeselection',
  CIRCLE = 'circle',
  GUIDELINE = 'guideline',
}

export interface ColorStop {
  color: string
  offset: number
  opacity?: number
}

/**
 * 形状渐变
 * 
 * type: 渐变类型（径向、线性）
 * 
 * color: 渐变颜色
 * 
 * rotate: 渐变角度（线性渐变）
 */
 export interface PathGradient {
  type: 'linear' | 'radial'
  name: string
  color: string[]
  rotate: number
}


export type LinePoint = '' | 'arrow' | 'dot' 

export interface LinePoolItem {
  path: string
  style: 'solid' | 'dashed'
  points: [LinePoint, LinePoint]
  isBroken?: boolean
  isCurve?: boolean
  isCubic?: boolean
}

export const enum ShapePathFormulasKeys {
  ROUND_RECT = 'roundRect',
  ROUND_RECT_DIAGONAL = 'roundRectDiagonal',
  ROUND_RECT_SINGLE = 'roundRectSingle',
  ROUND_RECT_SAMESIDE = 'roundRectSameSide',
  CUT_RECT_DIAGONAL = 'cutRectDiagonal',
  CUT_RECT_SINGLE = 'cutRectSingle',
  CUT_RECT_SAMESIDE = 'cutRectSameSide',
  MESSAGE = 'message',
  ROUND_MESSAGE = 'roundMessage',
  L = 'L',
  RING_RECT = 'ringRect',
  PLUS = 'plus',
  TRIANGLE = 'triangle',
  PARALLELOGRAM_LEFT = 'parallelogramLeft',
  PARALLELOGRAM_RIGHT = 'parallelogramRight',
  TRAPEZOID = 'trapezoid',
  BULLET = 'bullet',
  INDICATOR = 'indicator',
}

export interface PathPoolItem {
  viewBox: [number, number]
  path: string
  special?: boolean
  pathFormula?: ShapePathFormulasKeys
  outlined?: boolean
}

export interface PathListItem {
  type: string
  children: PathPoolItem[]
}

export interface verticalLine {
  x: number
  y1: number
  y2: number
}
export interface horizontalLine {
  y: number
  x1: number
  x2: number
}

// 边框矩形
export interface StrokeRect {
  x: number,
  y: number,
  w: number,
  h: number
}

export interface AngleRect {
  x: number
  y: number
  w: number
  h: number
}

export interface ElementStrokeRect {
  id: string
  strokeRect: StrokeRect
}

// 渐变背景填充坐标
export interface GradientCoords {
  x1: number
  y1: number
  x2: number
  y2: number,
  r1?: number,
  r2?: number
}

export interface PointElement {
  x: number,
  y: number
}

export const enum RightStates {
  ELEMENT_WORKER = 'design',
  ELEMENT_TEXT = 'text',
  ELEMENT_SVG = 'path',
  ELEMENT_IMAGE = 'image',
  ELEMENT_CODE = 'code',
  ELEMENT_STYLE = 'style',
  ELEMENT_POSITION = 'position',
}

// 底纹背景元素
export interface ShadingColorLib {
  title: string
  slug: string
  mode: string
  colors: number
  maxStroke: number
  maxScale: number
  maxSpacing: number[]
  width: number
  height: number
  vHeight: number
  tags?: string[]
  path: string
}

// 底纹背景填充
export interface ShadingBackground {
  id: number
  colors: string[]
  colorCounts: number
  stroke: number
  scale: number
  spacing: number[]
  angle: number
  join: number
  moveLeft: number
  moveTop: number
}

// 字体类型
export interface FontOption {
  label: string
  value: string
}

// 字体分组
export interface FontGroupOption {
  label: string
  options: FontOption[]
}

// 条形码参数
export interface BarCodeOption {
  format: string
  width?: number
  height?: number
  displayValue?: boolean   // 是否在条形码显示文字
  fontOptions?: string     // 设置条形码文本的粗体和斜体样式 bold / italic / bold italic
  font?: string            // 设置条形码显示文本的字体
  fontSize?: number        // 设置条形码文本的字体大小
  textAlign?: string       // 条形码文本的水平对齐方式，和css中的类似： left / center / right
  textPosition?: string    // 条形码文本的位置 bottom / top
  textMargin?: string      // 条形码文本 和 条形码之间的间隙大小
  background?: string      // 整个条形码容器的背景颜色
  lineColor?: string       // 条形码和文本的颜色
  margin?: number          // 整个条形码的外面距
  marginTop?: number       
  marginBottom?: number    
  marginLeft?: number      
  marginRight?: number    
}

export const enum AlignCommand {
  LEFT = 'left',
  RIGHT = 'right',
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  CENTER = 'center',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export const enum LayerCommand {
  UP = 'left',
  DOWN = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface ImageCategoryData {
  id: number
  type: string
  name: string
  category: ImageHit[]
  total: ImageHit[]
}