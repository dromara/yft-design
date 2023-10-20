import { TControlSet } from '@/types/fabric'
import { polygonPositionHandler, anchorWrapper, actionHandler} from '@/app/fabricControls'
import { Object as FabricObject, Point, TransformActionHandler, Control, Line as OriginLine, classRegistry } from 'fabric'


export class Line extends OriginLine {

  constructor([x1, y1, x2, y2]: [number, number, number, number], options?: FabricObject<Line>) {
    super([x1, y1, x2, y2], options)
    this.initControls()
  }

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

classRegistry.setClass(Line)
