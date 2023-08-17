import { useFabricStore } from "@/store"
import { storeToRefs } from "pinia"
import useCanvas from "@/views/Canvas/useCanvas"


export const useMouseOut = (evt: any) => {
  const fabricStore = useFabricStore()
  const { elementCoords, elementHover } = storeToRefs(fabricStore)
  const [ canvas ] = useCanvas()
  if (!evt.target) return
  // elementCoords.value.length = 0
  const activeObject = canvas.getActiveObject()
  const targetObject = evt.target
  if (activeObject === targetObject) return
  elementCoords.value = targetObject.getCoords()
  elementHover.value = targetObject.id
  if (targetObject.group) {
    elementCoords.value = [targetObject.oCoords.bl, targetObject.oCoords.br, targetObject.oCoords.tr, targetObject.oCoords.tl]
  }
}