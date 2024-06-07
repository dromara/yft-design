import { Object as OriginObject, FabricObjectProps, classRegistry, Image } from "fabric";
import { Color } from './Color'

export class Object extends OriginObject {
  declare mask?: Image;
  constructor(options: FabricObjectProps) {
    super()
    this.setOptions(options)
  }

  render(ctx: CanvasRenderingContext2D, options?: Record<string, any>): void {
    console.log('object:', this.type)
    if (this.isNotVisible()) {
      return;
    }
    if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
      return;
    }
    ctx.save();
    this._setupCompositeOperation(ctx);
    this.drawSelectionBackground(ctx);
    this.transform(ctx);
    this._setOpacity(ctx);
    this._setShadow(ctx);
    if (this.shouldCache()) {
      this.renderCache(options);
      (this as any).drawCacheOnCanvas(ctx);
    } else {
      this._removeCacheCanvas();
      this.drawObject(ctx, options);
      this.dirty = false;
    }
    ctx.restore();
  }

  renderCache(options?: any): void {
    options = options || {};
    if (!this._cacheCanvas || !this._cacheContext) {
      this._createCacheCanvas();
    }
    if (this.isCacheDirty() && this._cacheContext) {
      this.drawObject(this._cacheContext, options);
      this.dirty = false;
    }
  }

  drawMaskOnCache(ctx: CanvasRenderingContext2D) {
    const mask = this.mask;
    if (!mask) return
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    mask.transform(ctx);
    ctx.scale(1 / mask.zoomX!, 1 / mask.zoomY!);
    ctx.drawImage(mask._cacheCanvas!, -mask.cacheTranslationX!, -mask.cacheTranslationY!);
    ctx.restore();
  }

  _drawMask(ctx: CanvasRenderingContext2D) {
    const mask = this.mask;
    if (!mask) return
    mask.canvas = this.canvas;
    mask.shouldCache();
    mask._transformDone = true;
    mask.renderCache({ forMasking: true });
    this.drawMaskOnCache(ctx);
  }

  drawObject(ctx: CanvasRenderingContext2D, options?: any): void {
    options = options || {};
    const originalFill = this.fill,
      originalStroke = this.stroke;
    if (options.forClipping) {
      this.fill = 'black';
      this.stroke = '';
      this._setClippingProperties(ctx);
    } 
    else if (options.forMasking) {
      this._setMaskingProperties(ctx);
    }
    else {
      this._renderBackground(ctx);
    }
    this._render(ctx);
    this._drawClipPath(ctx, this.clipPath);
    this._drawMask(ctx);
    this.fill = originalFill;
    this.stroke = originalStroke;
  }

  _setMaskingProperties(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = (new Color(this.stroke as string)).toMaskWhite();
    ctx.fillStyle = (new Color(this.fill as string)).toMaskWhite();
  }

  toObject(propertiesToInclude?: any[] | undefined) {
    const object = super.toObject(propertiesToInclude)
    if (this.mask) {
      object.mask = this.mask.toObject(propertiesToInclude)
    }
    return object
  }
}

classRegistry.setClass(Object)