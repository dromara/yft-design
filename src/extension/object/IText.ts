import { IText as OriginIText, classRegistry } from "fabric"

export class IText extends OriginIText {
  public strokes?: any[];

  constructor(text: string, options?: any) {
    super(text, options);
    this.strokes = options.strokes
  }

  _renderChar(method: "fillText" | "strokeText", ctx: CanvasRenderingContext2D, lineIndex: number, charIndex: number, _char: string, left: number, top: number): void {
    super._renderChar(method, ctx, lineIndex, charIndex, _char, left, top)
    if (this.strokes) {
      for (let i = 0; i < this.strokes.length; i++) {
        const item = this.strokes[i]
        ctx.save();
        ctx.strokeStyle = item.stroke;
        ctx.lineWidth = item.strokeWidth;
        ctx.strokeText(_char, left, top);
        ctx.restore()
      }
    }
  }

}

classRegistry.setClass(IText, 'IText')