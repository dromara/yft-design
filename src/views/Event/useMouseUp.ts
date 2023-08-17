
import { useFabricStore, useTemplatesStore } from "@/store"
import { storeToRefs } from "pinia"
import { useMainStore } from "@/store/modules/main"
import { CanvasElement } from "@/types/canvas"
import useCanvas from "@/views/Canvas/useCanvas"


export const useMouseUp = (evt: any) => {
  const fabricStore = useFabricStore()
  const mainStore = useMainStore()
  const templatesStore = useTemplatesStore()
  const { elementCoords, elementHover, verticalLines, horizontalLines, isDragging, isModifed } = storeToRefs(fabricStore)
  const { canvasObject } = storeToRefs(mainStore)
  const [ canvas ] = useCanvas()
  if (isDragging.value) fabricStore.setIsDraggingState(false)
  verticalLines.value.length = 0
  horizontalLines.value.length = 0
  elementCoords.value.length = 0
  elementHover.value = ''
  canvasObject.value = canvas.getActiveObject() ? canvas.getActiveObject() as CanvasElement : null
  if (!canvasObject.value) return
  if (canvasObject.value && isModifed.value) {
    templatesStore.modifedElement()
  }
}