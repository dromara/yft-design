import * as fabric from 'fabric'
import { AngleRect } from '@/types/elements'
import { CanvasElement } from '@/types/canvas'

export function drawCircleIcon(ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: any) {
  ctx.save()
  ctx.translate(left, top)
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
  ctx.beginPath()
  ctx.lineCap = 'round'
  ctx.lineWidth = 3
  ctx.shadowBlur = 2
  ctx.shadowColor = 'black'
  ctx.arc(0, 0, 5.5, 0, 2 * Math.PI)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.restore()
}

export function drawVerticalLeftLineIcon(ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: any) {
  const size = 28
  ctx.save()
  ctx.translate(left, top)
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
  ctx.beginPath()
  ctx.lineCap = 'round'
  ctx.lineWidth = 3
  ctx.shadowBlur = 2
  ctx.shadowColor = 'black'
  ctx.moveTo(-0.5, -size / 4)
  ctx.lineTo(-0.5, -size / 4 + size / 2)
  ctx.strokeStyle = '#ffffff'
  ctx.stroke()
  ctx.restore()
}

export function drawVerticalRightLineIcon(ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: any) {
  const size = 28
  ctx.save()
  ctx.translate(left, top)
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
  ctx.beginPath()
  ctx.lineCap = 'round'
  ctx.lineWidth = 3
  ctx.shadowBlur = 2
  ctx.shadowColor = 'black'
  ctx.moveTo(0.5, -size / 4)
  ctx.lineTo(0.5, -size / 4 + size / 2)
  ctx.strokeStyle = '#ffffff'
  ctx.stroke()
  ctx.restore()
}

export function drawHorizontalLineIcon(ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: any) {
  const size = 28
  ctx.save()
  ctx.translate(left, top)
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
  ctx.beginPath()
  ctx.lineCap = 'round'
  ctx.lineWidth = 3
  ctx.shadowBlur = 2
  ctx.shadowColor = 'black'
  ctx.moveTo(-size / 4, -0.5)
  ctx.lineTo(-size / 4 + size / 2, -0.5)
  ctx.strokeStyle = '#ffffff'
  ctx.stroke()
  ctx.restore()
}

export function drawRotateIcon(ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: any) {
  const radius = 6
  const lineWidth = radius / 3
  const arrowWidth = radius / 2
  const center = {
    x: left,
    y: top
  }
  const arrow1 = {
    startAngle: (1 / 2) * Math.PI + 0.6,
    endAngle: (3 / 2) * Math.PI
  }

  const arrow2 = {
    startAngle: (3 / 2) * Math.PI + 0.6,
    endAngle: (1 / 2) * Math.PI
  }
  function draw(startAngle: number, endAngle: number) {
    ctx.beginPath()
    ctx.shadowBlur = 0

    ctx.arc(center.x, center.y, radius, startAngle, endAngle)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = '#000000'
    ctx.stroke()

    ctx.beginPath()
    const arrowTop = getPointOnCircle(center as fabric.Point, radius, endAngle + 0.4)

    ctx.moveTo(arrowTop.x, arrowTop.y)

    const arrowLeft = getPointOnCircle(center as fabric.Point, radius - arrowWidth, endAngle)
    ctx.lineTo(arrowLeft.x, arrowLeft.y)

    const arrowRight = getPointOnCircle(center as fabric.Point, radius + arrowWidth, endAngle)
    ctx.lineTo(arrowRight.x, arrowRight.y)
    ctx.fillStyle = '#000000'

    ctx.closePath()
    ctx.fill()
  }

  function getPointOnCircle(center: fabric.Point , radius: number, angle: number) {
    const pX = center.x + Math.cos(angle) * radius
    const pY = center.y + Math.sin(angle) * radius
    return { x: pX, y: pY }
  }

  ctx.save()
  ctx.translate(0, 0)

  ctx.beginPath()
  ctx.arc(center.x, center.y, radius + 6, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.shadowBlur = 2
  ctx.shadowColor = 'black'
  ctx.fill()
  ctx.closePath()
  draw(arrow1.startAngle, arrow1.endAngle)
  draw(arrow2.startAngle, arrow2.endAngle)
  ctx.restore()
}

export function drawAngleIcon(ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: fabric.Object) {
  if (!(fabricObject as CanvasElement).isRotate) return
  const center = {x: left, y: top, w: 40, h: 30}
  const angle = fabricObject.angle.toFixed(0)
  const Point = function(x: number, y: number) {
    return {x:x, y:y}
  }
  function drawRoundedRect(rect: AngleRect, r: number, ctx: CanvasRenderingContext2D) {
    const ptA = Point(rect.x + r, rect.y);
    const ptB = Point(rect.x + rect.w, rect.y);
    const ptC = Point(rect.x + rect.w, rect.y + rect.h);
    const ptD = Point(rect.x, rect.y + rect.h);
    const ptE = Point(rect.x, rect.y);
    
    ctx.beginPath();
    
    ctx.moveTo(ptA.x, ptA.y);
    ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
    ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
    ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
    ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

    ctx.stroke();
  }
  const centerLeft = center.x - center.w / 2, centerTop = center.y - center.h / 2
  const rect = {x: centerLeft, y: centerTop, w: center.w, h: center.h}

  ctx.save()
  ctx.translate(0, 0)

  ctx.beginPath()
  drawRoundedRect(rect, 5, ctx)
  
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#409eff'
  ctx.shadowBlur = 2
  ctx.shadowColor = 'black'
  ctx.fill()
  ctx.font = '13px sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(angle + '°', center.x, center.y)
  
  ctx.closePath()
  ctx.restore()
}

export const renderIcon = (image: CanvasImageSource, initialAngle: number) => {
  return (ctx: CanvasRenderingContext2D, left: number, top: number, styleOverride: any, fabricObject: any) => {
    const size = 30
    ctx.save()
    ctx.translate(left, top)
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle + initialAngle))
    ctx.drawImage(image, -size / 2, -size / 2, size, size)
    ctx.restore()
  }
}

