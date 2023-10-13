import { Object as FabricObject, Polygon as OriginPolygon, classRegistry, TPointerEventInfo, TPointerEvent, FabricObjectProps, XY } from 'fabric'

export class Polygon extends OriginPolygon {

  constructor(points?: XY[], options?: Partial<FabricObjectProps>) {
    super(points, options)
    this.on('mousedblclick', this.doubleClickHandler.bind(this))
  }

  /**
   * 绑定target的deselected事件，在target被取消激活后，关闭组的interactive
   */
  public addDeselectedEvent(target: FabricObject) {
    target.once('deselected', () => {
      console.log('group deselected')
      const activeObject = this.canvas?.getActiveObject()
      if (!activeObject) {
        // 关闭
        this.set({interactive: false, objectCaching: true,})
      } else {
        // 事件传递
        this.addDeselectedEvent(activeObject)
      }
    })
  }

  /**
   * 组内元素被激活
   */
//   public onActiveTarget(target: FabricObject) {
//     if (!this.canvas || !target.group || target.group.interactive) return
//     target.getAncestors(true).forEach((_group) => {
//       const group = _group as Group
//       if (group.interactive) return
//       group.set({ interactive: true, objectCaching: false,})
//       group.addDeselectedEvent(target)
//     })
//   }

  /**
   * 双击后启用interactive，离开组后关闭
   */
  public doubleClickHandler(e: TPointerEventInfo<TPointerEvent>) {
    console.log('dbclick')
    if (!this.canvas || !e.target || e.target !== this) return
    console.log('dbclick')
    // 启用
    this.set({interactive: true, objectCaching: false})

    // 绑定事件
    this.addDeselectedEvent(this)

    // 搜索被双击的目标并激活
    // const index = e.subTargets.indexOf(this)
    // const prevTarget = e.subTargets[index - 1] ?? e.subTargets[e.subTargets.length - 1]
    // this.canvas.setActiveObject(prevTarget)

    this.canvas.requestRenderAll()
  }
}

classRegistry.setClass(Polygon)
