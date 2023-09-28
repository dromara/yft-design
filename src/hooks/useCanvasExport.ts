import useCanvas from '@/views/Canvas/useCanvas'
import { ref } from 'vue'
import { saveAs } from 'file-saver'
import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from '@/store'
import { WorkSpaceClipColor, WorkSpaceClipType, WorkSpaceSafeColor, WorkSpaceSafeType, propertiesToInclude } from '@/configs/canvas'
import { changeDataURLDPI } from '@/utils/changdpi'
import { TransparentFill } from '@/configs/background'
import jsPDF from 'jspdf'
import { mm2px } from '@/utils/image'
import { downloadSVGFile } from '@/utils/download'
import useCenter from '@/views/Canvas/useCenter'

export default () => {
  
  const Exporting = ref(false)
  const { templates } = storeToRefs(useTemplatesStore())

  // 导出图片
  const exportImage = (format: string, quality: number, dpi: number, ignoreClip = true) => {
    Exporting.value = true
    const [ canvas ] = useCanvas()
    const { workSpaceDraw } = useCenter()
    const zoom = canvas.getZoom()
    const width = workSpaceDraw.width, height = workSpaceDraw.height
    const left = workSpaceDraw.left, top = workSpaceDraw.top
    const viewportTransform = canvas.viewportTransform
    const activeObject = canvas.getActiveObject()
    if (ignoreClip) {
      canvas.getObjects().filter(obj => obj.type === WorkSpaceClipType).map(item => {item.stroke = TransparentFill})
      canvas.getObjects().filter(obj => obj.type === WorkSpaceSafeType).map(item => {item.stroke = TransparentFill})
      canvas.renderAll()
    }
    if (activeObject) canvas.discardActiveObject()
    const result = canvas.toDataURL({
      multiplier: 1 / zoom,
      quality: quality,
      // @ts-ignore
      format: format,
      width: width * zoom,
      height: height * zoom,
      left: left * zoom + viewportTransform[4],
      top: top * zoom + viewportTransform[5]
    })
    const data = changeDataURLDPI(result, dpi)
    saveAs(data, `yft-design-${Date.now()}.${format}`)
    Exporting.value = false
    canvas.getObjects().filter(obj => obj.type === WorkSpaceClipType).map(item => {item.stroke = WorkSpaceClipColor})
    canvas.getObjects().filter(obj => obj.type === WorkSpaceSafeType).map(item => {item.stroke = WorkSpaceSafeColor})
    if (activeObject) canvas.setActiveObject(activeObject)
    canvas.renderAll()
  }

  const exportSVG = () => {
    const [ canvas ] = useCanvas()
    const { originPoint } = useCenter()
    const { workSpaceDraw } = useCenter()
    const width = workSpaceDraw.width, height = workSpaceDraw.height
    canvas.getObjects().filter(obj => obj.type === WorkSpaceClipType).map(item => {item.stroke = TransparentFill})
    canvas.getObjects().filter(obj => obj.type === WorkSpaceSafeType).map(item => {item.stroke = TransparentFill})
    canvas.renderAll()
    const data = canvas.toSVG({
      viewBox: {
        x: originPoint.x,
        y: originPoint.y,
        width: width,
        height: height,
      },
      width: width + 'px',
      height: height + 'px'
    }, () => '')
    downloadSVGFile(data, `yft-design-${Date.now()}.svg`)
    canvas.getObjects().filter(obj => obj.type === WorkSpaceClipType).map(item => {item.stroke = WorkSpaceClipColor})
    canvas.getObjects().filter(obj => obj.type === WorkSpaceSafeType).map(item => {item.stroke = WorkSpaceSafeColor})
    canvas.renderAll()
  }

  // 导出PDF
  const exportPDF = async () => {
    const [ canvas ] = useCanvas()
    const { clip } = storeToRefs(useFabricStore())
    const zoom = canvas.getZoom()
    const { workSpaceDraw } = useCenter()
    const width = workSpaceDraw.width ? workSpaceDraw.width * zoom : 0
    const height = workSpaceDraw.height ? workSpaceDraw.height * zoom : 0
    const left = workSpaceDraw.left ? workSpaceDraw.left : 0
    const top = workSpaceDraw.top ? workSpaceDraw.top : 0
    const viewportTransform = canvas.viewportTransform
    if (!viewportTransform) return
    
    
    const result = canvas.toDataURL({
      multiplier: 1 / zoom,
      quality: 1,
      // format: 'jpeg', 
      width: width + 2 * mm2px(clip.value),
      height: height + 2 * mm2px(clip.value),
      left: left * zoom + viewportTransform[4],
      top: top * zoom + viewportTransform[5]
    })
    const doc = new jsPDF({orientation: 'l', unit: 'px', format: [width, height]})
    doc.addImage(result, 'JPEG', 0, 0, width, height)
    doc.save(`yft-design-${Date.now()}.${'pdf'}`)
  }

  // 导出json
  const exportJSON = () => {
    const [ canvas ] = useCanvas()
    const blob = new Blob([JSON.stringify(canvas.toObject(propertiesToInclude))])
    saveAs(blob, `yft-design-${Date.now()}.json`)
  }

  return {
    exportImage,
    exportPDF,
    exportJSON,
    exportSVG,
    Exporting
  }
}