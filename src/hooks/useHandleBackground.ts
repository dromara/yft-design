import { useTemplatesStore } from "@/store"
import { CanvasElement } from "@/types/canvas"
import useCanvas from "@/views/Canvas/useCanvas"
import useCenter from "@/views/Canvas/useCenter"
import { Image } from "fabric"
import { storeToRefs } from "pinia"
import { ImageElement } from "@/types/canvas"

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
    const { workSpaceDraw } = useCenter()
    
    const left = workSpaceDraw.left, top = workSpaceDraw.top
    const workWidth = workSpaceDraw.width ? workSpaceDraw.width : 0, workHeight = workSpaceDraw.height ? workSpaceDraw.height : 0
    const backgroundImage = await Image.fromURL(dataURL)
    let scaleX = 1, scaleY = 1
    if (currentTemplate.value.workSpace.imageSize === 'cover') {
      scaleX = workWidth / (backgroundImage.width ? backgroundImage.width : 1), scaleY = workHeight / (backgroundImage.height ? backgroundImage.height : 1)
    }
    backgroundImage.set({ left, top, scaleX, scaleY })
    canvas.set({backgroundImage})
    canvas.renderAll()
  }
  
  const getBackgroundImageOption = () => {
    const { currentTemplate } = storeToRefs(useTemplatesStore())
    const { workSpaceDraw } = useCenter()
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

  const setBackgroundImageOption = (element: CanvasElement) => {
    const templatesStore = useTemplatesStore()
    const { currentTemplate } = storeToRefs(templatesStore)
    const [ canvas ] = useCanvas()
    if (element && element.name === 'backgroundImage') {
      console.log('backgroundImage:', element)
      canvas.discardActiveObject()
      const backgroundImage = element as ImageElement
      canvas.set({backgroundImage})
      canvas.remove(backgroundImage)
      canvas.renderAll()
      
      const workSpaceData = currentTemplate.value.workSpace
      workSpaceData.left = backgroundImage.left
      workSpaceData.top = backgroundImage.top
      workSpaceData.angle = backgroundImage.angle
      workSpaceData.scaleX = backgroundImage.scaleX
      workSpaceData.scaleY = backgroundImage.scaleY
      const src = backgroundImage.getSrc()
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