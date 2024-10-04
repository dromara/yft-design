//@ts-ignore
import PSD from 'psd.js';
import Buffer from 'buffer';
import { Gradient, Pattern } from 'fabric';
import {
  convertBase64ToWebP,
  getImgElementBySrc,
} from '../util/common';
import { nanoid } from 'nanoid';
import { WorkSpaceDrawData } from '@/configs/canvas';

// 兼容浏览器Buffer
if (typeof (window as any).Buffer === 'undefined') {
  (window as any).Buffer = Buffer.Buffer;
}

const STROKE_TYPE = {
  InsF: 'inner',
  CtrF: 'center',
  OutF: 'outer',
};

export const CLOUD_TYPE = {
  verticalText: 'VerticalText',
  text: 'textbox',
  image: 'image',
};
export const WRITING_MODE = {
  h: 'horizontal-tb',
  v: 'vertical-rl',
};

export const RGBA2HexA = (r: number, g: number, b: number, a = 1) => {
  const hex = RGB2Hex(r, g, b);

  let _a = Math.round((a as number) * 255).toString(16);
  if (_a.length === 1) _a = '0' + _a;

  return hex + _a;
};

const colorer = { RGBA2HexA };

// 计算渐变角度后的位置
const rotateRectangle = (
  width: number,
  height: number,
  gradientRotate: number
) => {
  const proportion = (gradientRotate % 180) / 180;
  let x1 = width * proportion;
  let x2 = width - x1;
  const y1 = gradientRotate <= 180 ? 0 : height;
  const y2 = height - y1;
  if (gradientRotate >= 180) {
    [x2, x1] = [x1, x2];
  }
  // 返回旋转后的坐标
  return { x1, y1, x2, y2 };
};

// 获取数组中出现最多的元素
function getMostFrequentElement(arr: any[]) {
  if (arr.length === 0) {
    return ''; // 空数组的情况
  }

  // 1. 创建一个频率映射
  let frequencyMap: any = new Map();
  arr.forEach((item) => {
    const key = JSON.stringify(item); // 将元素转换为 JSON 字符串作为 Map 的键
    frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1);
  });

  // 2. 确定出现最多的元素
  let mostFrequentElement = arr[0];
  let maxFrequency = 0;

  frequencyMap.forEach((frequency: number, key: string) => {
    if (frequency > maxFrequency) {
      maxFrequency = frequency;
      // 将 JSON 字符串转换回原始类型
      mostFrequentElement = key ? JSON.parse(key) : key;
    }
  });
  frequencyMap = null;
  return mostFrequentElement;
}

export const RGB2Hex = (r: number, g: number, b: number) => {
  let _r = Math.round(r).toString(16);
  let _g = Math.round(g).toString(16);
  let _b = Math.round(b).toString(16);

  if (_r.length === 1) _r = '0' + _r;
  if (_g.length === 1) _g = '0' + _g;
  if (_b.length === 1) _b = '0' + _b;

  return '#' + _r + _g + _b;
};

function toRGBAColor(data: number[]) {
  const [r, g, b] = data;
  let [, , , a] = data;
  if (a > 1) {
    a = a / 255;
  }
  return [r, g, b, a] as const;
}

function calcTransform({ xx, xy }: { xx: number; xy: number }): {
  scale: number;
  angle: number;
} {
  /**
   * xx yx tx
   * xy yy ty
   * 0  0  1
   */
  const scale = Math.sqrt(xx * xx + xy * xy);
  const angle = (Math.asin(xy / scale) * 180) / Math.PI;
  return { scale, angle };
}

async function renderGroupToCanvas(group: any, groupData: any) {
  const canvas: any = document.createElement('canvas');
  const ctx: any = canvas.getContext('2d');
  const bg = getGroupBoundingRect(groupData);

  // 设置 Canvas 尺寸（根据图层组的尺寸调整）
  canvas.width = bg.width;
  canvas.height = bg.height;

  const drawImage = async (group: any) => {
    group = group.reverse();
    // 绘制组中的每一层
    for (let layer of group) {
      if (layer.visible) {
        if (layer.type === 'group') {
          await drawImage(layer._children);
        } else {
          const { width, height, left, top } = layer;
          const { objectEffects } = layer.layer.adjustments;
          const { GrFl } = objectEffects?.data || {};
          let base64;
          if (GrFl) {
            base64 = await getEffectsImage(layer.layer || layer);
          } else base64 = layer?.layer?.image.toBase64();
          const img = await getImgElementBySrc(base64);
          ctx.drawImage(img, left - bg.left, top - bg.top, width, height);
        }
      }
    }
  };
  // 绘制组中的每一层
  await drawImage(group);
  // 将 Canvas 导出为图像
  return {
    src: canvas.toDataURL('image/webp'),
    ...bg,
  };
}

