// import { FabricCanvas, IFabricCanvas } from '@/core/canvas/fabricCanvas'
import { Disposable } from '@/utils/lifecycle'
import { watchEffect } from 'vue'
// import { useThemes } from '@/hooks/useThemes'
import { PiBy180 } from '@/utils/common'
import { TAxis, Canvas } from 'fabric'

type Rect = { left: number; top: number; width: number; height: number }

/**
 * 配置
 */
export interface RulerOptions {
  /**
   * 标尺宽高
   * @default 20
   */
  ruleSize?: number

  /**
   * 字体大小
   * @default 10
   */
  fontSize?: number

  /**
   * 是否开启标尺
   * @default false
   */
  enabled?: boolean

  /**
   * 背景颜色
   */
  backgroundColor?: string

  /**
   * 文字颜色
   */
  textColor?: string

  /**
   * 边框颜色
   */
  borderColor?: string

  /**
   * 高亮颜色
   */
  highlightColor?: string
}

export type HighlightRect = {
  skip?: TAxis
} & Rect

export class Ruler extends Disposable {
  private canvasEvents

  /**
   * 配置
   */
  public options: Required<RulerOptions>

  /**
   * 选取对象矩形坐标
   */
  private objectRect:
    | undefined
    | {
        x: HighlightRect[]
        y: HighlightRect[]
      }

  constructor(private readonly canvas: Canvas) {
    super()

    // 合并默认配置
    this.options = Object.assign({
      ruleSize: 24,
      fontSize: 10,
      enabled: true,
    })

    // const { isDark } = useThemes()
    const isDark = false

    watchEffect(() => {
      this.options = {
        ...this.options,
        ...(isDark
          ? {
              backgroundColor: '#242424',
              borderColor: '#555',
              highlightColor: '#165dff3b',
              textColor: '#ddd',
            }
          : {
              backgroundColor: '#fff',
              borderColor: '#ccc',
              highlightColor: '#165dff3b',
              textColor: '#444',
            }),
      }
      this.render({ ctx: this.canvas.contextContainer })
    })

    this.canvasEvents = {
      'after:render': this.render.bind(this),
    }

    // this.keybinding.bind('shift+r', () => {
    //   this.enabled = !this.enabled
    // })

    this.enabled = this.options.enabled
  }

  public get enabled() {
    return this.options.enabled
  }

  public set enabled(value) {
    this.options.enabled = value
    if (value) {
      this.canvas.on(this.canvasEvents)
      this.render({ ctx: this.canvas.contextContainer })
    } else {
      this.canvas.off(this.canvasEvents)
      this.canvas.requestRenderAll()
    }
  }

