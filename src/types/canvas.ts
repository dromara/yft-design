import { Gradient, Pattern, Textbox, Path, Rect, Image, Point, Polygon, Group, Line, Object as FabricObject, ImageProps } from "fabric"
import { ColorStop } from "./elements"
import JsBarcode from "jsbarcode"
export type LineOption = [number, number, number, number]
export type TPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
export type ImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
export interface QRCodeOption {
  codeStyle: string
  codeSpace?: boolean
  codeError?: number
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
  backgroundImage?: string
  zoom: number
  width: number
  height: number
  clip: number,
  objects: FabricObject[]
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
  isCheck?: boolean
}

export interface PathElement extends Path, CommenElement {
  fill: string | Gradient<'linear'> | Gradient<'radial'>
}

export interface RectElement extends Rect, CommenElement {

}

export interface LineElement extends Line, CommenElement {
  startStyle?: string | null
  endStyle?: string | null
}

export interface PolygonElement extends Polygon, CommenElement {

  points: Point[]
}

export interface QRCodeElement extends Image, CommenElement {
  codeContent: string
  codeOption: QRCodeOption
}

export interface BarCodeElement extends Image, CommenElement {
  codeContent: string
  codeOption: JsBarcode.BaseOptions     
}

export interface BarcodeProps extends ImageProps {
  codeContent: string
  codeOption: JsBarcode.BaseOptions 
}

export interface QRCodeProps extends ImageProps {
  codeContent: string
  codeOption: QRCodeOption
}

export interface ImageElement extends Image, CommenElement {
  isCropping?: boolean
  originId?: string
  cropPath?: FabricObject
  originLeft?: number
  originTop?: number
  originCropX?: number
  originCropY?: number
}

export interface CropElement extends Rect, CommenElement {
  imageId: string
}

export interface GroupElement extends Group, CommenElement {
  isShow: boolean
  objects: FabricObject[]
  _objects: FabricObject[]
}

export type CanvasElement = TextboxElement | LineElement | QRCodeElement | BarCodeElement | ImageElement | PathElement | GroupElement | CropElement | PolygonElement | RectElement