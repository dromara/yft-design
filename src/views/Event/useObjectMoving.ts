
import { aligningLineMargin, aligningLineOffset, alignLineWidth, aligningLinePadding } from "@/configs/alignLine"
import { useFabricStore } from "@/store"
import { storeToRefs } from "pinia"
import { Point } from "fabric"
import { ElementNames } from "@/types/elements"
import { CanvasElement, CropElement, ImageElement } from "@/types/canvas"
import { WorkSpaceName } from "@/configs/canvas"
import useCanvas from "../Canvas/useCanvas"

const isInRange = (value1: number, value2: number) => {
  value1 = Math.round(value1)
  value2 = Math.round(value2)
  for (let i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
    if (i === value2) {
      return true
    }
  }
  return false
}

const isHasVerticalLines = (value: number) => {
  const fabricStore = useFabricStore()
  const { verticalLines } = storeToRefs(fabricStore)
  value = Math.round(value)
  for (let i = 0; i < verticalLines.value.length; i++) {
    const verticalLine = verticalLines.value[i]
    if (alignLineWidth + value <= verticalLine.x || verticalLine.x <= alignLineWidth + value) {
      return false
    }
  }
  return true
}

const isHasHorizontalLines = (value: number) => {
  const fabricStore = useFabricStore()
  const { horizontalLines } = storeToRefs(fabricStore)
  value = Math.round(value)
  for (let i = 0; i < horizontalLines.value.length; i++) {
    const horizontalLine = horizontalLines.value[i]
    if (alignLineWidth + value <= horizontalLine.y || horizontalLine.y <= alignLineWidth + value) {
      return false
    }
  }
  return true
}

const checkCropMove = (evt: any) => {
  const [ canvas ] = useCanvas()
  const activeObject = evt.target as CanvasElement
  if (!activeObject || activeObject.name !== ElementNames.CROP) return
  const cropObject = activeObject as CropElement
  const imageObject = canvas.getObjects().filter(obj => (obj as CanvasElement).id === cropObject.imageId)[0]
  if (!imageObject) return
  const cropScaleX = cropObject.scaleX, cropScaleY = cropObject.scaleY
  const cropWidth = cropObject.width, cropHeight = cropObject.height
  const imageLeft = imageObject.left, imageTop = imageObject.top
  const imageWidth = imageObject.width, imageHeight = imageObject.height

  const cropLeftTopPoint = cropObject.getPointByOrigin('left', 'top')
  const cropRightBottomPoint = cropObject.getPointByOrigin('right', 'bottom')

  const imageLeftTopPoint = imageObject.getPointByOrigin('left', 'top')
  const imageRightBottomPoint = imageObject.getPointByOrigin('right', 'bottom')
  // 限制裁切框不能超过底图左侧
  if (cropLeftTopPoint.x <= imageLeftTopPoint.x) {
    cropObject.set({left: imageLeft - imageWidth / 2})
  }
  // 限制裁切框不能超过底图右侧
  if (cropRightBottomPoint.x >= imageRightBottomPoint.x) {
    cropObject.set({left: imageRightBottomPoint.x - cropWidth * cropScaleX})
  }
  // 限制裁切框不能超过底图上侧
  if (cropLeftTopPoint.y <= imageLeftTopPoint.y) {
    cropObject.set({top: imageTop - imageHeight / 2})
  }
  // 限制裁切框不能超过底图下侧
  if (cropRightBottomPoint.y >= imageRightBottomPoint.y) {
    cropObject.set({top: imageRightBottomPoint.y - cropHeight * cropScaleY})
  }
}


