import { ElementNames } from "@/types/elements"
import { CanvasElement } from "@/types/canvas"
import { Object } from "fabric"
import useCanvas from "../Canvas/useCanvas"
import useHandleBackground from "@/hooks/useHandleBackground"

export default () => {
  
  const deselectedEvent = (deselectedObject: CanvasElement[]) => {

    const [ canvas ] = useCanvas()
    const { setBackgroundImageOption } = useHandleBackground()
    if (deselectedObject && deselectedObject.length > 0) {
      // @ts-ignore
      deselectedObject[0].isCropping = false
      if (deselectedObject[0].type === ElementNames.POLYGON) {
        deselectedObject[0].controls = Object.prototype.controls
        deselectedObject[0].cornerColor = 'white'
      }
      
      if (deselectedObject[0].name === 'backgroundImage') {
        setBackgroundImageOption(deselectedObject[0] as CanvasElement)
      }
      canvas.renderAll()
    }
    
  }

  return {
    deselectedEvent
  }
}