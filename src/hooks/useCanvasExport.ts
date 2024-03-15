
import { ref } from 'vue'
import { saveAs } from 'file-saver'
import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from '@/store'
import { WorkSpaceThumbType, WorkSpaceClipType, WorkSpaceCommonType, WorkSpaceSafeType, propertiesToInclude } from '@/configs/canvas'
import { ImageFormat } from 'fabric'
import { downloadSVGFile, downloadLinkFile } from '@/utils/download'
import { changeDpiDataUrl } from 'changedpi'
import useCanvas from '@/views/Canvas/useCanvas'
import useCenter from '@/views/Canvas/useCenter'
import { exportFile } from '@/api/file'
import { Base64 } from 'js-base64'
import { ElementNames } from '@/types/elements'

export default () => {
  
  const Exporting = ref(false)
  const { showClip, showSafe } = storeToRefs(useFabricStore())
  const { currentTemplate } = storeToRefs(useTemplatesStore())
  // 导出图片
  const exportImage = (format: ImageFormat, quality: number, dpi: number, ignoreClip = true) => {
    Exporting.value = true
    const [ canvas ] = useCanvas()
    const { left, top, width, height } = useCenter()
    const zoom = canvas.getZoom()
    const viewportTransform = canvas.viewportTransform
    const activeObject = canvas.getActiveObject()
    let ignoreObjects = canvas.getObjects().filter(obj => WorkSpaceCommonType.includes(obj.id))
    if (format === 'jpeg') {
      ignoreObjects = canvas.getObjects().filter(obj => WorkSpaceThumbType.includes(obj.id))
    }
    if (ignoreClip) {
      ignoreObjects.map(item => item.set({visible: false}))
      canvas.renderAll()
    }
    if (activeObject) canvas.discardActiveObject()
    canvas.getObjects().filter(item => item.type === ElementNames.REFERENCELINE && item.visible === true).map(item => item.set({visible: false}))
    canvas.set({background: 'rgba(255,255,255,0)'})
    canvas.renderAll()
    let result = canvas.toDataURL({
      multiplier: 1 / zoom,
      quality: quality,
      format: format,
      width: width * zoom,
      height: height * zoom,
      left: left * zoom + viewportTransform[4],
      top: top * zoom + viewportTransform[5]
    })
    result = changeDpiDataUrl(result, dpi)
    saveAs(result, `yft-design-${Date.now()}.${format}`)
    Exporting.value = false
    ignoreObjects.map(item => item.set({visible: true}))
    canvas.getObjects().filter(obj => obj.id === WorkSpaceClipType).map(item => item.set({visible: showClip.value}))
    canvas.getObjects().filter(obj => obj.id === WorkSpaceSafeType).map(item => item.set({visible: showSafe.value}))
    if (activeObject) canvas.setActiveObject(activeObject)
    canvas.getObjects().filter(item => item.type === ElementNames.REFERENCELINE && item.visible === false).map(item => item.set({visible: true}))
    canvas.renderAll()
  }

  const getSVGData = () => {
    const [ canvas ] = useCanvas()
    const { left, top, width, height } = useCenter()
    canvas.getObjects().filter(item => item.type === ElementNames.REFERENCELINE && item.visible === true).map(item => item.set({visible: false}))
    canvas.renderAll()
    const data = canvas.toSVG({
      viewBox: {
        x: left,
        y: top,
        width: width,
        height: height,
      },
      width: width + 'px',
      height: height + 'px'
    }, (element) => element)
    canvas.getObjects().filter(item => item.type === ElementNames.REFERENCELINE && item.visible === false).map(item => item.set({visible: true}))
    canvas.renderAll()
    return data
  }

  const getJSONData = () => {
    const [ canvas ] = useCanvas()
    const serializer = canvas.toObject(propertiesToInclude)
    serializer.workSpace = currentTemplate.value.workSpace
    serializer.zoom = currentTemplate.value.zoom
    serializer.width = currentTemplate.value.width
    serializer.height = currentTemplate.value.height
    return serializer
  }

  const exportSVG = () => {
    const [ canvas ] = useCanvas()
    const ignoreObjects = canvas.getObjects().filter(obj => WorkSpaceThumbType.includes(obj.id))
    ignoreObjects.map(item => item.set({visible: false}))
    canvas.renderAll()
    const data = getSVGData()
    downloadSVGFile(data, `yft-design-${Date.now()}.svg`)
    ignoreObjects.map(item => item.set({visible: true}))
    canvas.getObjects().filter(obj => obj.id === WorkSpaceClipType).map(item => item.set({visible: showClip.value}))
    canvas.getObjects().filter(obj => obj.id === WorkSpaceSafeType).map(item => item.set({visible: showSafe.value}))
    canvas.renderAll()
  }

  // 导出PDF
  const exportPDF = async () => {
    convertFile('pdf')
  }

  // 导出PSD
  const exportPSD = async () => {
    convertFile('psd')
  }

  const convertFile = async (filetype: string) => {
    const content = {
      data: Base64.encode(getSVGData()),
      filetype,
      width: currentTemplate.value.width / currentTemplate.value.zoom,
      height: currentTemplate.value.height / currentTemplate.value.zoom,
    }
    const result = await exportFile(content)
    if (result && result.data.link) {
      downloadLinkFile(result.data.link, `yft-design-${Date.now()}.${filetype}`)
    }
  }

  // 导出json
  const exportJSON = () => {
    const serializer = getJSONData()
    const blob = new Blob([JSON.stringify(serializer)])
    saveAs(blob, `yft-design-${Date.now()}.json`)
  }

  return {
    exportImage,
    exportPDF,
    exportPSD,
    exportJSON,
    exportSVG,
    getJSONData,
    getSVGData,
    Exporting
  }
}