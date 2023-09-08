
import { useTemplatesStore } from "@/store"

import { CanvasElement } from "@/types/canvas"

export const useObjectModifed = async (evt: any) => {
  const templatesStore = useTemplatesStore()
  const modfiedObject = evt.target as CanvasElement
  if (!modfiedObject) return
  templatesStore.modifedElement()
}