import { storeToRefs } from 'pinia'
import { Canvas, Rect, Object as FabricObject, Control, Textbox, controlsUtils, Path, Line, Group, Image } from 'fabric'
import { useFabricStore } from '@/store/modules/fabric'
import { watch } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { GuideLines } from '@/app/guideLiles'
import { HoverBorders } from '@/app/hoverBorders'
import { WheelScroll } from '@/app/wheelScroll'
import { Ruler } from '@/app/ruler'
import { DefaultDPI, DefaultRatio } from '@/configs/size'
import { useTemplatesStore } from '@/store'
import { CanvasElement } from '@/types/canvas'
import { TransparentFill } from '@/configs/background'
import { drawRotateIcon, drawAngleIcon, drawVerticalLeftLineIcon, drawVerticalRightLineIcon } from '@/utils/drawer'
import useCanvasScale from '@/hooks/useCanvasScale'
import useRotate from './useRotate'
import { 
  WorkSpaceClipType, 
  WorkSpaceName, 
  WorkSpaceEditColor, 
  WorkSpaceDrawType,
  WorkSpaceCommonOption,
  WorkSpaceMaskType, 
  WorkSpaceSafeType, 
  WorkSpaceClipColor, 
  WorkSpaceSafeColor, 
  WorkSpaceLineType, 
  WorkSpaceMaskColor
} from '@/configs/canvas'
import useHandleBackground from '@/hooks/useHandleBackground'




let canvas: null | Canvas = null

// 初始化配置
const initConf = () => {
  const { rotateElement, unrotateElement } = useRotate()
  FabricObject.prototype.objectCaching = false
  FabricObject.ownDefaults.borderColor = 'blue'
  FabricObject.ownDefaults.cornerColor = 'white'
  FabricObject.ownDefaults.cornerStrokeColor = '#c0c0c0'
  FabricObject.ownDefaults.borderOpacityWhenMoving = 1
  FabricObject.ownDefaults.borderScaleFactor = 1
  FabricObject.ownDefaults.cornerSize = 10
  FabricObject.ownDefaults.cornerStyle = 'circle'
  FabricObject.ownDefaults.centeredScaling = false
  FabricObject.ownDefaults.centeredRotation = true
  FabricObject.ownDefaults.transparentCorners = false
  FabricObject.ownDefaults.rotatingPointOffset = 5
  FabricObject.ownDefaults.lockUniScaling = true
  FabricObject.ownDefaults.hasRotatingPoint = true
  // Object.prototype.controls.mt.visible = false
  // Object.prototype.controls.mb.visible = false
  console.log('FabricObject.ownDefaults.controls :', FabricObject.ownDefaults )
  // Object.prototype.controls.mtr = new Control({
  //   x: 0,
  //   y: -0.5,
  //   actionHandler: controlsUtils.rotationWithSnapping,
  //   cursorStyleHandler: controlsUtils.rotationStyleHandler,
  //   actionName: 'rotating',
  //   render: drawRotateIcon,
  //   sizeX: 20,
  //   sizeY: 20,
  //   offsetY: -20,
  //   withConnection: false,
  //   mouseDownHandler: () => rotateElement(),
  //   mouseUpHandler: () => unrotateElement()
  // })

  // Object.prototype.controls.angle = new Control({
  //   x: 0,
  //   y: -0.5,
  //   actionName: 'angle',
  //   render: drawAngleIcon,
  //   sizeX: 20,
  //   sizeY: 20,
  //   offsetY: -60,
  //   withConnection: false,
  // })
  
  // Textbox.prototype.controls.ml = new Control({
  //   x: -0.5,
  //   y: 0,
  //   actionHandler: controlsUtils.changeWidth,
  //   cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
  //   actionName: 'resizing',
  //   render: drawVerticalLeftLineIcon,
  //   sizeX: 28,
  //   sizeY: 28,
  //   withConnection: true,
  // })

  // Textbox.prototype.controls.mtr = new Control({
  //   x: 0,
  //   y: -0.5,
  //   actionHandler: controlsUtils.rotationWithSnapping,
  //   cursorStyleHandler: controlsUtils.rotationStyleHandler,
  //   actionName: 'rotating',
  //   render: drawRotateIcon,
  //   sizeX: 20,
  //   sizeY: 20,
  //   offsetY: -20,
  //   withConnection: false,
  // })

  // Textbox.prototype.controls.mr = new Control({
  //   x: 0.5,
  //   y: 0,
  //   actionHandler: controlsUtils.changeWidth,
  //   cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
  //   actionName: 'resizing',
  //   render: drawVerticalRightLineIcon,
  //   sizeX: 28,
  //   sizeY: 28,
  //   withConnection: true,
  // })
}

