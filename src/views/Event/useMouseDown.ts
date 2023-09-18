import { useFabricStore, useKeyboardStore, useMainStore } from "@/store"
import { storeToRefs } from "pinia"

export const useMouseDown = (evt: any) => {
  const fabricStore = useFabricStore()
  const mainStore = useMainStore()
  const keyboardStore = useKeyboardStore()
  const { elementCoords, elementHover } = storeToRefs(fabricStore)
  const { poolShow, poolType } = storeToRefs(mainStore)
  // elementCoords.value.length = 0
  // elementHover.value = ''
  mainStore.setCanvasObject(evt.target ? evt.target : null)
  // 拖拽画布
  // if (spaceKeyState.value && evt.button === 1) {
  //   fabricStore.setIsDraggingState(true)
  // }
  if (poolType.value !== 'layer') {
    poolShow.value = false
    poolType.value = 'editor'
  }
}