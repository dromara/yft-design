import filterWorker from "@/worker/filter?worker"
import useCanvas from "./useCanvas"
import useHandleElement from "@/hooks/useHandleElement"
import { Image } from "fabric"

let filter: Worker | undefined = undefined

export const initFilter = () => {
  const width = 800, height = 600
  const resolution = window.devicePixelRatio
  const canvas = document.createElement('canvas')
  canvas.style.width = `${ width }px`
  canvas.style.height = `${ height }px`
  document.body.appendChild(canvas)
  filter = new filterWorker()
  const view = canvas.transferControlToOffscreen();
  filter.postMessage({ width, height, resolution, view }, [view])
  handleFilter(filter)
  document.body.removeChild(canvas)
}

export const handleFilter = (filter: Worker) => {
  const [ canvas ] = useCanvas()
  const { queryElement } = useHandleElement()
  filter.addEventListener('message', (event) => {
    const data = event.data
    console.log('data:', event.data)
    const element = queryElement(data.id) as Image
    if (!element) return
    element.setSrc(data.res)
    canvas.renderAll()
  });
}

export default (): [Worker] => [filter as Worker]