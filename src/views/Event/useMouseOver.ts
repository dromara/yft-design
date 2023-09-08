import { useFabricStore } from "@/store"
import { storeToRefs } from "pinia"


export const useMouseOver = (evt: any) => {
  const fabricStore = useFabricStore()
  const { elementCoords, elementHover } = storeToRefs(fabricStore)
  console.log('useMouseOver:', evt.target)
  if (!evt.target) return
  elementCoords.value.length = 0
  elementHover.value = ''
}