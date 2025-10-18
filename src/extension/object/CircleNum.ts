import { Path as OriginPath, PathProps, classRegistry, FabricObject } from 'fabric'


type CircleNumInitOptions = Partial<PathProps> & {
  radius?: number
  backgroundFill?: string
  backgroundStroke?: string
  backgroundStrokeWidth?: number
  textFill?: string
  fontSize?: number
  // 指向三角形配置
  pointerAngle?: number // 弧度：0 向右
  pointerLength?: number
  pointerWidth?: number,
  rect?: FabricObject
}

/**
 * 圆形编号标记：由一个圆与居中文本组成
 * - 支持序列化/反序列化（继承 Group 的 fromObject）
 * - 支持直接传入数字/字符串创建
 */
export class CircleNum extends OriginPath {
  public num: string = ''
  public pointerAngle: number = 0
  public radius: number = 12
  public textFill: string = '#ffffff'
  public fontSize: number = 14
  public rect?: FabricObject
  static type = 'CircleNum'
  private handleUpdateAngle = () => this.updatePointerAngleToRect()
  constructor(numOrOptions?: string | number | CircleNumInitOptions, opts?: CircleNumInitOptions) {
  
    
    const num = typeof numOrOptions === 'string' || typeof numOrOptions === 'number' ? String(numOrOptions) : ''
    const options: CircleNumInitOptions = (typeof numOrOptions === 'object' ? numOrOptions : opts) || {}

    const radius = options.radius ?? 12
    const angle = options.pointerAngle ?? 0
    const pointerLength = options.pointerLength ?? Math.max(6, Math.round(radius * 0.8))
    const pointerWidth = options.pointerWidth ?? Math.max(6, Math.round(radius * 0.9))

    const path = CircleNum.buildCirclePath(radius)

    super(path, {
      // 圆仅使用描边，宽度由 strokeWidth 控制
      fill: 'transparent',
      stroke: options.backgroundStroke ?? options.backgroundFill ?? '#ff7a45',
      strokeWidth: options.backgroundStrokeWidth ?? 2,
      originX: 'center',
      originY: 'center',
      ...options,
    })
    this.rect = options.rect
    this.num = num
    this.pointerAngle = angle
    this.radius = radius
    this.textFill = options.textFill ?? (options.backgroundFill ?? '#ff7a45')
    this.fontSize = options.fontSize ?? Math.round(radius * 1.1)
    this.name = this.name ?? 'CircleNum'
    // 绑定事件：自身或目标移动时，更新指向角度
    this.on('moving', this.handleUpdateAngle)
    if (this.rect) {
      this.rect.on('moving', this.handleUpdateAngle)
    }
    // 初始化一次
    this.updatePointerAngleToRect()
  }

  static buildCirclePath(radius: number): string {
    const r = radius
    const f = (n: number) => Number(n.toFixed(2))
    return [`M ${f(r)} 0`, `A ${f(r)} ${f(r)} 0 1 0 ${f(-r)} 0`, `A ${f(r)} ${f(r)} 0 1 0 ${f(r)} 0`, 'Z'].join(' ')
  }

  private computePointerPoints(pointerWidth: number, pointerLength: number, angle: number) {
    const rOuter = this.radius + (this.strokeWidth || 0) / 2
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const halfChord = Math.min(pointerWidth / 2, rOuter) // 防止超过直径
    const delta = Math.asin(Math.min(1, halfChord / rOuter))
    const a1 = angle - delta
    const a2 = angle + delta
    const p1x = rOuter * Math.cos(a1)
    const p1y = rOuter * Math.sin(a1)
    const p2x = rOuter * Math.cos(a2)
    const p2y = rOuter * Math.sin(a2)
    const tipX = (rOuter + pointerLength) * cos
    const tipY = (rOuter + pointerLength) * sin
    return { p1x, p1y, p2x, p2y, tipX, tipY, rOuter, a1, a2 }
  }

  // 在 Path 的渲染后绘制文本
  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx)
    ctx.save()
    // 绘制实心三角（与圆外侧相切，底边为圆弧）
    const width = Math.max(6, Math.round(this.radius * 0.9))
    const length = Math.max(6, Math.round(this.radius * 0.8))
    const { p1x, p1y, p2x, p2y, tipX, tipY, rOuter, a1, a2 } = this.computePointerPoints(width, length, this.pointerAngle)
    ctx.beginPath()
    ctx.moveTo(p1x, p1y)
    ctx.lineTo(tipX, tipY)
    ctx.lineTo(p2x, p2y)
    // 从 p2 沿圆外侧逆时针回到 p1，形成贴合的弧形底边
    ctx.arc(0, 0, rOuter, a2, a1, true)
    ctx.closePath()
    ctx.fillStyle = (this.stroke as any) || '#ff7a45'
    ctx.fill()

    ctx.fillStyle = '#ff7a45'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `${this.fontSize}px sans-serif`
    ctx.fillText(this.num, 0, 0)
    ctx.restore()
  }

  private updatePointerAngleToRect() {
    if (!this.rect) return
    const rc = this.rect.getCenterPoint()
    const mc = this.getCenterPoint()
    this.pointerAngle = Math.atan2(rc.y - mc.y, rc.x - mc.x)
    this.canvas?.requestRenderAll()
  }

  // 使用宽松签名以兼容 fabric 的泛型 toObject 定义
  toObject(propertiesToInclude?: any) {
    const base = (super.toObject as any)(propertiesToInclude)
    return { ...base, num: this.num, pointerAngle: this.pointerAngle, radius: this.radius, textFill: this.textFill, fontSize: this.fontSize }
  }
}

classRegistry.setClass(CircleNum, 'CircleNum')


