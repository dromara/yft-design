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
    
    let options: Record<string, any> = {}
    if (handleElement.type.toLowerCase() === ElementNames.ACTIVE) {
      const activeObject = handleElement as Group
      switch (command) {
        case AlignCommand.LEFT: 
          activeObject._objects.forEach(item => item.set({left: -activeObject.width / 2}))
          break
        case AlignCommand.RIGHT: 
          activeObject._objects.forEach(item => item.set({left: activeObject.width / 2 - item.width * item.scaleX}))
          break
        case AlignCommand.TOP: 
          activeObject._objects.forEach(item => item.set({top: -activeObject.height / 2}))
          break
        case AlignCommand.BOTTOM: 
          activeObject._objects.forEach(item => item.set({top: activeObject.height / 2 - item.height * item.scaleY}))
          break
        case AlignCommand.HORIZONTAL: 
          activeObject._objects.forEach(item => item.set({top: -item.height / 2 * item.scaleY}))
          break
        case AlignCommand.VERTICAL: 
          activeObject._objects.forEach(item => item.set({left: -item.width / 2 * item.scaleX}))
          break
        case AlignCommand.CENTER: 
          activeObject._objects.forEach(item => item.set({left: activeObject.left - item.width / 2 * item.scaleX}))
          activeObject._objects.forEach(item => item.set({top: activeObject.top - item.height / 2 * item.scaleY}))
          break
        default: break
      }
    } 
    else {
      canvas.discardActiveObject()
      switch (command) {
        case AlignCommand.LEFT: 
          options = {left: left }
          handleElement.set(options)
          break
        case AlignCommand.RIGHT: 
          options = {left: left + width - handleElement.width * handleElement.scaleX}
          handleElement.set(options)
          break
        case AlignCommand.TOP: 
          options = {top: top }
          handleElement.set(options)
          break
        case AlignCommand.BOTTOM: 
          options = {top: top + height - handleElement.height * handleElement.scaleY}
          handleElement.set(options)
          break
        case AlignCommand.HORIZONTAL: 
          options = {top: centerPoint.y - handleElement.height / 2 * handleElement.scaleY}
          handleElement.set(options)
          break
        case AlignCommand.VERTICAL: 
          options = {left : centerPoint.x - handleElement.width / 2 * handleElement.scaleX}
          handleElement.set(options)
          break
        case AlignCommand.CENTER: 
          options = {left : centerPoint.x - handleElement.width / 2 * handleElement.scaleX, top: centerPoint.y - handleElement.height / 2 * handleElement.scaleY}
          handleElement.set(options)
          break
        default: break
      }
    }
    canvas.setActiveObject(handleElement)
    canvas.renderAll()
    templatesStore.modifedElement(handleElement, options)
    
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
    templatesStore.modifedElement(handleElement, {})
  }

  return {
    alignElement,
    layerElement
  }
}