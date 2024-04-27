/*
 * @Author: June
 * @Description: 
 * @Date: 2024-04-12 21:10:10
 * @LastEditors: June
 * @LastEditTime: 2024-04-14 10:31:32
 */
import { Image as FabricImage, StaticCanvas } from 'fabric'

// 恢复未处理
export const strokeImage = async (stroke: string, strokeWidth: number,  strokeLineJoin: CanvasLineJoin, fabricImage: FabricImage, type = 'source-over') => {
  
  const w =  fabricImage.width, h = fabricImage.height, src = fabricImage.getSrc()
  let canvas:  HTMLCanvasElement | null = document.createElement('canvas');
  const ctx = canvas!.getContext('2d')
  if (!ctx) return
  if(strokeWidth === 0) return
  ctx.save();
  ctx.clearRect(0, 0, canvas!.width, canvas!.height);
  ctx.restore();
  canvas!.width = w + strokeWidth * 2
  canvas!.height = h + strokeWidth * 2
  const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1]
  const img = await addImage(src)
  if (!img) return
  for (let i = 0; i < dArr.length; i += 2) {
    ctx.drawImage(img, strokeWidth + dArr[i] * strokeWidth, strokeWidth + dArr[i + 1] * strokeWidth, w, h);
  }
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = stroke;
  ctx.lineJoin = strokeLineJoin;
  ctx.fillRect(0, 0, w + strokeWidth * 2, h + strokeWidth * 2);
  ctx.globalCompositeOperation = type as GlobalCompositeOperation
  ctx.drawImage(img, strokeWidth, strokeWidth, w, h);
  const res = canvas?.toDataURL()
  canvas = null
  if(!res) return
  await fabricImage.setSrc(res)
  fabricImage.canvas?.renderAll()
}  

const addImage = async (src: string): Promise<HTMLImageElement | undefined> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    img.src = src;
  })
}