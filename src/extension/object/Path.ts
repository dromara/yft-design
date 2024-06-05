import { Object as FabricObject, Path as OriginPath, classRegistry, PathProps, TOptions, SerializedPathProps, util } from "fabric"
import { getPathMask } from "../effects/path.mask";

export class Path extends OriginPath {
  constructor(path: string | [], options?: FabricObject<PathProps>) {
    super(path, options)
  }

  static async fromObject<T extends TOptions<SerializedPathProps>>(object: T) {
    const path = await this._fromObject<Path>(object, {extraParam: 'path'});
    if (object.mask) {
      const image = await getPathMask(path)
      if (image) {
        path.visible = true
        path.canvas?.add(image)
      }
    }
    return path
  }
  
}

classRegistry.setClass(Path)
classRegistry.setSVGClass(Path)