import { Object, Point } from 'fabric'

export interface CommenOption {
  id: string
  name: string
  fillType: number
  version: string
}

export interface TextboxOption extends Object, CommenOption {
  text: string
  path: null | string
  fontFamily: string
  fontWeight: string
  fontSize: number
  underline: boolean
  linethrough: false
  textAlign: string
  fontStyle: string
  lineHeight: 1.16
  textBackgroundColor: string
  charSpacing: 0
  direction: string
  isCheck?: boolean
}

export interface PathOption extends Object, CommenOption {
  path: string
}

export interface RectOption extends Object, CommenOption {
  width: number
  height: number
}

export interface PolygonOption extends Object, CommenOption {
  points: Point[]
}

export interface LineOption extends Object, CommenOption {
}

export interface CodeOption extends Object, CommenOption {
  src: string
  codeStyle: string 
  codeContent?: string
  codeSpace?: boolean
  codeError?: string
}

export interface ImageOption extends Object, CommenOption {
  src: string
  isCrop?: boolean
  originId?: string
  cropPath?: CanvasOption
  originLeft?: number
  originTop?: number
  originCropX?: number
  originCropY?: number
}

export interface GroupOption extends Object, CommenOption {
  layout: string
  subTargetCheck: boolean
  interactive: boolean
  isShow?: boolean
  objects: CanvasOption[]
}

export type CanvasOption = TextboxOption | PathOption | GroupOption | LineOption | CodeOption | ImageOption | RectOption