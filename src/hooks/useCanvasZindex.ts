import { 
  WorkSpaceClipType, 
  WorkSpaceDrawType, 
  WorkSpaceMaskType, 
  WorkSpaceSafeType, 
} from "@/configs/canvas"
import { CanvasElement } from "@/types/canvas"
import { Canvas } from "fabric/fabric-impl"

export default () => {
  const setZindex = (canvas: Canvas) => {
    canvas.sendObjectToBack(canvas.getObjects().filter(ele => (ele as CanvasElement).id === WorkSpaceDrawType)[0])
    canvas.bringObjectToFront(canvas.getObjects().filter(ele => (ele as CanvasElement).id === WorkSpaceMaskType)[0])
    canvas.bringObjectToFront(canvas.getObjects().filter(ele => (ele as CanvasElement).id === WorkSpaceClipType)[0])
    canvas.bringObjectToFront(canvas.getObjects().filter(ele => (ele as CanvasElement).id === WorkSpaceSafeType)[0])
  }
  return {
    setZindex
  }
}