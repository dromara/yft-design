import { ElementNames } from "@/types/elements"
import { useMainStore, useTemplatesStore } from "@/store"
import usePolygonControl from "@/hooks/usePolygonControl"
import useCanvas from "../Canvas/useCanvas"
import useHandleBackground from "@/hooks/useHandleBackground"

export const useMousedblClick = (evt: any) => {
  const [ canvas ] = useCanvas()
  const mainStore = useMainStore()
  const templatesStore = useTemplatesStore()
  const { setPolygonControl } = usePolygonControl()
  const { setWorkSpaceImage } = useHandleBackground()
  const targetObject = evt.target
  if (targetObject) {
    if (targetObject.type === ElementNames.POLYGON) {
      setPolygonControl(targetObject)
    }
    // if (targetObject.type === ElementNames.IMAGE) {
    //   console.log('targetObject:', targetObject)
    // }
  }
  else {
    const backgroundImage = canvas.get("backgroundImage")
    if (backgroundImage) {
      canvas.set({'backgroundImage': ''})
      setWorkSpaceImage()
      backgroundImage.name = 'backgroundImage'
      canvas.add(backgroundImage)
      canvas.setActiveObject(backgroundImage)
      mainStore.setCanvasObject(null)
      templatesStore.modifedElement()
    }
  }
}