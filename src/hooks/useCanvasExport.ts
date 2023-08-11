import useCanvas from '@/views/Canvas/useCanvas'
import { ref } from 'vue'
import { saveAs } from 'file-saver'
import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from '@/store'
import { ImageFormat } from '@/types/canvas'
import { WorkSpaceClipColor, WorkSpaceClipType, WorkSpaceDrawType, WorkSpaceName, WorkSpaceSafeColor, WorkSpaceSafeType } from '@/configs/canvas'
import { DefaultDPI, DefaultRatio } from '@/configs/size'
import { changeDataURLDPI } from '@/utils/changdpi'
import { TransparentFill } from '@/configs/background'
// import { fabric } from 'fabric'
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
    const workSpace = canvas.getObjects(WorkSpaceDrawType)[0]
    const zoom = canvas.getZoom()
    const width = workSpace.width, height = workSpace.height
    const left = workSpace.left, top = workSpace.top
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
    saveAs(data, `vue-fabric-design_${Date.now()}.${format}`)
    Exporting.value = false
    canvas.getObjects().filter(obj => obj.type === WorkSpaceClipType).map(item => {item.stroke = WorkSpaceClipColor})
    canvas.getObjects().filter(obj => obj.type === WorkSpaceSafeType).map(item => {item.stroke = WorkSpaceSafeColor})
    if (activeObject) canvas.setActiveObject(activeObject)
    canvas.renderAll()
  }

  const exportSVG = () => {
    const [ canvas ] = useCanvas()
    const { originPoint } = useCenter()
    const workSpace = canvas.getObjects(WorkSpaceDrawType)[0]
    const width = workSpace.width, height = workSpace.height
    workSpace.set({excludeFromExport: false})
    canvas.getObjects().filter(obj => obj.type === WorkSpaceClipType).map(item => {item.stroke = TransparentFill})
    canvas.getObjects().filter(obj => obj.type === WorkSpaceSafeType).map(item => {item.stroke = TransparentFill})
    canvas.renderAll()
    // @ts-ignore
    const data = canvas.toSVG({
      viewBox: {
        x: originPoint.x,
        y: originPoint.y,
        width: width,
        height: height,
      },
      width: width + 'px',
      height: height + 'px'
    })
    downloadSVGFile(data, `vue-fabric-design_${Date.now()}.svg`)
    workSpace.set({excludeFromExport: true})
    canvas.getObjects().filter(obj => obj.type === WorkSpaceClipType).map(item => {item.stroke = WorkSpaceClipColor})
    canvas.getObjects().filter(obj => obj.type === WorkSpaceSafeType).map(item => {item.stroke = WorkSpaceSafeColor})
    canvas.renderAll()
    if (import.meta.env.MODE === 'development') {
      exportJSON()
    }
  }

  // 导出PDF
  const exportPDF = async () => {
    const [ canvas ] = useCanvas()
    const { clip } = storeToRefs(useFabricStore())
    const zoom = canvas.getZoom()
    const workSpace = canvas.getObjects(WorkSpaceDrawType)[0]
    const width = workSpace.width ? workSpace.width * zoom : 0
    const height = workSpace.height ? workSpace.height * zoom : 0
    const left = workSpace.left ? workSpace.left : 0
    const top = workSpace.top ? workSpace.top : 0
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
    doc.save(`vue-fabric-design_${Date.now()}.${'pdf'}`)
  }

  // 导出json
  const exportJSON = () => {
    const [ canvas ] = useCanvas()
    console.log('canvas.toObject():', canvas.toObject())
    const objects = canvas.getObjects()
    
    console.log('canvas.toObject():', canvas.toObject())
    const blob = new Blob([JSON.stringify(canvas.toObject())], { type: '' })
    saveAs(blob, 'vue-fabric-design_draw.json')
  }

  return {
    exportImage,
    exportPDF,
    exportJSON,
    exportSVG,
    Exporting
  }
}