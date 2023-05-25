import { ImageElement, LineElement, PolygonElement } from '@/types/canvas'
import * as fabric from 'fabric'


const getLocalPoint = ({ target, corner }: any, originX: string, originY: string, x: number, y: number) => {
  const control = target.controls[corner]
  const zoom = target.canvas?.getZoom() || 1
  const padding = (target.padding ? target.padding: 0) / zoom
  const localPoint = target.toLocalPoint(new fabric.Point(x, y), originX, originY)
  // const localPoint = normalizePoint(target, {x, y}, originX, originY)
  if (localPoint.x >= padding) {
    localPoint.x -= padding;
  }
  if (localPoint.x <= -padding) {
    localPoint.x += padding;
  }
  if (localPoint.y >= padding) {
    localPoint.y -= padding;
  }
  if (localPoint.y <= padding) {
    localPoint.y += padding;
  }
  localPoint.x -= control.offsetX;
  localPoint.y -= control.offsetY;
  return localPoint;
}

export const changeCropX = (eventData: MouseEvent, transform: any, x: number, y: number) => {
  const { target } = transform
  const handleElement = target as ImageElement
  if (typeof handleElement.width === 'number' && typeof handleElement.left === 'number' && typeof handleElement.originLeft === 'number') {
    const width = target.width ? target.width : 0
    const widthHalf = width / 2
    const originCropX = handleElement.originCropX ? handleElement.originCropX : 0
    if (x + widthHalf < handleElement.originLeft || x + widthHalf > handleElement.originLeft + width) return false
    const moveX = x - (handleElement.originLeft - widthHalf)
    
    handleElement.left = handleElement.originLeft + moveX
    handleElement.cropX = originCropX + moveX
    return true
  }
  return false
}

export const changeCropY = (eventData: MouseEvent, transform: any, x: number, y: number) => {
  const { target } = transform
  const handleElement = target as ImageElement
  if (typeof handleElement.height === 'number' && typeof handleElement.top === 'number' && typeof handleElement.originTop === 'number') {
    const originCropY = handleElement.originCropY ? handleElement.originCropY : 0
    const height = target.height ? target.height : 0
    const heightHalf = height / 2
    if (y + heightHalf < handleElement.originTop || y + heightHalf > handleElement.originTop + height) return false
    const moveY = y - (handleElement.originTop - heightHalf)
  
    handleElement.top = handleElement.originTop + moveY
    handleElement.cropY = originCropY + moveY
    return true
  }
  return false
}

export const changeWidth = (eventData: MouseEvent, transform: any, x: number, y: number) => {
  const localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y);
  
  const { target } = transform
  if ((transform.originX === 'left' && localPoint.x > 0) || (transform.originX === 'right' && localPoint.x < 0)) {
    
    const strokeWidth = target.strokeWidth ? target.strokeWidth : 0
    if (!target.scaleX) return false
    const strokePadding = strokeWidth / (target.strokeUniform ? target.scaleX : 1)
    const oldWidth = target.height
    const newWidth = Math.ceil(Math.abs((localPoint.x * 1) / target.scaleX) - strokePadding)
    target.set('width', Math.max(newWidth, 0))
    return oldWidth !== target.width;
  }
  return false;
}

export const changeHeight = (eventData: MouseEvent, transform: any, x: number, y: number) => {
  const localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y);
  
  //  make sure the control changes width ONLY from it's side of target
  const { target } = transform
  if ((transform.originY === 'top' && localPoint.y > 0) || (transform.originY === 'bottom' && localPoint.y < 0)) {
    
    const strokeWidth = target.strokeWidth ? target.strokeWidth : 0
    if (!target.scaleY) return false
    const strokePadding = strokeWidth / (target.strokeUniform ? target.scaleY : 1)
    const oldHeight = target.height
    const newHeight = Math.ceil(Math.abs((localPoint.y * 1) / target.scaleY) - strokePadding)
    target.set('height', Math.max(newHeight, 0))
    return oldHeight !== target.height;
  }
  return false;
};

export const changePoint = (eventData: MouseEvent, transform: any, x: number, y: number) => {
  const localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y);
  
  //  make sure the control changes width ONLY from it's side of target
  const { target } = transform
  const lineElement = target as LineElement
  // if ((transform.originY === 'top' && localPoint.y > 0) || (transform.originY === 'bottom' && localPoint.y < 0)) {
    
  //   const strokeWidth = target.strokeWidth ? target.strokeWidth : 0
  //   if (!target.scaleY) return false
  //   const strokePadding = strokeWidth / (target.strokeUniform ? target.scaleY : 1)
  //   const oldHeight = target.height
  //   const newHeight = Math.ceil(Math.abs((localPoint.y * 1) / target.scaleY) - strokePadding)
  lineElement.set('x1', x)
  lineElement.set('y1', y)
  return false;
};

