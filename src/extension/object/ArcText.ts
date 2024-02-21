
import '../mixins/arctext.mixin'
import { IText, Textbox as OriginTextbox, Control, controlsUtils, classRegistry, Transform, TPointerEvent, TSVGReviver, util, Point, TMat2D } from 'fabric'
import { sectorBoundingBox } from '@/utils/geometry'
export class Textbox extends OriginTextbox {
  public curvature = 0
  public radius = 66
  public textRenders: any
  private __isMousedown: boolean = false
  private _linesRads: number[] = []
  private __lineInfo: any = []
  public _contentOffsetX: number = 0
  public _contentOffsetY: number = 0
  private _curvingCenter: any
  private _specialArray = []
  private _translatedX: number = 0
  private _translatedY: number = 0
  public useRenderBoundingBoxes: any
  private _charTransformations: any = []
  constructor(text: string, options: any) {
    super(text, options)
  }

  createCurvatureControl() {
    this.controls.c = new Control({
      x: 0,
      y: 0,
      offsetX: 0,
      actionHandler: this.changeCurvature,
      cursorStyle: 'pointer',
      actionName: 'resizing',
    })

    this.on("scaling", this.updateCurvingControl)
  }

  public get __curvature() {
    return this.curvature
  }

  public set __curvature(value) {
    this.curvature = value
    if (this.__curvature) this.createCurvatureControl()
  }

  updateCurvingControl () {
    if (this.controls.c) {
      this.controls.c.offsetX =  -this._contentOffsetX * this.scaleX
      this.controls.c.offsetY = (this._curvingCenter.y - this._contentOffsetY)  * this.scaleY
      this.canvas && this.setCoords()
    }
  }

  changeCurvature (eventData: TPointerEvent, transform: Transform, x: number, y: number) {
    const target = transform.target as Textbox;
    let localPoint = controlsUtils.getLocalPoint(transform, transform.originX, transform.originY, x, y),
      strokePadding = target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
      multiplier = transform.originY === 'center' ? 2 : 1,
      cy = (localPoint.y + target.controls[transform.corner].offsetY - target.height / 2 + target._contentOffsetY ) * multiplier / target.scaleY - strokePadding;
  
    let textHeight = target.calcTextHeight();
  
    let radius;
    if(Math.abs(cy) <= textHeight / 2){
      radius = 0;
    }
    else{
      radius = cy > 0 ? cy - textHeight / 2 : cy  +textHeight / 2;
    }
  
    target.set(radius)
    return false
  }

  renderCharCallback(method, ctx, lineIndex, charIndex, endCharIndex, left, top, fullDecl) {
    for (let index = charIndex; index <= endCharIndex; index++) {
      let tr = this._charTransformations[lineIndex][index];
      if (ctx) ctx.textAlign = "center"
      if (tr.char) {
        let angle = this.curvature > 0 ? -tr.charAngle : -tr.charAngle - Math.PI
        if(tr.contour && fullDecl.contourStroke){
          ctx.save();
          ctx.lineWidth = fullDecl.contourStrokeWidth
          ctx.strokeStyle = fullDecl.contourStroke
          ctx.beginPath()
          ctx.moveTo(tr.contour.tl.x,tr.contour.tl.y)
          ctx.lineTo(tr.contour.tr.x,tr.contour.tr.y)
          ctx.lineTo(tr.contour.br.x,tr.contour.br.y)
          ctx.lineTo(tr.contour.bl.x,tr.contour.bl.y)
          ctx.closePath()
          ctx.stroke()
          ctx.restore()
        }
        this.runCharRendering(method, ctx, tr.char, tr.cl.x, tr.cl.y, angle, fullDecl, "center");
      }
    }
  }

  runCharRendering(method: any, ctx: CanvasRenderingContext2D, _char: string, left: number, top: number, angle: number, fullDecl: any, alignment: any){
    if(ctx){
      ctx.save();
      ctx.translate(left, top)
      ctx.rotate(angle)
    }
    for(let i in this.textRenders){
      let result = this[this.textRenders[i]](method, ctx, _char, fullDecl, alignment, left, top, angle)
      if (result === true)break;
    }
    if(ctx) {
      ctx.restore()
    }
  }

