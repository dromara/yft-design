import { Image as FabricImage, StaticCanvas } from 'fabric'

export const strokeImage = async (stroke: string, strokeWidth: number, fabricImage: FabricImage, canvas: HTMLCanvasElement) => {
  const w = fabricImage.width, h = fabricImage.height, src = fabricImage.getSrc()
  const size = strokeWidth, p = strokeWidth
  // console.log(fabricImage.canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) return 
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  canvas.width = w + size * 2
  canvas.height = h + size * 2
  const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1]
  const img = await addImage(src)
  if (!img) return
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
}  

const addImage = async (src: string): Promise<HTMLImageElement | undefined> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    img.src = src;
  })
}