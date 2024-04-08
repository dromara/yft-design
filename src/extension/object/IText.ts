import { IText as OriginIText, classRegistry } from "fabric"

export class IText extends OriginIText {
  public strokes?: any[];

  constructor(text: string, options?: any) {
    super(text, options);
    this.strokes = options.strokes
  }

  _render(ctx: CanvasRenderingContext2D): void {
    super._render(ctx)
    if (this.strokes) {
      this.strokes.forEach((item) => {
        ctx.save();
        ctx.strokeStyle = item.stroke;
        ctx.lineWidth = item.strokeWidth;
        ctx.strokeText(this.text, -this.width / 2, 0);
        ctx.restore()
      })
    }
  }
}

classRegistry.setClass(IText, 'IText')