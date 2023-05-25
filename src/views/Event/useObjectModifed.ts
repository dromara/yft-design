
import { useFabricStore } from "@/store"
import { storeToRefs } from "pinia"
import { CanvasElement } from "@/types/canvas"

export const useObjectModifed = async (evt: any) => {
  const fabricStore = useFabricStore()
  const { isModifed } = storeToRefs(fabricStore)
  const modfiedObject = evt.target as CanvasElement
  if (!modfiedObject) return
  isModifed.value = true  // 是否修改了元素

}