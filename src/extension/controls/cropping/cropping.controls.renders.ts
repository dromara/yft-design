import { util } from 'fabric';

const degreesToRadians = util.degreesToRadians;

// 绘制裁切control 左上，左下，右上，右下
// @ts-ignore
function renderCropCorner(ctx, left, top, styleOverride, fabricObject) {
  // @ts-ignore
  if (!this.getVisibility(fabricObject)) {
    return;
  }
  const cSize = 10;
  ctx.save();
  ctx.translate(left, top);
  // @ts-ignore
  ctx.rotate(degreesToRadians(this.angle + fabricObject.angle));
  ctx.beginPath();
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#dfe2e8';
  ctx.moveTo(0, cSize);
  ctx.lineTo(0, 0);
  ctx.lineTo(cSize, 0);
  ctx.stroke();
  ctx.restore();
}

// @ts-ignore
function renderCropMiddle(ctx, left, top, styleOverride, fabricObject) {
  // @ts-ignore
  this.visibility = true;
  // @ts-ignore
  if (!this.getVisibility(fabricObject) || fabricObject.clippingPath) {
    // we can also set visibility here to false, so is not even targetable
    // @ts-ignore
    this.visibility = false;
    return;
  }
  const cSize = 12;
  const cSizeBy2 = cSize / 2;
  ctx.save();
  ctx.translate(left, top);
  // @ts-ignore
  ctx.rotate(degreesToRadians(this.angle + fabricObject.angle));
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#dfe2e8';
  ctx.moveTo(-cSizeBy2, 0);
  ctx.lineTo(cSizeBy2, 0);
  ctx.stroke();
  ctx.restore();
}


function renderWithShadows(x: number, y: number, fn: Function) {
  // @ts-ignore
  return function (ctx, left, top, styleOverride, fabricObject) {
    ctx.save();
    ctx.shadowColor = 'rgba(12, 18, 28, 0.38)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = x;
    ctx.shadowOffsetY = y
    // @ts-ignore
    fn.call(this, ctx, left, top, styleOverride, fabricObject);
    ctx.restore();
  };
}


export {
  renderCropCorner,
  renderCropMiddle,
  renderWithShadows
}
