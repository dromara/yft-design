import { useFabricStore, useKeyboardStore, useMainStore } from "@/store"
import { verticalLine, horizontalLine, ElementNames } from "@/types/elements"
import { alignLineWidth, alignLineColor } from "@/configs/alignLine"
import { storeToRefs } from "pinia"
import { CanvasElement, CropElement } from "@/types/canvas"
import useCanvas from "@/views/Canvas/useCanvas"

const drawAlignLine = (x1: number, y1: number, x2: number, y2: number) => {
  const fabricStore = useFabricStore()
  const [ canvas ] = useCanvas()
  const ctx = canvas.getSelectionContext()
  const viewportTransform = canvas.viewportTransform
  const { zoom } = storeToRefs(fabricStore)
  if (!viewportTransform) return
  ctx.save()
  ctx.lineWidth = alignLineWidth
  ctx.strokeStyle = alignLineColor
  ctx.beginPath()
  ctx.moveTo(x1 * zoom.value + viewportTransform[4], y1 * zoom.value + viewportTransform[5])
  ctx.lineTo(x2 * zoom.value + viewportTransform[4], y2 * zoom.value + viewportTransform[5])
  ctx.stroke()
  ctx.restore()
}

const drawVerticalLine = (coords: verticalLine) => {
  drawAlignLine(coords.x + 0.5, coords.y1 > coords.y2 ? coords.y2 : coords.y1, coords.x + 0.5, coords.y2 > coords.y1 ? coords.y2 : coords.y1)
}

const drawHorizontalLine = (coords: horizontalLine) => {
  drawAlignLine(coords.x1 > coords.x2 ? coords.x2 : coords.x1, coords.y + 0.5, coords.x2 > coords.x1 ? coords.x2 : coords.x1,  coords.y + 0.5)
}

const drawOverLine = () => {
  const fabricStore = useFabricStore()
  const { elementCoords } = storeToRefs(fabricStore)
  const [ canvas ] = useCanvas()
  const ctx = canvas.getSelectionContext()
  ctx.save()
  ctx.lineWidth = alignLineWidth
  ctx.strokeStyle = alignLineColor
  ctx.setLineDash([6, 6])
  ctx.beginPath()
  if (elementCoords.value.length > 0) {
    const points = elementCoords.value
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.lineTo(points[2].x, points[2].y)
    ctx.lineTo(points[3].x, points[3].y)
    ctx.lineTo(points[0].x, points[0].y)
  }
  ctx.stroke()
  ctx.restore() 
}

const drawOutline = () => {
  const [ canvas ] = useCanvas()
  canvas.forEachObject(obj => {
    const bound = obj.getBoundingRect()
    const coords = obj.getCoords()
    
    if (obj.type === ElementNames.ACTIVE) {
      // @ts-ignore
      canvas.contextContainer.strokeRect(bound.left + 0.5, bound.top + 0.5, bound.width, bound.height)
    }
  })
}

const drawCropImage = () => {
  const [ canvas ] = useCanvas()
  const { canvasObject } = storeToRefs(useMainStore())
  if (!canvasObject.value || canvasObject.value.name !== ElementNames.CROP) return
  const cropObject = canvasObject.value as CropElement
  const imageObject = canvas.getObjects().filter(obj => (obj as CanvasElement).id === cropObject.imageId)[0]
  if (!imageObject) return
  const cropCoords = cropObject.getCoords()
  const imageCoords = imageObject.getCoords()
  const ctx = canvas.getSelectionContext()
  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.beginPath()
  const interval = 20
  // image rectangle
  ctx.moveTo(imageCoords[0].x - interval, imageCoords[0].y - interval)
  ctx.lineTo(imageCoords[1].x + interval, imageCoords[1].y - interval)
  ctx.lineTo(imageCoords[2].x + interval, imageCoords[2].y + interval)
  ctx.lineTo(imageCoords[3].x - interval, imageCoords[3].y + interval)
  ctx.lineTo(imageCoords[0].x - interval, imageCoords[0].y - interval)
  ctx.closePath()

  // crop rectangle
  ctx.moveTo(cropCoords[0].x, cropCoords[0].y)
  ctx.lineTo(cropCoords[1].x, cropCoords[1].y)
  ctx.lineTo(cropCoords[2].x, cropCoords[2].y)
  ctx.lineTo(cropCoords[3].x, cropCoords[3].y)
  ctx.lineTo(cropCoords[0].x, cropCoords[0].y)
  ctx.closePath()

  ctx.fill()
  ctx.restore()
}


export const useAfterRender = () => {
  const fabricStore = useFabricStore()
  const keyboardStore = useKeyboardStore()
  const { spaceKeyState } = storeToRefs(keyboardStore)
  const { verticalLines, horizontalLines, elementCoords, isCropping } = storeToRefs(fabricStore)
  if (spaceKeyState.value) return
  
  for (let i = verticalLines.value.length; i--;) {
    drawVerticalLine(verticalLines.value[i])
  }
  for (let j = horizontalLines.value.length; j--;) {
    drawHorizontalLine(horizontalLines.value[j]);
  }
  
  if (elementCoords.value.length > 0 && !isCropping.value) {
    drawOverLine()
  }
}