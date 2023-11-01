import useCanvas from "./useCanvas"
import { WorkSpaceDrawType } from "@/configs/canvas"
import { CanvasElement } from "@/types/canvas"
import { Group, Point } from "fabric"

export default () => {
  const [ canvas ] = useCanvas()
  const workSpaceDraw = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0] as CanvasElement
  const objects = canvas.getObjects()
  // const centerPoint = workSpaceDraw.getCenterPoint()
  // const originPoint = workSpaceDraw.getPointByOrigin('left', 'top')
  const boundingBox = Group.prototype.getObjectsBoundingBox(objects)
  // if (boundingBox) {
  //   console.log(boundingBox.centerX, boundingBox.centerY, centerPoint)
  // }
  let left = 0, top = 0
  let centerPoint = canvas.getCenterPoint()
  let width = canvas.getWidth(), height = canvas.getHeight()
  if (boundingBox) {
    centerPoint = new Point(boundingBox.centerX, boundingBox.centerY)
    width = boundingBox.width, height = boundingBox.height
    left = boundingBox.centerX - boundingBox.width / 2
    top = boundingBox.centerY - boundingBox.height / 2
  }
  
  return {
    // workSpaceDraw,
    width,
    height,
    left,
    top,
    centerPoint
  }
}