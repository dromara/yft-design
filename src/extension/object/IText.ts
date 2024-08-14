import { IText as OriginIText, classRegistry, Text } from "fabric"
import { EffectItem } from "@/types/common"
import type { Abortable } from 'fabric'
import { CENTER, RIGHT, LEFT, DEFAULT_SVG_FONT_SIZE } from "../constants"

export class IText extends OriginIText {
  public effects?: EffectItem[];

  constructor(text: string, options?: any) {
    super(text, options);
    this.effects = options.effects
  }

  renderEffects() {
    console.log('renderEffects:')
    this.canvas?.renderAll()
  }

  _renderChar(method: "fillText" | "strokeText", ctx: CanvasRenderingContext2D, lineIndex: number, charIndex: number, _char: string, left: number, top: number): void {
    if (this.effects) {
      // for (let i = 0; i < this.effects.length; i++) {
      for (let i = this.effects.length - 1; i >= 0; i--) {
        const item = this.effects[i]
        ctx.save();
        ctx.strokeStyle = item.stroke;
        ctx.lineJoin = item.strokeLineJoin;
        ctx.lineWidth = item.strokeWidth;
        ctx.strokeText(_char, left, top);
        ctx.restore()
      }
    }
    super._renderChar(method, ctx, lineIndex, charIndex, _char, left, top)
  }

}

classRegistry.setClass(IText)
classRegistry.setSVGClass(IText)