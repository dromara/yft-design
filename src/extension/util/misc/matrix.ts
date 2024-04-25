import { TMat2D, Point, TDegree, XY } from "fabric"; 
import { degreesToRadians, radiansToDegrees } from './radiansDegreesConversion';
import { iMatrix } from '../../constants'
import { cos } from './cos';
import { sin } from './sin';

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

export function createRotateMatrix(
  { angle = 0 }: TRotateMatrixArgs = {},
  { x = 0, y = 0 }: Partial<XY> = {}
): TMat2D {
  const angleRadiant = degreesToRadians(angle),
    cosValue = cos(angleRadiant),
    sinValue = sin(angleRadiant);
  return [
    cosValue,
    sinValue,
    -sinValue,
    cosValue,
    x ? x - (cosValue * x - sinValue * y) : 0,
    y ? y - (sinValue * x + cosValue * y) : 0,
  ];
}

export const createScaleMatrix = (x: number, y: number = x): TMat2D => [
  x,
  0,
  0,
  y,
  0,
  0,
];

export const angleToSkew = (angle: TDegree) => Math.tan(degreesToRadians(angle));

export const createSkewXMatrix = (skewValue: TDegree): TMat2D => [
  1,
  0,
  angleToSkew(skewValue),
  1,
  0,
  0,
];

export const createSkewYMatrix = (skewValue: TDegree): TMat2D => [
  1,
  angleToSkew(skewValue),
  0,
  1,
  0,
  0,
];

export const createTranslateMatrix = (x: number, y = 0): TMat2D => [
  1,
  0,
  0,
  1,
  x,
  y,
];

export const multiplyTransformMatrixArray = (
  matrices: (TMat2D | undefined | null | false)[],
  is2x2?: boolean
) =>
  matrices.reduceRight(
    (product: TMat2D, curr) =>
      curr ? multiplyTransformMatrices(curr, product, is2x2) : product,
    iMatrix
  );