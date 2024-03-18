import { Object as FabricObject, Textbox as OriginTextbox, classRegistry, ImageSource } from "fabric"

export class Textbox extends OriginTextbox {

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
}

classRegistry.setClass(Textbox, 'Textbox')