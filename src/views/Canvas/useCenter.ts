import useCanvas from "./useCanvas"
import { WorkSpaceDrawType, WorkSpaceThumbType } from "@/configs/canvas"
import { CanvasElement } from "@/types/canvas"
import { Group, Point } from "fabric"

export default () => {
  const [ canvas ] = useCanvas()
  const workSpaceDraw = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0] as CanvasElement
  const objects = canvas.getObjects().filter(ele => !WorkSpaceThumbType.includes(ele.id))
  const boundingBox = Group.prototype.getObjectsBoundingBox(objects)

  let left = 0, top = 0
  let centerPoint = canvas.getCenterPoint()
  let width = canvas.getWidth(), height = canvas.getHeight()
  if (boundingBox) {
    centerPoint = new Point(boundingBox.centerX, boundingBox.centerY)
    width = boundingBox.width, height = boundingBox.height
    left = boundingBox.centerX - boundingBox.width / 2
    top = boundingBox.centerY - boundingBox.height / 2
  }
  if (workSpaceDraw) {
    centerPoint = new Point(workSpaceDraw.left + workSpaceDraw.width / 2, workSpaceDraw.top + workSpaceDraw.height / 2)
    width = workSpaceDraw.width, height = workSpaceDraw.height
    left = workSpaceDraw.left
    top = workSpaceDraw.top
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