  /**
   * 获取画板尺寸
   */
  private getSize() {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
    }
  }

  private render({ ctx }: { ctx: CanvasRenderingContext2D }) {
    if (ctx !== this.canvas.contextContainer) return

    const { viewportTransform: vpt } = this.canvas

    // 计算元素矩形
    this.calcObjectRect()

    // 绘制尺子
    this.draw({
      ctx,
      isHorizontal: true,
      rulerLength: this.getSize().width,
      startCalibration: -(vpt[4] / vpt[0]),
    })
    this.draw({
      ctx,
      isHorizontal: false,
      rulerLength: this.getSize().height,
      startCalibration: -(vpt[5] / vpt[3]),
    })

    const { borderColor, backgroundColor, ruleSize, textColor } = this.options

    this.darwRect(ctx, {
      left: 0,
      top: 0,
      width: ruleSize,
      height: ruleSize,
      fill: backgroundColor,
      stroke: borderColor,
    })

    this.darwText(ctx, {
      text: 'px',
      left: ruleSize / 2,
      top: ruleSize / 2,
      align: 'center',
      baseline: 'middle',
      fill: textColor,
    })
  }

  private draw(opt: {
    ctx: CanvasRenderingContext2D
    isHorizontal: boolean
    rulerLength: number
    startCalibration: number
  }) {
    const { ctx, isHorizontal, rulerLength, startCalibration } = opt
    const zoom = this.canvas.getZoom()

    const gap = this.getGap(zoom)
    const unitLength = Math.ceil(rulerLength / zoom)
    const startValue = Math.floor(startCalibration / gap) * gap
    const startOffset = startValue - startCalibration

    const canvasSize = this.getSize()

    const { textColor, borderColor, ruleSize, highlightColor } = this.options

    // 文字顶部偏移
    const padding = 2.5

    // 背景
    this.darwRect(ctx, {
      left: 0,
      top: 0,
      width: isHorizontal ? canvasSize.width : ruleSize,
      height: isHorizontal ? ruleSize : canvasSize.height,
      fill: this.options.backgroundColor,
      stroke: this.options.borderColor,
    })

    // 标尺刻度线显示
    for (let pos = 0; pos + startOffset <= unitLength; pos += gap) {
      for (let index = 0; index < 10; index++) {
        const position = Math.round((startOffset + pos + (gap * index) / 10) * zoom)
        const isMajorLine = index === 0
        const [left, top] = isHorizontal
          ? [position, isMajorLine ? 0 : ruleSize - 8]
          : [isMajorLine ? 0 : ruleSize - 8, position]
        const [width, height] = isHorizontal ? [0, ruleSize - top] : [ruleSize - left, 0]
        this.darwLine(ctx, {
          left,
          top,
          width,
          height,
          stroke: borderColor,
        })
      }
    }

    // 标尺蓝色遮罩
    if (this.objectRect) {
      const axis = isHorizontal ? 'x' : 'y'
      this.objectRect[axis].forEach((rect) => {
        // 跳过指定矩形
        if (rect.skip === axis) {
          return
        }

        const [left, top, width, height] = isHorizontal
          ? [(rect.left - startCalibration) * zoom, 0, rect.width * zoom, ruleSize]
          : [0, (rect.top - startCalibration) * zoom, ruleSize, rect.height * zoom]

        // 高亮遮罩
        // ctx.save()
        this.darwRect(ctx, {
          left,
          top,
          width,
          height,
          fill: highlightColor,
        })
        // ctx.restore()
      })
    }

    // 标尺文字显示
    for (let pos = 0; pos + startOffset <= unitLength; pos += gap) {
      const position = (startOffset + pos) * zoom
      const textValue = (startValue + pos).toString()

      const [left, top, angle] = isHorizontal
        ? [position + 6, padding, 0]
        : [padding, position - 6, -90]

      this.darwText(ctx, {
        text: textValue,
        left,
        top,
        fill: textColor,
        angle,
      })
    }
    // draw end
  }

  private getGap(zoom: number) {
    const zooms = [0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
    const gaps = [5000, 2500, 1000, 500, 200, 100, 50, 20, 10]

    let i = 0
    while (i < zooms.length && zooms[i] < zoom) {
      i++
    }

    return gaps[i - 1] || 10000
  }

  private darwRect(
    ctx: CanvasRenderingContext2D,
    {
      left,
      top,
      width,
      height,
      fill,
      stroke,
      strokeWidth,
    }: {
      left: number
      top: number
      width: number
      height: number
      fill?: string | CanvasGradient | CanvasPattern
      stroke?: string
      strokeWidth?: number
    },
  ) {
    ctx.save()
    ctx.beginPath()
    fill && (ctx.fillStyle = fill)
    ctx.rect(left, top, width, height)
    ctx.fill()
    if (stroke) {
      ctx.strokeStyle = stroke
      ctx.lineWidth = strokeWidth ?? 1
      ctx.stroke()
    }
    ctx.restore()
  }

  private darwText(
    ctx: CanvasRenderingContext2D,
    {
      left,
      top,
      text,
      fill,
      align,
      angle,
      fontSize,
      baseline,
    }: {
      left: number
      top: number
      text: string
      fill?: string | CanvasGradient | CanvasPattern
      align?: CanvasTextAlign
      baseline?: CanvasTextBaseline
      angle?: number
      fontSize?: number
    },
  ) {
    ctx.save()
    fill && (ctx.fillStyle = fill)
    ctx.textAlign = align ?? 'left'
    ctx.textBaseline = baseline ?? 'top'
    ctx.font = `${fontSize ?? 12}px Helvetica`
    if (angle) {
      ctx.translate(left, top)
      ctx.rotate(PiBy180 * angle)
      ctx.translate(-left, -top)
    }
    ctx.fillText(text, left, top)
    ctx.restore()
  }

  private darwLine(
    ctx: CanvasRenderingContext2D,
    {
      left,
      top,
      width,
      height,
      stroke,
      lineWidth,
    }: {
      left: number
      top: number
      width: number
      height: number
      stroke?: string | CanvasGradient | CanvasPattern
      lineWidth?: number
    },
  ) {
    ctx.save()
    ctx.beginPath()
    stroke && (ctx.strokeStyle = stroke)
    ctx.lineWidth = lineWidth ?? 1
    ctx.moveTo(left, top)
    ctx.lineTo(left + width, top + height)
    ctx.stroke()
    ctx.restore()
  }

  private calcObjectRect() {
    const activeObjects = this.canvas.getActiveObjects()
    if (activeObjects.length === 0) {
      this.objectRect = undefined
      return
    }
    const allRect = activeObjects.reduce((rects, obj) => {
      const rect: HighlightRect = obj.getBoundingRect(true)
      // if (obj instanceof fabric.GuideLine) {
      //   rect.skip = obj.isHorizontal() ? 'x' : 'y'
      // }
      rects.push(rect)
      return rects
    }, [] as HighlightRect[])
    if (allRect.length === 0) return
    this.objectRect = {
      x: this.mergeLines(allRect, true),
      y: this.mergeLines(allRect, false),
    }
  }

  private mergeLines(rect: Rect[], isHorizontal: boolean) {
    const axis = isHorizontal ? 'left' : 'top'
    const length = isHorizontal ? 'width' : 'height'
    // 先按照 axis 的大小排序
    rect.sort((a, b) => a[axis] - b[axis])
    const mergedLines = []
    let currentLine = Object.assign({}, rect[0])
    for (let i = 1; i < rect.length; i++) {
      const line = Object.assign({}, rect[i])
      if (currentLine[axis] + currentLine[length] >= line[axis]) {
        // 当前线段和下一个线段相交，合并宽度
        currentLine[length] =
          Math.max(currentLine[axis] + currentLine[length], line[axis] + line[length]) -
          currentLine[axis]
      } else {
        // 当前线段和下一个线段不相交，将当前线段加入结果数组中，并更新当前线段为下一个线段
        mergedLines.push(currentLine)
        currentLine = Object.assign({}, line)
      }
    }
    // 加入数组
    mergedLines.push(currentLine)
    return mergedLines
  }

  public dispose(): void {
    super.dispose()
    this.enabled = false
  }
}
