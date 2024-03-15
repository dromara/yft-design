import { TControlSet } from '@/types/fabric'
import { anchorWrapper, actionHandler } from '@/app/fabricControls'
import type { Group, Canvas , StaticCanvas , ActiveSelection, TSVGReviver } from 'fabric'
import { Object as FabricObject, Point, TransformActionHandler, Control, Polygon as OriginPolygon, Line as OriginLine, classRegistry, XY, util, controlsUtils } from 'fabric'
import { ElementNames } from '@/types/elements'
import { check } from '@/utils/check'


type VerticalLineCoords = {
  x: number
  y1: number
  y2: number
}

type HorizontalLineCoords = {
  y: number
  x1: number
  x2: number
}

type IgnoreObjTypes<T = keyof FabricObject> = {
  key: T
  value: any
}[]

type ACoordsAppendCenter = NonNullable<FabricObject['aCoords']> & {
  c: Point
}

const Keys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[]
}


export class Line extends OriginLine {
  private canvasEvents

  private aligningLineMargin = 10
  private aligningLineWidth = 1
  private aligningLineColor = '#F68066'

  private verticalLines: VerticalLineCoords[] = []
  private horizontalLines: HorizontalLineCoords[] = []
  private ignoreObjTypes: IgnoreObjTypes = []
  private pickObjTypes: IgnoreObjTypes = []
  public startStyle?: string
  public endStyle?: string
  constructor([x1, y1, x2, y2]: [number, number, number, number], options?: any) {
    super([x1, y1, x2, y2], options)

    const mouseUp = () => {
      if (this.horizontalLines.length || this.verticalLines.length) {
        this.clearGuideline()
        this.clearStretLine()
      }
    }

    this.canvasEvents = {'mouseup': mouseUp}
    this.on(this.canvasEvents)
    // this.initControls()
  }

  public pointMoving(pointIndex: number, point: Point): Point {
    if (!this.canvas?.contextTop) return point
    this.clearStretLine()
    if (!this.canvas) return point
    const transform = this.canvas._currentTransform
    if (!transform) return point

    const activeObjects = this.canvas.getActiveObjects()

    const canvasObjects: FabricObject[] = []
    const add = (group: Group | Canvas | StaticCanvas | ActiveSelection) => {
      const objects = group.getObjects().filter((obj) => {
        if (this.ignoreObjTypes.length) {
          return !this.ignoreObjTypes.some((item) => obj.get(item.key) === item.value)
        }
        if (this.pickObjTypes.length) {
          return this.pickObjTypes.some((item) => obj.get(item.key) === item.value)
        }
        // 排除 自己 和 激活选区内的元素
        if (activeObjects.includes(obj)) {
          return false
        }
        // 排除 隐藏 的元素
        if (!obj.visible) {
          return false
        }
        // 元素为组，把组内元素加入，同时排除组本身
        if (check.isActiveSelection(obj)) {
          add(obj)
          return false
        }
        // 元素为组，把组内元素加入，同时排除组本身
        if (check.isCollection(obj) && this.group && obj === this.group) {
          add(obj)
          return false
        }
        return true
      })
      canvasObjects.push(...objects as FabricObject[])
    }
    const parent = this.getParent() as Group
    if (check.isNativeGroup(parent)) {
      canvasObjects.push(parent)
    }
    add(parent)
    return this.traversAllObjects(pointIndex, point, canvasObjects)
  }

  private clearStretLine() {
    this.verticalLines.length = this.horizontalLines.length = 0
  }

  // public initControls() {
  //   const controls: TControlSet = {
  //     ml: new Control({
  //       x: -0.5,
  //       y: 0,
  //       actionHandler: controlsUtils.scalingXOrSkewingY,
  //       cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
  //       actionName: 'scaling',
  //     }),
  //     mr: new Control({
  //       x: 0.5,
  //       y: 0,
  //       actionHandler: controlsUtils.scalingXOrSkewingY,
  //       cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
  //       actionName: 'scaling',
  //     }),
  //   }
  //   // this.points.forEach((point, index) => {
  //   //   controls[index] = new Control({
  //   //     positionHandler: polygonPositionHandler,
  //   //     actionHandler: anchorWrapper(index > 0 ? index - 1 : this.points.length - 1, actionHandler) as TransformActionHandler ,
  //   //     actionName: 'modifyPolygon',
  //   //     pointIndex: index
  //   //   })
  //   // })
  //   this.controls = controls
  // }

