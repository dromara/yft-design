
import * as fabric from 'fabric'
import { storeToRefs } from "pinia"
import { useFabricStore, useKeyboardStore, useMainStore } from "@/store"
import useCanvas from "@/views/Canvas/useCanvas"

// 拖拽画布
export const useMouseMove = (evt: any) => {
  const fabricStore = useFabricStore()
  const keyboardStore = useKeyboardStore()
  const mainStore = useMainStore()
  const { elementCoords, elementHover, isDragging } = storeToRefs(fabricStore)
  const { spaceKeyState } = storeToRefs(keyboardStore)
  const { clonedObject, currentPoint, canvasObject } = storeToRefs(mainStore)
  const [ canvas ] = useCanvas()
  if (spaceKeyState.value && isDragging.value) {
    elementCoords.value.length = 0
    elementHover.value = ''
    const {movementX, movementY} = evt.e
    const delta = new fabric.Point(movementX, movementY)
    canvas.relativePan(delta)
    canvas.discardActiveObject()
    mainStore.setCanvasObject(null)
    canvas.renderAll()
  }
  
  if (clonedObject.value) {
    currentPoint.value = canvas.getPointer(evt.e)
  }
}