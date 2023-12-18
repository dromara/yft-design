import { noop } from '@vueuse/core'
import { TControlSet } from '@/types/fabric'
import { PolygonElement } from '@/types/canvas'
import { PiBy180, toFixed } from '@/utils/common'
import { px2mm } from '@/utils/image'
import { Control, Object as FabricObject, controlsUtils, Point, Polygon, TPointerEvent, Transform, TDegree, util,TransformActionHandler } from 'fabric'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'


export const changeObjectHeight: TransformActionHandler = (eventData: TPointerEvent, transform: Transform, x: number, y: number) => {
  const localPoint = controlsUtils.getLocalPoint(transform, transform.originX, transform.originY, x, y);
  
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


// define a function that can locate the controls.
// this function will be used both for drawing and for interaction.
export function polygonPositionHandler(dim: Point, finalMatrix: number[], fabricObject: any) {
  // @ts-ignore
  const pointIndex = this.pointIndex
  
  const x = (fabricObject.points[pointIndex].x - fabricObject.pathOffset.x)
  const y = (fabricObject.points[pointIndex].y - fabricObject.pathOffset.y)
  
  const point = util.transformPoint(
    { x, y } as Point,
    util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix()
    )
  )
  const snapPoint = fabricObject.pointMoving(pointIndex, point)
  // console.log('Point:', point, 'x:', x, 'y:', y, snapPoint)
  return point
}

function getObjectSizeWithStroke(object: FabricObject) {
  const scaleX = object.scaleX, scaleY = object.scaleY, strokeWidth = object.strokeWidth
  const width = object.width, height = object.height
  const stroke = new Point(
    object.strokeUniform ? 1 / scaleX : 1, 
    object.strokeUniform ? 1 / scaleY : 1
  ).scalarMultiply(strokeWidth);
  return new Point(width + stroke.x, height + stroke.y);
}

// define a function that can keep the polygon in the same position when we change its
// width/height/top/left.
export function anchorWrapper(anchorIndex: number, fn: Function) {

  return function(eventData: MouseEvent, transform: any, x: number, y: number) {

    const fabricObject = transform.target as Polygon
    const pointX = fabricObject.points[anchorIndex].x, pointY = fabricObject.points[anchorIndex].y
    const handlePoint = new Point({x: (pointX - fabricObject.pathOffset.x), y: (pointY - fabricObject.pathOffset.y)})
    const absolutePoint = util.transformPoint(handlePoint, fabricObject.calcTransformMatrix()),
        actionPerformed = fn(eventData, transform, x, y),
        newDim = fabricObject.setDimensions(),
        polygonBaseSize = getObjectSizeWithStroke(fabricObject),
        newX = (pointX - fabricObject.pathOffset.x) / polygonBaseSize.x,
        newY = (pointY - fabricObject.pathOffset.y) / polygonBaseSize.y
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5)
    return actionPerformed
  }
}

export function actionHandler(eventData: TPointerEvent, transform: any, x: number, y: number) {
  const polygon = transform.target as PolygonElement
  if (!polygon.__corner) return
  const currentControl = polygon.controls[polygon.__corner]
  const mouseLocalPosition = controlsUtils.getLocalPoint(transform, 'center', 'center', x, y)
  // const mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center')
  const polygonBaseSize = getObjectSizeWithStroke(polygon)

  const size = polygon._getTransformedDimensions(0)
  const finalPointPosition = {
    x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
    y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
  } as Point
  polygon.points[currentControl.pointIndex as number] = finalPointPosition
  return true
}

/**
 * 计算当前控件的位置
 */
const positionHandler: Control['positionHandler'] = (dim, finalMatrix, fabricObject, currentControl) => {
  return new Point(
    currentControl.x * dim.x + currentControl.offsetX,
    currentControl.y * dim.y + currentControl.offsetY,
  ).transform(finalMatrix)
}

export const getWidthHeight = (fabricObject: FabricObject, noFixed = false) => {
  const objScale = fabricObject.getObjectScaling()
  const point = fabricObject._getTransformedDimensions({
    scaleX: objScale.x,
    scaleY: objScale.y,
  })
  if (!noFixed) {
    point.setX(toFixed(point.x))
    point.setY(toFixed(point.y))
  }
  return point
}

/**
 * 更新ml, mr, mt, mb的控件大小
 */