function wrapWithFixedAnchor(actionHandler: any) {

  return function(eventData: MouseEvent, transform: any, x: number, y: number) {
    const target = transform.target
    const centerPoint = target.getCenterPoint()
    const constraint = target.translateToOriginPoint(centerPoint, transform.originX, transform.originY)
    const actionPerformed = actionHandler(eventData, transform, x, y)
    target.setPositionByOrigin(constraint, transform.originX, transform.originY);
    return actionPerformed;
  };
}

function commonEventInfo(eventData: MouseEvent, transform: any, x: number, y: number) {
  return {
    e: eventData,
    transform: transform,
    pointer: {
      x: x,
      y: y,
    }
  };
}


function fireEvent(eventName: string, options: any) {
  const target = options.transform.target
  const canvas = target.canvas
  // @ts-ignore
  const canvasOptions = fabric.util.object.clone(options);
  canvasOptions.target = target;
  canvas && canvas.fire('object:' + eventName, canvasOptions);
  target.fire(eventName, options);
}

export const wrapWithFireEvent = (actionName: string,  actionHandler: any) : any => {

  return function(eventData: MouseEvent, transform: any, x: number, y: number) {
    const actionPerformed = actionHandler(eventData, transform, x, y);
    if (actionPerformed) {
      fireEvent(actionName, commonEventInfo(eventData, transform, x, y));
    }
    return actionPerformed;
  };
}

export const initFabricActionHandler = () => {
  // @ts-ignore
  fabric.controlsUtils.changeHeight = wrapWithFireEvent('resizing', wrapWithFixedAnchor(changeHeight))
  // @ts-ignore
  fabric.controlsUtils.changeCropX = changeCropX
  // @ts-ignore
  fabric.controlsUtils.changeCropY = changeCropY
  // @ts-ignore
  fabric.controlsUtils.changePoint = changePoint
}


// define a function that can locate the controls.
// this function will be used both for drawing and for interaction.
export function polygonPositionHandler(dim: fabric.Point, finalMatrix: number[], fabricObject: any) {
  // @ts-ignore
  const pointIndex = this.pointIndex
  const x = (fabricObject.points[pointIndex].x - fabricObject.pathOffset.x)
  const y = (fabricObject.points[pointIndex].y - fabricObject.pathOffset.y)
  return fabric.util.transformPoint(
    { x, y } as fabric.Point,
    fabric.util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix()
    )
  )
}

function getObjectSizeWithStroke(object: fabric.Object) {
  const scaleX = object.scaleX, scaleY = object.scaleY, strokeWidth = object.strokeWidth
  const width = object.width, height = object.height
  const stroke = new fabric.Point(
    object.strokeUniform ? 1 / scaleX : 1, 
    object.strokeUniform ? 1 / scaleY : 1
  ).scalarMultiply(strokeWidth);
  return new fabric.Point(width + stroke.x, height + stroke.y);
}

// define a function that can keep the polygon in the same position when we change its
// width/height/top/left.
export function anchorWrapper(anchorIndex: any, fn: any) {

  return function(eventData: MouseEvent, transform: any, x: number, y: number) {

    const fabricObject = transform.target as PolygonElement
    const pointX = fabricObject.points[anchorIndex].x, pointY = fabricObject.points[anchorIndex].y
    const handlePoint = new fabric.Point({x: (pointX - fabricObject.pathOffset.x), y: (pointY - fabricObject.pathOffset.y)})
    const absolutePoint = fabric.util.transformPoint(handlePoint, fabricObject.calcTransformMatrix()),
        actionPerformed = fn(eventData, transform, x, y),
        newDim = fabricObject.setDimensions(),
        polygonBaseSize = getObjectSizeWithStroke(fabricObject),
        newX = (pointX - fabricObject.pathOffset.x) / polygonBaseSize.x,
        newY = (pointY - fabricObject.pathOffset.y) / polygonBaseSize.y
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5)
    return actionPerformed;
  }
}

export function actionHandler(eventData: MouseEvent, transform: any, x: number, y: number) {
  const polygon = transform.target as PolygonElement
  if (!polygon.__corner) return
  const currentControl = polygon.controls[polygon.__corner]
  const mouseLocalPosition = fabric.controlsUtils.getLocalPoint(transform, 'center', 'center', x, y)
  // const mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center')
  const polygonBaseSize = getObjectSizeWithStroke(polygon)

  const size = polygon._getTransformedDimensions(0)
  const finalPointPosition = {
    x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
    y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
  } as fabric.Point
  // @ts-ignore
  polygon.points[currentControl.pointIndex] = finalPointPosition
  return true
}

