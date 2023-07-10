import * as fabric from 'fabric';
import { normalizePoint } from '../../controls/util';

export function fireCropImageEvent(target: fabric.Object) {
  target.canvas?.fire('object:modified', <any>{
    action: 'cropImage',
    target,
  });
}

export function calcScale(newPoint: { x: number, y: number }, height: number, width: number, flipX?: boolean, flipY?: boolean) {
  const scaleX = Math.abs(newPoint.x / width);
  const scaleY = Math.abs(newPoint.y / height);
  if (flipX || flipY) {
    return Math.max(scaleX, scaleY);
  }
  return Math.min(scaleX, scaleY);
}

/**
* Crops image dragging left to right.
* @private
* @param {Object} eventData
* @param {Number} x pointer's x coordinate
* @param {Number} y pointer's y coordinate
* @return {Boolean} true if the cropping occurred
*/
// @ts-ignore
function cropFromLeft(eventData, transform, x, y) {
  const t = transform;
  const anchorPoint = 'right';
  const { width } = t.target;
  const left = -(width / 2);
  const centerPoint = t.target.getRelativeCenterPoint();
  const newLeft = normalizePoint(t.target, new fabric.Point(x, y), 'center', 'center');
  // const newLeft = fabric.controlsUtils.getLocalPoint(transform, 'center', 'center', x, y);
  const constraint = t.target.translateToOriginPoint(centerPoint, anchorPoint, t.originY);

  let changeX = newLeft.x / t.target.scaleX - left;
  let newWidth = width - changeX;

  if ((t.target.cropX + changeX) < 0) {
    changeX = -(t.target.cropX);
    newWidth = width + t.target.cropX;
  }
  if (newWidth <= 0) {
    changeX += newWidth;
    newWidth = 0;
  }

  t.target.width = newWidth;
  t.target.setPositionByOrigin(constraint, anchorPoint, t.originY);
  t.target.cropX += changeX; // this can only be between 0 and naturalWidth;
  return true;
}

// @ts-ignore
function cropFromLeftFlig(eventData, transform, x, y) {
  const t = transform;
  const anchorPoint = 'right';
  const { width } = t.target;
  const naturalWidth = t.target.getOriginalElementWidth();
  const left = -(width / 2);
  const centerPoint = t.target.getRelativeCenterPoint();
  const newLeft = normalizePoint(t.target, new fabric.Point(x, y), 'center', 'center');
  const constraint = t.target.translateToOriginPoint(centerPoint, anchorPoint, t.originY);

  let newWidth = width - ( newLeft.x / t.target.scaleX - left);
  if (newWidth + t.target.cropX > naturalWidth) {
    newWidth = naturalWidth - t.target.cropX;
  }
  if (newWidth < 0) {
    newWidth = 0;
  }

  t.target.width = newWidth;
  t.target.setPositionByOrigin(constraint, anchorPoint, t.originY);
  return true;
}

/**
 * Crops image dragging right to left.
 * @private
 * @param {Object} eventData
 * @param {Number} x pointer's x coordinate
 * @param {Number} y pointer's y coordinate
 * @return {Boolean} true if the cropping occurred
 */
// @ts-ignore
function cropFromRight(eventData, transform, x, y) {
  const t = transform;
  const anchorPoint = 'left';
  const { width } = t.target;
  const naturalWidth = t.target.getOriginalElementWidth();
  const right = width / 2;
  const centerPoint = t.target.getRelativeCenterPoint();
  const newRight = normalizePoint(t.target, new fabric.Point(x, y), 'center', 'center');
  const constraint = t.target.translateToOriginPoint(centerPoint, anchorPoint, t.originY);

  let newWidth = width - (right - newRight.x / t.target.scaleX);

  if (newWidth + t.target.cropX > naturalWidth) {
    newWidth = naturalWidth - t.target.cropX;
  }
  if (newWidth < 0) {
    newWidth = 0;
  }
  t.target.width = newWidth;
  t.target.setPositionByOrigin(constraint, anchorPoint, t.originY);
  return true;
}

