import { getImageSize } from '@/utils/image'
import { Image, Object as FabricObject, util, classRegistry, ImageProps, ImageSource } from 'fabric'

export class SVGImage extends Image {
  static type: string = 'svgimage'

  static async getScale (src: string, object: any) : Promise<number> {
    const { width, height } = await getImageSize(src)
    const widthScale = object.width / width
    const heigthScale = object.height / height
    return widthScale > heigthScale ? widthScale : heigthScale
  }
  
  static async fromURL(url: string, options: any = {}): Promise<Image> {
    const scale = await this.getScale(url, options)
    options.scaleX = options.scaleY = scale
    return util.loadImage(url, options).then((img) => new this(img, options));
  }

  static async fromObject({ filters: f, resizeFilter: rf, src, crossOrigin, ...object }: any, options: { signal: AbortSignal }): Promise<Image> {
    const scale = await this.getScale(src, object)
    object.scaleX = object.scaleY = scale
    object.width /= scale
    object.height /= scale
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

classRegistry.setClass(SVGImage, 'svgimage')


