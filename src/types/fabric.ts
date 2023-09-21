import type { Control } from 'fabric'
import { PiBy180 } from '@/utils/common'

interface NominalTag<T> {
  nominalTag?: T;
}

type Nominal<Type, Tag> = NominalTag<Tag> & Type;

const enum Degree {}
const enum Radian {}

export type TDegree = Nominal<number, Degree>;
export type TRadian = Nominal<number, Radian>;

export type TControlSet = Record<string, Control>

export type TOriginX = 'center' | 'left' | 'right' | number;
export type TOriginY = 'center' | 'top' | 'bottom' | number;

export type TPointerEvent = MouseEvent | TouchEvent | PointerEvent;
export const degreesToRadians = (degrees: TDegree): TRadian =>(degrees * PiBy180) as TRadian;

export type TransformAction<T extends Transform = Transform, R = void> = (
  eventData: TPointerEvent,
  transform: T,
  x: number,
  y: number
) => R;

export type TransformActionHandler<T extends Transform = Transform> = TransformAction<T, boolean>;


export const saveObjectTransform = (target: any) => ({
  scaleX: target.scaleX,
  scaleY: target.scaleY,
  skewX: target.skewX,
  skewY: target.skewY,
  angle: target.angle,
  left: target.left,
  flipX: target.flipX,
  flipY: target.flipY,
  top: target.top,
});

export type Transform = {
  target: any;
  action: string;
  actionHandler?: TransformActionHandler;
  corner: string | 0;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  offsetX: number;
  offsetY: number;
  originX: TOriginX;
  originY: TOriginY;
  ex: number;
  ey: number;
  lastX: number;
  lastY: number;
  theta: TRadian;
  width: number;
  height: number;
  shiftKey: boolean;
  altKey: boolean;
  original: ReturnType<typeof saveObjectTransform> & {
    originX: TOriginX;
    originY: TOriginY;
  };
  actionPerformed: boolean;
};