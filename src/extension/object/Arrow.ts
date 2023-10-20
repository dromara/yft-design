import { TControlSet } from '@/types/fabric'
import { polygonPositionHandler, anchorWrapper, actionHandler} from '@/app/fabricControls'
import { Point, TransformActionHandler, Control, Polygon as OriginPolygon, classRegistry, FabricObjectProps, XY } from 'fabric'


export class Arrow extends OriginPolygon {

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

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    ctx.save();
    const xDiff = this.points[1].x - this.points[0].x;
    const yDiff = this.points[1].y - this.points[0].y;
    const angle = Math.atan2(yDiff, xDiff);
    ctx.translate((this.points[1].x - this.points[0].x) / 2, (this.points[1].y - this.points[1].y) / 2);
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

classRegistry.setClass(Arrow, 'Arrow')
