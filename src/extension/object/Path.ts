import { Object as FabricObject, Path as OriginPath, classRegistry, PathProps, TOptions, SerializedPathProps, util } from "fabric";
import { Color } from "./Color";

const isBlack = (num: number) => {
  return num - 0 === 0
}

export class Path extends OriginPath {
  declare mask?: FabricObject;

  constructor(path: string | [], options?: FabricObject<PathProps>) {
    super(path, options)
  }

  render(ctx: CanvasRenderingContext2D, options?: any): void {
    
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
      this.drawObject(ctx, options?.forClipping, options?.forMasking);
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
      this.drawObject(this._cacheContext, options?.forClipping, options?.forMasking);
      this.dirty = false;
    }
  }

  drawMaskOnCache(ctx: CanvasRenderingContext2D) {
    const mask = this.mask;
    if (!mask) return
    ctx.save();
    // ctx.globalCompositeOperation = 'destination-in';
    mask.transform(ctx);
    ctx.scale(1 / mask.zoomX!, 1 / mask.zoomY!);
    
    ctx.drawImage(mask._cacheCanvas!, -mask.cacheTranslationX!, -mask.cacheTranslationY!);
    const maskData = ctx.getImageData(0, 0, mask.width, mask.height)
    // const defaultColor = mask.defaultColor
    for (let i = 0; i < maskData.data.length; i += 4) {
      const r = maskData.data[i]
      const g = maskData.data[i + 1]
      const b = maskData.data[i + 2]
      if (r === g && g === b) {
        maskData.data[i + 3] = r 
      }
      else {
        if (isBlack(r) && isBlack(g) && isBlack(b)) {
          maskData.data[i + 3] = 0
         }
      }
    }
    ctx.putImageData(maskData, 0, 0)
    ctx.globalCompositeOperation = 'source-in';
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

  drawObject(ctx: CanvasRenderingContext2D, forClipping?: boolean, forMasking?: boolean): void {
    const originalFill = this.fill,
      originalStroke = this.stroke;
    if (forClipping) {
      this.fill = 'black';
      this.stroke = '';
      this._setClippingProperties(ctx);
    } 
    else if (forMasking) {
      this._setMaskingProperties(ctx)
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

  toObject(propertiesToInclude?: any[] | undefined): any {
    const object = super.toObject(propertiesToInclude)
    if (this.mask) {
      object.mask = this.mask.toObject(propertiesToInclude)
    }
    return object
  }
  
}

classRegistry.setClass(Path)
classRegistry.setSVGClass(Path)