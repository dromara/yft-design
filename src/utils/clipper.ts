import { util, Path, Object as FabricObject } from 'fabric'
import { PathPoint } from '@/types/common'
import Raphael from 'raphael'

export function clipperPath(fabricObjects: FabricObject[]) {
  var subjPaths = [
    [{ X: 10, Y: 10 }, { X: 110, Y: 10 }, { X: 110, Y: 110 }, { X: 10, Y: 110 }],
    [{ X: 20, Y: 20 }, { X: 20, Y: 100 }, { X: 100, Y: 100 }, { X: 100, Y: 20 }]
  ];
  var clip_paths = [
    [{ X: 50, Y: 50 }, { X: 150, Y: 50 }, { X: 150, Y: 150 }, { X: 50, Y: 150 }],
    [{ X: 60, Y: 60 }, { X: 60, Y: 140 }, { X: 140, Y: 140 }, { X: 140, Y: 60 }]
  ];
  const pathElement = fabricObjects[0] as Path
  console.log('fabricObject[0].path:', pathElement.path)
  const subPaths = getPathPoints(pathElement.path)
  // Raphael.getPointAtLength(pathElement.path, 10)
  var scale = 100;
  const ClipperLib = window.ClipperLib
  ClipperLib.JS.ScaleUpPaths(subjPaths, scale);
  ClipperLib.JS.ScaleUpPaths(clip_paths, scale);
  var cpr = new ClipperLib.Clipper();
  cpr.AddPaths(subjPaths, ClipperLib.PolyType.ptSubject, true);
  cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
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

const getPathPoints = (elementPath: util.TSimplePathData) => {
  let clipperPaths: any[] = []
  let pathPoints: PathPoint[] = []
  elementPath.forEach(item => {
    const command = item[0]
    if (command === 'M' || command === 'L' || command === 'Q') {
      pathPoints.push({ X: item[1], Y: item[2] })
    }
    else if (command === 'Z') {
      if (pathPoints.length > 0) {
        clipperPaths.push(pathPoints)
      }
      pathPoints = []
    }
  })
  return clipperPaths
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