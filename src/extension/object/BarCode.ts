import { Object as FabricObject, Image, classRegistry, ImageSource } from "fabric"
import { BarcodeProps } from "@/types/canvas"

export class BarCode extends Image {
  constructor(element: ImageSource, options?: FabricObject<BarcodeProps>) {
    super(element, { filters: [], ...options })
  }
}

classRegistry.setClass(BarCode, 'BarCode')