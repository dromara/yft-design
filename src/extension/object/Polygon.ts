import { TControlSet } from '@/types/fabric'
import { polygonPositionHandler, anchorWrapper, actionHandler} from '@/app/fabricControls'
import { Object as FabricObject, Point, TransformActionHandler, Control, Polygon as OriginPolygon, classRegistry, XY } from 'fabric'
import { ElementNames } from '@/types/elements'


export class Polygon extends OriginPolygon {

  constructor(points?: XY[], options?: FabricObject<Polygon>) {
    super(points, options)
    this.initControls()
  }

  public initControls() {
    // @ts-ignore
    this.controls = this.points.reduce((acc: TControlSet, point: Point, index: number) => {
      acc[index] = new Control({
        positionHandler: polygonPositionHandler,
        actionHandler: anchorWrapper(index > 0 ? index - 1 : this.points.length - 1, actionHandler) as TransformActionHandler ,
        actionName: 'modifyPolygon',
        pointIndex: index
      })
      return acc
    }, {})
  }

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    if (this.name === ElementNames.ARROW) {
      ctx.save();
      const xDiff = this.points[1].x - this.points[0].x;
      const yDiff = this.points[1].y - this.points[0].y;
      const angle = Math.atan2(yDiff, xDiff);
      ctx.translate((this.points[1].x - this.points[0].x) / 2, (this.points[1].y - this.points[0].y) / 2);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(-5, 5);
      ctx.lineTo(-5, -5);
      ctx.closePath();
      ctx.fillStyle = this.stroke as string;
      ctx.fill();
      ctx.restore();
    }
  }
}

classRegistry.setClass(Polygon)