const getPsdFromLayer = (layer: any) => {
  if (layer.parent.type === 'root') return layer.parent.psd;
  if (layer.parent) return getPsdFromLayer(layer.parent);
  return null;
};

// 获取投影
const getElShadow = (effects: any) => {
  const objectEffects = effects.layer.objectEffects();
  const psd = getPsdFromLayer(effects.layer.node);
  const { DrSh = {} } = objectEffects.data;
  if (DrSh?.enab) {
    const clrStr = JSON.stringify(DrSh['Clr ']).split(',');
    let r: any = null,
      g: any = null,
      b: any = null;

    clrStr.forEach((item2) => {
      if (item2.indexOf('Rd') !== -1) {
        r = item2.replace('"Rd  ":', '');
      } else if (item2.indexOf('Bl') !== -1) {
        b = item2.replace('"Bl  ":', '').replace('}', '');
      } else if (item2.indexOf('Grn') !== -1) {
        g = item2.replace('"Grn ":', '');
      }
    });
    // 是否使用了全局光
    const angle = DrSh.uglg
      ? psd?.resources?.resources[1037]?.angle
      : DrSh.lagl.value;
    const distance = DrSh.Dstn.value;
    const color = `rgba(${parseInt(r)},${parseInt(g)},${parseInt(b)},${
      DrSh.Opct.value / 100
    })`;
    let theta = (angle * Math.PI) / 180;
    let offsetX = Number((-distance * Math.cos(theta)).toFixed(2));
    let offsetY = Number((distance * Math.sin(theta)).toFixed(2));
    return {
      angle, // 投影角度
      color, // 投影颜色
      blur: DrSh.blur.value, // 投影大小
      distance, // 投影距离
      offsetX,
      offsetY,
    };
  } else return null;
};

const getElStrokeAttrs = (effects: any) => {
  const objectEffects = effects.layer?.objectEffects();
  const { FrFX = {} } = objectEffects.data || {};
  if (FrFX?.enab) {
    const clrStr = JSON.stringify(FrFX['Clr ']).split(',');
    let r = null,
      g = null,
      b = null;

    clrStr.forEach((item2) => {
      if (item2.indexOf('Rd') !== -1) {
        r = item2.replace('"Rd  ":', '');
      } else if (item2.indexOf('Bl') !== -1) {
        b = item2.replace('"Bl  ":', '').replace('}', '');
      } else if (item2.indexOf('Grn') !== -1) {
        g = item2.replace('"Grn ":', '');
      }
    });
    const strokeOpacity = FrFX.Opct.value / 100;
    const strokeColor = `rgba(${r}, ${g}, ${b}, ${strokeOpacity})`;
    const strokeSize = FrFX['Sz  '].value;
    const strokePosition = FrFX.Styl.value;
    return {
      stroke: strokeColor, // 描边颜色
      strokeWidth: strokeSize, // 描边大小
      strokePosition, // 描边类型 OutF 外部 ｜ InsF 内部 ｜ CtrF 居中
    };
  } else return {};
};

const getEffectsColor = (effects: any) => {
  const objectEffects = effects.layer.objectEffects();
  const { SoFi = {} } = objectEffects.data || {};
  if (SoFi?.enab) {
    const clrStr = JSON.stringify(SoFi['Clr ']).split(',');
    let r: any = null,
      g: any = null,
      b: any = null;

    clrStr.forEach((item2) => {
      if (item2.indexOf('Rd') !== -1) {
        r = item2.replace('"Rd  ":', '');
      } else if (item2.indexOf('Bl') !== -1) {
        b = item2.replace('"Bl  ":', '').replace('}', '');
      } else if (item2.indexOf('Grn') !== -1) {
        g = item2.replace('"Grn ":', '');
      }
    });
    const color = `rgba(${parseInt(r)},${parseInt(g)},${parseInt(b)},${
      SoFi.Opct.value / 100
    })`;
    return {
      color,
    };
  } else return {};
};

