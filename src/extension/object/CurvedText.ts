import { Object as FabricObject, IText, Text, Group, CollectionEvents, classRegistry, TPointerEventInfo, TPointerEvent, TSVGReviver, util } from 'fabric'

// const stateProperties = Group.stateProperties
// const delegatedProperties = Group.prototype.getObjectOpacity

export class CurvedText extends IText {
  public letters: Group
  public radius = 50
  public range = 5
  public smallFont = 10
  public largeFont = 30
  public effect = 'curved'
  public spacing = 20
  public reverse = false
  public _isRendering = 0
  public _textLines: any = []
  constructor(text: string, options: any) {
    super(text, options)
    
    // this.on('mousedblclick', this.doubleClickHandler.bind(this))
    this.letters = new Group([], { selectable: false, padding: 0})
    this.initialize(text, options)
  }

  public initialize(text: string, options: any) {
    // this.__skipDimension = true
    this.setOptions(options)
    // this.__skipDimension = false
    // this.callSuper('initialize', text, options)
    this.setText(text)
    this._render()
  }

  public setText(text: string) {
    if (this.letters) {
      // while(text.length !== 0 && this.letters.size() >= text.length) {
      //   const item = this.letters.item(this.letters.size() - 1)
      //   this.letters.remove(item)
      // }
      this.letters._objects = []
      for (let i = 0; i < text.length; i++) {
        if (this.letters._objects[i] === undefined) {
          this.letters.add(new Text(text[i], {}))
        }
        else {
          this.letters._objects[i].set({text: text[i]})
        }
      }
    }
    this._render()
  }

