
import { ref } from 'vue'
import { saveAs } from 'file-saver'
import { storeToRefs } from 'pinia'
import { useFabricStore } from '@/store'
import { WorkSpaceThumbType, WorkSpaceClipType, WorkSpaceCommonType, WorkSpaceSafeType, propertiesToInclude } from '@/configs/canvas'
import { ImageFormat } from 'fabric'
import { downloadSVGFile } from '@/utils/download'
import useCanvas from '@/views/Canvas/useCanvas'
import useCenter from '@/views/Canvas/useCenter'
import PDFWorker from "@/worker/mupdf.js?worker"
const worker = new PDFWorker()

export default () => {
  
  const Exporting = ref(false)
  const { showClip, showSafe } = storeToRefs(useFabricStore())
  // 导出图片
  const exportImage = (format: ImageFormat, quality: number, dpi: number, ignoreClip = true) => {
    Exporting.value = true
    const [ canvas ] = useCanvas()
    const { workSpaceDraw } = useCenter()
    const zoom = canvas.getZoom()
    const width = workSpaceDraw.width, height = workSpaceDraw.height
    const left = workSpaceDraw.left, top = workSpaceDraw.top
    const viewportTransform = canvas.viewportTransform
    const activeObject = canvas.getActiveObject()
    const ignoreObjects = canvas.getObjects().filter(obj => WorkSpaceCommonType.includes(obj.id))
    if (ignoreClip) {
      ignoreObjects.map(item => item.set({visible: false}))
      canvas.renderAll()
    }
    if (activeObject) canvas.discardActiveObject()
    canvas.set({background: 'rgba(255,255,255,0)'})
    canvas.renderAll()
    const result = canvas.toDataURL({
      multiplier: 1 / zoom,
      quality: quality,
      format: format,
      width: width * zoom,
      height: height * zoom,
      left: left * zoom + viewportTransform[4],
      top: top * zoom + viewportTransform[5]
    })
    // const data = changeDataURLDPI(result, dpi)
    saveAs(result, `yft-design-${Date.now()}.${format}`)
    Exporting.value = false
    ignoreObjects.map(item => item.set({visible: true}))
    canvas.getObjects().filter(obj => obj.id === WorkSpaceClipType).map(item => item.set({visible: showClip.value}))
    canvas.getObjects().filter(obj => obj.id === WorkSpaceSafeType).map(item => item.set({visible: showSafe.value}))
    if (activeObject) canvas.setActiveObject(activeObject)
    canvas.renderAll()
  }

  const getSVGData = () => {
    const [ canvas ] = useCanvas()
    const { originPoint } = useCenter()
    const { workSpaceDraw } = useCenter()
    const width = workSpaceDraw.width, height = workSpaceDraw.height
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
    }, (element) => element)
    return data
  }

  const getJSONData = () => {
    const [ canvas ] = useCanvas()
    return canvas.toObject(propertiesToInclude)
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

  // const generatePDF = () => {
  //   const doc = new PDFDocument();
  //   // 添加内容到PDF
  //   doc.text('Hello, World!');
  
  //   return new Promise<any>((resolve) => {
  //     let chunks: any[] = [];
  //     doc.on('data', (chunk) => chunks.push(chunk));
  //     doc.on('end', () => resolve(new Blob(chunks, { type: 'application/pdf' })));
  //     doc.end();
  //   });
  // };

  // 导出PDF
  const exportPDF = async () => {
    const [ canvas ] = useCanvas()
    
    worker.postMessage({
      type: "convert",
    });
    worker.addEventListener('message', (event) => {
      // 获取来自 Web Worker 的 Uint8Array 数据
      const originalUint8Array = event.data;
      console.log('Received data from worker: ', originalUint8Array);
      const blob = new Blob([originalUint8Array], { type: 'application/pdf' })
      saveAs(blob, `yft-design-${Date.now()}.pdf`)
    });
    // var document = new mupdf.Document.openDocument("my_pdf.pdf", "application/pdf");
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
    getJSONData,
    getSVGData,
    Exporting
  }
}