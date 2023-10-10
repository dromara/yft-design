import { Point, Canvas } from 'fabric'
import { watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Disposable } from '@/utils/lifecycle'
import { useFabricSwipe } from '@/hooks/useCanvasSwipe'
import { useKeyboardStore } from '@/store'
import { useActiveElement, toValue } from '@vueuse/core'


type ToolOption = {
  defaultCursor: string
  skipTargetFind: boolean
  selection: boolean
}

type ToolType = 'move' | 'handMove' | 'shape'


export class PressKey extends Disposable {

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

  private get handMoveActivate() {
    return this._handMoveActivate
  }

  private set handMoveActivate(value) {
    this._handMoveActivate = value
  }

  constructor(private readonly canvas: Canvas) {
    super()
    this.initHandMove()
  }

  private applyOption(tool: ToolType) {
    const { defaultCursor, skipTargetFind, selection } = this.options[tool]

    this.canvas.defaultCursor = defaultCursor
    this.canvas.setCursor(defaultCursor)
    this.canvas.skipTargetFind = skipTargetFind
    this.canvas.selection = selection
  }

  /**
   *鼠标中键拖动视窗
   */
  private initHandMove() {
    const canvas = this.canvas

    /** 鼠标移动开始的vpt */
    let vpt = canvas.viewportTransform
    const { spaceKeyState } = storeToRefs(useKeyboardStore())
    const { lengthX, lengthY, isSwiping } = useFabricSwipe({
      onSwipeStart: (e) => {
        
        if (e.button === 2 || (spaceKeyState.value && e.button === 1)) {
          isSwiping.value = true
          vpt = canvas.viewportTransform
          this.handMoveActivate = true
          // this.applyOption('handMove')
          // canvas.setCursor('grab')
        }
      },
      onSwipe: () => {
        if (!this.handMoveActivate) return

        canvas.setCursor('grab')

        requestAnimationFrame(() => {
          const deltaPoint = new Point(lengthX.value, lengthY.value).scalarDivide(canvas.getZoom()).transform(vpt).scalarMultiply(-1)
          canvas.absolutePan(deltaPoint)
        })
      },
      onSwipeEnd: () => {
        // 恢复鼠标指针
        this.applyOption(spaceKeyState.value ? 'handMove' : 'move')
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
        this.applyOption(space ? 'handMove' : 'move')
        if (isSwiping.value) return
        this.handMoveActivate = space
      },
    )
  }
}
