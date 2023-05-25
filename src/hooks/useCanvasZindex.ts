import { 
  WorkSpaceClipType, 
  WorkSpaceDrawType, 
  WorkSpaceMaskType, 
  WorkSpaceSafeType, 
  WorkSpaceLineType 
} from "@/configs/canvas"
import { Canvas } from "fabric/fabric-impl"

export default () => {
  const setZindex = (canvas: Canvas) => {
    canvas.sendObjectToBack(canvas.getObjects(WorkSpaceDrawType)[0])
    canvas.bringObjectToFront(canvas.getObjects(WorkSpaceMaskType)[0])
    canvas.bringObjectToFront(canvas.getObjects(WorkSpaceClipType)[0])
    canvas.bringObjectToFront(canvas.getObjects(WorkSpaceSafeType)[0])
    canvas.bringObjectToFront(canvas.getObjects(WorkSpaceLineType)[0])
  }
  return {
    setZindex
  }
}