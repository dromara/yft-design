import { ClipPathType } from '@/configs/images'
import { addCropImageInteractions, isolateObjectForEdit } from '@/extension/mixins/cropping.mixin'
import { croppingControlSet, flipXCropControls, flipXYCropControls, flipYCropControls } from '@/extension/controls/cropping/cropping.controls'
import { Image as OriginImage, Point, Object as FabricObject, util, classRegistry, TPointerEventInfo, TPointerEvent, ImageProps, TClassProperties, ImageSource } from 'fabric'

export class Image extends OriginImage {
  public isCropping?: false
  public cropKey?: ClipPathType
  public cropPath?: string
  public cropSize?: number
  
  constructor(element: ImageSource, options?: FabricObject<ImageProps>) {
    super(element, { filters: [], ...options });
    this.on('mousedblclick', this.doubleClickHandler.bind(this))
  }

  public doubleClickHandler(e: TPointerEventInfo<TPointerEvent>) {
    if (!this.canvas || !e.target || e.target !== this) return
    this.set({__isCropping: true, clipPath: undefined})
    this.canvas.setActiveObject(this)
    this.canvas.requestRenderAll()
  }

  public get __isCropping() {
    return this.isCropping
  }

  public set __isCropping(value) {
    this.isCropping = value
    if (this.__isCropping) {
      this.onMousedbclickEvent()
    }
  }

  public onMousedbclickEvent() {
    const fabricCanvas = this.canvas
    if (!fabricCanvas) return
    fabricCanvas.defaultCursor = 'move';
    isolateObjectForEdit(this)
    this.lastEventTop = this.top
    this.lastEventLeft = this.left;
    this.setupDragMatrix();
    this.bindCropModeHandlers();
    this.controls = croppingControlSet;
    if (this.flipX && !this.flipY) {
      this.controls = flipXCropControls;
    }
    if (this.flipY && !this.flipX) {
      this.controls = flipYCropControls;
    }
    if (this.flipX && this.flipY) {
      this.controls = flipXYCropControls;
    }
    if (this.scaleX != this.scaleY) {
      this.setControlsVisibility({tlS: false, trS: false, blS: false, brS: false});
    } 
    else {
      this.setControlsVisibility({tlS: true, trS: true, blS: true, brS: true});
    }
    this.setCoords();
    fabricCanvas.centeredKey = null;
    fabricCanvas.altActionKey = null;
    fabricCanvas.selection = false;
  }

  get _cropKey() {
    return this.cropKey
  }

  set _cropKey(key) {
    this.cropSize = Math.min(this.width, this.height)
    if (this.cropKey !== key && key) {
      this.clipPath = undefined
    }
    this.cropKey = key
    this.setCropCoords(this.cropSize, this.cropSize)
  }

  setCropCoords(width: number, height: number) {
    if (!this.clipPath) {
      const left = this.left + this.getOriginalElementWidth() / 2 - width / 2
      const top = this.top + this.getOriginalElementHeight() / 2 - height / 2
      this.cropX = left - this.left
      this.cropY = top - this.top
      this.width = width
      this.height = height
    }
  }

  getOriginalElementWidth() {
    // @ts-ignore
    return this._originalElement ? this._originalElement.naturalWidth || this._originalElement.width : 0;
  }

  getOriginalElementHeight() {
    // @ts-ignore
    return this._originalElement ? this._originalElement.naturalHeight || this._originalElement.height : 0;
  }

  getElementWidth() {
    // @ts-ignore
    return this._element ? this._element.naturalWidth || this._element.width : 0;
  }

  getElementHeight() {
    // @ts-ignore
    return this._element ? this._element.naturalHeight || this._element.height : 0;
  }

