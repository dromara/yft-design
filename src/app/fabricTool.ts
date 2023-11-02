import { Point, Canvas, Object as FabricObject } from 'fabric'
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

  // private switchShape(shape: 'board' | 'rect' | 'ellipse' | 'triangle' | 'text') {
  //   const { canvas } = this
  //   let coordsStart: Point | undefined
  //   let tempObject: FabricObject | undefined
  //   const { stop, isSwiping } = useFabricSwipe({
  //     onSwipeStart: (e) => {
  //       if (e.button !== 1 || this.space.value) return
  //       /*
  //        * 只有mouseMove的时候isSwiping才会为true
  //        * mouseUp会判断isSwiping的值来决定是否执行onSwipeEnd
  //        * 这里强制设置成true，让点击也可执行onSwipeEnd
  //        */
  //       isSwiping.value = true
  //       // 获得坐标
  //       coordsStart = e.pointer
  //       // 创建形状
  //       switch (shape) {
  //         case 'board':
  //           tempObject = new Board([], {
  //             fill: '',
  //           })
  //           break
  //         case 'rect':
  //           tempObject = new Rect({})
  //           break
  //         case 'ellipse':
  //           tempObject = new Ellipse({
  //             rx: 50,
  //             ry: 50,
  //           })
  //           break
  //         case 'triangle':
  //           tempObject = new Triangle({})
  //           break
  //         case 'text':
  //           tempObject = new Textbox('', {})
  //           break
  //       }
  //       tempObject.set({
  //         left: coordsStart.x,
  //         top: coordsStart.y,
  //         width: 100,
  //         height: 100,
  //         scaleX: 0.01,
  //         scaleY: 0.01,
  //         hideOnLayer: true,
  //       })
  //       // 不发送ObjectAdded事件
  //       tempObject.noEventObjectAdded = true
  //       // 添加对象到画板
  //       const board = this.canvas._searchPossibleTargets(
  //         this.canvas.getObjects('Board'),
  //         e.absolutePointer,
  //       ) as Board | undefined
  //       const parent = board || canvas
  //       parent.add(tempObject)
  //       // 取消不发送
  //       tempObject.noEventObjectAdded = false
  //       // 设置激活对象
  //       canvas.setActiveObject(tempObject)
  //       tempObject.__corner = 'br'
  //       canvas._setupCurrentTransform(e.e, tempObject, true)
  //     },
  //     onSwipeEnd: (e) => {
  //       if (!tempObject) return
  //       console.log('onSwipeEnd:', tempObject)
  //       // 如果点击画板，没有移动，设置默认宽高
  //       if (tempObject.scaleX <= 0.01 && tempObject.scaleY <= 0.01) {
  //         tempObject.set({
  //           left: tempObject.left - 50,
  //           top: tempObject.top - 50,
  //           scaleX: 1,
  //           scaleY: 1,
  //         })
  //       }
  //       // 设置宽高缩放
  //       tempObject.set({
  //         width: tempObject.getScaledWidth(),
  //         height: tempObject.getScaledHeight(),
  //         scaleX: 1,
  //         scaleY: 1,
  //         hideOnLayer: false,
  //       })
  //       // 特殊形状处理
  //       if (tempObject instanceof Board) {
  //         tempObject.set({
  //           fill: '#ffffff',
  //         })
  //       } else if (tempObject instanceof Ellipse) {
  //         tempObject.set({
  //           rx: tempObject.width / 2,
  //           ry: tempObject.height / 2,
  //         })
  //       } else if (tempObject instanceof Textbox) {
  //         tempObject.set({
  //           text: '输入文本',
  //         })
  //         canvas.defaultCursor = 'default'
  //         tempObject.enterEditing(e.e)
  //         tempObject.selectAll()
  //       }
  //       // 通知事件
  //       if (!tempObject.group) {
  //         canvas._onObjectAdded(tempObject)
  //       }
  //       canvas.fire('selection:updated')
  //       canvas.requestRenderAll()
  //       tempObject = undefined
  //       useAppStore().activeTool = 'move'
  //     },
  //   })
  //   this.toolStop = stop
  // }


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
