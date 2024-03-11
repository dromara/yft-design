import { Object as FabricObject, IText, Text, Group, Point, classRegistry, TPointerEventInfo, TPointerEvent, TSVGReviver, util, Textbox } from 'fabric'
import { textboxControls } from '@/app/fabricControls'


const max = (array: number[], byProperty?: string) => {
  return find(array, byProperty, function(value1: number, value2: number) {
    return value1 >= value2;
  });
}

const min = (array: number[], byProperty?: string) => {
  return find(array, byProperty, function(value1: number, value2: number) {
    return value1 < value2;
  });
}

const find = (array: any, byProperty: any, condition: any) => {
  if (!array || array.length === 0) return;

  let i = array.length - 1, result = byProperty ? array[i][byProperty] : array[i];
  if (byProperty) {
    while (i--) {
      if (condition(array[i][byProperty], result)) {
        result = array[i][byProperty];
      }
    }
  }
  else {
    while (i--) {
      if (condition(array[i], result)) {
        result = array[i];
      }
    }
  }
  return result;
}

export class CurvedText extends IText {
  static type: string = 'CurvedText'
  public letters: Group
  public hasEffect = false
  public radius = 100
  public range = 5
  public smallFont = 10
  public largeFont = 30
  public effect = 'curved'
  public spacing = 20
  public reverse = false
  public _isRendering = 0
  public _textLines: any = []
  public _dimensionAffectingProps = ['fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'lineHeight', 'text', 'charSpacing', 'textAlign', 'styles', 'scaleX', 'scaleY']
  constructor(text: string, options: any) {
    super(text, options)
    this.radius = options.width / 2
    this.on('editing:entered', this.editingEnterdHandler.bind(this))
    this.on('editing:exited', this.editingExitedHandler.bind(this))
    this.letters = new Group([], { selectable: false, padding: 0})
    this.initialize(text, options)
  }

  public initialize(text: string, options: any) {
    this.hasEffect = true
    this.setOptions(options)
    this.setText(text, options)
    this._render()
  }

  public setText(text: string, options: any) {
    if (this.letters && this.hasEffect) {
      this.letters._objects = []
      for (let i = 0; i < text.length; i++) {
        this.letters.add(new Text(text[i], options))
      }
    }
    this._render()
  }

  public _initDimensions (ctx?: CanvasRenderingContext2D){
    this._textLines = this.text.split(this._reNewline);
    this._clearCache()
    var currentTextAlign = this.textAlign
    this.textAlign = 'left'
    this.width = this.getWidth()
    this.textAlign = currentTextAlign
    this.height = this.getHeight()
    this._render();
  }

  get type () {
    return 'CurvedText'
  }

  public editingEnterdHandler(e: TPointerEventInfo<TPointerEvent>) {
    this.set({effect: 'normal', text: this.text, controls: textboxControls(), hasEffect: false})
  }

  public editingExitedHandler(e: TPointerEventInfo<TPointerEvent>) {
    console.log(this.text)
    this.set({effect: 'curved', hasEffect: true})
  }

  _render() {
    if (this.effect === 'normal' && !this.hasEffect) {
      if (!this.canvas) return
      const ctx = this.canvas.contextContainer
      super._render(ctx)
      return
    }
    const renderingCode = util.getRandomInt(100, 999)
    this._isRendering = renderingCode
    if (this.letters && this.letters._objects.length) {
      let currentAngle = 0, currentAngleRotation = 0, angleRadians = 0, align = 0, space = this.spacing, textWidth = 0, fixedLetterAngle = 0
      const halfPI = Math.PI / 180
      if (this.effect === 'curved') {
        for (let i = 0; i < this.text.length; i++) {
          const item = this.letters._objects[i]
          textWidth += item.width + space
        }
        textWidth -= space
      }
      else if (this.effect === 'arc') {
        const itemLetter = this.letters._objects[0] as IText
        fixedLetterAngle = ((itemLetter.fontSize + space) / this.radius) / halfPI
        textWidth = (this.text.length + 1 ) * (itemLetter.fontSize + space)
      }

      if (this.textAlign === 'right') {
        currentAngle = 90 - ((textWidth / 2) / this.radius) / halfPI
      }
      else if (this.textAlign === 'left') {
        currentAngle = -90 - ((textWidth / 2) / this.radius) / halfPI
      }
      else {
        currentAngle = -((textWidth / 2) / this.radius) / halfPI
      }

      if (this.reverse) currentAngle = -currentAngle

      let width = 0, multiplier = this.reverse ? -1 : 1, thisLetterAngle = 0, lastLetterAngle = 0
      if (this._isRendering !== renderingCode) return
      for (let i = 0; i < this.text.length; i++) {
        for (var key in this._dimensionAffectingProps) {
          this.letters._objects[i].set(key, this.get(key));
        }

        this.letters._objects[i].set({left: width, top: 0, angle: 0, padding: 0})
        if (this.effect === 'curved') {
          thisLetterAngle = ((this.letters._objects[i].width + space) / this.radius) / halfPI
          currentAngle = multiplier * (multiplier * currentAngle + lastLetterAngle)
          angleRadians = currentAngle * halfPI;
          lastLetterAngle = thisLetterAngle;
          this.letters._objects[i].set({
            angle: currentAngle, 
            padding: 0,
            selectable: false,
            left: multiplier * (Math.sin(angleRadians) * this.radius),
            top: -multiplier * (Math.cos(angleRadians) * this.radius),
          })
        }
        else if (this.effect === 'arc') {
          currentAngle = multiplier * ((multiplier * currentAngle) + fixedLetterAngle);
          angleRadians = currentAngle * halfPI;
          this.letters._objects[i].set({
            angle: currentAngle, 
            padding: 0,
            selectable: false,
            left: multiplier * (Math.sin(angleRadians) * this.radius),
            top: multiplier * -1 * (Math.cos(angleRadians) * this.radius),
          })
        }
        else if (this.effect === 'STRAIGHT') {
          this.letters._objects[i].set({
            left: width,
            top: 0,
            angle: 0,
            padding: 0,
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 6,
            transparentCorners: false,
            selectable: false,
          });
          width += this.letters._objects[i].width;
        }
        else if (this.effect === 'smallToLarge') {
          const small = this.smallFont;
          const large = this.largeFont;
          const difference = large - small;
          // var center = Math.ceil(this.text.length / 2);
          const step = difference / (this.text.length);
          this.letters._objects[i].set({
            fontSize: small + (i * step),
            left: width,
            top: -1 * this.letters._objects[i].get('fontSize') + i,
            padding: 0,
            selectable: false,
          });
          width += this.letters._objects[i].width;
        }
        else if (this.effect === 'largeToSmallTop') {
          var small = this.largeFont
          var large = this.smallFont
          var difference = large - small
          var center = Math.ceil(this.text.length / 2)
          var step = difference / (this.text.length)
          var newfont = small + (i * step)
          //var newfont=((this.text.length-i)*this.smallFont)+12;
          this.letters._objects[i].set('fontSize', (newfont));
          this.letters._objects[i].set('left', (width));
          width += this.letters._objects[i].get('width');
          this.letters._objects[i].set('padding', 0);
          this.letters._objects[i].set({
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 6,
            transparentCorners: false
          });
          this.letters._objects[i].set('padding', 0);
          this.letters._objects[i].set('selectable', false);
          this.letters._objects[i].top=-1*this.letters._objects[i].get('fontSize')+(i/this.text.length);
        }
      }

      const scaleX = this.letters.get('scaleX');
      const scaleY = this.letters.get('scaleY');
      const angle = this.letters.get('angle');

      this.letters.set('scaleX', 1);
      this.letters.set('scaleY', 1);
      this.letters.set('angle', 0);
      // Update group coords
      this._calcBounds();
			this._updateObjectsCoords();
      // this.letters.saveCoords();
      // this.letters.render();

      this.letters.set('scaleX', scaleX);
      this.letters.set('scaleY', scaleY);
      this.letters.set('angle', angle);

      this.width = this.letters.width;
      this.height = this.letters.height;
      this.letters.left = -this.letters.width / 2;
      this.letters.top = -this.letters.height / 2;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.effect === 'normal') {
      super.render(ctx)
      return
    }
    ctx.save()
    this.transform(ctx)
    for(let i = 0, len = this.letters.size(); i< len; i++){
      this.letters._objects[i].render(ctx)
    }
    ctx.restore()
  }

  _set(key: string, value: any): any {
    super._set(key, value)
    if (this.letters) {
      if (this._dimensionAffectingProps.includes(key)) {
        this._initDimensions();
        this.setCoords();
        this.letters._objects.forEach(item => item.set(key, value))
      }
    }
    return this
  }

  _calcBounds(onlyWidthHeight?: number) {
    let aX: number[] = [],
        aY: number[] = [],
        o, prop,
        props = ['tr', 'br', 'bl', 'tl'],
        iLen = this.letters._objects.length,
        j, jLen = props.length;

    for (let i = 0; i < iLen; ++i) {
      o = this.letters._objects[i] as any
      o.aCoords = o.calcACoords();
      for (j = 0; j < jLen; j++) {
        prop = props[j];
        aX.push(o.aCoords[prop].x);
        aY.push(o.aCoords[prop].y);
      }
    }

    this._getBounds(aX, aY, onlyWidthHeight);
  }

  /**
   * @private
   */
  _getBounds (aX: number[], aY: number[], onlyWidthHeight?: number) {
    const minXY = new Point(min(aX), min(aY)),
        maxXY = new Point(max(aX), max(aY)),
        top = minXY.y || 0, left = minXY.x || 0,
        width = (maxXY.x - minXY.x) || 0,
        height = (maxXY.y - minXY.y) || 0;
    this.letters.width = width;
    this.letters.height = height;
    if (!onlyWidthHeight) {
      // the bounding box always finds the topleft most corner.
      // whatever is the group origin, we set up here the left/top position.
      this.letters.setPositionByOrigin({ x: left, y: top } as Point, 'left', 'top');
    }
  }

  _updateObjectsCoords (center?: Point) {
    let centerPoint = center || this.letters.getCenterPoint()
    for (let i = this.letters._objects.length; i--; ) { 
      this._updateObjectCoords(this.letters._objects[i], centerPoint);
    }
  }

  _updateObjectCoords (object: FabricObject, center: Point) {
    const objectLeft = object.left, objectTop = object.top, skipControls = true;
    object.set({
      left: objectLeft - center.x,
      top: objectTop - center.y
    });
    object.group = this.letters
    object.setCoords()
  }

  toSVG(reviver: TSVGReviver | undefined): string {
    var markup=[
      '<g ', this.getSvgTransform(), '>'
    ];
    if(this.letters){
      for(let i = 0, len = this.letters.size(); i < len; i++){
        markup.push(this.letters._objects[i].toSVG(reviver));
      }
    }
    markup.push('</g>');
    return reviver ? reviver(markup.join('')) : markup.join('');
  }
}

classRegistry.setClass(CurvedText, 'CurvedText')
