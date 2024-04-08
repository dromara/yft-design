import { IText as OriginIText, classRegistry } from "fabric"

export class IText extends OriginIText {
  public strokes?: any[];

  constructor(text: string, options?: any) {
    super(text, options);
    this.strokes = options.strokes
  }

  _render(ctx: CanvasRenderingContext2D): void {
    super._render(ctx)
    console.log('this.strokes:', this.strokes)
    if (this.strokes) {
      console.log('this.strokes:', this.strokes)
      this.strokes.forEach((item) => {
        ctx.save();
        ctx.strokeStyle = item.stroke;
        ctx.lineWidth = item.strokeWidth;
        ctx.strokeText(this.text, this.left, this.top);
        ctx.restore()
      })
    }
  }
}

classRegistry.setClass(IText, 'IText')