// @ts-ignore
function cropFromRightFlig(eventData, transform, x, y) {
  const t = transform;
  const anchorPoint = 'left';
  const { width } = t.target;
  const right = width / 2;
  const centerPoint = t.target.getRelativeCenterPoint();
  // const newRight = normalizePoint(t.target, new fabric.Point(x, y), 'center', 'center');
  const newRight = fabric.controlsUtils.getLocalPoint(transform, 'center', 'center', x, y);
  const constraint = t.target.translateToOriginPoint(centerPoint, anchorPoint, t.originY);

  let changeX = right - newRight.x / t.target.scaleX;
  let newWidth = width - changeX;

  if ((t.target.cropX + changeX) < 0) {
    changeX = -(t.target.cropX);
    newWidth = width + t.target.cropX;
  }
  if (newWidth <= 0) {
    changeX += newWidth;
    newWidth = 0;
  }
  t.target.width = newWidth;
  t.target.setPositionByOrigin(constraint, anchorPoint, t.originY);
  t.target.cropX += changeX; // this can only be between 0 and naturalWidth;
  return true;
}

/**
 * Crops image dragging top to bottom.
 * @private
 * @param {Object} eventData
 * @param {Number} x pointer's x coordinate
 * @param {Number} y pointer's y coordinate
 * @return {Boolean} true if the scaling occurred
 */
// @ts-ignore
function cropFromTop(eventData, transform, x, y) {
  const t = transform;
  const anchorPoint = 'bottom';
  const { height } = t.target;
  const top = -(height / 2);
  const centerPoint = t.target.getRelativeCenterPoint();
  // const newTop = normalizePoint(t.target, new fabric.Point(x, y), 'center', 'center');
  const newTop = fabric.controlsUtils.getLocalPoint(transform, 'center', 'center', x, y);
  const constraint = t.target.translateToOriginPoint(centerPoint, t.originX, anchorPoint);

  let changeY = newTop.y / t.target.scaleY - top;
  let newHeight = height - changeY;

  if ((t.target.cropY + changeY) < 0) {
    changeY = -(t.target.cropY);
    newHeight = height + t.target.cropY;
  }
  if (newHeight <= 0) {
    changeY += newHeight;
    newHeight = 0;
  }
  t.target.height = newHeight;
  t.target.setPositionByOrigin(constraint, t.originX, anchorPoint);
  t.target.cropY += changeY;
  return true;
}

// @ts-ignore
function cropFromTopFlig(eventData, transform, x, y) {
  const t = transform;
  const anchorPoint = 'bottom';
  const { height } = t.target;
  const naturalHeight = t.target.getOriginalElementHeight();
  const top = -(height / 2);
  const centerPoint = t.target.getRelativeCenterPoint();
  // const newTop = normalizePoint(t.target, new fabric.Point(x, y), 'center', 'center');
  const newTop = fabric.controlsUtils.getLocalPoint(transform, 'center', 'center', x, y);
  const constraint = t.target.translateToOriginPoint(centerPoint, t.originX, anchorPoint);

  let newHeight = height - (newTop.y / t.target.scaleY - top);
  if (newHeight + t.target.cropY > naturalHeight) {
    newHeight = naturalHeight - t.target.cropY;
  }
  if (newHeight < 0) {
    newHeight = 0;
  }
  t.target.height = newHeight;
  t.target.setPositionByOrigin(constraint, t.originX, anchorPoint);
  return true;
}

/**
 * Crops image dragging bottom to top.
 * @private
 * @param {Object} eventData
 * @param {Number} x pointer's x coordinate
 * @param {Number} y pointer's y coordinate
 * @return {Boolean} true if the scaling occurred
 */
