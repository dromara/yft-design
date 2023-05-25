import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from '@/store'
import useCanvas from '@/views/Canvas/useCanvas'
import useCenter from '@/views/Canvas/useCenter'

export default () => {
  const fabricStore = useFabricStore()
  const templatesStore = useTemplatesStore()
  const { zoom } = storeToRefs(fabricStore)
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

  /**
   * 重置画布尺寸和位置
   */
  const resetCanvas = () => {
    templatesStore.renderTemplate()
  }

  return {
    canvasScalePercentage,
    setCanvasScalePercentage,
    scaleCanvas,
    resetCanvas,
  }
}