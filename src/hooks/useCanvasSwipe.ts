import { tryOnScopeDispose } from '@vueuse/shared'
import { reactive, ref, computed } from 'vue'
import { useCanvasEvent } from './useCanvasEvent'
import type { TPointerEventInfo, TPointerEvent, Point } from 'fabric'


export interface UseSwipeOptions {
  onSwipeStart?: (e: TPointerEventInfo<TPointerEvent>) => void
  onSwipe?: (e: TPointerEventInfo<TPointerEvent>) => void
  onSwipeEnd?: (e: TPointerEventInfo<TPointerEvent>) => void
}

export function useFabricSwipe(options: UseSwipeOptions = {}) {
  const { onSwipe, onSwipeEnd, onSwipeStart } = options

  const coordsStart = reactive({ x: 0, y: 0 })
  const coordsEnd = reactive({ x: 0, y: 0 })

  const isSwiping = ref(false)
  const isPointerDown = ref(false)

  const diffX = computed(() => coordsEnd.x - coordsStart.x)
  const diffY = computed(() => coordsEnd.y - coordsStart.y)

  const updateCoordsStart = (point: Point) => {
    coordsStart.x = point.x
    coordsStart.y = point.y
  }

  const updateCoordsEnd = (point: Point) => {
    coordsEnd.x = point.x
    coordsEnd.y = point.y
  }

  const mouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
    if (e.e instanceof TouchEvent && e.e.touches.length !== 1) return
    isPointerDown.value = true
    updateCoordsStart(e.absolutePointer)
    updateCoordsEnd(e.absolutePointer)
    onSwipeStart?.(e)
  }
  const mouseMove = (e: TPointerEventInfo<TPointerEvent>) => {
    if (!isPointerDown.value) return
    if (e.e instanceof TouchEvent && e.e.touches.length !== 1) return
    updateCoordsEnd(e.absolutePointer)
    isSwiping.value = true
    onSwipe?.(e)
  }
  const mouseUp = (e: TPointerEventInfo<TPointerEvent>) => {
    if (isSwiping.value) onSwipeEnd?.(e)
    isPointerDown.value = false
    isSwiping.value = false
  }

  const stop = useCanvasEvent({
    'mouse:down': mouseDown,
    'mouse:move': mouseMove,
    'mouse:up': mouseUp,
  })

  tryOnScopeDispose(stop)

  return {
    isSwiping,
    coordsStart,
    coordsEnd,
    lengthX: diffX,
    lengthY: diffY,
    stop,
  }
}
