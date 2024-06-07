import { Object as FabricObject, Path as OriginPath, classRegistry, PathProps, SerializedImageProps, SerializedPathProps, util, Image } from "fabric";
import { Color } from "./Color";
import { getPathMask } from "../effects/path.mask";

export class Path extends OriginPath {
  declare mask?: SerializedImageProps;

  constructor(path: string | [], options?: FabricObject<PathProps>) {
    super(path, options)
  }

  // static async fromObject<T extends TOptions<SerializedPathProps>>(object: T): Promise<Path> {
  //   const path = await this._fromObject<Path>(object, { extraParam: 'path'});
  //   // if (path.mask) {
  //   //   const pathImage = await getPathMask(path)
  //   //   console.log(`<img src="${pathImage!.toDataURL()}" />`)
  //   //   // console.log(`<img src="${path.mask?.getSrc()}" />`)
  //   //   // this.drawMaskOnCache()
  //   // }
  //   return path
  // }

  // override render(ctx: CanvasRenderingContext2D, options?: any): void {
    
  //   if (this.isNotVisible()) {
  //     return;
  //   }
  //   if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
  //     return;
  //   }
  //   ctx.save();
  //   this._setupCompositeOperation(ctx);
  //   this.drawSelectionBackground(ctx);
  //   this.transform(ctx);
  //   this._setOpacity(ctx);
  //   this._setShadow(ctx);
  //   if (this.shouldCache()) {
  //     this.renderCache(options);
  //     (this as any).drawCacheOnCanvas(ctx);
  //   } else {
  //     this._removeCacheCanvas();
  //     this.drawObject(ctx);
  //     this.dirty = false;
  //   }
  //   ctx.restore();
  // }

  // override renderCache(options?: any): void {
  //   options = options || {};
  //   if (!this._cacheCanvas || !this._cacheContext) {
  //     this._createCacheCanvas();
  //   }
  //   if (this.isCacheDirty() && this._cacheContext) {
  //     this.drawObject(this._cacheContext, options?.forClipping);
  //     this.dirty = false;
  //   }
  // }

//  static drawMaskOnCache(ctx: CanvasRenderingContext2D, image: Image) {
//     const mask = this.mask;
//     if (!mask) return
//     ctx.save();
//     ctx.globalCompositeOperation = 'destination-in';
//     mask.transform(ctx);
//     ctx.scale(1 / mask.zoomX!, 1 / mask.zoomY!);
//     ctx.drawImage(image._cacheCanvas!, -mask.cacheTranslationX!, -mask.cacheTranslationY!);
//     // ctx.globalCompositeOperation = 'source-in';
//     ctx.restore();
//   }

  // _drawMask(ctx: CanvasRenderingContext2D) {
  //   const mask = this.mask;
  //   if (!mask) return
  //   mask.canvas = this.canvas;
  //   mask.shouldCache();
  //   mask._transformDone = true;
  //   mask.renderCache({ forMasking: true });
  //   this.drawMaskOnCache(ctx);
  // }

  // override drawObject(ctx: CanvasRenderingContext2D, forClipping?: boolean): void {
  //   const originalFill = this.fill,
  //     originalStroke = this.stroke;
  //   if (forClipping) {
  //     this.fill = 'black';
  //     this.stroke = '';
  //     this._setClippingProperties(ctx);
  //   } 
  //   else {
  //     this._renderBackground(ctx);
  //   }
  //   this._render(ctx);
  //   this._drawClipPath(ctx, this.clipPath);
  //   // this._drawMask(ctx);
  //   this.fill = originalFill;
  //   this.stroke = originalStroke;
  // }

  // _setMaskingProperties(ctx: CanvasRenderingContext2D) {
  //   ctx.strokeStyle = (new Color(this.stroke as string)).toMaskWhite();
  //   ctx.fillStyle = (new Color(this.fill as string)).toMaskWhite();
  // }

  // override toObject(propertiesToInclude?: any[] | undefined): any {
  //   const object = super.toObject(propertiesToInclude)
  //   if (this.mask) {
  //     object.mask = this.mask.toObject(propertiesToInclude)
  //   }
  //   return object
  // }
  
}

classRegistry.setClass(Path)
classRegistry.setSVGClass(Path)