const initWorkSpace = (width: number, height: number) => {
  const fabricStore = useFabricStore()
  const templatesStore = useTemplatesStore()
  const { scalePercentage, zoom, clip } = storeToRefs(fabricStore)
  const { currentTemplate } = storeToRefs(templatesStore)
  const scalePercentageVal = scalePercentage.value / 100
  let zoomVal = 1
  const workWidth = currentTemplate.value.width / currentTemplate.value.zoom
  const workHeight = currentTemplate.value.height / currentTemplate.value.zoom

  if (!canvas) {
    return {
      workWidth,
      workHeight
    }
  }
  // const canvasWidth = canvas.width ? canvas.width : fabricStore.getWidth()
  // const canvasHeight = canvas.height ? canvas.height : fabricStore.getHeight()

  // const canvasWidth = width
  // const canvasHeight = height
  // const viewportTransform = currentTemplate.value.viewportTransform
  
  if (width < workWidth || height < workHeight) {
    //按照宽度缩放
    if (workWidth / width > workHeight / height) {
      zoomVal = workWidth / (width * scalePercentageVal)
    } 
    //按照高度缩放
    else {  
      zoomVal = workHeight / (height * scalePercentageVal)
    }
  }
  zoom.value = 1 / zoomVal
  clip.value = currentTemplate.value.clip
  canvas.setZoom(zoom.value)
  return {
    workWidth,
    workHeight
  }
}

// // 更新画布尺寸
// const setCanvasSize = (width: number, height: number) => {
//   if (!canvas) return
//   const fabricStore = useFabricStore()
//   const { zoom } = storeToRefs(fabricStore)
//   zoom.value = canvas.getZoom()
//   canvas.setDimensions({width, height})
//   canvas.renderAll()
// }

// 更新视图区长宽
const setCanvasTransform = () => {
  
  if (!canvas) return
  
  const fabricStore = useFabricStore()
  const { zoom, wrapperRef } = storeToRefs(fabricStore)
  const { width, height } = useElementBounding(wrapperRef.value)
  initWorkSpace(width.value, height.value)
  const WorkSpaceDraw = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0]
  // const WorkSpaceClip = canvas.getObjects(WorkSpaceClipType)[0]
  if (!WorkSpaceDraw) return
  const workSpaceBound = WorkSpaceDraw.getBoundingRect()
  const left = WorkSpaceDraw.left, top = WorkSpaceDraw.top
  const canvasTransform = canvas.viewportTransform
  // if (!canvasTransform ) return
  zoom.value = canvas.getZoom()
  canvasTransform[4] = (width.value - workSpaceBound.width) / 2 - left * zoom.value
  canvasTransform[5] = (height.value - workSpaceBound.height) / 2 - top * zoom.value
  canvas.setViewportTransform(canvasTransform)
  canvas.setDimensions({width: width.value, height: height.value})
  canvas.renderAll()
}

