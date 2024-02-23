import { Object as FabricObject, Text, IText, Textbox, util, getEnv, Shadow, Point, config } from "fabric"

const getParentScaleX = (el: FabricObject): number => {
  return el.scaleX * (el.group ? getParentScaleX(el.group) : 1)//: this.canvas.viewportTransform[0])
}

export const ArcTextMixin: any = {
  optionsOrder: ["fontWeight", "fontStyle", "fontSize", "fontFamily", "styles", "width","height", "text",  "*"],
  minFontSize: 2,
  maxFontSize: 250,
  minLineHeight: 2,
  maxLineHeight: 200,

  maxStrokeWidth () {
    return Math.ceil(this.getFontSize() / 10);
  },

  addText(text: string, options: any) {
    let match = this.text.match(/\n/g);
    let lineIndex = match && match.length || 0;
    let charIndex = this.text.length - this.text.lastIndexOf("\n") - 1;

    if (!this.styles[lineIndex]) {
      this.styles[lineIndex] = {}
    }

    if (!this.styles[lineIndex][charIndex]) {
      this.styles[lineIndex][charIndex] = {}
    }
    Object.assign(this.styles[lineIndex][charIndex], options);
    this.text += text;
  },

  renderSelection(ctx: CanvasRenderingContext2D, boundaries: any) {
    let selectionStart = this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart,
      selectionEnd = this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd,
      isJustify = this.textAlign.indexOf('justify') !== -1,
      start = this.get2DCursorLocation(selectionStart),
      end = this.get2DCursorLocation(selectionEnd),
      startLine = start.lineIndex,
      endLine = end.lineIndex,
      startChar = start.charIndex < 0 ? 0 : start.charIndex,
      endChar = end.charIndex < 0 ? 0 : end.charIndex;

    for (let i = startLine; i <= endLine; i++) {
      let lineOffset = this._getLineLeftOffset(i) || 0,
        lineHeight = this.getHeightOfLine(i),
        realLineHeight = 0, boxStart = 0, boxEnd = 0;

      if (i === startLine) {
        boxStart = this.__charBounds[startLine][startChar].left;
        if(this.__lineInfo  && this.__lineInfo[i] && startChar!== 0){
          if(this.__lineInfo[i].renderedLeft){
            boxStart += this.__lineInfo[i].renderedLeft
          }
        }
      }

      if (i >= startLine && i < endLine) {
        boxEnd = isJustify && !this.isEndOfWrapping(i) ? this.width : this.getLineWidth(i) || 5; // WTF is this 5?
      }
      else if (i === endLine) {
        if (endChar === 0) {
          boxEnd = this.__charBounds[endLine][endChar].left;
        }
        else {
          let charSpacing = this._getWidthOfCharSpacing();
          boxEnd = this.__charBounds[endLine][endChar - 1].left + this.__charBounds[endLine][endChar - 1].width - charSpacing;
        }
        if(this.__lineInfo && this.__lineInfo[i]){
          if(this.__lineInfo[i].renderedLeft){
            boxEnd += this.__lineInfo[i].renderedLeft
          }
          if(endChar === this.__charBounds[endLine].length - 1){
            boxEnd += this.__lineInfo[i].renderedRight
          }
        }
      }
      realLineHeight = lineHeight;
      if (this.lineHeight < 1 || (i === endLine && this.lineHeight > 1)) {
        lineHeight /= this.lineHeight;
      }
      if (this.inCompositionMode) {
        ctx.fillStyle = this.compositionColor || 'black';
        ctx.fillRect(
          boundaries.left + lineOffset + boxStart,
          boundaries.top + boundaries.topOffset + lineHeight,
          boxEnd - boxStart,
          1);
      }
      else {
        ctx.fillStyle = this.selectionColor;
        ctx.fillRect(
          boundaries.left + lineOffset + boxStart,
          boundaries.top + boundaries.topOffset,
          boxEnd - boxStart,
          lineHeight);
      }
      boundaries.topOffset += realLineHeight;
    }
  },

  renderCursor (ctx: CanvasRenderingContext2D, boundaries: any) {
    let cursorLocation = this.get2DCursorLocation(),
      lineIndex = cursorLocation.lineIndex,
      charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
      charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
      multiplier = getParentScaleX(this) * this.canvas.getZoom(), //overriden
      cursorWidth = this.cursorWidth / multiplier,
      topOffset = boundaries.topOffset,
      dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY');

    topOffset += (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight - charHeight * (1 - this._fontSizeFraction);

    if (this.inCompositionMode) {
      this.renderSelection(ctx, boundaries);
    }

    let lineOffset = 0;
    if(this.__lineInfo  && this.__lineInfo[lineIndex]){
      if( cursorLocation.charIndex!== 0 && this.__lineInfo[lineIndex].renderedLeft){
        lineOffset += this.__lineInfo[lineIndex].renderedLeft
      }
    }
    ctx.fillStyle = this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
    ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
    ctx.fillRect(
      boundaries.left + boundaries.leftOffset - cursorWidth / 2 + lineOffset,
      topOffset + boundaries.top + dy,
      cursorWidth,
      charHeight
    )
  },

  setProperty(property: string, value: any) {
    this[property] = value
    this._textBeforeEdit = this.text;
  },

  _removeStyle(styleName: any) {
    for(let row in this.styles) {
      for (let index in this.styles[row]) {
        delete this.styles[row][index][styleName]
      }
    }
  },

  _removeStyleAt(propertyToRemove: any, index: number) {
    let loc = this.getStylePosition(index);
    if (!this._getLineStyle(loc.lineIndex) || !this._getStyleDeclaration(loc.lineIndex, loc.charIndex)) {
      return;
    }
    let style = this.styles[loc.lineIndex][loc.charIndex];
    delete style[propertyToRemove];
    if(!Object.keys(style).length ){
      delete this.styles[loc.lineIndex][loc.charIndex];
      if(!this.styles[loc.lineIndex].length ){
        delete this.styles[loc.lineIndex];
      }
    }
  },

  _modifyObjectStyleProperty(styleName: string, value: any) {
    let count = 0;
    for (let row in this.styles) {
      for (let index in this.styles[row]) {
        if (this.styles[row][index] === undefined || this.styles[row][index][styleName] === value){
          count++;
        }else{
          return;
        }
      }
    }
    if (count === this.text.length) {
      this._removeStyle(styleName);
      this[styleName] = value;
    }
  },

  setStyleInterval(styleName: string, value: any, start: number, end: number) {
    if (value === undefined || this[styleName] === value){
      for (let i = start; i < end; i++) {
        this._removeStyleAt(styleName,i);
      }
      this._forceClearCache = true;
    }else{
      this.setSelectionStyles({[styleName]: value}, start, end);
    }
    this._modifyObjectStyleProperty(styleName,value);
    this.setCoords();
    if(styleName === "fontFamily" && value && this.renderOnFontsLoaded){
      this.renderOnFontsLoaded([value])
    }
  },

  setStyle(styleName: string, value: any) {
    this.__selectionStart = this.selectionStart;
    this.__selectionEnd = this.selectionEnd;
    this.__changedProperty = styleName;
    if (this.setSelectionStyles && this.isEditing && this.selectionStart !== this.selectionEnd) {
      this.setStyleInterval(styleName, value,this.selectionStart,this.selectionEnd)
    }
    else {
      if (value !== undefined) {
        this._removeStyle(styleName);
        this.set(styleName,value)
      } else {
        this.set(styleName,value)
      }
      if (!this._textLines && this.ready) {
        this._clearCache();
        this._splitText();
      }
    }
    this.setCoords();
    if (this.caching) {
      this.dirty = true;
    }
    delete this.__changedProperty;
    delete this.__selectionStart;
    delete this.__selectionEnd;
  },

  generateTextStyle() {
    return {
      'font-style': this.getStyle('fontStyle'),
      'font-weight': this.getStyle('bold'),
      'text-decoration':
        ( this.getStyle('linethrough') ? 'line-through ' : '') +
        ( this.getStyle('overline') ? 'overline ' : '') +
        ( this.getStyle('underline') ? 'underline ' : '')
    }
  }
}