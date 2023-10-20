import { TControlSet } from '@/types/fabric'
import { polygonPositionHandler, anchorWrapper, actionHandler} from '@/app/fabricControls'
import { Object as FabricObject, Point, TransformActionHandler, Control, Line as OriginLine, classRegistry, FabricObjectProps, XY } from 'fabric'


export class Arrow extends OriginLine {

  constructor([x1, y1, x2, y2]: [number, number, number, number], options?: FabricObject<OriginLine>) {
    super([x1, y1, x2, y2], options)
    this.initControls()
  }

  /**
   * 绑定target的deselected事件，在target被取消激活后，关闭组的interactive
   */
  public initControls() {
    const firstControl = new Control({
      positionHandler: polygonPositionHandler,
      actionHandler: anchorWrapper(1, actionHandler) as TransformActionHandler ,
      actionName: 'modifyArrow',
      // @ts-ignore
      pointIndex: 0
    })
    const secondControl = new Control({
      positionHandler: polygonPositionHandler,
      actionHandler: anchorWrapper(0, actionHandler) as TransformActionHandler ,
      actionName: 'modifyArrow',
      // @ts-ignore
      pointIndex: 1
    })
    // // @ts-ignore
    // this.controls = this.points.reduce((acc: TControlSet, point: Point, index: number) => {
    //   acc[index] = new Control({
    //     positionHandler: polygonPositionHandler,
    //     actionHandler: anchorWrapper(index > 0 ? index - 1 : this.points.length - 1, actionHandler) as TransformActionHandler ,
    //     actionName: 'modifyPolygon',
    //     // @ts-ignore
    //     pointIndex: index
    //   })
    //   return acc
    // }, {})
    this.controls = {0: firstControl, 1: secondControl}
  }

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    ctx.save();
    const xDiff = this.x2 - this.x1;
    const yDiff = this.y2 - this.y1;
    const angle = Math.atan2(yDiff, xDiff);
    ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
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
