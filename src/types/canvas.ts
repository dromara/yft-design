import fabric from "fabric"
import JsBarcode from "jsbarcode"
import { CanvasOption } from "./option"
import { ColorStop } from "./elements"

export type TPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'

export const enum ImageFormat {
  jpeg = "jpeg",
  jpg = "jpeg",
  png = "png"
}
export interface CommenElement {
  id: string
  name: string
  version: string 
  left: number
  top: number
  fillType: number
  background?: BackgroundElement
  isRotate?: boolean
}
export interface GradientElement extends fabric.Gradient<'linear' | 'radial'> {
  gradientName: string
}

export interface Template {
  id: string
  version: string
  workSpace: WorkSpaceElement
  background?: string
  backgroundImage?: string
  zoom: number
  width: number
  height: number
  clip: number,
  objects: CanvasOption[]
}

export interface WorkSpaceElement {
  fill?: string | fabric.Gradient<'linear' | 'radial'> | fabric.Pattern
  left: number
  top: number
  fillType: number
  angle: number
  scaleX: number
  scaleY: number
  color?: string
  opacity?: number
  imageURL?: string
  imageSize?: 'cover' | 'contain' | 'repeat'
  gaidImageURL?: string
  gaidImageMode?: string
  shadingImageURL?: string
  gradientType?: 'linear' | 'radial'
  gradientName?: string
  gradientColor?: ColorStop[]
  gradientRotate?: number
  backgroundColor?: string
}

export interface BackgroundElement {
  fill: string | fabric.Gradient<'linear' | 'radial'> | fabric.Pattern
  color: string
  fillType: number
  opacity: number
  imageURL?: string
  imageSize?: 'cover' | 'contain' | 'repeat'
  gaidImageURL?: string
  gaidImageMode?: string
  shadingImageURL?: string
  gradientType?: 'linear' | 'radial'
  gradientName?: string
  gradientColor?: ColorStop[]
  gradientRotate?: number
  gradientOffsetX?: number
  gradientOffsetY?: number
  backgroundColor?: string
}

export interface TextboxElement extends fabric.Textbox, CommenElement {
  fontFamily: string
  color: string
  fillRepeat: TPatternRepeat
  fillURL: string
  isCheck?: boolean
}

export interface PathElement extends fabric.Path, CommenElement {
  fill: string | fabric.Gradient<'linear'> | fabric.Gradient<'radial'>
}

export interface RectElement extends fabric.Rect, CommenElement {

}

export interface LineElement extends fabric.Line, CommenElement {
  startStyle?: string | null
  endStyle?: string | null
}

export interface PolygonElement extends fabric.Polygon, CommenElement {

  points: fabric.Point[]
}

export interface QRCodeElement extends fabric.Image, CommenElement {
  codeStyle: string
  codeContent?: string
  codeSpace?: boolean
  codeError?: number
}

export interface BarCodeElement extends fabric.Image, CommenElement {
  codeContent: string
  codeOption: JsBarcode.BaseOptions     
}

export interface ImageElement extends fabric.Image, CommenElement {
  isCropping?: boolean
  originId?: string
  cropPath?: fabric.Object
  originLeft?: number
  originTop?: number
  originCropX?: number
  originCropY?: number
}

export interface CropElement extends fabric.Rect, CommenElement {
  imageId: string
}

export interface GroupElement extends fabric.Group, CommenElement {
  isShow?: boolean
  objects: CanvasOption[]
  _objects: CanvasElement[]
}

export type CanvasElement = TextboxElement | LineElement | QRCodeElement | BarCodeElement | ImageElement | PathElement | GroupElement | CropElement | PolygonElement | RectElement