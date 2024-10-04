
import { Pattern } from 'fabric';
import { convertBase64ToWebP, getImgElementBySrc,getBase64ImageSize } from '../util/common';
import { toFixed } from '@/utils/common';
import { VerticalText } from '../object/VerticalText';
import { Image as FabricImage } from '../object/Image';
import { propertiesToInclude } from '@/configs/canvas';

const BaseFontSize = 16
const isBlack = (num: number) => {
  return num - 0 === 0;
};

const drawRectByCanvas = (
  ctx: CanvasRenderingContext2D,
  image: any,
  mask: any
) => {
  const top = mask.top - image.top;
  const left = mask.left - image.left;
  // mask全覆盖 则返回
  if (
    top <= 0 &&
    left <= 0 &&
    mask.height + top >= image.height &&
    mask.width + left >= image.width
  ) {
    return;
  }
  ctx.fillStyle = '#000';
  if (top > 0) {
    ctx.fillRect(0, 0, image.width, top);
  }
  if (left > 0) {
    ctx.fillRect(0, 0, left, image.height);
  }
  if (top + mask.height < image.height) {
    ctx.fillRect(
      0,
      top + mask.height,
      image.width,
      image.height - mask.height - top
    );
  }
  if (left + mask.width < image.width) {
    ctx.fillRect(
      left + mask.width,
      0,
      image.width - mask.width - left,
      image.height
    );
  }
};

export const setMaskCanvas = async (image: FabricImage | any) => {
  try {
    const mask = image.mask || image.groupMask;
    if (!mask) return;
    const maskCanvas = document.createElement('canvas') as HTMLCanvasElement;
    maskCanvas.width = mask.width;
    maskCanvas.height = mask.height;
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = image.width;
    canvas.height = image.height;
    const maskCtx = maskCanvas.getContext('2d') as CanvasRenderingContext2D;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const maskImage = await getImageBitmap(mask.src);
    maskCtx.drawImage(maskImage, 0, 0);
    const maskData = maskCtx.getImageData(0, 0, mask.width, mask.height);
    const defaultColor = mask.defaultColor;
    for (let i = 0; i < maskData.data.length; i += 4) {
      const r = maskData.data[i];
      const g = maskData.data[i + 1];
      const b = maskData.data[i + 2];
      if (r === g && g === b) {
        maskData.data[i + 3] = r;
      } else {
        if (isBlack(r) && isBlack(g) && isBlack(b)) {
          maskData.data[i + 3] = 0;
        }
      }
    }
    maskCtx.putImageData(maskData, 0, 0);
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(maskCanvas, mask.left - image.left, mask.top - image.top);
    if (defaultColor === 255) {
      drawRectByCanvas(ctx, image, mask);
    }
    ctx.globalCompositeOperation = 'source-in';

    ctx.drawImage(image._element, 0, 0);
    const src = canvas.toDataURL('image/webp');
    await image.setSrc(src);
    image.set({ dirty: true });
    image.canvas?.renderAll();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getImageBitmap = async (src: string): Promise<ImageBitmap> => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });
  return createImageBitmap(img);
};

const getTextXy = (str: any): { x: any[], y: any[] } => {
  // 使用正则表达式提取 y 值
  const yMatch = str.match(/y="([^"]*)"/);
  if (!yMatch) return { x: [0], y: [0] }
  const yValue = yMatch ? yMatch[1] : null;

  // 使用正则表达式提取 x 值
  const xMatch = str.match(/x="([^"]*)"/);
  const xValue = xMatch ? xMatch[1] : null;

  // 将 y 值字符串转换为数组
  const yArray = yValue ? [Number(yValue)] : [];

  // 将 x 值字符串转换为数组
  const xArray = xValue ? xValue.split(' ').map(Number) : [];
  return {
    x: xArray, y: yArray
  }
}

// 根据蒙版生成图片
export const assignImgBgMask = async (image: any, mask: any) => {
  const maskCanvas = document.createElement('canvas') as HTMLCanvasElement;
  maskCanvas.width = mask.width;
  maskCanvas.height = mask.height;
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = image.width;
  canvas.height = image.height;
  const maskCtx = maskCanvas.getContext('2d') as CanvasRenderingContext2D;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const maskImage = await getImageBitmap(mask.src);
  maskCtx.drawImage(maskImage, 0, 0);
  const maskData = maskCtx.getImageData(0, 0, mask.width, mask.height);
  for (let i = 0; i < maskData.data.length; i += 4) {
    const r = maskData.data[i];
    const g = maskData.data[i + 1];
    const b = maskData.data[i + 2];
    if (r === g && g === b) {
      maskData.data[i + 3] = r;
    } else {
      if (isBlack(r) && isBlack(g) && isBlack(b)) {
        maskData.data[i + 3] = 0;
      }
    }
  }
  maskCtx.putImageData(maskData, 0, 0);
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.drawImage(maskCanvas, mask.left - image.left, mask.top - image.top);

  ctx.globalCompositeOperation = 'source-in';

  const img = await getImageBitmap(image.src);
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL('image/webp')
}

