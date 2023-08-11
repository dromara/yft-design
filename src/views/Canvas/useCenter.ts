import { WorkSpaceDrawType } from "@/configs/canvas"
import useCanvas from "./useCanvas"

export default () => {
  const [ canvas ] = useCanvas()
  const workSpaceDraw = canvas.getObjects().filter(item => item.id === WorkSpaceDrawType)[0]
  const centerPoint = workSpaceDraw.getCenterPoint()
  const originPoint = workSpaceDraw.getPointByOrigin('left', 'top')
  return {
    workSpaceDraw,
    centerPoint,
    originPoint
  }
}