// @ts-ignore
function cropFromBottom(eventData, transform, x, y) {
  const t = transform;
  const anchorPoint = 'top';
  const { height } = t.target;
  const naturalHeight = t.target.getOriginalElementHeight();
  const bottom = height / 2;
  const centerPoint = t.target.getRelativeCenterPoint();
  // const newBottom = normalizePoint(t.target, new fabric.Point(x, y), 'center', 'center');
  const newBottom = fabric.controlsUtils.getLocalPoint(transform, 'center', 'center', x, y);
  const constraint = t.target.translateToOriginPoint(centerPoint, t.originX, anchorPoint);

  let newHeight = height - (bottom - newBottom.y / t.target.scaleY);

  if (newHeight + t.target.cropY > naturalHeight) {
    newHeight = naturalHeight - t.target.cropY;
  }
  if (newHeight < 0) {
    newHeight = 0;
  }

  t.target.height = newHeight;
  t.target.setPositionByOrigin(constraint, t.originX, anchorPoint);
  return true;
}

// @ts-ignore
function cropFromBottomFlig(eventData, transform, x, y) {
  const t = transform;
  const anchorPoint = 'top';
  const { height } = t.target;
  const bottom = height / 2;
  const centerPoint = t.target.getRelativeCenterPoint();
  // const newBottom = normalizePoint(t.target, new fabric.Point(x, y), 'center', 'center');
  const newBottom = fabric.controlsUtils.getLocalPoint(transform, 'center', 'center', x, y);
  const constraint = t.target.translateToOriginPoint(centerPoint, t.originX, anchorPoint);

  let changeY = bottom - newBottom.y / t.target.scaleY
  let newHeight = height - changeY;

  if ((t.target.cropY + changeY) < 0) {
    changeY = -(t.target.cropY);
    newHeight = height + t.target.cropY;
  }
  if (newHeight <= 0) {
    changeY += newHeight;
    newHeight = 0;
  }

  t.target.height = newHeight;
  t.target.setPositionByOrigin(constraint, t.originX, anchorPoint);
  t.target.cropY += changeY;
  return true;
}

// @ts-ignore
const withReadapatingTheShape = (handler) => (eventData, transform, x, y) => {
  const returned = handler(eventData, transform, x, y);
  return returned;
};

// @ts-ignore
const cropFromTopLeft = withReadapatingTheShape((eventData, transform, x, y) => {
  const { target } =  transform;
  const left = target.flipX ?  cropFromLeftFlig(eventData, transform, x, y) : cropFromLeft(eventData, transform, x, y);
  const top = target.flipY ? cropFromTopFlig(eventData, transform, x, y) : cropFromTop(eventData, transform, x, y);
  return left || top;
});

// @ts-ignore
const cropFromBottomRight = withReadapatingTheShape((eventData, transform, x, y) => {
  const { target } =  transform;
  const right = target.flipX ? cropFromRightFlig(eventData, transform, x, y) : cropFromRight(eventData, transform, x, y);
  const bottom = target.flipY ? cropFromBottomFlig(eventData, transform, x, y) : cropFromBottom(eventData, transform, x, y);
  return right || bottom;
});

// @ts-ignore
const cropFromBottomLeft = withReadapatingTheShape((eventData, transform, x, y) => {
  const { target } =  transform;
  const left = target.flipX ? cropFromLeftFlig(eventData, transform, x, y) : cropFromLeft(eventData, transform, x, y);
  const bottom = target.flipY ? cropFromBottomFlig(eventData, transform, x, y) : cropFromBottom(eventData, transform, x, y);
  return left || bottom;
});

// @ts-ignore
const cropFromTopRight = withReadapatingTheShape((eventData, transform, x, y) => {
  const { target } =  transform;
  const right = target.flipX ? cropFromRightFlig(eventData, transform, x, y) : cropFromRight(eventData, transform, x, y);
  const top = target.flipY ? cropFromTopFlig(eventData, transform, x, y) : cropFromTop(eventData, transform, x, y);
  return right || top;
});