const getEffectsImage = async (layer: any) => {
  const base64 = layer.image.toBase64();
  const { objectEffects } = layer.adjustments;
  const { FrFX, DrSh, SoFi, ChFX, GrFl } = objectEffects.data;
  if (!GrFl) return base64;
  const img = await getImgElementBySrc(base64);
  const canvas: any = document.createElement('canvas');
  canvas.width = layer.width;
  canvas.height = layer.height;
  const ctx: any = canvas.getContext('2d');
  // 绘制图片
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const gt: any = await getEffectsGradient(objectEffects);
  const gradientLength = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

  const startX =
    canvas.width / 2 + (gradientLength / 2) * Math.cos(gt.angle || 0);
  const startY =
    canvas.height / 2 + (gradientLength / 2) * Math.sin(gt.angle || 0);
  const endX =
    canvas.width / 2 - (gradientLength / 2) * Math.cos(gt.angle || 0);
  const endY =
    canvas.height / 2 - (gradientLength / 2) * Math.sin(gt.angle || 0);
  // 创建线性渐变
  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  gt.colorStops?.map((stop: any) => {
    gradient.addColorStop(stop.offset, stop.color);
  });

  // 应用渐变色
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height); // 画出渐变色的矩形

  // 重新绘制图片以显示渐变效果
  ctx.globalCompositeOperation = 'destination-atop';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/webp', 0.8);
};

const getEffectsGradient = (effects: any) => {
  const objectEffects = effects.layer.objectEffects();
  const { width, height } = effects.layer;
  const { GrFl = {} } = objectEffects.data || {};
  if (GrFl?.enab) {
    const { Grad, Type, Angl } = GrFl || {};
    const { Clrs, Trns } = Grad || {};
    const colorStops = Clrs.map((color: any, index: number) => {
      return {
        color: `rgba(${parseInt(color['Clr ']['Rd  '])},${parseInt(
          color['Clr ']['Grn ']
        )},${parseInt(color['Clr ']['Bl  '])},${
          Trns[index] ? Trns[index].Opct.value / 100 : 1
        })`,
        offset: Number((color.Lctn / 4096).toFixed(2)),
      };
    });

    const typeMap: any = {
      Lnr: 'linear',
      Rdl: 'radial',
    };
    const type = typeMap[Type.value] || 'linear'; // 渐变样式 Lnr 线性 ｜ Rdl 径向 ｜ Angl 角度 ｜ Rflc 对称的 ｜ Dmnd 菱形
    let coords: any = { x1: 0, y1: 0, x2: width, y2: 0 };
    if (type !== 'linear') {
      coords = {
        r1: 0,
        r2: height / 2,
        x1: width / 2,
        y1: height / 2,
        x2: width / 2,
        y2: height / 2,
      };
    } else {
      coords = rotateRectangle(width, height, Angl.value);
    }
    const gradient: any = new Gradient({
      //@ts-ignore
      fillType :2,
      type,
      colorStops: colorStops, // 渐变色区间
      coords,
    });
    gradient.angle = Angl.value;
    return gradient;
  } else return {};
};

const getEffectsGloss = (effects: any) => {
  const objectEffects = effects?.layer.objectEffects();
  const { ChFX = {} } = objectEffects.data;
  if (ChFX?.enab) {
    let { blur, Dstn, lagl, Opct } = ChFX || {};
    const clrStr = JSON.stringify(ChFX['Clr ']).split(',');
    let r: any = null,
      g: any = null,
      b: any = null;

    clrStr.forEach((item2) => {
      if (item2.indexOf('Rd') !== -1) {
        r = item2.replace('"Rd  ":', '');
      } else if (item2.indexOf('Bl') !== -1) {
        b = item2.replace('"Bl  ":', '').replace('}', '');
      } else if (item2.indexOf('Grn') !== -1) {
        g = item2.replace('"Grn ":', '');
      }
    });
    const distance = Dstn.value;
    const color = `rgba(${parseInt(r)},${parseInt(g)},${parseInt(b)},${
      Opct.value / 100
    })`;
    const angle = lagl.value;
    blur = blur.value;
    let theta = (angle * Math.PI) / 180;
    let offsetX = Number((-distance * Math.cos(theta)).toFixed(2));
    let offsetY = Number((distance * Math.sin(theta)).toFixed(2));
    return {
      angle, // 光泽角度
      color, // 光泽颜色
      blur, // 光泽大小
      distance, // 光泽距离
      offsetX,
      offsetY,
    };
  } else return {};
};

