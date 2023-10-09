import useCanvas from "@/views/Canvas/useCanvas"
import useCenter from "@/views/Canvas/useCenter"
import useCanvasZindex from "./useCanvasZindex"
import { AlignCommand, LayerCommand } from "@/types/elements"
import { useTemplatesStore } from "@/store"

export default () => {
  
  const alignElement = (command: AlignCommand) => {
    const [ canvas ] = useCanvas()
    const { workSpaceDraw } = useCenter()
    const handleElement = canvas.getActiveObject()
    const templatesStore = useTemplatesStore()
    if (!handleElement) return
    switch (command) {
      case AlignCommand.LEFT: 
        handleElement.set({left: workSpaceDraw.left + handleElement.width / 2 })
        break
      case AlignCommand.RIGHT: 
        handleElement.set({left: workSpaceDraw.left + workSpaceDraw.width - handleElement.width / 2})
        break
      case AlignCommand.TOP: 
        handleElement.set({top: workSpaceDraw.top + handleElement.height / 2 })
        break
      case AlignCommand.BOTTOM: 
        handleElement.set({top: workSpaceDraw.top + workSpaceDraw.height - handleElement.height / 2})
        break
      case AlignCommand.HORIZONTAL: 
        handleElement.set({left : workSpaceDraw.getCenterPoint().x})
        break
      case AlignCommand.VERTICAL: 
        handleElement.set({top: workSpaceDraw.getCenterPoint().y})
        break
      case AlignCommand.CENTER: 
        handleElement.set({left : workSpaceDraw.getCenterPoint().x})
        handleElement.set({top: workSpaceDraw.getCenterPoint().y})
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