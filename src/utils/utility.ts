export function containsPoint(pointer:{x:number; y:number}, points:Array<{x:number; y:number}>) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;
    const intersect = ((yi > pointer.y) !== (yj > pointer.y)) && (pointer.x < (xj - xi) * (pointer.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}