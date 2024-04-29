const isBlack = (num: number) => {
  return num - 0 === 0
}

const drawRectByCanvas = (ctx: CanvasRenderingContext2D, data: any, mask: any) => {
  if (mask.canvas.width >= data.canvas.width && mask.canvas.height >= data.cnavas.height) return
  const top = mask.top - data.top
  const left = mask.left - data.left
  ctx.fillStyle = '#000'
  if (top > 0) {
    ctx.fillRect(0, 0, data.cnavas.width, top)
  }
  if (left > 0) {
    ctx.fillRect(0 , 0, left, data.canvas.height)
  }
  if (top + mask.canvas.height < data.canvas.height) {
    ctx.fillRect(0, top + mask.canvas.height, data.canvas.width, data.canvas.height - mask.canvas.height - top)
  }
  if (left + mask.canvas.width < data.canvas.width) {
    ctx.fillRect(left + mask.canvas.width, 0, data.canvas.width - mask.canvas.width - left, data.canvas.height)
  }
}

export const getMaskCanvas = (data: any, mask: any) => {
  try {
    const maskCtx = mask.canvas.getContext('2d')
    const canvas = document.createElement('canvas')
    const maskData = maskCtx.getImageData(0, 0, mask.canvas.width, mask.canvas.height, mask.canvas.src)
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
    canvas.width = data.canvas.width
    canvas.height = data.canvas.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx?.drawImage(mask.canvas, mask.left - data.left, mask.top - data.top)
    if (defaultColor === 255) {
      drawRectByCanvas(ctx, data, mask)
    }
    ctx.globalCompositeOperation = 'source-in'
    ctx.drawImage(data.canvas, 0, 0)
    return canvas
  } 
  catch (error) {
    console.log(error)
    return data.canvas
  }
}