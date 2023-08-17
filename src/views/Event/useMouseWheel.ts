import { useFabricStore } from "@/store"

import { ScaleLimit } from "@/configs/scale"
import { storeToRefs } from "pinia"
import { Point } from "fabric"
import useCanvas from "@/views/Canvas/useCanvas"

export const useMouseWheel = ({e, pointer}: any) => {
  const fabricStore = useFabricStore()
  const { elementCoords, elementHover, zoom } = storeToRefs(fabricStore)
  const [canvas] = useCanvas()
  elementCoords.value.length = 0
  elementHover.value = ''
  e.preventDefault()
  e.stopPropagation()
  const delta = e.deltaY  // 获取滚动值 向上滚一下是 -100，向下滚一下是 100
  let zoomVal = canvas.getZoom()
  zoomVal *= 0.999 ** delta
  if (zoomVal > ScaleLimit.max) zoomVal = ScaleLimit.max
  if (zoomVal < ScaleLimit.min) zoomVal = ScaleLimit.min
  zoom.value = zoomVal
  canvas.zoomToPoint(new Point(e.offsetX, e.offsetY), zoomVal)
}

