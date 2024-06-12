import type { Gradient, Pattern, Textbox, SerializedImageProps, Path, Rect, Image, Point, Polygon, Group, Line, Object as FabricObject, ImageProps, IText, SerializedObjectProps } from "fabric"
import { ColorStop } from "./elements"
import JsBarcode from "jsbarcode"
import { EffectItem } from "./common"
export type LineOption = [number, number, number, number]
export type TPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
export type ImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
export type QRCodeType = 'A1' | 'A2' | 'A3' | 'SP1' | 'SP2' | 'SP3' | 'B1'| 'C1'| 'A_a1'| 'A_a2'| 'A_b1'| 'A_b2'
export interface QRCodeOption {
  codeStyle: QRCodeType
  codeSpace: boolean
  codeError: number
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
export interface GradientElement extends Gradient<'linear' | 'radial'> {
  gradientName: string
}



export interface Template {
  id: string
  version: string
  workSpace: WorkSpaceElement
  background?: string
  backgroundImage?: SerializedImageProps
  zoom: number
  width: number
  height: number
  clip: number,
  objects: SerializedObjectProps[]
}

export interface WorkSpaceElement {
  fill?: string | Gradient<'linear' | 'radial'> | Pattern
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
  fill: string | Gradient<'linear' | 'radial'> | Pattern
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

export interface TextboxElement extends Textbox, CommenElement {
  fontFamily: string
  color: string
  fillRepeat: TPatternRepeat
  fillURL: string
  editable: boolean
}

export interface ITextElement extends IText, CommenElement {
  fontFamily: string
  color: string
  fillRepeat: TPatternRepeat
  fillURL: string
  editable: boolean
}

export interface PathElement extends Path, CommenElement {
  fill: string | Gradient<'linear'> | Gradient<'radial'>
  type: string
}

export interface RectElement extends Rect, CommenElement {
  type: string
}

export interface LineElement extends Line, CommenElement {
  startStyle?: string | null
  endStyle?: string | null
  type: string
}

export interface PolygonElement extends Polygon, CommenElement {
  type: string
  points: Point[]
}

export interface QRCodeElement extends Image, CommenElement {
  type: string
  codeContent: string
  codeOption: QRCodeOption
}

export interface BarCodeElement extends Image, CommenElement {
  type: string
  codeContent: string
  codeOption: JsBarcode.BaseOptions     
}

export interface BarcodeProps extends ImageProps {
  type: string
  codeContent: string
  codeOption: JsBarcode.BaseOptions 
}

export interface QRCodeProps extends ImageProps {
  type: string
  codeContent: string
  codeOption: QRCodeOption
}

export interface ReferenceLineProps extends Line {
  type: string
  axis: 'horizontal' | 'vertical' | ''
}

export interface ImageElement extends SerializedImageProps, CommenElement {
  type: string
  effects?: EffectItem[]
  pixiFilters?: any[]
  mask?: FabricObject
  originSrc?: string 
  isCropping?: boolean
  originId?: string
  cropPath?: FabricObject
  originLeft?: number
  originTop?: number
  originCropX?: number
  originCropY?: number
}


export interface GroupElement extends Group, CommenElement {
  type: string
  isShow: boolean
  objects: FabricObject[]
  _objects: FabricObject[]
}

export type CanvasElement = TextboxElement | LineElement | QRCodeElement | BarCodeElement | ImageElement | PathElement | GroupElement | PolygonElement | RectElement