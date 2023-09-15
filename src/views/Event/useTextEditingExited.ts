import { useTemplatesStore } from "@/store"

export const useTextEditingExited = (evt: any) => {
  const templatesStore = useTemplatesStore()
  templatesStore.modifedElement()
}