// 初始化工作台
export const initWorks = () => {
  if (!canvas) return
  const fabricStore = useFabricStore()
  const { zoom, clip, safe, diagonal, opacity, showClip, showSafe, wrapperRef } = storeToRefs(fabricStore)
  const canvasWidth = canvas.width ? canvas.width : fabricStore.getWidth()
  const canvasHeight = canvas.height ? canvas.height : fabricStore.getHeight()
  const { workWidth, workHeight } = initWorkSpace(0, 0)
  const left = (canvasWidth - workWidth) / 2 * zoom.value
  const top = (canvasHeight - workHeight ) / 2 * zoom.value
  const Padding = 50000, PaddingHalf = Padding / 2
  const clipPX = clip.value * DefaultDPI / DefaultRatio
  const diagonalPX = diagonal.value * DefaultDPI / DefaultRatio
  const safePX = 2 * safe.value * DefaultDPI / DefaultRatio

  // @ts-ignore
  const workSpaceDraw = new Rect({
    left: left - clipPX,
    top: top - clipPX,
    width: workWidth + 2 * clipPX,
    height: workHeight + 2 * clipPX,
    fill: WorkSpaceEditColor,
    stroke: WorkSpaceEditColor, 
    type: WorkSpaceDrawType,
    ...WorkSpaceCommonOption
  })

  // @ts-ignore
  const workSpaceClip = new Rect({
    left: left,
    top: top,
    width: workWidth,
    height: workHeight,
    fill: TransparentFill,
    stroke: WorkSpaceClipColor, // 边框颜色
    strokeWidth: 1, // 边框大小
    visible: showClip.value,
    type: WorkSpaceClipType,
    ...WorkSpaceCommonOption
  })

  // @ts-ignore
  const workSpaceSafe = new Rect({
    left: left + safePX,
    top: top + safePX,
    width: workWidth - 2 * safePX,
    height: workHeight - 2 * safePX,
    fill: TransparentFill,
    stroke: WorkSpaceSafeColor, // 边框颜色
    strokeWidth: 1, // 边框大小
    visible: showSafe.value,
    type: WorkSpaceSafeType,
    ...WorkSpaceCommonOption
  })

  const maskPath = `M0 0 L${Padding} 0 L${Padding} ${Padding} L0 ${Padding} L0 0 Z 
  M${PaddingHalf + left - clipPX} ${PaddingHalf + top - clipPX} 
  L${PaddingHalf + left - clipPX} ${PaddingHalf + top + workHeight + clipPX} 
  L${PaddingHalf + left + workWidth + clipPX} ${PaddingHalf + top + workHeight + clipPX} 
  L${PaddingHalf + left + workWidth + clipPX} ${PaddingHalf + top - clipPX} 
  L${PaddingHalf + left - clipPX} ${PaddingHalf + top - clipPX} Z`
  // @ts-ignore
  const workSpaceMask = new Path(maskPath, {
    left: -PaddingHalf,
    top: -PaddingHalf,
    fill: WorkSpaceMaskColor,
    opacity: opacity.value,
    type: WorkSpaceMaskType,
    ...WorkSpaceCommonOption
  })
  // [lineEnd, lineHeight, leftStart, top] 终止位置，线长，起始位置，top
  const diagonalHalfPX = diagonalPX / 2
  const diagonals = [
    // 左上水平
    [ PaddingHalf - diagonalHalfPX - clipPX, PaddingHalf + clipPX, PaddingHalf - diagonalHalfPX / 2 - clipPX, PaddingHalf + clipPX],
    // 左上垂直
    [ PaddingHalf, PaddingHalf - diagonalHalfPX, PaddingHalf, PaddingHalf - diagonalHalfPX / 2],

    // 左下水平
    [ PaddingHalf - diagonalHalfPX - clipPX, PaddingHalf + workHeight + clipPX, PaddingHalf - diagonalHalfPX / 2 - clipPX, PaddingHalf + workHeight + clipPX],
    // 左下垂直
    [ PaddingHalf, PaddingHalf + diagonalHalfPX + workHeight + 2 * clipPX, PaddingHalf, PaddingHalf + workHeight + diagonalHalfPX / 2 + 2 * clipPX],

    // 右上水平
    [ PaddingHalf + workWidth + diagonalHalfPX + clipPX, PaddingHalf + clipPX, PaddingHalf + workWidth + diagonalHalfPX / 2 + clipPX, PaddingHalf + clipPX],
    // 右上垂直
    [ PaddingHalf + workWidth, PaddingHalf - diagonalHalfPX, PaddingHalf + workWidth, PaddingHalf - diagonalHalfPX / 2],
    
    // 右下水平
    [ PaddingHalf + workWidth + diagonalHalfPX + clipPX, PaddingHalf + workHeight + clipPX, PaddingHalf + workWidth + diagonalHalfPX / 2  + clipPX, PaddingHalf + workHeight + clipPX],
    // 右下垂直
    [ PaddingHalf + workWidth, PaddingHalf + diagonalHalfPX + workHeight + 2 * clipPX, PaddingHalf + workWidth, PaddingHalf + workHeight + diagonalHalfPX / 2 + 2 * clipPX]
  ]
  const diagonalLines: Line[] = []
  diagonals.forEach(line => {
    // @ts-ignore
    const diagonalLine = new Line(line, {
      selectable: false,
      hoverCursor: 'default',
      evented: false,
      excludeFromExport: false,
      hasBorders: false,
      perPixelTargetFind: true,
      strokeWidth: 1,
      stroke: WorkSpaceClipColor
    })
    diagonalLines.push(diagonalLine)
  })
  
  const workLineGroup = new Group([...diagonalLines], {
    // @ts-ignore
    type: WorkSpaceLineType, 
    left: left - diagonalHalfPX - clipPX, 
    top: top - diagonalHalfPX - clipPX, 
    ...WorkSpaceCommonOption
  })
  canvas.add(workSpaceMask)
  canvas.add(workSpaceDraw)
  canvas.add(workSpaceClip)
  canvas.add(workSpaceSafe)
  canvas.add(workLineGroup)
  canvas.bringObjectToFront(workSpaceMask)
  canvas.bringObjectToFront(workLineGroup)
  canvas.renderAll()

  
  setCanvasTransform()
}