const measureText = (options: any) => {
  let { value, charSpacing = 0, scaleX, fontSize, fontWeight } = options;
  // if (charSpacing - fontSize < 0) charSpacing = 0
  // else charSpacing = charSpacing % fontSize

  const canvas: any = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxlengthCharText = value
    .split('\r')
    .reduce((longest: string, current: string) => {
      // 比较当前字符串与最长字符串的长度
      return current.length > longest.length ? current : longest;
    }, ''); // 初始值是一个空字符串
  ctx.font = `${fontWeight} ${fontSize}px Arial`;

  const { width } = ctx.measureText(maxlengthCharText);
  return width + charSpacing * maxlengthCharText.length;
};

const getObjectEffectsOptions = (objectEffects: any, defaultStyle: any) => {
  if (!objectEffects) return defaultStyle;
  const { FrFX, DrSh, SoFi, ChFX, GrFl } = objectEffects.data;
  // 描边
  if (FrFX)
    defaultStyle = { ...defaultStyle, ...getElStrokeAttrs(objectEffects) };
  // 投影
  if (DrSh) defaultStyle.shadow = getElShadow(objectEffects);
  // 颜色叠加
  if (SoFi) {
    defaultStyle.fill = getEffectsColor(objectEffects).color;
  }
  // 光泽 ChFX
  if (ChFX) defaultStyle.shadow = getEffectsGloss(objectEffects);
  //渐变叠加 GrFl
  if (GrFl) {
    defaultStyle.fill = getEffectsGradient(objectEffects);
  }
  return defaultStyle;
};

