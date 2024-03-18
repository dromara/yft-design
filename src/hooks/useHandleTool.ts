import useCanvas from "@/views/Canvas/useCanvas"
import useCenter from "@/views/Canvas/useCenter"
import useCanvasZindex from "./useCanvasZindex"
import { AlignCommand, ElementNames, LayerCommand } from "@/types/elements"
import { useTemplatesStore } from "@/store"
import { Group } from "fabric"

export default () => {
  
  const alignElement = (command: AlignCommand) => {
    const [ canvas ] = useCanvas()
    const { left, top, width, height, centerPoint } = useCenter()
    const handleElement = canvas.getActiveObject()
    const templatesStore = useTemplatesStore()
    if (!handleElement) return
    if (handleElement.type === ElementNames.ACTIVE) {
      const activeObject = handleElement as Group
      const activeObjectLeft = activeObject.left - activeObject.width / 2, activeObjectTop = activeObject.top - activeObject.height / 2
      switch (command) {
        case AlignCommand.LEFT: 
          activeObject._objects.forEach(item => item.set({left: activeObjectLeft}))
          break
        case AlignCommand.RIGHT: 
          activeObject._objects.forEach(item => item.set({left: activeObjectLeft + activeObject.width - item.width}))
          break
        case AlignCommand.TOP: 
          activeObject._objects.forEach(item => item.set({top: activeObjectTop}))
          break
        case AlignCommand.BOTTOM: 
          activeObject._objects.forEach(item => item.set({top: activeObjectTop + activeObject.height - item.height}))
          break
        case AlignCommand.HORIZONTAL: 
          activeObject._objects.forEach(item => item.set({left: activeObject.left - item.width / 2}))
          break
        case AlignCommand.VERTICAL: 
          activeObject._objects.forEach(item => item.set({top: activeObject.top - item.height / 2}))
          break
        case AlignCommand.CENTER: 
          activeObject._objects.forEach(item => item.set({left: activeObject.left - item.width / 2}))
          activeObject._objects.forEach(item => item.set({top: activeObject.top - item.height / 2}))
          break
        default: break
      }
    } else {
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