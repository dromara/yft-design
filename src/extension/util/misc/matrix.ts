import { TMat2D, Point, TDegree } from "fabric"; 
import { degreesToRadians, radiansToDegrees } from './radiansDegreesConversion';

export type TTranslateMatrixArgs = {
  translateX?: number;
  translateY?: number;
};

export type TRotateMatrixArgs = {
  angle?: TDegree;
};

export type TScaleMatrixArgs = {
  scaleX?: number;
  scaleY?: number;
  flipX?: boolean;
  flipY?: boolean;
  skewX?: TDegree;
  skewY?: TDegree;
};

export type TComposeMatrixArgs = TTranslateMatrixArgs &
  TRotateMatrixArgs &
  TScaleMatrixArgs;

export type TQrDecomposeOut = Required<
  Omit<TComposeMatrixArgs, 'flipX' | 'flipY'>
>;

export const invertTransform = (t: TMat2D): TMat2D => {
  const a = 1 / (t[0] * t[3] - t[1] * t[2]),
    r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0] as TMat2D,
    { x, y } = new Point(t[4], t[5]).transform(r, true);
  r[4] = -x;
  r[5] = -y;
  return r;
};

export const multiplyTransformMatrices = (
  a: TMat2D,
  b: TMat2D,
  is2x2?: boolean
): TMat2D =>
  [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4],
    is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5],
  ] as TMat2D;


  export const qrDecompose = (a: TMat2D): TQrDecomposeOut => {
    const angle = Math.atan2(a[1], a[0]),
      denom = Math.pow(a[0], 2) + Math.pow(a[1], 2),
      scaleX = Math.sqrt(denom),
      scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX,
      skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom);
    return {
      angle: radiansToDegrees(angle),
      scaleX,
      scaleY,
      skewX: radiansToDegrees(skewX),
      skewY: 0 as TDegree,
      translateX: a[4] || 0,
      translateY: a[5] || 0,
    };
  };