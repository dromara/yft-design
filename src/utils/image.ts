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
      // console.log(reader.result)
      resolve(reader.result as string)
    })
    reader.readAsText(file)
  })
}

const isUrl = (src: string) => {
  try {
    const newUrl = new URL(src);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

const toDataUrl = (url: string): Promise<string | ArrayBuffer | null> => {
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  })
}

export const src2blob = async (src: string) => {
  let dataURL = src
  if (isUrl(src)) {
    dataURL = await toDataUrl(src) as string
  }
  if (!dataURL) return
  let arr = dataURL.split(',') as any[]
  let mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// px2mm
export const px2mm = (value: number) => {
  return value / 300 * DefaultRatio
}

// mm2px
export const mm2px = (value: number) => {
  return value * 300 / DefaultRatio
}