const getMaskId = (element: any) => {
  if (element.attributes.mask) {
    // 使用正则表达式提取括号中的内容
    const matches = element.attributes.mask?.value.match(/\(#(.*?)\)/);
    return matches[1]
  }
  if (
    element.parentElement
  ) {
    return getMaskId(element.parentElement)
  }
  return ''
}

const getMaskSrc = (xmlString: string) => {
  // 使用 DOMParser 解析 XML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

  // 查找 image 元素
  const imageElement: any = xmlDoc.querySelector('image');

  // 获取 xlink:href 属性的值
  const hrefValue = imageElement.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
  return hrefValue
}

const fabricEmToPx = (emValue: number, baseFontSize = 16) => {
  // Convert em to pixels
  return toFixed(emValue * baseFontSize, 2);
}

const fabricPxToEm = (val: number, baseFontSize = 16) => {
  // Convert em to pixels
  return toFixed(val / baseFontSize, 2) as any * 1000;
}


const getElFilterStrings = (textEl: any, allElements: any[]) => {
  const filters: any = []
  const style = allElements.find((item: any) => item.nodeName === 'style')
  const getFilters = (el: any) => {
    const { attributes = {} } = el || {}
    let { filter, class: _class } = attributes
    if (filter) {
      filter = filter?.match(/\(#(.*?)\)/)?.[1]
      if (filter) filters.push(filter)
    } else if (_class?.value) {
      const styleObj: any = Array.from(style?.sheet?.cssRules || {}).find((item: any) => item.selectorText.indexOf(`.${_class.value}`) > -1)
      const filterId = styleObj?.cssText?.match(/#(.*?)"/)?.[1];
      if (filterId) filters.push(filterId)
    }
    if (el?.parentElement?.nodeName === 'g') {
      getFilters(el.parentElement)
    }
  }
  getFilters(textEl)
  return filters
}

const handleShapeFilter = async (obj: any, allElements: any[]) => {
  const textEl = allElements.find((item: any) => item.id === obj.id)
  const filters = getElFilterStrings(textEl, allElements)

  if (!filters.length) return
  const filterId = filters[filters.length - 1];
  const filterEl: any = allElements.find((item: any) => item.id === filterId)
  if (!filterEl) return
  const { innerHTML, attributes: { x, y } } = filterEl
  const floodMatch = innerHTML?.match(/flood-color="([^"]+)"/);
  const imgMatch = innerHTML?.match(/xlink:href="([^"]+)"/);
  const floodColor = floodMatch ? floodMatch[1] : null;
  if (imgMatch?.[1]) {
    const srcImg: any = await getImgElementBySrc(imgMatch[1])
    obj.fill = new Pattern({
      source: srcImg,
      crossOrigin: "anonymous",
      // offsetX: Number(x.value) || 0,
      // offsetY: Number(y.value) || 0,
    })
  } else if (floodColor) {
    obj.fill = floodColor
  }

}

const measureText = (options: any) => {
  let { value, charSpacing = 0, fontSize, fontWeight } = options

  const canvas: any = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxlengthCharText = value
    .split('\n')
    .reduce((longest: string, current: string) => {
      // 比较当前字符串与最长字符串的长度
      return current.length > longest.length ? current : longest;
    }, ''); // 初始值是一个空字符串
  ctx.font = `${fontWeight} ${fontSize}px Arial`;

  const { width } = ctx.measureText(
    maxlengthCharText
  )
  return width + charSpacing * maxlengthCharText.length
}

// 处理导入svg解析后的蒙版图片数据
export const getObjectsFromSvgContent = async (content: any) => {
  const { allElements, elements } = content

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    const objectItem = content.objects[i]

    if (objectItem['mix-blend-mode']) {
      // 混合模式
      objectItem.globalCompositeOperation = objectItem['mix-blend-mode']
    }
    if (element?.nodeName === 'image') {
      const imgSize = getBase64ImageSize(objectItem['xlink:href'])
      if (imgSize > 0.5 * 1000 * 1000) {
        const quality = imgSize > 1 * 1000 * 1000 ? 0.7 : 1
        // 转成webp格式
        const src = await convertBase64ToWebP({
          src: objectItem['xlink:href'],
          quality
        })
        await objectItem.setSrc(src)
      }
      const maskId = getMaskId(element)
      if (!maskId) continue
      const maskEl = allElements.find((item: any) => item.id === maskId)
      if (!maskEl) continue
      const maskUrl = getMaskSrc(maskEl.outerHTML)

      const { left, height, width, top } = objectItem
      const src = objectItem.src || objectItem["xlink:href"]

      const resSrc = await assignImgBgMask({
        left, height, width, top, src
      }, { left, height, width, top, src: maskUrl })

      if (resSrc) {
        await objectItem.setSrc(resSrc)
      }
    } else if (element?.nodeName === 'text') {
      const { x = [0], y = [0] } = getTextXy(element.innerHTML)
      const offsetX = x[0] || 0
      const offsetY = y[0] || 0
      let isVerticalText = false
      let { charSpacing, fontSize, top, left, scaleX = 1, scaleY = 1, text, height, width: measureWidth, fontWeight } = objectItem
      let _charSpacing = x.length >= 2 ? x.reduce((p, c, i) => {
        if (i > 0) p += (c - x[i - 1] - fontSize * scaleX)
        return p
      }, 0) / (x.length - 1) : 0
      if (_charSpacing < 0) _charSpacing = 0
      const offset = { x: 0, y: 0 }
      const styles: any = []
      let isOnlyOneText = true
      const tspans: any[] = Array.from(element.getElementsByTagName('tspan'))
      const tspanTextArr: string[] = []
      tspans.map((c: any) => {
        tspanTextArr.push(c.textContent)
        if (c.textContent.length !== 1 && isOnlyOneText) isOnlyOneText = false
        const cls = c.getAttribute('class')
        if (cls) {
          const elStyle = allElements.find((item: any) => item.nodeName === 'style')
          const styleObj: any = Array.from(elStyle?.sheet?.cssRules || {}).find((item: any) => item.selectorText.indexOf(`.${cls}`) > -1)
          const { fill } = styleObj.style
          if (fill) {
            const start = objectItem.text.indexOf(c.textContent)
            styles.push({
              start,
              end: start + c.textContent.length,
              style: { fill: '#ffffff', color: '#ffffff' }
            })
          }
        }
      })

      const isOnlyOneTextTspans = isOnlyOneText && element.textContent === tspanTextArr.join('');

      if (element.innerHTML.indexOf('<') !== 0) {
        const firstSpan = tspans[0]
        offset.x = Number(firstSpan?.getAttribute('x') || 0)
        offset.y = Number(firstSpan?.getAttribute('dy') || firstSpan?.getAttribute('y') || 0)
        if (offset.y > height) {
          const firstText = element.innerHTML.split('<')[0]
          text = text.replace(firstText, `${firstText}\n`)
        }
      } else {
        const charList = tspans.map((item: any) => ({
          x: item?.getAttribute('x') || 0,
          y: item?.getAttribute('y') || 0
        }))
        isVerticalText = isOnlyOneTextTspans && charList.length > 1 && new Set(charList.map((item: any) => item.x)).size === 1
        if (!isVerticalText) {
          text = tspanTextArr.join('\n')
          const width = measureText({ value: text, fontSize, fontWeight, charSpacing })
          measureWidth = Math.min(measureWidth, width)
        }
      }

      const styleResult: any = {}
      styles.forEach((item: any, index: number) => {
        const result: any = {}
        for (let i = 0; i < item.end - item.start; i++) {
          result[i + item.start] = { ...item.style }
        }
        styleResult[index] = result
      })
      if (isVerticalText) {
        const obj = objectItem.toObject(propertiesToInclude)
        delete obj.type
        delete obj.clipPath
        content.objects[i] = await VerticalText.fromObject(obj)
      }
      objectItem.set({
        text,
        width: measureWidth,
        styles: styleResult,
        charSpacing: charSpacing + fabricEmToPx(_charSpacing),
        top: top + offsetY * scaleY - offset.y * scaleY,
        left: left + offsetX * scaleX - offset.x * scaleX,
        splitByGrapheme: true
      })
      await handleShapeFilter(objectItem, allElements) // 处理部分filter
    } else {
      await handleShapeFilter(objectItem, allElements) // 处理部分filter
    }
  }

  return content
}