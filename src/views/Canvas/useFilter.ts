import filterWorker from "@/worker/filter?worker"

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
  document.body.removeChild(canvas)
}

export default (): [Worker] => [filter as Worker]