// @ts-ignore
function imageCornerTL(dim, finalMatrix, fabricObject /* currentControl */) {
  const matrix = fabricObject.calcTransformMatrix();
  const vpt = fabricObject.getViewportTransform();
  const _finalMatrix = fabric.util.multiplyTransformMatrices(vpt, matrix);
  const point = {
    x: (-fabricObject.width / 2 - fabricObject.cropX),
    y: (-fabricObject.height / 2 - fabricObject.cropY),
  }
  return fabric.util.transformPoint(point, _finalMatrix);
}

// @ts-ignore
function imageCornerTR(dim, finalMatrix, fabricObject /* currentControl */) {
  const matrix = fabricObject.calcTransformMatrix();
  const vpt = fabricObject.getViewportTransform();
  const _finalMatrix = fabric.util.multiplyTransformMatrices(vpt, matrix);
  const fullWidth = fabricObject.getOriginalElementWidth();
  const point = {
    x: (fullWidth - fabricObject.width / 2 - fabricObject.cropX),
    y: (-fabricObject.height / 2 - fabricObject.cropY),
  }
  return fabric.util.transformPoint(point, _finalMatrix);
}

// @ts-ignore
function imageCornerBR(dim, finalMatrix, fabricObject /* currentControl */) {
  const matrix = fabricObject.calcTransformMatrix();
  const vpt = fabricObject.getViewportTransform();
  const _finalMatrix = fabric.util.multiplyTransformMatrices(vpt, matrix);
  const fullWidth = fabricObject.getOriginalElementWidth();
  const fullHeight = fabricObject.getOriginalElementHeight();
  const point = {
    x: (fullWidth - fabricObject.width / 2 - fabricObject.cropX),
    y: (fullHeight - fabricObject.height / 2 - fabricObject.cropY),
  }
  return fabric.util.transformPoint(point, _finalMatrix);
}

// @ts-ignore
function imageCornerBL(dim, finalMatrix, fabricObject /* currentControl */) {
  const matrix = fabricObject.calcTransformMatrix();
  const vpt = fabricObject.getViewportTransform();
  const _finalMatrix = fabric.util.multiplyTransformMatrices(vpt, matrix);
  const fullHeight = fabricObject.getOriginalElementHeight();
  const point = {
    x: (-fabricObject.width / 2 - fabricObject.cropX),
    y: (fullHeight - fabricObject.height / 2 - fabricObject.cropY),
  }
  // @ts-ignore
  return fabric.util.transformPoint(point, _finalMatrix);
}

// @ts-ignore
function scaleEquallyCropTR(eventData, transform, x, y) {
  const { target } = transform;
  const fullWidth = target.getOriginalElementWidth();
  const fullHeight = target.getOriginalElementHeight();
  const remainderY = fullHeight - target.height - target.cropY;
  const anchorOriginX = target.cropX / target.width;
  const anchorOriginY = remainderY / target.height;
  const centerPoint = target.getRelativeCenterPoint();
  const constraint = target.translateToOriginPoint(centerPoint, -anchorOriginX, 1 + anchorOriginY);
  // const newPoint = normalizePoint(target, new fabric.Point(x, y), -anchorOriginX, 1 + anchorOriginY);
  const newPoint = fabric.controlsUtils.getLocalPoint(transform, -anchorOriginX, 1 + anchorOriginY, x, y);
  const oldScaleX = target.scaleX;
  const oldScaleY = target.scaleY;
  const scale = calcScale(newPoint, fullHeight, fullWidth, target.flipX, target.flipY);
  const scaleChangeX = scale / oldScaleX;
  const scaleChangeY = scale / oldScaleY;
  const newWidth = target.width / scaleChangeX;
  const newHeight = target.height / scaleChangeY;
  const newRemainderY = remainderY / scaleChangeY;
  const newCropX = target.cropX / scaleChangeX;
  const newCropY = fullHeight - newHeight - newRemainderY;

  if (newCropX + newWidth > fullWidth || newRemainderY + newHeight > fullHeight) {
    return false;
  }
  target.scaleX = scale;
  target.scaleY = scale;
  target.height = newHeight;
  target.width = newWidth;
  target.cropX = newCropX;
  target.cropY = newCropY;
  if (target.clippingPath) {
    target.clippingPath.scaleX /= scaleChangeX;
    target.clippingPath.scaleY /= scaleChangeY;
  }
  const newExtraAnchorY = newRemainderY / target.height;
  const newExtraAnchorX = target.cropX / target.width;
  target.setPositionByOrigin(constraint, -newExtraAnchorX, 1 + newExtraAnchorY);

  return true;
}