function toCloudTextConfig(data: any, layer: any) {
  const { objectEffects, typeTool } = layer.adjustments;
  const { StyleRun } = typeTool.engineData.EngineDict;

  let point = 0;
  const styles: any = [];
  const {
    opacity,
    text: { font, transform, value },
    text,
    height,
    left,
    top,
    width,
  } = data;
  const { colors, weights, alignment, textDecoration, sizes, names, leading } =
      font,
    { angle } = calcTransform(transform);
  const type =
    typeTool.obj.textData.Ornt.value === 'Hrzn'
      ? CLOUD_TYPE.text
      : CLOUD_TYPE.verticalText;
  const fillColors = colors.map((item: any) =>
    colorer.RGBA2HexA(...toRGBAColor(item))
  );
  let fill =
    data.fill?.type === 'pattern'
      ? new Pattern(data.fill)
      : getMostFrequentElement(
          fillColors.reduce((arr: any, c: any, i: number) => {
            const num = StyleRun.RunLengthArray[i];
            Array.from({ length: num }).map(() => {
              arr.push(c);
            });
            return arr;
          }, [])
        );
  let fillMode = 0;
  if (data.fill) {
    fillMode = 4;
  }
  const fontWeight = getMostFrequentElement(weights);
  const textAlign = getMostFrequentElement(alignment);
  const fontStyle = getMostFrequentElement(font.styles);
  const fontSize: number = getMostFrequentElement(sizes) as any;
  const underline = getMostFrequentElement(textDecoration) !== 'none';
  const fontFamily = getMostFrequentElement(
    typeTool.engineData.ResourceDict.FontSet.filter(
      (f: { Synthetic: any }) => !f.Synthetic
    ).map((f: { Name: any }) => f.Name)
  );
  const lineHeight = 1.16;
  const charSpacing =
    getMostFrequentElement(
      StyleRun.RunArray.map(
        (item: any) => item.StyleSheet.StyleSheetData.Tracking
      )
    ) || 0;
  const linethrough =
    getMostFrequentElement(
      StyleRun.RunArray.map(
        (item: any) => item.StyleSheet.StyleSheetData.Strikethrough
      )
    ) || false;
  const horizontalScale =
    getMostFrequentElement(
      StyleRun.RunArray.map(
        (item: any) => item.StyleSheet.StyleSheetData.HorizontalScale
      )
    ) || 1;
  const verticalScale =
    getMostFrequentElement(
      StyleRun.RunArray.map(
        (item: any) => item.StyleSheet.StyleSheetData.VerticalScale
      )
    ) || 1;

  const { xx, xy, tx, yx, yy, ty } = transform;
  const scaleX = xx * horizontalScale || 1,
    scaleY = yy * verticalScale || 1;
  const skewX = xy || 0,
    skewY = yx || 0;
  let defaultStyle: any = {
    type,
    skewX,
    skewY,
    fillMode,
    height,
    top,
    left,
    opacity,
    fill,
    fontWeight,
    fontStyle,
    textAlign,
    underline,
    fontFamily,
    lineHeight,
    charSpacing,
    fontSize,
    linethrough,
  };

  StyleRun.RunArray.forEach((text: any, index: number) => {
    const length = StyleRun.RunLengthArray[index];
    const {
      StyleSheetData: { FontSize, Strikethrough, Underline },
      StyleSheetData,
    } = text.StyleSheet;
    const cssStyle: any = {};
    const styleItem: any = {
      start: point,
      end: point + length,
    };

    const keys: any = {
      FauxItalic: ['fontStyle', 'italic'],
      Underline: ['underline', Underline],
      FauxBold: ['fontWeight', 'bold'],
      Strikethrough: ['linethrough', Strikethrough],
      ...(Math.abs(FontSize - fontSize) > 1
        ? { FontSize: ['fontSize', FontSize] }
        : {}),
    };
    for (let key in keys) {
      const val = keys[key];
      if (StyleSheetData[key] && defaultStyle[val[0]] !== val[1]) {
        cssStyle[val[0]] = val[1];
      }
    }
    if (fill !== fillColors[index]) cssStyle.fill = fillColors[index];
    if (Object.keys(cssStyle).length && typeof fill === 'string') {
      styleItem.style = cssStyle;
      styles.push(styleItem);
    }
    point += length;
  });

  // 混合选项 ( 投影 DrSh/描边 FrFX/渐变叠加 GrFl/颜色叠加 SoFi/光泽 ChFX/ 外发光 OrGl/内发光 IrGl)
  defaultStyle = getObjectEffectsOptions(objectEffects, defaultStyle);

  const measureWidth = measureText({
    value,
    fontWeight,
    fontSize,
    charSpacing: (charSpacing * fontSize) / 1000,
    scaleX,
  });

  return {
    width: Math.min(measureWidth, width), // 不设置fabric会自动计算
    text: value?.replace(/\r/g, '\n'),
    ...defaultStyle,
    angle,
    styles: styles.length ? styles : {},
    scaleX,
    scaleY,
    flipX: xx < 0, // 是否横向翻转
    flipY: yy < 0, // 是否垂直翻转
  };
}

