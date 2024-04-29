import { Image as OriginImage } from "@/extension/object/Image"
import { Mask } from "@/types/elements"

const isBlack = (num: number) => {
  return num - 0 === 0
}

const drawRectByCanvas = (ctx: CanvasRenderingContext2D, image: OriginImage, mask: Mask) => {
  if (mask.width >= image.width && mask.height >= image.height) return
  const top = mask.top - image.top
  const left = mask.left - image.left
  ctx.fillStyle = '#000'
  if (top > 0) {
    ctx.fillRect(0, 0, image.width, top)
  }
  if (left > 0) {
    ctx.fillRect(0 , 0, left, image.height)
  }
  if (top + mask.height < image.height) {
    ctx.fillRect(0, top + mask.height, image.width, image.height - mask.height - top)
  }
  if (left + mask.width < image.width) {
    ctx.fillRect(left + mask.width, 0, image.width - mask.width - left, image.height)
  }
}

export const getMaskCanvas = async (image: OriginImage) => {
  try {
    const mask = image.mask
    if (!mask) return
    const maskCanvas = document.createElement('canvas') as HTMLCanvasElement
    maskCanvas.width = mask.width
    maskCanvas.height = mask.height
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = image.width
    canvas.height = image.height
    const maskCtx = maskCanvas.getContext('2d') as CanvasRenderingContext2D
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const maskImage = await getImageBitmap(mask.src)
    maskCtx.drawImage(maskImage, 0, 0)
    const maskData = maskCtx.getImageData(0, 0, mask.width, mask.height)
    const defaultColor = mask.defaultColor
    for (let i = 0; i < maskData.data.length; i += 4) {
      const r = maskData.data[i]
      const g = maskData.data[i + 1]
      const b = maskData.data[i + 2]
      if (r === g && g === b) {
        maskData.data[i + 3] = r 
      }
      else {
        if (isBlack(r) && isBlack(g) && isBlack(b)) {
          maskData.data[i + 3] = 0
         }
      }
    }
    maskCtx.putImageData(maskData, 0, 0)
    canvas.width = image.width
    canvas.height = image.height
    
    ctx.drawImage(maskCanvas, mask.left - image.left, mask.top - image.top)
    if (defaultColor === 255) {
      drawRectByCanvas(ctx, image, mask)
    }
    ctx.globalCompositeOperation = 'source-in'
    ctx.drawImage(image._element, 0, 0)
    const src = canvas.toDataURL()
    await image.setSrc(src)
    image.set({'dirty': true})
    image.canvas?.renderAll()
  } 
  catch (error) {
    console.log(error)
    return null
  }
}

export const getImageBitmap = async (src: string): Promise<ImageBitmap> => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = src
  await new Promise<void>((resolve) => {
    img.onload = () => resolve()
  })
  return createImageBitmap(img)
}