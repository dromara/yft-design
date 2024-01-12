import { Path, Object as FabricObject } from 'fabric'
import ClipperLib from 'clipper-lib'
import Raphael from 'raphael'

export function clipperPath(fabricObjects: FabricObject[], type: number) {
  // 0: 并集 1：减去顶层  2：交集  3：排除重叠
  changePathPosition(fabricObjects, 'center')
  const subjPath = fabricObjects[0] as Path
  const clipPath = fabricObjects[1] as Path
  
  const x = clipPath.left - subjPath.left, y = clipPath.top - subjPath.top
  const pathOffsetX = clipPath.pathOffset.x - subjPath.pathOffset.x
  const pathOffsetY = clipPath.pathOffset.y - subjPath.pathOffset.y
  const subjPathPoints = getPathPoints(subjPath, subjPath.scaleX, subjPath.scaleY)
  const clipPathPoints = getPathPoints(clipPath, clipPath.scaleX, clipPath.scaleY, -pathOffsetX+x, -pathOffsetY+y)
  const scale = 100;
  ClipperLib.JS.ScaleUpPaths(subjPathPoints, scale);
  ClipperLib.JS.ScaleUpPaths(clipPathPoints, scale);
  const cpr = new ClipperLib.Clipper();
  cpr.AddPaths(subjPathPoints, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPaths(clipPathPoints, ClipperLib.PolyType.ptClip, true);
  const subjFillType = ClipperLib.PolyFillType.pftNonZero;
  const clipFillType = ClipperLib.PolyFillType.pftNonZero;
  // var clipTypes = [ClipperLib.ClipType.ctUnion, ClipperLib.ClipType.ctDifference, ClipperLib.ClipType.ctXor, ClipperLib.ClipType.ctIntersection];
  // var clipTypesTexts = "Union, Difference, Xor, Intersection";
  // var solution_paths, svg, cont = document.getElementById('svgcontainer');
  // var i;
  const clipTypes = [ClipperLib.ClipType.ctUnion, ClipperLib.ClipType.ctDifference, ClipperLib.ClipType.ctIntersection, ClipperLib.ClipType.ctXor];
  let solutionPaths = new ClipperLib.Paths() as ArrayLike<any>;
  cpr.Execute(clipTypes[type], solutionPaths, subjFillType, clipFillType);
  // for (i = 0; i < clipTypes.length; i++) {
  //   solution_paths = new ClipperLib.Paths();
  //   cpr.Execute(clipTypes[i], solution_paths, subject_fillType, clip_fillType);
  //   console.log(JSON.stringify(solution_paths));
  //   svg = '<svg style="margin-top:10px; margin-right:10px;margin-bottom:10px;background-color:#dddddd" width="160" height="160">';
  //   svg += '<path stroke="black" fill="yellow" stroke-width="2" d="' + paths2string(solution_paths, scale) + '"/>';
  //   svg += '</svg>';
  //   console.log('svg:', svg)
  // }

  // cont.innerHTML += "<br>" + clipTypesTexts;
  // console.log('solution_paths:', solutionPaths)
  changePathPosition(fabricObjects, 'left')
  return path2str(solutionPaths, scale)
}


const getPathPoints = (item: Path, scaleX: number, scaleY: number, x = 0, y = 0) : ArrayLike<any> => {
  const itemPath = item.path.toString().replaceAll(',', ' ').split('Z')
  let pathPoints: any = []
  for (let i = 0; i < itemPath.length; i++) {
    let pathPoint: {X: number, Y: number}[] = []
    const item = itemPath[i]
    if (!item) continue
    for (let c = 0; c < Raphael.getTotalLength(item.trim() + ' Z'); c += 1) {
      let point = Raphael.getPointAtLength(item.trim() + ' Z', c)
      pathPoint.push({X: point.x * scaleX + x, Y: point.y * scaleY + y})
    }
    pathPoints.push(pathPoint)
  }
  return pathPoints
}

// Converts Paths to SVG path string
// and scales down the coordinates
const path2str = (paths: any, scale: any) => {
  var svgpath = "", i, j;
  if (!scale) scale = 1;
  for (i = 0; i < paths.length; i++) {
    for (j = 0; j < paths[i].length; j++) {
      if (!j) svgpath += "M";
      else svgpath += "L";
      svgpath += (paths[i][j].X / scale) + ", " + (paths[i][j].Y / scale);
    }
    svgpath += "Z";
  }
  if (svgpath == "") svgpath = "M0,0";
  return svgpath;
}

const changePathPosition = (fabricObjects: FabricObject[], position: string) => {
  fabricObjects.forEach(item => {
    const left = position === 'center' ? item.left + item.width / 2 : item.left - item.width / 2
    const top = position === 'center' ? item.top + item.height / 2 : item.top - item.height / 2
    item.set({
      originX: position,
      originY: position,
      left,
      top,
    })
  })
}