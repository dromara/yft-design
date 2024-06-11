import { getImageSize } from '@/utils/image'
import { Image, Object as FabricObject, util, classRegistry, ImageProps, ImageSource, SerializedImageProps, TClassProperties } from 'fabric'

export class SVGImage extends Image {
  static type: string = 'svgimage'
  public originWidth?: number
  public originHeight?: number
  public originScale?: number
  public srcWidth?: number
  public srcHeight?: number

  static async getScale (src: string, object: SVGImage) {
    if (!object.srcWidth && !object.srcHeight) {
      const { width, height } = await getImageSize(src)
      object.srcWidth = width
      object.srcHeight = height
    }
    if (!object.srcWidth || !object.srcHeight) return
    const widthScale = object.width / object.srcWidth
    const heigthScale = object.height / object.srcHeight
    const scale = widthScale > heigthScale ? widthScale : heigthScale
    if (!object.originWidth) object.originWidth = object.width
    if (!object.originHeight) object.originHeight = object.height
    if (!object.originScale) object.originScale = object.scaleX
    object.scaleX = object.scaleY = scale
    object.width = object.originWidth / scale
    object.height = object.originHeight / scale
  }
  
  static async fromURL(url: string, options: any = {}): Promise<Image> {
    return util.loadImage(url, options).then((img) => new this(img, options));
  }

  static async fromObject({ filters: f, resizeFilter: rf, src, crossOrigin, ...object }: any, options: { signal: AbortSignal }): Promise<Image> {
    await this.getScale(src, object)
    return Promise.all([
      util.loadImage(src, { ...options, crossOrigin }),
      f && util.enlivenObjects(f, options),
      rf && util.enlivenObjects([rf], options),
      util.enlivenObjectEnlivables(object, options),
    ]).then(([el, filters = [], [resizeFilter] = [], hydratedProps = {}]) => {
      const image = new this(el, {
        ...object,
        src,
        crossOrigin,
        filters,
        resizeFilter,
        ...hydratedProps,
      });
      if (object.originWidth) image.originWidth = object.originWidth
      if (object.originHeight) image.originHeight = object.originHeight
      if (object.originScale) image.originScale = object.originScale
      if (object.srcWidth) image.srcWidth = object.srcWidth
      if (object.srcHeight) image.srcHeight = object.srcHeight
      return image
    });
  }

  toObject<T extends Omit<Partial<ImageProps> & TClassProperties<this>, keyof SerializedImageProps>, K extends keyof T = never>(propertiesToInclude?: K[] | undefined): Pick<T, K> & SerializedImageProps {
    const object = super.toObject(propertiesToInclude as any[]) as any
    if (object.originWidth) object.width = object.originWidth
    if (object.originHeight) object.height = object.originHeight
    if (this.srcWidth) object.srcWidth = this.srcWidth
    if (this.srcHeight) object.srcHeight = this.srcWidth
    if (object.originScale) object.scaleX = object.scaleY = object.originScale
    return object
  }
}

classRegistry.setClass(SVGImage)


