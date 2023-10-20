import { Path, Object as FabricObject, Group } from 'fabric'
import Raphael from 'raphael'

export function clipperPath(fabricObjects: FabricObject[]) {
  // var subjPaths = [
  //   [{ X: 10, Y: 10 }, { X: 110, Y: 10 }, { X: 110, Y: 110 }, { X: 10, Y: 110 }],
  //   [{ X: 20, Y: 20 }, { X: 20, Y: 100 }, { X: 100, Y: 100 }, { X: 100, Y: 20 }]
  // ];
  // var clip_paths = [
  //   [{ X: 50, Y: 50 }, { X: 150, Y: 50 }, { X: 150, Y: 150 }, { X: 50, Y: 150 }],
  //   [{ X: 60, Y: 60 }, { X: 60, Y: 140 }, { X: 140, Y: 140 }, { X: 140, Y: 60 }]
  // ];
  const itemPath = fabricObjects[0] as Path | Group
  const clipPath = fabricObjects[1] as Path
  const x = clipPath.left > itemPath.left ? clipPath.left - itemPath.left : itemPath.left - clipPath.left
  const y = clipPath.top > itemPath.top ? clipPath.top - itemPath.top : itemPath.top - clipPath.top
  const itemPathPoints = getItemPoints(itemPath)
  const clipPathPoints = getItemPoints(clipPath, x, y)
  console.log('itemPathPoints:', itemPathPoints)
  console.log('clipPathPoints:', clipPathPoints)
  var scale = 100;
  const ClipperLib = window.ClipperLib
  ClipperLib.JS.ScaleUpPaths(itemPathPoints, scale);
  ClipperLib.JS.ScaleUpPaths(clipPathPoints, scale);
  var cpr = new ClipperLib.Clipper();
  cpr.AddPaths(itemPathPoints, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPaths(clipPathPoints, ClipperLib.PolyType.ptClip, true);
  var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
  var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
  // var clipTypes = [ClipperLib.ClipType.ctUnion, ClipperLib.ClipType.ctDifference, ClipperLib.ClipType.ctXor, ClipperLib.ClipType.ctIntersection];
  // var clipTypesTexts = "Union, Difference, Xor, Intersection";
  // var solution_paths, svg, cont = document.getElementById('svgcontainer');
  // var i;
  let solution_paths = new ClipperLib.Paths();
  cpr.Execute(ClipperLib.ClipType.ctXor, solution_paths, subject_fillType, clip_fillType);
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
  console.log('solution_paths:', solution_paths)
  return path2str(solution_paths, scale)
}

const getItemPoints = (item: FabricObject, x = 0, y = 0) => {
  if (item.isType('Path')) {
    return getPathPoints(item as Path, x, y)
  }
  else if (item.isType('Group')) {
    let groupPoints: any[] = []
    (item as Group)._objects.forEach(ele => {
      groupPoints.push(getPathPoints(ele as Path, x, y)[0])
    })
    return groupPoints
  }
}

const getPathPoints = (item: Path, x = 0, y = 0) => {
  const itemPath = item.path.toString().replaceAll(',', ' ')
  let pathPoints: {X: number, Y: number}[] = []
  for (var c = 0; c < Raphael.getTotalLength(itemPath); c += 1) {
    var point = Raphael.getPointAtLength(itemPath, c);
    pathPoints.push({X: point.x + x, Y: point.y + y})
  }
  
  return [pathPoints]
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