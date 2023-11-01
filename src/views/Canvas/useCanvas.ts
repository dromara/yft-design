import { storeToRefs } from 'pinia'
import { Canvas, Object as FabricObject, Textbox, Group, Point } from 'fabric'
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
import useCommon from './useCommon'



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
  const objects = canvas.getObjects()
  const boundingBox = Group.prototype.getObjectsBoundingBox(objects)
  if (!boundingBox) return
  zoom.value = Math.min(canvas.getWidth() / boundingBox.width, canvas.getHeight() / boundingBox.height,) * scalePercentage.value / 100
  canvas.setZoom(zoom.value)
  canvas.absolutePan(new Point(boundingBox.centerX, boundingBox.centerY).scalarMultiply(zoom.value).subtract(canvas.getCenterPoint()))
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