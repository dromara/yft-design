import { useFabricStore } from "@/store"
import { storeToRefs } from "pinia"
import { TPointerEvent } from "fabric"
import useCanvas from "@/views/Canvas/useCanvas"
import { CanvasElement } from "@/types/canvas"


export const useMouseOut = (evt: TPointerEvent) => {
  const fabricStore = useFabricStore()
  const { elementCoords, elementHover } = storeToRefs(fabricStore)
  const [ canvas ] = useCanvas()
  const targetObject = evt.target as CanvasElement | null
  if (!targetObject) return
  // elementCoords.value.length = 0
  const activeObject = canvas.getActiveObject()
  
  if (activeObject === targetObject) return
  elementCoords.value = targetObject.getCoords()
  elementHover.value = targetObject.id
  if (targetObject.group) {
    elementCoords.value = [targetObject.oCoords.bl, targetObject.oCoords.br, targetObject.oCoords.tr, targetObject.oCoords.tl]
  }
}