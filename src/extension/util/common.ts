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