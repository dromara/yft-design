import { Object as FabricObject, Rect as OriginRect, classRegistry, Image } from "fabric"
import { RecrProps } from "@/types/canvas"
import usePixi from '@/views/Canvas/usePixi'

export class Rect extends OriginRect {

  public mask?: Image 

  constructor(options: RecrProps) {
    super(options)
  }

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx)
    if (this.mask) {
      const image = this.canvas?.toDataURL()
      const [ pixi ] = usePixi()
      pixi.postMessage({
        id: this.id,
        type: "mask", 
        mask: JSON.stringify(this.mask), 
        width: this.width, 
        height: this.height
      });
    }
  }
}

classRegistry.setClass(Rect, 'Rect')