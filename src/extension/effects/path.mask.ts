import { Path as OriginPath,  } from "@/extension/object/Path"
import { Image as FabricImage, SerializedPathProps } from "fabric"

const isBlack = (num: number) => {
  return num - 0 === 0
}

const drawRectByCanvas = (ctx: CanvasRenderingContext2D, path: OriginPath, mask: FabricImage) => {
  // if (mask.width >= path.width && mask.height >= path.height) return
  const top = mask.top - path.top
  const left = mask.left - path.left
  if (top <= 0 && left <= 0 && mask.height + top >= path.height && mask.width + left >= path.width) {
    return
  }
  ctx.fillStyle = '#000'
  if (top > 0) {
    ctx.fillRect(0, 0, path.width, top)
  }
  if (left > 0) {
    ctx.fillRect(0 , 0, left, path.height)
  }
  if (top + mask.height < path.height) {
    ctx.fillRect(0, top + mask.height, path.width, path.height - mask.height - top)
  }
  if (left + mask.width < path.width) {
    ctx.fillRect(left + mask.width, 0, path.width - mask.width - left, path.height)
  }
}

export const getPathMask = async (path: OriginPath) => {
  try {
    const mask = path.mask
    if (!mask) return
    const maskCanvas = document.createElement('canvas') as HTMLCanvasElement
    maskCanvas.width = mask.width
    maskCanvas.height = mask.height
    const canvas = document.createElement('canvas') as HTMLCanvasElement
    canvas.width = path.width
    canvas.height = path.height
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
    canvas.width = path.width
    canvas.height = path.height
    
    ctx.drawImage(maskCanvas, mask.left - path.left, mask.top - path.top)
    if (defaultColor === 255) {
      drawRectByCanvas(ctx, path, mask)
    }
    ctx.globalCompositeOperation = 'source-in'
    const imageElement = await getImageBitmap(path.toDataURL())
    ctx.drawImage(imageElement, 0, 0)
    const src = canvas.toDataURL()
    const image = await FabricImage.fromURL(src, {}, {})
    return image
    // path.set({'dirty': true})
    // path.canvas?.renderAll()
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