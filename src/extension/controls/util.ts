import  * as fabric from 'fabric';
import type { Object as FabricObject, Point, Transform, TPointerEvent } from 'fabric';
import { TOriginX, TOriginY } from '@/types/typedefs';
import { resolveOrigin } from '@/utils/resolveOrigin';

export const getActionFromCorner = (alreadySelected: boolean, corner: string, e: TPointerEvent, target: FabricObject) => {
  if (!corner || !alreadySelected) return 'drag';
  const control = target.controls[corner];
  return control.getActionName(e, control, target);
};

export function isTransformCentered(transform: Transform) {
  return transform.originX === 'center' && transform.originY === 'center';
}

export function invertOrigin(origin: TOriginX | TOriginY) {
  return -resolveOrigin(origin) + 0.5;
}

export const isLocked = (
  target: FabricObject,
  lockingKey:
    | 'lockMovementX'
    | 'lockMovementY'
    | 'lockRotation'
    | 'lockScalingX'
    | 'lockScalingY'
    | 'lockSkewingX'
    | 'lockSkewingY'
    | 'lockScalingFlip'
) => target[lockingKey];

export function normalizePoint(target: FabricObject, point: Point, originX: TOriginX, originY: TOriginY,): Point {
  const center = target.getRelativeCenterPoint(),
    p = typeof originX !== 'undefined' && typeof originY !== 'undefined' 
    ? target.translateToGivenOrigin(center,'center','center', originX,originY) 
    : new fabric.Point(target.left, target.top),
    p2 = target.angle 
    ? point.rotate(-fabric.util.degreesToRadians(target.angle), center) 
    : point;
  return p2.subtract(p);
}