import { storeToRefs } from 'pinia'
import { useFabricStore, useTemplatesStore } from "@/store"
import { useMainStore } from '@/store/modules/main'
import { RightStates, ElementNames, BarCodeOption } from '@/types/elements'
import { nanoid } from 'nanoid'
import { QRCodeElement, BarCodeElement, ImageElement, LineElement, PolygonElement, PathElement, TextboxElement, CanvasElement } from '@/types/canvas'
import { getImageSize } from '@/utils/image'
import { classRegistry } from 'fabric'
import JsBarcode from 'jsbarcode'
import * as fabric from "fabric"
import { extendWithCropImage } from '@/extension/mixins/cropping.mixin'
import useCenter from '@/views/Canvas/useCenter'
import useCanvas from '@/views/Canvas/useCanvas'
import useCanvasZindex from './useCanvasZindex'



export default () => {
  
  const mainStore = useMainStore()
  const templatesStore = useTemplatesStore()
  const { setZindex } = useCanvasZindex()
  const { rightState } = storeToRefs(mainStore)


  const createTextElement = (fontSize: number, textStyle = 'transverse', textHollow = false) => {
    const { centerPoint } = useCenter()
    const [ canvas ] = useCanvas()
    const textBoxElement = new fabric.Textbox('双击修改文字', {
      id: nanoid(10),
      left: centerPoint.x,
      top: centerPoint.y,
      fontSize,
      fillType: 0,
      hasControls: true,
      hasBorders: true,
      fontWeight: '400',
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
    mainStore.setCanvasObject(textBoxElement as CanvasElement)
    templatesStore.modifedElement()
    setZindex(canvas)
  }

  const createPathElement = (path: string, viewBox: number[]) => {
    const { centerPoint } = useCenter()
    const [ canvas ] = useCanvas()
    const pathElement = new fabric.Path(path, {
      id: nanoid(10),
      left: centerPoint.x,
      top: centerPoint.y,
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
    mainStore.setCanvasObject(pathElement as CanvasElement)
    templatesStore.modifedElement()
    setZindex(canvas)
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
    const polygonElement = new fabric.Polygon(points, {
      // @ts-ignore
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
    mainStore.setCanvasObject(polygonElement)
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
      const CropImage = classRegistry.getClass('cropimage')
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
        name: ElementNames.IMAGE
      })
      if (typeof imageElement.isCropping === 'undefined') {
        extendWithCropImage(imageElement)
      }
      canvas.add(imageElement)
      canvas.setActiveObject(imageElement)
      rightState.value = RightStates.ELEMENT_STYLE
      mainStore.setCanvasObject(imageElement as ImageElement)
      templatesStore.modifedElement()
      setZindex(canvas)
    })
  }

  const createQRCodeElement = async (url: string, style: string, content?: string, error?: number, space?: boolean) => {
    const [ canvas ] = useCanvas()
    const { centerPoint } = useCenter()
    const codeObject = await fabric.Image.fromURL(url, {crossOrigin: 'anonymous'}, {
      // @ts-ignore
      id: nanoid(10),
      angle: 0,
      left: centerPoint.x,
      top: centerPoint.y,
      hasControls: true,
      hasBorders: true,
      opacity: 1,
      originX: 'center',
      originY: 'center',
      borderColor: '#ff8d23',
      name: ElementNames.QRCODE,
    }) as QRCodeElement
    codeObject.codeStyle = style
    codeObject.codeContent = content
    codeObject.codeError = error
    codeObject.codeSpace = space
    canvas.add(codeObject)
    templatesStore.modifedElement()
    canvas.setActiveObject(codeObject)
    rightState.value = RightStates.ELEMENT_STYLE
    mainStore.setCanvasObject(codeObject)
    setZindex(canvas)
  }

  const createBarCodeElement = async (url: string, codeContent: string, codeOption: JsBarcode.BaseOptions) => {
    const [ canvas ] = useCanvas()
    const { centerPoint } = useCenter()
    const barcodeObject = await fabric.Image.fromURL(url,  {crossOrigin: 'anonymous'}, {
      // @ts-ignore
      id: nanoid(10),
      angle: 0,
      left: centerPoint.x,
      top: centerPoint.y,
      hasControls: true,
      hasBorders: true,
      opacity: 1,
      originX: 'center',
      originY: 'center',
      borderColor: '#ff8d23',
      name: ElementNames.BARCODE,
    }) as BarCodeElement
    barcodeObject.codeContent = codeContent
    barcodeObject.codeOption = codeOption
    canvas.add(barcodeObject)
    templatesStore.modifedElement()
    canvas.setActiveObject(barcodeObject)
    rightState.value = RightStates.ELEMENT_STYLE
    mainStore.setCanvasObject(barcodeObject)
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