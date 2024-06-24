import { useTemplatesStore } from "@/store"
import { CanvasElement } from "@/types/canvas"
import useCanvas from "@/views/Canvas/useCanvas"
import useCenter from "@/views/Canvas/useCenter"
import { Image } from "fabric"
import { storeToRefs } from "pinia"
import { WorkSpaceDrawType } from "@/configs/canvas"

export default () => {

  const setWorkSpaceImage = () => {
    const templatesStore = useTemplatesStore()
    const { currentTemplate } = storeToRefs(templatesStore)
    const workSpaceData = currentTemplate.value.workSpace
    workSpaceData.imageURL = ''
    workSpaceData.gaidImageURL = ''
    workSpaceData.shadingImageURL = ''
  }
  
  const setBackgroudImage = async (dataURL: string) => {
    const templatesStore = useTemplatesStore()
    const { currentTemplate } = storeToRefs(templatesStore)
    const [ canvas ] = useCanvas()
    const { left, top, width, height } = useCenter()
    
    const backgroundImage = await Image.fromURL(dataURL, {crossOrigin: 'anonymous'}, {})
    let scaleX = 1, scaleY = 1
    if (currentTemplate.value.workSpace.imageSize === 'cover') {
      scaleX = width / (backgroundImage.width ? backgroundImage.width : 1), scaleY = height / (backgroundImage.height ? backgroundImage.height : 1)
    }
    backgroundImage.set({ left, top, scaleX, scaleY })
    canvas.set({backgroundImage})
    canvas.renderAll()
    templatesStore.modifedElement()
  }
  
  const getBackgroundImageOption = () => {
    const [ canvas ] = useCanvas()
    const { currentTemplate } = storeToRefs(useTemplatesStore())
    const workSpaceDraw = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0] as CanvasElement
    let left = workSpaceDraw.left, top = workSpaceDraw.top, angle = workSpaceDraw.angle, scaleX = workSpaceDraw.scaleX, scaleY = workSpaceDraw.scaleY
    
    if (currentTemplate.value.workSpace.left !== 0) {
      left = currentTemplate.value.workSpace.left
    }
    if (currentTemplate.value.workSpace.top !== 0) {
      top = currentTemplate.value.workSpace.top
    }
    if (currentTemplate.value.workSpace.angle !== 0) {
      angle = currentTemplate.value.workSpace.angle
    }
    if (currentTemplate.value.workSpace.scaleX !== 1) {
      scaleX = currentTemplate.value.workSpace.scaleX
    }
    if (currentTemplate.value.workSpace.scaleY !== 1) {
      scaleY = currentTemplate.value.workSpace.scaleY
    }
    return { left, top, angle, scaleX, scaleY }
  }

  const setBackgroundImageOption = (element: Image) => {
    const templatesStore = useTemplatesStore()
    const { currentTemplate } = storeToRefs(templatesStore)
    const [ canvas ] = useCanvas()
    if (element && element.name === 'backgroundImage') {
      canvas.discardActiveObject()
      canvas.set({element})
      canvas.remove(element)
      canvas.renderAll()
      
      const workSpaceData = currentTemplate.value.workSpace
      workSpaceData.left = element.left
      workSpaceData.top = element.top
      workSpaceData.angle = element.angle
      workSpaceData.scaleX = element.scaleX
      workSpaceData.scaleY = element.scaleY
      const src = element.getSrc()
      if (workSpaceData.fillType === 1) {
        workSpaceData.imageURL = src
      }
      else if (workSpaceData.fillType === 3) {
        workSpaceData.gaidImageURL = src
      }
      else if (workSpaceData.fillType === 4) {
        workSpaceData.shadingImageURL = src
      }
      templatesStore.modifedElement()
    }
  }

  return {
    setWorkSpaceImage,
    setBackgroudImage,
    setBackgroundImageOption,
    getBackgroundImageOption,
  }
}