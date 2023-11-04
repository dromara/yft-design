import { SystemFont } from "@/types/common"


/**
 * 判断操作系统是否存在某字体
 * @param fontName 字体名
 */
export const getSupportFonts = (fontNames: SystemFont[]) => {
  let supportFonts: SystemFont[] = []
  const size = 100
  const width = 100
  const height = 100
  const str = 'a'

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return supportFonts
  
  canvas.width = width
  canvas.height = height
  ctx.textAlign = 'center'
  ctx.fillStyle = 'black'
  ctx.textBaseline = 'middle'
  return fontNames.filter(item => {
    if (typeof item.value !== 'string') return false

    const arial = 'Arial'
    if (item.value.toLowerCase() === arial.toLowerCase()) return true
    const getDotArray = (_fontFamily: string) => {
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${size}px ${_fontFamily}, ${arial}`
      ctx.fillText(str, width / 2, height / 2)
      const imageData = ctx.getImageData(0, 0, width, height).data
      return [].slice.call(imageData).filter(item => item !== 0)
    }
    return getDotArray(arial).join('') !== getDotArray(item.value).join('')
  })
}

export async function loadFont(fontFamily: string) {
  let font
  try {
    const fonts = await window.queryLocalFonts();
    font = fonts.filter(item => item.family === fontFamily)[0]
  } catch(e: any) {
    console.log(`Cannot query fonts: ${e.message}`)
  } finally {
    return font
  }
}