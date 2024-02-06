import { getImageSize } from '@/utils/image'
import { Image, Point, Object as FabricObject, util, classRegistry, TPointerEventInfo, TPointerEvent, ImageProps, TClassProperties, ImageSource } from 'fabric'

export class SVGImage extends Image {
  
  constructor(element: ImageSource, options?: FabricObject<ImageProps>) {
    super(element, { filters: [], ...options });
  }

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
  }
  
  static async fromURL(url: string, options: any = {}): Promise<Image> {
    const { width, height } = await getImageSize(url)
    options.scaleX = options.width / width
    options.scaleY = options.height / height
    return util.loadImage(url, options).then((img) => new this(img, options));
  }

  static async fromObject({ filters: f, resizeFilter: rf, src, crossOrigin, ...object }: any, options: { signal: AbortSignal }): Promise<Image> {
    const { width, height } = await getImageSize(src)
    object.scaleX = object.width / width
    object.scaleY = object.height / height
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