const setCornersSize = (object: FabricObject) => {
  if (!object.canvas) return
  const zoom = object.canvas.getZoom()
  const size = getWidthHeight(object).scalarMultiply(zoom)
  const controls = object.controls
  const cornersH = ['ml', 'mr']
  cornersH.forEach((corner) => {
    controls[corner].sizeX = object.cornerSize
    controls[corner].sizeY = size.y
    controls[corner].touchSizeX = object.touchCornerSize
    controls[corner].touchSizeY = size.y
  })
  const cornersV = ['mt', 'mb']
  cornersV.forEach((corner) => {
    controls[corner].sizeX = size.x
    controls[corner].sizeY = object.cornerSize
    controls[corner].touchSizeX = size.x
    controls[corner].touchSizeY = object.touchCornerSize
  })
}

/**
 * 旋转图标
 */
const rotateIcon = (angle: number) => {
  return `url("data:image/svg+xml,<svg height='20' width='20' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'><g fill='none' transform='rotate(${angle} 16 16)'><path fill='white' d='M18.24 5.37C11.41 6.04 5.98 11.46 5.32 18.26L0 18.26L7.8 26L15.61 18.27L10.6 18.27C11.21 14.35 14.31 11.25 18.24 10.64L18.24 15.55L26 7.78L18.24 0L18.24 5.37Z'></path><path fill='black' d='M19.5463 6.61441C12.4063 6.68441 6.61632 12.4444 6.56632 19.5644L3.17632 19.5644L7.80632 24.1444L12.4363 19.5644L9.18632 19.5644C9.24632 13.8844 13.8563 9.28441 19.5463 9.22441L19.5463 12.3844L24.1463 7.78441L19.5463 3.16441L19.5463 6.61441Z'></path></g></svg>") 12 12,auto`
}

/**
 * 旋转吸附，按住shift键，吸附15度角
 */
const rotationWithSnapping = (eventData: TPointerEvent, transform: Transform, x: number, y: number) => {
  const { shiftKey } = eventData
  const { target } = transform
  const { rotationWithSnapping } = controlsUtils
  let snapAngle: TDegree | undefined
  if (shiftKey) {
    snapAngle = target.snapAngle
    target.snapAngle = 15
  }
  const res = rotationWithSnapping(eventData, transform, x, y)
  snapAngle && (target.snapAngle = snapAngle)
  return res
}

/**
 * 获取旋转控件
 */
const getRotateControl = (angle: number): Partial<Control> => ({
  sizeX: 16,
  sizeY: 16,
  actionHandler: (eventData, transformData, x, y) => {
    transformData.target.canvas?.setCursor(rotateIcon(transformData.target.angle + angle))
    return rotationWithSnapping(eventData, transformData, x, y)
  },
  cursorStyleHandler: (eventData, control, fabricObject) => {
    return rotateIcon(fabricObject.angle + angle)
  },
  render: noop,
  actionName: 'rotate',
})

/**
 * 获取通用控件属性
 */
const getHornControl = {
  cursorStyleHandler: controlsUtils.scaleCursorStyleHandler,
  actionHandler: controlsUtils.scalingEqually,
  actionName: 'scaling',
}