  private traversAllObjects(pointIndex: number, point: Point, canvasObjects: FabricObject[]): Point {
    const objCoordsByMovingDistance = this.getObjDraggingObjCoords() // { tl, tr, bl, br, c }
    const snapXPoints: Set<number> = new Set()
    const snapYPoints: Set<number> = new Set()

    for (let i = canvasObjects.length; i--;) {
      const objCoords = {
        ...this.__getCoords(canvasObjects[i]),
        c: canvasObjects[i].getCenterPoint(),
      } as ACoordsAppendCenter
      const { objHeight, objWidth } = this.getObjMaxWidthHeightByCoords(objCoords)
      Keys(objCoordsByMovingDistance).forEach((activeObjPoint) => {
        const newCoords = canvasObjects[i].angle !== 0 ? this.omitCoords(objCoords, 'horizontal') : objCoords

        function calcHorizontalLineCoords(
          objPoint: keyof ACoordsAppendCenter,
          activeObjCoords: ACoordsAppendCenter,
        ) {
          let x1: number, x2: number
          if (objPoint === 'c') {
            x1 = Math.min(objCoords.c.x - objWidth / 2, activeObjCoords[activeObjPoint].x)
            x2 = Math.max(objCoords.c.x + objWidth / 2, activeObjCoords[activeObjPoint].x)
          } else {
            x1 = Math.min(objCoords[objPoint].x, activeObjCoords[activeObjPoint].x)
            x2 = Math.max(objCoords[objPoint].x, activeObjCoords[activeObjPoint].x)
          }
          return { x1, x2 }
        }

        Keys(newCoords).forEach((objPoint) => {
          if (this.isInRange(objCoordsByMovingDistance[activeObjPoint].y, objCoords[objPoint].y)) {
            const y = objCoords[objPoint].y

            const offset = objCoordsByMovingDistance[activeObjPoint].y - y
            snapYPoints.add(objCoordsByMovingDistance.c.y - offset)

            const aCoords = this.__getCoords(this)
            const { x1, x2 } = calcHorizontalLineCoords(objPoint, {
              ...aCoords,
              c: this.calcCenterPointByACoords(aCoords),
            } as ACoordsAppendCenter)
            this.horizontalLines.push({ y, x1, x2 })
          }
        })
      })

      Keys(objCoordsByMovingDistance).forEach((activeObjPoint) => {
        const newCoords = canvasObjects[i].angle !== 0 ? this.omitCoords(objCoords, 'vertical') : objCoords
        function calcVerticalLineCoords(
          objPoint: keyof ACoordsAppendCenter,
          activeObjCoords: ACoordsAppendCenter,
        ) {
          let y1: number, y2: number
          if (objPoint === 'c') {
            y1 = Math.min(newCoords.c.y - objHeight / 2, activeObjCoords[activeObjPoint].y)
            y2 = Math.max(newCoords.c.y + objHeight / 2, activeObjCoords[activeObjPoint].y)
          } else {
            y1 = Math.min(objCoords[objPoint].y, activeObjCoords[activeObjPoint].y)
            y2 = Math.max(objCoords[objPoint].y, activeObjCoords[activeObjPoint].y)
          }
          return { y1, y2 }
        }

        Keys(newCoords).forEach((objPoint) => {
          if (this.isInRange(objCoordsByMovingDistance[activeObjPoint].x, objCoords[objPoint].x)) {
            const x = objCoords[objPoint].x
            const offset = objCoordsByMovingDistance[activeObjPoint].x - x
            snapXPoints.add(objCoordsByMovingDistance.c.x - offset)
            const aCoords = this.__getCoords(this)
            const { y1, y2 } = calcVerticalLineCoords(objPoint, {
              ...aCoords,
              c: this.calcCenterPointByACoords(aCoords),
            } as ACoordsAppendCenter)
            this.verticalLines.push({ x, y1, y2 })
          }
        })
      })
    }
    return this.snap({
      point,
      snapXPoints,
      snapYPoints,
    })
  }

  private getObjDraggingObjCoords(): ACoordsAppendCenter {
    const coords = this.__getCoords(this)
    const centerPoint = this.calcCenterPointByACoords(coords).subtract(this.getCenterPoint())
    const newCoords = Keys(coords).map((key) => coords[key].subtract(centerPoint))
    return {
      tl: newCoords[0],
      tr: newCoords[1],
      br: newCoords[2],
      bl: newCoords[3],
      c: this.getCenterPoint(),
    }
  }

  private getObjMaxWidthHeightByCoords(coords: ACoordsAppendCenter) {
    const { c, tl, tr } = coords
    const objHeight = Math.max(Math.abs(c.y - tl.y), Math.abs(c.y - tr.y)) * 2
    const objWidth = Math.max(Math.abs(c.x - tl.x), Math.abs(c.x - tr.x)) * 2
    return { objHeight, objWidth }
  }

  private omitCoords(objCoords: ACoordsAppendCenter, type: 'vertical' | 'horizontal') {
    const newCoords = objCoords
    const axis = type === 'vertical' ? 'x' : 'y'
    Keys(objCoords).forEach((key) => {
      if (objCoords[key][axis] < newCoords.tl[axis]) {
        newCoords[key] = objCoords[key]
      }
      if (objCoords[key][axis] > newCoords.tl[axis]) {
        newCoords[key] = objCoords[key]
      }
    })
    return newCoords
  }