// @ts-ignore
function scaleEquallyCropTRFlig(eventData, transform, x, y) {
  const { target } = transform;
  const fullWidth = target.getOriginalElementWidth();
  const fullHeight = target.getOriginalElementHeight();
  const remainderX = fullWidth - target.width - target.cropX;
  const anchorOriginX = remainderX / target.width;
  const anchorOriginY = target.cropY / target.height;
  const centerPoint = target.getRelativeCenterPoint();
  const constraint = target.translateToOriginPoint(centerPoint, -anchorOriginX, 1 + anchorOriginY);
  // const newPoint = normalizePoint(target, new fabric.Point(x, y), -anchorOriginX, 1 + anchorOriginY);
  const newPoint = fabric.controlsUtils.getLocalPoint(transform, -anchorOriginX, 1 + anchorOriginY, x, y);
  const oldScaleX = target.scaleX;
  const oldScaleY = target.scaleY;
  const scale = calcScale(newPoint, fullHeight, fullWidth, target.flipX, target.flipY);
  const scaleChangeX = scale / oldScaleX;
  const scaleChangeY = scale / oldScaleY;
  const newWidth = target.width / scaleChangeX;
  const newHeight = target.height / scaleChangeY;
  const scaledRemainderX = remainderX / scaleChangeX;
  const newCropX = fullWidth - newWidth - scaledRemainderX;
  const newCropY = target.cropY / scaleChangeY;

  if (newWidth + remainderX > fullWidth || newHeight + newCropY > fullHeight) {
    return false;
  }

  target.scaleX = scale;
  target.scaleY = scale;
  target.height = newHeight;
  target.width = newWidth;
  target.cropX = newCropX;
  target.cropY = newCropY;
  if (target.clippingPath) {
    target.clippingPath.scaleX /= scaleChangeX;
    target.clippingPath.scaleY /= scaleChangeY;
  }
  const newAnchorOriginX = scaledRemainderX / newWidth;
  const newAnchorOriginY = newCropY / newHeight;

  target.setPositionByOrigin(constraint, -newAnchorOriginX, 1 + newAnchorOriginY);
  return true;
}

// @ts-ignore
function scaleEquallyCropBR(eventData, transform, x, y) {
  const { target } = transform;
  const fullWidth = target.getOriginalElementWidth();
  const fullHeight = target.getOriginalElementHeight();
  const extraOriginX = target.cropX / target.width;
  const extraOriginY = target.cropY / target.height;
  const centerPoint = target.getRelativeCenterPoint();
  const constraint = target.translateToOriginPoint(centerPoint, -extraOriginX, -extraOriginY);
  // const newPoint = normalizePoint(target, new fabric.Point(x, y), -extraOriginX, -extraOriginY);
  const newPoint = fabric.controlsUtils.getLocalPoint(transform, -extraOriginX, -extraOriginY, x, y);
  const oldScaleX = target.scaleX;
  const oldScaleY = target.scaleY;
  const scale = calcScale(newPoint, fullHeight, fullWidth, target.flipX, target.flipY);
  const scaleChangeX = scale / oldScaleX;
  const scaleChangeY = scale / oldScaleY;
  const newWidth = target.width / scaleChangeX;
  const newHeight = target.height / scaleChangeY;
  const newCropX = target.cropX / scaleChangeX;
  const newCropY = target.cropY / scaleChangeY;

  if (newCropX + newWidth > fullWidth || newCropY + newHeight > fullHeight) {
    return false;
  }

  target.scaleX = scale;
  target.scaleY = scale;

  target.height = newHeight;
  target.width = newWidth;
  target.cropX = newCropX;
  target.cropY = newCropY;
  if (target.clippingPath) {
    target.clippingPath.scaleX /= scaleChangeX;
    target.clippingPath.scaleY /= scaleChangeY;
  }
  const newExtraOriginX = target.cropX / target.width;
  const newExtraOriginY = target.cropY / target.height;
  target.setPositionByOrigin(constraint, -newExtraOriginX, -newExtraOriginY);
  return true;
}

