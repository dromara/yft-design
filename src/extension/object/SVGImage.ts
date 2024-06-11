import { getImageSize } from '@/utils/image'
import { Image, Object as FabricObject, util, classRegistry, ImageProps, ImageSource } from 'fabric'

export class SVGImage extends Image {
  static type: string = 'svgimage'
  originWidth?: number
  originHeight?: number

  static async getScale (src: string, object: SVGImage) {
    const { width, height } = await getImageSize(src)
    object.originWidth = object.originWidth ? object.originWidth : object.width
    object.originHeight = object.originHeight ? object.originHeight : object.height
    const widthScale = object.originWidth / width
    const heigthScale = object.originHeight / height
    const scale = widthScale > heigthScale ? widthScale : heigthScale
    object.scaleX = object.scaleY = scale
    object.width = object.originWidth / scale
    object.height = object.originHeight / scale
  }
  
  static async fromURL(url: string, options: any = {}): Promise<Image> {
    return util.loadImage(url, options).then((img) => new this(img, options));
  }

  static async fromObject({ filters: f, resizeFilter: rf, src, crossOrigin, ...object }: any, options: { signal: AbortSignal }): Promise<Image> {
    await this.getScale(src, object)
    console.log('width:', object.width, 'height:', object.height, 'originWidth:', object.originWidth, 'originHeight:', object.originHeight)
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

classRegistry.setClass(SVGImage)


