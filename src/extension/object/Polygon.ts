import { TControlSet } from '@/types/fabric'
import { polygonPositionHandler, anchorWrapper, actionHandler} from '@/app/fabricControls'
import { Object as FabricObject, Point, TransformActionHandler, Control, Polygon as OriginPolygon, classRegistry, FabricObjectProps, XY } from 'fabric'


export class Polygon extends OriginPolygon {

  constructor(points?: XY[], options?: FabricObject<Polygon>) {
    super(points, options)
    this.initControls()
  }

  public initControls() {
    // @ts-ignore
    const controls = this.points.reduce((acc: TControlSet, point: Point, index: number) => {
      console.log('index:', index, this.points.length)
      acc[index] = new Control({
        positionHandler: polygonPositionHandler,
        actionHandler: anchorWrapper(index > 0 ? index - 1 : this.points.length - 1, actionHandler) as TransformActionHandler ,
        actionName: 'modifyPolygon',
        // @ts-ignore
        pointIndex: index
      })
      return acc
    }, {})
    console.log('controls:', controls)
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
