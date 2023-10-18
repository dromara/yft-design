
import { Object as FabricObject, CanvasEvents, Canvas, Rect, Textbox } from 'fabric'
import { clone } from 'lodash'
import { check } from '@/utils/check'
import { Disposable } from '@/utils/lifecycle'
import { addDisposableListener } from '@/utils/dom'
import { useMainStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'

/**
 * 对象获得焦点后在外围显示一个边框
 */
export class HoverBorders extends Disposable {
  private canvasEvents

  private lineWidth = 2
  private hoveredTarget: FabricObject | undefined

  constructor(private readonly canvas: Canvas) {
    super()

    this.canvasEvents = {
      'mouse:out': this.drawBorder.bind(this),
      'mouse:over': this.clearBorder.bind(this),
    }

    canvas.on(this.canvasEvents)

    this._register(
      addDisposableListener(this.canvas.upperCanvasEl, 'mouseout', () => {
        if (this.canvas.contextTopDirty && this.hoveredTarget) {
          this.clearContextTop(this.hoveredTarget.group || this.hoveredTarget)
          this.hoveredTarget = undefined
        }
      }),
    )
    this.initWatch()
  }

  private clearContextTop(target: FabricObject, restoreManually = false) {
    const ctx = this.canvas.contextTop
    ctx.save()
    ctx.transform(...this.canvas.viewportTransform)
    target.transform(ctx)
    const { strokeWidth, scaleX, scaleY, strokeUniform } = target
    const zoom = this.canvas.getZoom()
    // we add 4 pixel, to be sure to do not leave any pixel out
    const width = target.width + 4 / zoom + (strokeUniform ? strokeWidth / scaleX : strokeWidth)
    const height = target.height + 4 / zoom + (strokeUniform ? strokeWidth / scaleY : strokeWidth)
    ctx.clearRect(-width / 2, -height / 2, width, height)
    restoreManually || ctx.restore()
    return ctx
  }

  private clearBorder(e: CanvasEvents['mouse:over']) {
    const target = e.target

    this.hoveredTarget = undefined

    if (!target || target === this.canvas._activeObject) return

    this.clearBorderByObject(target)
  }

  private clearBorderByObject(target: FabricObject) {

    if (this.canvas.contextTopDirty) {
      this.clearContextTop(target)
    }
  }

  private drawBorder(e: CanvasEvents['mouse:out']) {
    const target = e.target

    if (!target || target === this.canvas._activeObject) return

    this.drawBorderByObject(target)
  }

  private drawBorderByObject(target: FabricObject) {

    this.hoveredTarget = target

    const ctx = this.clearContextTop(target, true)
    if (!ctx) return

    const object = clone(target)

    // 文字特殊处理，显示下划线
    if (object instanceof Textbox) {
      object.underline = true
      object.fill = 'rgb(60,126,255)'
      object._renderTextDecoration(ctx, 'underline')
      object._drawClipPath(ctx, object.clipPath)
      ctx.restore()
      this.canvas.contextTopDirty = true
      return
    }

    // 分组特殊处理，显示矩形边框
    if (check.isCollection(object)) {
      object._render = Rect.prototype._render
    }

    const { strokeWidth, strokeUniform } = object

    let { width, height } = object

    width += strokeUniform ? strokeWidth / object.scaleX : strokeWidth
    height += strokeUniform ? strokeWidth / object.scaleY : strokeWidth

    const totalObjectScaling = object.getTotalObjectScaling()

    const lineWidth = Math.min(
      this.lineWidth,
      width * totalObjectScaling.x,
      height * totalObjectScaling.y,
    )

    width -= lineWidth / totalObjectScaling.x
    height -= lineWidth / totalObjectScaling.y

    object.set({
      width,
      height,
      stroke: 'rgb(60,126,255)',
      strokeWidth: lineWidth,
      strokeDashArray: null,
      strokeDashOffset: 0,
      strokeLineCap: 'butt',
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
    })

    object._renderPaintInOrder = () => {
      ctx.save()
      const scaling = object.getTotalObjectScaling()
      ctx.scale(1 / scaling.x, 1 / scaling.y)
      object._setLineDash(ctx, object.strokeDashArray)
      object._setStrokeStyles(ctx, object)
      ctx.stroke()
      ctx.restore()
    }

    object._render(ctx)

    ctx.restore()
    this.canvas.contextTopDirty = true
  }

  public initWatch() {
    const mainStore = useMainStore()
    const { hoveredObject, leavedObject } = storeToRefs(mainStore)
    computed(() => {
      if (hoveredObject.value) this.drawBorderByObject(hoveredObject.value as FabricObject)
      else this.clearBorderByObject(leavedObject.value as FabricObject)
    })
  }

  public dispose(): void {
    super.dispose()
    this.canvas.off(this.canvasEvents)
  }
}
