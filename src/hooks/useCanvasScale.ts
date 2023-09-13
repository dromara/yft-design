import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from '@/store'
import { useElementBounding } from '@vueuse/core'
import { Canvas, Rect, Object, Control, Textbox, controlsUtils, Path, Line, Group, Image } from 'fabric'
import { DefaultDPI, DefaultRatio } from '@/configs/size'
import { CanvasElement } from '@/types/canvas'
import { 
  WorkSpaceClipType, 
  WorkSpaceDrawType,
  WorkSpaceMaskType, 
  WorkSpaceSafeType, 
  WorkSpaceName, 
  WorkSpaceEditColor, 
  WorkSpaceCommonOption,
  WorkSpaceClipColor, 
  WorkSpaceSafeColor, 
  WorkSpaceLineType, 
  WorkSpaceMaskColor,
  toObjectFilter
} from '@/configs/canvas'
import useCanvas from '@/views/Canvas/useCanvas'
import useCenter from '@/views/Canvas/useCenter'

export default () => {
  const fabricStore = useFabricStore()
  const templatesStore = useTemplatesStore()
  const { zoom, wrapperRef } = storeToRefs(fabricStore)
  const canvasScalePercentage = computed(() => Math.round(zoom.value * 100) + '%')

  /**
   * 缩放画布百分比
   * @param command 缩放命令：放大、缩小
   */
  const scaleCanvas = (command: '+' | '-') => {
    const [ canvas ] = useCanvas()
    let percentage = Math.round(zoom.value * 100)
    const step = 5
    const max = 500
    const min = 10
    if (command === '+' && percentage <= max) percentage += step
    if (command === '-' && percentage >= min) percentage -= step
    const { centerPoint } = useCenter()
    canvas.zoomToPoint(centerPoint, percentage / 100)
    zoom.value = canvas.getZoom()
  }

  /**
   * 设置画布缩放比例
   * 但不是直接设置该值，而是通过设置画布可视区域百分比来动态计算
   * @param value 目标画布缩放比例
   */
  const setCanvasScalePercentage = (value: number) => {
    const [ canvas ] = useCanvas()
    const { centerPoint } = useCenter()
    canvas.zoomToPoint(centerPoint, value / 100)
    zoom.value = canvas.getZoom()
  }

  // 更新视图区长宽
  const setCanvasTransform = (width: number, height: number) => {
    const [ canvas ] = useCanvas()
    if (!canvas) return
    const fabricStore = useFabricStore()
    const templatesStore = useTemplatesStore()
    const { scalePercentage, zoom, clip } = storeToRefs(fabricStore)
    const { currentTemplate } = storeToRefs(templatesStore)
    const scalePercentageVal = scalePercentage.value / 100
    let zoomVal = 1
    const workWidth = currentTemplate.value.width / currentTemplate.value.zoom
    const workHeight = currentTemplate.value.height / currentTemplate.value.zoom
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
    const WorkSpaceDraw = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0]
    // const WorkSpaceClip = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceClipType)[0]
    if (!WorkSpaceDraw) return
    const workSpaceBound = WorkSpaceDraw.getBoundingRect()
    const left = WorkSpaceDraw.left
    const top = WorkSpaceDraw.top
    const canvasTransform = canvas.viewportTransform
    if (!canvasTransform || !left || !top) return
    zoom.value = canvas.getZoom()
    canvasTransform[4] = (width - workSpaceBound.width) / 2 - left * canvas.getZoom()
    canvasTransform[5] = (height - workSpaceBound.height) / 2 - top * canvas.getZoom()
    canvas.setViewportTransform(canvasTransform)
    canvas.renderAll()
  }

  const setCanvasWorkSpace = () => {
    const [ canvas ] = useCanvas()
    if (!canvas) return
    const fabricStore = useFabricStore()
    const { zoom, clip, safe, diagonal, opacity, showClip, showSafe, wrapperRef } = storeToRefs(fabricStore)
    const { width, height } = useElementBounding(wrapperRef.value)
    const { currentTemplate } = storeToRefs(templatesStore)
    const workWidth = currentTemplate.value.width / currentTemplate.value.zoom
    const workHeight = currentTemplate.value.height / currentTemplate.value.zoom
    const left = (width.value - workWidth) / 2 * zoom.value
    const top = (height.value - workHeight ) / 2 * zoom.value
    const Padding = 50000, PaddingHalf = Padding / 2
    const clipPX = clip.value * DefaultDPI / DefaultRatio
    const diagonalPX = diagonal.value * DefaultDPI / DefaultRatio
    const safePX = 2 * safe.value * DefaultDPI / DefaultRatio
    const workSpaceDraw = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceDrawType)[0]
    const workSpaceClip = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceClipType)[0]
    const workSpaceSafe = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceSafeType)[0]
    // const workSpaceMask = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceMaskType)[0]
    canvas.remove(...canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceLineType))
    canvas.remove(...canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceMaskType))
    workSpaceDraw.set({ 
      left: left - clipPX,
      top: top - clipPX,
      width: workWidth + 2 * clipPX,
      height: workHeight + 2 * clipPX,
    })
    
    workSpaceClip.set({
      left: left,
      top: top,
      width: workWidth,
      height: workHeight,
    })
    workSpaceSafe.set({
      left: left + safePX,
      top: top + safePX,
      width: workWidth - 2 * safePX,
      height: workHeight - 2 * safePX,
    })
    const maskPath = `M0 0 L${Padding} 0 L${Padding} ${Padding} L0 ${Padding} L0 0 Z 
                      M${PaddingHalf + left - clipPX} ${PaddingHalf + top - clipPX} 
                      L${PaddingHalf + left - clipPX} ${PaddingHalf + top + workHeight + clipPX} 
                      L${PaddingHalf + left + workWidth + clipPX} ${PaddingHalf + top + workHeight + clipPX} 
                      L${PaddingHalf + left + workWidth + clipPX} ${PaddingHalf + top - clipPX} 
                      L${PaddingHalf + left - clipPX} ${PaddingHalf + top - clipPX} Z`
    const workSpaceMask = new Path(maskPath, {
      left: -PaddingHalf,
      top: -PaddingHalf,
      fill: WorkSpaceMaskColor,
      opacity: opacity.value,
      id: WorkSpaceMaskType,
      ...WorkSpaceCommonOption
    })

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
    
    const workSpaceLine = new Group([...diagonalLines], {
      id: WorkSpaceLineType, 
      left: left - diagonalHalfPX - clipPX, 
      top: top - diagonalHalfPX - clipPX, 
      ...WorkSpaceCommonOption
    })
    canvas.add(workSpaceLine)
    canvas.add(workSpaceMask)
    canvas.renderAll()
    templatesStore.updateCommonElement({ id: WorkSpaceDrawType, props: workSpaceDraw.toObject(toObjectFilter as any[]) })
    templatesStore.updateCommonElement({ id: WorkSpaceClipType, props: workSpaceClip.toObject(toObjectFilter as any[]) })
    templatesStore.updateCommonElement({ id: WorkSpaceSafeType, props: workSpaceSafe.toObject(toObjectFilter as any[]) })
    templatesStore.updateCommonElement({ id: WorkSpaceMaskType, props: workSpaceMask.toObject(toObjectFilter as any[]) })
    templatesStore.updateCommonElement({ id: WorkSpaceLineType, props: workSpaceLine.toObject(toObjectFilter as any[]) })
  }

  const setCanvasSize = () => {
    const [ canvas ] = useCanvas()
    const { width, height } = useElementBounding(wrapperRef.value)
    canvas.setDimensions({width: width.value, height: height.value})
  } 

  /**
   * 重置画布尺寸和位置
   */
  const resetCanvas = () => {
    const { width, height } = useElementBounding(wrapperRef.value)
    setCanvasTransform(width.value, height.value)
  }

  return {
    canvasScalePercentage,
    setCanvasScalePercentage,
    setCanvasTransform,
    setCanvasWorkSpace,
    setCanvasSize,
    scaleCanvas,
    resetCanvas,
  }
}