export const defaultControls = (): TControlSet => ({
  size: new Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: () => '',
    offsetY: 14,
    sizeX: 0.0001,
    sizeY: 0.0001,
    touchSizeX: 0.0001,
    touchSizeY: 0.0001,
    render: (ctx, left, top, styleOverride, fabricObject: FabricObject) => {
      // todo: 支持组内反转的对象
      ctx.save()
      ctx.translate(left, top)

      const calcRotate = () => {
        const objectAngle = fabricObject.group ? fabricObject.getTotalAngle() : fabricObject.angle
        const angleInRadians = objectAngle * PiBy180
        const x = Math.sin(angleInRadians)
        const y = Math.cos(angleInRadians)
        const angle = Math.abs(x) > Math.abs(y) ? Math.sign(x) * 90 : Math.sign(y) * 90 - 90
        return (objectAngle - angle) * PiBy180
      }

      ctx.rotate(calcRotate())

      const fontSize = 12
      ctx.font = `${fontSize}px Tahoma`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const { x, y } = getWidthHeight(fabricObject)
      const { unitMode } = storeToRefs(useMainStore())
      let text = unitMode.value === 0 ? `${toFixed(px2mm(x))} × ${toFixed(px2mm(y))}` : `${x} × ${y}`
      const width = ctx.measureText(text).width + 8
      const height = fontSize + 6

      // 背景
      //@ts-ignore
      ctx.roundRect(-width / 2, -height / 2, width, height, 4)
      ctx.fillStyle = '#0066ff'
      ctx.fill()

      // 文字
      ctx.fillStyle = '#fff'
      ctx.fillText(text, 0, 1)
      ctx.restore()
    },
    positionHandler: (dim, finalMatrix, fabricObject: FabricObject, currentControl) => {
      const activeObject = fabricObject.canvas?.getActiveObject instanceof Function ? fabricObject.canvas?.getActiveObject() : null
      
      if (activeObject && activeObject === fabricObject) {
        const angle = fabricObject.getTotalAngle()

        const angleInRadians = angle * PiBy180

        const x = Math.sin(angleInRadians)
        const y = Math.cos(angleInRadians)

        if (Math.abs(x) >= Math.abs(y)) {
          const sign = Math.sign(x)
          currentControl.x = sign / 2
          currentControl.y = 0
          currentControl.offsetX = sign * 14
          currentControl.offsetY = 0
        } else {
          const sign = Math.sign(y)
          currentControl.x = 0
          currentControl.y = sign / 2
          currentControl.offsetX = 0
          currentControl.offsetY = sign * 14
        }

        // 更新其它corners大小，放到这里一起更新，来防止多次运行
        setCornersSize(fabricObject)
      }

      return positionHandler(dim, finalMatrix, fabricObject, currentControl)
    },
  }),

  tlr: new Control({
    x: -0.5,
    y: -0.5,
    offsetX: -4,
    offsetY: -4,
    ...getRotateControl(0),
  }),

  trr: new Control({
    x: 0.5,
    y: -0.5,
    offsetX: 4,
    offsetY: -4,
    ...getRotateControl(90),
  }),

  brr: new Control({
    x: 0.5,
    y: 0.5,
    offsetX: 4,
    offsetY: 4,
    ...getRotateControl(180),
  }),

  blr: new Control({
    x: -0.5,
    y: 0.5,
    offsetX: -4,
    offsetY: 4,
    ...getRotateControl(270),
  }),

  ml: new Control({
    x: -0.5,
    y: 0,
    actionHandler: controlsUtils.scalingXOrSkewingY,
    cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
    actionName: 'scaling',
    render: noop,
    // 不在这里设置positionHandler，放到size的positionHandler一起更新
    // positionHandler: positionHandlerH,
  }),

  mr: new Control({
    x: 0.5,
    y: 0,
    actionHandler: controlsUtils.scalingXOrSkewingY,
    cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
    actionName: 'scaling',
    render: noop,
    // positionHandler: positionHandlerH,
  }),

  mb: new Control({
    x: 0,
    y: 0.5,
    actionHandler: controlsUtils.scalingYOrSkewingX,
    cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
    actionName: 'scaling',
    render: noop,
    // positionHandler: positionHandlerV,
  }),

  mt: new Control({
    x: 0,
    y: -0.5,
    actionHandler: controlsUtils.scalingYOrSkewingX,
    cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
    actionName: 'scaling',
    render: noop,
    // positionHandler: positionHandlerV,
  }),

  tl: new Control({
    x: -0.5,
    y: -0.5,
    ...getHornControl,
  }),

  tr: new Control({
    x: 0.5,
    y: -0.5,
    ...getHornControl,
  }),

  bl: new Control({
    x: -0.5,
    y: 0.5,
    ...getHornControl,
  }),

  br: new Control({
    x: 0.5,
    y: 0.5,
    ...getHornControl,
  }),
})

const changeWidth = controlsUtils.wrapWithFireEvent(
  'scaling',
  controlsUtils.wrapWithFixedAnchor(controlsUtils.changeWidth),
)

const changeHeight = controlsUtils.wrapWithFireEvent(
  'scaling',
  controlsUtils.wrapWithFixedAnchor(changeObjectHeight)
)

export const resizeControls = (): TControlSet => ({
  mr: new Control({
    x: 0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
    render: noop,
    // positionHandler: positionHandlerH,
  }),
  ml: new Control({
    x: -0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
    render: noop,
    // positionHandler: positionHandlerH,
  }),
  mt: new Control({
    x: 0,
    y: -0.5,
    actionHandler: changeHeight,
    cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
    render: noop,
    // positionHandler: positionHandlerH,
  }),
  mb: new Control({
    x: 0,
    y: 0.5,
    actionHandler: changeHeight,
    cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
    render: noop,
    // positionHandler: positionHandlerH,
  }),
})

export const textboxControls = (): TControlSet => ({
  ...defaultControls(),
  ...resizeControls(),
})
