/**
 * 判断操作系统是否存在某字体
 * @param fontName 字体名
 */
 export const isSupportFont = (fontNames: string[]) => {
  let supportFonts: string[] = []
  fontNames.forEach(fontName => {
    if (typeof fontName !== 'string') return false

    const arial = 'Arial'
    if (fontName.toLowerCase() === arial.toLowerCase()) return true
  
    const size = 100
    const width = 100
    const height = 100
    const str = 'a'
  
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
  
    if (!ctx) return false
  
    canvas.width = width
    canvas.height = height
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black'
    ctx.textBaseline = 'middle'
  
    const getDotArray = (_fontFamily: string) => {
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${size}px ${_fontFamily}, ${arial}`
      ctx.fillText(str, width / 2, height / 2)
      const imageData = ctx.getImageData(0, 0, width, height).data
      return [].slice.call(imageData).filter(item => item !== 0)
    }
    if (getDotArray(arial).join('') !== getDotArray(fontName).join('')) {
      supportFonts.push(fontName)
    }
  })
  return supportFonts
}