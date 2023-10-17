import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from "@/store"
import { useMainStore } from '@/store/modules/main'
import { RightStates, ElementNames } from '@/types/elements'
import { nanoid } from 'nanoid'
import { QRCodeElement, PolygonElement, QRCodeOption } from '@/types/canvas'
import { getImageSize } from '@/utils/image'
import { classRegistry } from 'fabric'
import JsBarcode from 'jsbarcode'
import * as fabric from "fabric"
import useCenter from '@/views/Canvas/useCenter'
import useCanvas from '@/views/Canvas/useCanvas'
import useCanvasZindex from './useCanvasZindex'



export default () => {
  
  const mainStore = useMainStore()
  const templatesStore = useTemplatesStore()
  const { setZindex } = useCanvasZindex()
  const { rightState, systemFonts } = storeToRefs(mainStore)


  const createTextElement = (fontSize: number, textStyle = 'transverse', textHollow = false) => {
    const { centerPoint } = useCenter()
    const [ canvas ] = useCanvas()
    const textBoxElement = new fabric.Textbox('双击修改文字', {
      id: nanoid(10),
      left: centerPoint.x,
      top: centerPoint.y,
      fontSize,
      fontFamily: systemFonts.value[0].value,
      fillType: 0,
      hasControls: true,
      hasBorders: true,
      fontWeight: 'normal',
      charSpacing: 3,
      opacity: 1,
      lineHeight: 1.3,
      originX: 'center',
      originY: 'center',
      textAlign: 'justify-center',
      name: ElementNames.TEXTBOX,
      splitByGrapheme: textStyle === 'direction' ? true : false,
    })
    if (textHollow) {
      textBoxElement.fill = ''
      textBoxElement.stroke = 'black'
      textBoxElement.strokeWidth = 1 
    }
    canvas.add(textBoxElement)
    canvas.setActiveObject(textBoxElement)
    rightState.value = RightStates.ELEMENT_STYLE
    templatesStore.modifedElement()
    setZindex(canvas)
  }

  const createPathElement = (path: string, left?: number, top?: number) => {
    const { centerPoint } = useCenter()
    const [ canvas ] = useCanvas()
    const pathElement = new fabric.Path(path, {
      id: nanoid(10),
      left: left ? left : centerPoint.x,
      top: top ? top : centerPoint.y,
      hasControls: true,
      hasBorders: true,
      opacity: 1,
      originX: 'center',
      originY: 'center',
      fill: '#ff5e17',
      name: ElementNames.PATH,
    })
    canvas.add(pathElement)
    canvas.setActiveObject(pathElement)
    rightState.value = RightStates.ELEMENT_STYLE
    setZindex(canvas)
    canvas.renderAll()
    templatesStore.modifedElement()
  }

  const createLineElement = (path: string) => {
    // const { centerPoint } = useCenter()
    // const [ canvas ] = useCanvas()
    // const lineElement = new fabric.Line([0, 0, 100, 0], {
    //   // @ts-ignore
    //   id: nanoid(10),
    //   left: centerPoint.x,
    //   top: centerPoint.y,
    //   strokeWidth: 4,
    //   stroke: 'green',
    //   scaleX: 1,
    //   scaleY: 1,
    //   originX: 'center',
    //   originY: 'center',
    //   transparentCorners: false,
    // }) as LineElement
    // canvas.add(lineElement)
    // canvas.setActiveObject(lineElement)
    // rightState.value = RightStates.ELEMENT_STYLE
    // templatesStore.modifedElement()
    // setZindex(canvas)
    createPolygonElement(path)
  }

  const createPolygonElement = (path: string) => {
    const { centerPoint } = useCenter()
    const [ canvas ] = useCanvas()
    const points = [ { x: 0, y: 0 }, { x: 100, y: 0 } ]
    const Polygon = classRegistry.getClass('Polygon')

    const polygonElement = new Polygon(points, {
      id: nanoid(10),
      left: centerPoint.x,
      top: centerPoint.y,
      strokeWidth: 4,
      stroke: 'green',
      scaleX: 1,
      scaleY: 1,
      originX: 'center',
      originY: 'center',
      objectCaching: false,
      transparentCorners: false,
      name: ElementNames.LINE
    }) as PolygonElement
    canvas.add(polygonElement)
    canvas.setActiveObject(polygonElement)
    rightState.value = RightStates.ELEMENT_STYLE
    templatesStore.modifedElement()
    setZindex(canvas)
  }

  const createImageElement = (url: string) => {
    const { zoom } = storeToRefs(useFabricStore())
    const { currentTemplateWidth, currentTemplateHeight } = storeToRefs(useTemplatesStore())
    const { centerPoint } = useCenter()
    const [ canvas ] = useCanvas()
    getImageSize(url).then( async ({width, height}) => {
      const scale = height / width
      let imageScale = 1
      if (scale < zoom.value && width > currentTemplateWidth.value) {
        imageScale = currentTemplateWidth.value / width
      }
      else if (height > currentTemplateHeight.value) {
        imageScale = currentTemplateHeight.value / height
      }
      const CropImage = classRegistry.getClass('CropImage')
      const imageElement = await CropImage.fromURL(url, {
        id: nanoid(10),
        angle: 0,
        left: centerPoint.x,
        top: centerPoint.y,
        scaleX: imageScale,
        scaleY: imageScale,
        hasControls: true,
        hasBorders: true,
        opacity: 1,
        originX: 'center',
        originY: 'center',
        borderColor: '#ff8d23',
        type: 'CropImage',
        name: ElementNames.IMAGE
      })
      canvas.add(imageElement)
      canvas.setActiveObject(imageElement)
      rightState.value = RightStates.ELEMENT_STYLE
      setZindex(canvas)
      canvas.renderAll()
      templatesStore.modifedElement()
    })
  }

  const createQRCodeElement = async (url: string, codeOption: QRCodeOption, codeContent?: string) => {
    const [ canvas ] = useCanvas()
    const { centerPoint } = useCenter()
    const QRCode = classRegistry.getClass('QRCode')
    const codeObject = await QRCode.fromURL(url, {crossOrigin: 'anonymous'}, {
      id: nanoid(10),
      name: ElementNames.QRCODE,
      angle: 0,
      left: centerPoint.x,
      top: centerPoint.y,
      hasControls: true,
      hasBorders: true,
      opacity: 1,
      originX: 'center',
      originY: 'center',
      borderColor: '#ff8d23',
      codeContent,
      codeOption,
    }) as QRCodeElement
    canvas.add(codeObject)
    templatesStore.modifedElement()
    canvas.setActiveObject(codeObject)
    rightState.value = RightStates.ELEMENT_STYLE
    setZindex(canvas)
  }

  const createBarCodeElement = async (url: string, codeContent: string, codeOption: JsBarcode.BaseOptions) => {
    const [ canvas ] = useCanvas()
    const { centerPoint } = useCenter()
    const Barcode = classRegistry.getClass('BarCode')
    const barcodeObject = await Barcode.fromURL(url,  {crossOrigin: 'anonymous'}, {
      id: nanoid(10),
      name: ElementNames.BARCODE,
      angle: 0,
      left: centerPoint.x,
      top: centerPoint.y,
      hasControls: true,
      hasBorders: true,
      opacity: 1,
      originX: 'center',
      originY: 'center',
      borderColor: '#ff8d23',
      codeContent,
      codeOption,
    })
    canvas.add(barcodeObject)
    templatesStore.modifedElement()
    canvas.setActiveObject(barcodeObject)
    rightState.value = RightStates.ELEMENT_STYLE
    setZindex(canvas)
  }

  return {
    createTextElement,
    createPathElement,
    createLineElement,
    createImageElement,
    createQRCodeElement,
    createBarCodeElement
  }
}