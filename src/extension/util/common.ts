import { 
  Object as FabricObject, 
  Group as OriginGroup, 
  util, 
  Point,
} from 'fabric'


export const getObjectsBoundingBox = (
  objects: FabricObject[],
  ignoreOffset?: boolean
) => {
  if (objects.length === 0) {
    return null;
  }
  const objectBounds: Point[] = [];
  objects.forEach((object) => {
    const objCenter = object.getRelativeCenterPoint();
    let sizeVector = object._getTransformedDimensions().scalarDivide(2);
    if (object.angle) {
      const rad = util.degreesToRadians(object.angle),
        sine = Math.abs(util.sin(rad)),
        cosine = Math.abs(util.cos(rad)),
        rx = sizeVector.x * cosine + sizeVector.y * sine,
        ry = sizeVector.x * sine + sizeVector.y * cosine;
      sizeVector = new Point(rx, ry);
    }
    objectBounds.push(
      objCenter.subtract(sizeVector),
      objCenter.add(sizeVector)
    );
  });
  
  const { left, top, width, height } = util.makeBoundingBoxFromPoints(objectBounds);
  const size = new Point(width, height)
  const relativeCenter = (!ignoreOffset ? new Point(left, top) : new Point()).add(size.scalarDivide(2))
  const center = relativeCenter.transform([1, 0, 0, 1, 0, 0]);

  return {
    centerX: center.x,
    centerY: center.y,
    width: size.x,
    height: size.y,
  };
}

export const convertBase64ToWebP = (options: any): any => {
  const { src, quality = 1, format = 'image/webp' } = options || {};
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx: any = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const webpBase64 = canvas.toDataURL(format, quality);
      resolve(webpBase64);
    };

    img.onerror = (error) => reject(error);
  });
};

export const getImgElementBySrc = (base64: string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    // 等待图片加载完成
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      resolve(img);
    };
  });
};

// 计算base64编码图片大小
export const getBase64ImageSize = (base64: any) => {
  if (base64) {
    base64 = base64?.split(',')[1]?.split('=')[0];
    var strLength = base64?.length;
    var fileLength = strLength - (strLength / 8) * 2;
    return Math.floor(fileLength);
  } else {
    return 0;
  }
};

export const fileToBase64 = (
  file: File
): Promise<{ status: boolean; data?: any; error?: any }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // 转换成功
    reader.onload = () => {
      resolve({
        status: true,
        data: reader.result,
      });
    };

    // 转换失败
    reader.onerror = () => {
      reject({
        status: false,
        error: reader.error,
      });
    };
  });
};

// blob 转 base64
export const blobToDataURL = (blob: any) => {
  return new Promise((resolve) => {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function (e: any) {
      resolve(e.target.result);
    };
    reader.onerror = () => {
      resolve('');
    };
  });
};