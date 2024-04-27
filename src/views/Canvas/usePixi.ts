import { useTemplatesStore } from "@/store"
import { CanvasElement, GroupElement } from "@/types/canvas"
import { ElementNames } from "@/types/elements"
import { Image } from "fabric"
import useCanvas from "./useCanvas"
import pixiWorker from "@/worker/pixi?worker"

let pixi: Worker | undefined = undefined

export const initPixi = () => {
  const width = 800, height = 600
  const resolution = window.devicePixelRatio
  const canvas = document.createElement('canvas') as any
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
      const element = findElement(eid, ((item as GroupElement)._objects) as CanvasElement[])
      if (element) return element
    }
  }
  return
}

export const handleFilter = (worker: Worker) => {
  const templatesStore = useTemplatesStore()
  const [ canvas ] = useCanvas()
  worker.addEventListener('message', async (event) => {
    
    const data = event.data
    const objects = canvas.getObjects()
    const element = findElement(data.id, objects as CanvasElement[]) as Image
    if (element instanceof Image) {
      element.originSrc = element.getSrc()
      await element.setSrc(data.res)
      element.dirty = true
      canvas.renderAll()
      templatesStore.modifedElement()
    }
  });
}

export default (): [Worker] => [pixi as Worker]