  _getOriginalTransformedDimensions(options: any = {}): Point {
    const dimOptions = {
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      width: this.getOriginalElementWidth(),
      height: this.getOriginalElementHeight(),
      strokeWidth: this.strokeWidth,
      ...options,
    };
    // stroke is applied before/after transformations are applied according to `strokeUniform`
    const strokeWidth = dimOptions.strokeWidth;
    let preScalingStrokeValue = strokeWidth, postScalingStrokeValue = 0;

    if (this.strokeUniform) {
      preScalingStrokeValue = 0;
      postScalingStrokeValue = strokeWidth;
    }
    const dimX = dimOptions.width + preScalingStrokeValue,
      dimY = dimOptions.height + preScalingStrokeValue,
      noSkew = dimOptions.skewX === 0 && dimOptions.skewY === 0;
    let finalDimensions;
    if (noSkew) {
      finalDimensions = new Point(dimX * dimOptions.scaleX, dimY * dimOptions.scaleY);
    } 
    else {
      finalDimensions = util.sizeAfterTransform(dimX, dimY, dimOptions);
    }

    return finalDimensions.scalarAdd(postScalingStrokeValue);
  }

  _render(ctx: CanvasRenderingContext2D) {
    // ctx can be either the cacheCtx or the main ctx.
    // we want to disable shadow on the main one since on the cache the shadow is never set.
    // this._setCStroke(ctx);
    // const originalstrokeWidth = this.strokeWidth;
    const width = this.width || 0;
    const height = this.height || 0;
    const elementToDraw = this._element;
    ctx.save();
    if (this.__isCropping) {
      this._removeShadow(ctx); // main context
      ctx.globalAlpha = 0.5;
      const elWidth = this.getElementWidth();
      const elHeight = this.getElementHeight();
      const imageCopyX = -(this.cropX || 0) - width / 2;
      const imageCopyY = -(this.cropY || 0) - height / 2;
      ctx.drawImage(
        elementToDraw,
        imageCopyX,
        imageCopyY,
        elWidth,
        elHeight,
      );
      ctx.globalAlpha = 1;
    }
    super._render(ctx);
    this._drawCroppingLines(ctx)
    this._drawCroppingPath(ctx)
    ctx.restore();
  }

  drawBorders(ctx:CanvasRenderingContext2D, options:any, styleOverride:any) {
    this._renderCroppingBorders(ctx);
    super.drawBorders(ctx, options, styleOverride);
  }

  _renderCroppingBorders(ctx: CanvasRenderingContext2D) {
    if (this.__isCropping) {
      ctx.save();
      const multX = this.canvas?.viewportTransform[0] || 1;
      const multY = this.canvas?.viewportTransform[3] || 1;
      const scaling = this.getObjectScaling();
      if (this.flipX) {
        scaling.x *= -1;
      }
      if (this.flipY) {
        scaling.y *= -1;
      }
      const elWidth = (this.getElementWidth()) * multX * scaling.x;
      const elHeight = (this.getElementHeight()) * multY * scaling.y;
      const { width, height } = this;
      const imageCopyX = (-this.cropX - width / 2) * multX * scaling.x;
      const imageCopyY = (-this.cropY - height / 2) * multY * scaling.y;
      ctx.strokeStyle = FabricObject.prototype.borderColor;
      ctx.strokeRect(imageCopyX, imageCopyY, elWidth, elHeight);
      ctx.restore();
    }
  }
  
  static fromURL(url: string, options: any = {}): Promise<Image> {
    return util.loadImage(url, options).then((img) => new this(img, options));
  }

  static fromObject({ filters: f, resizeFilter: rf, src, crossOrigin, ...object }: any, options: { signal: AbortSignal }): Promise<Image> {
    return Promise.all([
      util.loadImage(src, { ...options, crossOrigin }),
      f && util.enlivenObjects(f, options),
      rf && util.enlivenObjects([rf], options),
      util.enlivenObjectEnlivables(object, options),
    ]).then(([el, filters = [], [resizeFilter] = [], hydratedProps = {}]) => {
      return new this(el, {
        ...object,
        src,
        crossOrigin,
        filters,
        resizeFilter,
        ...hydratedProps,
      });
    });
  }
}

const imageDefaultValues: Partial<TClassProperties<Image>> = {
  type: 'CropImage',
  strokeWidth: 0,
  srcFromAttribute: false,
  minimumScaleTrigger: 0.5,
  cropX: 0,
  cropY: 0,
  imageSmoothing: true,
};

Object.assign(Image.prototype, {
  cacheProperties: [...FabricObject.cacheProperties, 'cropX', 'cropY'],
  ...imageDefaultValues,
  ...addCropImageInteractions()
})

classRegistry.setClass(Image)


