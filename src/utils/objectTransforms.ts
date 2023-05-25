import * as fabric from 'fabric';

const getDistanceFromPointToLine = (point: fabric.Point, pointLineA: fabric.Point, pointLineB: fabric.Point) => {
  const a = pointLineA.y - pointLineB.y;
  const b = pointLineB.x - pointLineA.x;
  const c = pointLineA.x * pointLineB.y - pointLineB.x * pointLineA.y;
  return Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);
};

export const saveObjectTransform = (target: any) => {
  let clippingPath;
  if (target.clippingPath instanceof fabric.Image) {
    const [tl1, tr1, br1, bl1] = target.getCoords(true, true);
    const [tl, tr, br, bl] = target.clippingPath.getCoords(true, true);

    const { width, height } = target.clippingPath;
    const widthTR = getDistanceFromPointToLine(tr1, tl, bl);
    const heightTR = getDistanceFromPointToLine(tr1, bl, br);
    const minTrScaleX = widthTR / width;
    const minTrScaleY = heightTR / height;

    const widthTl = getDistanceFromPointToLine(tl1, tr, br);
    const heightTl = getDistanceFromPointToLine(bl1, br, bl);
    const minTlScaleX = widthTl / width;
    const minTlScaleY = heightTl / height;

    const widthBR = getDistanceFromPointToLine(tr1, tl, bl);
    const heightBR = getDistanceFromPointToLine(bl1, tl, tr);
    const minBrScaleX = widthBR / width;
    const minBrScaleY = heightBR / height;

    const widthBL = getDistanceFromPointToLine(bl1, tr, br);
    const heightBL = getDistanceFromPointToLine(bl1, tl, tr);
    const minBlScaleX = widthBL / width;
    const minBlScaleY = heightBL / height;

    const widthMl = getDistanceFromPointToLine(tl1, tr, br);
    const minMlScaleX = widthMl / width;

    const widthMr = getDistanceFromPointToLine(tr1, tl, bl);
    const minMrScaleX = widthMr / width;

    clippingPath = {
      scaleFactor: target.clippingPath.scaleFactor || 1,
      scaleX: target.clippingPath.scaleX,
      scaleY: target.clippingPath.scaleY,
      left: target.clippingPath.left,
      top: target.clippingPath.top,
      center: target.clippingPath.getRelativeCenterPoint(),
      minScale: {
        tlS: {
          scaleX: minTlScaleX,
          scaleY: minTlScaleY,
        },
        blS: {
          scaleX: minBlScaleX,
          scaleY: minBlScaleY,
        },
        trS: {
          scaleX: minTrScaleX,
          scaleY: minTrScaleY,
        },
        brS: {
          scaleX: minBrScaleX,
          scaleY: minBrScaleY,
        },
        mrS: {
          scaleX: minMrScaleX,
          scaleY: Infinity,
        },
        mlS: {
          scaleX: minMlScaleX,
          scaleY: Infinity,
        },
      },
    };
  }
  return {
    scaleX: target.scaleX,
    scaleY: target.scaleY,
    originalScaleX: target.originalScaleX,
    originalScaleY: target.originalScaleY,
    skewX: target.skewX,
    skewY: target.skewY,
    angle: target.angle,
    left: target.left,
    top: target.top,
    flipX: target.flipX,
    flipY: target.flipY,
    cropX: target.cropX || 0,
    cropY: target.cropY || 0,
    clippingPath,
    fontSize: target.fontSize,
    styles: target.styles,
    width:target.width,
    height:target.height,
  };
}