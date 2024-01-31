import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Canvas, Object as FabricObject, Textbox, Group, Point } from 'fabric'
import { WorkSpaceThumbType, WorkSpaceDrawType } from "@/configs/canvas"
import { useFabricStore } from '@/store/modules/fabric'
import { useElementBounding } from '@vueuse/core'
import { FabricTool } from '@/app/fabricTool'
import { FabricGuide } from '@/app/fabricGuide'
import { HoverBorders } from '@/app/hoverBorders'
import { WheelScroll } from '@/app/wheelScroll'
import { FabricRuler } from '@/app/fabricRuler'

import { FabricCanvas } from '@/app/fabricCanvas'
import { Keybinding } from '@/app/keybinding'
import { defaultControls, textboxControls } from '@/app/fabricControls'
import { useTemplatesStore } from '@/store'
import useCommon from './useCommon'
import useHammer from './useHammer'



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

  Object.assign(Textbox.ownDefaults, { controls: textboxControls() } )

  const mixin = {
    getWidthHeight(noFixed = false): Point {
      // @ts-ignore
      const objScale = this.getObjectScaling()
      // @ts-ignore
      const point = this._getTransformedDimensions({
        scaleX: objScale.x,
        scaleY: objScale.y,
      })
      if (!noFixed) {
        point.setX(point.x)
        point.setY(point.y)
      }
      return point
    },
    getHeight() {
      return this.getWidthHeight().y
    },
    getWidth() {
      return this.getWidthHeight().x
    },
  }

  Object.assign(FabricObject.prototype, mixin)
}

// 更新视图区长宽
const setCanvasTransform = () => {
  if (!canvas) return
  const fabricStore = useFabricStore()
  const { zoom, wrapperRef, scalePercentage } = storeToRefs(fabricStore)
  const { width, height } = useElementBounding(wrapperRef.value)
  canvas.setDimensions({width: width.value, height: height.value})
  const objects = canvas.getObjects().filter(ele => !WorkSpaceThumbType.includes(ele.id))
  const boundingBox = Group.prototype.getObjectsBoundingBox(objects)
  if (!boundingBox) return
  let boxWidth = boundingBox.width, boxHeight = boundingBox.height
  let centerX = boundingBox.centerX, centerY = boundingBox.centerY
  const workSpaceDraw = canvas.getObjects().filter(item => item.id === WorkSpaceDrawType)[0]
  if (workSpaceDraw) {
    boxWidth = workSpaceDraw.width
    boxHeight = workSpaceDraw.height
    centerX = workSpaceDraw.left + workSpaceDraw.width / 2
    centerY = workSpaceDraw.top + workSpaceDraw.height / 2 
  }
  zoom.value = Math.min(canvas.getWidth() / boxWidth, canvas.getHeight() / boxHeight) * scalePercentage.value / 100
  canvas.setZoom(zoom.value)
  canvas.absolutePan(new Point(centerX, centerY).scalarMultiply(zoom.value).subtract(canvas.getCenterPoint()))
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
  })
  // const keybinding = new Keybinding()
  new FabricTool(canvas)
  new FabricGuide(canvas)
  new HoverBorders(canvas)
  new WheelScroll(canvas)
  new FabricRuler(canvas)
  canvas.preserveObjectStacking = true
  canvas.renderAll()
}

// 初始化模板
const initTemplate = async () => {
  if (!canvas) return
  const templatesStore = useTemplatesStore()
  const { initCommon } = useCommon()
  const { initHammer } = useHammer()
  const { currentTemplate } = storeToRefs(templatesStore)
  await canvas.loadFromJSON(currentTemplate.value)
  setCanvasTransform()
  initCommon()
  initHammer()
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