export const useObjectMoving = (evt: any) => {
  checkCropMove(evt)
  const fabricStore = useFabricStore()
  const { verticalLines, horizontalLines, elementCoords } = storeToRefs(fabricStore)
  const [ canvas ] = useCanvas()
  const activeObject = evt.target as CanvasElement
  const viewportTransform = canvas.viewportTransform
  if (!activeObject || activeObject.type === ElementNames.ACTIVE || (activeObject as ImageElement).isCropping) return
  const canvasObjects = canvas.getObjects()
  const activeObjectBoundingRect = activeObject.getBoundingRect()
  const scaleX = viewportTransform[0], scaleY = viewportTransform[3]
  let activeObjectHeight = activeObjectBoundingRect.height / scaleY
  let activeObjectWidth = activeObjectBoundingRect.width / scaleX
  if (activeObject.group) {
    activeObjectHeight = activeObjectBoundingRect.height
    activeObjectWidth = activeObjectBoundingRect.width
    elementCoords.value = activeObject.group.getCoords()
    if (activeObject.group.group) {
      elementCoords.value = [activeObject.group.oCoords.bl, activeObject.group.oCoords.br, activeObject.group.oCoords.tr, activeObject.group.oCoords.tl]
    }
  }
  const activeObjectCenter = activeObject.getCenterPoint()
  const activeObjectLeft = activeObjectCenter.x
  const activeObjectTop = activeObjectCenter.y
  
  let horizontalInTheRange = false
  let verticalInTheRange = false
  // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
  // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move
  for (let i = canvasObjects.length; i--; ) {
    const object = canvasObjects[i] as CanvasElement
    if (object === activeObject || object.id === activeObject.id) continue

    const objectCenter = object.getCenterPoint()
    const objectLeft = objectCenter.x
    const objectTop = objectCenter.y 
    const objectRect = object.getBoundingRect()
    const objectHeight = objectRect.height / scaleY
    const objectWidth = objectRect.width / scaleX
    // snap by the horizontal center line
    if (isInRange(objectLeft, activeObjectLeft) && isHasVerticalLines(objectLeft)) {
      verticalInTheRange = true
      const x = objectLeft
      let y1 = objectTop < activeObjectTop ? objectTop - objectHeight / 2 - aligningLineOffset : objectTop + objectHeight / 2 + aligningLineOffset
      let y2 = activeObjectTop > objectTop ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
      if (object.name === WorkSpaceName) {
        y1 = -aligningLinePadding, y2 = aligningLinePadding
      } 
      verticalLines.value.push({x, y1, y2})
      if (activeObject.group) {
        // activeObject.setPositionByOrigin(new Point(activeObject.lineCoords.tl.x + activeHalfWidth, activeObject.lineCoords.tl.y + activeHalfHeight), "center", "center")
      }
      else {
        // activeObject.setPositionByOrigin(new Point(objectLeft, activeObjectTop), "center", "center")
      }
    }

    // snap by the left edge
    if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2) && isHasVerticalLines(objectLeft - objectWidth / 2)) {
      verticalInTheRange = true
      const x = objectLeft - objectWidth / 2
      let y1 = objectTop < activeObjectTop ? objectTop - objectHeight / 2 - aligningLineOffset : objectTop + objectHeight / 2 + aligningLineOffset
      let y2 = activeObjectTop > objectTop ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
      if (object.name === WorkSpaceName) {
        y1 = -aligningLinePadding, y2 = aligningLinePadding
      } 
      verticalLines.value.push({ x, y1, y2})
      if (activeObject.group) {
        // activeObject.setPositionByOrigin(new Point(activeObject.lineCoords.tl.x + activeHalfWidth, activeObject.lineCoords.tl.y + activeHalfHeight), "center", "center")
      }
      else {
        // activeObject.setPositionByOrigin(new Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), "center", "center")
      }
    }

    // snap by the right edge
    if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2) && isHasVerticalLines(objectLeft + objectWidth / 2)) {
      verticalInTheRange = true
      const x = objectLeft + objectWidth / 2
      let y1 = objectTop < activeObjectTop ? objectTop - objectHeight / 2 - aligningLineOffset : objectTop + objectHeight / 2 + aligningLineOffset
      let y2 = activeObjectTop > objectTop ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset
      if (object.name === WorkSpaceName) {
        y1 = -aligningLinePadding, y2 = aligningLinePadding
      }
      verticalLines.value.push({x, y1, y2})
      if (activeObject.group) {
        // activeObject.setPositionByOrigin(new Point(activeObject.lineCoords.tl.x + activeHalfWidth, activeObject.lineCoords.tl.y + activeHalfHeight), "center", "center")
      } 
      else {
        // activeObject.setPositionByOrigin(new Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), "center", "center")
      }
    }

    // snap by the vertical center line
    if (isInRange(objectTop, activeObjectTop) && isHasHorizontalLines(objectTop)) {
      horizontalInTheRange = true
      const y = objectTop
      let x1 = objectLeft < activeObjectLeft ? objectLeft - objectWidth / 2 - aligningLineOffset : objectLeft + objectWidth / 2 + aligningLineOffset
      let x2 = activeObjectLeft > objectLeft ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
      if (object.name === WorkSpaceName) {
        x1 = -aligningLinePadding, x2 = aligningLinePadding
      }
      horizontalLines.value.push({y, x1, x2}) 
      
      if (activeObject.group) {
        // activeObject.setPositionByOrigin(new Point(activeObject.lineCoords.tl.x + activeHalfWidth, activeObject.lineCoords.tl.y + activeHalfHeight), "center", "center")
      }
      else {
        // activeObject.setPositionByOrigin(new Point(activeObjectLeft, objectTop), "center", "center")
      }
    }

    // snap by the top edge
    if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2) && isHasHorizontalLines(objectTop - objectHeight / 2)) {
      horizontalInTheRange = true
      const y = objectTop - objectHeight / 2
      let x1 = objectLeft < activeObjectLeft ? objectLeft - objectWidth / 2 - aligningLineOffset : objectLeft + objectWidth / 2 + aligningLineOffset
      let x2 = activeObjectLeft > objectLeft ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
      if (object.name === WorkSpaceName) {
        x1 = -aligningLinePadding, x2 = aligningLinePadding
      } 
      horizontalLines.value.push({ y, x1, x2 })
      if (activeObject.group) {
        // activeObject.setPositionByOrigin(new Point(activeObject.lineCoords.tl.x + activeHalfWidth, activeObject.lineCoords.tl.y + activeHalfHeight), "center", "center")
      }
      else {
        // activeObject.setPositionByOrigin(new Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), "center", "center")
      }
      
    }

    // snap by the bottom edge
    if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2) && isHasHorizontalLines(objectTop + objectHeight / 2)) {
      horizontalInTheRange = true
      const y = objectTop + objectHeight / 2
      let x1 = objectLeft < activeObjectLeft ? objectLeft - objectWidth / 2 - aligningLineOffset : objectLeft + objectWidth / 2 + aligningLineOffset
      let x2 = activeObjectLeft > objectLeft ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset
      if (object.name === WorkSpaceName) {
        x1 = -aligningLinePadding, x2 = aligningLinePadding
      }
      horizontalLines.value.push({y, x1, x2})
      if (activeObject.group) {
        // activeObject.setPositionByOrigin(new Point(activeObject.lineCoords.tl.x + activeHalfWidth, activeObject.lineCoords.tl.y + activeHalfHeight), "center", "center")
      }
      else {
        // activeObject.setPositionByOrigin(new Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), "center","center")
      }
      
    }
  }
  if (!horizontalInTheRange) {
    horizontalLines.value.length = 0
  }

  if (!verticalInTheRange) {
    verticalLines.value.length = 0
  }
}