async function toCloudImageConfig(data: any, layer: any) {
  const { objectEffects } = layer.adjustments;
  let defaultStyle = {
    width: data.width,
    height: data.height,
    top: data.top,
    left: data.left,
    opacity: data.opacity,
  };
  // 混合选项 ( 投影 DrSh/描边 FrFX/渐变叠加 GrFl/颜色叠加 SoFi/光泽 ChFX/ 外发光 OrGl/内发光 IrGl)
  // defaultStyle = getObjectEffectsOptions(objectEffects, defaultStyle)
  let image: any = {
    src: '',
    type: CLOUD_TYPE.image,
    ...defaultStyle,
  };
  try {
    if (data.type === 'group') {
      const result = await renderGroupToCanvas(layer.node._children, data);
      image = {
        ...image,
        ...result,
      };
    } else {
      const { GrFl } = objectEffects?.data || {};
      if (GrFl) {
        image.src = await getEffectsImage(layer);
        image.fillType = 2
      } else {
        const baseImg = layer?.image.toBase64();
        image.src = await convertBase64ToWebP({
          src: baseImg,
          quality: 0.7,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  return image;
}

function toCloud(data: any, layer: any) {
  if (layer.typeTool) {
    return toCloudTextConfig(data, layer);
  } else {
    return toCloudImageConfig(data, layer);
  }
}

function getGroupBoundingRect(group: any) {
  let bounds = {
    top: Infinity,
    left: Infinity,
    right: -Infinity,
    bottom: -Infinity,
  };

  function updateBounds(rect: any) {
    bounds.top = Math.min(bounds.top, rect.top);
    bounds.left = Math.min(bounds.left, rect.left);
    bounds.right = Math.max(bounds.right, rect.right);
    bounds.bottom = Math.max(bounds.bottom, rect.bottom);
  }

  function traverse(element: any) {
    if (element.children) {
      element.children.forEach((child: any) => {
        if (child.children) {
          traverse(child);
        }
        updateBounds(child);
      });
    }
  }

  traverse(group);

  return {
    top: bounds.top,
    left: bounds.left,
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
    right: bounds.right,
    bottom: bounds.bottom,
  };
}

const isChildHasText = (layers: any[]) => {
  for (let layer of layers) {
    if (layer.type === 'group') {
      if (isChildHasText(layer._children)) return true;
    }
    if (layer?.layer.typeTool) return true;
  }
  return false;
};

function exportCanvasRegion(canvas: any, region: any) {
  const { left, top, width, height } = region;

  // 创建一个新的canvas来保存指定区域
  const newCanvas = document.createElement('canvas');
  newCanvas.width = width;
  newCanvas.height = height;

  const ctx: any = newCanvas.getContext('2d');

  // 从原canvas中获取图像数据
  const imageData = canvas
    .getContext('2d')
    .getImageData(left, top, width, height);

  // 将图像数据绘制到新的canvas上
  ctx.putImageData(imageData, 0, 0);

  // 导出为数据URL
  const dataURL = newCanvas.toDataURL('image/webp', 0.8); // 可以设置质量参数

  return dataURL; // 返回导出的数据URL
}
export async function convertPSD2Page(psd: any, assignGroup: boolean) {
  const { children, document: doc } = psd.tree().export();
  let treeArr = psd.tree().children();
  console.log(children, treeArr);
  const page: any = {
    width: doc.width,
    height: doc.height,
    objects: [],
  };
  let childImgs: any = [];
  let imgInfos: any = {
    left: [],
    top: [],
    right: [],
    bottom: [],
  };

  const clippedImg = async (layer: any, layerData: any) => {
    const clearChildsInfo = () => {
      childImgs = [];
      imgInfos = {
        left: [],
        top: [],
        right: [],
        bottom: [],
      };
    };
    if (childImgs.length === 0) {
      clearChildsInfo();
    }
    if (layer.clipped && layer.image) {
      childImgs.push([layer, layerData]);
      imgInfos.left.push(layer.left);
      imgInfos.top.push(layer.top);
      imgInfos.right.push(layer.right);
      imgInfos.bottom.push(layer.bottom);

      return { continue: true };
    } else {
      // 合并图片
      // 获取合成图片信息
      if (childImgs.length > 0) {
        const assignImgs = async () => {
          childImgs = childImgs.reverse();

          const imgInfo = {
            left: Math.min(...imgInfos.left),
            top: Math.min(...imgInfos.top),
            right: Math.max(...imgInfos.right),
            bottom: Math.max(...imgInfos.bottom),
          };
          const canvas: any = document.createElement(
            'canvas'
          ) as HTMLCanvasElement;
          canvas.width = doc.width;
          canvas.height = doc.height;
          const ctx = canvas.getContext('2d');
          for (let itemArr of childImgs) {
            let [item, itemData] = itemArr;
            if (itemData.type !== 'group') {
              const img = await getImgElementBySrc(item.image.toBase64());
              ctx.drawImage(img, item.left, item.top);
            }
          }
          // 创建一个新的canvas来绘制特定区域
          const exportCanvas = document.createElement('canvas');
          const exportCtx: any = exportCanvas.getContext('2d');

          // 设置新的canvas大小
          exportCanvas.width = imgInfo.right - imgInfo.left;
          exportCanvas.height = imgInfo.bottom - imgInfo.top;

          // 从原canvas中绘制特定区域
          exportCtx.drawImage(
            canvas,
            imgInfo.left,
            imgInfo.top,
            exportCanvas.width,
            exportCanvas.height,
            0,
            0,
            exportCanvas.width,
            exportCanvas.height
          );
          const src = exportCanvas.toDataURL(
            'image/webp',
            layer.image && !layer.node?._children?.length ? 0.6 : 0.1
          );

          const cloud = {
            src,
            type: CLOUD_TYPE.image,
            width: imgInfo.right - imgInfo.left,
            height: imgInfo.bottom - imgInfo.top,
            top: imgInfo.top,
            left: imgInfo.left,
            opacity: 1,
          };
          if (layer.image && !layer.node?._children?.length) {
            page.objects.unshift(cloud as never);
          }
          clearChildsInfo();
          return { cloud, canvas: exportCanvas };
        };
        if (layer.node?._children?.length) {
          const {
            cloud: { src, left, top },
            canvas,
          } = await assignImgs();
          for (let cItem of layerData.children) {
            const region: any = {
              left: -left,
              top: top,
              height: cItem.height,
              width: cItem.width,
            };

            cItem.fillMode = 4;
            const img = await exportCanvasRegion(canvas, region);
            cItem.fill = {
              type: 'pattern',
              source: img,
              crossOrigin: 'anonymous',
              // fillMode: 4,
              offsetX: 0, // cItem.left - left,
              offsetY: 0, // cItem.top - top,
              patternTransform: null,
            };
          }
          return { continue: true };
        } else if (layer.image) {
          imgInfos.left.push(layer.left);
          imgInfos.top.push(layer.top);
          imgInfos.right.push(layer.right);
          imgInfos.bottom.push(layer.bottom);

          childImgs.push([layer, layerData]);
          await assignImgs();
          return { continue: true };
        } else {
          await assignImgs();
        }
      } else clearChildsInfo();
      return { continue: false };
    }
  };

  const findLayer = (treeIndex: any) => {
    let pTemp = treeArr;
    for (let index of treeIndex) {
      if (Array.isArray(pTemp)) {
        pTemp = pTemp[index];
      } else {
        pTemp = pTemp._children[index];
      }
    }
    return pTemp?.layer;
  };

  const process: any = async (children: any, treeIndex: any) => {
    for (let index = 0; index < children.length; index++) {
      const item = children[index] as any;
      item.id = nanoid(10)
      if (!item.visible) continue;

      if (!treeIndex) {
        item.treeIndex = [index];
      } else {
        item.treeIndex = [...treeIndex, index];
      }
      const layer = findLayer(item.treeIndex);
      let clippedImage: any = null;
      if (item.type === 'group' && Array.isArray(item.children)) {
        const gourpLayer = findLayer(item.treeIndex);
        // 无文本的组直接转为图片
        if (!isChildHasText(gourpLayer.node._children) && assignGroup) {
          const cloud = await toCloud(item, gourpLayer);
          cloud && page.objects.unshift(cloud as never);
          continue;
        }
        const prevSibling = layer?.node?.prevSibling();
        if (prevSibling?.layer?.clipped) {
          clippedImage = await clippedImg(layer, item);
        }
        await process(item.children, item.treeIndex);
        continue;
        // }
      }
      clippedImage = await clippedImg(layer, item);
      if (!layer || clippedImage.continue) continue;
      const cloud = await toCloud(item, layer);

      cloud && page.objects.unshift(cloud as never);
    }
  };
  await process(children);
  page.objects = page.objects.filter((item: any) => {
    const { src, type } = item;
    if (
      type?.toLowerCase() === 'image' &&
      src?.indexOf('data:') === 0 &&
      src.length < 21
    ) {
      return false;
    }
    return true;
  });
  page.objects.unshift({
    ...WorkSpaceDrawData,
    fillType:0,
    width: doc.width,
    height: doc.height,
    id: 'workarea',
    type: 'rect',
  });
  treeArr = null;
  return page;
}
/**
 * 从psd中获取fanric objects对象
 * @param options
 */
export const getObjectsFromPsd = async (options: any) => {
  const { file, assignGroup = false } = options || {};
  /**
   * 绘制带间距的文字
   * @param text 要绘制的文字
   * @param x 绘制的位置 x
   * @param y 绘制的位置 y
   * @param spacing 文字间距
   */

  return new Promise(async (jsonResolve) => {
    let fileName = file.name.substring(0, file.name.lastIndexOf('.'));
    // psd文件
    const url = URL.createObjectURL(file);
    let psd: any = await PSD.fromURL(url);
    // 解析psd文件
    const data = await convertPSD2Page(psd, assignGroup);
    psd = null;
    jsonResolve(data);
  });
};
