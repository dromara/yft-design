import { useFabricStore } from "@/store"
import { storeToRefs } from "pinia"
import { TPointerEvent } from 'fabric'
import useCanvas from "@/views/Canvas/useCanvas"


export const useMouseOver = (evt: TPointerEvent) => {
  const fabricStore = useFabricStore()
  const { elementCoords, elementHover, horizontalLines, verticalLines } = storeToRefs(fabricStore)
  const [ canvas ] = useCanvas()
  console.log('evt:', evt.target)
  // if (!evt.target) return
  elementCoords.value.length = 0
  elementHover.value = ''
  horizontalLines.value.length = 0
  verticalLines.value.length = 0
}