  getSelectionStartFromPointer(e: TPointerEvent): number {
    const mouseOffset = this.canvas!.getPointer(e)
      .transform(util.invertTransform(this.calcTransformMatrix()))
      .add(new Point(-this._getLeftOffset(), -this._getTopOffset()));

    let relX = mouseOffset.x + (-this.width / 2 + this._contentOffsetX) * this.scaleX,
      relY = mouseOffset.y + (-this.height / 2 - this._curvingCenter.y + this._contentOffsetY) * this.scaleY,
      angle = Math.atan2(-relX, -relY),
      radius = Math.sqrt(relX * relX + relY * relY) / this.scaleY,
      selectedLine = 0;

    if (this.curvature > 0) {
      while (radius < this._linesRads[selectedLine]) {
        selectedLine++;
      }
    } else {
      if (angle < 0) angle += Math.PI * 2
      while (radius > this._linesRads[selectedLine]) {
        selectedLine++;
      }
    }
    if(selectedLine >= this._textLines.length){
      selectedLine = this._textLines.length - 1
    }

    let charIndex = 0;
    for (let i = 0; i < selectedLine; i++) {
      charIndex += this._textLines[i].length + this.missingNewlineOffset(i);
    }

    let specials = this._specialArray && this._specialArray[selectedLine]
    let specialsLen = 0;
    let diff = Infinity, diff2, j
    for (j = 0; j < this._charTransformations[selectedLine].length; j++) {
      if (specials && specials[j] && specials[j] === specials[j - 1] || this._charTransformations[selectedLine][j].isDiacritic) {
        specialsLen++
        continue;
      }
      diff2 = Math.abs(this._charTransformations[selectedLine][j].leftAngle - angle) % (Math.PI * 2)
      if (diff < diff2) {
        let result = charIndex + j - 1 - specialsLen
        specialsLen = 0;
        return result;
      }
      diff = diff2
      specialsLen = 0;
    }
    return charIndex + j - 1;
  }

   _getArcTextLineLeftOffset(lineIndex: number, width: number): number {
    if (!width) return 0;
    let lineWidth = this.getLineWidth(lineIndex);
    if (this.textAlign === 'center') return (width - lineWidth) / 2;
    if (this.textAlign === 'right') return width - lineWidth;
    if (this.textAlign === 'justify-center' && this.isEndOfWrapping(lineIndex)) return (width - lineWidth) / 2;
    if (this.textAlign === 'justify-right' && this.isEndOfWrapping(lineIndex)) return width - lineWidth;
    return 0;
  }

