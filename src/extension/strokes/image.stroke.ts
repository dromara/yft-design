import { Image as FabricImage } from 'fabric'

export const strokeImage = (stroke: string, strokeWidth: number, fabricImage: FabricImage) => {
  const w = fabricImage.width, h = fabricImage.height, src = fabricImage.getSrc()
  const size = strokeWidth, p = strokeWidth
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')
  if (!ctx) return 
  canvas.width = w + size * 2
  canvas.height = h + size * 2
  const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1]
  const img = new Image()
  img.src = src
  img.onload = async () => { 
    for (var i = 0; i < dArr.length; i += 2) {
      ctx.drawImage(img, p + dArr[i] * size, p + dArr[i + 1] * size, w, h);
    }
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = stroke;
    ctx.fillRect(0, 0, w + size * 2, h + size * 2);
    ctx.globalCompositeOperation = "source-over"
    ctx.drawImage(img, p, p, w, h);
    const res = canvas.toDataURL()
    await fabricImage.setSrc(res)
    fabricImage.canvas?.renderAll()
    // console.log('res:', res)
  }
}  