  public _initDimensions (ctx?: CanvasRenderingContext2D){
    // from fabric.Text.prototype._initDimensions
    // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    if (!ctx) {
      ctx = this.canvas?.getContext();
      if (ctx) this._setTextStyles(ctx);
    }
    this._textLines = this.text.split(this._reNewline);
    this._clearCache()
    var currentTextAlign = this.textAlign
    this.textAlign = 'left'
    this.width = this.getWidth()
    this.textAlign = currentTextAlign
    this.height = this.getHeight()
    this._render();
  }

  // /**
  //  * 绑定target的deselected事件，在target被取消激活后，关闭组的interactive
  //  */
  // public addDeselectedEvent(target: FabricObject) {
  //   target.once('deselected', () => {
  //     const activeObject = this.canvas?.getActiveObject()
  //     // if (!activeObject || !activeObject.getAncestors(true).includes(this)) {
  //     //   // 关闭
  //     //   this.set({interactive: false, objectCaching: true,})
  //     // } else {
  //     //   // 事件传递
  //     //   this.addDeselectedEvent(activeObject)
  //     // }
  //   })
  // }

  // /**
  //  * 组内元素被激活
  //  */
  // public onActiveTarget(target: FabricObject) {
  //   if (!this.canvas || !target.group || target.group.interactive) return
  //   target.getAncestors(true).forEach((_group) => {
  //     const group = _group as Group
  //     if (group.interactive) return
  //     group.set({ interactive: true, objectCaching: false,})
  //     group.addDeselectedEvent(target)
  //   })
  // }

  // /**
  //  * 双击后启用interactive，离开组后关闭
  //  */
  // public doubleClickHandler(e: TPointerEventInfo<TPointerEvent>) {
  //   if (!this.canvas || !e.target || e.target !== this || !e.subTargets || e.subTargets.length === 0) return

  //   // 启用
  //   this.set({interactive: true, objectCaching: false})

  //   // 绑定事件
  //   this.addDeselectedEvent(this)

  //   // 搜索被双击的目标并激活
  //   const index = e.subTargets.indexOf(this)
  //   const prevTarget = e.subTargets[index - 1] ?? e.subTargets[e.subTargets.length - 1]
  //   this.canvas.setActiveObject(prevTarget)

  //   this.canvas.requestRenderAll()
  // }

  // // 空子元素，自动移除组本身
  // // override _onObjectRemoved(object: FabricObject, removeParentTransform?: boolean): void {
  // //   super._onObjectRemoved(object, removeParentTransform)
  // //   if (this.size() === 0) {
  // //     const parent = this.getParent() as Group
  // //     parent && parent.remove(this)
  // //   }
  // // }

  // _renderOld(ctx: CanvasRenderingContext2D){
  //   if(this.letters){
  //     let currentAngle = 0, angleRadians = 0, align = 0, rev = 0;
  //     if(this.reverse) rev=0.5
  //     if(this.textAlign === 'center' || this.textAlign === 'justify'){
  //       align = this.spacing / 2 * (this.text.length - rev);	// Remove '-1' after this.text.length for proper angle rendering
  //     } 
  //     else if(this.textAlign === 'right') {
  //       align = this.spacing * (this.text.length - rev);	// Remove '-1' after this.text.length for proper angle rendering
  //     }
  //     var multiplier = this.reverse ? 1: -1;
  //     for(var i = 0, len = this.text.length; i<len; i++){
  //       // Find coords of each letters (radians : angle*(Math.PI / 180)
  //       currentAngle = multiplier * (-i * this.spacing + align);
  //       angleRadians = currentAngle * (Math.PI / 180);

  //       // for(var key in this.delegatedProperties){
  //       //   this.letters._objects[i].set(key, this.get(key));
  //       // }
  //       this.letters._objects[i].set({
  //         left: multiplier + Math.sin(angleRadians) * this.radius,
  //         top: multiplier - Math.cos(angleRadians) * this.radius,
  //         angle: currentAngle,
  //         padding: 0,
  //         selectable: false,
  //       })
  //     }
  //     // Update group coords
  //     // this.letters._calcBounds();
  //     if (this.reverse) {
  //       this.letters.top = this.letters.top-this.height*2.5;
  //     }
  //     else {
  //       this.letters.top = 0;
  //     }
  //     this.letters.left = this.letters.left-this.width/2; // Change here, for proper group display
  //     // this.letters._updateObjectsCoords();					// Commented off this line for group misplacement
  //     // this.letters.saveCoords();
  //     // this.letters.render(ctx);
  //     this.width = this.letters.width;
  //     this.height = this.letters.height;
  //     this.letters.left = -(this.letters.width/2);
  //     this.letters.top = -(this.letters.height/2);
  //   }
  // }

  _render() {
    const renderingCode = util.getRandomInt(100, 999)
    this._isRendering = renderingCode
    if (this.letters && this.letters.size()) {
      let currentAngle = 0, currentAngleROtation = 0, angleRadians = 0, align = 0, space = this.spacing, textWidth = 0, fixedLetterAngle = 0
      if (this.effect === 'curved') {
        for (let i = 0; i < this.text.length; i++) {
          const item = this.letters._objects[i]
          textWidth += item.width + space
        }
        textWidth -= space
      }
      else if (this.effect === 'arc') {
        const itemLetter = this.letters._objects[0] as IText
        fixedLetterAngle = ((itemLetter.fontSize + space) / this.radius) / (Math.PI / 180)
        textWidth = (this.text.length + 1 ) * (itemLetter.fontSize + space)
      }

      if (this.textAlign === 'right') {
        currentAngle = 90 - ((textWidth / 2) / this.radius) / (Math.PI / 180)
      }
      else if (this.textAlign === 'left') {
        currentAngle = -90 - ((textWidth / 2) / this.radius) / (Math.PI / 180)
      }
      else {
        currentAngle = -((textWidth / 2) / this.radius) / (Math.PI / 180)
      }

      if (this.reverse) currentAngle = -currentAngle

      let width = 0, multiplier = this.reverse ? -1 : 1, thisLetterAngle = 0, lastLetterAngle = 0
      for (let i = 0; i < this.text.length; i++) {
        if (this._isRendering !== renderingCode) return
        // for(var key in this.delegatedProperties){
        //   this.letters._objects[i].set(key, this.get(key));
        // }

        this.letters._objects[i].set({left: width, top: 0, angle: 0, padding: 0})
        if (this.effect === 'curved') {
          thisLetterAngle = ((this.letters._objects[i].width + space) / this.radius) / (Math.PI / 180)
          currentAngle = multiplier * ((multiplier * currentAngle) + lastLetterAngle)
          angleRadians = currentAngle*(Math.PI/180);
          lastLetterAngle = thisLetterAngle;
          this.letters._objects[i].set({
            angle: currentAngle, 
            padding: 0,
            selectable: false,
            left: multiplier * (Math.sin(angleRadians)*this.radius),
            top: multiplier * -1 * (Math.cos(angleRadians) * this.radius),
          })
        }
        else if (this.effect === 'arc') {
          currentAngle = multiplier * ((multiplier * currentAngle) + fixedLetterAngle);
          angleRadians = currentAngle * (Math.PI / 180);
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
          var difference = large-small
          var center = Math.ceil(this.text.length / 2)
          var step = difference/(this.text.length)
          var newfont = small + (i * step)
          //var newfont=((this.text.length-i)*this.smallFont)+12;
          this.letters._objects[i].set('fontSize', (newfont));
          this.letters._objects[i].set('left', (width));
          width+=this.letters._objects[i].get('width');
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
      this.letters.setCoords()
      // this.letters.saveCoords();
      // this.letters.render(ctx);

      this.letters.set('scaleX', scaleX);
      this.letters.set('scaleY', scaleY);
      this.letters.set('angle', angle);

      this.width = this.letters.width;
      this.height = this.letters.height;
      this.letters.left = -(this.letters.width/2);
      this.letters.top = -(this.letters.height/2);
    }
  }

  override render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.transform(ctx);
    //The array is now sorted in order of highest first, so start from end.
    for(let i = 0, len = this.letters.size(); i< len; i++){
      this.letters._objects[i].render(ctx)
    }
    ctx.restore();
    this.setCoords();
  }

  _set(key: string, value: any): any {
    super._set(key, value)
    console.log('this.letters:', this.letters)
    if (this.letters) {
      this.letters.set(key, value)
      this._initDimensions()
      this.setCoords()
    }
    return this
  }

  // toSVG(reviver: TSVGReviver | undefined): string{
  //   var markup=[
  //     '<g ',
  //     'transform="', this.getSvgTransform(),
  //     '">'
  //   ];
  //   if(this.letters){
  //     for(let i = 0, len = this.letters.size(); i < len; i++){
  //       markup.push(this.letters._objects[i].toSVG(reviver));
  //     }
  //   }
  //   markup.push('</g>');
  //   return reviver ? reviver(markup.join('')) : markup.join('');
  // }
}

classRegistry.setClass(CurvedText, 'CurvedText')