  _renderTextDecoration(ctx: CanvasRenderingContext2D, type: any) {
    if (!this.get(type) && !this.styleHas(type)) {
      return;
    }
    let currentFill, _size, size, dy, _dy, lastFill, line, lastDecoration, charStart, currentDecoration;
    ctx.save()
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (!this.type && !this.styleHas(type, i)) {
        continue;
      }
      charStart = 0
      lastDecoration = this.getValueOfPropertyAt(i, 0, type);
      lastFill = this.getValueOfPropertyAt(i, 0, 'fill');
      size = this.getHeightOfChar(i, 0);
      dy = this.getValueOfPropertyAt(i, 0, 'deltaY');
      let j;
      for (j = 0; j < this._textLines[i].length; j++) {
        currentDecoration = this.getValueOfPropertyAt(i, j, type);
        currentFill = this.getValueOfPropertyAt(i, j, 'fill');
        _size = this.getHeightOfChar(i, j);
        _dy = this.getValueOfPropertyAt(i, j, 'deltaY');

        if (currentDecoration !== lastDecoration || currentFill !== lastFill || _size !== size || _dy !== dy) {

          if (lastDecoration && lastFill) {
            let offset = this.offsets[type] * size + dy
            this._drawTextLinesDecorationSector(ctx, lastFill, offset, i, charStart, j)
          }

          lastDecoration = currentDecoration;
          lastFill = currentFill;
          size = _size;
          dy = _dy;
          charStart = j;
        }
      }
      if (currentDecoration && currentFill) {
        let offset = this.offsets[type] * size + dy
        this._drawTextLinesDecorationSector(ctx, currentFill, offset, i, charStart, j)
      }
    }
    ctx.restore()
    this._removeShadow(ctx);
  }
  
  enArcLargeSpaces(width: number) {

    let diffSpace, currentLineWidth, numberOfSpaces, accumulatedSpace, line, charBound, spaces;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (this.textAlign !== 'justify' && (i === len - 1 || this.isEndOfWrapping(i))) {
        continue;
      }
      accumulatedSpace = 0;
      line = this._textLines[i];
      currentLineWidth = this.getLineWidth(i);
      if (currentLineWidth < width && (spaces = this.textLines[i].match(this._reSpacesAndTabs))) {
        numberOfSpaces = spaces.length;
        diffSpace = (width - currentLineWidth) / numberOfSpaces;
        for (let j = 0, jlen = line.length; j <= jlen; j++) {
          charBound = this.__charBounds[i][j];
          if (this._reSpaceAndTab.test(line[j])) {
            charBound.width += diffSpace;
            charBound.kernedWidth += diffSpace;
            charBound.left += accumulatedSpace;
            accumulatedSpace += diffSpace;
          } else {
            charBound.left += accumulatedSpace;
          }
        }
      }
    }
  }

  _getBaseLine(styleFontSize = 1) {
    return (this.lineHeight * this.fontSize) -0.9 * styleFontSize
  }

  _translate(leftOverflow: number, topOverflow: number){
    let rad = util.degreesToRadians(this.angle);
    this.top -= (topOverflow - this._translatedY) * Math.cos(rad) *  this.scaleY;
    this.left += (topOverflow - this._translatedY)  * Math.sin(rad)* this.scaleY;
    this.top -= (leftOverflow - this._translatedX) * Math.sin(rad) *  this.scaleX;
    this.left -= (leftOverflow - this._translatedX)  * Math.cos(rad)* this.scaleX;
    this._translatedY = topOverflow
    this._translatedX = leftOverflow
  }

  _splitText() {
    let text = this.text
    let newLines = this._splitTextIntoLines(text);
    this.textLines = newLines.lines;
    this._textLines = newLines.graphemeLines;
    this._unwrappedTextLines = newLines._unwrappedLines;
    this._text = newLines.graphemeText;

    if(this.useRenderBoundingBoxes){
      this.__lineInfo = []
    }
    return newLines;
  }

  setTextTransform(value) {
    this.textTransform = value
    this.setText(this.text)
    this.dirty = true
    this.initDimensions()
    this.canvas && this.canvas.requestRenderAll()
  }

  setText(value: string) {
    this.setProperty('text', "" + value);
  }

  setProperty(property: any, value: any) {
    this[property] = value
    this._textBeforeEdit = this.text;
  }

  initDimensions() {
    this._splitText();
    this._clearCache();
    for (let li = 0, len = this._textLines.length; li < len; li++) {
      this.getLineWidth(li);
      this.getHeightOfLine(li);
    }
    let textHeight = this.calcTextHeight();
    let textWidth = this.calcTextWidth();
    this.radius = 10000 / (this.curvature || 1)

    let cx = 0,
      cy = this.curvature > 0 ? textHeight / 2 + this.radius : -textHeight / 2 + this.radius
    this._curvingCenter = {x: cx, y: cy}

    let globalOffset
    if (this.curvature > 0) {
      globalOffset = textHeight
    } 
    else {
      globalOffset = 0
    }

    this._linesRads = []

    if (this.textAlign.indexOf('justify') !== -1) {
      this.enArcLargeSpaces(textWidth);
    }

    //calculate curving

    let cts: any[] = this._charTransformations = []

    let yMin = Infinity, yMax = -Infinity, xMin = Infinity, xMax = -Infinity

    for(let i = 0; i < this.__charBounds.length; i++) {
      cts[i] = []
      let row = this.__charBounds[i]

      let currentLeft = -textWidth / 2 + this._getArcTextLineLeftOffset(i, textWidth)

      if (this.__lineInfo) {
        currentLeft += this.__lineInfo[i].renderedLeft
      }

      let heightOfLine = this.getHeightOfLine(i);
      let charOffset = (heightOfLine - heightOfLine / this.lineHeight) + heightOfLine * this._fontSizeFraction / this.lineHeight

      if (this.curvature > 0) {
        globalOffset -= heightOfLine
      } else {
        globalOffset += heightOfLine
      }
      let rowOffset = Math.abs(this.radius) + globalOffset;

      this._linesRads.push(rowOffset)

      for (let j = 0; j < row.length; j++) {
        let bounds = row[j]
        let decl = this.getCompleteStyleDeclaration(i, j);
        let deltaY = decl && decl.deltaY || 0

        let bottomRadius, topRadius, charRadius, lineRadius, leftAngle, charAngle, rightAngle, renderLeftAngle, renderRightAngle;

        if (this.curvature > 0) {
          bottomRadius = deltaY + rowOffset
          topRadius = deltaY + rowOffset + heightOfLine
          charRadius = deltaY + rowOffset + charOffset
          lineRadius = deltaY + rowOffset + heightOfLine - (heightOfLine / this.lineHeight)

          let midRadius = (bottomRadius * 3 + topRadius * 2) / 5
          leftAngle = -(currentLeft + bounds.left) / midRadius
          rightAngle = -(currentLeft + bounds.left + bounds.width) / midRadius
          charAngle = -(currentLeft + bounds.left + bounds.width / 2) / midRadius

        } else {
          bottomRadius = deltaY + rowOffset
          topRadius = deltaY + rowOffset - heightOfLine
          charRadius = deltaY + rowOffset - charOffset
          lineRadius = deltaY + rowOffset - heightOfLine + (heightOfLine / this.lineHeight)

          let midRadius = (bottomRadius * 2 + topRadius * 3) / 5
          leftAngle = Math.PI + (currentLeft + bounds.left) / midRadius
          rightAngle = Math.PI + (currentLeft + bounds.left + bounds.width) / midRadius
          charAngle = Math.PI + (currentLeft + bounds.left + bounds.width / 2) / midRadius
        }

        let rsin = Math.sin(rightAngle),
          rcos = Math.cos(rightAngle),
          lsin = Math.sin(leftAngle),
          lcos = Math.cos(leftAngle),
          csin = Math.sin(charAngle),
          ccos = Math.cos(charAngle)

        let ct = {
          contour: bounds.contour && {
            x: bounds.contour.x * decl.fontSize,
            w: bounds.contour.w * decl.fontSize,
            h: bounds.contour.h * decl.fontSize,
            y: this._getBaseLine(decl.fontSize) + bounds.contour.y * decl.fontSize!
          },
          char: this._textLines[i][j],
          charAngle,
          leftAngle,
          rightAngle,
          charRadius,
          bottomRadius,
          topRadius,
          lineRadius,
          renderLeftAngle,
          renderRightAngle,
          bl: {x: cx - bottomRadius * lsin, y: cy - bottomRadius * lcos},
          br: {x: cx - bottomRadius * rsin, y: cy - bottomRadius * rcos},
          tl: {x: cx - topRadius * lsin, y: cy - topRadius * lcos},
          tr: {x: cx - topRadius * rsin, y: cy - topRadius * rcos},
          nl: {x: cx - lineRadius * lsin, y: cy - lineRadius * lcos},
          nr: {x: cx - lineRadius * rsin, y: cy - lineRadius * rcos},
          cl: {x: cx - charRadius * csin, y: cy - charRadius * ccos},
          lc: {x: cx - lineRadius * csin, y: cy - lineRadius * ccos}
        }

        if(ct.char?.trim() && bounds.contour) {
          let cos = util.cos(-charAngle), sin = util.sin(-charAngle);

          let rotateMatrix = [cos, sin, -sin, cos, 0, 0]
          let matrix = util.multiplyTransformMatrices([1, 0, 0, 1, ct.lc.x, ct.lc.y], rotateMatrix as TMat2D);
          let y = ct.contour.y
          if (this.curvature > 0) {
            let x = ct.contour.x - this.__charBounds[i][j].width / 2
            ct.contour.br = util.transformPoint({x: x + ct.contour.w, y: -y}, matrix);
            ct.contour.bl = util.transformPoint({x: x, y: -y}, matrix);
            ct.contour.tl = util.transformPoint({x: x, y: -y - ct.contour.h}, matrix);
            ct.contour.tr = util.transformPoint({x: x + ct.contour.w, y: -y - ct.contour.h}, matrix);
          } else {
            let x = - ct.contour.x + this.__charBounds[i][j].width / 2

            ct.contour.br = util.transformPoint({x: x - ct.contour.w, y: y}, matrix);
            ct.contour.bl = util.transformPoint({x: x, y: y}, matrix);
            ct.contour.tl = util.transformPoint({x: x, y: y + ct.contour.h}, matrix);
            ct.contour.tr = util.transformPoint({x: x - ct.contour.w, y: y + ct.contour.h}, matrix);
          }


          xMin = Math.min(xMin, ct.contour.br.x, ct.contour.bl.x, ct.contour.tl.x, ct.contour.tr.x)
          xMax = Math.max(xMax, ct.contour.br.x, ct.contour.bl.x, ct.contour.tl.x, ct.contour.tr.x)
          yMin = Math.min(yMin, ct.contour.br.y, ct.contour.bl.y, ct.contour.tl.y, ct.contour.tr.y)
          yMax = Math.max(yMax, ct.contour.br.y, ct.contour.bl.y, ct.contour.tl.y, ct.contour.tr.y)

        }

        cts[i][j] = ct
      }
    }

    // this._linesBboxes = []
    for(let i = 0; i< cts.length; i++) {
      let ctsl = cts[i] as any, cta = ctsl[0], ctb = ctsl[ctsl.length - 1], bbox, bbox2

      if (this.curvature > 0) {
        bbox = sectorBoundingBox(cta.tl, ctb.tr, this._curvingCenter, this._linesRads[i] + this.__lineHeights[i])
        bbox2 = sectorBoundingBox(cta.nl, ctb.nr, this._curvingCenter, this._linesRads[i])
      }
      else{
        bbox = sectorBoundingBox(ctb.tr, cta.tl, this._curvingCenter, this._linesRads[i] - this.__lineHeights[i])
        bbox2 = sectorBoundingBox(ctb.nr, cta.nl, this._curvingCenter, this._linesRads[i])
      }
      // this._linesBboxes.push(bbox,bbox2)

      xMin = Math.min(xMin, bbox.x, bbox2.x)
      xMax = Math.max(xMax, bbox.x+ bbox.width, bbox2.x + bbox2.width)
      yMin = Math.min(yMin, bbox.y, bbox2.y)
      yMax = Math.max(yMax, bbox.y+bbox.height, bbox2.y + bbox2.height)
    }

    this._enableFontFeatures()
    this._enableDiacritics()

    let leftOverflow = -xMin - textWidth / 2
    let rightOverflow = xMax - textWidth / 2
    let topOverflow = -yMin - textHeight / 2
    let bottomOverflow = yMax - textHeight / 2

    this.width = Math.max(textWidth + leftOverflow + rightOverflow, this.MIN_TEXT_WIDTH)
    this.height = textHeight + topOverflow + bottomOverflow
    this._contentOffsetY = bottomOverflow / 2 - topOverflow / 2
    this._contentOffsetX = rightOverflow / 2 - leftOverflow / 2

    let _translateX = this.originX === "left" ? leftOverflow : this._contentOffsetX;

    this._translate(_translateX, topOverflow)
    this.updateCurvingControl()
    // this.fire("dimensions:calculated")
  }

  _hasStyleChanged (prevStyle: string[], thisStyle: string[]) {
    if(Object.keys(prevStyle).length !== Object.keys(thisStyle).length ){
      return true
    }
    for(let prop in prevStyle){
      if(prevStyle[prop] !== thisStyle[prop]){
        return true;
      }
    }
    return false;
  }

  _renderTextCommon(ctx: CanvasRenderingContext2D, method: Function) {
    ctx && ctx.save();
    let lineHeights = 0, left = this._getLeftOffset(), top = this._getTopOffset(),
      offsets = this._applyPatternGradientTransform(ctx, method === 'fillText' ? this.fill : this.stroke);

    for (let i = 0, len = this._textLines.length; i < len; i++) {
      let lineOffsetX = 0
      let lineOffsetY = 0
      if(this.__lineInfo && this.__lineInfo[i]){
        lineOffsetX = this.__lineInfo[i].renderedLeft
        lineOffsetY = this.__renderOffsetTop
      }


      let heightOfLine = this.getHeightOfLine(i),
        maxHeight = heightOfLine / this.lineHeight,
        leftOffset = this._getLineLeftOffset(i);
      this._renderTextLine(
        method,
        ctx,
        this._textLines[i],
        left + leftOffset - offsets.offsetX + lineOffsetX,
        top + lineHeights + maxHeight - offsets.offsetY- lineOffsetY,
        i
      );
      lineHeights += heightOfLine;
    }
    ctx && ctx.restore();
  }

  interateTextChunks(lineIndex: number, foo: Function, iteratorFn?: Function){
    let actualStyle, nextStyle, firstChar = 0;
    let specs = this._specialArray
    let line = this._textLines[lineIndex]
    let isJustify = this.textAlign.indexOf('justify') !== -1;
    let shortCut = !isJustify && this.charSpacing === 0 && (!specs || !specs[lineIndex]) && this.isEmptyStyles(lineIndex);

    if (shortCut) {
      // render all the line in one pass without checking
      foo(0, line.length, null)
      return;
    }

    let timeToRender;

    for (let i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing;


      iteratorFn && iteratorFn(i)

      if (isJustify && !timeToRender) {
        if (this._reSpaceAndTab.test(line[i])) {
          timeToRender = true;
        }
      }
      if (!timeToRender) {
        // if we have charSpacing, we render char by char
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);

        timeToRender = (specs && specs[lineIndex] && specs[lineIndex][i] !== specs[lineIndex][i + 1]) || this._hasStyleChanged(actualStyle, nextStyle)
      }

      if (timeToRender) {
        foo(firstChar, i, actualStyle)

        firstChar = i + 1;
        actualStyle = nextStyle;
      }
    }
  }

  _enableFontFeatures(){
    let detectedFeaturesLines: any = []

    for (let li = 0, len = this._textLines.length; li < len; li++) {
      detectedFeaturesLines[li] = []
      this.interateTextChunks(li, (position: number, b: number, style: any) => {
        let components = this._textLines[li].slice(position,b+1)
        if (this._specialArray?.[li]?.[position]) {
          detectedFeaturesLines[li].push({components,position})
        } else {

          let ff = style?.fontFamily || this?.styles[li]?.[position]?.fontFamily || this.fontFamily;
          // let detected = fabric.fonts.getTextFeatures(components.join(""), ff, this.features)
          // for (let detectedInstance of detected) {
          //   detectedInstance.position += position
          //   detectedFeaturesLines[li].push(detectedInstance)
          // }
        }
      })
    }

    let cts = this._charTransformations
    //detected font Features
    for (let li in detectedFeaturesLines) {
      for (let feature of detectedFeaturesLines[li]) {

        let first = cts[li][feature.position];
        let last = cts[li][feature.position + feature.components.length - 1]
        first.char = feature.components
        first.charAngle = (first.charAngle + last.charAngle) / 2

        let midAngle = (first.leftAngle + last.rightAngle) / 2
        first.cl = {x: this._curvingCenter.cx - first.charRadius * Math.sin(midAngle), y: this._curvingCenter.cy - first.charRadius * Math.cos(midAngle)};

        for (let fci = 1; fci < feature.components.length; fci++) {
          delete cts[li][feature.position + fci].char
        }
      }
    }
  }
  _enableDiacritics(){
    let cts = this._charTransformations
    //Fix Diacritics symbols on a curve
    let diacritics = ['́', '̀', '̂', '̌', '̋', '̏', '̃', '̇', '̣', '·', '̈', 'ː', '̆', '̑', '͗', '̃', '҃', '̩', '̄', '̱', '⃓', '̷', '̵', '̊', '̓', '̒', '̔', '̉', '̛', '̦', '̧', '̡', '̢', '̨', '͝', '͡', '', '͞', '͠']
    for (let i in cts) {
      for (let j in cts[i]) {
        if (cts[i][j].char && diacritics.includes(cts[i][j].char)) {
          for (let k = j; k--;) {
            if (cts[i][k].char) {
              cts[i][k].char += cts[i][j].char
              cts[i][j].isDiacritic = true;
              delete cts[i][j].char
              break;
            }
          }
        }
      }
    }
  }

  _drawTextLinesDecorationSector(ctx: CanvasRenderingContext2D, currentColor: string, offset: number, line: number, charStart: number, charEnd: number) {
    ctx.fillStyle = currentColor;
    ctx.lineWidth = this.fontSize / 15

    let startChar = this._charTransformations[line][charStart]
    let endChar = this._charTransformations[line][charEnd - 1]

    ctx.beginPath()
    if (this.curvature < 0) {
      ctx.arc(this._curvingCenter.x, this._curvingCenter.y, startChar.charRadius + 1 + offset, -startChar.leftAngle - Math.PI / 2, -endChar.rightAngle - Math.PI / 2, 1)
    } else {
      ctx.arc(this._curvingCenter.x, this._curvingCenter.y, startChar.charRadius - 1 - offset, -startChar.leftAngle - Math.PI / 2, -endChar.rightAngle - Math.PI / 2, 0)

    }
    ctx.stroke()
  }

  _contextSelectBackgroundSector(ctx: CanvasRenderingContext2D, line: number, charStart: number, charEnd: number, fullLineRadius?: boolean) {

    ctx.beginPath()
    let startChar = this._charTransformations[line][charStart];
    let endChar = this._charTransformations[line][charEnd];

    ctx.moveTo(startChar.tl.x, startChar.tl.y)

    let radius = fullLineRadius ? startChar.bottomRadius : startChar.lineRadius

    if (this.curvature < 0) {
      ctx.arc(this._curvingCenter.x, this._curvingCenter.y, radius, -startChar.leftAngle - Math.PI / 2, -endChar.rightAngle - Math.PI / 2, true)
    } 
    else {
      ctx.arc(this._curvingCenter.x, this._curvingCenter.y, radius, -startChar.leftAngle - Math.PI / 2, -endChar.rightAngle - Math.PI / 2, false)
    }

    ctx.lineTo(endChar.tr.x, endChar.tr.y)

    if (this.curvature < 0) {
      ctx.arc(this._curvingCenter.x, this._curvingCenter.y, startChar.topRadius, -endChar.rightAngle - Math.PI / 2, -startChar.leftAngle - Math.PI / 2, false)
    } 
    else {
      ctx.arc(this._curvingCenter.x, this._curvingCenter.y, startChar.topRadius, -endChar.rightAngle - Math.PI / 2, -startChar.leftAngle - Math.PI / 2, true)
    }
    ctx.closePath()
  }

  _renderTextLinesBackground(ctx: CanvasRenderingContext2D) {
    if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor')) return;
    let originalFill = ctx.fillStyle, lastColor, charStart, currentColor;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor', i)) {
        continue;
      }
      charStart = 0
      lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');

      let j
      for (j = 0; j < this._textLines[i].length; j++) {
        currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
        if (currentColor !== lastColor) {
          if (lastColor) {
            ctx.fillStyle = lastColor;
            this._contextSelectBackgroundSector(ctx, i, charStart, j - 1)
            ctx.fill()
          }
          charStart = j;
          lastColor = currentColor;
        }
      }
      if (currentColor) {
        ctx.fillStyle = currentColor;
        this._contextSelectBackgroundSector(ctx, i, charStart, j - 1)
        ctx.fill()
      }
    }
    ctx.fillStyle = originalFill;
    this._removeShadow(ctx);
  }

  // _set(key: string, value: any) {
  //   super._set(key, value)
  //   const _dimensionAffectingProps = ['fontSize', 'fontWeight', 'fontFamily','fontStyle','lineHeight','text','charSpacing','textAlign','styles']
  //   let needsDims = false;
  //   if (typeof key === 'object') {
  //     const keys = key as Object
  //     for (let _key in keys) {
  //       needsDims = needsDims || _dimensionAffectingProps.indexOf(_key) !== -1;
  //     }
  //   } else {
  //     needsDims = _dimensionAffectingProps.indexOf(key) !== -1;
  //   }
  //   if (needsDims) {
  //     this.initDimensions();
  //     this.setCoords();
  //   }
  //   return this;
  // }

  render (ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.restore();
  }

  renderSelection(ctx: CanvasRenderingContext2D, boundaries: any) {
    let selectionStart = this.inCompositionMode ? this.hiddenTextarea!.selectionStart : this.selectionStart,
      selectionEnd = this.inCompositionMode ? this.hiddenTextarea!.selectionEnd : this.selectionEnd,
      start = this.get2DCursorLocation(selectionStart),
      end = this.get2DCursorLocation(selectionEnd),
      startLine = start.lineIndex,
      endLine = end.lineIndex,
      startChar = start.charIndex < 0 ? 0 : start.charIndex,
      endChar = end.charIndex < 0 ? 0 : end.charIndex;

    ctx.fillStyle = this.selectionColor;
    ctx.translate(-this._contentOffsetX, -this._contentOffsetY)

    for (let i = startLine; i <= endLine; i++) {
      let charStart = (i === startLine) ? startChar : 0,
        charEnd = (i >= startLine && i < endLine) ? this._textLines[i].length : endChar

      // let isEndLine = i === endLine;
      // for (let j = charStart; j < charEnd; j++) {
      //   let tr = this._charTransformations[i][j];
      //   if(isEndLine){
      //     ctx.moveTo(tr.nr.x, tr.nr.y )
      //     ctx.lineTo(tr.nl.x, tr.nl.y )
      //   }
      //   else{
      //     ctx.moveTo(tr.br.x, tr.br.y )
      //     ctx.lineTo(tr.bl.x, tr.bl.y )
      //   }
      //   ctx.lineTo(tr.tl.x,tr.tl.y)
      //   ctx.lineTo(tr.tr.x,tr.tr.y)
      // }

      this._contextSelectBackgroundSector(ctx, i, charStart, charEnd - 1, i !== endLine)
      ctx.fill();
    }
  }

  renderCursor(ctx: CanvasRenderingContext2D, boundaries: any) {
    let cursorLocation = this.get2DCursorLocation(),
      lineIndex = cursorLocation.lineIndex,
      charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
      multiplier = this.scaleX * this.canvas!.getZoom(),
      cursorWidth = this.cursorWidth / multiplier;

    if (this.inCompositionMode) {
      this.renderSelection(boundaries, ctx);
    }

    let tr = this._charTransformations[cursorLocation.lineIndex][cursorLocation.charIndex];

    ctx.save();
    ctx.translate(-this._contentOffsetX, -this._contentOffsetY)
    ctx.lineWidth = cursorWidth
    ctx.strokeStyle = this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
    ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;

    ctx.beginPath()
    ctx.moveTo(tr.nl.x, tr.nl.y)
    ctx.lineTo(tr.tl.x, tr.tl.y)
    ctx.stroke();
    ctx.restore();
  }
}

// classRegistry.setClass(ArcText, 'ArcText')
classRegistry.setClass(Textbox)