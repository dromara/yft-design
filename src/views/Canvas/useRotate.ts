import { useMainStore } from "@/store"
import { storeToRefs } from "pinia"

export default () => {
  const rotateElement = () => {
    const { canvasObject } = storeToRefs(useMainStore())
    if (canvasObject.value) {
      canvasObject.value.isRotate = true
    }
  }

  const unrotateElement = () => {
    const { canvasObject } = storeToRefs(useMainStore())
    if (canvasObject.value) {
      canvasObject.value.isRotate = false
    }
  }
  
  return {
    rotateElement,
    unrotateElement
  }
}