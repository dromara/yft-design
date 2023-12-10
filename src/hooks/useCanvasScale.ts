import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from '@/store'
import { useElementBounding } from '@vueuse/core'
import { Group, Point } from 'fabric'
import useCanvas from '@/views/Canvas/useCanvas'
import useCenter from '@/views/Canvas/useCenter'
import { WorkSpaceThumbType } from '@/configs/canvas'

export default () => {
  const fabricStore = useFabricStore()
  const { zoom, wrapperRef, scalePercentage } = storeToRefs(fabricStore)
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

  const setWorkSpace = (width: number, height: number) => {
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
    const [ canvas ] = useCanvas()
    if (!canvas) return
    const { zoom } = storeToRefs(fabricStore)
    const objects = canvas.getObjects().filter(ele => !WorkSpaceThumbType.includes(ele.id))
    const boundingBox = Group.prototype.getObjectsBoundingBox(objects)
    const { width, height, centerPoint } = useCenter()
    if (!boundingBox) return
    zoom.value = Math.min(canvas.getWidth() / width, canvas.getHeight() / height) * scalePercentage.value / 100
    canvas.setZoom(zoom.value)
    canvas.absolutePan(new Point(centerPoint.x, centerPoint.y).scalarMultiply(zoom.value).subtract(canvas.getCenterPoint()))
  }

  /**
   * 重置画布尺寸和位置
   */
  const resetCanvas = () => {
    setCanvasTransform()
  }

  const setCanvasSize = () => {
    const [ canvas ] = useCanvas()
    const { width, height } = useElementBounding(wrapperRef.value)
    canvas.setDimensions({width: width.value, height: height.value})
  }

  return {
    canvasScalePercentage,
    setCanvasScalePercentage,
    setCanvasTransform,
    setWorkSpace,
    scaleCanvas,
    resetCanvas,
    setCanvasSize
  }
}