// @ts-ignore
function scaleEquallyCropBRFlig(eventData, transform, x, y) {
  const { target } = transform;
  const fullWidth = target.getOriginalElementWidth();
  const fullHeight = target.getOriginalElementHeight();
  const remainderX = fullWidth - target.width - target.cropX;
  const remainderY = fullHeight - target.height - target.cropY;
  const anchorOriginX = remainderX / target.width;
  const anchorOriginY = remainderY / target.height;
  const centerPoint = target.getRelativeCenterPoint();
  const constraint = target.translateToOriginPoint(centerPoint, -anchorOriginX, -anchorOriginY);
  // const newPoint = normalizePoint(target, new fabric.Point(x, y), -anchorOriginX, -anchorOriginY);
  const newPoint = fabric.controlsUtils.getLocalPoint(transform, -anchorOriginX, -anchorOriginY, x, y);
  const scale = calcScale(newPoint, fullHeight, fullWidth, target.flipX, target.flipY);
  const oldScaleX = target.scaleX;
  const oldScaleY = target.scaleY;
  const scaleChangeX = scale / oldScaleX;
  const scaleChangeY = scale / oldScaleY;
  const scaledRemainderX = remainderX / scaleChangeX;
  const scaledRemainderY = remainderY / scaleChangeY;
  const newWidth = target.width / scaleChangeX;
  const newHeight = target.height / scaleChangeY;
  const newCropX = fullWidth - newWidth - scaledRemainderX;
  const newCropY = fullHeight - newHeight - scaledRemainderY;

  if (newWidth + scaledRemainderX > fullWidth || newHeight + scaledRemainderY > fullHeight) {
    return false;
  }

  target.scaleX = scale;
  target.scaleY = scale;
  target.width = newWidth;
  target.height = newHeight;
  target.cropX = newCropX;
  target.cropY = newCropY;
  if (target.clippingPath) {
    target.clippingPath.scaleX /= scaleChangeX;
    target.clippingPath.scaleY /= scaleChangeY;
  }
  const newAnchorOriginX = scaledRemainderX / newWidth;
  const newAnchorOriginY = scaledRemainderY / newHeight;
  target.setPositionByOrigin(constraint, -newAnchorOriginX, -newAnchorOriginY);
  return true;
}

// @ts-ignore
function scaleEquallyCropBL(eventData, transform, x, y) {
  const { target } = transform;
  const fullWidth = target.getOriginalElementWidth();
  const fullHeight = target.getOriginalElementHeight();
  const remainderX = fullWidth - target.width - target.cropX;
  const anchorOriginX = remainderX / target.width;
  const anchorOriginY = target.cropY / target.height;
  const centerPoint = target.getRelativeCenterPoint();
  const constraint = target.translateToOriginPoint(centerPoint, 1 + anchorOriginX, -anchorOriginY);
  // const newPoint = normalizePoint(target, new fabric.Point(x, y), 1 + anchorOriginX, -anchorOriginY);
  const newPoint = fabric.controlsUtils.getLocalPoint(transform, 1 + anchorOriginX, -anchorOriginY, x, y);
  const oldScaleX = target.scaleX;
  const oldScaleY = target.scaleY;
  const scale = calcScale(newPoint, fullHeight, fullWidth, target.flipX, target.flipY);
  const scaleChangeX = scale / oldScaleX;
  const scaleChangeY = scale / oldScaleY;
  const newWidth = target.width / scaleChangeX;
  const newHeight = target.height / scaleChangeY;
  const scaledRemainderX = remainderX / scaleChangeX;
  const newCropX = fullWidth - newWidth - scaledRemainderX;
  const newCropY = target.cropY / scaleChangeY;

  if (newWidth + remainderX > fullWidth || newHeight + newCropY > fullHeight) {
    return false;
  }

  target.scaleX = scale;
  target.scaleY = scale;
  target.height = newHeight;
  target.width = newWidth;
  target.cropX = newCropX;
  target.cropY = newCropY;
  if (target.clippingPath) {
    target.clippingPath.scaleX /= scaleChangeX;
    target.clippingPath.scaleY /= scaleChangeY;
  }
  const newAnchorOriginX = scaledRemainderX / newWidth;
  const newAnchorOriginY = newCropY / newHeight;

  target.setPositionByOrigin(constraint, 1 + newAnchorOriginX, -newAnchorOriginY);
  return true;
}

