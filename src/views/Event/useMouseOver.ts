import { useFabricStore } from "@/store"
import { storeToRefs } from "pinia"
import useCanvas from "@/views/Canvas/useCanvas"


export const useMouseOver = (evt: any) => {
  const fabricStore = useFabricStore()
  const { elementCoords, elementHover } = storeToRefs(fabricStore)
  console.log('useMouseOver-evt:', evt.target)
  // elementCoords.value.length = 0
  // elementHover.value = ''
}