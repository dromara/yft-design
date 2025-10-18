import { Point, Rect, FabricObject } from 'fabric'
import { watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Disposable } from '@/utils/lifecycle'
import useCanvasSwipe from '@/hooks/useCanvasSwipe'
import { useKeyboardStore } from '@/store'
import { useActiveElement, toValue } from '@vueuse/core'
import { FabricCanvas } from './fabricCanvas'
import { CircleNum } from '@/extension/object/CircleNum'

type ToolOption = {
  defaultCursor: string
  skipTargetFind: boolean
  selection: boolean
}

type ToolType = 'move' | 'handMove' | 'shape'


export class FabricTool extends Disposable {

  private options: Record<ToolType, ToolOption> = {
    move: {
      defaultCursor: 'default',
      skipTargetFind: false,
      selection: true,
    },
    handMove: {
      defaultCursor: 'grab',
      skipTargetFind: true,
      selection: false,
    },
    shape: {
      defaultCursor: 'crosshair',
      skipTargetFind: true,
      selection: false,
    },
  }

  private _handMoveActivate = false
  private toolStop?: () => void
  private currentTool: ToolType = 'move'
  private readonly minRectSize = 100

  private get handMoveActivate() {
    return this._handMoveActivate
  }

  private set handMoveActivate(value) {
    this._handMoveActivate = value
  }

  constructor(private readonly canvas: FabricCanvas) {
    super()
    this.initHandMove()
    this.canvas.tool = this
  }

  public applyOption(tool: ToolType) {
    const { defaultCursor, skipTargetFind, selection } = this.options[tool]
    this.canvas.defaultCursor = defaultCursor
    this.canvas.hoverCursor = defaultCursor
    this.canvas.setCursor(defaultCursor)
    this.canvas.skipTargetFind = skipTargetFind
    this.canvas.selection = selection
    this.canvas.upperCanvasEl && (this.canvas.upperCanvasEl.style.cursor = defaultCursor)
  }

  public setTool(tool: ToolType) {
    if (this.currentTool === tool) return
    // 停止上一个工具的事件监听
    this.toolStop?.()
    this.toolStop = undefined
    this.currentTool = tool
    this.applyOption(tool)
    if (tool === 'shape') {
      this.activateShape()
    }
  }

  public getTool(): ToolType {
    return this.currentTool
  }

  private activateShape() {
    const { canvas } = this
    let coordsStart: Point | undefined
    let tempObject: FabricObject | undefined
    const { stop, isSwiping } = useCanvasSwipe({
      onSwipeStart: (e: any) => {
        // 仅左键绘制（MouseEvent.button === 0）
        if (e.e && 'button' in e.e && e.e.button !== 0) return
        /*
         * 只有mouseMove的时候isSwiping才会为true
         * mouseUp会判断isSwiping的值来决定是否执行onSwipeEnd
         * 这里强制设置成true，让点击也可执行onSwipeEnd
         */
        isSwiping.value = true
        // 获得起点（使用 canvas.getPointer，自动考虑缩放和平移）
        const p = canvas.getPointer(e.e)
        coordsStart = new Point(p.x, p.y)
        // 创建形状
        tempObject = new Rect({
          left: coordsStart.x,
          top: coordsStart.y,
          width: 100,
          height: 100,
          scaleX: 0.01,
          scaleY: 0.01,
          fill: 'transparent',
          stroke: 'pink',
          strokeWidth: 2,
          hideOnLayer: true,
        })
        // 不发送ObjectAdded事件
        tempObject.noEventObjectAdded = true
        canvas.add(tempObject)
        // 取消不发送
        tempObject.noEventObjectAdded = false
        // 设置激活对象
        canvas.setActiveObject(tempObject)
      },
      onSwipe: (e: any) => {
        if (!tempObject || !coordsStart) return
        const p = canvas.getPointer(e.e)
        const x1 = coordsStart.x
        const y1 = coordsStart.y
        const x2 = p.x
        const y2 = p.y
        const left = Math.min(x1, x2)
        const top = Math.min(y1, y2)
        const width = Math.max(1, Math.abs(x2 - x1))
        const height = Math.max(1, Math.abs(y2 - y1))
        tempObject.set({
          left,
          top,
          width,
          height,
          scaleX: 1,
          scaleY: 1,
        })
        tempObject.setCoords()
        canvas.requestRenderAll()
      },
      onSwipeEnd: (e) => {
        if (!tempObject) return
        // 重新计算最终尺寸，支持点击未移动的情况
        if (coordsStart) {
          const p = canvas.getPointer(e.e)
          const x1 = coordsStart.x
          const y1 = coordsStart.y
          const x2 = p.x
          const y2 = p.y
          const left = Math.min(x1, x2)
          const top = Math.min(y1, y2)
          const width = Math.max(1, Math.abs(x2 - x1))
          const height = Math.max(1, Math.abs(y2 - y1))

          // 若小于阈值，不创建（移除临时对象）
          if (width < this.minRectSize && height < this.minRectSize) {
            canvas.remove(tempObject)
            canvas.discardActiveObject()
            canvas.requestRenderAll()
            tempObject = undefined
            return
          }

          tempObject.set({
            left,
            top,
            width,
            height,
            scaleX: 1,
            scaleY: 1,
          })
        }

        tempObject.set({ hideOnLayer: false })
        // 通知事件
        if (!tempObject.group) {
          canvas._onObjectAdded(tempObject)
        }
        canvas.fire('selection:updated')
        // 创建一个编号标记，放在矩形左上角外侧
        const rect = tempObject
        const marker = this.createCircleNum(rect)
        canvas.add(marker)
        canvas.requestRenderAll()
        tempObject = undefined
      },
    })
    // 记录停止函数，便于切换工具时移除监听
    this.toolStop = stop
  }