// @ts-ignore
function scaleEquallyCropBLFlig(eventData, transform, x, y) {
  const { target } = transform;
  const fullWidth = target.getOriginalElementWidth();
  const fullHeight = target.getOriginalElementHeight();
  const remainderY = fullHeight - target.height - target.cropY;
  const anchorOriginX = target.cropX / target.width;
  const anchorOriginY = remainderY / target.height;
  const centerPoint = target.getRelativeCenterPoint();
  const constraint = target.translateToOriginPoint(centerPoint, 1 + anchorOriginX, -anchorOriginY);
  // const newPoint = normalizePoint(target, new fabric.Point(x, y), 1 + anchorOriginX, -anchorOriginY);
  const newPoint = fabric.controlsUtils.getLocalPoint(transform, 1 + anchorOriginX, -anchorOriginY, x, y);
  const oldScaleX = target.scaleX;
  const oldScaleY = target.scaleY;
  const scale = calcScale(newPoint, fullHeight, fullWidth, target.flipX, target.flipY);
  const scaleChangeX = scale / oldScaleX;
  const scaleChangeY = scale / oldScaleY;
  const newWidth = target.width / scaleChangeX;
  const newHeight = target.height / scaleChangeY;
  const newRemainderY = remainderY / scaleChangeY;
  const newCropX = target.cropX / scaleChangeX;
  const newCropY = fullHeight - newHeight - newRemainderY;

  if (newCropX + newWidth > fullWidth || newRemainderY + newHeight > fullHeight) {
    return false;
  }
  target.scaleX = scale;
  target.scaleY = scale;
  target.height = newHeight;
  target.width = newWidth;
  target.cropX = newCropX;
  target.cropY = newCropY;
  if (target.clippingPath) {
    target.clippingPath.scaleX /= scaleChangeX;
    target.clippingPath.scaleY /= scaleChangeY;
  }
  const newExtraAnchorY = newRemainderY / target.height;
  const newExtraAnchorX = target.cropX / target.width;
  target.setPositionByOrigin(constraint, 1 + newExtraAnchorX, -newExtraAnchorY);

  return true;
}

