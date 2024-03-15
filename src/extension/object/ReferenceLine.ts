import { Object as FabricObject, Line, classRegistry, TProps, Point, TPointerEventInfo, TPointerEvent } from "fabric"
import { ReferenceLineProps } from "@/types/canvas"
import { FabricCanvas } from "@/app/fabricCanvas";

export class ReferenceLine extends Line {
  static type: string = 'ReferenceLine';
  public axis: string = ''

  constructor(point: number, options: any) {
    // 设置新的点
    // point += 100
    const size = 999999
    const points = options.axis === 'horizontal' ? [-size, point, size, point] : [point, -size, point, size]
    const isHorizontal = options.axis === 'horizontal'
    options[isHorizontal ? 'lockMovementX' : 'lockMovementY'] = true
    super(points as [number, number, number, number], options)
    this.axis = options.axis
    this.initEvent()
    this.hoverCursor = isHorizontal ? 'ns-resize' : 'ew-resize'
  }

  public initEvent() {
    const callback = () => {}

    this.on('mousedown:before', (e) => {
      if (this.activeOn === 'down') {
        this.canvas?.setActiveObject(this, e.e);
      }
    });

    this.on('moving', (e: TPointerEventInfo<TPointerEvent>) => {
      if (this.isPointOnRuler(e.e)) {
        this.moveCursor = 'not-allowed';
      } 
      else {
        this.moveCursor = this.isHorizontal() ? 'ns-resize' : 'ew-resize';
      }
      this.canvas?.fire('referenceline:moving', {
        target: this,
        e: e.e,
      });
    });

    this.on('mouseup', (e) => {
      if (this.isPointOnRuler(e.e)) {
        this.canvas?.remove(this);
        return;
      }
      this.moveCursor = this.isHorizontal() ? 'ns-resize' : 'ew-resize';
      this.selectable = false
      this.canvas?.fire('referenceline:mouseup', {
        target: this,
        e: e.e,
      });
    });

    this.on('removed', () => {
      this.off('removed', callback);
      this.off('mousedown:before', callback);
      this.off('moving', callback);
      this.off('mouseup', callback);
    });
  }

  isHorizontal() {
    return this.height === 0;
  }

  getBoundingRect(absolute?: boolean, calculate?: boolean) {
    this.canvas?.bringObjectToFront(this);
    const isHorizontal = this.isHorizontal();
    const rect = super.getBoundingRect(absolute, calculate)
    rect[isHorizontal ? 'top' : 'left'] += rect[isHorizontal ? 'height' : 'width'] / 2;
    rect[isHorizontal ? 'height' : 'width'] = 0;
    return rect;
  }

  isPointOnRuler(e: any) {
    const isHorizontal = this.isHorizontal();
    const fabricCanvas = this.canvas as FabricCanvas
    const hoveredRuler = fabricCanvas.ruler?.getPointHover(new Point(e.offsetX, e.offsetY));
    if ((isHorizontal && hoveredRuler === 'horizontal') || (!isHorizontal && hoveredRuler === 'vertical')) {
      return hoveredRuler;
    }
    return false;
  }

  async fromObject(options: any): Promise<Line> {
    const isHorizontal = options.height === 0;
    options.xy = isHorizontal ? options.y1 : options.x1;
    options.axis = isHorizontal ? 'horizontal' : 'vertical';
    return await FabricObject._fromObject(options.type, options);
  }
}

classRegistry.setClass(ReferenceLine, 'ReferenceLine')


