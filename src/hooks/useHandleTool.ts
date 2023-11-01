import useCanvas from "@/views/Canvas/useCanvas"
import useCenter from "@/views/Canvas/useCenter"
import useCanvasZindex from "./useCanvasZindex"
import { AlignCommand, LayerCommand } from "@/types/elements"
import { useTemplatesStore } from "@/store"

export default () => {
  
  const alignElement = (command: AlignCommand) => {
    const [ canvas ] = useCanvas()
    const { left, top, width, height, centerPoint } = useCenter()
    const handleElement = canvas.getActiveObject()
    const templatesStore = useTemplatesStore()
    if (!handleElement) return
    switch (command) {
      case AlignCommand.LEFT: 
        handleElement.set({left: left + handleElement.width / 2 })
        break
      case AlignCommand.RIGHT: 
        handleElement.set({left: left + width - handleElement.width / 2})
        break
      case AlignCommand.TOP: 
        handleElement.set({top: top + handleElement.height / 2 })
        break
      case AlignCommand.BOTTOM: 
        handleElement.set({top: top + height - handleElement.height / 2})
        break
      case AlignCommand.HORIZONTAL: 
        handleElement.set({left : centerPoint.x})
        break
      case AlignCommand.VERTICAL: 
        handleElement.set({top: centerPoint.y})
        break
      case AlignCommand.CENTER: 
        handleElement.set({left : centerPoint.x})
        handleElement.set({top: centerPoint.y})
        break
      default: break
    }
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const layerElement = (command: LayerCommand) => {
    const [ canvas ] = useCanvas()
    const { setZindex } = useCanvasZindex()
    const handleElement = canvas.getActiveObject()
    const templatesStore = useTemplatesStore()
    if (!handleElement) return
    switch (command) {
      case LayerCommand.UP: 
        canvas.bringObjectForward(handleElement)
        break
      case LayerCommand.DOWN: 
        canvas.sendObjectBackwards(handleElement)
        break
      case LayerCommand.TOP: 
        canvas.bringObjectToFront(handleElement)
        break
      case LayerCommand.BOTTOM: 
        canvas.sendObjectToBack(handleElement)
        break
      default: break
    }
    setZindex(canvas)
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  return {
    alignElement,
    layerElement
  }
}