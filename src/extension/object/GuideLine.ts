import { Object as FabricObject, Line, classRegistry, TProps } from "fabric"
import { GuideLineProps } from "@/types/canvas"

export class GuideLine extends Line {
  
  // public type = 'guideline'

  constructor(point: number, options: GuideLineProps) {
    // 设置新的点
    // point += 100
    const size = 500
    const points = options.axis === 'horizontal' ? [-size, point, size, point] : [point, -size, point, size];
    const isHorizontal = options.axis === 'horizontal';
    options[isHorizontal ? 'lockMovementX' : 'lockMovementY'] = true;
    // options.type = 'guideline'
    super(points as [number, number, number, number], options)
    // this.init(point, options)
    // console.log('init:', 'init')
    this.type = 'guideline'
    this.hoverCursor = isHorizontal ? 'ns-resize' : 'ew-resize';
  }

  public init(points: number, options: GuideLineProps) {
    
    // 指针
    
    
    // // 锁定移动
    // options[isHorizontal ? 'lockMovementX' : 'lockMovementY'] = true;
    // 调用父类初始化
    // this.init(newPoints, options);

    // 绑定事件
    this.on('mousedown:before', (e) => {
      if (this.activeOn === 'down') {
        // 设置selectable:false后激活对象才能进行移动
        this.canvas?.setActiveObject(this, e.e);
      }
    });

    this.on('moving', (e) => {
      // if (this.isPointOnRuler(e.e)) {
      //   this.moveCursor = 'not-allowed';
      // } else {
      //   this.moveCursor = this.isHorizontal() ? 'ns-resize' : 'ew-resize';
      // }
      // this.canvas?.fire('guideline:moving', {
      //   target: this,
      //   e: e.e,
      // });
    });

    this.on('mouseup', (e) => {
      // // 移动到标尺上，移除辅助线
      // if (this.isPointOnRuler(e.e)) {
      //   // console.log('移除辅助线', this);
      //   this.canvas?.remove(this);
      //   return;
      // }
      // this.moveCursor = this.isHorizontal() ? 'ns-resize' : 'ew-resize';
      // this.canvas?.fire('guideline:mouseup', {
      //   target: this,
      //   e: e.e,
      // });
    });

    // this.on('removed', () => {
    //   this.off('mousedown:before')
    //   this.off('removed');
    //   this.off('mousedown:before');
    //   this.off('moving');
    //   this.off('mouseup');
    // });
  }
}

classRegistry.setClass(GuideLine, 'GuideLine')


