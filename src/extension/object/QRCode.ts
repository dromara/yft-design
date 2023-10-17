import { Object as FabricObject, Image, classRegistry, ImageSource } from "fabric"
import { QRCodeProps } from "@/types/canvas"

export class QRCode extends Image {
  constructor(element: ImageSource, options?: FabricObject<QRCodeProps>) {
    super(element, { filters: [], ...options })
  }
}

classRegistry.setClass(QRCode, 'QRCode')