  private createCircleNum(rect: FabricObject) {
    const radius = 12
    const offset = 16 // 圆心距矩形右边缘的水平偏移
    const rectCenterX = (rect.left ?? 0) + (rect.width ?? 0) / 2
    const rectCenterY = (rect.top ?? 0) + (rect.height ?? 0) / 2

    const markerCenterX = (rect.left ?? 0) + (rect.width ?? 0) + offset + radius
    const markerCenterY = rectCenterY

    const angle = Math.atan2(rectCenterY - markerCenterY, rectCenterX - markerCenterX)

    const marker = new CircleNum('1', {
      left: markerCenterX,
      top: markerCenterY,
      originX: 'center',
      originY: 'center',
      radius,
      backgroundFill: '#ff7a45',
      textFill: '#fff',
      hasControls: false,
      pointerAngle: angle,
      rect,
    })
    return marker
  }

  /**
   *鼠标中键拖动视窗
   */
  private initHandMove() {
    const canvas = this.canvas

    /** 鼠标移动开始的vpt */
    let vpt = canvas.viewportTransform
    const { spaceKeyState } = storeToRefs(useKeyboardStore())
    const { lengthX, lengthY, isSwiping } = useCanvasSwipe({
      onSwipeStart: (e: any) => {
        if (e.e.buttons === 2 || (spaceKeyState.value && e.e.buttons === 1)) {
          isSwiping.value = true
          vpt = canvas.viewportTransform
          this.handMoveActivate = true
          this.applyOption('handMove')
          canvas.setCursor('grab')
        }
      },
      onSwipe: () => {
        if (!this.handMoveActivate) return

        canvas.setCursor('grab')

        requestAnimationFrame(() => {
          const deltaPoint = new Point(lengthX.value, lengthY.value).scalarDivide(canvas.getZoom()).transform(vpt).scalarMultiply(-1)
          canvas.absolutePan(deltaPoint, true)
        })
      },
      onSwipeEnd: () => {
        // 恢复鼠标指针
        this.applyOption(spaceKeyState.value ? 'handMove' : this.currentTool)
        if (!this.handMoveActivate) return
        // 关闭 handMove
        if (!spaceKeyState.value) {
          this.handMoveActivate = false
        }
      },
    })

    // 空格键切换移动工具
    const activeElement = useActiveElement()
    const activeElementHasInput = computed(() => activeElement.value?.tagName !== 'INPUT' && activeElement.value?.tagName !== 'TEXTAREA')
    
    
    watch(
      computed(() => [spaceKeyState.value, activeElementHasInput.value].every((i) => toValue(i))),
      (space) => {
        this.applyOption(space ? 'handMove' : this.currentTool)
        if (isSwiping.value) return
        this.handMoveActivate = space
      },
    )
  }
}
