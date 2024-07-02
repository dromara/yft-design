import { Point, Canvas } from 'fabric'
import { debounce } from 'lodash-es'
import { Disposable } from '@/utils/lifecycle'
import { useFabricStore } from '@/store'

export const MIN_ZOOM = 0.03
export const MAX_ZOOM = 5


export class FabricTouch extends Disposable {
  isTwoTouch = false
  isDragging = false
  startDistance = 1
  startX = 0 
  startY = 0
  startScale = 1
  lastPan?: Point

  constructor(private readonly canvas: Canvas) {
    super()
    this.initTouchEvent()
  }

  initTouchEvent() {
    const canvas = this.canvas?.upperCanvasEl
    if (canvas) {
      canvas.addEventListener('touchstart', this.touchStartHandle, { passive: false })
      canvas.addEventListener('touchmove', this.touchMoveHandle, { passive: false })
      canvas.addEventListener('touchend', this.touchEndHandle, { passive: false })
    }
  }

  removeTouchEvent() {
    const canvas = this.canvas?.upperCanvasEl
    if (canvas) {
      canvas.removeEventListener('touchstart', this.touchStartHandle)
      canvas.removeEventListener('touchmove', this.touchMoveHandle)
      canvas.removeEventListener('touchend', this.touchEndHandle)
    }
  }

  touchStartHandle = (e: TouchEvent) => {
    e.preventDefault()
    const canvas = this.canvas
    if (!canvas) return
    const touches = e.touches

    // brushMouseMixin.updateIsDisableDraw(touches.length >= 2)

    if (touches.length === 2) {
      canvas.isDrawingMode = true
      this.isTwoTouch = true
      const touch1 = touches[0]
      const touch2 = touches[1]
      this.startDistance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
      )

      this.startX = (touch1.pageX + touch2.pageX) / 2
      this.startY = (touch1.pageY + touch2.pageY) / 2
      this.startScale = canvas.getZoom()
    }
  }
  touchMoveHandle = (e: TouchEvent) => {
    e.preventDefault()

    const canvas = this.canvas
    if (!canvas) return
    const touches = e.touches

    if (touches.length === 2) {
      const touch1 = touches[0]
      const touch2 = touches[1]

      const currentDistance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
      )

      const x = (touch1.pageX + touch2.pageX) / 2
      const y = (touch1.pageY + touch2.pageY) / 2

      // Calculate zoom
      let zoom = this.startScale * (currentDistance / this.startDistance)
      zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
      // if (!useBoardStore.getState().isObjectCaching) {
      //   fabric.Object.prototype.set({
      //     objectCaching: true
      //   })
      // }
      canvas.zoomToPoint(new Point(this.startX, this.startY), zoom)
      // paintBoard.evnet?.zoomEvent.updateZoomPercentage(true, zoom)

      // Calculate drag distance
      const currentPan = new Point(x - this.startX, y - this.startY)
      const fabricStore = useFabricStore()
      fabricStore.setZoom(zoom)
      // move canvas
      if (!this.isDragging) {
        this.isDragging = true
        this.lastPan = currentPan
      } else if (this.lastPan) {
        // if (!useBoardStore.getState().isObjectCaching) {
        //   fabric.Object.prototype.set({
        //     objectCaching: true
        //   })
        // }
        canvas.relativePan(
          new Point(
            currentPan.x - this.lastPan.x,
            currentPan.y - this.lastPan.y
          )
        )
        this.lastPan = currentPan
        this.saveTransform()
      }
    }
  }
  touchEndHandle = (e: TouchEvent) => {
    this.isDragging = false
    this.canvas.isDrawingMode = false
    if (this.isTwoTouch && e.touches.length === 0) {
      this.isTwoTouch = false
    }
  }

  saveTransform = debounce(() => {
    const transform = this.canvas?.viewportTransform
    if (transform) {
      // useFileStore.getState().updateTransform(transform)
      // if (!useBoardStore.getState().isObjectCaching) {
      //   fabric.Object.prototype.set({
      //     objectCaching: false
      //   })
      // }
      this.canvas?.requestRenderAll()
    }
  }, 500)
}
