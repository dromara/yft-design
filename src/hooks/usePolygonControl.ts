import { polygonPositionHandler, anchorWrapper, actionHandler} from '@/extension/controls/index'
import { PolygonElement } from '@/types/canvas'
import useCanvas from '@/views/Canvas/useCanvas'
import * as fabric from 'fabric'

export default () => {
  const setPolygonControl = (element: PolygonElement) => {
    const [ canvas ] = useCanvas()
    element.cornerColor = 'rgba(0,0,255,0.5)'
    if (!element.points) return
    const lastControl = element.points.length - 1;
    
    element.controls = element.points.reduce((acc: any, point: fabric.Point, index: number) => {
      acc[index] = new fabric.Control({
        positionHandler: polygonPositionHandler,
        // @ts-ignore
        actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
        actionName: 'modifyPolygon',
        pointIndex: index
      })
      return acc
    }, {})
    canvas.renderAll()
  }

  return {
    setPolygonControl
  }
}