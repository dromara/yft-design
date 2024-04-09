import { Object as FabricObject, Textbox as OriginTextbox, classRegistry, ImageSource } from "fabric"

export class Textbox extends OriginTextbox {

  public strokes?: any[];

  constructor(text: string, options?: any) {
    super(text, options);
    this.strokes = options.strokes
  }

  enlargeSpaces() {
    let diffSpace,
      currentLineWidth,
      numberOfSpaces,
      accumulatedSpace,
      line,
      charBound,
      spaces;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (this.textAlign !== 'justify' && (i === len - 1 || this.isEndOfWrapping(i))) {
        continue;
      }
      accumulatedSpace = 0;
      line = this._textLines[i];
      currentLineWidth = this.getLineWidth(i);
      if (currentLineWidth < this.width && (spaces = this.textLines[i].split(''))) {
        
        numberOfSpaces = spaces.length - 1;
        diffSpace = (this.width - currentLineWidth) / numberOfSpaces;
        for (let j = 0; j <= line.length; j++) {
          charBound = this.__charBounds[i][j];
          charBound.width += diffSpace;
          charBound.kernedWidth += diffSpace;
          charBound.left += accumulatedSpace;
          accumulatedSpace += diffSpace;
        }
      }
    }
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

classRegistry.setClass(Textbox, 'Textbox')