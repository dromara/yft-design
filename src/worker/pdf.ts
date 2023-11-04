import { CanvasElement, TextboxElement, ImageElement, Template } from '@/types/canvas'
import { ElementNames } from '@/types/elements'
import { isBase64, getBase64Type, getLinkType } from '@/utils/common'
import { PDFDocument, StandardFonts, rgb, PDFPage, PDFImage } from 'pdf-lib'
import { loadFont } from '@/utils/fonts'
import { WEB_FONTS } from '@/configs/fonts'

// self.addEventListener("message", handleMessage);

// worker
// async function handleMessage(e: MessageEvent) {
//   const template = JSON.parse(e.data.template) as Template
//   const templateWidth = template.width / template.zoom, templateHeight = template.height / template.zoom
//   console.log('template:', template)
//   const pdfDoc = await PDFDocument.create()
//   const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

//   const page = pdfDoc.addPage([templateWidth, templateHeight])
//   const { width, height } = page.getSize()
//   await drawItem(template.objects as CanvasElement[], page, pdfDoc)
//   const pdfBytes = await pdfDoc.save()
//   postMessage(pdfBytes)
// }

// main
export const handleMessage = async (template: Template) => {
  // const template = JSON.parse(e.data.template) as Template
  const templateWidth = template.width / template.zoom, templateHeight = template.height / template.zoom
  console.log('template:', template)
  const pdfDoc = await PDFDocument.create()
  // pdfDoc.registerFontkit(font)
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const page = pdfDoc.addPage([templateWidth, templateHeight])
  await drawItem(template.objects as CanvasElement[], page, pdfDoc)
  const pdfBytes = await pdfDoc.save()
  // postMessage(pdfBytes)
  return pdfBytes
}


const drawItem = async (objects: CanvasElement[], page: PDFPage, pdfDoc: PDFDocument) => {
  for (let i = 0; i < objects.length; i++) {
    const item = objects[i]
    if (item.type.toLowerCase() === ElementNames.TEXT || item.type.toLowerCase() === ElementNames.TEXTBOX) {
      await drawText(item as TextboxElement, page, pdfDoc)
    }
    else if (item.type.toLowerCase() === ElementNames.GROUP) {
      await drawItem((item as any).objects, page, pdfDoc)
    }
    else if (item.type.toLowerCase() === ElementNames.IMAGE || item.type.toLowerCase() === ElementNames.CROPIMAGE ) {
      await drawImage((item as ImageElement), page, pdfDoc)
    }
  }
  // objects.forEach(async (item) => {
    
  // })
}


const drawText = async (item: TextboxElement, page: PDFPage, pdfDoc: PDFDocument) => {
  // const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  let pdfFont
  if (WEB_FONTS.filter(ele => ele.value === item.fontFamily)[0]) {
    pdfFont = await pdfDoc.embedFont(`/src/assets/fonts/${item.fontFamily}.ttf`)
  } else {
    const fontData = await loadFont(item.fontFamily)
    // if (!fontData) return
    // const fontBlob = await fontData.blob()
    // const fontBuffer = await fontBlob.arrayBuffer()
    pdfFont = await pdfDoc.embedFont(item.fontFamily)
  }
  try {
    page.drawText(item.text, {
      x: item.left,
      y: item.top,
      size: item.fontSize,
      font: pdfFont,
      color: rgb(0, 0.53, 0.71),
    })
  } catch (er) {
    console.log('er:', er)
  }
  
}

const drawImage = async (item: ImageElement, page: PDFPage, pdfDoc: PDFDocument) => {
  const imageUrl = item.src
  if (isBase64(imageUrl)) {
    const imageType = getBase64Type(imageUrl)
    if (!imageType) return
    if (imageType === 'png') {
      const pngImage = await pdfDoc.embedPng(imageUrl)
      await imageDraw(item, page, pngImage)
    }
    else if (imageType === 'jpg') {
      const jpgImage = await pdfDoc.embedJpg(imageUrl)
      await imageDraw(item, page, jpgImage)
    }
    return
  }
  const linkType = getLinkType(imageUrl)
  if (!linkType) return
  if (linkType === 'jpg') {
    const jpgImage = await pdfDoc.embedJpg(await fetch(imageUrl).then((res) => res.arrayBuffer()))
    await imageDraw(item, page, jpgImage)
    return
  }
  else if (linkType === 'png') {
    const pngImage = await pdfDoc.embedPng(await fetch(imageUrl).then((res) => res.arrayBuffer()))
    await imageDraw(item, page, pngImage)
  }
}

const imageDraw = async (item: ImageElement, page: PDFPage, img: PDFImage) => {
  // const jpgDims = jpgImage.scale(0.5)
  // const pngDims = pngImage.scale(0.5)
  page.drawImage(img, {
    x: 0,
    y: 0,
    width: item.width,
    height: item.height,
  })
}