  private isInRange(value1: number, value2: number) {
    if (!this.canvas) return false
    return Math.abs(Math.round(value1) - Math.round(value2)) <= this.aligningLineMargin / this.canvas.getZoom()
  }

  private __getCoords(obj: FabricObject) {
    const [tl, tr, br, bl] = obj.getCoords(true)
    return { tl, tr, br, bl }
  }

  private calcCenterPointByACoords(coords: NonNullable<FabricObject['aCoords']>): Point {
    return new Point((coords.tl.x + coords.br.x) / 2, (coords.tl.y + coords.br.y) / 2)
  }

   /**
   * 自动吸附对象
   */
  private snap({
    point,
    snapXPoints,
    snapYPoints,
  }: {
    /** 活动对象的坐标 */
    point: Point
    /** 横向吸附点列表 */
    snapXPoints: Set<number>
    /** 纵向吸附点列表 */
    snapYPoints: Set<number>
  }) {
    if (snapXPoints.size === 0 && snapYPoints.size === 0) return point

    // 获得最近的吸附点
    const sortPoints = (list: Set<number>, originPoint: number): number => {
      if (list.size === 0) {
        return originPoint
      }
      const sortedList = [...list].sort(
        (a, b) => Math.abs(originPoint - a) - Math.abs(originPoint - b),
      )
      return sortedList[0]
    }
    const snapPoint = new Point(sortPoints(snapXPoints, point.x), sortPoints(snapYPoints, point.y))
    return snapPoint
  }

  public setLineMode(value: string, mode: 'start' | 'end') {
    if (mode === 'start') {
      this.startStyle = value
    }
    if (mode === 'end') {
      this.endStyle = value
    }
  }

  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx)
    if (this.endStyle === ElementNames.ARROW) {
      ctx.save();
      const xDiff = (this.x2 - this.x1);
      const yDiff = (this.y2 - this.y1);
      const angle = Math.atan2(yDiff, xDiff);
      ctx.translate(xDiff / 2, yDiff / 2);
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
    // this.drawGuideLines()
  }

  private drawVerticalLine(coords: VerticalLineCoords, movingCoords: ACoordsAppendCenter) {
    // if (!Object.values(movingCoords).some((coord) => Math.abs(coord.x - coords.x) < 0.0001)) return
    this.drawLine(
      coords.x,
      Math.min(coords.y1, coords.y2),
      coords.x,
      Math.max(coords.y1, coords.y2),
    )
  }

  private drawSign(x: number, y: number) {
    if (!this.canvas) return
    const ctx = this.canvas.getTopContext()

    ctx.strokeStyle = this.aligningLineColor
    ctx.beginPath()

    const size = 3
    ctx.moveTo(x - size, y - size)
    ctx.lineTo(x + size, y + size)
    ctx.moveTo(x + size, y - size)
    ctx.lineTo(x - size, y + size)
    ctx.stroke()
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    if (!this.canvas) return
    const ctx = this.canvas.getTopContext()
    const point1 = util.transformPoint(new Point(x1, y1), this.canvas.viewportTransform)
    const point2 = util.transformPoint(new Point(x2, y2), this.canvas.viewportTransform)
    ctx.save()
    ctx.lineWidth = this.aligningLineWidth
    ctx.strokeStyle = this.aligningLineColor
    ctx.beginPath()
    ctx.moveTo(point1.x, point1.y)
    ctx.lineTo(point2.x, point2.y)
    ctx.stroke()
    this.drawSign(point1.x, point1.y)
    this.drawSign(point2.x, point2.y)
    ctx.restore()
    this.dirty = true
  }

  private drawHorizontalLine(coords: HorizontalLineCoords, movingCoords: ACoordsAppendCenter) {
    this.drawLine(
      Math.min(coords.x1, coords.x2),
      coords.y,
      Math.max(coords.x1, coords.x2),
      coords.y,
    )
  }

  private drawGuideLines() {
    if (!this.canvas) return

    const movingCoords = this.getObjDraggingObjCoords()
    if (this.verticalLines.length) {
      for (let i = this.verticalLines.length; i--;) {
        this.drawVerticalLine(this.verticalLines[i], movingCoords)
      }
    }
    if (this.horizontalLines.length) {
      for (let i = this.horizontalLines.length; i--;) {
        this.drawHorizontalLine(this.horizontalLines[i], movingCoords)
      }
    }
    
    this.canvas.calcOffset()
  }

  private clearGuideline() {
    if (!this.canvas) return
    this.dirty = false
    if (!this.canvas.contextTop) return
    this.canvas.clearContext(this.canvas.getTopContext())
  }

  public toSVG(reviver?: TSVGReviver | undefined): string {
    return super.toSVG(reviver)
  }

  public dispose(): void {
    super.dispose()
    this.off(this.canvasEvents)
  }
}

classRegistry.setClass(Line)
