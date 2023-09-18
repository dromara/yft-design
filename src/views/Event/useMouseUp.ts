
import { useFabricStore, useTemplatesStore } from "@/store"
import { storeToRefs } from "pinia"
import { useMainStore } from "@/store/modules/main"
import { CanvasElement } from "@/types/canvas"
import useCanvas from "@/views/Canvas/useCanvas"


export const useMouseUp = (evt: any) => {
  const fabricStore = useFabricStore()
  const mainStore = useMainStore()
  const { elementCoords, elementHover, verticalLines, horizontalLines, isDragging } = storeToRefs(fabricStore)
  const [ canvas ] = useCanvas()
  // if (isDragging.value) fabricStore.setIsDraggingState(false)
  // verticalLines.value.length = 0
  // horizontalLines.value.length = 0
  // elementCoords.value.length = 0
  // elementHover.value = ''
  // mainStore.setCanvasObject(canvas.getActiveObject() ? canvas.getActiveObject() as CanvasElement : null)
}