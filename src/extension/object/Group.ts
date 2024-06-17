import { 
  Object as FabricObject, 
  Group as OriginGroup, 
  classRegistry, 
  TPointerEventInfo, 
  TPointerEvent, 
  util, 
  TOptions, 
  SerializedGroupProps, 
  GroupProps,
  Point,
  LayoutResult
} from 'fabric'

export class Group extends OriginGroup {
  public subTargetCheck = true
  public interactive = false
  public isShow = false

  constructor(objects?: FabricObject[], options?: Partial<GroupProps>, objectsRelativeToGroup?: boolean) {
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
    this.addDeselectedEvent(this as FabricObject)

    // 搜索被双击的目标并激活
    const index = e.subTargets.indexOf(this as FabricObject)
    const prevTarget = e.subTargets[index - 1] ?? e.subTargets[e.subTargets.length - 1]
    this.canvas.setActiveObject(prevTarget)

    this.canvas.requestRenderAll()
  }

  // 空子元素，自动移除组本身
  override _onObjectRemoved(object: FabricObject, removeParentTransform?: boolean): void {
    super._onObjectRemoved(object, removeParentTransform)
    if (this.size() === 0) {
      const parent = this.getParent() as Group
      parent && parent.remove(this as FabricObject)
    }
  }

  static async fromObject<T extends TOptions<SerializedGroupProps>>({ objects = [], ...options}: T) {
    if (options.mask) {
      objects.forEach(obj => obj.groupMask = options.mask)
    }
    return Promise.all([
      util.enlivenObjects<FabricObject>(objects),
      util.enlivenObjectEnlivables(options),
    ]).then(
      ([objects, hydratedOptions]) => new this(objects, { ...options, ...hydratedOptions })
    );
  }

  override drawObject(ctx: CanvasRenderingContext2D): void {
    this._renderBackground(ctx);
    for (let i = 0; i < this._objects.length; i++) {
      // TODO: handle rendering edge case somehow
      if (this.canvas?.preserveObjectStacking && this._objects[i].group !== this) {
        ctx.save();
        ctx.transform(...util.invertTransform(this.calcTransformMatrix()));
        this._objects[i].render(ctx);
        ctx.restore();
      } 
      else if (this._objects[i].group === this) {
        this._objects[i].render(ctx);
      }
    }
    this._drawClipPath(ctx, this.clipPath);
    // this._drawMask(ctx)
  }

  // public getObjectsBoundingBox(
  //   objects: FabricObject[],
  //   ignoreOffset?: boolean
  // ): LayoutResult | null {
  //   if (objects.length === 0) {
  //     return null;
  //   }
  //   const objectBounds: Point[] = [];
  //   objects.forEach((object) => {
  //     const objCenter = object.getRelativeCenterPoint();
  //     let sizeVector = object._getTransformedDimensions().scalarDivide(2);
  //     if (object.angle) {
  //       const rad = util.degreesToRadians(object.angle),
  //         sine = Math.abs(util.sin(rad)),
  //         cosine = Math.abs(util.cos(rad)),
  //         rx = sizeVector.x * cosine + sizeVector.y * sine,
  //         ry = sizeVector.x * sine + sizeVector.y * cosine;
  //       sizeVector = new Point(rx, ry);
  //     }
  //     objectBounds.push(
  //       objCenter.subtract(sizeVector),
  //       objCenter.add(sizeVector)
  //     );
  //   });
  //   const { left, top, width, height } = util.makeBoundingBoxFromPoints(objectBounds);

  //   const size = new Point(width, height),
  //     relativeCenter = (!ignoreOffset ? new Point(left, top) : new Point()).add(size.scalarDivide(2)),
  //     //  we send `relativeCenter` up to group's containing plane
  //     center = relativeCenter.transform(this.calcOwnMatrix());

  //   return {
  //     centerX: center.x,
  //     centerY: center.y,
  //     width: size.x,
  //     height: size.y,
  //   };
  // }
}

classRegistry.setClass(Group)
