import { storeToRefs } from 'pinia'
import { Canvas, Object as FabricObject, CanvasOptions, Textbox } from 'fabric'
import { useFabricStore } from '@/store/modules/fabric'
import { watch } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { PressKey } from '@/app/pressKey'
import { GuideLines } from '@/app/guideLiles'
import { HoverBorders } from '@/app/hoverBorders'
import { WheelScroll } from '@/app/wheelScroll'
import { CheckRuler } from '@/app/checkRuler'

import { FabricCanvas } from '@/app/fabricCanvas'
import { Keybinding } from '@/app/keybinding'
import { defaultControls, textboxControls } from '@/app/fabricControls'
import { useTemplatesStore } from '@/store'
import { CanvasElement } from '@/types/canvas'
import { WorkSpaceDrawType, WorkSpaceCommonType } from '@/configs/canvas'
import useCommon from './useCommon'
import useCanvasScale from '@/hooks/useCanvasScale'



let canvas: null | Canvas = null

// 初始化配置
const initConf = () => {
  FabricObject.ownDefaults.objectCaching = false
  FabricObject.ownDefaults.borderColor = 'blue'
  FabricObject.ownDefaults.cornerColor = 'white'
  FabricObject.ownDefaults.cornerStrokeColor = '#c0c0c0'
  FabricObject.ownDefaults.borderOpacityWhenMoving = 1
  FabricObject.ownDefaults.borderScaleFactor = 1
  FabricObject.ownDefaults.cornerSize = 8
  FabricObject.ownDefaults.cornerStyle = 'rect'
  FabricObject.ownDefaults.centeredScaling = false
  FabricObject.ownDefaults.centeredRotation = true
  FabricObject.ownDefaults.transparentCorners = false
  FabricObject.ownDefaults.rotatingPointOffset = 1
  FabricObject.ownDefaults.lockUniScaling = true
  FabricObject.ownDefaults.hasRotatingPoint = false
  FabricObject.ownDefaults.controls = defaultControls()

  Object.assign(Textbox.ownDefaults, {
    controls: textboxControls()
  })
}

// 更新视图区长宽
const setCanvasTransform = () => {
  
  if (!canvas) return
  const { setWorkSpace } = useCanvasScale()
  const fabricStore = useFabricStore()
  const { zoom, wrapperRef } = storeToRefs(fabricStore)
  const { width, height } = useElementBounding(wrapperRef.value)
  setWorkSpace(width.value, height.value)
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
  // const keybinding = new Keybinding()
  new PressKey(canvas)
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

export const initEditor = async () => {
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

export default (): [FabricCanvas] => [canvas as FabricCanvas]