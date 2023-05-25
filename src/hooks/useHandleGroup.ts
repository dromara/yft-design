import { useMainStore } from "@/store"
import { GroupElement } from "@/types/canvas"
import { storeToRefs } from "pinia"
import useCenter from "@/views/Canvas/useCenter"

export default () => {

  const handleActiveElement = (event: any) => {
    const { canvasObject } = storeToRefs(useMainStore())
    const { originPoint } = useCenter()
    if (!canvasObject.value) return
    const handleElement = canvasObject.value as GroupElement
    const groupLeft = handleElement.left ? handleElement.left : 0, groupTop = handleElement.top ? handleElement.top : 0
    const groupWidth = handleElement.width ? handleElement.width : 0, groupHeight = handleElement.height ? handleElement.height : 0
    const activeLeft = groupLeft - originPoint.x + groupWidth / 2, activeTop = groupTop - originPoint.y + groupHeight / 2
    let activeContent = document.getElementById(`active-content`)
    if (!activeContent) {
      activeContent = document.createElement('div')
      activeContent.setAttribute('id', `active-content`)
      document.body.appendChild(activeContent)
    }
    console.log('x:', event.e.clientX, 'y:', event.e.clientY)
  }  

  return {
    handleActiveElement
  }
}