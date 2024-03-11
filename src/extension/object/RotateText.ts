import { IText, Path, classRegistry } from 'fabric'

export class RotateText extends IText {
  static type: string = 'RotateText'
  private pathProperties?: ['radius', 'flipped']
  private _textWidth: number
  private _textHeight: number
  private _pathOffset?: any
  public radius: number
  public flipped: boolean
  private __isMousedown?: false

  constructor(text: string, options: any) {
    super(text, options)
    this._textWidth = options.textWidth ?? 0
    this._textHeight = options.textHeight ?? 0
    this.radius = options.radius ?? 250
    this.flipped = options.flipped ?? false
    this.charSpacing = options.charSpacing ?? 0
    
    if(options.kerning) {
      const fontSize = options.fontSize ?? this.fontSize
      this.charSpacing = (options.kerning / fontSize) * 1000
    }
    
    if(options.diameter) {
      this.radius = options.diameter / 2
    }
    
    this.path = new Path([], { visible: true })
    this._setPath()
  }

  get type() {
    return 'RotateText'
  }

  _render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(0, this._pathOffset)
    super._render(ctx)
    ctx.restore()
  }

  _set(key: any, value: any): any {
    super._set(key, value)
    if(this.pathProperties?.includes(key)) this._setPath()
  }

  _setPath() {
    this.pathAlign = this.flipped ? 'ascender' : 'baseline'
    
    const segments = this.flipped
      ? [
        ['M', 0, 0],
        ['a', this.radius, this.radius, 0, 1, 0, 0, this.radius * 2],
        ['a', this.radius, this.radius, 0, 1, 0, 0, -this.radius * 2]
      ]
      : [
        ['M', 0, 0],
        ['a', this.radius, this.radius, 0, 1, 1, 0, -this.radius * 2],
        ['a', this.radius, this.radius, 0, 1, 1, 0, this.radius * 2]
      ]
    
    this.path?._setPath(segments as any)
    this.setPathInfo()
    this.initDimensions()
    this.setCoords()
  }

  initDimensions() {
    // if(this.__skipDimension) return
    // this.callSuper('initDimensions')
    super.initDimensions()
    if(!this.path?.path.length) return
    console.log(this.path.path, 0, this.path.segmentsInfo)
    
    this._textWidth = this.calcTextWidth()
    this._textHeight = this.calcTextHeight()
    this._calculateOffset()
  }

  _calculateOffset() {
    const textWidth = this._textWidth
    const textHeight = this._textHeight
    
    const _angle = textWidth / (2 * this.radius)
    const angle = Math.min(_angle, Math.PI)
    const angleClamped = Math.min(_angle, Math.PI / 2)
    
    if(this.flipped) {
      const baseline = this.radius
      const bottom = baseline + textHeight

      const extent = bottom * Math.sin(angleClamped)
      const top = Math.min(
        baseline * Math.cos(angle),
        bottom * Math.cos(angle)
      )
      
      this.width = extent * 2
      this.height = bottom - top
      this._pathOffset = -(top + bottom) / 2
    } else {
      const baseline = -this.radius
      const top = baseline - textHeight

      const extent = -top * Math.sin(angleClamped)
      const bottom = Math.max(
        baseline * Math.cos(angle),
        top * Math.cos(angle)
      )
      
      this.width = extent * 2
      this.height = bottom - top
      this._pathOffset = -(top + bottom) / 2
    }
    
    this.pathStartOffset = (this.charSpacing / 2000) * this.fontSize
  }

  _getSelectionIndices() {
    const selectionStart = this.inCompositionMode ? this.hiddenTextarea?.selectionStart : this.selectionStart
    const selectionEnd = this.inCompositionMode ? this.hiddenTextarea?.selectionEnd : this.selectionEnd
    const start = this.get2DCursorLocation(selectionStart).charIndex
    const end = this.get2DCursorLocation(selectionEnd).charIndex - 1
    return end > start ? [start, end] : [end, start]
  }

  _getSelectionAngle(x: number) {
    const pos = x - this._textWidth / 2
    const angle = pos / this.radius
    
    if(this.flipped) return - 1.5 * Math.PI - angle
    return angle - Math.PI / 2
  }
  _drawSelectionArc(ctx: CanvasRenderingContext2D, start: number, end: number, counter = false) {
    ctx.beginPath()
    ctx.arc(0, this._pathOffset, this.radius, start, end, counter)
    ctx.arc(0, this._pathOffset, this.radius + this._textHeight, end, start, !counter)
    ctx.closePath()
    ctx.fill()
  }

  renderSelection(ctx: CanvasRenderingContext2D, boundaries: any) {
    const [start, end] = this._getSelectionIndices()
    
    const left = this.__charBounds[0][start].left
    const right = this.__charBounds[0][end].left + this.__charBounds[0][end].width
    
    const startAngle = this._getSelectionAngle(left)
    const endAngle = this._getSelectionAngle(right)
    
    ctx.fillStyle = this.inCompositionMode ? this.compositionColor || 'black' : this.selectionColor    
    this._drawSelectionArc(ctx, startAngle, endAngle, this.flipped)
  }

  renderCursor(ctx: CanvasRenderingContext2D, boundaries: any) {
    const index = this.get2DCursorLocation().charIndex
    
    const x = this.__charBounds[0][index].left
    const angle = this._getSelectionAngle(x)
    const angleStep = 1 / this.radius
    
    ctx.fillStyle = this.cursorColor || this.getValueOfPropertyAt(0, index, 'fill')
    ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity
    this._drawSelectionArc(ctx, angle, angle + angleStep)
  }
  // toObject() {
  //   return fabric.util.object.extend(this.callSuper('toObject'), {
  //     radius: this.radius,
  //     flipped: this.flipped
  //   })
  // }
}

classRegistry.setClass(RotateText, 'RotateText')