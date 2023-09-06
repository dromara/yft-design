import { DefaultDPI, DefaultRatio } from "@/configs/size"

interface ImageSize {
  width: number
  height: number
}

/**
 * 获取图片的原始宽高
 * @param src 图片地址
 */
export const getImageSize = (src: string): Promise<ImageSize> => {
  return new Promise(resolve => {
    const img = document.createElement('img')
    img.src = src
    img.style.opacity = '0'
    document.body.appendChild(img)

    img.onload = () => {
      const imgWidth = img.clientWidth
      const imgHeight = img.clientHeight
    
      img.onload = null
      img.onerror = null

      document.body.removeChild(img)

      resolve({ width: imgWidth, height: imgHeight })
    }

    img.onerror = () => {
      img.onload = null
      img.onerror = null
    }
  })
}

/**
 * 读取图片文件的dataURL
 * @param file 图片文件
 */
 export const getImageDataURL = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result as string)
    })
    reader.readAsDataURL(file)
  })
}

/**
 * 读取图片文件的dataURL
 * @param file 图片文件
 */
export const getImageText = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      console.log(reader.result)
      resolve(reader.result as string)
    })
    reader.readAsText(file)
  })
}


// px2mm
export const px2mm = (value: number) => {
  return value / 300 * DefaultRatio
}

// mm2px
export const mm2px = (value: number) => {
  return value * 300 / DefaultRatio
}