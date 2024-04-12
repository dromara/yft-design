import pixiWorker from "@/worker/pixi?worker"
import useCanvas from "./useCanvas"
import useHandleElement from "@/hooks/useHandleElement"
import { Image } from "fabric"
import { useTemplatesStore } from "@/store"
import { storeToRefs } from "pinia"
import { CanvasElement, GroupElement, ImageElement } from "@/types/canvas"
import { ElementNames } from "@/types/elements"

let pixi: Worker | undefined = undefined

export const initPixi = () => {
  const width = 800, height = 600
  const resolution = window.devicePixelRatio
  const canvas = document.createElement('canvas')
  canvas.style.width = `${ width }px`
  canvas.style.height = `${ height }px`
  document.body.appendChild(canvas)
  pixi = new pixiWorker()
  const view = canvas.transferControlToOffscreen();
  pixi.postMessage({ width, height, resolution, view }, [view])
  handleFilter(pixi)
  document.body.removeChild(canvas)
}

const findElement = (eid: string, elements: CanvasElement[] | undefined): CanvasElement | undefined => {
  if (!elements) return
  for (let i = 0; i < elements.length; i++) {
    const item = elements[i] as CanvasElement
    if (item.id === eid) {
      return item
    }
    if (item.type.toLowerCase() === ElementNames.GROUP) {
      return findElement(eid, ((item as GroupElement).objects) as CanvasElement[])
    }
  }
  return
}

export const handleFilter = (filter: Worker) => {
  const templatesStore = useTemplatesStore()
  const { currentTemplate } = storeToRefs(templatesStore)
  
  filter.addEventListener('message', async (event) => {
    const data = event.data
    const element = findElement(data.id, currentTemplate.value.objects as CanvasElement[]) as ImageElement
    if (!element) return
    element.originSrc = element.src
    element.src = data.res
    await templatesStore.renderElement()
    templatesStore.modifedElement()
  });
}

export default (): [Worker] => [pixi as Worker]