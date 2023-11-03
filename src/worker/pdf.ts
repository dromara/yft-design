import { CanvasElement, GroupElement, ImageElement, Template } from '@/types/canvas'
import { ElementNames } from '@/types/elements'
import { isBase64, getBase64Type, getLinkType } from '@/utils/common'
import { PDFDocument, StandardFonts, rgb, PDFPage, PDFImage } from 'pdf-lib'
import type { Group, Textbox } from 'fabric'

self.addEventListener("message", handleMessage);


async function handleMessage(e: MessageEvent) {
  const template = JSON.parse(e.data.template) as Template
  const templateWidth = template.width / template.zoom, templateHeight = template.height / template.zoom
  console.log('template:', template)
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  const page = pdfDoc.addPage([templateWidth, templateHeight])
  const { width, height } = page.getSize()
  // const fontSize = 30
  // page.drawText('Creating PDFs in JavaScript is awesome!', {
  //   x: 50,
  //   y: height - 4 * fontSize,
  //   size: fontSize,
  //   font: timesRomanFont,
  //   color: rgb(0, 0.53, 0.71),
  // })
  
  await drawItem(template.objects as CanvasElement[], page, pdfDoc)
  const pdfBytes = await pdfDoc.save()
  postMessage(pdfBytes)
}


const drawItem = async (objects: CanvasElement[], page: PDFPage, pdfDoc: PDFDocument) => {
  for (let i = 0; i < objects.length; i++) {
    const item = objects[i]
    if (item.type.toLowerCase() === ElementNames.TEXT || item.type.toLowerCase() === ElementNames.TEXTBOX) {
      await drawText(item as Textbox, page, pdfDoc)
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


const drawText = async (item: Textbox, page: PDFPage, pdfDoc: PDFDocument) => {
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  try {
    page.drawText(item.text, {
      x: item.left,
      y: item.top,
      size: item.fontSize,
      font: timesRomanFont,
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