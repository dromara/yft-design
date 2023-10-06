import { storeToRefs } from 'pinia'
import { Canvas, Object as FabricObject, CanvasOptions } from 'fabric'
import { useFabricStore } from '@/store/modules/fabric'
import { watch } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { GuideLines } from '@/app/guideLiles'
import { HoverBorders } from '@/app/hoverBorders'
import { WheelScroll } from '@/app/wheelScroll'
import { CheckRuler } from '@/app/checkRuler'
import { FabricCanvas } from '@/app/fabricCanvas'
import { createObjectDefaultControls } from '@/app/controls'
import { useTemplatesStore } from '@/store'
import { CanvasElement } from '@/types/canvas'
import { WorkSpaceDrawType, WorkSpaceCommonType } from '@/configs/canvas'
import useCommon from './useCommon'



let canvas: null | Canvas = null

// 初始化配置
const initConf = () => {
  FabricObject.prototype.objectCaching = false
  FabricObject.ownDefaults.borderColor = 'blue'
  FabricObject.ownDefaults.cornerColor = 'white'
  FabricObject.ownDefaults.cornerStrokeColor = '#c0c0c0'
  FabricObject.ownDefaults.borderOpacityWhenMoving = 1
  FabricObject.ownDefaults.borderScaleFactor = 1
  FabricObject.ownDefaults.cornerSize = 6
  FabricObject.ownDefaults.cornerStyle = 'rect'
  FabricObject.ownDefaults.centeredScaling = false
  FabricObject.ownDefaults.centeredRotation = true
  FabricObject.ownDefaults.transparentCorners = false
  FabricObject.ownDefaults.rotatingPointOffset = 5
  FabricObject.ownDefaults.lockUniScaling = true
  FabricObject.ownDefaults.hasRotatingPoint = true
  FabricObject.ownDefaults.controls = createObjectDefaultControls()
  // Object.prototype.controls.mt.visible = false
  // Object.prototype.controls.mb.visible = false
  // console.log('FabricObject.ownDefaults.controls :', FabricObject.ownDefaults )
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
  if (!canvas) return
  const fabricStore = useFabricStore()
  const templatesStore = useTemplatesStore()
  const { scalePercentage, zoom, clip } = storeToRefs(fabricStore)
  const { currentTemplate } = storeToRefs(templatesStore)
  const scalePercentageVal = scalePercentage.value / 100
  let zoomVal = 1
  const workWidth = currentTemplate.value.width / currentTemplate.value.zoom
  const workHeight = currentTemplate.value.height / currentTemplate.value.zoom
  if (width < workWidth / scalePercentageVal || height < workHeight / scalePercentageVal) {
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

// 更新视图区长宽
const setCanvasTransform = () => {
  
  if (!canvas) return
  
  const fabricStore = useFabricStore()
  const { zoom, wrapperRef } = storeToRefs(fabricStore)
  const { width, height } = useElementBounding(wrapperRef.value)
  initWorkSpace(width.value, height.value)
  const WorkSpaceDraw = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0]
  if (!WorkSpaceDraw) return
  const workSpaceBound = WorkSpaceDraw.getBoundingRect()
  const left = WorkSpaceDraw.left, top = WorkSpaceDraw.top
  const canvasTransform = canvas.viewportTransform
  zoom.value = canvas.getZoom()
  canvasTransform[4] = (width.value - workSpaceBound.width) / 2 - left * zoom.value
  canvasTransform[5] = (height.value - workSpaceBound.height) / 2 - top * zoom.value
  canvas.setViewportTransform(canvasTransform)
  canvas.setDimensions({width: width.value, height: height.value})
  canvas.renderAll()
}

const initCanvas = () => {
  const fabricStore = useFabricStore()
  const { canvasRef } = storeToRefs(fabricStore)
  const fabricWidth = fabricStore.getWidth()
  const fabricHeight = fabricStore.getHeight()
  if (!canvasRef.value) return
  canvas = new FabricCanvas(canvasRef.value, {
    width: fabricWidth,
    height: fabricHeight
  } as CanvasOptions)
  new GuideLines(canvas)
  new HoverBorders(canvas)
  new WheelScroll(canvas)
  new CheckRuler(canvas)
  canvas.preserveObjectStacking = true
  canvas.renderAll()
}

// 初始化模板
const initTemplate = async () => {
  if (!canvas) return
  const templatesStore = useTemplatesStore()
  const { initCommon } = useCommon()
  const { currentTemplate } = storeToRefs(templatesStore)
  await canvas.loadFromJSON(currentTemplate.value)
  setCanvasTransform()
  initCommon()
}

const initEditor = async () => {
  const fabricStore = useFabricStore()
  const { wrapperRef } = storeToRefs(fabricStore)
  initConf()
  initCanvas()
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
  canvas.getObjects().filter(obj => !WorkSpaceCommonType.includes((obj as CanvasElement).id)).map(item => item.set({selection}))
}

export default (): [FabricCanvas, typeof initEditor] => [canvas as FabricCanvas, initEditor]