const initCanvas = () => {
  const fabricStore = useFabricStore()
  const { canvasRef } = storeToRefs(fabricStore)
  const fabricWidth = fabricStore.getWidth()
  const fabricHeight = fabricStore.getHeight()
  if (!canvasRef.value) return
  canvas = new Canvas(canvasRef.value, {
    width: fabricWidth,
    height: fabricHeight,
    backgroundColor: WorkSpaceEditColor,
  })
  new GuideLines(canvas)
  new HoverBorders(canvas)
  new WheelScroll(canvas)
  // new Ruler(canvas)
  canvas.preserveObjectStacking = true
  canvas.renderAll()
}

// 初始化模板
const initTemplate = async () => {
  if (!canvas) return
  const templatesStore = useTemplatesStore()
  const { currentTemplate } = storeToRefs(templatesStore)
  await canvas.loadFromJSON(currentTemplate.value)
  setCanvasTransform()
}

// 初始化背景
export const initBackground = async () => {
  const templatesStore = useTemplatesStore()
  const { getBackgroundImageOption } = useHandleBackground()
  if (!canvas) return
  const workSpaceDraw = canvas.getObjects(WorkSpaceDrawType)[0]
  // const left = workSpaceDraw.left, top = workSpaceDraw.top
  const { currentTemplate } = storeToRefs(templatesStore)
  const workSpaceElement = currentTemplate.value.workSpace
  // const workWidth = workSpaceDraw.width, workHeight = workSpaceDraw.height
  const { left, top, angle, scaleX, scaleY } = getBackgroundImageOption()
  workSpaceDraw.set({fill: TransparentFill})
  if (!workSpaceElement) return
  // 纯色 和 渐变
  if (workSpaceElement.fillType === 0 || workSpaceElement.fillType === 2) {
    workSpaceDraw.set('fill', workSpaceElement.fill)
  }
  // 图片
  else if (workSpaceElement.fillType === 1) {
    if (!workSpaceElement.imageURL) return
    if (workSpaceElement.imageSize === 'repeat') {
      workSpaceDraw.set('fill', workSpaceElement.fill)
    }
    else {
      // let scaleX = 1, scaleY = 1
      // @ts-ignore
      const imageElement = await Image.fromURL(workSpaceElement.imageURL)
      // if (workSpaceElement.imageSize === 'cover') {
      //   scaleX = workWidth / imageElement.width, scaleY = workHeight / imageElement.height
      // } 
      imageElement.set({left, top, angle, scaleX, scaleY})
      canvas.set('backgroundImage', imageElement)
      canvas.renderAll()
    }
  }
  // 网格
  else if (workSpaceElement.fillType === 3) {
    if (!workSpaceElement.gaidImageURL) return
    // @ts-ignore
    const imageElement = await Image.fromURL(workSpaceElement.gaidImageURL) 
    imageElement.set({left, top, angle, scaleX, scaleY})
    canvas.set('backgroundImage', imageElement)
    canvas.renderAll()
  }
  // 底纹
  else if (workSpaceElement.fillType === 4) {
    if (!workSpaceElement.shadingImageURL) return
    // @ts-ignore
    const imageElement = await Image.fromURL(workSpaceElement.shadingImageURL) 
    imageElement.set({left, top, angle, scaleX, scaleY})
    canvas.set('backgroundImage', imageElement)
    canvas.renderAll()
  }
}

const initEditor = () => {
  const fabricStore = useFabricStore()
  const { wrapperRef } = storeToRefs(fabricStore)
  initConf()
  initCanvas()
  // initWorks()
  initTemplate()
  const { width, height } = useElementBounding(wrapperRef.value)
  watch([width, height], () => {
    setCanvasTransform()
  })
}

export const toggleSelection = (selection?: boolean) => {
  if (!canvas) return
  // 这个禁止选中方法没有生效
  canvas.selection = selection !== undefined ? selection : !canvas.selection
  // 补充使用这个让其画布上的元素禁止选中
  FabricObject.prototype.selectable = canvas.selection
  // 补充这个方法，禁止选中所有元素
  canvas.getObjects().filter(obj => (obj as CanvasElement).name !== WorkSpaceName).map(item => item.set({selection}))
}

export default (): [Canvas, typeof initEditor] => [canvas as Canvas, initEditor]