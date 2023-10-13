import { Point, TransformActionHandler, Control, Polygon as OriginPolygon, classRegistry, FabricObjectProps, XY } from 'fabric'
import { polygonPositionHandler, anchorWrapper, actionHandler} from '@/extension/controls/index'
import { TControlSet } from '@/types/fabric'

export class Polygon extends OriginPolygon {

  constructor(points?: XY[], options?: Partial<FabricObjectProps>) {
    super(points, options)
    this.initControls()
  }

  /**
   * 绑定target的deselected事件，在target被取消激活后，关闭组的interactive
   */
  public initControls() {
    // @ts-ignore
    this.controls = this.points.reduce((acc: TControlSet, point: Point, index: number) => {
      acc[index] = new Control({
        positionHandler: polygonPositionHandler,
        actionHandler: anchorWrapper(index > 0 ? index - 1 : this.points.length - 1, actionHandler) as TransformActionHandler ,
        actionName: 'modifyPolygon',
        // @ts-ignore
        pointIndex: index
      })
      return acc
    }, {})
  }
}

classRegistry.setClass(Polygon)
