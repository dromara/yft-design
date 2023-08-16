import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from '@/store'
import { useElementBounding } from '@vueuse/core'
import { 
  WorkSpaceClipType, 
  WorkSpaceDrawType,
} from '@/configs/canvas'
import { CanvasElement } from '@/types/canvas'
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
    const WorkSpaceClip = canvas.getObjects().filter(item => (item as CanvasElement).id === WorkSpaceClipType)[0]
    if (!WorkSpaceDraw || !WorkSpaceClip) return
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
    scaleCanvas,
    resetCanvas,
  }
}