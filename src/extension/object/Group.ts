import { Object as FabricObject, Group as OriginGroup, classRegistry, TPointerEventInfo, TPointerEvent, GroupProps } from 'fabric'

export class Group extends OriginGroup {
  public subTargetCheck = true
  public interactive = false
  public isShow = false

  constructor(objects?: FabricObject[], options?: FabricObject<Group>, objectsRelativeToGroup?: boolean) {
    super(objects, options, objectsRelativeToGroup)
    this.on('mousedblclick', this.doubleClickHandler.bind(this))
  }

  /**
   * 绑定target的deselected事件，在target被取消激活后，关闭组的interactive
   */
  public addDeselectedEvent(target: FabricObject) {
    target.once('deselected', () => {
      const activeObject = this.canvas?.getActiveObject()
      if (!activeObject || !activeObject.getAncestors(true).includes(this)) {
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
  public onActiveTarget(target: FabricObject) {
    if (!this.canvas || !target.group || target.group.interactive) return
    target.getAncestors(true).forEach((_group) => {
      const group = _group as Group
      if (group.interactive) return
      group.set({ interactive: true, objectCaching: false,})
      group.addDeselectedEvent(target)
    })
  }

  /**
   * 双击后启用interactive，离开组后关闭
   */
  public doubleClickHandler(e: TPointerEventInfo<TPointerEvent>) {
    if (!this.canvas || !e.target || e.target !== this || !e.subTargets || e.subTargets.length === 0 || this.interactive) return

    // 启用
    this.set({interactive: true, objectCaching: false})

    // 绑定事件
    this.addDeselectedEvent(this)

    // 搜索被双击的目标并激活
    const index = e.subTargets.indexOf(this)
    const prevTarget = e.subTargets[index - 1] ?? e.subTargets[e.subTargets.length - 1]
    this.canvas.setActiveObject(prevTarget)

    this.canvas.requestRenderAll()
  }

  // 空子元素，自动移除组本身
  override _onObjectRemoved(object: FabricObject, removeParentTransform?: boolean): void {
    super._onObjectRemoved(object, removeParentTransform)
    if (this.size() === 0) {
      const parent = this.getParent() as Group
      parent && parent.remove(this)
    }
  }
}

classRegistry.setClass(Group)
