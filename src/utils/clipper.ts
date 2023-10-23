import { Path, Object as FabricObject, Group } from 'fabric'
import ClipperLib from 'clipper-lib'
import Raphael from 'raphael'

export function clipperPath(fabricObjects: FabricObject[]) {
  const subjPath = fabricObjects[0] as Path
  const clipPath = fabricObjects[1] as Path
  
  const x = clipPath.left - subjPath.left, y = clipPath.top - subjPath.top
  console.log('x:', x, 'y:', y, 'clipPath:', clipPath, 'subjPath:', subjPath)
  const subjPathPoints = getPathPoints(subjPath)
  const clipPathPoints = getPathPoints(clipPath, x, y)
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
  let solutionPaths = new ClipperLib.Paths() as ArrayLike<any>;
  cpr.Execute(ClipperLib.ClipType.ctXor, solutionPaths, subjFillType, clipFillType);
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
  return path2str(solutionPaths, scale)
}


const getPathPoints = (item: Path, x = 0, y = 0) : ArrayLike<any> => {
  const itemPath = item.path.toString().replaceAll(',', ' ').split('Z')
  let pathPoints: any = []
  for (let i = 0; i < itemPath.length; i++) {
    let pathPoint: {X: number, Y: number}[] = []
    const item = itemPath[i]
    if (!item) continue
    for (let c = 0; c < Raphael.getTotalLength(item.trim() + ' Z'); c += 1) {
      let point = Raphael.getPointAtLength(item.trim() + ' Z', c)
      pathPoint.push({X: point.x + x, Y: point.y + y})
    }
    pathPoints.push(pathPoint)
  }
  return pathPoints
}

// Converts Paths to SVG path string
// and scales down the coordinates
function path2str(paths: any, scale: any) {
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