import { useTemplatesStore } from "@/store"

import useCanvas from "@/views/Canvas/useCanvas"


export const useTextEditingExited = (evt: any) => {
  const templatesStore = useTemplatesStore()
  const [ canvas ] = useCanvas()
  templatesStore.modifedElement()
  canvas.renderAll()
}