// @ts-ignore
function scaleEquallyCropTL(eventData, transform, x, y) {
  const { target } = transform;
  const fullWidth = target.getOriginalElementWidth();
  const fullHeight = target.getOriginalElementHeight();
  const remainderX = fullWidth - target.width - target.cropX;
  const remainderY = fullHeight - target.height - target.cropY;
  const anchorOriginX = 1 + (remainderX / target.width);
  const anchorOriginY = 1 + (remainderY / target.height);
  const centerPoint = target.getRelativeCenterPoint();
  const constraint = target.translateToOriginPoint(centerPoint, anchorOriginX, anchorOriginY);
  // const newPoint = normalizePoint(target, new fabric.Point(x, y), anchorOriginX, anchorOriginY);
  const newPoint = fabric.controlsUtils.getLocalPoint(transform, anchorOriginX, anchorOriginY, x, y);
  const scale = calcScale(newPoint, fullHeight, fullWidth, target.flipX, target.flipY);
  const oldScaleX = target.scaleX;
  const oldScaleY = target.scaleY;
  const scaleChangeX = scale / oldScaleX;
  const scaleChangeY = scale / oldScaleY;
  const scaledRemainderX = remainderX / scaleChangeX;
  const scaledRemainderY = remainderY / scaleChangeY;
  const newWidth = target.width / scaleChangeX;
  const newHeight = target.height / scaleChangeY;
  const newCropX = fullWidth - newWidth - scaledRemainderX;
  const newCropY = fullHeight - newHeight - scaledRemainderY;

  if (newWidth + scaledRemainderX > fullWidth || newHeight + scaledRemainderY > fullHeight) {
    return false;
  }

  target.scaleX = scale;
  target.scaleY = scale;
  target.width = newWidth;
  target.height = newHeight;
  target.cropX = newCropX;
  target.cropY = newCropY;
  if (target.clippingPath) {
    target.clippingPath.scaleX /= scaleChangeX;
    target.clippingPath.scaleY /= scaleChangeY;
  }
  const newAnchorOriginX = 1 + (scaledRemainderX / newWidth);
  const newAnchorOriginY = 1 + (scaledRemainderY / newHeight);
  target.setPositionByOrigin(constraint, newAnchorOriginX, newAnchorOriginY);
  console.log(target, 'target');
  return true;
}

// @ts-ignore
function scaleEquallyCropTLFlig(eventData, transform, x, y) {
  const { target } = transform;
  const fullWidth = target.getOriginalElementWidth();
  const fullHeight = target.getOriginalElementHeight();
  const extraOriginX = 1 + (target.cropX / target.width);
  const extraOriginY = 1 + (target.cropY / target.height);
  const centerPoint = target.getRelativeCenterPoint();
  const constraint = target.translateToOriginPoint(centerPoint, extraOriginX, extraOriginY);
  // const newPoint = normalizePoint(target, new fabric.Point(x, y), extraOriginX, extraOriginY);
  const newPoint = fabric.controlsUtils.getLocalPoint(transform, extraOriginX, extraOriginY, x, y);
  const oldScaleX = target.scaleX;
  const oldScaleY = target.scaleY;
  const scale = calcScale(newPoint, fullHeight, fullWidth, target.flipX, target.flipY);
  const scaleChangeX = scale / oldScaleX;
  const scaleChangeY = scale / oldScaleY;
  const newWidth = target.width / scaleChangeX;
  const newHeight = target.height / scaleChangeY;
  const newCropX = target.cropX / scaleChangeX;
  const newCropY = target.cropY / scaleChangeY;

  if (newCropX + newWidth > fullWidth || newCropY + newHeight > fullHeight) {
    return false;
  }

  target.scaleX = scale;
  target.scaleY = scale;

  target.height = newHeight;
  target.width = newWidth;
  target.cropX = newCropX;
  target.cropY = newCropY;
  if (target.clippingPath) {
    target.clippingPath.scaleX /= scaleChangeX;
    target.clippingPath.scaleY /= scaleChangeY;
  }
  const newExtraOriginX = 1 + (target.cropX / target.width);
  const newExtraOriginY = 1 + (target.cropY / target.height);
  target.setPositionByOrigin(constraint, newExtraOriginX, newExtraOriginY);
  return true;
}

export {
  cropFromTopRight,
  cropFromBottomLeft,
  cropFromBottomRight,
  cropFromTopLeft,
  cropFromLeft,
  cropFromLeftFlig,
  cropFromRight,
  cropFromRightFlig,
  cropFromTop,
  cropFromTopFlig,
  cropFromBottom,
  cropFromBottomFlig,
  imageCornerTL,
  imageCornerBR,
  imageCornerBL,
  imageCornerTR,
  scaleEquallyCropTR,
  scaleEquallyCropBR,
  scaleEquallyCropBL,
  scaleEquallyCropTL,
  scaleEquallyCropTLFlig,
  scaleEquallyCropBRFlig,
  scaleEquallyCropTRFlig,
  scaleEquallyCropBLFlig,
};
